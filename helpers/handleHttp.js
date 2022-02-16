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

const routes = require('../routes')
const { notFound } = require('../handlers/notFound')


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

    // Request properties
    const reqProps = {
        parsedUrl,
        path,
        trimPath,
        method,
        queryStringObject,
        headersObjects
    }


    // Chosen handler
    const chosenHandler = routes[trimPath] ? routes[trimPath] : notFound

    chosenHandler(reqProps, (statusCode, payload)=> {
        // check to validated
        statusCode = typeof statusCode === 'number' ? statusCode : 500
        payload    = typeof payload === 'object' ? payload : {}

        // convert to json
        const payloadStr = JSON.stringify(payload)

        // return the final response
        res.writeHead(statusCode)
        res.end(payloadStr)
    })

    // Decode data
    const decoder = new StringDecoder('utf-8')
    let originalData = ''

    req.on('data', (buffer) => {
        originalData += decoder.write(buffer)
    })

    req.on('end', () => {
        originalData += decoder.end()
        // console.log('real data...', originalData)
        res.end(originalData)
    })
}


module.exports = httpHandler
