const { app, BrowserWindow, autoUpdater } = require('electron');
const path = require('path');
const { autoUpdater } = require('electron-updater');

let mainWindow;

const feedURL = 'https://your-update-server.com'; // URL de tu servidor de actualizaciones

autoUpdater.setFeedURL({ url: feedURL });

autoUpdater.on('update-available', () => {
    console.log('Update available');
});

autoUpdater.on('update-downloaded', () => {
    console.log('Update downloaded');
    autoUpdater.quitAndInstall();
});

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    });

    mainWindow.loadURL('http://localhost:4200'); // La URL de tu aplicación Angular

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

app.on('ready', () => {
    createWindow();
    autoUpdater.checkForUpdatesAndNotify();  // Verificar actualizaciones al inicio
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
