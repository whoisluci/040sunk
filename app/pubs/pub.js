import { PubSub } from "../../utils/pubSub.js";
import { STATE } from "../../index.js";

PubSub.subscribe({
    event: 'renderPub',
    listener: renderPub
});

PubSub.subscribe({
    event: 'updatePopUp',
    listener: updatePopUp
});

PubSub.subscribe({
    event: 'checkIfDone',
    listener: checkIfDone
});

export function renderPub (pub) {
    const wrapper = document.querySelector('#wrapper');
    wrapper.innerHTML = ``;
    
    const background = document.createElement('div');
    background.style.backgroundImage = `url(${pub.gameboardBG})`;
    background.id = 'pubBG';
    wrapper.append(background);
    
    const grid = document.createElement('div');
    grid.id = 'grid';
    grid.classList.add(pub.id);

    let iconCount = 0;
    let currentRow = 0;
    let iconsPlacedInRow = 0;

    for (let el of STATE.challenges) {
        if (pub.id === el.pubID) {
            const charCard = document.createElement('div');
            wrapper.append(charCard);
            charCard.id = 'charCard';
            
            const char = STATE.characters.find(el => el.pub === pub.id);
            const charImg = document.createElement('img');
            charImg.id = 'miniChar';
            charCard.append(charImg);
            charImg.src = char.avatarPath;
        
            const name = document.createElement('h4');
            charCard.append(name);
            name.textContent = pub.name;

            wrapper.append(grid);
            const rowsNeeded = Math.ceil(el.questions.length / 3) * 2;
            grid.style.gridTemplateRows = `repeat(${rowsNeeded}, 1fr)`;

            for (let q of el.questions) {
                if (q.answered) {
                    continue;
                }
                
                const div = document.createElement('div');
                grid.append(div);
                div.id = `q_${q.id}`;
                div.classList.add('icon');

                const qID = q.id;

                const iconsInThisRow = (currentRow % 2 === 0) ? 2 : 1;

                if (iconsPlacedInRow >= iconsInThisRow) {
                    currentRow++;
                    iconsPlacedInRow = 0;
                }

                const row = currentRow + 1;
                let col;
                
                if (currentRow % 2 === 0) {
                    col = iconsPlacedInRow === 0 ? 1 : 3;
                } else {
                    col = 2;
                }

                const padTop = Math.floor(Math.random() * 40);
                const padLeft = Math.floor(Math.random() * 40);
                const rotate = Math.floor(Math.random() * 60 - 30);

                div.style.paddingTop = `${padTop}px`;
                div.style.paddingLeft = `${padLeft}px`;
                div.style.transform = `rotate(${rotate}deg)`;

                div.style.gridRow = row;
                div.style.gridColumn = col;

                const icon = document.createElement('img');
                div.append(icon);
                icon.src = q.iconPath;

                iconCount++;
                iconsPlacedInRow++;

                div.addEventListener('click', () => {
                    const popUp = document.createElement('div');
                    wrapper.append(popUp);
                    popUp.id = 'popUp';
                    
                    const box = document.createElement('div');
                    box.id = 'box';
                    popUp.append(box);

                    popUp.addEventListener('click', () => {
                        popUp.remove();
                    });

                    box.addEventListener('click', (e) => {
                        e.stopPropagation();
                    });

                    const exit = document.createElement('img');
                    exit.id = 'exitBttn';
                    exit.src = '../../assets/icons/exit.svg';
                    box.append(exit);

                    exit.addEventListener('click', () => {
                        popUp.remove();
                    });
                    
                    const text = document.createElement('h4'); 
                    box.append(text);
                    text.id = 'category';

                    const p = document.createElement('p');
                    p.id = 'qText';
                    box.append(p);

                    if (q.type === 'question') {
                        text.textContent = 'Fråga';

                        if (q.options) {
                            const optsDiv = document.createElement('div');
                            box.append(optsDiv);
                            optsDiv.id = 'optWrapper';
                            
                            for (let op of q.options) {
                                const optDiv = document.createElement('div');
                                optDiv.classList.add('optDiv');
                                optsDiv.append(optDiv);

                                const radio = document.createElement('input');

                                radio.type = 'radio';
                                optDiv.append(radio);
                                const i = op.indexOf(el.options);
                                radio.id = `op_${i}`;
                                radio.setAttribute('name', 'optAnswer');
                                radio.setAttribute('value', op);

                                const radioLabel = document.createElement('label');
                                optDiv.append(radioLabel);
                                radioLabel.textContent = op;
                            }
                        } else {
                            const input = document.createElement('input');
                            box.append(input);
                            input.placeholder = 'Svar...';
                            input.id = 'userInput';
                        }
                        const okBttn = document.createElement('button');
                        box.append(okBttn);
                        okBttn.id = 'okBttn';
                        okBttn.textContent = 'OK';
    
                        okBttn.addEventListener('click', () => {
                            if (q.options) {
                                const selectedRadio = document.querySelector('input[name="optAnswer"]:checked');
    
                                const answer = selectedRadio ? selectedRadio.value : null;

                                console.log(answer);
                                
    
                                if (answer === null || answer === undefined) {
                                    const warning = document.createElement('h6');
                                    box.append(warning);
                                    warning.textContent = 'Du har inte valt något svar!'
                                } else {
                                    const data = {
                                        event: 'checkAnswer',
                                        data: {
                                            pubID: pub.id,
                                            qID: q.id,
                                            answer: answer
                                        }
                                    }
    
                                    STATE.socket.send(JSON.stringify(data));
                                }
                            } else {
                                const answer = document.querySelector('#userInput').value;
    
                                const data = {
                                    event: 'checkAnswer',
                                    data: {
                                        pubID: pub.id,
                                        qID: qID,
                                        answer: answer
                                    }
                                };
    
                                STATE.socket.send(JSON.stringify(data));
                            }
                        });

                    } else {
                        text.textContent = 'Utmaning';
                        const okBttn = document.createElement('button');
                        okBttn.id = 'okBttn';
                        box.append(okBttn);
                        okBttn.textContent = 'KLAR';

                        box.style.height = '35%';

                        okBttn.addEventListener('click', () => {
                            q.answered = true;
                            el.totalAnswered =+ 1;
                            popUp.remove();
                            console.log(pub.id);
                            
                            checkIfDone(pub.id);
                            div.remove();

                            for (let p of STATE.challenges) {
                                if (p.pubID === pub.id) {
                                    for (let q of p.questions) {
                                        
                                        if (q.id === qID) {
                                            q.answered = true;
                                            
                                            const data = {
                                                event: 'checkChallenge',
                                                data: {
                                                    pubID: pub.id,
                                                    qID: qID
                                                }
                                            }

                                            STATE.socket.send(JSON.stringify(data));
                                        }
                                    }
                                }
                            }
                        });
                    }
                    p.textContent = q.question;
                });
            }
        }
    }

}

