import { remote, window } from 'electron';
import * as path from 'path';
import * as isDev from 'electron-is-dev';
import * as tabs from './tab';
import * as main from './main';
import * as webview from './webview';
import { reorderTabs } from '../designs/default/default';

require('./plugins/mousetrap.min.js');

Mousetrap.bind(['ctrl+f', 'command+f'], () => {
    const search = document.querySelector('.search') as HTMLElement;

    if (search.style.display !== 'none') {
        search.style.display = 'none';
    } else {
        search.style.display = '';
        (document.querySelector('.search input.searchbox') as HTMLElement).focus();
        searchInPage();
    }
});

Mousetrap.bind(['ctrl+t', 'command+t'], () => {
    tabs.newTab();
});

Mousetrap.bind(['ctrl+n', 'command+n'], () => {
    ipcRenderer.send('new-window');
});

Mousetrap.bind(['ctrl+shift+n', 'command+shift+n'], () => {
    ipcRenderer.send('new-secret-window');
});

Mousetrap.bind(['ctrl+shift+i', 'command+shift+i', 'f12'], (e: any) => {
    if (!isDev) {
        e.preventDefault();
    }

    const wv = document.querySelector('webview.active') as any;
    wv.getWebContents().toggleDevTools();
});

Mousetrap.bind(['ctrl+tab', 'command+tab'], () => {
    // if (!e.defaultPrevented) {
    const activeTab = document.querySelector('.tabs li.active');
    let nextTab = $(activeTab).next('.nav-item');

    activeTab.classList.remove('active');
    if (nextTab.length !== 0) {
        nextTab.addClass('active');

        reorderTabs(nextTab, 'both');
    } else {
        nextTab = $(document.querySelectorAll('.tabs li')[0]);
        nextTab.addClass('active');

        reorderTabs(nextTab, 'right');
    }

    $('webview.active').removeClass('active');
    $(`webview[data-id="${nextTab.attr('data-id')}"]`).addClass('active');
    // }
});

Mousetrap.bind(['ctrl+shift+tab', 'command+shift+tab'], () => {
    const activeTab = document.querySelector('.tabs li.active');
    let nextTab = $(activeTab).prev('.nav-item');

    activeTab.classList.remove('active');
    if (nextTab.length !== 0) {
        nextTab.addClass('active');

        reorderTabs(nextTab, 'both');
    } else {
        nextTab = $(document.querySelectorAll('.tabs li')[document.querySelectorAll('.tabs li').length - 1]);
        nextTab.addClass('active');

        reorderTabs(nextTab, 'left');
    }

    $('webview.active').removeClass('active');
    $(`webview[data-id="${nextTab.attr('data-id')}"]`).addClass('active');
});

Mousetrap.bind(['ctrl+w', 'command+w', 'ctrl+f4', 'command+f4'], (e: any) => {
    e.preventDefault();

    const activeTab = document.querySelector('.tabs li.active');
    let nextTab = $(activeTab).prev('.nav-item');

    if (nextTab.length !== 0) {
        nextTab.addClass('active');

        reorderTabs(nextTab, 'both');
    } else {
        if ($(activeTab).next('.nav-item').length > 0) {
            nextTab = $(activeTab).next('.nav-item');
            nextTab.addClass('active');

            reorderTabs(nextTab, 'left');
        } else {
            remote.getCurrentWindow().close();
        }
    }

    activeTab.remove();
    $('webview.active').remove();
    $(`webview[data-id="${nextTab.attr('data-id')}"]`).addClass('active');
});

Mousetrap.bind(['ctrl+1', 'command+1'], () => {
    const activeTab = document.querySelector('.tabs li.active');
    let nextTab = $('.tabs li.nav-item:eq(0)');

    if (nextTab.length !== 0) {
        activeTab.classList.remove('active');
        nextTab.addClass('active');

        reorderTabs(nextTab, 'both');

        $('webview.active').removeClass('active');
        $(`webview[data-id="${nextTab.attr('data-id')}"]`).addClass('active');
    }
});

