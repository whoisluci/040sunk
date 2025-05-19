import { STATE } from "../../index.js";
import { PubSub } from "../../utils/pubSub.js";

PubSub.subscribe({
    event: 'renderRegister',
    listener: renderRegister
});

function renderRegister(parentID) {
    document.querySelector(parentID).innerHTML = ``;
    
    /* const header = renderHeader(parentID);
    document.querySelector(parentID).appendChild(header); */

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

    const registerText = document.createElement('h3');
    registerText.id = 'registerTxt';
    document.querySelector(parentID).append(registerText);
    registerText.textContent = 'Registrera dig';

    const inputDiv = document.createElement('div');
    document.querySelector(parentID).appendChild(inputDiv);
    inputDiv.id = 'inputDiv';

    inputDiv.innerHTML = `
        <input type='text' name='username' id='username' placeholder='Användarnamn'/>
        <img id='userIcon' class='inputIcon' src=../assets/icons/user.svg>
        <input type='password' name='lösenord' id='password' placeholder='Lösenord'/>
        <img id='lockIcon' class='inputIcon' src=../assets/icons/lock.svg>
        <input type='password' name='confLösenord' id='confPassword' placeholder='Bekräfta lösenord'/>
    `;

    const button = document.createElement('button');
    document.querySelector(parentID).appendChild(button);
    button.id = 'registerBttn';
    button.innerText = 'Registrera dig';

    button.addEventListener('click', () => {
        let name = document.querySelector('#username').value;
        let password = document.querySelector('#password').value;
        let confPassword = document.querySelector('#confPassword').value;

        console.log(password, confPassword)

        if (password === confPassword) {
            const data = {
                event: 'register',
                data: {
                    clientID: STATE.clientID,
                    name: name,
                    password: password
                }
            };

            STATE.socket.send(JSON.stringify(data));
            
        } else {
            window.alert('Lösenorden matchar inte. Testa igen.');
        }
    });
}