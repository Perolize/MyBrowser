import { remote } from 'electron';
import * as isUrl from 'is-url';
import * as normalizeUrl from 'normalize-url';
import * as settings from '../settings';
import * as webview from './webview';
import * as url from './url';
import * as contextMenu from './contextMenu';

const selectedSearchEngine = settings.selectedSearchEngine;

let isTyping = false;
let input;

// remote.getCurrentWindow().on('resize', () => {
//     const win = remote.getCurrentWindow();

//     const winMax = document.querySelector(".win-max .button-img-maximize") as HTMLElement;
//     const winUnmax = document.querySelector(".win-max .button-img-restore") as HTMLElement;

//     if (win.isMaximized() && winUnmax.style.display !== "") {
//         winUnmax.style.display = "";
//         winMax.style.display = "none";
//     } else if (!win.isMaximized() && winUnmax.style.display === "") {
//         winUnmax.style.display = "none";
//         winMax.style.display = "";
//     }
// });

$(document).ready(() => {
    const window = remote.getCurrentWindow();

    // if (window.isMaximized()) {
    //     const winMax = document.querySelector(".win-max .button-img-maximize") as HTMLElement;
    //     const winUnmax = document.querySelector(".win-max .button-img-restore") as HTMLElement;

    //     winUnmax.style.display = "";
    //     winMax.style.display = "none";
    // }

    webview.render('blank', 'mybrowser://blank');
    webview.onWebViewCreated(0);
});

// document.querySelector(".win-min").addEventListener("click", () => {
//     const window = remote.getCurrentWindow();
//     window.minimize();
// });

// document.querySelector(".win-max").addEventListener("click", () => {
//     const window = remote.getCurrentWindow();

//     const winMax = document.querySelector(".win-max .button-img-maximize") as HTMLElement;
//     const winUnmax = document.querySelector(".win-max .button-img-restore") as HTMLElement;

//     if (!window.isMaximized()) {
//         window.maximize();
//         winUnmax.style.display = "";
//         winMax.style.display = "none";
//     } else {
//         window.unmaximize();
//         winUnmax.style.display = "none";
//         winMax.style.display = "";
//     }
// });

// document.querySelector(".win-unmax").addEventListener("click", () => {
//     const window = remote.getCurrentWindow();

//     const winMax = document.querySelector(".win-max .button-img-maximize") as HTMLElement;
//     const winUnmax = document.querySelector(".win-max .button-img-restore") as HTMLElement;

//     window.unmaximize();
//     winUnmax.style.display = "none";
//     winMax.style.display = "";
// });

// document.querySelector(".win-cls").addEventListener("click", () => {
//     const window = remote.getCurrentWindow();
//     window.close();
// });

$('.tabs .nav-item').on('click', onClickTab);

$('.nav-item .audio').on('click', onClickAudio);

$(".nav-item .tab-close").on("click", onClickRemoveTab);

document.querySelector(".new-tab").addEventListener("click", e => {
    if (!e.defaultPrevented) {
        const id = parseInt($('.new-tab').prev().attr('data-id')) + 1;
        const tabLI = `<li class="nav-item active" data-id="${id}"><span class="fa fa-spinner"></span><img class="favicon" draggable="false" /><a class="nav-link">Blank</a><a class="audio"><i class="fa fa-volume-up"></i></a><a class="tab-close"><i class="fa fa-times"></i></a></li>`;
        const page = `<webview class="page active" src="mybrowser://blank" data-id="${id}"></webview>`

        const wv = document.querySelector('webview.active');

        $('.tabs .nav-item').removeClass('active');
        $(tabLI).insertBefore('.new-tab');
        $('.page').removeClass('active');
        $('.pages').append(page);

        $('.tabs .nav-item').removeClass('before');
        $('.tabs .nav-item').removeClass('after');

        $('.tabs .nav-item.active').prev().addClass('before');
        if ($('.tabs .nav-item.active').next().hasClass('nav-item')) {
            $('.tabs .nav-item.active').next().addClass('after');
        }

        $(`.tabs .nav-item[data-id="${id}"]`).on('click', onClickTab);
        $(`.tabs .nav-item[data-id="${id}"] .audio`).on('click', onClickAudio);
        $(".nav-item .tab-close").on("click", onClickRemoveTab);

        webview.onWebViewCreated(id);
        webview.render('blank', 'mybrowser://blank');
    }
});

