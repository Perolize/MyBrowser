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
    
    require('electron-notification-shim')();

    ipcRenderer.on('webviewId', () => {
        console.log('got')
        ipcRenderer.sendToHost('webviewId');
    });

    document.addEventListener('copy', (e: any) => {
        if (e.target.tagName.toLowerCase() === 'img') {
            e.target.classList.contains('emoji');
            e.clipboardData.setData('text/plain', e.target.alt);
            e.preventDefault();
        }
    });

    // onDomChange(function () {
    //     eval('twemoji.parse(document.body)');
    // });
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

// (function (window) {
//     var last = +new Date();
//     var delay = 100; // default delay

//     // Manage event queue
//     var stack: any = [];

//     function callback() {
//         var now = +new Date();
//         if (now - last > delay) {
//             for (var i = 0; i < stack.length; i++) {
//                 stack[i]();
//             }
//             last = now;
//         }
//     }

//     // Public interface
//     var onDomChange = function (fn: any, newdelay: any) {
//         if (newdelay) delay = newdelay;
//         stack.push(fn);
//     };

//     // Naive approach for compatibility
//     function naive() {

//         var last: any = document.getElementsByTagName('*');
//         var lastlen = last.length;
//         var timer = setTimeout(function check() {

//             // get current state of the document
//             var current = document.getElementsByTagName('*');
//             var len = current.length;

//             // if the length is different
//             // it's fairly obvious
//             if (len != lastlen) {
//                 // just make sure the loop finishes early
//                 last = [];
//             }

//             // go check every element in order
//             for (var i = 0; i < len; i++) {
//                 if (current[i] !== last[i]) {
//                     callback();
//                     last = current;
//                     lastlen = len;
//                     break;
//                 }
//             }

//             // over, and over, and over again
//             setTimeout(check, delay);

//         }, delay);
//     }

//     //
//     //  Check for mutation events support
//     //

//     var support: any = {};

//     var el = document.documentElement;
//     var remain = 3;

//     // callback for the tests
//     function decide() {
//         if (support.DOMNodeInserted) {
//             window.addEventListener("DOMContentLoaded", function () {
//                 if (support.DOMSubtreeModified) { // for FF 3+, Chrome
//                     el.addEventListener('DOMSubtreeModified', callback, false);
//                 } else { // for FF 2, Safari, Opera 9.6+
//                     el.addEventListener('DOMNodeInserted', callback, false);
//                     el.addEventListener('DOMNodeRemoved', callback, false);
//                 }
//             }, false);
//         } else if ((document as any).onpropertychange) { // for IE 5.5+
//             (document as any).onpropertychange = callback;
//         } else { // fallback
//             naive();
//         }
//     }

//     // checks a particular event
//     function test(event: any) {
//         el.addEventListener(event, function fn() {
//             support[event] = true;
//             el.removeEventListener(event, fn, false);
//             if (--remain === 0) decide();
//         }, false);
//     }

//     // attach test events
//     if (window.addEventListener) {
//         test('DOMSubtreeModified');
//         test('DOMNodeInserted');
//         test('DOMNodeRemoved');
//     } else {
//         decide();
//     }

//     // do the dummy test
//     var dummy = document.createElement("div");
//     el.appendChild(dummy);
//     el.removeChild(dummy);

//     // expose
//     (window as any).onDomChange = onDomChange;
// })(window);