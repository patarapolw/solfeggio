import path from 'path'

import fastify from 'fastify'
import fastifyStatic from 'fastify-static'

const HOST = process.env['HOST'] || 'localhost'

const SERVER_PORT = process.env['SERVER_PORT'] || require('../package.json').config.serverPort
process.env['SERVER_PORT'] = SERVER_PORT

async function main() {
    const app = fastify()

    app.register(fastifyStatic, {
        root: path.resolve(__dirname, '../public')
    })

    app.listen(SERVER_PORT, HOST, (err) => {
        if (err) {
            process.exit(1)
        }

        if (process.send) {
            process.send('ready')
        }
    })
}

main()
