import path from 'path'

import fastify from 'fastify'
import fastifyStatic from 'fastify-static'

const HOST = process.env['HOST'] || 'localhost'

const PORT = process.env['SERVER_PORT'] || process.env['PORT'] || require('../package.json').config.serverPort
process.env['PORT'] = PORT

async function main() {
    const app = fastify()

    app.register(fastifyStatic, {
        root: path.resolve(__dirname, '../public')
    })

    app.listen(PORT, HOST, (err) => {
        if (err) {
            process.exit(1)
        }

        if (process.send) {
            process.send('ready')
        }

        process.on('message', (msg) => {
            if (process.send && msg === 'ready') {
                process.send('ready')
            }
        })
    })
}

main()
