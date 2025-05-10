import { STATE } from "../index.js";
import { PubSub } from "../utils/pubSub.js";
import * as renderRegister from './register/register.js';
import * as renderLogIn from './logIn/login.js';

PubSub.subscribe({
    event: 'renderLandingPage',
    listener: renderLandingPage
});

export function renderLandingPage(parentID) {
    const logoDiv = document.createElement('div');
    logoDiv.id = 'logoDiv';
    document.querySelector(parentID).appendChild(logoDiv);

    const logoImg = document.createElement('img');
    logoImg.id = 'logotype';
    logoDiv.appendChild(logoImg);
    /* lägg in source för loggan */

    const tagline = document.createElement('h2');
    tagline.id = 'tagline';
    logoDiv.appendChild(tagline);
    tagline.innerText = 'tagline'; /* lägg in tagline */

    const inputDiv = document.createElement('div');
    document.querySelector(parentID).appendChild(inputDiv);
    inputDiv.id = 'inputDiv';

    inputDiv.innerHTML = `
        <input type='text' name='username' id='username' placeholder='Användarnamn'/>
        <input type='password' name='lösenord' id='password' placeholder='Lösenord'/>
    `;
    
    const logInBttn = document.createElement('button');
    logInBttn.id = 'logInBttn';
    logInBttn.classList.add('button');
    document.querySelector(parentID).append(logInBttn)
    logInBttn.innerText = 'Logga in';

    const registerLine = document.createElement('h5');
    registerLine.id = 'register';
    document.querySelector(parentID).append(registerLine);
    registerLine.innerHTML = `Ny här? <a id='registerBttn'>Registrera dig</a>`;

    logInBttn.addEventListener('click', () => {
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

    const registerBttn = document.querySelector('#registerBttn');
    
    registerBttn.addEventListener('click', () => {
       PubSub.publish({
            event: 'renderRegister',
            detail: '#wrapper'
        });
    });
}