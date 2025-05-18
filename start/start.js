import { STATE } from "../index.js";
import { PubSub } from "../utils/pubSub.js";
import * as renderRegister from './register/register.js';

PubSub.subscribe({
    event: 'renderLandingPage',
    listener: renderLandingPage
});

export function renderLandingPage(parentID) {
    const background = document.createElement('img');
    document.querySelector(parentID).append(background);
    background.id = 'backgroundImg';
    background.src = '../assets/bgMap.png';

    const logotypeDiv = document.createElement('div');
    document.querySelector(parentID).append(logotypeDiv);
    logotypeDiv.id = 'logotypeDiv';

    const beer = document.createElement('img');
    beer.id = 'beer';
    logotypeDiv.append(beer);
    beer.src = '../../assets/beer.png';

    const logo = document.createElement('img');
    logo.id = 'logotypeText';
    logotypeDiv.append(logo);
    logo.src = '../../assets/logotype.png';

    const tagline = document.createElement('h2');
    tagline.id = 'tagline';
    document.querySelector(parentID).appendChild(tagline);
    tagline.innerText = 'tagline'; /* lägg in tagline */

    const logInText = document.createElement('h3');
    logInText.id = 'logInText';
    document.querySelector(parentID).append(logInText);
    logInText.textContent = 'Logga in';

    const inputDiv = document.createElement('div');
    document.querySelector(parentID).appendChild(inputDiv);
    inputDiv.id = 'inputDiv';

    inputDiv.innerHTML = `
        <input type='text' name='username' id='username' placeholder='Användarnamn'/>
        <img id='userIcon' class='inputIcon' src='../assets/icons/user.svg'>
        <input type='password' name='lösenord' id='password' placeholder='Lösenord'/>
        <img id='lockIcon' class='inputIcon' src='../assets/icons/lock.svg'>
    `;
    
    const logInBttn = document.createElement('button');
    logInBttn.id = 'logInBttn';
    logInBttn.classList.add('button');
    document.querySelector(parentID).append(logInBttn)
    logInBttn.innerText = 'Logga in';

    const line = document.createElement('hr');
    line.id = 'line';
    document.querySelector(parentID).append(line);

    const registerLine = document.createElement('h5');
    registerLine.id = 'register';
    document.querySelector(parentID).append(registerLine);
    registerLine.innerHTML = `Ny här? <a id='registerLink'>Registrera dig</a>`;

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

    const registerBttn = document.querySelector('#registerLink');
    
    registerBttn.addEventListener('click', () => {
       PubSub.publish({
            event: 'renderRegister',
            detail: '#wrapper'
        });
    });
}