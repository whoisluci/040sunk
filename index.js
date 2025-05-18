import { PubSub } from "./utils/pubSub.js";
import * as renderLandingPage from "./start/start.js";
import { renderUserTeams } from './app/teams.js';
import * as renderWaitingRoom from "./app/waitingRoom.js";
import * as renderCharacters from './app/characters/characters.js'
import * as renderStartGame from './app/startGame.js';

export const STATE = {
    'client': null,
    'clientID': null,
    'socket': null,
    'user': null,
    'team': null,
    'teamID': null,
    'characters': null,
    'challenges': null,
    'pubs': null
};

export const token = sessionStorage.getItem("token");


globalThis.addEventListener("load", async () => {
    STATE.socket = new WebSocket("wss://sunk040.deno.dev");
console.log(STATE);

    STATE.socket.addEventListener("open", async (event) => {
        STATE.client = event;
        let _pingInterval = null;
        if (!_pingInterval) {
            _pingInterval = setInterval(() => {
                console.log("Sending ping to server...");
                STATE.socket.send(JSON.stringify({event: "ping", data: {}}));  
            }, 60000);
        }
        console.info("[CLIENT]: Connection established!");

        if (token !== null && token !== undefined) {
            PubSub.publish({
                event: 'renderStartGame',
                detail: '#wrapper'
            });
        } else {
            PubSub.publish({
                event: 'renderLandingPage',
                detail: '#wrapper'
            });
        }
    });

    STATE.socket.addEventListener("message", async (event) => {
        const msg = JSON.parse(event.data);

        switch (msg.event) {
            case "connect":
                STATE.clientID = msg.data.clientID;

                console.log(`[CLIENT]: Client ID set successfully ${STATE.clientID}`);
                break;
            case 'register': {
                const token = msg.data.token;
            
                if (token !== null && token !== '' && token !== undefined) {
                    sessionStorage.setItem('token', token);
                    STATE.user = msg.data.user;

                    PubSub.publish({
                        event: 'renderStartGame',
                        detail: '#wrapper'
                    });
                }
                break;
            }
            case 'logIn': {
                const token = msg.data.token;

                if (token !== null && token !== '' && token !== undefined) { 
                    sessionStorage.setItem('token', token);
                    STATE.user = msg.data.user;

                    PubSub.publish({
                        event: 'renderStartGame',
                        detail: '#wrapper'
                    });
                } else {
                    /* Varning */
                }
                break;
            }
            case 'loadTeams': {
                console.log(msg.data);    
                const teams = msg.data.teams;

                if (teams.length > 0) {
                    PubSub.publish({
                        event: 'renderUserTeams',
                        detail: teams
                    });
                }
                break;
            }
            case 'createTeam': {
                const data = msg.data;
                STATE.team = data.team;
                STATE.teamID = data.team.id;

                PubSub.publish({
                    event: 'renderWaitingRoom',
                    detail: '#wrapper'
                });
            }
            case 'joinTeam': {
                STATE.teamID = msg.data.team.id;
                STATE.team = msg.data.team;
                console.log(msg.data);
                
                
                let name;

                for (let player of STATE.team.players) {
                    if (player.client.id === msg.data.newPlayer) {
                        name = player.name; 
                    }
                }
                
                if (STATE.clientID === msg.data.newPlayer) {
                   PubSub.publish({
                    event: 'renderWaitingRoom',
                    detail: '#wrapper'
                   });
                } else {
                    PubSub.publish({
                        event: 'renderUserName',
                        detail: `${name}`
                    });
                }

                console.log(`[CLIENT]: Joined room ${STATE.teamID} successfully`);

                break;
            }

            case 'loadGameData': {
                console.log(msg.data);
                
                STATE.characters = await msg.data.data['characters'];                
                STATE.challenges = await msg.data.data['challenges'];
                STATE.pubs = await msg.data.data['bars'];

                console.log(STATE.characters, STATE.challenges, STATE.pubs);
            
                break;
            }   

            case 'startGame': {
                PubSub.publish({
                    event: 'renderChars',
                    detail: '#wrapper'
                });

                break;
            }
        }
    });
    STATE.socket.addEventListener("close", (event) => {
        console.info("[CLIENT]: Disconnected.", event);
    });

    STATE.socket.addEventListener("error", (error) => {
        console.log(`[CLIENT]: ERROR`, error);
    });
});
