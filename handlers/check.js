/*
*
* Title: Check handler
* Description: Check handler to check user defined links.
* Data: 25-02-2022
*
* */

// Dependencies
const data = require('../lib/data')
const { hash } = require('../helpers/utilities')
const { parseJSON } = require('../helpers/utilities')
const { _token } = require('./token')

// App object - module scaffolding
const handler = {}

handler.checkHandler = (reqProps, callback) => {
    const acceptedMethod = ['get', 'post', 'put', 'delete']
    const reqMethod = acceptedMethod.indexOf(reqProps.method)
    if (reqMethod > -1) {
        handler._check[reqProps.method](reqProps, callback)
    } else {
        callback(405)
    }
}

handler._check = {}

handler._check.post = (reqProps, callback) => {}

handler._check.get = (reqProps, callback) => {}

handler._check.put = (reqProps, callback) => {}

handler._check.delete = (reqProps, callback) => {}

module.exports = handler