document.querySelector('.navigation .back').addEventListener('click', () => {
    (document.querySelector('.page.active') as any).goBack();
    webview.onNavigating();
});

document.querySelector('.navigation .forward').addEventListener('click', () => {
    (document.querySelector('.page.active') as any).goForward();
    webview.onNavigating();
});

document.querySelector('.navigation .url').addEventListener('input', (e: any) => {
    $('webview.active').attr('input', $('.navigation .url').text());
});

document.querySelector('.navigation .url').addEventListener('keydown', (e: any) => {
    $('input.secure').hide();
    $('.navigation input.info').show();
    $('.navigation input.mybrowser').hide();
    const url = $('.navigation .url').text();

    input = url;

    if (!isTyping) {
        document.querySelector('.navigation .url').innerHTML = url;
        isTyping = true;
    }

    if (e.which === 13) {
        const search = $('.navigation .url').text();
        const url = normalizeUrl(search);

        input = '';
        isTyping = false;
        $('webview.active').removeAttr('input')
        $('.navigation .url').blur();

        if (isUrl(url) === true || $('.navigation .url').text().startsWith("mybrowser://")) {
            $('.navigation .url').html(url);
            (document.querySelector('.page.active') as any).loadURL(url);
            webview.onNavigating();
        } else {
            searchFor(search);
        }
    }
});

$('.navigation .url').on('focus', () => {
    const url = $('.navigation .url').text();
    document.querySelector('.navigation .url').classList.add('typing');

    var range = document.createRange();
    range.selectNodeContents(document.querySelector('.navigation .url'));
    var sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);

    isTyping = true;
});

$('.navigation .url').on('focusout', () => {
    document.querySelector('.navigation .url').classList.remove('typing');

    var sel = window.getSelection();
    sel.removeAllRanges();

    isTyping = false;
});

document.querySelector('.navigation .refresh').addEventListener('click', (e: any) => {
    (document.querySelector('.pages .page.active') as any).reload();
});


export function createNewTab(id: number, url: string = 'mybrowser://blank') {
    const tabLI = `<li class="nav-item" data-id="${id}"><span class="fa fa-spinner"></span><img class="favicon" draggable="false" /><a class="nav-link">Blank</a><a class="audio"><i class="fa fa-volume-up"></i></a><a class="tab-close"><i class="fa fa-times"></i></a></li>`;
    const page = `<webview class="page" src="${url}" data-id="${id}"></webview>`

    // $('.tabs .nav-item').removeClass('active');
    $(tabLI).insertBefore('.new-tab');
    // $('.page').removeClass('active');
    $('.pages').append(page);

    // $('.tabs .nav-item').removeClass('before');
    // $('.tabs .nav-item').removeClass('after');

    // $('.tabs .nav-item.active').prev().addClass('before');
    // if ($('.tabs .nav-item.active').next().hasClass('nav-item')) {
    //     $('.tabs .nav-item.active').next().addClass('after');
    // }

    $(`.tabs .nav-item[data-id="${id}"]`).on('click', onClickTab);
    $(`.tabs .nav-item[data-id="${id}"] .audio`).on('click', onClickAudio);
    $(".nav-item .tab-close").on("click", onClickRemoveTab);

    webview.onWebViewCreated(id);
    if (url === 'mybrowser://blank') {
        webview.render('blank', 'mybrowser://blank');
    }
}

