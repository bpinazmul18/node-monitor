/*
*
* Title: Token handler
* Description: Token handler is a token related route.
* Data: 21-02-2022
*
* */

// Dependencies
const data = require('../lib/data')
const { hash } = require('../helpers/utilities')
const { parseJSON } = require('../helpers/utilities')

// App object - module scaffolding
const handler = {}

handler.tokenHandler = (reqProps, callback) => {
    // console.log('testing for sample handler...')
    const acceptedMethod = ['get', 'post', 'put', 'delete']
    const reqMethod = acceptedMethod.indexOf(reqProps.method)
    // console.log(reqProps)
    // acceptedMethod.indexOf(reqProps.method)
    // console.log(acceptedMethod.indexOf(reqProps.method))
    if (reqMethod > -1) {
        handler._token[reqProps.method](reqProps, callback)
        // console.log('accept method', reqProps.method)
    } else {
        callback(405)
    }

    // let uiId = 1
    // callback(200, {
    //     id: ++uiId,
    //     name: 'Nazmul',
    //     description: 'This is a user url',
    //     message: 'How are you?'
    // })
}

handler._token = {}
handler._token.post = (reqProps, callback) => {
    // console.log('check post...', reqProps)
    // callback(200)

}

/*
* Authentication
* */
handler._token.get = (reqProps, callback) => {
    // Check phone number is valid
    // console.log(reqProps.queryStringObject)
}

/*
* Authentication
* */
handler._token.put = (reqProps, callback) => {
    // Check validity
}

/*
* Authentication
* */
handler._token.delete = (reqProps, callback) => {
    // Check validity
}

module.exports = handler
