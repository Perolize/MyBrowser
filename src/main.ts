const electron = require('electron')
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow
const ipcMain = electron.ipcMain
const protocol = electron.protocol

const path = require('path')
const url = require('url')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow: any;

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({ width: 800, height: 600, frame: false, icon: path.join(__dirname, 'img/logo-2.png') });

  protocol.registerFileProtocol('mybrowser', (req, cb) => {
    const fullUrl = path.normalize(`${__dirname}/pages/${req.url.substr(12)}.html`);

    if (req.url.substr(12).startsWith('js')) {
      const jsPath = path.normalize(`${__dirname}/${req.url.substr(12)}`);

      cb({ path: jsPath })
    } else if (req.url.substr(12).startsWith('css')) {
      const cssPath = path.normalize(`${__dirname}/${req.url.substr(12)}`);

      cb({ path: cssPath })
    } else if (req.url.substr(12).startsWith('img')) {
      const imgPath = path.normalize(`${__dirname}/${req.url.substr(12)}`);

      cb({ path: imgPath })
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

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
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

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
