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
lib.baseDir = path.join(__dirname, '/../data/')

module.exports = lib
