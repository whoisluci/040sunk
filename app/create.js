import { PubSub } from "../utils/pubSub.js";
import { STATE } from "../index.js";

PubSub.subscribe({
    event: 'createTeam',
    listener: renderCreate
});

function renderCreate (parentID) {
    document.querySelector(parentID).innerHTML = ``;
    
    const header = PubSub.publish({
        event: 'renderHeader',
        detail: '#wrapper'
    });

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
        <input type='file' id='fileUpload' class='filepond' name='filepond' capture='user' accept='image/*'/>

        <img id='preview' src=''>

        <h5 id='descText'></h5>
    `;
    document.querySelector(parentID).append(teamDiv);

    const createBttn = document.createElement('button');
    document.querySelector(parentID).append(createBttn);
    createBttn.id = 'createBttn';
    createBttn.innerText = 'Skapa';

    const fileInput = document.querySelector('#fileUpload');
    fileInput.addEventListener('change', () => {
        const file = fileInput.files[0];
        if (file) {
            const previewImg = document.querySelector('#preview');
            previewImg.src = URL.createObjectURL(file);
        }
    });

    createBttn.addEventListener('click', async () => {
        const teamName = document.querySelector('#teamName').value;
        const teamImg = fileInput.files[0];    

        if (!teamName) {
            alert('Du måste skriva ett lagnamn för att fortsätta!');
            return;
        }

        if (!teamImg) {
            alert('Du måste välja en lagbild för att fortsätta');
            return;
        }

        if (teamImg) {
            const base64String = PubSub.publish({
                event: 'convertImg',
                detail: teamImg
            });
            
            localStorage.setItem('teamImg', base64String);
            console.log("Image saved to localStorage");
        } else {
            console.log("No file selected.");
        }

        const imgArrayBuffer = await teamImg.arrayBuffer();

        const imgData = {
            fileName: teamImg.name,
            fileType: teamImg.type,
            fileData: Array.from(new Uint8Array(imgArrayBuffer))
        };

        const data = {
            event: 'createTeam',
            data: {
                token: localStorage.getItem('token'),
                teamName: teamName,
            }
        };

        STATE.socket.send(JSON.stringify(data));
        console.log(STATE.socket);
    });
}