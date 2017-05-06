const electron = require('electron')
const remote = electron.remote;
const clipboard = electron.clipboard;
const Menu = remote.Menu;
const MenuItem = remote.MenuItem;

import * as main from './main';

const wv = document.querySelector('webview.active') as any;
let contextMenuTarget: any;

// var menu = new Menu();
// menu.append(new MenuItem({ label: 'Open in new tab', click: function (menuItem, browserWindow) { if(e.target == 'teehe') remote.getCurrentWindow().webContents.send('openInNewTab') } }));
// menu.append(new MenuItem({ role: 'undo', label: 'Undo' }));
// menu.append(new MenuItem({ role: 'redo', label: 'Redo' }));
// menu.append(new MenuItem({ type: 'separator' }));
// menu.append(new MenuItem({ role: 'cut', label: 'Cut' }));
// menu.append(new MenuItem({ role: 'copy', label: 'Copy' }));
// menu.append(new MenuItem({ role: 'paste', label: 'Paste' }));
// menu.append(new MenuItem({ role: 'delete', label: 'Delete' }));
// menu.append(new MenuItem({ type: 'separator' }));
// menu.append(new MenuItem({ role: 'selectall', label: 'Select All' }));
// menu.append(new MenuItem({ type: 'separator' }));
// menu.append(new MenuItem({ label: 'Inspect Element', click: function () { remote.getCurrentWindow().webContents.send('openDevTools') } }));

const appMenuTemplate: any = [
  {
    label: 'Edit',
    submenu: [
      {
        role: 'undo'
      },
      {
        role: 'redo'
      },
      {
        type: 'separator'
      },
      {
        role: 'cut'
      },
      {
        role: 'copy'
      },
      {
        role: 'paste'
      },
      {
        role: 'pasteandmatchstyle'
      },
      {
        role: 'delete'
      },
      {
        role: 'selectall'
      }
    ]
  },
  {
    label: 'View',
    submenu: [
      {
        role: 'reload'
      },
      {
        role: 'forcereload'
      },
      {
        role: 'toggledevtools'
      },
      {
        type: 'separator'
      },
      {
        role: 'resetzoom'
      },
      {
        role: 'zoomin'
      },
      {
        role: 'zoomout'
      },
      {
        type: 'separator'
      },
      {
        role: 'togglefullscreen'
      }
    ]
  },
  {
    role: 'window',
    submenu: [
      {
        role: 'minimize'
      },
      {
        role: 'close'
      }
    ]
  },
  {
    role: 'help',
    submenu: [
      {
        label: 'Learn More',
        click() { require('electron').shell.openExternal('http://electron.atom.io') }
      }
    ]
  }
]

if (process.platform === 'darwin') {
  appMenuTemplate.unshift({
    label: app.getName(),
    submenu: [
      {
        role: 'about'
      },
      {
        type: 'separator'
      },
      {
        role: 'services',
        submenu: []
      },
      {
        type: 'separator'
      },
      {
        role: 'hide'
      },
      {
        role: 'hideothers'
      },
      {
        role: 'unhide'
      },
      {
        type: 'separator'
      },
      {
        role: 'quit'
      }
    ]
  })
  // Edit menu.
  appMenuTemplate[1].submenu.push(
    {
      type: 'separator'
    },
    {
      label: 'Speech',
      submenu: [
        {
          role: 'startspeaking'
        },
        {
          role: 'stopspeaking'
        }
      ]
    }
  )
  // Window menu.
  appMenuTemplate[3].submenu = [
    {
      label: 'Close',
      accelerator: 'CmdOrCtrl+W',
      role: 'close'
    },
    {
      label: 'Minimize',
      accelerator: 'CmdOrCtrl+M',
      role: 'minimize'
    },
    {
      label: 'Zoom',
      role: 'zoom'
    },
    {
      type: 'separator'
    },
    {
      label: 'Bring All to Front',
      role: 'front'
    }
  ]
}

const appMenu = Menu.buildFromTemplate(appMenuTemplate)
Menu.setApplicationMenu(appMenu)

