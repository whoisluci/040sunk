import { STATE } from "../index.js";
import { token } from "../index.js";
import { PubSub } from "../utils/pubSub.js";
import * as createTeam from './create.js';
import * as joinTeam from './join.js'
import * as renderHeader from './global/header.js'

PubSub.subscribe({
    event: 'renderTeamsPage',
    listener: renderTeamsPage
});

PubSub.subscribe({
    event: 'renderUserTeams',
    listener: renderUserTeams
})

export function renderTeamsPage (parentID) {
    document.querySelector(parentID).innerHTML = ``;

    const header = PubSub.publish({
        event: 'renderHeader',
        detail: '#wrapper'
    });

    const text = document.createElement('h2');
    text.id = 'headline';
    document.querySelector(parentID).append(text);
    text.innerText = 'Kom igång';

    const joinBttn = document.createElement('button');
    joinBttn.id = 'joinBttn';
    joinBttn.innerText = 'Gå med lag';
    document.querySelector(parentID).append(joinBttn);

    const createBttn = document.createElement('button');
    createBttn.id = 'createBttn';
    createBttn.innerText = 'Skapa lag';
    document.querySelector(parentID).append(createBttn);

    joinBttn.addEventListener('click', () => {
        PubSub.publish({
            event: 'joinTeam',
            detail: '#wrapper'
        });
    });

    createBttn.addEventListener('click', () => {
        PubSub.publish({
            event: 'createTeam',
            detail: '#wrapper'
        });
    });
    
    const teamsText = document.createElement('h3');
    teamsText.id = 'teamsText';
    document.querySelector(parentID).append(teamsText);
    teamsText.innerText = 'Dina lag';

    const teamsDiv = document.createElement('div');
    teamsDiv.id = 'teamsDiv';
    document.querySelector(parentID).append(teamsDiv);
    teamsDiv.style.overflowX = 'auto';

    if (localStorage.getItem('token')) {
        const data = {
            event: 'loadTeams',
            data: {
                token: localStorage.getItem('token')
            }
        }
    
        STATE.socket.send(JSON.stringify(data));
    }
}

export function renderUserTeams(teams) {
    const teamsDiv = document.querySelector('#teamsDiv');

    if (teams.length === 0 || (typeof teams) === 'string')  {
        const text = document.createElement('p');
        text.innerText = 'Du har inga lag:(';
        teamsDiv.append(text);
        return;
    }

    teamsDiv.classList.add('swipe-container');
    const ul = document.createElement('ul');
    teamsDiv.append(ul);
    ul.classList.add('slider-container');

    teams.forEach(team => {
        const teamLi = document.createElement('li');
        teamLi.id = `${team.teamName}`;
        teamLi.classList.add('team');
        
        const teamImg = document.createElement('img');
        teamImg.id = 'teamImg';
        teamImg.src = '';
        teamLi.append(teamImg);

        const teamName = document.createElement('h5');
        teamName.id = 'teamName';
        teamLi.append(teamName);

        ul.appendChild(teamLi);
    });

    return teamsDiv;
}