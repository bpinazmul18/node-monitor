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