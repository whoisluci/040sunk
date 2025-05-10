import { PubSub } from "./utils/pubSub.js";
import * as renderLandingPage from "./start/start.js";
import { renderTeamsPage } from "./app/teams.js";
import { renderUserTeams } from './app/teams.js';
import * as renderWaitingRoom from "./app/waitingRoom.js";

export const STATE = {
    'client': null,
    'clientID': null,
    'socket': null,
    'user': null,
    'team': null,
    'teamID': null
};

export const token = localStorage.getItem("token");


globalThis.addEventListener("load", async () => {
    STATE.socket = new WebSocket("wss://040sunk.deno.dev/");

    STATE.socket.addEventListener("open", (event) => {
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
                event: 'renderTeamsPage',
                detail: '#wrapper'
            });
        } else {
            PubSub.publish({
                event: 'renderLandingPage',
                detail: '#wrapper'
            });
        }
    });

    STATE.socket.addEventListener("message", (event) => {
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
                        event: 'renderTeamsPage',
                        detail: '#wrapper'
                    });
                }
            }
            case 'logIn': {
                const token = msg.data.token;

                if (token !== null && token !== '' && token !== undefined) { 
                    sessionStorage.setItem('token', token);
                    STATE.user = msg.data.user;

                    PubSub.publish({
                        event: 'renderTeamsPage',
                        detail: '#wrapper'
                    });
                } else {
                    /* Varning */
                }
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

                console.log(`[CLIENT]: Joined room ${STATE.roomID} successfully`);
            }

            case 'startGame': {
                STATE.team = msg.data.team;
                STATE.characters = msg.data.characters;
                STATE.challenges = msg.data.challenges;
                STATE.bars = msg.data.bars;

                console.log(`[CLIENT]: Game has started .`);

                PubSub.publish({
                    event: 'renderCharacters',
                    detail: '#wrapper'
                });
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