export function onClickTab() {
    const id = parseInt($(this).attr('data-id'));

    if (id !== parseInt($('.tabs li.active').attr('data-id'))) {

        $('.tabs .nav-item.active').removeClass('active');
        $('.page.active').removeClass('active');

        $(`[data-id='${id}']`).addClass('active');

        $('.tabs .nav-item').removeClass('before');
        $('.tabs .nav-item').removeClass('after');

        $(this).prev().addClass('before');
        if ($(this).next().hasClass('nav-item')) {
            $(this).next().addClass('after');
        }

        if (isTyping) {
            input = $('.navigation .url').text();
        }

        if ($(`webview[data-id=${id}]`).attr('input') !== (undefined || '')) {
            console.log($(`webview[data-id=${id}]`).attr('input'))

            setTimeout(() => {
                $('.navigation .url').text($(`webview[data-id=${id}]`).attr('input'));
            }, 3);

            isTyping = true;
        } else {
            isTyping = false;
        }

        webview.setTitle(id)
        webview.onNavigating(id);
    }
}

export function onClickAudio(e: any) {
    let id;
    if (parseInt(e.target.parentElement.parentElement.getAttribute('data-id')) !== undefined) {
        id = parseInt(e.target.parentElement.parentElement.getAttribute('data-id'));
    } else {
        console.log(e.target)
        id = parseInt(e.target.parentElement.parentElement.parentElement.getAttribute('data-id'));
    }
    const page = document.querySelector(`.pages .page[data-id="${id}"]`) as any;
    const target = document.querySelector(`.tabs li[data-id="${id}"] .audio i`) as HTMLElement;
    console.log(target)

    target.parentElement.classList.toggle('muted');
    target.classList.toggle('fa-volume-up');
    target.classList.toggle('fa-volume-off');
    page.setAudioMuted(!page.isAudioMuted());
}

export function onClickRemoveTab(e: Event) {
    const target = e.target as HTMLElement;
    const id = parseInt(target.parentElement.parentElement.getAttribute('data-id'));

    let before: any;
    let after: any;
    let didCreate: any;
    let activeId: any;

    $(`.new-tab`).addClass('lol').removeClass('lol').promise()
        .then(() => {
            before = document.querySelector(`li[data-id="${id}"]`).previousElementSibling;
            after = document.querySelector(`li[data-id="${id}"]`).nextElementSibling;

            didCreate = (before === null && after === document.querySelector('.new-tab'));

            $(`.tabs li[data-id="${id}"]`).off();
        })
        .then(() => {
            $(`[data-id="${id}"]`).remove();
            if ($('.tabs .nav-item.active').length > 0) {
                activeId = $('.tabs .nav-item.active').attr('data-id');
            }
            // $('.tabs .nav-item').removeClass('active');
        })
        .then(() => {
            if (didCreate) {
                console.log(after === null, before === null)
                console.log(didCreate)
                // createNewTab(id);
                remote.getCurrentWindow().close();

                return;
            }

            if (before !== null) {
                const newId = before.getAttribute('data-id');
                $(`[data-id="${newId}"]`).addClass('active').promise()
                    .then(() => {
                        $('.tabs .nav-item').removeClass('before');
                        $('.tabs .nav-item').removeClass('after');
                    })
                    .then(() => {
                        $('.tabs .nav-item.active').prev().addClass('before');
                        if ($('.tabs .nav-item.active').next().hasClass('nav-item')) {
                            $('.tabs .nav-item.active').next().addClass('after');
                        }
                    })
                    // .then(() => {
                    //     $(`.tabs .nav-item[data-id="${id}"]`).on('click', onClickTab);
                    //     $(".nav-item .tab-close").on("click", onClickRemoveTab);
                    // })
                    .then(() => {
                        webview.setTitle(parseInt(newId));
                        webview.onNavigating(parseInt(newId));
                    });

                return;
            } else if (after !== null && before !== document.querySelector('.new-tab')) {
                const newId = after.getAttribute('data-id');
                $(`[data-id="${newId}"]`).addClass('active').promise()
                    .then(() => {
                        $('.tabs .nav-item').removeClass('before');
                        $('.tabs .nav-item').removeClass('after');
                    })
                    .then(() => {
                        $('.tabs .nav-item.active').prev().addClass('before');
                        if ($('.tabs .nav-item.active').next().hasClass('nav-item')) {
                            $('.tabs .nav-item.active').next().addClass('after');
                        }
                    })
                    // .then(() => {
                    //     $(`.tabs .nav-item[data-id="${id}"]`).on('click', onClickTab);
                    //     $(".nav-item .tab-close").on("click", onClickRemoveTab);
                    // })
                    .then(() => {
                        webview.setTitle(parseInt(newId));
                        webview.onNavigating(parseInt(newId));
                    });

                return;
            }
        })
        .then(() => {
            if ($('.tabs .nav-item.active').length > 1) {
                $(`.tabs .nav-item`).removeClass('active');
                $(`.tabs .nav-item[data-id="${activeId}"]`).addClass('active');
            }
        });
}

