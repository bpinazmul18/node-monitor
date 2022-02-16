/*
*
* Title: Not found handler
* Description: Not found handler.
* Data: 16-02-2022
*
* */

// Dependencies

// App object - module scaffolding
const handler = {}

handler.notFound = (reqProps, callback) => {
    console.log('testing for notFound handler...')
    callback(404, {
        id: new Date().toLocaleString(),
        name: 'Nazmul',
        description: 'This is a notFound url',
        message: 'How are you?'
    })
}

module.exports = handler
