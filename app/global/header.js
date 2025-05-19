import { STATE } from "../../index.js";
import { PubSub } from "../../utils/pubSub.js";
import * as renderMenu from './menu.js';
import * as renderLandingPage from '../../start/start.js';

PubSub.subscribe({
    event: 'renderHeader',
    listener: renderHeader
});

export function renderHeader (parentID) {
    const header = document.createElement('header');
    document.querySelector(parentID).append(header);
    header.id = 'header';
    
    if (!sessionStorage.getItem('token')) {
        const backBttn = document.createElement('img');
        backBttn.src = '';
        backBttn.id = 'backBttn';
        header.append(backBttn);

        backBttn.addEventListener('click', () => {
            PubSub.publish({
                event: 'renderLandingPage',
                detail: '#wrapper'
            });
        });
    }

    const menu = PubSub.publish({
        event: 'renderMenu',
        detail: '#header'
    });

    const logotype = document.createElement('img');
    logotype.id = 'miniLogo';
    header.append(logotype);
    logotype.src = '../../assets/miniLogo.svg';

    logotype.addEventListener('click', () => {
        PubSub.publish({
            event: 'renderTeamsPage',
            detail: '#wrapper'
        });
    });
  
    return header;
}