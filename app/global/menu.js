import { STATE } from "../../index.js";
import { PubSub } from "../../utils/pubSub.js";

PubSub.subscribe({
    event: 'renderMenu',
    listener: renderMenu
});

export function renderMenu (parentID) {
    // skapa menyikon + eventListener + alla funktioner

    const menuIcon = document.createElement('img');
    menuIcon.id = 'menu';
    document.querySelector(parentID).append(menuIcon);
    menuIcon.src = '';

    menuIcon.addEventListener('click', () => {
        // det ska renderas en div här som utgör menyn
        const menuDiv = document.createElement('div');
        menuDiv.id = 'menuDiv';
        menuDiv.style.backgroundColor = '';
        menuDiv.style.height = '100%';
        menuDiv.style.width = '80%';

        const homeDiv = document.createElement('div');
        menuDiv.append(homeDiv);
        homeDiv.id = 'homeDiv';

        menuDiv.innerHTML = `
            <img src='' id='closeBttn'>
            <div id='homeDiv'>
                <img src='' id='homeIcon'>
                <h6 id='homeText'>Hem</h6>
            </div>
            <div id='rankingsDiv'>
                <img src='' id='rakingsIcon'>
                <h6 id='rankingsText'>Topplista</h6>
            </div>
            <div id='charsDiv'>
                <img src='' id='charsIcon'>
                <h6 id='charsText'>Karaktärer</h6>
            </div>
            <line>
            <div id='logOutDiv'>
                <img src='' id='logOutIcon'>
                <h6 id='logOutText'>Logga ut</h6>
            </div>
        `;

        const closeBttn = document.querySelector('#closeBttn');
        closeBttn.addEventListener('click', () => {
            menuDiv.remove();
        });

        const homeBttn = document.querySelector('#homeDiv');
        homeBttn.addEventListener('click', () => {
            /* PubSub */
        });

        const rankingsBttn = document.querySelector('#rankingsDiv');
        rankingsBttn.addEventListener('click', () => {
            /* PubSub */
        });

        const charsBttn = document.querySelector('#charsDiv');
        badgesBttn.addEventListener('click', () => {
            /* PubSub */
        });

        const logOutBttn = document.querySelector('#logOutIcon');
        logOutBttn.addEventListener('click', () => {
            /* PubSub */
        });

        // det ska renderas olika knappar + texter
        // knapparna ska ha eventListeners 
    });
}