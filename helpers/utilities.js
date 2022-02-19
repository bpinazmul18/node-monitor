/*
*
* Title: Utilities
* Description: Handling request body when client create user.
* Data: 19-02-2022
*
* */

// Dependencies
const crypto = require('crypto')
const config = require('config')

// Utilities object - module scaffolding
let utilities = {}

utilities.parseJSON = (jsonStr) => {
    let parseResult;

    try {
        parseResult = JSON.parse(jsonStr)
    } catch (ex) {
        parseResult = {}
    }

    return parseResult
}

utilities.hash = (str) => {
    if (typeof (str) === 'string' && str.length > 0) {
        return crypto.createHmac('sha256', config.get('secreteKey'))
                .update(str)
                .digest('hex');
    } else {
        return false
    }
}


module.exports = utilities

