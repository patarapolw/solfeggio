// @ts-check

const { fork } = require('child_process')
const path = require('path')

const { app, BrowserWindow } = require('electron')
const { kill } = require('cross-port-killer')

const ROOT = path.resolve(__dirname, '..')
const SERVER_PORT = process.env.SERVER_PORT || require('../package.json').config.serverPort
process.env.SERVER_PORT = SERVER_PORT

const srvProcess = fork(path.join(ROOT, 'server/index.js'), {
    stdio: 'inherit',
    env: process.env
})

srvProcess.on('exit', () => {
    app.quit()
})

require('electron-context-menu')()

async function main() {
    await app.whenReady()

    const win = new BrowserWindow({
        width: 800,
        height: 600
    })

    win.maximize()
    win.show()

    app.on('window-all-closed', () => {
        kill(SERVER_PORT).then(() => app.quit())
    })

    // win.loadFile(path.join(ROOT, 'loading.html'))

    srvProcess.on('message', (msg) => {
        if (msg === 'ready') {
            win.loadURL(`http://localhost:${SERVER_PORT}/app/`)
        }
    })
    srvProcess.send('ready')
}

main()
