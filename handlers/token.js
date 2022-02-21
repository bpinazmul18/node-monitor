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
