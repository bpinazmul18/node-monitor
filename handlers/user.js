/*
*
* Title: User handler
* Description: User handler to create user, get user and update user.
* Data: 18-02-2022
*
* */

// Dependencies
const data = require('../lib/data')
const { hash } = require('../helpers/utilities')

// App object - module scaffolding
const handler = {}

handler.userHandler = (reqProps, callback) => {
    // console.log('testing for sample handler...')
    const acceptedMethod = ['get', 'post', 'update', 'delete']
    const reqMethod = acceptedMethod.indexOf(reqProps.method)
    // console.log(reqProps)
    // acceptedMethod.indexOf(reqProps.method)
    // console.log(acceptedMethod.indexOf(reqProps.method))
    if (reqMethod > -1) {
        handler._users[reqProps.method](reqProps, callback)
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

handler._users = {}
handler._users.post = (reqProps, callback) => {
    // console.log('check post...', reqProps)
    // callback(200)

    const firstName = typeof (reqProps.body.firstName) === 'string' && reqProps.body.firstName.trim().length > 0 ? reqProps.body.firstName : false
    const lastName = typeof (reqProps.body.lastName) === 'string' && reqProps.body.lastName.trim().length > 0 ? reqProps.body.lastName : false
    const phone = typeof (reqProps.body.phone) === 'string' && reqProps.body.phone.trim().length === 11 ? reqProps.body.phone : false
    const password = typeof (reqProps.body.password) === 'string' && reqProps.body.password.trim().length > 0 ? reqProps.body.password : false
    const tosAgreement = typeof (reqProps.body.tosAgreement) === 'boolean' && reqProps.body.tosAgreement ? reqProps.body.tosAgreement : false

    if (firstName && lastName && phone && tosAgreement) {
        data.read('users', phone, (err, user) => {
            if (err) {
                let userObj = {
                    firstName,
                    lastName,
                    phone,
                    password: hash(password),
                    tosAgreement
                }

                data.create('users', phone, userObj, (err) => {
                    if (!err) {
                        callback(200, {
                            message: 'User was successfully created.'
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
            error: 'You have problem in your request!'
        })
    }
}
handler._users.get = (reqProps, callback) => {}
handler._users.put = (reqProps, callback) => {}
handler._users.delete = (reqProps, callback) => {}

module.exports = handler
