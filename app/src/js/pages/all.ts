const blankModule = require('./blank');
const settingsModule = require('./settings');

function blank() {
    blankModule();
}

function settings() {
    settingsModule();
}

function defaultFunc() {
    const electron = require('electron');
    const { ipcMain, ipcRenderer } = require('electron');

    require('../notification/notification-handler.js')();

    ipcRenderer.sendToHost('history');

    ipcRenderer.on('webviewId', () => {
        ipcRenderer.sendToHost('webviewId');
    });

    document.addEventListener('click', () => {
        ipcRenderer.sendToHost('click')
    });
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.location.href === 'mybrowser://blank') {
        blank()
    } else if (document.location.href === 'mybrowser://settings') {
        settings();
    }
    defaultFunc();
});