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

// Parse JSON data
utilities.parseJSON = (jsonStr) => {
    let parseResult;

    try {
        parseResult = JSON.parse(jsonStr)
    } catch (ex) {
        parseResult = {}
    }

    return parseResult
}

// Hash password
utilities.hash = (str) => {
    if (typeof (str) === 'string' && str.length > 0) {
        return crypto.createHmac('sha256', config.get('secreteKey'))
                .update(str)
                .digest('hex');
    } else {
        return false
    }
}

utilities.randStr = (strLen) => {
    let len = strLen
    len = typeof (len) === 'number' && len > 0 ? len : false

    // Generate random string for token
    // if (len) {
    //     let genChar = ''
    //     const possibleChar = 'abcdefghijklmnopqrstuvwxyz1234567890'
    //     for ( let i = 0; i < possibleChar.length; i++ ) {
    //         genChar += possibleChar.charAt(Math.floor(Math.random() * possibleChar.length));
    //     }
    //     return genChar
    // } else {
    //     return false
    // }

    if (len) {
        let genChar = ''
        const possibleChar = 'abcdefghijklmnopqrstuvwxyz1234567890'
        for ( let i = 0; i < possibleChar.length; i++ ) {
            genChar += possibleChar.charAt(Math.floor(Math.random() * possibleChar.length));
        }
        return genChar
    }

    // Shortest way to generate random string
    // if (len) {
    //     return Buffer.from(Math.random().toString()).toString("base64").substr(0, len);
    // }

    // if (len) {
    //     let possibleChar = 'abcdefghijklmnopqrstuvwxyz1234567890'
    //     let genChar = ''
    //
    //     for (let i; i <= len; i++) {
    //         let randChar= possibleChar.charAt(Math.floor(Math.random() * possibleChar.length))
    //         genChar += randChar
    //     }
    //
    //     return genChar
    // }
    return false
}


module.exports = utilities

