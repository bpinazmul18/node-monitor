/*
*
* Title: Node Monitoring -app
* Description: Monitor node to check up/down user provide links and notify user.
* Data: 16-02-2022
*
* */

// Dependencies
const config = require('config')
const http = require('http')
const httpHandler = require('./helpers/handleHttp')
const data = require('./lib/data')

// App object - module scaffolding
let app = {}

// Setup port
const port = config.get('port')

// Create data
// data.create('test', 'newFile', {'name': 'Nazmul', age: 21}, (err) => {
//      console.log('check events fired...', err)
// })

// Read data
// data.read('test', 'newFile', (err, data) => {
//      console.log(err, data)
// })

// Update data
// data.update('test', 'newFile', {'name': 'Nazmul', age: 22}, (err) => {
//      console.log('check events fired...', err)
// })

// Delete data
data.delete('test', 'newFile', (err) => {
     console.log(err)
})


// Create server
app.createServer = () => {
     const server = http.createServer (httpHandler.handleHttp)

     // Listen server
     server.listen(port, () => {
          console.log(`Server listing on port ${port}`)
     })
}

// Start the server
app.createServer()
