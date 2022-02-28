/*
*
* Title: Server file
* Description: Server file to initial server configuration file.
* Data: 28-02-2022
*
* */

// Dependencies
const config = require('config')
const http = require('http')
const httpHandler = require('../helpers/handleHttp')


// App object - module scaffolding
let server = {}

// Setup port
const port = config.get('port')

// Create server
server.createServer = () => {
     const createServer = http.createServer (httpHandler.handleHttp)

     // Listen server
     createServer.listen(port, () => {
          console.log(`Server listing on port ${port}`)
     })
}

// Start the server
server.init = () => {
    server.createServer()
}

module.exports = server
