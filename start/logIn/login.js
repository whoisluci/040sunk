import { STATE } from "../../index.js";
import { PubSub } from "../../utils/pubSub.js";

PubSub.subscribe({
    event: 'renderLogIn',
    listener: renderLogIn
});

export function renderLogIn (parentID) {
    document.querySelector(parentID).innerHTML = ``;
    /* const header = rendera header
    document.querySelector(parentID).appendChild(header); */

    const title = document.createElement('h1');
    document.querySelector(parentID).appendChild(title);
    title.innerText = 'Logga in';
    title.id = 'title';

    const inputDiv = document.createElement('div');
    document.querySelector(parentID).appendChild(inputDiv);
    inputDiv.id = 'inputDiv';

    inputDiv.innerHTML = `
        <label for='username'>Användarnamn</label>
        <input type='text' name='username' id='username'/>
        <label for='lösenord'>Lösenord</label>
        <input type='password' name='lösenord' id='password'/>
    `;

    const button = document.createElement('button');
    document.querySelector(parentID).appendChild(button);
    button.id = 'logInBttn';
    button.innerText = 'Logga in';

    button.addEventListener('click', () => {
        const name = document.querySelector('#username').value;
        const password = document.querySelector('#password').value;

        const data = {
            event: 'logIn',
            data: {
                name: name,
                password: password
            }
        };

        STATE.socket.send(JSON.stringify(data));
    });
}