Mousetrap.bind(['ctrl+2', 'command+2'], () => {
    const activeTab = document.querySelector('.tabs li.active');
    let nextTab = $('.tabs li.nav-item:eq(1)');

    if (nextTab.length !== 0) {
        activeTab.classList.remove('active');
        nextTab.addClass('active');

        reorderTabs(nextTab, 'both');

        $('webview.active').removeClass('active');
        $(`webview[data-id="${nextTab.attr('data-id')}"]`).addClass('active');
    }
});

Mousetrap.bind(['ctrl+3', 'command+3'], () => {
    const activeTab = document.querySelector('.tabs li.active');
    let nextTab = $('.tabs li.nav-item:eq(2)');

    if (nextTab.length !== 0) {
        activeTab.classList.remove('active');
        nextTab.addClass('active');

        reorderTabs(nextTab, 'both');

        $('webview.active').removeClass('active');
        $(`webview[data-id="${nextTab.attr('data-id')}"]`).addClass('active');
    }
});

Mousetrap.bind(['ctrl+4', 'command+4'], () => {
    const activeTab = document.querySelector('.tabs li.active');
    let nextTab = $('.tabs li.nav-item:eq(3)');

    if (nextTab.length !== 0) {
        activeTab.classList.remove('active');
        nextTab.addClass('active');

        reorderTabs(nextTab, 'both');

        $('webview.active').removeClass('active');
        $(`webview[data-id="${nextTab.attr('data-id')}"]`).addClass('active');
    }
});

Mousetrap.bind(['ctrl+5', 'command+5'], () => {
    const activeTab = document.querySelector('.tabs li.active');
    let nextTab = $('.tabs li.nav-item:eq(4)');

    if (nextTab.length !== 0) {
        activeTab.classList.remove('active');
        nextTab.addClass('active');

        reorderTabs(nextTab, 'both');

        $('webview.active').removeClass('active');
        $(`webview[data-id="${nextTab.attr('data-id')}"]`).addClass('active');
    }
});

Mousetrap.bind(['ctrl+6', 'command+6'], () => {
    const activeTab = document.querySelector('.tabs li.active');
    let nextTab = $('.tabs li.nav-item:eq(5)');

    if (nextTab.length !== 0) {
        activeTab.classList.remove('active');
        nextTab.addClass('active');

        reorderTabs(nextTab, 'both');

        $('webview.active').removeClass('active');
        $(`webview[data-id="${nextTab.attr('data-id')}"]`).addClass('active');
    }
});

Mousetrap.bind(['ctrl+7', 'command+7'], () => {
    const activeTab = document.querySelector('.tabs li.active');
    let nextTab = $('.tabs li.nav-item:eq(6)');

    if (nextTab.length !== 0) {
        activeTab.classList.remove('active');
        nextTab.addClass('active');

        reorderTabs(nextTab, 'both');

        $('webview.active').removeClass('active');
        $(`webview[data-id="${nextTab.attr('data-id')}"]`).addClass('active');
    }
});

Mousetrap.bind(['ctrl+8', 'command+8'], () => {
    const activeTab = document.querySelector('.tabs li.active');
    let nextTab = $('.tabs li.nav-item:eq(7)');

    if (nextTab.length !== 0) {
        activeTab.classList.remove('active');
        nextTab.addClass('active');

        reorderTabs(nextTab, 'both');

        $('webview.active').removeClass('active');
        $(`webview[data-id="${nextTab.attr('data-id')}"]`).addClass('active');
    }
});

Mousetrap.bind(['ctrl+9', 'command+9'], () => {
    const activeTab = document.querySelector('.tabs li.active');
    let nextTab = $('.tabs li.nav-item:last-of-type');

    if (nextTab.length !== 0) {
        activeTab.classList.remove('active');
        nextTab.addClass('active');

        reorderTabs(nextTab, 'both');

        $('webview.active').removeClass('active');
        $(`webview[data-id="${nextTab.attr('data-id')}"]`).addClass('active');
    }
});

// Middle click a tab
$('.tabs li').on('mouseup', (e: any) => {
    if (e.button === 1) {
        e.preventDefault();

        const $tab = $(e.target).hasClass('nav-item') ? $(e.target) : $(e.target).parents('.nav-item');
        console.log('hi');
        $tab.remove();
    }
});

