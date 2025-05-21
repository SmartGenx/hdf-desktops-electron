import {
  app,
  shell,
  BrowserWindow,
  ipcMain,
  Menu,
  dialog,
  Notification
} from 'electron';
import { join } from 'path';
import { electronApp, optimizer, is } from '@electron-toolkit/utils';
import log from 'electron-log';
import { autoUpdater } from 'electron-updater';
import { spawn } from 'child_process';

let mainWindow: BrowserWindow;

function createWindow(): void {
  const iconPath = join(__dirname, '../../../resources/logo.ico');

  mainWindow = new BrowserWindow({
    width: 1700,
    height: 1000,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { iconPath } : {}),
    title: 'مؤسسة التنمية الصحية',
    icon: iconPath,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      webSecurity: false     
    }
  });

  mainWindow.on('ready-to-show', () => mainWindow.show());

  mainWindow.webContents.setWindowOpenHandler(details => {
    shell.openExternal(details.url);
    return { action: 'deny' };
  });

  mainWindow.webContents.on('context-menu', () => {
    const contextMenu = Menu.buildFromTemplate([
      { role: 'cut', label: 'قطع' },
      { role: 'copy', label: 'نسخ' },
      { role: 'paste', label: 'لصق' },
      { type: 'separator' },
      { role: 'selectAll', label: 'تحديد الكل' }
    ]);
    contextMenu.popup();
  });

  if (is.dev && process.env.ELECTRON_RENDERER_URL) {
    mainWindow.loadURL(process.env.ELECTRON_RENDERER_URL);
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'), {
      hash: '/'
    });
  }
}

function startLocalServer(): void {
  const serverPath = is.dev
    ? join(__dirname, '../../server/index.ts')
    : join(__dirname, '../../../server/index.ts');

  console.log(`Starting server with path: ${serverPath}`);

  const serverProcess = spawn('ts-node', [serverPath], {
    stdio: 'inherit',
    shell: true,
    windowsHide: true
  });

  serverProcess.on('error', err =>
    console.error(`Error starting server: ${err.message}`)
  );
  serverProcess.on('close', code =>
    console.log(`Server process exited with code ${code}`)
  );
}

function initAutoUpdate(): void {
  autoUpdater.logger = log;
  log.transports.file.level = 'info';

  autoUpdater.autoDownload = false;    
  autoUpdater.checkForUpdates();

  autoUpdater.on('update-available', async info => {
    log.info('Update available:', info);

    const { response } = await dialog.showMessageBox(mainWindow, {
      type: 'info',
      title: 'تحديث متوفر',
      message: `نسخة جديدة (${info.version}) متوفرة.\nالنسخة الحالية: ${app.getVersion()}.\nهل ترغب في تنزيلها؟`,
      buttons: ['نعم', 'لا'],
      defaultId: 0,
      cancelId: 1
    });

    if (response === 0) {
      mainWindow.setProgressBar(0);   
      autoUpdater.downloadUpdate();
    }
  });

  autoUpdater.on('download-progress', p => {
    log.info(`Download progress: ${p.percent.toFixed(2)} %`);
    mainWindow.setProgressBar(p.percent / 100);
  });

  autoUpdater.on('update-downloaded', async info => {
    log.info('Update downloaded:', info);
    mainWindow.setProgressBar(-1); // إخفاء الشريط

    new Notification({
      title: 'التحديث جاهز',
      body: `تم تنزيل الإصدار ${info.version}.`
    }).show();

    const { response } = await dialog.showMessageBox(mainWindow, {
      type: 'info',
      title: 'التحديث جاهز',
      message:
        'تم تنزيل التحديث بنجاح.\nسيُعاد تشغيل التطبيق الآن لتثبيت التحديث.',
      buttons: ['أعد التشغيل الآن', 'لاحقاً'],
      defaultId: 0,
      cancelId: 1
    });

    if (response === 0) {
      autoUpdater.quitAndInstall();
    }
  });

  autoUpdater.on('error', err => {
    mainWindow.setProgressBar(-1);
    log.error('Updater error:', err);
    dialog.showErrorBox(
      'خطأ في التحديث',
      `حدث خطأ أثناء التحقق من التحديثات:\n${err == null ? '' : err.message}`
    );
  });
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron');
  app.on('browser-window-created', (_, win) => optimizer.watchWindowShortcuts(win));

  ipcMain.on('ping', () => console.log('pong'));

  createWindow();
  startLocalServer();
  initAutoUpdate();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
