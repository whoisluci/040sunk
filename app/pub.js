import { PubSub } from "../utils/pubSub.js";
import { STATE } from "../index.js";

PubSub.subscribe({
    event: 'renderPub',
    listener: renderPub
});

export function renderPub (pub) {
    const wrapper = document.querySelector('#wrapper');
    wrapper.innerHTML = ``;
    wrapper.style.backgroundImage = `url(${pub.gameboardBG})`;

    for (let el of STATE.challenges) {
        if (pub.id === el.pubID) {
            for (let q of el.questions) {
                const div = document.createElement('div');
                wrapper.append(div);
                wrapper.id = `q_${q.id}`;

                const icon = document.createElement('img');
                div.append(icon);
                icon.src = q.iconPath;

                div.addEventListener('click', () => {
                    console.log('testign!!');
                })
            }
        }
    }

}