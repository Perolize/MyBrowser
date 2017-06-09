module.exports = () => {
    const { ipcRenderer, remote } = require('electron');

    setTimeout(() => {
        document.querySelector('.Main .ClearButtons .clear-history:not(.disabled)').addEventListener('click', (e: any) => {
            e.preventDefault();

            ipcRenderer.sendToHost('clear-history');
            location.reload();
        });

        document.querySelector('.Main .ClearButtons .clear-cache:not(.disabled)').addEventListener('click', (e: any) => {
            e.preventDefault();

            ipcRenderer.sendToHost('clear-cache');
            location.reload();
        });

        if(document.querySelector('.Main > .no-history') !== null) {
            document.querySelector('.Main .ClearButtons .clear-history').classList.add('disabled');
            document.querySelector('.Main .ClearButtons .clear-cache').classList.add('disabled');
        }
    }, 100);
}