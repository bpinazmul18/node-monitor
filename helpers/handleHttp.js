/*
*
* Title: Handling http
* Description: Handle request and response.
* Data: 16-02-2022
*
* */

// Dependencies
const url  = require('url')
const { StringDecoder } = require('string_decoder')

// handleHttp object - module scaffolding
let httpHandler = {}

// Handling request and response
httpHandler.handleHttp = (req, res) => {
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


module.exports = httpHandler
