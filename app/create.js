import { PubSub } from "../utils/pubSub.js";
import { STATE } from "../index.js";

PubSub.subscribe({
    event: 'createTeam',
    listener: renderCreate
});

function renderCreate (parentID) {
    document.querySelector(parentID).innerHTML = ``;

    // const header = renderHeader();

    const headline = document.createElement('h2');
    headline.id = 'headline';
    document.querySelector(parentID).append(headline);
    headline.innerText = 'Skapa lag';

    const teamDiv = document.createElement('div');
    teamDiv.id = 'teamDiv';
    teamDiv.innerHTML = `
        <label for='teamName'>Lagnamn</label>
        <input type='text' name='teamName' id='teamName'/>

        <h3 id='teamImg'>Välj lagbild</h3>
        /* drop down eller popUp?*/ 

        <img src=''>

        <h5 id='descText></h5>
    `;
    document.querySelector(parentID).append(teamDiv);

    const startBttn = document.createElement('button');
    document.querySelector(parentID).append(startBttn);
    startBttn.innerText = 'Start';

    startBttn.addEventListener('click', () => {
        const teamName = document.querySelector('#teamName').value;
        const teamImg = document.querySelector('#teamImg');

        const data = {
            event: 'createTeam',
            data: {
                token: localStorage.getItem('token'),
                teamName: teamName
            }
        };

        STATE.socket.send(JSON.stringify(data));
    });
}