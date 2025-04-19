import { STATE } from "../index.js";
import { token } from "../index.js";
import { PubSub } from "../utils/pubSub.js";
import * as createTeam from './create.js';
import * as joinTeam from './join.js'

PubSub.subscribe({
    event: 'renderTeamsPage',
    listener: renderTeamsPage
});

export function renderTeamsPage (parentID) {
    document.querySelector(parentID).innerHTML = ``;
    // const header = renderHeader();

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

    const teamsDiv = document.createElement('div');
    teamsDiv.id = 'teamsDiv';
    document.querySelector(parentID).append(teamsDiv);

    const teamsText = document.createElement('h3');
    teamsText.id = 'teamsText';
    teamsDiv.append(teamsText);
    teamsText.innerText = 'Dina lag';

    console.log(localStorage.getItem('token'));
    
    const data = {
        event: 'loadTeams',
        data: {
            token: localStorage.getItem('token')
        }
    }

    STATE.socket.send(JSON.stringify(data));
    
}

export function renderUserTeams(teams) {
    const teamsDiv = document.querySelector('teamsDiv');

    for (let team of teams) {
        const teamDiv = document.createElement('div');
        teamDiv.id = `${team.teamName}`;
        teamsDiv.appendChild(teamDiv);

        const teamImg = document.createElement('img');
        teamImg.id = 'teamImg';
        teamImg.src = '';
        teamDiv.append(teamImg);

        const teamName = document.createElement('h5');
        teamName.id = 'teamName';
        teamDiv.append(teamName)
    }
}