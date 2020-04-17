const path = require('path')
const isDev = require('electron-is-dev')
const fs = require('fs')
const { app, BrowserWindow } = require('electron')

let mainWindow;

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })

  // and load the index.html of the app.
  // if (isDev) {
  //   // DEVELOPMENT mode
  //   console.log('DEVELOPMENT');
  //   mainWindow.loadURL('http://localhost:3000')
  //   mainWindow.webContents.openDevTools()
  // } else {
    // PRODUCTION mode
    console.log('PRODUCTION');
    mainWindow.loadFile(path.join(__dirname, 'build/index.html'))
    // mainWindow.loadURL(path.join(__dirname, 'build/index.html'))
  // }
  

  // Open the DevTools.
  // win.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    mainWindow = null
    app.quit()
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.