/*
*
* Title: Node Monitoring -app
* Description: Monitor node to check up/down user provide links and notify user.
* Data: 16-02-2022
*
* */

// Dependencies
const http = require('http')
const url  = require('url')
const { StringDecoder } = require('string_decoder')
const httpHandler = require('./helpers/handleHttp')

// App object - module scaffolding
let app = {}

// Configuration
app.config = {
     port: process.env.PORT || 9000,
}

// Create server
app.createServer = () => {
     const server = http.createServer (httpHandler.handleHttp)

     // Listen server
     server.listen(app.config.port, () => {
          console.log(`Server listing on port ${app.config.port}`)
     })
}

// Start the server
app.createServer()
