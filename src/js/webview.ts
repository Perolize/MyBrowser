import * as electron from 'electron';
import * as isUrl from 'is-url';
import * as main from './main';
import * as urlModule from './url';
import * as downloadModule from './download';
import * as contextMenu from './contextMenu';
const window = electron.remote.getCurrentWindow()
const ipcRenderer = electron.ipcRenderer;

let contextMenuTarget: any;
let grantedSites: any[] = [];
let deniedSites: any[] = [];

export function onWebViewCreated(id: Number = undefined) {
    let wv: any;
    if (id !== undefined) {
        wv = document.querySelector(`.pages webview[data-id="${id}"]`);
    } else {
        wv = document.querySelector('.pages webview.active');
    }

    let isLoaded = false;

    wv.addEventListener('new-window', (e: any) => {
        const id = parseInt($('.tabs li').last().attr('data-id')) + 1;
        const prevTab = $('.tabs li.active');
        const url = e.url || e.detail;
        const tabLI = `<li class="nav-item active" data-id="${id}"><span class="fa fa-spinner"></span><img class="favicon" draggable="false" /><a class="nav-link">Blank</a><a class="audio"><i class="fa fa-volume-up"></i></a><a class="tab-close"><i class="fa fa-times"></i></a></li>`;
        const page = `<webview class="page active" src="${url}" data-id="${id}"></webview>`

        $('.tabs .nav-item').removeClass('active');
        $(tabLI).insertAfter(prevTab);
        $('.page').removeClass('active');
        $('.pages').append(page);

        $('.tabs .nav-item').removeClass('before');
        $('.tabs .nav-item').removeClass('after');

        $('.tabs .nav-item.active').prev().addClass('before');
        if ($('.tabs .nav-item.active').next().hasClass('nav-item')) {
            $('.tabs .nav-item.active').next().addClass('after');
        }

        $('.tabs .nav-item').on('click', main.onClickTab);
        $(`.tabs .nav-item[data-id="${id}"] .audio`).on('click', main.onClickAudio);
        $(".nav-item .tab-close").on("click", main.onClickRemoveTab);

        onWebViewCreated(id);
    });

    wv.addEventListener('dom-ready', () => {
        downloadModule.addListenerForDownload();
        contextMenu.addMenu(id);
        onNavigating(id);
        setTitle(id);
        setURL(id);
        addListenerForFavicon(id);
        onAskPermission(id);
        if (!isLoaded) {
            (document.querySelector('.pages .page.active') as any).reload();
            isLoaded = true;
        }
    }, { once: true });

    wv.addEventListener('will-navigate', (e: any) => {
        onNavigating(id)
        checkURL(e.url, id);
    });

    wv.addEventListener('did-navigate', (e: any) => {
        onNavigating(id)
        checkURL(e.url, id);
        (document.querySelector(`.tabs li[data-id="${id}"] .favicon`) as any).style.display = 'none';
    });

    wv.addEventListener('did-navigate-in-page', (e: any) => {
        onNavigating(id)
        checkURL(e.url, id);
    });

    wv.addEventListener('enter-html-full-screen', () => {
        window.setFullScreen(true);
        $('.navbar').hide();
        $('.linkHint').hide();
        $('.pages').css('height', '100vh');
        document.querySelector('.pages .page.active').setAttribute('fullscreen', '');
    });

    wv.addEventListener('leave-html-full-screen', () => {
        window.setFullScreen(false);
        $('.navbar').show();
        $('.pages').css('height', '');
        document.querySelector('.pages .page.active').removeAttribute('fullscreen');
    });

    wv.addEventListener('media-started-playing', (e: any) => {
        (document.querySelector(`.topbar .tabs li[data-id="${id}"] a.audio`) as any).style.display = 'block';
        document.querySelector(`.topbar .tabs li[data-id="${id}"] a.nav-link`).classList.add('audioPlaying');
    });

    wv.addEventListener('media-paused', (e: any) => {
        (document.querySelector(`.topbar .tabs li[data-id="${id}"] a.audio`) as any).style.display = '';
        document.querySelector(`.topbar .tabs li[data-id="${id}"] a.nav-link`).classList.remove('audioPlaying');
    });

    wv.addEventListener('did-start-loading', () => {
        $('.navigation .refresh').val('');
        $('.nav-item.active').addClass('loading');

        wv.removeAttribute('loaded');
    });

    wv.addEventListener('did-stop-loading', () => {
        $('.navigation .refresh').val('');
        $('.nav-item.active').removeClass('loading');

        // $.get('https://twemoji.maxcdn.com/2/twemoji.min.js', (script: any) => {
        //     wv.executeJavaScript(script);
        //     wv.executeJavaScript('twemoji.parse(document.body)');
        //     wv.insertCSS('img.emoji { height: 1em; width: 1em; margin: 0 .05em 0 .1em; vertical-align: -0.1em; }');
        // });
    });

    wv.addEventListener('did-fail-load', (e: any) => {
        if (e.errorDescription !== '') {
            render('error', e.validatedURL, e.errorCode, e.errorDescription, id);
        }
        console.log(e.errorDescription);
    });

    addListenerForTitle(id);
    contextMenu.onDevToolsOpen();
    contextMenu.onOpenInNewTab();
    contextMenu.onContextMenu();
    onHoverLink(id);
    onOpenView(id);
    onSearch();
    onShow(id)
}

