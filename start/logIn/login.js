function renderLogIn (parentID) {
    /* const header = rendera header
    document.querySelector(parentID).appendChild(header); */

    const title = document.createElement('h1');
    document.querySelector(parentID).appendChild(title);
    title.innerText = 'Logga in';
    title.id = 'title';

    const inputDiv = document.createElement('div');
    document.querySelector(parentID).appendChild(inputDiv);
    inputDiv.id = 'inputDiv';

    inputDiv.innerHTML = `
        <label for='namn'>Namn</label>
        <input type='text' name='namn' id='name'/>
        <label for='lösenord'>Lösenord</label>
        <input type='password' name='lösenord' id='password'/>
    `;

    const button = createElement('button');
    document.querySelector(parentID).appendChild(button);
    button.id = 'logInBttn';
    button.innerText = 'Logga in';

    button.addEventListener('click', () => {
        /* auto login */
        /* PubSub => omdirigera till spelet */
    });
}