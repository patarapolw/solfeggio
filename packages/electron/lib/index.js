// @ts-check

const { fork } = require('child_process')
const path = require('path')

const { app, BrowserWindow } = require('electron')

const ROOT = path.resolve(__dirname, '..')
const SERVER_PORT = process.env.SERVER_PORT || require('../package.json').config.serverPort
process.env.SERVER_PORT = SERVER_PORT

const srvProcess = fork(path.join(ROOT, 'server/server.js'), {
    stdio: 'inherit',
    env: process.env
})

srvProcess.on('exit', () => {
    app.quit()
})

require('death')(() => {
    srvProcess.send('on-quit')

    setTimeout(() => {
        srvProcess.kill()
    }, 5000)
})

require('electron-context-menu')()

async function main() {
    await app.whenReady()

    const win = new BrowserWindow({
        width: 800,
        height: 600
    })

    win.maximize()

    app.on('window-all-closed', () => {
        app.quit()
    })

    win.loadFile(path.join(ROOT, 'loading.html'))

    srvProcess.once('ready', () => {
        win.loadURL(`http://localhost:${SERVER_PORT}`)
    })
    srvProcess.send('on-ready')
}

main()
