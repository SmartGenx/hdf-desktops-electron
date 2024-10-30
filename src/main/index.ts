import { app, shell, BrowserWindow, ipcMain, Menu } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'

import { spawn } from 'child_process'
function createWindow(): void {
  const iconPath = join(__dirname, '../../../resources/logo.ico')
  const mainWindow = new BrowserWindow({
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
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
