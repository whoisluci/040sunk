import { PubSub } from "./utils/pubSub.js";
import { renderLandingPage } from "./start/start.js";
import { renderTeamsPage } from "./app/teams.js";
import { renderUserTeams } from './app/teams.js';

export const STATE = {
    'client': null,
    'socket': null,
    'team': null,
    'teamID': null
};

export const token = localStorage.getItem("token");


globalThis.addEventListener("load", async () => {
    STATE.socket = new WebSocket("ws://localhost:8888");

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
            renderLandingPage("#wrapper");
        }
    });

    STATE.socket.addEventListener("message", (event) => {
        const msg = JSON.parse(event.data);

        switch (msg.event) {
            case 'register': {
                const token = msg.data.token;
            
                if (token !== null && token !== '' && token !== undefined) {
                    localStorage.setItem('token', token);

                    PubSub.publish({
                        event: 'renderTeamsPage',
                        detail: '#wrapper'
                    });
                }
            }
            case 'logIn': {
                const token = msg.data;

                if (token !== null && token !== '' && token !== undefined) { 
                    localStorage.setItem('token', token);

                    PubSub.publish({
                        event: 'renderTeamsPage',
                        detail: '#wrapper'
                    });
                }
            }
            case 'loadTeams': {
                const teams = msg.data.teams;

                PubSub.publish({
                    event: 'renderUserTeams',
                    detail: teams
                });
            }
            case 'createTeam': {
                const data = msg.data;
                STATE.team = data;

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
        }
    });
});
