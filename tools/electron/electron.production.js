const path = require('path');

const {app, globalShortcut, BrowserWindow} = require('electron');

app.on('ready', () => {

    const browser = new BrowserWindow({

        'autoHideMenuBar': true,
        'fullscreen': true,
        'height': 800,
        'icon': path.resolve(__dirname, 'distribution', 'favicon.ico'),
        'webPreferences': {

            'backgroundThrottling': false,
            'devTools': false
        },
        'width': 1280
    });

    const accelerators = [

        'CommandOrControl+R',
        'CommandOrControl+Shift+F5',
        'CommandOrControl+Shift+I',
        'CommandOrControl+Shift+R',
        'CommandOrControl+W',
        'F5',
        'F11'
    ];

    accelerators.forEach(($accelerator) => {

        globalShortcut.register($accelerator, () => {});
    });

    browser.webContents.on('before-input-event', (_$event, $input) => {

        if ($input.alt === true
        && $input.code === 'F4') {

            browser.close();
        }
    });

    browser.loadFile(path.resolve(__dirname, 'distribution', 'index.html'));
});