export function setURL(id: Number = undefined) {
    let wv;
    if (id !== undefined) {
        wv = document.querySelector(`.pages webview[data-id="${id}"]`) as any;
    } else {
        wv = document.querySelector('.pages webview.active') as any;
    }

    const url = wv.getURL() || 'mybrowser://blank';
    $('.bottombar .navigation .url').html(url)
    urlModule.styleUrl();
}

export function setTitle(id: Number = undefined) {
    let wv;
    if (id !== undefined) {
        wv = document.querySelector(`.pages webview[data-id="${id}"]`) as any;
    } else {
        wv = document.querySelector('.pages webview.active') as any;
    }

    // if (wv.isLoading()) {
    //     addListenerForTitle();
    //     setURL();
    // } else {
    const title: string = wv.getTitle();
    document.title = `${title} - MyBrowser`;
    $('.tabs .nav-item.active .nav-link').text(title)

    setURL(id);
    urlModule.isSecure();
    // }
}

export function addListenerForFavicon(id: Number = undefined) {
    let wv;
    if (id !== undefined) {
        wv = document.querySelector(`.pages webview[data-id="${id}"]`) as any;
    } else {
        wv = document.querySelector('.pages webview.active') as any;
    }

    const elem = document.querySelector(`.tabs li[data-id="${id}"] .favicon`) as HTMLImageElement;

    if (elem.src === '') {
        $(elem).css('display', 'none');
    }

    wv.addEventListener('page-favicon-updated', (e: any) => {
        if (id === undefined) {
            const target = e.target as HTMLElement;
            id = parseInt(target.getAttribute('data-id'));
        }

        const elem = document.querySelector(`.tabs li[data-id="${id}"] .favicon`) as HTMLElement;

        if (e.favicons.length > -1) {
            $(elem).css('display', '');
            $(elem).attr('src', e.favicons[0]);
            $(elem).css('margin', '0').promise().then(() => {
                $(elem).css('margin', '');
            });
        } else {
            $(elem).css('display', 'none');
        }

        const webviewError = `<webview class="error" src="${e.favicons[0]}"></webview>`
        $('.pages').append(webviewError);

        (document.querySelectorAll('webview.error') as any).forEach((v: any, i: any) => {
            document.querySelectorAll('webview.error')[i].addEventListener('did-get-response-details', (e: any) => {
                if (e.httpResponseCode !== 200) {
                    $(elem).css('display', 'none');
                }
                e.target.remove();
            });
        });

        $('.error').remove();
    });
}

