/*
*
* Title: Project initial file
* Description: Initial file to start the node server and workers.
* Data: 28-02-2022
*
* */

// Dependencies
const server = require('./lib/server')
const worker = require('./lib/worker')
// const { sendSMS } = require ('./helpers/notification')

// sendSMS('01768665824', 'Hello', (err) => {
//      console.log('send sms...', err);
// })

// App object - module scaffolding
let app = {}

app.init = () => {
     // Start the server
     server.init()

     // Start the worker
     worker.init()
}

app.init()

module.exports = app