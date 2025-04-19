"use strict";

import { serveFile, serveDir } from "jsr:@std/http/file-server";

// Sends a message as { event: event, data: data } to `socket` (i.e. a connection)
function send(socket, event, data) {
  socket.send(JSON.stringify({ event, data }));
}

function broadcastToTeam(teamID, event, data) {
    for (const team of STATE.teams) {
      if (team.id === teamID) {
        for (const player of room.players) {
          send(player.connection, event, data);
        }
      }
    }
}

function generateClientID() {
  let d = new Date().getTime();
	
	if( globalThis.performance && typeof globalThis.performance.now === "function" )
	{
		d += performance.now();
	}
	
	const uuid = 'xxxxxxxx-xxxx-8xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c)
	{
		const r = (d + Math.random()*16)%16 | 0;
		d = Math.floor(d/16);
		return (c=='x' ? r : (r&0x3|0x8)).toString(16);
	});

  return uuid;
}

function generateTeamID() {
    const allowedChars = "1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const strLen = 6;
    let roomID = "";
  
    for (let i = 0; i < strLen; i++) {
      roomID += allowedChars[Math.floor(Math.random() * allowedChars.length)];
    }
  
    if (!/\d/.test(roomID)) {
        return generateRoomID();
    }
  
    return roomID;
  }

async function generateToken(data) {
    const encoder = new TextEncoder();
    const hashBuffer = await crypto.subtle.digest('SHA-1', encoder.encode(`${data.name}${data.password}`));

    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
    
    return hashHex;
}

function handleHTTPRequest(rqst) {
    try {
        const pathname = new URL(rqst.url).pathname;
        console.log(pathname);
        
    
        if (pathname.startsWith("/media")) {
            return serveDir(rqst, { fsRoot: "media", urlRoot: "media" });
        } else if (pathname.startsWith("/start")) {
            return serveDir(rqst, { fsRoot: "start", urlRoot: "start" });
        } else if (pathname.startsWith("/app")) {
            return serveDir(rqst, { fsRoot: "app", urlRoot: "app"});
        } else if (pathname.startsWith("/public")) {
            return serveDir(rqst, { fsRoot: "public", urlRoot: "public"});
        } else if (pathname === "/debug") {
            return new Response();
        } else if (pathname.startsWith('/utils')) {
            return serveDir(rqst, { fsRoot: 'utils', urlRoot: 'utils'});
        } else if (pathname === '/index.js') {
            return serveFile(rqst, "./index.js");
        } else {
            return serveFile(rqst, "./index.html"); 
        }


    } catch (error) {
        console.error("Error handling request:", error);
        return new Response("Internal Server Error", { status: 500 });
    }
}

async function handleRegister (data) {
    const usersJSON = await Deno.readTextFile("api/users.json");
    const users = JSON.parse(usersJSON);

    let clientID = data.clientID;
    let name = data.name;
    let password = data.password;
    let id;

    for (let user of users) {
        if (id < user.id) {
            id = user.id;
        }
    }

    const user = {
        id: id,
        name: name,
        password: password,
        teams: []
    };

    users.push(user);

    const updatedUsers = await Deno.writeTextFile('api/users.json', JSON.stringify(users, null, 2));

    return user;
}

async function handleLogIn(data) {
    const usersJSON = await Deno.readTextFile('api/users.json');
    const users = JSON.parse(usersJSON);
    
    let token;

    for (let user of users) {
        if (user.name === data.name && user.password === data.password) {
            token = await generateToken(data);
        } 
    }

    return token;
}

async function getUserFromToken(clientToken) {
    const usersJSON = await Deno.readTextFile('api/users.json');
    const users = JSON.parse(usersJSON);
    
    let token;
    let userFromToken;

    for (let user of users) {
        
        token = await generateToken(user);
        
        if (token === clientToken) {
            userFromToken = user;   
        }
    }

    return userFromToken;
}

async function handleCreateTeam(data) {
    const teamCreator = await getUserFromToken(data.token);
    const teamsJSON = await Deno.readTextFile('api/teams.json');
    const teams = JSON.parse(teamsJSON);

    let id = generateTeamID();

    const createdTeam = {
        id: id,
        teamName: data.teamName,
        creator: teamCreator.id,
        players: []
    };

    console.log(createdTeam);
    

    teams.push(createdTeam);
    const updatedTeams = await Deno.writeTextFile('api/teams.json', JSON.stringify(teams, null, 2));

    return createdTeam;
}

async function handleJoinTeam(data) {
    const token = data.token;
    const teamCode = data.code; 
    const user = await getUserFromToken(token);

    const teamsJSON = await Deno.readTextFile('api/teams.json');
    const teams = JSON.parse(teamsJSON);
    let joinedTeam;

    for (let team of teams) {
        if (team.id === teamCode) {
            team.players.push(user.id);
            joinedTeam = team;
        }

    }

    const updatedTeams = await Deno.writeTextFile('api/teams.json', JSON.stringify(teams, null, 2));

    return joinedTeam;
}

async function getTeamsFromUser(user) {
    const teamsArr = user.teams;
    const userTeams = [];
    
    const teamsJSON = await Deno.readTextFile('api/teams.json');
    const teams = JSON.parse(teamsJSON);

    for (let team of teamsArr) {
        for (let t of teams) {
            if (team === t.id) {
                userTeams.push(t);
            }
        }
    }

    return userTeams;
}

const STATE = {
    "clients": [],
    "clientID": null,
    /* ändra om det behövs */
};

/*                                      SERVER                                                 */
Deno.serve( {
    port: 8888,
    handler: (rqst) => {
  
        if (rqst.headers.get("upgrade") != "websocket"){
        return handleHTTPRequest(rqst);
        }

        const { socket, response } = Deno.upgradeWebSocket(rqst);
        
        socket.addEventListener("open", async () => {
            STATE.clientID = generateClientID();
            
            STATE.clients.push({
                "id": STATE.clientID,
                "connection": socket
            });
        });

        socket.addEventListener("message", async (event) => {
            const msg = JSON.parse(event.data);
            console.log("[SERVER]: Message :: ", msg);

            switch (msg.event) {
                /* Gör om till funktioner som bara anropas här? */
                case "register": {
                    const data = msg.data;
                    const user = handleRegister(data);
                    const token = generateToken(data);

                    send(socket, 'register', token);
                    break;
                }

                case 'logIn': {
                    const data = msg.data;
                    const token = await handleLogIn(data);
                    
                    send(socket, 'logIn', token);
                    break;
                }

                case 'loadTeams': {
                    const data = msg.data;
                    const token = data.token;

                    const user = await getUserFromToken(token);
                    const userTeams = await getTeamsFromUser(user);
                    
                    send(socket, 'loadTeams', {teams: userTeams});
                    break;
                }

                case 'createTeam': {
                    const data = msg.data;
                    const team = await handleCreateTeam(data);

                    send(socket, 'createTeam', {team: team});
                    break;
                }

                case 'joinTeam': {
                    const data = msg.data;
                    const team = handleJoinTeam(data);

                    send(socket, 'joinTeam', {team: team});
                }

                default: {
                    console.warn('No event was specified!');
                    
                }
            }
        });

        socket.addEventListener("close", (event) => {
            console.log(`[SERVER]: Disconnect :: Goodbye ${STATE.clientID}`);
        });

        socket.addEventListener("error", (error) => {
            console.log(`[SERVER]: Error ${error}`);
        });

        return response;
    }
});