module.exports = () => {
    const { ipcRenderer, remote } = require('electron');

    setTimeout(() => {
        document.querySelector('.Main .ClearButtons .Modal .button:not(.cancel)').addEventListener('click', (e: any) => {
            if (e.target.parentElement.parentElement.querySelector('.modalHeader h2').textContent === 'Clear History') {
                ipcRenderer.sendToHost('clear-history');
            } else {
                ipcRenderer.sendToHost('clear-cache');
            }
        });

        if (document.querySelector('.Main > .no-history') !== null) {
            document.querySelector('.Main .ClearButtons .clear-history').classList.add('disabled');
            document.querySelector('.Main .ClearButtons .clear-cache').classList.add('disabled');
        }
    }, 100);
}