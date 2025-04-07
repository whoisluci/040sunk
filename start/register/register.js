function renderRegister(parentID) {
    /* const header = renderHeader(parentID);
    document.querySelector(parentID).appendChild(header); */

    const title = document.createElement('h1');
    document.querySelector(parentID).appendChild(title);
    title.innerText = 'Registrera dig';
    title.id = 'title';

    const inputDiv = document.createElement('div');
    document.querySelector(parentID).appendChild(inputDiv);
    inputDiv.id = 'inputDiv';

    inputDiv.innerHTML = `
        <label for='namn'>Namn</label>
        <input type='text' name='namn' id='name'/>
        <label for='lösenord'>Lösenord</label>
        <input type='password' name='lösenord' id='password'/>
        <label for='confLösenord>Bekräfta lösenord</label>
        <input type='password' name='confLösenord id='confPassword'/>
    `;

    const button = document.createElement('button');
    document.querySelector(parentID).appendChild(button);
    button.id = 'registerBttn';
    button.innerText = 'Registrera dig';

    button.addEventListener('click', () => {
        /* auto login */
        /* PubSub => omdirigera till spelet */
    });
}