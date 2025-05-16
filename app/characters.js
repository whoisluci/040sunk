import { STATE } from "../index.js";
import { PubSub } from "../utils/pubSub.js";

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

    // const background = document.createElement('img');
    // background.id = 'background';
    // background.src = pub.characterBG;
    // document.querySelector(parentID).append(background);

    const charAnimation = document.createElement('img');
    charAnimation.id = 'charAnimation';
    charAnimation.src = chosenChar.avatarPath; /* ändra till animation */
    document.querySelector(parentID).append(charAnimation);

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