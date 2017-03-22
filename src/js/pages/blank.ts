const { ipcRenderer, remote } = require('electron');
// const isUrl = require('is-url');
// const normalizeUrl = require('normalize-url');
const selectedSearchEngine = require('../../../../../../dist/settings').selectedSearchEngine;

const searchBar = document.querySelector('.searchBar') as HTMLInputElement;

ipcRenderer.on('js', (e, target) => {
    console.log('got that!')
});

searchBar.placeholder = `Search ${selectedSearchEngine.name} or enter URL`;

searchBar.addEventListener('keydown', e => {
    if (e.keyCode === 13) {
        onSearch(searchBar.value);
    }
})

function onSearch(input: string) {
    remote.getCurrentWindow().webContents.send('search', input);
}