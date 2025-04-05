const path = require('path');

const {app, globalShortcut, BrowserWindow, nativeTheme} = require('electron');

app.on('ready', () => {

    const browser = new BrowserWindow({

        'autoHideMenuBar': true,
        'fullscreen': true,
        'height': 800,
        'icon': path.resolve(__dirname, 'distribution', 'favicon.ico'),
        'webPreferences': {

            'backgroundThrottling': false,
            'devTools': true
        },
        'width': 1280
    });

    const accelerators = [

        'CommandOrControl+Shift+F5',
        'CommandOrControl+W',
        'F5',
        'F11'
    ];

    nativeTheme.themeSource = 'dark';

    accelerators.forEach(($accelerator) => {

        globalShortcut.register($accelerator, () => {});
    });

    globalShortcut.register('CommandOrControl+Shift+I', () => {

        if (browser.webContents.isDevToolsOpened() === false) {

            browser.webContents.openDevTools();

            return;
        }

        browser.webContents.closeDevTools();

        return;
    });

    globalShortcut.register('CommandOrControl+R', () => {

        browser.webContents.reload();
    });

    globalShortcut.register('CommandOrControl+Shift+R', () => {

        browser.webContents.reloadIgnoringCache();
    });

    browser.webContents.openDevTools();

    browser.webContents.on('before-input-event', (_$event, $input) => {

        if ($input.alt === true
        && $input.code === 'F4') {

            browser.close();
        }
    });

    browser.loadFile(path.resolve(__dirname, 'distribution', 'index.html'));
});
