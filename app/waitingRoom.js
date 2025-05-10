import { PubSub } from "../utils/pubSub.js";
import { STATE } from "../index.js";
import * as renderHeader from "./global/header.js";

PubSub.subscribe({
    event: 'renderWaitingRoom',
    listener: renderWaitingRoom
});

function renderWaitingRoom(parentID) {
    document.querySelector(parentID).innerHTML = ``;
    const header = PubSub.publish({
        event: 'renderHeader',
        detail: '#wrapper'
    });

    const codeDiv = document.createElement('div');
    codeDiv.id = 'codeDiv';
    document.querySelector(parentID).append(codeDiv);

    const code = document.createElement('p');
    code.id = 'code';
    codeDiv.append(code);
    code.innerText = `#${STATE.team.id}`;
    
    const headline = document.createElement('h3');
    headline.id = 'headline';
    headline.innerText = 'Väntar...'
    document.querySelector(parentID).append(headline);

    const playersDiv = document.createElement('div');
    playersDiv.id = 'playersDiv';
    document.querySelector(parentID).append(playersDiv);

    /* loopa igenom alla spelare och rendera namn */
    for (let player of STATE.team.players ) {
        const name = renderPlayerName(player.name);
    }

    const startBttn = document.createElement('button');
    startBttn.id = 'startBttn';
    startBttn.innerText = 'START';
    document.querySelector(parentID).append(startBttn);

    console.log(STATE);
    

    if (STATE.team.creator !== STATE.clientID) {
        startBttn.disabled = true;
    }

    startBttn.addEventListener('click', () => {
        const data = {
            event: 'startGame',
            data: {
                clientID: STATE.clientID,
                teamID: STATE.teamID
            }
        };

        STATE.socket.send(JSON.stringify(data));
    });
}

export function renderPlayerName (name) {
    const playersDiv = document.querySelector('#playersDiv');
    const playerName = document.createElement('h4');
    playerName.id = name;
    playerName.textContent = name;
    playersDiv.append(playerName);
}