export function addListenerForTitle(id: Number = undefined) {
    let wv: any;
    let link: any;
    if (id !== undefined) {
        wv = document.querySelector(`.pages webview[data-id="${id}"]`) as any;
        link = document.querySelector(`.tabs li[data-id="${id}"]`) as any;
    } else {
        wv = document.querySelector('.pages webview.active') as any;
        link = document.querySelector(`.tabs li.active`) as any;
    }

    wv.addEventListener('page-title-set', function (e: any) {
        const title: string = wv.getTitle();
        const url = wv.getURL();

        $(link).children('.nav-link').text(title)
        document.title = `${title} - MyBrowser`;
        if (!url.startsWith('mybrowser')) {
            $('.bottombar .navigation .url').text(url)
        }

        urlModule.styleUrl();
        urlModule.isSecure();
    });
}

export function checkURL(url: string, id: Number = undefined) {
    let wv;
    if (id !== undefined) {
        wv = document.querySelector(`.pages webview[data-id="${id}"]`);
    } else {
        wv = document.querySelector('.pages webview.active');
    }

    if (url.startsWith('mybrowser://')) {
        wv.setAttribute('nodeintegration', '');
        render(url.substr(12), url);
    } else {
        wv.removeAttribute('nodeintegration');
    }
}

export function onNavigating(id: Number = undefined) {
    let wv;
    if (id !== undefined) {
        wv = document.querySelector(`.pages webview[data-id="${id}"]`);
    } else {
        wv = document.querySelector('.pages webview.active');
    }
    const page = wv as any;
    const elem = document.querySelector(`.tabs li[data-id="${page.getAttribute('data-id')}"] .favicon`) as HTMLImageElement;

    if (page.canGoForward()) {
        $('.forward').addClass('active');
        $('.info').addClass('forwardActive');
        $('input.mybrowser').addClass('forwardActive');
        $('.url').addClass('forwardActive');
    } else {
        $('.forward').removeClass('active');
        $('.info').removeClass('forwardActive');
        $('input.mybrowser').removeClass('forwardActive');
        $('.url').removeClass('forwardActive');
    }

    if (!page.canGoBack()) {
        $('.back').attr('disabled', '');
    } else {
        $('.back').prop('disabled', false);
    }

    setTimeout(() => {
        $('.navigation .url').text(page.getAttribute('src'));
        urlModule.styleUrl()
    }, 1);

    addListenerForFavicon(parseInt(page.getAttribute('data-id')));
    wv.removeAttribute('loaded');

    wv.setAttribute('preload', './js/pages/all.js');
}

// export function addMenu(id: Number = undefined) {
//     let webview;
//     if (id !== undefined) {
//         webview = document.querySelector(`.pages webview[data-id="${id}"]`);
//     } else {
//         webview = document.querySelector('.pages webview.active');
//     }

//     contextMenu.addMenu(id);

//     // webview.setAttribute('preload', `${__dirname}/webview/contextMenu.js`);
// }

// export function onContextMenu() {
//     electron.ipcRenderer.on('contextmenu', (e, target) => {
//         contextMenuTarget = target;
//         console.log(target)
//     });
// }

export function onHoverLink(id: Number = undefined) {
    let wv;
    if (id !== undefined) {
        wv = document.querySelector(`.pages webview[data-id="${id}"]`);
    } else {
        wv = document.querySelector('.pages webview.active');
    }
    wv.addEventListener('update-target-url', (e: any) => {
        const linkHint = document.querySelector('.linkHint') as HTMLElement;
        if (e.url !== '' && !document.querySelector('.pages .page.active').hasAttribute('fullscreen')) {
            linkHint.style.display = 'block';
            linkHint.textContent = e.url;
        } else {
            linkHint.style.display = 'none';
        }
    });
}

export function render(page: string, url: string, code: number = 200, desc: string = 'OK', id: Number = undefined) {
    let wv: any;
    if (id !== undefined) {
        wv = document.querySelector(`.pages webview[data-id="${id}"]`) as any;
    } else {
        wv = document.querySelector('.pages webview.active') as any;
    }

    wv.setAttribute('preload', `./js/pages/all.js`);
    // wv.setAttribute('nodeintegration', '')

    wv.addEventListener('dom-ready', () => {
        // wv.loadURL(`mybrowser://${page}`)
        document.querySelector('.navigation .url').innerHTML = url;
        urlModule.styleUrl();
    }, { once: true });
}

