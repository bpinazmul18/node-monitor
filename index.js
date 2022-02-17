/*
*
* Title: Node Monitoring -app
* Description: Monitor node to check up/down user provide links and notify user.
* Data: 16-02-2022
*
* */

// Dependencies
const config = require('config')
const http = require('http')
const httpHandler = require('./helpers/handleHttp')

// App object - module scaffolding
let app = {}

// Setup port
const port = config.get('port')

// Configuration
// app.config = {
//      port: process.env.PORT || 9000,
// }

// Create server
app.createServer = () => {
     const server = http.createServer (httpHandler.handleHttp)

     // Listen server
     server.listen(port, () => {
          console.log(`Server listing on port ${port}`)
     })
}

// Start the server
app.createServer()
