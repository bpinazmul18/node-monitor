/*
*
* Title: Node Monitoring -app
* Description: Monitor node to check up/down user provide links and notify user.
* Data: 16-02-2022
*
* */

// Dependencies
const http = require('http')

// App object - module scaffolding
let app = {}

// Configuration
app.config = {
     port: process.env.PORT || 9000,
}

// Create server
app.createServer = () => {
     const server = http.createServer (app.handleHttp)

     server.listen(app.config.port, () => {
          console.log(`Server listing on port ${app.config.port}`)
     })
}

// Handling request and response
app.handleHttp = (req, res) => {
     res.end('Hello world')
}

// Start the server
app.createServer()
