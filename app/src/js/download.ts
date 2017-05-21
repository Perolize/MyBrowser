const electron = require('electron');
const remote = electron.remote;

export function addListenerForDownload() {
    const wv = document.querySelector('webview.active') as any;
    wv.getWebContents().session.on('will-download', (event: any, item: any, webContents: any) => {
        // Set the save path, making Electron not to prompt a save dialog.
        //   item.setSavePath('/tmp/save.pdf')
        const downloadItem = addItemToList(item);

        item.on('updated', (event: any, state: any) => {
            if (state === 'interrupted') {
                console.log('Download is interrupted but can be resumed')
            } else if (state === 'progressing') {
                if (item.isPaused()) {
                    console.log('Download is paused')
                } else {
                    updateItem(downloadItem, 'size', item.getReceivedBytes())
                }
            }
        })
        item.once('done', (event: any, state: any) => {
            if (state === 'completed') {
                console.log('Download successfully')
            } else {
                console.log(`Download failed: ${state}`)
            }
        })
    })
}

export function addItemToList(item: any) {
    const link = document.createElement('a');
    link.href = item.getURLChain()[0];
    const url = link.hostname;
    const name = item.getFilename();
    const size = item.getTotalBytes();
    const time = unixToStandard(item.getStartTime());
    const src = 'https://images.duckduckgo.com/iu/?u=http%3A%2F%2Fupload.wikimedia.org%2Fwikipedia%2Fcommons%2Ff%2Ffa%2FSimple_Comic_zip.png&f=1';

    const downloadManager = document.querySelector('.download-manager');
    downloadManager.classList.add('hasItems');
    const downloadItem = document.createElement('div');
    downloadItem.classList.add('download-item');
    downloadItem.innerHTML = `<div class="item"><img class="icon" src="${src}" /><div class="details"><p class="name">${name}</p><div class="info"><small class="size">${size}</small><small class="url">${url}</small><small class="time">${time}</small></div></div></div>`;
    downloadItem.innerHTML += `<a class="open-containing-folder fa fa-folder-open"></a>`

    const noDownloads = document.querySelector('.download-manager .no-downloads') as HTMLElement;
    noDownloads.style.display = 'none';
    downloadManager.insertBefore(downloadItem, document.querySelector('.download-manager .big.btn'));

    if (size === 0) {
        const downloadItem = document.querySelector('.download-item .size') as HTMLElement;
        downloadItem.style.display = 'none';
    }

    (document.querySelectorAll(`.download-item .info .time[time='${time}']`) as any).forEach((i: any) => {
        if (document.querySelector(`.download-item:last-child .info .time[time='${time}']`) !== document.querySelectorAll(`.download-item .info .time[time='${time}']`)[i]) {
            document.querySelectorAll(`.download-item .info .time[time='${time}']`)[i].parentElement.parentElement.parentElement.parentElement.remove();
        }
    });

    return downloadItem;
}

export function updateItem(item: HTMLElement, what: string, value: any) {
    switch (what) {
        case 'size':
            item.querySelector('.info .size').textContent = convertBytes(value);
            break;
    }
}

export function unixToStandard(unix: number) {
    const date = new Date(unix * 1000);
    const hours = date.getHours();
    const minutes = "0" + date.getMinutes();
    const seconds = "0" + date.getSeconds();
    const formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);

    return formattedTime;
}

export function convertBytes(bytes: number) {
    if (bytes == 0) return '0 Bytes';
    var k = 1000,
        dm = 3,
        sizes = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
        i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

module.exports.addListenerForDownload = addListenerForDownload;