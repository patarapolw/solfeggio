import { fork } from 'child_process'
import path from 'path'

import { kill } from 'cross-port-killer'
import { BrowserWindow, Menu, app } from 'electron'
import contextMenu from 'electron-context-menu'

import { buildMenu } from './menu'

contextMenu()

const ROOT = path.resolve(__dirname, '..')
const SERVER_PORT = process.env['SERVER_PORT'] || require('../package.json').config.serverPort
process.env['SERVER_PORT'] = SERVER_PORT

const srvProcess = fork(path.join(ROOT, 'server/index.js'), {
    stdio: 'inherit',
    env: {
        ...process.env,
        PORT: SERVER_PORT
    }
})

srvProcess.on('exit', () => {
    app.quit()
})

async function main() {
    await app.whenReady()

    // @ts-ignore
    Menu.setApplicationMenu(Menu.buildFromTemplate(buildMenu()))

    const win = new BrowserWindow({
        width: 800,
        height: 600
    })

    win.maximize()
    win.show()

    app.on('window-all-closed', () => {
        kill(SERVER_PORT).then(() => app.quit())
    })

    // win.loadFile(path.join(ROOT, 'public/loading/index.html'))

    srvProcess.on('message', (msg) => {
        if (msg === 'ready') {
            win.loadURL(`http://localhost:${SERVER_PORT}/app/index.html`)
        }
    })
    srvProcess.send('ready')
}

main()