export function onSearch(id: Number = undefined) {
    let wv: any;
    if (id !== undefined) {
        wv = document.querySelector(`.pages webview[data-id="${id}"]`) as any;
    } else {
        wv = document.querySelector('.pages webview.active') as any;
    }

    // const ipc = require("electron-safe-ipc/host");
    // electron.ipcRenderer.once('search', (e, msg) => {
    //     console.log(msg)
    //     main.search(msg);
    // });

    wv.addEventListener('ipc-message', (e: any) => {
        if (e.channel === 'search') {
            main.search(e.args[0])
        } else if (e.channel === 'getSuggestions') {
            const name = e.args[0].name;
            const url = e.args[0].url;

            main.getSuggestions(name, url);
        }
    });
}

export function onOpenView(id: Number = undefined) {
    let wv: any;
    if (id !== undefined) {
        wv = document.querySelector(`.pages webview[data-id="${id}"]`) as any;
    } else {
        wv = document.querySelector('.pages webview.active') as any;
    }

    wv.addEventListener('ipc-message', (e: any) => {
        if (e.channel === 'webviewId' && !wv.hasAttribute('loaded')) {
            console.log('got')
            wv.send(e.channel, wv.getAttribute('data-id'));
            wv.setAttribute('loaded', '');
        }
        if (e.channel === 'open-view') {
            $('.tabs li.active').removeClass('active');
            $('.pages .page.active').removeClass('active');
            $(`[data-id="${e.args[0].webviewId}"]`).addClass('active');
        }
    });
}

export function onShow(id: Number = undefined) {
    let wv: any;
    if (id !== undefined) {
        wv = document.querySelector(`.pages webview[data-id="${id}"]`) as any;
    } else {
        wv = document.querySelector('.pages webview.active') as any;
    }

    wv.addEventListener('ipc-message', (e: any) => {
        if (e.channel === 'show') {
            console.log('received')
            const id = parseInt(wv.getAttribute('data-id'));

            $('.tabs .nav-item.active').removeClass('active');
            $('.page.active').removeClass('active');

            $(`[data-id='${id}']`).addClass('active');

            $('.tabs .nav-item').removeClass('before');
            $('.tabs .nav-item').removeClass('after');

            $(`.tabs .nav-item[data-id="${id}"]`).prev().addClass('before');
            if ($(`.tabs .nav-item[data-id="${id}"]`).next().hasClass('nav-item')) {
                $(`.tabs .nav-item[data-id="${id}"]`).next().addClass('after');
            }

            setTitle(id)
            onNavigating(id);
        }
    });
}

export function onAskPermission(id: Number = undefined) {
    let wv: any;
    if (id !== undefined) {
        wv = document.querySelector(`.pages webview[data-id="${id}"]`) as any;
    } else {
        wv = document.querySelector('.pages webview.active') as any;
    }

    wv.getWebContents().session.setPermissionRequestHandler((webContents: any, permission: any, callback: any) => {
        const url = wv.getURL();

        console.log(grantedSites, deniedSites)

        const grant = grantedSites.indexOf(url) > -1;
        const deny = deniedSites.indexOf(url) > -1;

        if (grant) {
            callback(true)
        } else if (deny) {
            callback(false)
        } else if (!grant && !deny) {
            const ask = confirm(permission)
            callback(ask)

            if (ask) {
                grantedSites.push(url)
            } else {
                deniedSites.push(url);
            }
        }
    });
}

module.exports.onWebViewCreated = onWebViewCreated;
module.exports.addListenerForFavicon = addListenerForFavicon;
module.exports.setTitle = setTitle;
module.exports.onNavigating = onNavigating;
module.exports.render = render;
// module.exports.addMenu = addMenu;