document.addEventListener('keydown', e => {
    // // Ctrl + F
    // if ((e.ctrlKey && e.keyCode == 70) || (e.keyCode === 91 && e.keyCode === 70)) {
    //     const search = document.querySelector('.search') as HTMLElement;

    //     if (search.style.display !== 'none') {
    //         search.style.display = 'none';
    //     } else {
    //         search.style.display = '';
    //         (document.querySelector('.search input.searchbox') as HTMLElement).focus();
    //         searchInPage();
    //     }
    // }

    // // Ctrl + Shift + I
    // if ((e.ctrlKey && e.shiftKey && e.keyCode == 73) || (e.keyCode === 91 && e.shiftKey && e.keyCode === 73)) {
    //     // e.preventDefault();

    //     const wv = document.querySelector('webview.active') as any;
    //     if (!wv.isDevToolsOpened()) {
    //         wv.openDevTools();
    //     } else {
    //         wv.closeDevTools();
    //     }
    // }

    // // Ctrl + Tab
    // if (e.ctrlKey && e.keyCode === 9 && !e.shiftKey) {
    //     if (!e.defaultPrevented) {
    //         const activeTab = document.querySelector('.tabs li.active');
    //         let nextTab = $(activeTab).next('.nav-item');

    //         activeTab.classList.remove('active');
    //         if (nextTab.length !== 0) {
    //             nextTab.addClass('active');

    //             reorderTabs(nextTab, 'both');
    //         } else {
    //             nextTab = $(document.querySelectorAll('.tabs li')[0]);
    //             nextTab.addClass('active');

    //             reorderTabs(nextTab, 'right');
    //         }

    //         $('webview.active').removeClass('active');
    //         $(`webview[data-id="${nextTab.attr('data-id')}"]`).addClass('active');
    //     }
    // }

    // // Ctrl + Shift + Tab
    // if (e.ctrlKey && e.shiftKey && e.keyCode === 9) {
    //     const activeTab = document.querySelector('.tabs li.active');
    //     let nextTab = $(activeTab).prev('.nav-item');

    //     activeTab.classList.remove('active');
    //     if (nextTab.length !== 0) {
    //         nextTab.addClass('active');

    //         reorderTabs(nextTab, 'both');
    //     } else {
    //         nextTab = $(document.querySelectorAll('.tabs li')[document.querySelectorAll('.tabs li').length - 1]);
    //         nextTab.addClass('active');

    //         reorderTabs(nextTab, 'left');
    //     }

    //     $('webview.active').removeClass('active');
    //     $(`webview[data-id="${nextTab.attr('data-id')}"]`).addClass('active');
    // }

    // // Ctrl + 1
    // if ((e.ctrlKey && e.keyCode === 49) || e.ctrlKey && e.keyCode === 97) {
    //     const activeTab = document.querySelector('.tabs li.active');
    //     let nextTab = $('.tabs li.nav-item:eq(0)');

    //     if (nextTab.length !== 0) {
    //         activeTab.classList.remove('active');
    //         nextTab.addClass('active');

    //         reorderTabs(nextTab, 'both');

    //         $('webview.active').removeClass('active');
    //         $(`webview[data-id="${nextTab.attr('data-id')}"]`).addClass('active');
    //     }
    // }

    // // Ctrl + 2
    // if ((e.ctrlKey && e.keyCode === 50) || e.ctrlKey && e.keyCode === 98) {
    //     const activeTab = document.querySelector('.tabs li.active');
    //     let nextTab = $('.tabs li.nav-item:eq(1)');

    //     if (nextTab.length !== 0) {
    //         activeTab.classList.remove('active');
    //         nextTab.addClass('active');

    //         reorderTabs(nextTab, 'both');

    //         $('webview.active').removeClass('active');
    //         $(`webview[data-id="${nextTab.attr('data-id')}"]`).addClass('active');
    //     }
    // }

    // // Ctrl + 3
    // if ((e.ctrlKey && e.keyCode === 51) || e.ctrlKey && e.keyCode === 99) {
    //     const activeTab = document.querySelector('.tabs li.active');
    //     let nextTab = $('.tabs li.nav-item:eq(2)');

    //     if (nextTab.length !== 0) {
    //         activeTab.classList.remove('active');
    //         nextTab.addClass('active');

    //         reorderTabs(nextTab, 'both');

    //         $('webview.active').removeClass('active');
    //         $(`webview[data-id="${nextTab.attr('data-id')}"]`).addClass('active');
    //     }
    // }

    // // Ctrl + 4
    // if ((e.ctrlKey && e.keyCode === 52) || e.ctrlKey && e.keyCode === 100) {
    //     const activeTab = document.querySelector('.tabs li.active');
    //     let nextTab = $('.tabs li.nav-item:eq(3)');

    //     if (nextTab.length !== 0) {
    //         activeTab.classList.remove('active');
    //         nextTab.addClass('active');

    //         reorderTabs(nextTab, 'both');

    //         $('webview.active').removeClass('active');
    //         $(`webview[data-id="${nextTab.attr('data-id')}"]`).addClass('active');
    //     }
    // }

    // // Ctrl + 5
    // if ((e.ctrlKey && e.keyCode === 53) || e.ctrlKey && e.keyCode === 101) {
    //     const activeTab = document.querySelector('.tabs li.active');
    //     let nextTab = $('.tabs li.nav-item:eq(4)');

    //     if (nextTab.length !== 0) {
    //         activeTab.classList.remove('active');
    //         nextTab.addClass('active');

    //         reorderTabs(nextTab, 'both');

    //         $('webview.active').removeClass('active');
    //         $(`webview[data-id="${nextTab.attr('data-id')}"]`).addClass('active');
    //     }
    // }

    // // Ctrl + 6
    // if ((e.ctrlKey && e.keyCode === 54) || e.ctrlKey && e.keyCode === 102) {
    //     const activeTab = document.querySelector('.tabs li.active');
    //     let nextTab = $('.tabs li.nav-item:eq(5)');

    //     if (nextTab.length !== 0) {
    //         activeTab.classList.remove('active');
    //         nextTab.addClass('active');

    //         reorderTabs(nextTab, 'both');

    //         $('webview.active').removeClass('active');
    //         $(`webview[data-id="${nextTab.attr('data-id')}"]`).addClass('active');
    //     }
    // }

    // // Ctrl + 7
    // if ((e.ctrlKey && e.keyCode === 55) || e.ctrlKey && e.keyCode === 103) {
    //     const activeTab = document.querySelector('.tabs li.active');
    //     let nextTab = $('.tabs li.nav-item:eq(6)');

    //     if (nextTab.length !== 0) {
    //         activeTab.classList.remove('active');
    //         nextTab.addClass('active');

    //         reorderTabs(nextTab, 'both');

    //         $('webview.active').removeClass('active');
    //         $(`webview[data-id="${nextTab.attr('data-id')}"]`).addClass('active');
    //     }
    // }

    // // Ctrl + 8
    // if ((e.ctrlKey && e.keyCode === 56) || e.ctrlKey && e.keyCode === 104) {
    //     const activeTab = document.querySelector('.tabs li.active');
    //     let nextTab = $('.tabs li.nav-item:eq(7)');

    //     if (nextTab.length !== 0) {
    //         activeTab.classList.remove('active');
    //         nextTab.addClass('active');

    //         reorderTabs(nextTab, 'both');

    //         $('webview.active').removeClass('active');
    //         $(`webview[data-id="${nextTab.attr('data-id')}"]`).addClass('active');
    //     }
    // }

    // // Ctrl + 9
    // if ((e.ctrlKey && e.keyCode === 57) || e.ctrlKey && e.keyCode === 105) {
    //     const activeTab = document.querySelector('.tabs li.active');
    //     let nextTab = $('.tabs li.nav-item:last-of-type');

    //     if (nextTab.length !== 0) {
    //         activeTab.classList.remove('active');
    //         nextTab.addClass('active');

    //         reorderTabs(nextTab, 'both');

    //         $('webview.active').removeClass('active');
    //         $(`webview[data-id="${nextTab.attr('data-id')}"]`).addClass('active');
    //     }
    // }

    // if (e.ctrlKey && e.keyCode === 37) {
    //     const activeTab = document.querySelector('.tabs li.active');
    //     let nextTab = $(activeTab).prev('.nav-item');

    //     activeTab.classList.remove('active');
    //     if (nextTab.length !== 0) {
    //         nextTab.addClass('active');

    //         reorderTabs(nextTab, 'both');
    //     } else {
    //         nextTab = $(document.querySelectorAll('.tabs li')[document.querySelectorAll('.tabs li').length - 1]);
    //         nextTab.addClass('active');

    //         reorderTabs(nextTab, 'left');
    //     }

    //     $('webview.active').removeClass('active');
    //     $(`webview[data-id="${nextTab.attr('data-id')}"]`).addClass('active');
    // }

    // if (e.ctrlKey && e.keyCode === 39) {
    //     const activeTab = document.querySelector('.tabs li.active');
    //     let nextTab = $(activeTab).next('.nav-item');

    //     activeTab.classList.remove('active');
    //     if (nextTab.length !== 0) {
    //         nextTab.addClass('active');

    //         reorderTabs(nextTab, 'both');
    //     } else {
    //         nextTab = $(document.querySelectorAll('.tabs li')[0]);
    //         nextTab.addClass('active');

    //         reorderTabs(nextTab, 'right');
    //     }

    //     $('webview.active').removeClass('active');
    //     $(`webview[data-id="${nextTab.attr('data-id')}"]`).addClass('active');
    // }

    if (e.keyCode === 116) {
        e.preventDefault();

        const wv = document.querySelector('webview.active') as any;

        wv.reload();
    }
});

