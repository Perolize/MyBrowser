import * as storage from 'electron-storage';
import * as main from '../main';
import * as webview from '../webview';
import * as custom from '../../designs/default/default';

export function newTab(tabUrl = 'mybrowser://blank', open: boolean = true, id: any = parseInt($('.new-tab').prev().attr('data-id')) + 1, callback: any = undefined) {
    const tabLI = `<li class="nav-item ${open ? 'active' : ''}" data-id="${id}"><span class="fa fa-spinner"></span><img class="favicon" draggable="false" /><a class="nav-link">Blank</a><a class="audio"><i class="fa fa-volume-up"></i></a><a class="tab-close"><i class="fa fa-times"></i></a></li>`;
    const page = `<webview class="page ${open ? 'active' : ''}" src="${tabUrl}" data-id="${id}"></webview>`

    const wv = document.querySelector('webview.active');

    if (open) {
        $('.tabs .nav-item').removeClass('active');
        $('.page').removeClass('active');
    }
    $(tabLI).insertBefore(`.new-tab`);
    $('.pages').append(page);

    if (open) {
        $('.tabs .nav-item').removeClass('before');
        $('.tabs .nav-item').removeClass('after');

        $('.tabs .nav-item.active').prev().addClass('before');
        if ($('.tabs .nav-item.active').next().hasClass('nav-item')) {
            $('.tabs .nav-item.active').next().addClass('after');
        }
    }

    $(`.tabs .nav-item[data-id="${id}"]`).attr('time', Date.now())

    $(`.tabs .nav-item[data-id="${id}"]`).on('click', main.onClickTab);
    $(`.tabs .nav-item[data-id="${id}"] .audio`).on('click', main.onClickAudio);
    $(".nav-item .tab-close").on("click", main.onClickRemoveTab);

    $('.tabs li').each((i: any) => {
        $(`.tabs li:eq(${i})`).attr('pos', i);
    });

    webview.onWebViewCreated(id);
    custom.onTabCreated(id);

    if (tabUrl === 'mybrowser://blank') {
        webview.render('blank', 'mybrowser://blank');
    }

    if (callback) {
        callback.call(document.querySelector(`.tabs .nav-item[data-id="${id}"]`), id);
    }
}

export function onDestroy(wv: any, tab: any) {
    const id = wv.getAttribute('data-id');
    const pos = tab.getAttribute('pos');
    const url = wv.src;

    storage.isPathExists('temp/closedTabs.json')
        .then((itDoes: boolean) => {
            if (!itDoes) {
                storage.set('temp/closedTabs', { tabs: [{ url: url, id: wv.getAttribute('data-id'), pos: pos, time: Date.now() }] })
                    .then(() => {
                        console.log(pos)
                        console.log('saved!');
                    });
            } else {
                storage.get('temp/closedTabs', (err: any, data: any) => {
                    if (!err) {
                        console.log(tab)
                        data.tabs.push({ url: url, id: wv.getAttribute('data-id'), pos: pos, time: Date.now() });
                        console.log(data)

                        storage.set('temp/closedTabs', data)
                            .then(() => {
                                console.log('updated list!');
                            });
                    } else {
                        console.error(err);
                    }
                });
            }
        });
}

export function restoreTab() {
    storage.isPathExists('temp/closedTabs.json')
        .then((itDoes: boolean) => {
            if (itDoes) {
                storage.get('temp/closedTabs', (err: any, data: any) => {
                    if (!err && data.tabs.length > 0) {
                        const tab = data.tabs[data.tabs.length - 1];
                        newTab(tab.url, true, undefined, (id: any) => {
                            $(this).attr('time', tab.time);

                            $('.tabs li').each((i: any) => {
                                $(`.tabs li:eq(${i})`).attr('pos', i);
                            });

                            $(`.tabs li[pos="${tab.pos}"]`).length > 0 ? $(`.tabs li[data-id="${id}"]`).insertBefore(`.tabs li[pos="${tab.pos}"]`) : $(`.tabs li[data-id="${id}"]`).insertBefore(`.new-tab`);

                            $('.tabs li').each((i: any) => {
                                $(`.tabs li:eq(${i})`).attr('pos', i);
                            });

                            data.tabs.pop()

                            storage.set('temp/closedTabs', data)
                                .then(() => {
                                    console.log('restored tab!');
                                });
                        });
                    } else {
                        console.error(err);
                    }
                });
            }
        });
}

module.exports.newTab = newTab;
module.exports.onDestroy = onDestroy;
module.exports.restoreTab = restoreTab;