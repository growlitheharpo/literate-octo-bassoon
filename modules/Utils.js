'use strict'

const path = require('path')
const fs = require('fs').promises
const jsmediatags = require('jsmediatags')

async function getFiles(dir) {
    let subdirs = await fs.readdir(dir)
    let files = await Promise.all(subdirs.map(async (subdir) => {
        const res = path.resolve(dir, subdir)
        try {
            const s = await fs.stat(res)
            return s.isDirectory() ? await getFiles(res) : res
        } catch (err) {
            return ""
        }
    }))
    return files.reduce((a, f) => a.concat(f), [])
}

exports.getFiles = getFiles

exports.parseTag = async function(filename) {
    try {
        return await new Promise((resolve, reject) => {
            new jsmediatags.Reader(filename)
                .read({
                    onSuccess: (res) => {
                        resolve(res)
                    },
                    onError: (err) => {
                        reject(err)
                    }
                })
        })
    } catch (err) {
        return {}
    }
}
