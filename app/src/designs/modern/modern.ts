import * as webview from '../../js/webview';

$('input.refresh').before('<span class="seperator"></span>')

$(document).ready(() => {
    replaceRefresh();
    // replaceArrows();
});

export function addWebviewListeners(wv: any) {
    wv.addEventListener('will-navigate', (e: any) => {
        e.preventDefault();

        enableForward(wv);
    });

    wv.addEventListener('did-navigate', (e: any) => {
        e.preventDefault();

        enableForward(wv);
    });

    wv.addEventListener('did-navigate-in-page', (e: any) => {
        e.preventDefault();

        enableForward(wv);
    });

    wv.addEventListener('did-start-loading', (e: any) => {
        e.preventDefault();

        const id = wv.getAttribute('data-id');

        $('.navigation .refresh').css('display', 'none');
        $('.navigation input.loading').css('display', '');
        $(`.nav-item[data-id="${id}"]`).addClass('loading');

        wv.removeAttribute('loaded');
    });

    wv.addEventListener('did-stop-loading', (e: any) => {
        e.preventDefault();

        const id = wv.getAttribute('data-id');

        $('.navigation .refresh').css('display', '');
        $('.navigation input.loading').css('display', 'none');
        $(`.nav-item[data-id="${id}"]`).removeClass('loading');
    });
}

function replaceRefresh() {
    $('.bottombar .navigation span.seperator').appendTo('div.awesomplete');
    $('.bottombar .navigation input.refresh').appendTo('div.awesomplete');
    $('.bottombar .navigation input.refresh').before('<img class="refresh" src="mybrowser://img/titlebar/Refresh.png">');
    $('.bottombar .navigation input.refresh').remove();
    $('.bottombar .navigation img.refresh').before('<input class="loading refresh fa" type="button" value="&#xf00d;" style="display: none;">')

    $('.navigation img.refresh').on('click', (e: any) => {
        (document.querySelector('.pages .page.active') as any).reload();
    });
}

function replaceArrows() {
    $('.bottombar .navigation input.btn.back').before('<img class="btn back" src="mybrowser://img/titlebar/Arrow-L.svg">');
    $('.bottombar .navigation input.btn.back').remove();

    $('.bottombar .navigation input.btn.forward').before('<img class="btn forward" src="mybrowser://img/titlebar/Arrow-R.svg">');
    $('.bottombar .navigation input.btn.forward').remove();

    $('.navigation img.btn.back').on('click', (e: any) => {
        (document.querySelector('.page.active') as any).goBack();
        webview.onNavigating();
    });

    $('.navigation img.btn.forward').on('click', (e: any) => {
        (document.querySelector('.page.active') as any).goForward();
        webview.onNavigating();
    });
}

function enableForward(wv: any) {
    if (wv.canGoForward()) {
        $('.forward').removeAttr('disabled');
    } else {
        $('.forward').attr('disabled', '');
    }
}

module.exports.addWebviewListeners = addWebviewListeners;