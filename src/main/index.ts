import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/مؤسسة التنمية الصحية 2.png?asset'
import { spawn } from 'child_process'
function createWindow(): void {
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    title: 'مؤسسة التنمية الصحية',
    icon: join(__dirname, '../../resources/مؤسسة التنمية الصحية 2.png'),

    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
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
  let serverPath = join(__dirname, '../../../server/index.js')

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
