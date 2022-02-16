/*
*
* Title: Application routes
* Description: application routes.
* Data: 16-02-2022
*
* */

// Dependencies
const { sampleHandler } = require('../handlers/sample')
// const { notFound } = require('../handlers/notFound')

// App object - module scaffolding
let routes = {
    sample: sampleHandler,
    // notFound: notFound()
}

module.exports = routes
