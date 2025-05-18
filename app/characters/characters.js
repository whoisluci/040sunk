import { STATE } from "../../index.js";
import { PubSub } from "../../utils/pubSub.js";
import * as renderPub from "../pub.js";

PubSub.subscribe({
    event: 'renderChars',
    listener: renderCharSelection
});

async function renderCharSelection(parentID){
    console.log(`[CLIENT]: Game has started .`);
    document.querySelector(parentID).innerHTML = ``;

    const headline = document.createElement('h2');
    headline.id = 'headline';
    document.querySelector(parentID).append(headline);
    headline.innerText = 'Välj en karaktär';

    const charsDiv = document.createElement('div');
    charsDiv.id = 'charsDiv';
    document.querySelector(parentID).append(charsDiv);
    
    for (let char of STATE.characters) {
        const charDiv = document.createElement('div');
        charDiv.id = char.name;
        charsDiv.append(charDiv);
        
        const charImg = document.createElement('img');
        charImg.src = char.avatarPath;
        charDiv.append(charImg);
        charImg.style.height = '200px';

        charDiv.classList.add('char');

        /* kolla om någon progress finns */
        /* om det finns, kolla vilka som e done */

        charDiv.addEventListener("click", (event) => {
            let chosenChar = event.currentTarget.id;
            renderCharDialogue('#wrapper', chosenChar);
        });
    }
}

function renderCharDialogue (parentID, charName) {
    document.querySelector(parentID).innerHTML = ``;

    let chosenChar;
    for (let char of STATE.characters) {
        if (charName === char.name) {
            chosenChar = char;
        }
    }
    
    const monologue = chosenChar.monologue;

    const pubID = chosenChar.pub;
    const pub = STATE.pubs.find((el) => el.id === pubID);
    
    document.querySelector(parentID).style.backgroundImage = `url(${pub.characterBG}`;

    const charAnimation = document.createElement('video');
    charAnimation.id = 'charAnimation';
    charAnimation.setAttribute('type', 'video/mov')
    charAnimation.src = chosenChar.animationPath;
    document.querySelector(parentID).append(charAnimation);
    charAnimation.setAttribute('controls', 'false');
    charAnimation.loop = true;
    charAnimation.autoplay = true;

    const textbox = document.createElement('div');
    textbox.id = 'textbox';
    document.querySelector(parentID).append(textbox);

    const text = document.createElement('div');
    text.id = 'monologue';
    textbox.append(text);

    const audio = document.createElement('audio');
    audio.id = 'voice';
    audio.src = chosenChar.audioPath;

    let currentLine = 0;
    let charIndex = 0;

    const trigger = setTimeout(() => {
        audio.play();
        typeLine(currentLine, charIndex, monologue);
    });

    audio.addEventListener('ended', () => {
        textbox.innerHTML = ``;
        charAnimation.loop = false;
        charAnimation.pause = true;
        
        const question = document.createElement('h5');
        textbox.append(question);
        question.id = 'question';
        question.textContent = `Vilken pub pratade ${chosenChar.name} om?`;

        const input = document.createElement('input');
        input.placeholder = 'Svar';
        textbox.append(input);

        const bttn = document.createElement('button');
        bttn.textContent = 'OK';
        bttn.id = 'button';
        textbox.append(bttn);

        bttn.addEventListener('click', () => {
            const answer = input.value;

            if (answer.localeCompare(pub.name)) {
               PubSub.publish({
                event: 'renderPub',
                detail: pub
               });
            }
        });
    });
}

function typeLine(currentLine, charIndex, monologue) {
    if (currentLine >= monologue.length) return;

    const monologueDiv = document.querySelector('#monologue');

    let line = monologue[currentLine];
    let lineElement = document.createElement("div");
    monologueDiv.appendChild(lineElement);

    let typingInterval = setInterval(() => {
      if (charIndex < line.length) {
        lineElement.textContent += line.charAt(charIndex);
        charIndex++;
        textbox.parentElement.scrollTop = textbox.scrollHeight;
      } else {
        clearInterval(typingInterval);
        charIndex = 0;
        currentLine++;
        setTimeout(typeLine(currentLine, charIndex, monologue), 1000);
      }
    }, 80);
}