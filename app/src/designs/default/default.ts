const API = require('../../api');
const main = require('../../js/main');
const webview = require('../../js/webview');

let clicks = 0;

document.querySelector(".new-tab").addEventListener("click", e => {
    const id = parseInt($('.new-tab').prev().attr('data-id'));
    const zIndex = parseInt($(`.tabs li[data-id="${id}"]`).prev().css('z-index')) - id;

    $(`.tabs .nav-item[data-id="${id}"]`).on('click', onClickTab);

    $(`.tabs li[data-id="${id}"]`).css('z-index', zIndex);

    reorderTabs($(`.tabs .nav-item[data-id="${id}"]`), 'both')

    webview.onWebViewCreated(id);
});

export function addWebviewListeners(wv: any) {
    wv.addEventListener('new-window', () => {
        reorderTabs($('.nav-link.active'), 'both');
    });
}

export function addTabListeners(id: Number) {
    const $tab = $(`.tabs li[data-id="${id}"]`);

    $tab.on('click', onClickTab);
}

export function onTabCreated(id: Number = undefined) {
    reorderTabs($(`.tabs li[data-id="${id}"]`), 'both');
}

function onClickTab(e: any) {
    if ($(e.target).hasClass('nav-item')) {
        const $target = $(e.target);

        reorderTabs($target, 'both')
    } else {
        const $target = $(e.target).parents('li.nav-item');

        reorderTabs($target, 'both')
    }
}

export function reorderTabs($target: any, side: string) {
    _reorderTabs($target, side);
}

export function _reorderTabs($target: any, side: string) {
    let zIndex = 0;

    switch (side) {
        case 'left':
            $target.prevAll().each((i: any, item: any) => {
                $(item).css('z-index', zIndex - 1);
                $(item).removeClass('after').addClass('before');
                zIndex--;
            });

            break;
        case 'right':
            $target.nextAll().each((i: any, item: any) => {
                if ($(item).hasClass('nav-item')) {
                    $(item).css('z-index', zIndex - 1);
                    $(item).removeClass('before').addClass('after');
                    zIndex--;
                }
            });

            break;
        case 'both':
            reorderTabs($target, 'left');
            reorderTabs($target, 'right');

            break;
        default:
            $target.prevAll().each((i: any, item: any) => {
                $(item).css('z-index', zIndex - 1);
                $(item).addClass('before');
                zIndex--;
            });

            break;
    }
}

jQuery.fn.reverse = [].reverse;

module.exports.reorderTabs = reorderTabs;
module.exports.addWebviewListeners = addWebviewListeners;
module.exports.addTabListeners = addTabListeners;