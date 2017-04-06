function blank() {
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
}

function settings() {
    const $ = require('jquery');
    const fs = require('fs');
    const path = require('path');
    const settingsJSON = path.join(__dirname, '../../settings/settings.json');
    const settings = require('../../settings/settings.json');

    document.querySelector('button.save').addEventListener('click', () => {
        update()
    });

    setTimeout(() => {
        (document.querySelectorAll('select') as any).forEach((item: any) => {
            if (item.classList.contains('searchEngine')) {
                console.log(item.parentElement.querySelector('li'))
                item.parentElement.querySelector('div.styledSelect').querySelector('span').text = settings.searchEngine;
                item.parentElement.querySelectorAll('li').forEach((li: any) => {
                    li.addEventListener('click', (e: any) => {
                        settings.searchEngine = li.innerHTML;
                    });
                });
            }
        });
    }, 30);

    function update() {
        fs.writeFile(settingsJSON, JSON.stringify(settings, null, 2), (err: any) => {
            if (err) return console.log(err);
        });
    }
}

function defaultFunc() {
    const electron = require('electron');
    const { ipcMain, ipcRenderer } = require('electron');
    window.$ = window.jQuery = require('jquery');
    
    require('electron-notification-shim')();

    ipcRenderer.on('webviewId', () => {
        console.log('got')
        ipcRenderer.sendToHost('webviewId');
    });
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.location.href === 'mybrowser://blank') {
        blank()
    } else if (document.location.href === 'mybrowser://settings') {
        settings();
    } else {
        console.log(document.title)
    }
    defaultFunc();
});