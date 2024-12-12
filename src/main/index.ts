import { app, shell, BrowserWindow, ipcMain, Menu,dialog  } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import log from 'electron-log';
import { autoUpdater } from 'electron-updater';
import { spawn } from 'child_process'
let mainWindow: BrowserWindow
function createWindow(): void {
  const iconPath = join(__dirname, '../../../resources/logo.ico')
   mainWindow = new BrowserWindow({
    width: 1700,
    height: 1000,
    show: false,
    autoHideMenuBar: true,
    // fullscreen: true, // Set full-screen mode

    ...(process.platform === 'linux' ? { iconPath } : {}),
    title: 'مؤسسة التنمية الصحية',
    icon: iconPath,

    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      webSecurity: false // Disable web security to allow local file access
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  mainWindow.webContents.on('context-menu', (_event, _params) => {
    const contextMenu = Menu.buildFromTemplate([
      { role: 'cut', label: 'قطع' },
      { role: 'copy', label: 'نسخ' },
      { role: 'paste', label: 'لصق' },
      { type: 'separator' },
      { role: 'selectAll', label: 'تحديد الكل' }
    ])
    contextMenu.popup()
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'), { hash: '/' })
  }
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  ipcMain.on('ping', () => console.log('pong'))

  createWindow()


  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })

  let serverPath = ''

  if (is.dev) {
    serverPath = join(__dirname, '../../server/index.js')
  } else {
    serverPath = join(__dirname, '../../../server/index.js')
  }
  // dialog.showMessageBox({
  //   type: 'info',
  //   title: 'Server Path',
  //   message: `Starting server with path: ${serverPath}`,
  //   buttons: ['OK']
  // })
  // }

  // } // const serverPath = resolve(__dirname, '../../server/index')
  console.log(`Starting server with path: ${serverPath}`)

  const serverProcess = spawn('node', [serverPath], {
    stdio: 'inherit', // Passes stdio to the parent process, useful for debugging
    windowsHide: true
  })

  serverProcess.on('error', (error) => {
    console.error(`Error starting server: ${error.message}`)
  })

  serverProcess.on('close', (code) => {
    console.log(`Server process exited with code ${code}`)
  })
  checkForUpdates();

})
function checkForUpdates() {
  autoUpdater.checkForUpdates();

  // Event: Update available
  autoUpdater.on('update-available', (info) => {
    log.info('Update available:', info);
    dialog
      .showMessageBox({
        type: 'info',
        title: 'Update Available',
        message: `A new version (${info.version}) is available. Current version: ${app.getVersion()}. Would you like to download it?`,
        buttons: ['Yes', 'No'],
      })
      .then((result) => {
        if (result.response === 0) {
          // Start downloading the update
          autoUpdater.downloadUpdate();
          dialog.showMessageBox({
            type: 'info',
            title: 'Downloading Update',
            message: 'The update is being downloaded. Please wait.',
            buttons: ['OK'],
          });
        }
      });
  });

  // Event: No updates available
  autoUpdater.on('update-not-available', (info) => {
    log.info('No updates available:', info);
    dialog.showMessageBox({
      type: 'info',
      title: 'No Updates',
      message: 'You are using the latest version.',
      buttons: ['OK'],
    });
  });

  // Event: Download progress
  autoUpdater.on('download-progress', (progress) => {
    log.info(
      `Download progress: ${progress.percent.toFixed(2)}% (${progress.transferred}/${progress.total} bytes)`
    );
    if (mainWindow) {
      mainWindow.setProgressBar(progress.percent / 100);
    }
  });

  // Event: Update downloaded
  autoUpdater.on('update-downloaded', (info) => {
    log.info('Update downloaded:', info);
    dialog
      .showMessageBox({
        type: 'info',
        title: 'Update Ready',
        message:
          'The update has been downloaded. The application will now restart to install the update.',
        buttons: ['Restart Now'],
      })
      .then(() => {
        autoUpdater.quitAndInstall(); // Restart and install the update
      });
  });

  // Event: Error
  autoUpdater.on('error', (error) => {
    log.error('Error during update:', error);
    dialog.showMessageBox({
      type: 'error',
      title: 'Update Error',
      message: `An error occurred while checking for updates: ${error.message}`,
      buttons: ['OK'],
    });
  });
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
