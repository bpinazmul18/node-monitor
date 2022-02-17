/*
*
* Title: File system
* Description: Store data in file system.
* Data: 17-02-2022
*
* */

// Dependencies
const fs = require('fs')
const path = require('path')

// Lib object - module scaffolding
let lib = {}

// Setup base directory
lib.baseDir = path.join(__dirname, '/../.data/')

// Write data to file
lib.create = (dir, file, data, callback) => {
    // Open file for writing
    fs.open(lib.baseDir + dir + '/' + file + '.json', 'wx', (err, fileDescriptor) => {
        if (!err && fileDescriptor) {
            // Convert data to string
            const strData = JSON.stringify(data)

            // Write file and exit
            fs.writeFile(fileDescriptor, strData, (err) => {
                if (!err) {
                    fs.close(fileDescriptor, (err) => {
                        if(!err) {
                            callback(false)
                        } else {
                            callback('Error closing the new file!')
                        }
                    })
                } else {
                    callback('Error writing to new file!')
                }
            })
        } else {
            callback('Could not create new file. It may already exists!', err)
        }
    })
}

module.exports = lib
