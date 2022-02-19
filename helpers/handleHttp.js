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
    // console.log(chosenHandler())

    // Decode data
    const decoder = new StringDecoder('utf-8')
    let originalData = ''

    req.on('data', (buffer) => {
        originalData += decoder.write(buffer)
    })

    req.on('end', () => {
        originalData += decoder.end()
        // console.log('real data...', originalData)

        chosenHandler(reqProps, (statusCode, payload)=> {
            // console.log('check reqProps...', reqProps)
            // console.log('check reqProps...', statusCode)
            // console.log('check reqProps...', payload)
            // check to validated
            statusCode = typeof statusCode === 'number' ? statusCode : 500
            payload    = typeof payload === 'object' ? payload : {}

            // convert to json
            const payloadStr = JSON.stringify(payload)

            // return the final response
            // res.writeHead(statusCode, { 'Content-Type': 'application/json' })
            res.setHeader('Content-Type', 'application/json')
            res.writeHead(statusCode)
            res.end(payloadStr)
        })

        // res.end(originalData)
    })
}


module.exports = httpHandler
