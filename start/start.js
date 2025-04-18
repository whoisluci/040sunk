import { PubSub } from "../utils/pubSub.js";
import * as renderRegister from './register/register.js';
import * as renderLogIn from './logIn/login.js';

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
    tagline.innerText = ''; /* lägg in tagline */

    const bttnDiv = document.createElement('div');
    bttnDiv.id = 'bttnDiv';
    document.querySelector(parentID).appendChild(bttnDiv);

    const registerBttn = document.createElement('button');
    registerBttn.id = 'registerBttn';
    registerBttn.classList.add('button');
    bttnDiv.appendChild(registerBttn);
    registerBttn.innerText = 'Registrera dig';

    const loginBttn = document.createElement('button');
    loginBttn.id = 'loginBttn';
    loginBttn.classList.add('button');
    bttnDiv.appendChild(loginBttn);
    loginBttn.innerText = 'Logga in';

    registerBttn.addEventListener('click', () => {
       PubSub.publish({
            event: 'renderRegister',
            detail: '#wrapper'
        });
    });

    loginBttn.addEventListener('click', () => {
        PubSub.publish({
            event: 'renderLogIn',
            detail: '#wrapper'
        });
    });
}