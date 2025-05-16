import { PubSub } from "../utils/pubSub.js";
import { STATE } from "../index.js";
import { token } from "../index.js";

PubSub.subscribe({
    event: 'renderStartGame',
    listener: renderStartGame
});

export function renderStartGame (parentID) {
    document.querySelector(parentID).innerHTML = ``;
    
    const data = {
        event: 'loadGameData',
        data: {
            token: token
        }
    };

    STATE.socket.send(JSON.stringify(data));

    const logotype = document.createElement('img');
    document.querySelector(parentID).append(logotype);
    logotype.id = 'logotype';
    logotype.src = '../../assets/logotype.png';

    const tagline = document.createElement('h4');
    tagline.id = 'tagline';
    document.querySelector(parentID).append(tagline);
    tagline.innerText = `Redo för en sunkpubsrunda?`;

    const information = document.createElement('p');
    information.id = 'info';
    document.querySelector(parentID).append(information);
    information.innerHTML = `Tänk på att dricka med måtta. <br><br> Spela gärna tillsammans med andra. <br><br> I detta spelet kommer du möta Bosse, Kowalski, Sebbe-Sabrina och Sandra som kommer att introducera dig/er för sina stammishak. <br> <br> Vi rekommenderar att ni promenerar, cyklar eller tar ringlinjen. <br>(OBS! Cykla inte ifall du tänker förtära alkohol).`;


    const startBttn = document.createElement('button');
    startBttn.id = 'startBttn';
    document.querySelector(parentID).append(startBttn);
    startBttn.innerText = 'START';

    startBttn.addEventListener('click', () => {
        STATE.socket.send(JSON.stringify(data));

        PubSub.publish({
            event: 'renderChars',
            detail: '#wrapper'
        });
    });
}