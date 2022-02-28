/*
*
* Title: Worker file
* Description: Worker file to initial Worker configuration file.
* Data: 28-02-2022
*
* */

// Dependencies
const config = require('config')
const http = require('http')
const httpHandler = require('../helpers/handleHttp')


// App object - module scaffolding
let worker = {}

// Start the server
worker.init = () => {
    console.log('workers started...')
}

module.exports = worker
