import { ipcRenderer } from 'electron';
import * as normalizeUrl from 'normalize-url';

$(document).ready(() => {
    ipcRenderer.send('ready');
});

ipcRenderer.on('open-url', (e: any, msg: any) => {
    const url = normalizeUrl(msg);
    console.log(url)
    document.querySelector('webview.active').loadURL(url);
});