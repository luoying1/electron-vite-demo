import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
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

  // console.log('process.env: ', process.env)
  console.log('is--: ', is) // { dev: true }

  // 基于 electron-vite CLI 的渲染进程热模块替换（HMR）。
  // 在开发环境中加载远程 URL，在生产环境中加载本地 HTML 文件。https://cn.electron-vite.org/guide/hmr
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// 当 Electron 完成初始化并准备好创建浏览器窗口时会调用此方法。
// 一些 API 只能在此事件发生后才能使用
app.whenReady().then(() => {
  // 为 Windows 设置应用程序用户模型 ID
  electronApp.setAppUserModelId('com.electron')

  // 在开发环境中按 F12 默认打开或关闭开发者工具
  // 在生产环境中忽略 CommandOrControl + R 快捷键
  // 参见：https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  createWindow()

  app.on('activate', function () {
    // 在 macOS 上，当点击 Dock 图标且没有其他窗口打开时，
    // 通常会重新创建一个应用窗口。
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// 当所有窗口都被关闭时退出应用，macOS 除外。
// 在 macOS 上，通常应用及其菜单栏会保持激活状态，直到用户使用 Cmd + Q 显式退出。
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// 在这个文件中，你可以包含应用特定的主进程代码的其余部分。
// 你也可以将它们放在单独的文件中，并在这里引入
