import { PubSub } from "../../utils/pubSub.js";
import { STATE } from "../../index.js";
import { token } from "../../index.js";

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

    const music = document.createElement('audio');
    music.id = 'menuMusic';
    music.src = '../assets/audio/menuMusic.wav';
    document.querySelector('body').prepend(music);
    music.play();

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

    const tagline = document.createElement('h4');
    tagline.id = 'tagline';
    document.querySelector(parentID).append(tagline);
    tagline.innerText = `Redo för en sunkpubsrunda?`;

    const infoDiv = document.createElement('div');
    infoDiv.id = 'infoDiv';
    document.querySelector(parentID).append(infoDiv);

    const info1 = document.createElement('p');
    info1.classList.add('info');
    infoDiv.append(info1);
    info1.textContent = `Tänk på att dricka med måtta.`;
    
    const info2 = document.createElement('p');
    info2.classList.add('info');
    infoDiv.append(info2);
    info2.textContent = ` Spela gärna tillsammans med andra.`;

    const info3 = document.createElement('p');
    info3.classList.add('info');
    infoDiv.append(info3);
    info3.textContent = `I detta spelet kommer du möta Bosse, Kowalski, Sebbe-Sabrina och Sandra som kommer att introducera dig för sina stammishak.`;
    
    const info4 = document.createElement('p');
    info4.classList.add('info');
    infoDiv.append(info4);
    info4.textContent = `Vi rekommenderar att ni promenerar, cyklar eller tar ringlinjen.`;

    const info5 = document.createElement('p');
    info5.classList.add('info');
    infoDiv.append(info5);
    info5.textContent = `(OBS! Cykla inte ifall du tänker förtära alkohol).`;

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