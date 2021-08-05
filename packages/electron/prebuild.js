// @ts-check

const fs = require('fs')
const pkg = require('./package.json')

if (!fs.existsSync('package.orig.json') || process.env.OVERWRITE) {
    fs.copyFileSync('package.json', 'package.orig.json')
}

try {
    const pkgServer = require('../server/package.json')
    Object.assign(pkg.dependencies, pkgServer.dependencies)

    fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2))
} catch (e) {
    console.error(e)
}
