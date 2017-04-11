"use strict";
const path = require('path');
const glob = require('glob');
const electron = require('electron');
const app = electron.app;
const Menu = electron.menu;
const BrowserWindow = electron.BrowserWindow;

let mWnd = null;

const cfg = require('./app/config');


//if (process.mas) app.setName('Dot Live Editor');
function createWindow () {
    let shouldQuit = makeSingleInstance();
    if (shouldQuit) return app.quit();

    require(path.join(__dirname, 'app/ipcmain.js'));

    mWnd = new BrowserWindow({
        width: cfg.wnd.w,
        height: cfg.wnd.h,
        minWidth: 1366,
        minHeight: 768,
        alwaysOnTop: false,
        title: cfg.appName
    });

    mWnd.loadURL(path.join('file://', __dirname, '/', cfg.wnd.mainLayout));

    // open dev tools
    if(cfg.dev) {
        mWnd.webContents.openDevTools();
        mWnd.maximize();
        require('devtron').install();
    }

    // init menu
    initMenu(cfg);

    mWnd.on('closed', function () {
        mWnd = null;
    });
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', function () {
    if (mWnd === null) {
        createWindow();
    }
});

function makeSingleInstance () {
    if (process.mas) return false;

    return app.makeSingleInstance(function () {
        if (mWnd) {
            if (mWnd.isMinimized()) mWnd.restore();
            mWnd.focus();
        }
    })
}

function initMenu(cfg) {
    return undefined;
    let tpl = Menu.buildFromTemplate([
        {
            label: 'View',
            submenu: [
                {
                    label: 'Reload',
                    accelerator: 'Command+R',
                    click: function() { BrowserWindow.getFocusedWindow().reloadIgnoringCache(); }
                },
                {
                    label: 'Toggle DevTools',
                    accelerator: 'Alt+Command+I',
                    click: function() { BrowserWindow.getFocusedWindow().toggleDevTools(); }
                },
            ]
        },
        {
            label: 'Window',
            submenu: [
                {
                    label: 'Minimize',
                    accelerator: 'Command+M',
                    selector: 'performMiniaturize:'
                },
                {
                    label: 'Close',
                    accelerator: 'Command+W',
                    selector: 'performClose:'
                },
                {
                    type: 'separator'
                },
                {
                    label: 'Bring All to Front',
                    selector: 'arrangeInFront:'
                },
            ]
        }
    ]);
    Menu.setApplicationMenu(tpl);
}