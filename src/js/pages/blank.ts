const { ipcRenderer } = require('electron');
// const isUrl = require('is-url');
// const normalizeUrl = require('normalize-url');
const main = require('../../../../../../dist/js/main');
const selectedSearchEngine = require('../../../../../../dist/settings').selectedSearchEngine;

const searchBar = document.querySelector('.searchBar') as HTMLInputElement;

ipcRenderer.on('js', (e, target) => {
    console.log('got that!')
});

searchBar.placeholder = `Search ${selectedSearchEngine.name} or enter URL`;

searchBar.addEventListener('keydown', e => {
    if(e.keyCode === 13) {
        main.search(searchBar.value);
    }
})

function onSearch(input: string) {
    // const url = normalizeUrl(input);
    // if (isUrl(url) === true || document.querySelector('.navigation .url').textContent.startsWith("mybrowser://")) {
    //     document.querySelector('.navigation .url').textContent = url;
    //     (document.querySelector('.page.active') as any).loadURL(url);
    //     webview.onNavigating();
    // } else {
        // const url = selectedSearchEngine.search(input);

        // document.querySelector('.navigation .url').textContent = url;
        // (document.querySelector('.page.active') as any).loadURL(url);
        // webview.onNavigating();
    // }
    main.search(input)
}

console.log(selectedSearchEngine);