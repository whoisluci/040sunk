import { PubSub } from "../utils/pubSub.js";
import { STATE } from "../index.js";

PubSub.subscribe({
    event: 'joinTeam',
    listener: renderJoin
});

export function renderJoin (parentID) {
    document.querySelector(parentID).innerHTML = ``;

    const header = PubSub.publish({
        event: 'renderHeader',
        detail: '#wrapper'
    });

    const text = document.createElement('h2');
    text.id = 'headline';
    document.querySelector(parentID).append(text);
    text.innerText = 'Gå med lag';

    const input = document.createElement('input');
    input.id = 'codeInput';
    document.querySelector(parentID).append(input);
    input.placeholder = 'KOD';

    const joinBttn = document.createElement('button');
    joinBttn.id = 'joinTeam';
    document.querySelector(parentID).append(joinBttn);
    joinBttn.innerText = 'Gå med';

    joinBttn.addEventListener('click', () => {
        /* PubSub? */

        let code = document.querySelector('#codeInput').value;

        const data = {
            event: 'joinTeam',
            data: {
                token: sessionStorage.getItem('token'), 
                code: code
            }
        };

        STATE.socket.send(JSON.stringify(data));
    });
}