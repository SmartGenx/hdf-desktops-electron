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
    serverPath = join(__dirname, '../../server/index.ts')
  } else {
    serverPath = join(__dirname, '../../../server/index.ts')
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

  const serverProcess = spawn('ts-node', [serverPath], {
    stdio: 'inherit', // Passes stdio to the parent process, useful for debugging    "start": "ts-node index.ts"
    shell: true,
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
      title: 'تحديث متوفر',
      message: `نسخة جديدة (${info.version}) متوفرة. النسخة الحالية: ${app.getVersion()}. هل ترغب في تنزيلها؟`,
      buttons: ['نعم', 'لا'],
    })

      .then((result) => {
        if (result.response === 0) {
          // Start downloading the update
          autoUpdater.downloadUpdate();
          dialog.showMessageBox({
            type: 'info',
            title: 'جارٍ تنزيل التحديث',
            message: 'التحديث قيد التنزيل. يرجى الانتظار.',
            buttons: ['موافق'],
          });

        }
      });
  });

  // Event: No updates available
  // autoUpdater.on('update-not-available', (info) => {
  //   log.info('No updates available:', info);
  //   dialog.showMessageBox({
  //     type: 'info',
  //     title: 'لا توجد تحديثات',
  //     message: 'أنت تستخدم أحدث إصدار.',
  //     buttons: ['موافق'],
  //   });

  // });

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
    dialog.showMessageBox({
      type: 'info',
      title: 'التحديث جاهز',
      message:
        'تم تنزيل التحديث. ستتم إعادة تشغيل التطبيق الآن لتثبيت التحديث.',
      buttons: ['أعد التشغيل الآن'],
    })

      .then(() => {
        autoUpdater.quitAndInstall(); // Restart and install the update
      });
  });

  // Event: Error
  // autoUpdater.on('error', (error) => {
  //   log.error('Error during update:', error);
  //   dialog.showMessageBox({
  //     type: 'error',
  //     title: 'خطأ في التحديث',
  //     message: `حدث خطأ أثناء التحقق من التحديثات: ${error.message}`,
  //     buttons: ['موافق'],
  //   });

  // });
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
