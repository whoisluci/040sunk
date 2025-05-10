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

function broadcastToOthers(teamID, event, data) {
    for (const team of STATE.teams) {
      if (team.id === teamID) {
        for (const player of team.players) {
          if (player.id === STATE.clientID) {
            continue;
          }
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
        return generateTeamID();
    }
  
    return roomID;
}

async function generateToken(data) {
    const encoder = new TextEncoder();
    const hashBuffer = await crypto.subtle.digest('SHA-1', encoder.encode(`${data.username}${data.password}`));

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
    // const usersJSON = await Deno.readTextFile("api/users.json");
    // const users = JSON.parse(usersJSON);

    const kv = await Deno.openKv();
    const usersKv = await kv.get(['users']);
    const users = usersKv.value || [];

    let clientID = data.clientID;
    let name = data.name;
    let password = data.password;
    let currentID = users.length + 1;
   
    const user = {
        id: currentID,
        username: name,
        password: password,
        teams: []
    };

    users.push(user);
    const updatedUsers = await kv.set(['users'], users);

    // const updatedUsers = await Deno.writeTextFile('api/users.json', JSON.stringify(users, null, 2));

    return user;
}

async function handleLogIn(data) {
    // const usersJSON = await Deno.readTextFile('api/users.json');
    // const users = JSON.parse(usersJSON);

    const kv = await Deno.openKv();
    const usersKv = await kv.get(['users']);
    if (!usersKv.value) {
        return { success: false, message: 'No users found!'};
    }

    const users = usersKv.value;
    
    let token;

    for (let user of users) {        
        if (user.username === data.name && user.password === data.password) {
            console.log('hej?');
            
            token = await generateToken(data);
            console.log(token);
            
        } 
    }

    return token;
}

async function getUserFromToken(clientToken) {
    // const usersJSON = await Deno.readTextFile('api/users.json');
    // const users = JSON.parse(usersJSON);

    const kv = await Deno.openKv();
    const usersKv = await kv.get(['users']);
    const users = usersKv.value;
    
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
    const kv = await Deno.openKv();
    // const teamsJSON = await Deno.readTextFile('api/teams.json');
    // const teams = JSON.parse(teamsJSON);

    const teamsKv = await kv.get(['teams']);
    const teams = teamsKv.value || [];

    // const fileData = new Uint8Array(data.teamImg.fileData);
    // const fileType = data.teamImg.fileType;
    // let ext = fileType.split('/')[1];

    console.log(`Team created: ${data.teamName}`);
    // console.log(`Image recieved: ${data.teamImg.fileName} (${data.teamImg.fileData})`);
    
    // await Deno.mkdir('./media/teamPics', {recursive: true});
    // await Deno.writeFile(`./media/teamPics/${data.teamName}.${ext}`, fileData);

    let id = generateTeamID();

    console.log(teamCreator);

    const createdTeam = {
        id: id,
        teamName: data.teamName,
        creator: teamCreator.id,
        players: [teamCreator.id],
    };

    teams.push(createdTeam);
    const updatedTeams = await kv.set(['teams'], teams);

    let creatorClient;

    for (let client of STATE.clients) {
        if (client.id === STATE.clientID)
            creatorClient = client;
    }

    console.log(stateTeam);
    

    const stateTeam = {
        id: id,
        teamName: data.teamName,
        creator: creatorClient,
        players: [creatorClient],
        gameStarted: false
    };

    STATE.teams.push(createdTeam);

    return createdTeam;
}

async function handleJoinTeam(data) {
    const token = data.token;
    const teamCode = data.code; 
    const user = await getUserFromToken(token);

    // const teamsJSON = await Deno.readTextFile('api/teams.json');
    // const teams = JSON.parse(teamsJSON);

    const kv = await Deno.openKv();
    const teamsKv = await kv.get(['teams']);
    let teams = teamsKv.value || [];

    let joinedTeam;

    for (let team of teams) {
        if (team.id === teamCode) {
            team.players.push(user.id);
            joinedTeam = team;
            break;
        }

    }

    if (!joinedTeam) {
        return {error: 'Team not found'};
    }

    const updatedTeams = await kv.set(['teams'], teams);

    let userClient;

    for (let client of STATE.clients) {
        if (client.id === STATE.clientID) {
            userClient = client;
        }
    }

    for (let team of STATE.teams) {
        if (team.id === teamCode) {
            team.players.push(userClient);
            break;
        }
    }

    return joinedTeam;
}

async function getTeamsFromUser(user) {
    const kv = Deno.openKv();

    if (user['teams'].length === 0) {
        return user['teams'];
    }
    const teamsArr = await user['teams'];
    let userTeams = [];
    
    // const teamsJSON = await Deno.readTextFile('api/teams.json');
    // const teams = JSON.parse(teamsJSON);

    const teamsKv = await kv.get(['teams']);
    if (teamsKv) {
        return [];
    }

    const teams = teamsKv.value;


    for (let id of teamsArr) {
        const team = teams.find((t) => t.id === id);
        if (team) {
            userTeams.push(team);
        }
    }

    return userTeams;
}

async function handleStartGame (teamID) {
    const charactersJSON = await Deno.readTextFile('./api/characters.json');
    const charactersDB = await JSON.parse(charactersJSON);

    const challengesJSON = await Deno.readTextFile('./api/challenges.json');
    const challengesDB = await JSON.parse(challengesJSON);

    const barsJSON = await Deno.readTextFile('./api/bars.json');
    const barsDB = await JSON.parse(barsJSON);

    for (let team of STATE.teams) {
        if (team.id === teamID) {
            team.gameStarted = true;

            return { team: team, characters: charactersDB, challenges: challengesDB, bars: barsDB };
        }
    }
}

const STATE = {
    'clients': [],
    'clientID': null,
    'teams': [],
    'team': null
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

            send(socket, 'connect', {clientID: STATE.clientID});
            console.log("hallå??");
            
        });

        socket.addEventListener("message", async (event) => {
            const msg = JSON.parse(event.data);
            console.log("[SERVER]: Message :: ", msg);

            switch (msg.event) {
                case "ping": {
                    console.log('[SERVER]: Recieved ping, sending pong...');
                    send(socket, 'pong', {});
                    break;
                }

                case "register": {
                    const data = msg.data;
                    const user = await handleRegister(data);
                    const token = await generateToken(user);

                    send(socket, 'register', {token: token, user: user});
                    break;
                }

                case 'logIn': {
                    const data = msg.data;
                    const token = await handleLogIn(data);
                    const user = await getUserFromToken(token);
                    
                    send(socket, 'logIn', {token: token, user: user});
                    break;
                }

                case 'loadTeams': {
                    const data = msg.data;
                    const token = data.token;
                    
                    const user = await getUserFromToken(token);
                    const userTeams = await getTeamsFromUser(user);


                    if (userTeams.length === 0) {
                        send(socket, 'loadTeams', {teams: 'Användaren har inga lag'});
                    }
                    
                    send(socket, 'loadTeams', {teams: userTeams});
                    break;
                }

                case 'createTeam': {
                    const data = msg.data;
                    console.log(data, "?");
                    
                    const team = await handleCreateTeam(data);
                    console.log(team);
                    
                    STATE.teams.push(team);

                    send(socket, 'createTeam', {team: team});
                    break;
                }

                case 'joinTeam': {
                    const data = msg.data;
                    const team = handleJoinTeam(data);

                    send(socket, 'joinTeam', {team: team});
                    broadcastToTeam(data.code, 'joinTeam', {newPlayer: STATE.clients.id[`${STATE.clientID}`]} );
                }

                case 'startGame': {
                    const teamID = msg.data.teamID;
                    const data = handleStartGame(teamID);

                    broadcastToTeam(teamID, 'startGame', data);
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