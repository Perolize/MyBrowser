import * as main from '../main';
import * as webview from '../webview';
import * as custom from '../../designs/default/default';

export function newTab(tabUrl = 'mybrowser://blank', open: boolean = true, id: any = parseInt($('.new-tab').prev().attr('data-id')) + 1) {
    const tabLI = `<li class="nav-item ${open ? 'active' : ''}" data-id="${id}"><span class="fa fa-spinner"></span><img class="favicon" draggable="false" /><a class="nav-link">Blank</a><a class="audio"><i class="fa fa-volume-up"></i></a><a class="tab-close"><i class="fa fa-times"></i></a></li>`;
    const page = `<webview class="page ${open ? 'active' : ''}" src="${tabUrl}" data-id="${id}"></webview>`

    const wv = document.querySelector('webview.active');

    if (open) {
        $('.tabs .nav-item').removeClass('active');
        $('.page').removeClass('active');
    }
    $(tabLI).insertBefore('.new-tab');
    $('.pages').append(page);

    if (open) {
        $('.tabs .nav-item').removeClass('before');
        $('.tabs .nav-item').removeClass('after');

        $('.tabs .nav-item.active').prev().addClass('before');
        if ($('.tabs .nav-item.active').next().hasClass('nav-item')) {
            $('.tabs .nav-item.active').next().addClass('after');
        }
    }

    $(`.tabs .nav-item[data-id="${id}"]`).on('click', main.onClickTab);
    $(`.tabs .nav-item[data-id="${id}"] .audio`).on('click', main.onClickAudio);
    $(".nav-item .tab-close").on("click", main.onClickRemoveTab);

    webview.onWebViewCreated(id);
    custom.onTabCreated(id);

    if (tabUrl === 'mybrowser://blank') {
        webview.render('blank', 'mybrowser://blank');
    }
}

module.exports.newTab = newTab;