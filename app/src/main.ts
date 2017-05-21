const electron = require('electron');
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow
const ipcMain = electron.ipcMain
const ipcRenderer = electron.ipcRenderer;
const protocol = electron.protocol

const path = require('path')
const del = require('del')
const url = require('url')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow: any;

require('./utils/cache');

const crashReporter = require('./utils/crash-reporter')
crashReporter.init()

process.on('uncaughtException', (err: any) => {
  console.log(err);
});

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({ width: 800, height: 600, frame: false, icon: path.join(__dirname, 'img/logo-2.png'), backgroundColor: '#f5f5f5' });

  console.time('init');

  ipcMain.on('ready-init', (e: any) => {
    console.timeEnd('init')
  });

  protocol.registerFileProtocol('mybrowser', (req: any, cb: any) => {
    const fullUrl = path.normalize(`${__dirname}/pages/${req.url.substr(12)}.html`);

    if (req.url.substr(12).startsWith('js')) {
      const jsPath = path.normalize(`${__dirname}/${req.url.substr(12)}`);

      cb({ path: jsPath })
    } else if (req.url.substr(12).startsWith('css')) {
      const cssPath = path.normalize(`${__dirname}/${req.url.substr(12)}`);

      cb({ path: cssPath })
    } else if (req.url.substr(12).startsWith('fonts')) {
      const fontsPath = path.normalize(`${__dirname}/${req.url.substr(12)}`);

      cb({ path: fontsPath })
    } else if (req.url.substr(12).startsWith('img')) {
      const imgPath = path.normalize(`${__dirname}/${req.url.substr(12)}`);

      cb({ path: imgPath })
    } else if (req.url.substr(12).startsWith('history')) {
      const historyPath = path.normalize(`${__dirname}/${req.url.substr(12)}`);

      cb({ path: historyPath })
    } else if (req.url.substr(12).endsWith('Folder')) {
      const jsPath = path.normalize(`${__dirname}/${req.url.substr(12).replace('Folder', '')}`);

      cb({ path: jsPath })
    } else if (req.url.substr(12).endsWith('CSS')) {
      const cssPath = path.normalize(`${__dirname}/pages/css/${req.url.substr(12).replace('CSS', '')}.css`);

      cb({ path: cssPath })
    } else {
      cb({ path: fullUrl });
    }
  })

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, './index.html'),
    protocol: 'file:',
    slashes: true
  }))

  ipcMain.on('ready', (e: any) => {
    e.sender.send('open-url', 'mybrowser://blank');
  });

  // ipcMain.on('notification', (e, msg) => {
  //   var eNotify = require('electron-notify');
  //   // Change config options
  //   eNotify.setConfig({
  //     appIcon: path.join(__dirname, './img/logo.png'),
  //     displayTime: 6000
  //   });

  //   eNotify.notify({
  //     title: 'Title',
  //     text: 'Some text',
  //     onClickFunc: e => {
  //       e.closeNotification();
  //     }
  //   });
  // });

  ipcMain.on('new-window', (e: any, msg: any) => {
    createNewWindow(msg || undefined);
  });

  ipcMain.on('notification-shim', (e: any, msg: any) => {
    console.log(msg)
    const eNotify = require('./js/notification/notifier/index.js');

    if (msg.options.icon === undefined || msg.options.icon === '') {
      msg.options.icon = path.join(__dirname, './img/logo.png');
    } else {
      console.log(msg.options.icon === undefined || msg.options.icon === '')
    }
    eNotify.setConfig({
      width: 400,
      height: 200,
      defaultStyleContainer: {
        backgroundColor: '#f0f0f0',
        overflow: 'hidden',
        padding: 8,
        border: '1px solid #CCC',
        fontFamily: 'Arial',
        fontSize: 18,
        position: 'relative',
        lineHeight: '21px'
      },
      appIcon: msg.options.icon,
      defaultStyleAppIcon: {
        overflow: 'hidden',
        float: 'left',
        height: 175,
        width: 175,
        marginRight: 10,
      },
      defaultStyleText: {
        margin: 0,
        overflow: 'hidden',
        cursor: 'default'
      },
      displayTime: 6000,
      originUrl: msg.options.originUrl,
      webviewId: msg.options.webviewId
    });
    eNotify.setTemplatePath(path.join(__dirname, './templates/notification.html'));

    msg.originUrl = msg.options.originUrl;
    msg.webviewId = msg.options.webviewId;
    msg.text = msg.options.body || 'test';
    msg.onClickFunc = (event: any) => { e.sender.send('show', msg); event.closeNotification() };
    console.log(msg);

    eNotify.notify(msg);
  });

  ipcMain.on('open-view', (e: any, notificationObj: any) => {
    ipcRenderer.send('open-view', notificationObj);
  });

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

function createNewWindow(tabUrl = 'mybrowser://blank') {
  // Create the browser window.
  let newWin = new BrowserWindow({ width: 800, height: 600, frame: false, icon: path.join(__dirname, 'img/logo-2.png'), show: false, backgroundColor: '#f5f5f5' });

  // and load the index.html of the app.
  newWin.loadURL(url.format({
    pathname: path.join(__dirname, `./index.html`),
    protocol: 'file:',
    slashes: true
  }))

  ipcMain.on('ready', (e: any) => {
    e.sender.send('open-url', tabUrl);
  });

  ipcMain.on('new-window', (e: any, msg: any) => {
    createNewWindow(msg || undefined);
  });

  ipcMain.on('notification-shim', (e: any, msg: any) => {
    console.log(msg)
    const eNotify = require('./js/notification/notifier/index.js');

    if (msg.options.icon === undefined || msg.options.icon === '') {
      msg.options.icon = path.join(__dirname, './img/logo.png');
    } else {
      console.log(msg.options.icon === undefined || msg.options.icon === '')
    }
    eNotify.setConfig({
      width: 400,
      height: 200,
      defaultStyleContainer: {
        backgroundColor: '#f0f0f0',
        overflow: 'hidden',
        padding: 8,
        border: '1px solid #CCC',
        fontFamily: 'Arial',
        fontSize: 18,
        position: 'relative',
        lineHeight: '21px'
      },
      appIcon: msg.options.icon,
      defaultStyleAppIcon: {
        overflow: 'hidden',
        float: 'left',
        height: 175,
        width: 175,
        marginRight: 10,
      },
      defaultStyleText: {
        margin: 0,
        overflow: 'hidden',
        cursor: 'default'
      },
      displayTime: 6000,
      originUrl: msg.options.originUrl,
      webviewId: msg.options.webviewId
    });
    eNotify.setTemplatePath(path.join(__dirname, './templates/notification.html'));

    msg.originUrl = msg.options.originUrl;
    msg.webviewId = msg.options.webviewId;
    msg.text = msg.options.body || 'test';
    msg.onClickFunc = (event: any) => { e.sender.send('show', msg); event.closeNotification() };
    console.log(msg);

    eNotify.notify(msg);
  });

  ipcMain.on('open-view', (e: any, notificationObj: any) => {
    ipcRenderer.send('open-view', notificationObj);
  });

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  newWin.once('ready-to-show', () => {
    newWin.show();
  });

  // Emitted when the window is closed.
  newWin.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    newWin = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('will-quit', () => {
  del(path.join(app.getPath('userData'), './temp/**'), { force: true });
  console.log(path.join(app.getPath('userData'), './temp/**'))
});

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