document.addEventListener('keydown', e => {
    if (e.keyCode === 27 && (document.querySelector('.search') as HTMLInputElement).style.display !== 'none') {
        (document.querySelector('.search') as HTMLElement).style.display = 'none';
        (document.querySelector('webview.active') as any).stopFindInPage('keepSelection');
        (document.querySelector('webview.active') as HTMLElement).focus();
    }
});

document.querySelector('.search input.searchbox').addEventListener('input', e => {
    const searchbox = document.querySelector('.search input.searchbox') as HTMLInputElement;
    if (searchbox.value) {
        (document.querySelector('webview.active') as any).findInPage(searchbox.value);
    }
});

document.querySelector('.search input.searchbox').addEventListener('blur', e => {
    const target = e.target as HTMLElement;
    if (target !== document.querySelector('.search') && !document.querySelector('.search').contains(target)) {
        (document.querySelector('.search') as HTMLElement).style.display = 'none';
        (document.querySelector('webview.active') as any).stopFindInPage('keepSelection');
        (document.querySelector('webview.active') as HTMLElement).focus();
    }
});

document.querySelector('.search input.searchbox').addEventListener('keypress', (e: KeyboardEvent) => {
    if (e.keyCode === 13) {
        (document.querySelector('webview.active') as any).findInPage((document.querySelector('.search input.searchbox') as HTMLInputElement).value, {
            forward: true,
            findNext: true
        })
    }
})

document.querySelector('.search input.previous').addEventListener('click', function (e) {
    const input = (document.querySelector('.search input.searchbox') as HTMLInputElement).value;

    if (input !== undefined) {
        (document.querySelector('webview.active') as any).findInPage(input, {
            forward: false,
            findNext: true
        })
            (document.querySelector('.search input.searchbox') as HTMLElement).focus();
    }
})

document.querySelector('.search input.next').addEventListener('click', function (e) {
    const input = (document.querySelector('.search input.searchbox') as HTMLInputElement).value;

    if (input !== undefined) {
        (document.querySelector('webview.active') as any).findInPage(input, {
            forward: true,
            findNext: true
        })
            (document.querySelector('.search input.searchbox') as HTMLElement).focus();
    }
})

function searchInPage() {
    document.querySelector('webview.active').addEventListener('found-in-page', (e: any) => {
        if (e.result.matches !== undefined) {
            document.querySelector('.search span.matches').textContent = e.result.activeMatchOrdinal + ' of ' + e.result.matches;
        }
    });
}