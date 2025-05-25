import {
  app,
  shell,
  BrowserWindow,
  ipcMain,
  Menu,
  dialog,
  Notification,
  net
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
  // Skip auto-update in development mode
  if (is.dev) {
    log.info('Auto-updater disabled in development mode');
    return;
  }

  autoUpdater.logger = log;
  log.transports.file.level = 'info';

  // Enable silent background downloads like VS Code
  autoUpdater.autoDownload = true;
  autoUpdater.autoInstallOnAppQuit = true;
  
  // Check for updates every 4 hours
  setInterval(() => {
    autoUpdater.checkForUpdates().catch(err => {
      log.error('Periodic update check failed:', err);
    });
  }, 4 * 60 * 60 * 1000);
  
  // Delay initial check to avoid startup errors
  setTimeout(() => {
    autoUpdater.checkForUpdates().catch(err => {
      log.error('Initial update check failed:', err);
    });
  }, 30000); // Check after 30 seconds

  autoUpdater.on('update-available', async info => {
    log.info('Update available:', info);
    
    // Show subtle notification instead of blocking dialog
    new Notification({
      title: 'تحديث متوفر',
      body: `يتم تنزيل الإصدار ${info.version} في الخلفية...`,
      silent: true
    }).show();

    mainWindow.setProgressBar(0);
  });

  autoUpdater.on('download-progress', p => {
    log.info(`Download progress: ${p.percent.toFixed(2)} %`);
    mainWindow.setProgressBar(p.percent / 100);
  });

  autoUpdater.on('update-downloaded', async info => {
    log.info('Update downloaded:', info);
    mainWindow.setProgressBar(-1); // إخفاء الشريط

    // Show notification that update will install on next restart
    new Notification({
      title: 'التحديث جاهز',
      body: `الإصدار ${info.version} سيتم تثبيته عند إعادة تشغيل التطبيق.`,
      silent: false
    }).show();

    // Update will install automatically when app is closed
    // No need to force restart like VS Code behavior
  });

  autoUpdater.on('error', err => {
    mainWindow.setProgressBar(-1);
    log.error('Updater error:', err);
    
    // Only show error dialog for critical errors, not network issues
    const errorMessage = err?.message || '';
    const isNetworkError = errorMessage.includes('404') || 
                          errorMessage.includes('ENOTFOUND') || 
                          errorMessage.includes('ECONNREFUSED') ||
                          errorMessage.includes('net::') ||
                          errorMessage.includes('getaddrinfo');
    
    if (!isNetworkError && !is.dev) {
      // Only show dialog for non-network errors in production
      dialog.showErrorBox(
        'خطأ في التحديث',
        `حدث خطأ أثناء التحقق من التحديثات:\n${errorMessage}`
      );
    }
  });
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron');
  app.on('browser-window-created', (_, win) => optimizer.watchWindowShortcuts(win));

  ipcMain.on('ping', () => console.log('pong'));

  createWindow();
  startLocalServer();
  
  // Initialize auto-updater after window is ready
  if (!process.env.DISABLE_AUTO_UPDATE) {
    initAutoUpdate();
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
