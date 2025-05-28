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
import { spawn, ChildProcess } from 'child_process';
import fs from 'fs';

let mainWindow: BrowserWindow;
let serverProcess: ChildProcess | null = null;
let serverHealthy = false;

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
      webSecurity: false,
      contextIsolation: true,
      nodeIntegration: false
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
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'));
  }
}

function checkServerHealth(): Promise<boolean> {
  return new Promise((resolve) => {
    const request = net.request({
      method: 'GET',
      url: 'http://localhost:5050/health'
    });

    let responseReceived = false;

    const timeoutId = setTimeout(() => {
      if (!responseReceived) {
        request.abort();
        console.log('Server health check timed out');
        resolve(false);
      }
    }, 5000);

    request.on('response', (response) => {
      responseReceived = true;
      clearTimeout(timeoutId);
      let data = '';
      
      response.on('data', (chunk) => {
        data += chunk;
      });
      
      response.on('end', () => {
        if (response.statusCode === 200) {
          log.info('Server health check passed ✓');
          serverHealthy = true;
          resolve(true);
        } else {
          log.warn(`Server health check returned status: ${response.statusCode}`);
          resolve(false);
        }
      });
    });

    request.on('error', (error) => {
      if (!responseReceived) {
        log.warn(`Server health check failed: ${error.message}`);
        resolve(false);
      }
    });

    setTimeout(() => {
      if (!responseReceived) {
        log.warn('Server health check fallback timeout');
        resolve(false);
      }
    }, 6000);

    request.end();
  });
}

