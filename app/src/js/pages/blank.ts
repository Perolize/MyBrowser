module.exports = () => {
    const { ipcRenderer, remote } = require('electron');
    // const isUrl = require('is-url');
    // const normalizeUrl = require('normalize-url');
    const selectedSearchEngine = require('../../settings').selectedSearchEngine;

    // document.addEventListener('DOMContentLoaded', () => {
    const searchBar = document.querySelector('.searchBar') as HTMLInputElement;

    searchBar.placeholder = `Search ${selectedSearchEngine.name} or enter URL`;

    searchBar.addEventListener('input', e => {
        let suggestions: string[];
        selectedSearchEngine.getSuggestions(searchBar.value);
        document.querySelector('#autocomplete').innerHTML = '';

        ipcRenderer.once('getSuggestions', (e: any, msg: any) => {
            suggestions = msg;

            if (searchBar.value !== '') {
                const li = document.createElement('li');
                li.innerHTML = searchBar.value;
                li.setAttribute('aria-selected', 'true');
                document.querySelector('#autocomplete').appendChild(li);
            }
            suggestions.forEach((item) => {
                const li = document.createElement('li');
                li.innerHTML = item;
                document.querySelector('#autocomplete').appendChild(li);
            });
        });
    });

    searchBar.addEventListener('keydown', e => {
        if (e.keyCode === 13) {
            onSearch(searchBar.value);
        }
    });

    (document.querySelectorAll('.recentSites .site') as any).forEach((item: any) => {
        item.setAttribute('disabled', '')
    });

    ipcRenderer.on('history', (e: any, msg: any) => {
        const site = document.querySelectorAll('.recentSites .site');
        let index = 0;
        msg.forEach((item: any, i: any) => {
            if (msg.length - 5 <= i) {
                site[index].removeAttribute('disabled');
                (site[index].querySelector('.circle') as any).style.backgroundImage = `url(${item.page})`;
                site[index].querySelector('.info .title').innerHTML = item.title;
                site[index].setAttribute('url', item.url);
                index++;
            }
        });

        (document.querySelectorAll('.site') as any).forEach((item: any) => {
            item.addEventListener('click', (e: any) => {
                const url = item.getAttribute('url');

                ipcRenderer.sendToHost('goto', url);
            });
        });
    });

    function onSearch(input: string) {
        ipcRenderer.sendToHost('search', input);
    }
}