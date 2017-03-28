const { ipcRenderer, remote } = require('electron');
// const isUrl = require('is-url');
// const normalizeUrl = require('normalize-url');
const selectedSearchEngine = require('../../settings').selectedSearchEngine;

document.addEventListener('DOMContentLoaded', () => {
    const searchBar = document.querySelector('.searchBar') as HTMLInputElement;

    ipcRenderer.on('js', (e, target) => {
        console.log('got that!')
    });

    searchBar.placeholder = `Search ${selectedSearchEngine.name} or enter URL`;

    searchBar.addEventListener('input', e => {
        let suggestions: string[];
        selectedSearchEngine.getSuggestions(searchBar.value);
        document.querySelector('#autocomplete').innerHTML = '';

        ipcRenderer.once('getSuggestions', (e, msg) => {
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
    })

    searchBar.addEventListener('keydown', e => {
        if (e.keyCode === 13) {
            onSearch(searchBar.value);
        }
    })

    function onSearch(input: string) {
        ipcRenderer.sendToHost('search', input);
    }
});