function startLocalServer(): void {
  log.info('Starting local server...');
  
  if (is.dev) {
    const serverPath = join(__dirname, '../../server/index.ts');
    log.info(`Starting server in dev mode with path: ${serverPath}`);
    
    try {
      require.resolve('ts-node');
    } catch (e) {
      log.error('ts-node not found. Installing server dependencies...');
      dialog.showErrorBox(
        'خطأ في الخادم',
        'لم يتم العثور على ts-node. يرجى تشغيل: npm install'
      );
      return;
    }
    
    const devEnv = {
      ...process.env,
      DATABASE_URL: process.env.DATABASE_URL || 'postgresql://postgres:12345@localhost:5432/hdf-production?schema=public',
      CLOUD_DATABASE_URL: process.env.CLOUD_DATABASE_URL || 'postgresql://postgres:123456789@15.207.99.228:5432/hdf?schema=public',
      JWT_SECRET: process.env.JWT_SECRET || 'bvhdbvsbvjksbksvvns',
      LOCAL_DB_ID: process.env.LOCAL_DB_ID || 'LOCAL_DB_ID',
      PORT: '5050'
    };
    
    log.info('Starting server with env:', {
      DATABASE_URL: devEnv.DATABASE_URL ? 'Set (value hidden)' : 'Not set',
      CLOUD_DATABASE_URL: devEnv.CLOUD_DATABASE_URL ? 'Set (value hidden)' : 'Not set',
      JWT_SECRET: devEnv.JWT_SECRET ? 'Set (value hidden)' : 'Not set',
      LOCAL_DB_ID: devEnv.LOCAL_DB_ID,
      PORT: devEnv.PORT
    });
    
    serverProcess = spawn('npx', ['ts-node', serverPath], {
      stdio: 'inherit',
      shell: true,
      windowsHide: true,
      cwd: join(__dirname, '../../server'),
      env: devEnv
    });

    serverProcess.on('error', (err: Error) => {
      log.error(`Error starting dev server: ${err.message}`);
      if (!serverHealthy) {
        dialog.showErrorBox(
          'خطأ في الخادم',
          `فشل تشغيل الخادم المحلي: ${err.message}`
        );
      }
    });
    
    serverProcess.on('exit', (code: number | null, signal: string | null) => {
      log.info(`Dev server process exited with code ${code}, signal ${signal}`);
      
      if (code && code !== 0 && !signal && !serverHealthy) {
        dialog.showErrorBox(
          'خطأ في الخادم',
          `توقف الخادم المحلي بشكل غير متوقع. رمز الخروج: ${code}`
        );
      }
      
      serverHealthy = false;
    });
  } else {
    // Production mode with enhanced path resolution
    const possibleServerPaths = [
      join(process.resourcesPath, 'server', 'dist', 'index.js'),
      join(process.resourcesPath, 'server', 'index.js'),
      join(__dirname, '../../../server/dist/index.js')
    ];

    let serverPath = '';
    let serverDir = '';

    // Find the correct server path
    for (const path of possibleServerPaths) {
      if (fs.existsSync(path)) {
        serverPath = path;
        serverDir = require('path').dirname(path);
        break;
      }
    }

    if (!serverPath) {
      log.error('Server file not found in any expected location');
      dialog.showErrorBox(
        'خطأ في الخادم',
        'لم يتم العثور على ملفات الخادم. يرجى إعادة تثبيت التطبيق.'
      );
      return;
    }

    log.info(`Starting server in production mode with path: ${serverPath}`);
    log.info(`Server directory: ${serverDir}`);
    log.info(`Resource path: ${process.resourcesPath}`);
    
    // Load .env file for production builds
    const loadedEnvVars: Record<string, string> = {};
    try {
      const envPath = join(process.resourcesPath, '.env');
      if (fs.existsSync(envPath)) {
        log.info(`Loading .env file from: ${envPath}`);
        const envContent = fs.readFileSync(envPath, 'utf8');
        const envLines = envContent.split('\n');
        
        for (const line of envLines) {
          const trimmedLine = line.trim();
          if (trimmedLine && !trimmedLine.startsWith('#')) {
            const parts = trimmedLine.split('=');
            if (parts.length >= 2) {
              const key = parts[0].trim();
              const value = parts.slice(1).join('=')
                .replace(/^"(.*)"$/, '$1')
                .replace(/^'(.*)'$/, '$1');
              
              if (key && value) {
                process.env[key] = value;
                loadedEnvVars[key] = value;
              }
            }
          }
        }
        log.info('Loaded environment variables from .env file');
        log.info('Loaded variables: ' + Object.keys(loadedEnvVars).join(', '));
      } else {
        log.warn(`.env file not found at: ${envPath}`);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      log.error(`Error loading .env file: ${errorMessage}`);
    }
    
    // Enhanced environment setup for production
    const serverEnv = {
      ...process.env,
      NODE_ENV: 'production',
      RESOURCES_PATH: process.resourcesPath,
      PRISMA_SCHEMA_PATH: join(process.resourcesPath, 'prisma', 'schema.prisma'),
      DATABASE_URL: process.env.DATABASE_URL || 'postgresql://postgres:12345@localhost:5432/hdf-production?schema=public',
      CLOUD_DATABASE_URL: process.env.CLOUD_DATABASE_URL || 'postgresql://postgres:123456789@smartgenx.cvo4o480qqmw.ap-south-1.rds.amazonaws.com:5432/hdf_platform?schema=public',
      JWT_SECRET: process.env.JWT_SECRET || 'bvhdbvsbvjksbksvvns',
      LOCAL_DB_ID: process.env.LOCAL_DB_ID || 'LOCAL_DB_ID',
      PORT: '5050',
      PATH: process.env.PATH
    };

    log.info('Server environment:', {
      NODE_ENV: serverEnv.NODE_ENV,
      RESOURCES_PATH: serverEnv.RESOURCES_PATH,
      DATABASE_URL: 'Set (value hidden)',
      PORT: serverEnv.PORT,
      CWD: serverDir
    });

    const { execSync } = require('child_process');
    try {
      const nodeVersion = execSync('node --version', { encoding: 'utf8' }).trim();
      log.info(`Node.js version: ${nodeVersion}`);
    } catch (e) {
      log.error('Node.js not found in PATH');
    }

    serverProcess = spawn('node', [serverPath], {
      stdio: ['ignore', 'pipe', 'pipe'],
      shell: true,
      windowsHide: true,
      env: serverEnv,
      cwd: serverDir
    });

    if (serverProcess.stdout) {
      serverProcess.stdout.on('data', (data: Buffer) => {
        const output = data.toString();
        log.info(`Server: ${output.trim()}`);
        if (output.includes('Server running on port')) {
          log.info('✓ Server started successfully!');
          serverHealthy = true;
        }
      });
    }

    if (serverProcess.stderr) {
      serverProcess.stderr.on('data', (data: Buffer) => {
        const error = data.toString();
        if (error.toLowerCase().includes('warn')) {
          log.warn(`Server warning: ${error.trim()}`);
        } else {
          log.error(`Server error: ${error.trim()}`);
        }
      });
    }

    serverProcess.on('error', (err: Error) => {
      log.error(`Error starting production server: ${err.message}`);
      if (!serverHealthy) {
        dialog.showErrorBox(
          'خطأ في الخادم',
          `فشل تشغيل الخادم: ${err.message}\n\nيرجى التحقق من أن المنفذ 5050 غير مستخدم.`
        );
      }
    });
    
    serverProcess.on('exit', (code: number | null, signal: string | null) => {
      log.info(`Production server process exited with code ${code}, signal ${signal}`);
      
      if (code && code !== 0 && !signal && !serverHealthy) {
        dialog.showErrorBox(
          'خطأ في الخادم',
          `توقف الخادم بشكل غير متوقع. رمز الخروج: ${code}\n\nيرجى إعادة تشغيل التطبيق.`
        );
      }
      
      serverHealthy = false;
    });
  }
  
  setTimeout(async () => {
    log.info('Checking server health...');
    
    const isHealthy = await checkServerHealth();
    
    if (isHealthy) {
      log.info('Server is healthy and ready to use');
    } else {
      log.warn('Server health check failed, but continuing...');
      
      const retryIntervals = [2000, 4000, 8000];
      for (const interval of retryIntervals) {
        await new Promise(resolve => setTimeout(resolve, interval));
        log.info(`Retrying server health check after ${interval}ms...`);
        
        const retryHealthy = await checkServerHealth();
        if (retryHealthy) {
          log.info('Server health check passed on retry');
          break;
        }
      }
    }
  }, 3000);
}

function initAutoUpdate(): void {
  if (is.dev) {
    log.info('Auto-updater disabled in development mode');
    return;
  }

  autoUpdater.logger = log;
  log.transports.file.level = 'info';

  autoUpdater.autoDownload = true;
  autoUpdater.autoInstallOnAppQuit = true;
  
  setInterval(() => {
    autoUpdater.checkForUpdates().catch(err => {
      log.error('Periodic update check failed:', err);
    });
  }, 4 * 60 * 60 * 1000);
  
  setTimeout(() => {
    autoUpdater.checkForUpdates().catch(err => {
      log.error('Initial update check failed:', err);
    });
  }, 30000);

  autoUpdater.on('update-available', async info => {
    log.info('Update available:', info);
    
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
    mainWindow.setProgressBar(-1);

    new Notification({
      title: 'التحديث جاهز',
      body: `الإصدار ${info.version} سيتم تثبيته عند إعادة تشغيل التطبيق.`,
      silent: false
    }).show();
  });

  autoUpdater.on('error', err => {
    mainWindow.setProgressBar(-1);
    log.error('Updater error:', err);
    
    const errorMessage = err?.message || '';
    const isNetworkError = errorMessage.includes('404') || 
                          errorMessage.includes('ENOTFOUND') || 
                          errorMessage.includes('ECONNREFUSED') ||
                          errorMessage.includes('net::') ||
                          errorMessage.includes('getaddrinfo');
    
    if (!isNetworkError && !is.dev) {
      dialog.showErrorBox(
        'خطأ في التحديث',
        `حدث خطأ أثناء التحقق من التحديثات:\n${errorMessage}`
      );
    }
  });
}

ipcMain.handle('check-server-health', async () => {
  return await checkServerHealth();
});

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron');
  app.on('browser-window-created', (_, win) => optimizer.watchWindowShortcuts(win));

  ipcMain.on('ping', () => console.log('pong'));

  createWindow();
  
  setTimeout(() => {
    startLocalServer();
  }, 1000);
  
  if (!process.env.DISABLE_AUTO_UPDATE) {
    initAutoUpdate();
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (serverProcess) {
    log.info('Killing server process...');
    serverProcess.kill();
  }
  if (process.platform !== 'darwin') app.quit();
});