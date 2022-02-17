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
    // console.log('testing for sample handler...')
    let uiId = 1
    callback(200, {
        id: ++uiId,
        name: 'Nazmul',
        description: 'This is a sample url',
        message: 'How are you?'
    })
}

module.exports = handler