export function addMenu(id: Number) {
  let wv: any;
  if (id !== undefined) {
    wv = document.querySelector(`.pages webview[data-id="${id}"]`) as any;
  } else {
    wv = document.querySelector('.pages webview.active') as any;
  }

  wv.getWebContents().on('context-menu', (e: Event, params: any) => {
    const target = e.target as HTMLElement;
    let type: string = '';

    remote.getCurrentWindow().webContents.send('contextmenu', { position: { x: params.x, y: params.y } })

    const templates: any = {
      linkMenuTemplate: [
        {
          label: 'Open in new tab',
          // click: () => { remote.getCurrentWindow().webContents.send('openInNewTab') },/
          click: () => { triggerEvent(wv, 'new-window', { detail: contextMenuTarget.link }) },
        },
        {
          type: 'separator'
        },
        {
          role: 'selectall',
          enabled: params.editFlags.canSelectAll
        },
        {
          type: 'separator'
        },
        {
          label: 'Inspect Element',
          click: () => { remote.getCurrentWindow().webContents.send('openDevTools') }
        }
      ],
      textMenuTemplate: [
        {
          role: 'undo',
          enabled: params.editFlags.canUndo
        },
        {
          role: 'redo',
          enabled: params.editFlags.canRedo
        },
        {
          type: 'separator'
        },
        {
          role: 'cut',
          enabled: params.editFlags.canCut
        },
        {
          role: 'copy'
        },
        {
          role: 'paste',
          enabled: params.editFlags.canPaste
        },
        {
          role: 'pasteandmatchstyle',
          enabled: params.editFlags.canPaste
        },
        {
          role: 'delete',
          enabled: params.editFlags.canDelete
        },
        {
          role: 'selectall',
          enabled: params.editFlags.canSelectAll
        },
        {
          type: 'separator'
        },
        {
          label: 'Inspect Element',
          click: () => { remote.getCurrentWindow().webContents.send('openDevTools') }
        }
      ],
      imageMenuTemplate: [
        {
          "label": 'View Image'
        }
      ],
      defaultMenuTemplate: [
        {
          label: 'Save page as...',
          click: () => { remote.getCurrentWindow().webContents.send('savePage') }
        },
        {
          type: 'separator'
        },
        {
          role: 'selectall',
          enabled: params.editFlags.canSelectAll
        },
        {
          type: 'separator'
        },
        {
          label: 'View page source',
          click: () => { remote.getCurrentWindow().webContents.send('viewSource') }
        },
        {
          label: 'View page info',
          click: () => { remote.getCurrentWindow().webContents.send('viewInfo') }
        },
        {
          type: 'separator'
        },
        {
          label: 'Inspect Element',
          click: () => { remote.getCurrentWindow().webContents.send('openDevTools') }
        }
      ]
    }

    if (params.linkURL !== '') {
      type = 'link';
    } else if (params.isEditable) {
      type = 'editable';
    } else {
      type = 'default';
    }

    showMenu(type, params, templates)

    // switch (params.linkURL) {
    //   case '':
    //     switch (params.isEditable) {
    //       case true:
    //         showMenu('editable', params, templates);
    //         break;
    //       default:
    //         showMenu('default', params, templates);
    //         break;
    //     }
    //     break;
    //   default:
    //     showMenu('link', params, templates);
    //     break;
    // }

    // switch (target.nodeName) {
    //   case 'A':
    //     const link = e.target as HTMLAnchorElement;
    //     wv.getWebContents().send('contextmenu', { link: link.href, position: { x: params.x, y: params.y } })

    //     const linkMenu = Menu.buildFromTemplate(linkMenuTemplate)
    //     linkMenu.popup(remote.getCurrentWindow());
    //     break;
    //   case 'INPUT':
    //     const textMenu = Menu.buildFromTemplate(textMenuTemplate)
    //     textMenu.popup(remote.getCurrentWindow());
    //     break;
    //   default:
    //     const defaultMenu = Menu.buildFromTemplate(defaultMenuTemplate)
    //     defaultMenu.popup(remote.getCurrentWindow());
    //     break;
    // }
  }, false);
}

export function showMenu(type: string, params: any, templates: any) {
  switch (type) {
    case 'link':
      remote.getCurrentWindow().webContents.send('contextmenu', { link: params.linkURL, position: { x: params.x, y: params.y } })

      const linkMenu = Menu.buildFromTemplate(templates.linkMenuTemplate)
      linkMenu.popup(remote.getCurrentWindow());
      break;
    case 'editable':
      const textMenu = Menu.buildFromTemplate(templates.textMenuTemplate)
      textMenu.popup(remote.getCurrentWindow());
      break;
    default:
      const defaultMenu = Menu.buildFromTemplate(templates.defaultMenuTemplate)
      defaultMenu.popup(remote.getCurrentWindow());
      break;
  }
}

export function onContextMenu() {
  electron.ipcRenderer.on('contextmenu', (e, target) => {
    contextMenuTarget = target;
  });
}

export function onDevToolsOpen() {
  electron.ipcRenderer.on('openDevTools', (e, msg) => {
    const wv = document.querySelector('.pages webview.active') as any;
    const target = contextMenuTarget;

    wv.inspectElement(target.position.x, target.position.y);
    // document.querySelector('webview.active').getWebContents().enableDeviceEmulation();
  });
  // webview.reload();
}

export function onOpenInNewTab() {
  electron.ipcRenderer.once('openInNewTab', (e, msg) => {
    const id = parseInt($('.tabs li').last().attr('data-id')) + 1;
    const target = contextMenuTarget;
    main.createNewTab(id, target.link);
  });
}

export function triggerEvent(el: any, eventName: any, options: any) {
  var event;
  if ((window as any).CustomEvent) {
    event = new CustomEvent(eventName, options);
  } else {
    event = document.createEvent('CustomEvent');
    event.initCustomEvent(eventName, true, true, options);
  }
  el.dispatchEvent(event);
}

module.exports.addMenu = addMenu;
module.exports.onContextMenu = onContextMenu;
module.exports.onDevToolsOpen = onDevToolsOpen;
module.exports.onOpenInNewTab = onOpenInNewTab;