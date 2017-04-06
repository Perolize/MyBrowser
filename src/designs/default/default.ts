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

function onClickTab(e: any) {
    if ($(e.target).hasClass('nav-item')) {
        const $target = $(e.target);

        reorderTabs($target, 'both')
    } else {
        const $target = $(e.target).parents('li.nav-item');

        reorderTabs($target, 'both')
    }
}

function reorderTabs($target: any, side: string) {
    let zIndex = 0;

    switch (side) {
        case 'left':
            $target.prevAll().each((i: any, item: any) => {
                console.log(item)
                $(item).css('z-index', zIndex - 1);
                $(item).addClass('before');
                zIndex--;
            });

            break;
        case 'right':
            $target.nextAll().each((i: any, item: any) => {
                if ($(item).hasClass('nav-item')) {
                    console.log(item)
                    $(item).css('z-index', zIndex - 1);
                    $(item).addClass('after');
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