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

    document.querySelectorAll('.recentSites .site').forEach((item: any) => {
        item.setAttribute('disabled', '')
    });

    ipcRenderer.on('history', (e, msg) => {
        const site = document.querySelectorAll('.recentSites .site');
        let index = 0;
        msg.forEach((item: any, i: any) => {
            if (msg.length - 5 <= i) {
                site[index].removeAttribute('disabled');
                site[index].querySelector('.circle').style.backgroundImage = `url(${item.page})`;
                site[index].querySelector('.info .title').innerHTML = item.title;
                site[index].setAttribute('url', item.url);
                index++;
            }
        });

        document.querySelectorAll('.site').forEach(item => {
            item.addEventListener('click', e => {
                const url = item.getAttribute('url');

                ipcRenderer.sendToHost('goto', url);
            });
        });
    });

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

    require('../notification/notification-handler.js')();

    ipcRenderer.sendToHost('history');

    ipcRenderer.on('webviewId', () => {
        console.log('got')
        ipcRenderer.sendToHost('webviewId');
    });

    document.addEventListener('click', () => {
        ipcRenderer.sendToHost('click')
    });

    const xmlURL = document.head.querySelector('link[type="application/opensearchdescription+xml"]').getAttribute('href');

    if (xmlURL.length > 0) {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", xmlURL, true);

        xhr.onload = () => {
            if (xhr.readyState === xhr.DONE) {
                if (xhr.status === 200) {
                    const xml = xhr.responseXML;

                    const searchURL = xml.querySelector("Url:not([rel=\"suggestions\"])").getAttribute("template");
                    let suggestionsURL: any = xml.querySelector("Url[rel=\"suggestions\"]")
                    if(suggestionsURL !== null) {
                        suggestionsURL = suggestionsURL.getAttribute("template");
                    } else {
                        suggestionsURL = xml.querySelector("Url[type=\"application/x-suggestions+json\"]");
                        if(suggestionsURL !== null) {
                            suggestionsURL = suggestionsURL.getAttribute('template');
                        }
                    }
                    const description = xml.getElementsByTagName("ShortName")[0].textContent;

                    ipcRenderer.sendToHost('searchURL', searchURL, description, suggestionsURL);
                }
            }
        }

        xhr.send();
    }
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