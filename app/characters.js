import { STATE } from "../index.js";
import { PubSub } from "../utils/pubSub.js";

PubSub.subscribe({
    event: 'renderChars',
    listener: renderCharSelection
});

function renderCharSelection(parentID){
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

        /* kolla om någon progress finns */
        /* om det finns, kolla vilka som e done */

        charDiv.addEventListener("click", (event) => {
            let chosenChar = event.target.id;
            renderCharDialogue('#wrapper', chosenChar);
        });
    }
}

function renderCharDialogue (parentID, charName) {
    document.querySelector(parentID).innerHTML = ``;

    const chosenChar = STATE.characters.find((el) => el.name === charName);
    const dialogue = chosenChar.dialogue;
    const barID = chosenChar.bar;
    const bar = STATE.bars.find((el) => el.id === barID);

    const background = document.createElement('img');
    background.id = 'background';
    background.src = bar.characterBG;

    const charAnimation = document.createElement('img');
    charAnimation.id = 'charAnimation';
    charAnimation.src = chosenChar.avatarPath; /* ändra till animation */

    const textbox = document.createElement('div');
    textbox.id = 'textbox';
    document.querySelector(parentID).append(textbox);

    const text = document.createElement('div');
    text.id = 'dialogue';
    textbox.append(text);

    const audio = document.createElement('audio');
    audio.id = 'voice';
    audio.src = chosenChar.audioPath;

    let currentLine = 0;
    let charIndex = 0;

    const trigger = setTimeout(() => {
        audio.play();
        typeLine(currentLine, charIndex, dialogue);
    });
}

function typeLine(currentLine, charIndex, dialogue) {
    if (currentLine >= dialogue.length) return;

    let line = dialogue[currentLine];
    let lineElement = document.createElement("div");
    textContent.appendChild(lineElement);

    let typingInterval = setInterval(() => {
      if (charIndex < line.length) {
        lineElement.textContent += line.charAt(charIndex);
        charIndex++;
        textContent.parentElement.scrollTop = textContent.scrollHeight;
      } else {
        clearInterval(typingInterval);
        charIndex = 0;
        currentLine++;
        setTimeout(typeLine, 1000);
      }
    }, 45);
}