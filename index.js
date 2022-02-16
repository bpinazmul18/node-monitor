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
     // Parse url
     const parsedUrl = url.parse(req.url, true)
     const path = parsedUrl.pathname
     const trimPath = path.replace(/^\/+|\/+$/g, "")
     const queryStringObject = parsedUrl.query

     // Method
     const method = req.method.toLowerCase()

     // Headers
     const headersObjects = req.headers

     // Decode data
     const decoder = new StringDecoder('utf-8')
     let originalData = ''

     req.on('data', (buffer) => {
          originalData += decoder.write(buffer)
     })

     req.on('end', () => {
          originalData += decoder.end()
          console.log('real data...', originalData)
          res.end('Hello world')
     })



}

// Start the server
app.createServer()
