/*
*
* Title: User handler
* Description: User handler to create user, get user and update user.
* Data: 18-02-2022
*
* */

// Dependencies

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

    let uiId = 1
    callback(200, {
        id: ++uiId,
        name: 'Nazmul',
        description: 'This is a user url',
        message: 'How are you?'
    })
}

handler._users = {}
handler._users.post = (reqProps, callback) => {
    console.log('check post...', reqProps)
}
handler._users.get = (reqProps, callback) => {}
handler._users.put = (reqProps, callback) => {}
handler._users.delete = (reqProps, callback) => {}

module.exports = handler
