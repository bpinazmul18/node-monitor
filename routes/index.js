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
const { tokenHandler } = require('../handlers/token')
const { checkHandler } = require('../handlers/check')
// const { notFound } = require('../handlers/notFound')

// App object - module scaffolding
let routes = {
    sample: sampleHandler,
    user: userHandler,
    token: tokenHandler,
    check: checkHandler
    // notFound: notFound()
}

module.exports = routes
