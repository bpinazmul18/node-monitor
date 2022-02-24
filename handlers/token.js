/*
*
* Title: Token handler
* Description: Token handler is a token related route.
* Data: 21-02-2022
*
* */

// Dependencies
const data = require('../lib/data')
const { hash, parseJSON} = require('../helpers/utilities')
const { randStr } = require('../helpers/utilities')

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
    // Check validity
    const phone = typeof (reqProps.body.phone) === 'string' && reqProps.body.phone.trim().length === 11 ? reqProps.body.phone : false
    const password = typeof (reqProps.body.password) === 'string' && reqProps.body.password.trim().length > 0 ? reqProps.body.password : false

    if(phone && password) {
        data.read('users', phone, (err, result) => {
            const userData = {...parseJSON(result)}
            let hashPass = hash(password)
            if (hashPass === userData.password) {
                const tokenId = randStr(30)
                // console.log('check tokenId...', tokenId)
                const expiredTime = Date.now() + 60 * 60 * 1000
                // console.log('check expired time...', expiredTime)
                const tokenObj = {
                    tokenId,
                    expiredTime,
                    phone,
                }

                // Store token

                data.create('tokens', tokenId, tokenObj, (err) => {
                    // console.log('create error...', err)
                    if(!err) {
                        callback(200, {
                            tokenObj
                        })
                    } else {
                        callback(500, {
                            error: 'There was a error in server!'
                        })
                    }
                })
            } else {
                callback(400, {
                    error: 'Password is not valid!'
                })
            }
        })
    } else {
        callback(400, {
            error: 'You have problem in your request!'
        })
    }

}

handler._token.get = (reqProps, callback) => {
    // Check id is valid
    const id = typeof (reqProps.queryStringObject.id) === 'string' && reqProps.queryStringObject.id.trim().length === 30 ? reqProps.queryStringObject.id : false
    // console.log('check id...', reqProps.queryStringObject.id.trim().length)
    if (id) {
        // Lookup the tokens
        data.read('tokens', id, (err, result) => {
            const tokens = {...parseJSON(result)}

            if (!err && tokens) {
                callback(200, tokens)
            } else {
                callback(404, {
                    error: "Requested token was not found!"
                })
            }
        })
    } else {
        callback(404, {
            error: "Requested tokens was not found!"
        })
    }
}

handler._token.put = (reqProps, callback) => {
    // Check validity
    const id = typeof (reqProps.body.id) === 'string' && reqProps.body.id.trim().length === 30 ? reqProps.body.id : false
    const extend = typeof (reqProps.body.extend) === 'boolean' && reqProps.body.extend === true
    // console.log(extend)
    if (id && extend) {
        data.read('tokens', id, (err, result) => {
            const tokens = {...parseJSON(result)}
            if (tokens.expiredTime > Date.now()) {
                tokens.expiredTime = Date.now() + 60 * 60 * 1000

                // Update token
                data.update('tokens', id, tokens, (err) => {
                    if (!err) {
                        callback(200, {
                            message: 'User was successfully updated!'
                        })
                    } else {
                        callback(500, {
                            error: 'There was an error in server side!'
                        })
                    }
                })
            } else {
                callback(404, {
                    error: 'Token already expired!'
                })
            }
        })
    } else {
        callback(400, {
            error: "There was a problem in your request!"
        })
    }
}

handler._token.delete = (reqProps, callback) => {
    // Check validity
    const id = typeof (reqProps.queryStringObject.id) === 'string' && reqProps.queryStringObject.id.trim().length === 30 ? reqProps.queryStringObject.id : false
    console.log('check id...', id)

    if (id) {
        data.read('tokens', id, (err, tokensData) => {
            if (!err && tokensData) {
                data.delete('tokens', id, (err) => {
                    if (!err) {
                        callback(200, {
                            message: 'User was successfully delete!'
                        })
                    } else {
                        callback(500, {
                            error: 'There was an error in server side!'
                        })
                    }
                })
            } else {
                callback(500, {
                    error: 'There was an error in server side!'
                })
            }
        })
    } else {
        callback(400, {
            message: 'You have a problem in your request!'
        })
    }
}

handler._token.verify = (id, phone, callback) => {
    data.read('tokens', id, (err, result) => {
        const tokenData = parseJSON(result)
        
        if (!err && tokenData) {
            if (tokenData.phone === phone && tokenData.expiredTime > Date.now()) {
                callback(true)   
            } else {
                callback(false)
            }
        } else {
            callback(false)
        }
    })
}

module.exports = handler
