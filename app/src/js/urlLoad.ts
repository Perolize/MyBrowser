import { ipcRenderer } from 'electron';
import * as normalizeUrl from 'normalize-url';

$(document).ready(() => {
    ipcRenderer.send('ready');
});

ipcRenderer.on('open-url', (e: any, msg: any) => {
    const url = normalizeUrl(msg);
    (document.querySelector('webview.active') as any).loadURL(url);
});