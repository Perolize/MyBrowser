document.addEventListener('keydown', e => {
    if ((e.ctrlKey && e.keyCode == 70) || (e.keyCode === 91 && e.keyCode === 70)) {
        const search = document.querySelector('.search') as HTMLElement;

        if (search.style.display !== 'none') {
            search.style.display = 'none';
        } else {
            search.style.display = '';
            (document.querySelector('.search input.searchbox') as HTMLElement).focus();
            searchInPage();
        }
    }

    if ((e.ctrlKey && e.shiftKey && e.keyCode == 73) || (e.keyCode === 91 && e.shiftKey && e.keyCode === 73)) {
        // e.preventDefault();

        const wv = document.querySelector('webview.active') as any;
        if (!wv.isDevToolsOpened()) {
            wv.openDevTools();
        } else {
            wv.closeDevTools();
        }
    }

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