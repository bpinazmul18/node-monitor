/*
*
* Title: Sample handler
* Description: Sample handler.
* Data: 16-02-2022
*
* */

// Dependencies

// App object - module scaffolding
const handler = {}

handler.sampleHandler = (reqProps, callback) => {
    console.log('testing for sample handler...')
    callback(200, {
        id: new Date().toLocaleString(),
        name: 'Nazmul',
        description: 'This is a sample url',
        message: 'How are you?'
    })
}

module.exports = handler
