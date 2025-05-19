import { STATE } from "../../index.js";
import { PubSub } from "../../utils/pubSub.js";
import * as renderPub from "../pubs/pub.js";

PubSub.subscribe({
    event: 'renderChars',
    listener: renderCharSelection
});

async function renderCharSelection(parentID){
    console.log(`[CLIENT]: Game has started .`);
    document.querySelector(parentID).innerHTML = ``;

    const header = PubSub.publish({
        event: 'renderHeader',
        detail: '#wrapper'
    });

    const background = document.createElement('img');
    document.querySelector(parentID).append(background);
    background.id = 'backgroundImg';
    background.src = '../assets/bgMap.png';

    const headline = document.createElement('h2');
    headline.id = 'headline';
    document.querySelector(parentID).append(headline);
    headline.innerText = 'Välj en karaktär';

    const charsDiv = document.createElement('div');
    charsDiv.id = 'charsDiv';
    document.querySelector(parentID).append(charsDiv);
    
    for (let char of STATE.characters) {
        const pubID = char.pub;
        const pub = STATE.pubs.find((el) => el.id === pubID);

        const charDiv = document.createElement('div');
        charDiv.id = char.name;
        charsDiv.append(charDiv);
        charDiv.classList.add('char');
        
        const charBG = document.createElement('img');
        charBG.id = 'charBoxBG';
        charBG.src = pub.characterBG;
        charDiv.append(charBG);        
        
        const charImg = document.createElement('img');
        charImg.src = char.avatarPath;
        charDiv.append(charImg);
        charImg.style.height = '200px';
        charImg.classList.add('charImg');

       const isDone = (STATE.challenges.find(p => p.pubID === pub.id)).isDone;
        

        if (char.locked) {
            console.log(char);
            
            const overlay = document.createElement('div');
            overlay.id = 'overlay';
            charDiv.append(overlay);

            const lock = document.createElement('img');
            lock.id = 'charLock';
            lock.src = '../../assets/icons/charLock.svg';
            overlay.append(lock);
        } else {            
            if (!isDone) {                
                charDiv.addEventListener("click", (event) => {
                    
                    let chosenChar = event.currentTarget.id;
                    renderCharDialogue('#wrapper', chosenChar);
                });
            }
        }
    }
}

function renderCharDialogue (parentID, charName) {
    document.querySelector(parentID).innerHTML = ``;
    const music = document.querySelector('#menuMusic');
    if (music) {
        music.remove();
    }

    let chosenChar;
    for (let char of STATE.characters) {
        if (charName === char.name) {
            chosenChar = char;
        }
    }
    
    const monologue = chosenChar.monologue;

    const pubID = chosenChar.pub;
    const pub = STATE.pubs.find((el) => el.id === pubID);

    const background = document.createElement('div');
    background.id = 'charBG';
    document.querySelector(parentID).append(background);
    background.style.backgroundImage = `url(${pub.characterBG}`;

    const charAnimation = document.createElement('img');
    charAnimation.id = 'charAnimation';
    charAnimation.src = chosenChar.animationPath;
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

    audio.addEventListener('ended', () => {
        charAnimation.src = chosenChar.avatarPath;
        textbox.innerHTML = ``;
        
        const question = document.createElement('h3');
        textbox.append(question);
        question.id = 'question';
        question.textContent = `Vilken pub pratade ${chosenChar.name} om?`;

        const input = document.createElement('input');
        input.placeholder = 'Svar';
        input.id = 'answerInput';
        textbox.append(input);

        const bttn = document.createElement('button');
        bttn.textContent = 'OK';
        bttn.id = 'button';
        textbox.append(bttn);

        bttn.addEventListener('click', () => {
            let userInput = input.value;
            userInput = userInput.toLowerCase()
                    .normalize('NFD')
                    .replace(/[\u0300-\u036f]/g, '');

            let answer = pub.name;
            answer = answer.toLowerCase()
                    .normalize('NFD')
                    .replace(/[\u0300-\u036f]/g, '');

            const isMatch = userInput.localeCompare(answer, 'sv', { sensitivity: 'base' });

            if (isMatch === 0) {
                textbox.innerHTML = ``; 

                const text = document.createElement('h5');
                text.id = 'congratulationsText';
                textbox.append(text);
                text.innerHTML = `Grattis, du klurade ut det! <br> Vi ses på ${pub.location}`;

                const arrivedBttn = document.createElement('button');
                textbox.append(arrivedBttn);
                arrivedBttn.textContent = 'Jag har anlänt';

                arrivedBttn.addEventListener('click', () => {
                    PubSub.publish({
                        event: 'renderPub',
                        detail: pub
                    });
                });

            } else {
                question.textContent = 'Fel! Försök igen.';
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
    }, 55);
}