export function updatePopUp (data) {
    const popUp = document.querySelector('#popUp');
    const box = document.querySelector('#box');
    box.innerHTML = ``;

    const feedback = document.createElement('h5');
    feedback.id = 'feedback';
    box.append(feedback);
    
    const bttn = document.createElement('button');

    if (data.isCorrect) {
        feedback.innerHTML = `Grattis! <br> Vilket snille du är!`;

        bttn.textContent = 'Fortsätt';
        bttn.id = 'continueBttn';
        bttn.classList.add('button');
        box.append(bttn);

        bttn.addEventListener('click', () => {
            popUp.remove();
            localStorage.setItem('STATE', JSON.stringify(STATE));
            document.querySelector(`#q_${data.qID}`).remove();

            if (document.querySelector('#grid').childElementCount === 0) {
                console.log('??');

                localStorage.setItem('STATE', JSON.stringify(STATE));
                
                STATE.challenges.find(p => {
                    if (p.pubID === data.pID) {
                        p.isDone = true;
                        renderBadgePopUp(p);
                    };
                });
            }
        });
    } else {
        feedback.innerHTML = `Kom igen! <br> Du kan bättre.`;
        
        bttn.textContent = 'Försök igen';
        bttn.id = 'tryAgainBttn';
        bttn.classList.add('button');
        box.append(bttn);

        bttn.addEventListener('click', () => {
            popUp.remove();
        });
    }

}

export function checkIfDone (data) {    
    let isDone = false;
    if (data.totalAnswered) {
       for (let pub of STATE.challenges) {
            if (pub.pubID === data.pubID) {
                console.log(pub);

                if (data.totalAnswered === pub.questions.length) {
                    isDone = true;
                    pub.isDone = isDone;

                    STATE.characters.find(char => {
                        if (char.pub === data.pubID) {
                            char.locked = false;
                        }
                    });

                    localStorage.setItem('STATE', JSON.stringify(STATE));
                    renderBadgePopUp(pub);

                    console.log(STATE);
                    
                }
           }
        }
    }

    if (data.pubID) {
        for (let pub of STATE.challenges) {
            if (pub.pubID === data.pubID) {
                console.log('rätt pub');
                
                let totalAnswered = 0;
    
                for (let q of pub.questions) {
                    console.log(q);
    
                    if (q.answered) {
                        totalAnswered = totalAnswered + 1;
                    }
                }
            
                if (totalAnswered === pub.questions.length) {
                    isDone = true;
                    pub.isDone = isDone;
            
                    STATE.characters.find(char => {
                        if (char.pub === (pub.pubID + 1)) {
                            char.locked = false;
                            STATE.chosenChar = pub.pubID + 1;
                        }
                    });
                    

                    localStorage.setItem('STATE', JSON.stringify(STATE));
                    renderBadgePopUp(pub);

                    console.log(STATE);
                    
                }
            }
        }
    }
}
               
export function renderBadgePopUp (pub) {
    document.querySelector('#popUp').remove();
    const popUp = document.createElement('div');
    wrapper.append(popUp);
    popUp.id = 'popUp';

    const box = document.createElement('div');
    box.id = 'box';
    popUp.append(box);

    const exit = document.createElement('img');
    exit.id = 'exitBttn';
    exit.src = '../../assets/icons/exit.svg';
    box.append(exit);

    const text = document.createElement('h5');
    text.id = 'finishedText';
    box.append(text);

    let name;
    STATE.pubs.find(p => {
        if (p.id === pub.pubID) {
            name = p.name;
        }
    });

    text.innerHTML = `Grattis du har fått <br> ${name}s märke!`;

    const badge = document.createElement('img');
    badge.id = 'badge';
    box.append(badge);
    badge.src = `../../assets/badges/${pub.pubID}.svg`;

    const bttn = document.createElement('button');
    bttn.id = 'backToSelectionBttn';
    box.append(bttn);
    bttn.textContent = 'Välj nästa karaktär';

    // const player = document.createElement('lottie-player');
    // player.setAttribute('src', '../../assets/animations/confetti.lottie');
    // player.setAttribute('background', 'transparent');
    // player.setAttribute('speed', '1');
    // player.setAttribute('autoplay', '');
    // box.append(player);

    bttn.addEventListener('click', () => {
        PubSub.publish({
            event: 'renderChars',
            detail: '#wrapper'
        });
    });

    popUp.addEventListener('click', () => {
        popUp.remove();
    });

    exit.addEventListener('click', () => {
        popUp.remove();
    });

    box.addEventListener('click', (e) => {
        e.stopPropagation();
    });
}