/*
*
* Title: Application routes
* Description: application routes.
* Data: 16-02-2022
*
* */

// Dependencies
const { sampleHandler } = require('../handlers/sample')
const { userHandler } = require('../handlers/user')
// const { notFound } = require('../handlers/notFound')

// App object - module scaffolding
let routes = {
    sample: sampleHandler,
    user: userHandler,
    // notFound: notFound()
}

module.exports = routes
