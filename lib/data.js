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
    fs.open(`${lib.baseDir + dir}/${file}.json`, 'wx', (err, fileDescriptor) => {
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

// Read data to file
lib.read = (dir, file, callback) => {
    fs.readFile(`${lib.baseDir + dir}/${file}.json`, 'utf8', (err, data) => {
        // console.log('check error:', err)
        callback(err, data)
    })
}

// Update to file
lib.update = (dir, file, data, callback) => {
    // Open file for writing
    fs.open(`${lib.baseDir + dir}/${file}.json`, 'r+', (err, fileDescriptor) => {
        if (!err && fileDescriptor) {
            // Convert data to string
            const strData = JSON.stringify(data)

            // truncate the file
            fs.ftruncate(fileDescriptor, (err) => {
                if (!err) {
                    // Write file
                    fs.writeFile(fileDescriptor, strData, (err) => {
                        if (!err) {
                            fs.close(fileDescriptor, (err) => {
                                if(!err) {
                                    callback(false)
                                } else {
                                    callback('Error closing the file!')
                                }
                            })
                        } else {
                            callback('Error writing to file!')
                        }
                    })
                } else {
                    callback('Error truncating file!')
                }
            })

        } else {
            callback('Error updating. File may not exist!')
        }
    })
}

// Delete data to file
lib.delete = (dir, file, callback) => {
    fs.unlink(`${lib.baseDir + dir}/${file}.json`, (err) => {
        if (!err) {
            callback(false)
        } else {
            callback('Error deleting file!')
        }
    })
}

// List all the item in derectory
lib.list = (dir, callback) => {
    fs.readdir(`${lib.baseDir + dir}/`, (err, fileNames) => {
        if (!err && fileNames && fileNames.length > 0) {
            let trimedFileNames = []

            // Add trimedFiles
            fileNames.forEach(fileName => {
                trimedFileNames.push(fileName.replace('.json', ''))
            })

            // Return trimedFileNames
            callback(false, trimedFileNames)
        } else {
            callback('Error reading directory')
        }
    })
}

module.exports = lib