function getURL() {
    let url = (document.querySelector('.pages webview.active') as any).getURL();
    $('.bottombar .navigation .url').html(url)
}

export function getSuggestionsMain(name: String, url: any) {
    return new Promise((fulfill, reject) => {
        let suggestions: any[] = [];

        switch (name) {
            case 'Google':
                fetch(url)
                    .then(response => {
                        return response.json();
                    })
                    .then(results => {
                        results[1].forEach((v: any, i: any) => {
                            suggestions.push(results[1][i]);
                        });
                    });
                break;
            case 'DuckDuckGo':
                fetch(url)
                    .then(response => {
                        return response.json();
                    })
                    .then((results: any) => {
                        results.forEach((v: any, i: any) => {
                            suggestions.push(results[i].phrase);
                        });
                    });
                break;
            default:
                fetch(url)
                    .then(response => {
                        return response.json();
                    })
                    .then((results: any) => {
                        results.forEach((v: any, i: any) => {
                            suggestions.push(results[i].phrase);
                        });
                    });
                break;
        }

        fulfill(suggestions);
    });
}

export function getSuggestions(name: String, url: any, id: Number = undefined) {
    let suggestions: any[] = [];
    let wv: any;
    if (id !== undefined) {
        wv = document.querySelector(`.pages webview[data-id="${id}"]`) as any;
    } else {
        wv = document.querySelector('.pages webview.active') as any;
    }

    switch (name) {
        case 'Google':
            fetch(url)
                .then(response => {
                    return response.json();
                })
                .then(results => {
                    results[1].forEach((v: any, i: any) => {
                        suggestions.push(results[1][i]);
                    });
                    wv.send('getSuggestions', suggestions);
                });
            break;
        case 'DuckDuckGo':
            fetch(url)
                .then(response => {
                    return response.json();
                })
                .then((results: any) => {
                    results.forEach((v: any, i: any) => {
                        suggestions.push(results[i].phrase);
                    });
                    wv.send('getSuggestions', suggestions);
                });
            break;
        default:
            fetch(url)
                .then(response => {
                    return response.json();
                })
                .then((results: any) => {
                    results.forEach((v: any, i: any) => {
                        suggestions.push(results[i].phrase);
                    });
                    wv.send('getSuggestions', suggestions);
                });
            break;
    }

    return suggestions;
}

export function search(input: string) {
    const url = normalizeUrl(input);

    document.querySelector('#autocomplete').setAttribute('hidden', '');

    if (isUrl(url) === true || input.startsWith("mybrowser://")) {
        $('.navigation .url').text(url);
        (document.querySelector('.page.active') as any).loadURL(url);
        webview.onNavigating();
    } else {
        searchFor(input);
    }
}

function searchFor(input: String) {
    const url = selectedSearchEngine.search(input);

    $('.navigation .url').html(url);
    (document.querySelector('.page.active') as any).loadURL(url);

    webview.onNavigating();
}

module.exports.isTyping = isTyping;
module.exports.search = search;
module.exports.onClickTab = onClickTab;
module.exports.onClickAudio = onClickAudio;
module.exports.onClickRemoveTab = onClickRemoveTab;
module.exports.getSuggestionsMain = getSuggestionsMain;
module.exports.getSuggestions = getSuggestions;