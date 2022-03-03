/*
*
* Title: Worker file
* Description: Worker file to initial Worker configuration file.
* Data: 28-02-2022
*
* */

// Dependencies
const http = require('http')
const https = require('https')
const url = require('url')
const data = require('../lib/data')
const { parseJSON } = require('../helpers/utilities')
const { sendSMS } = require('../helpers/notification')


// App object - module scaffolding
let worker = {}

// Execute all checks
worker.gatherAllChecks = () => {
    // Get all checks
    data.list('checks', (err, checks) => {
        if (!err && checks && checks.length > 0) {
            // Iterate checks
            checks.forEach((check) => {
            // Read the checkData
                data.read('checks', check, (err, result) => {
                    // Conver json to stringify
                    const check = parseJSON(result)

                    if (!err && check) {
                        // Check validator
                        // console.log('check check...', check);
                        worker.checkValidate(check)
                    } else {
                        console.log('Erorr: reading one of the checks data!')
                    }
                })

            })


            
        } else {
            console.log('Erorr: couldn\'t find check!')
        }
    })
}

// Validate check data
worker.checkValidate = (check) => {
    if (check && check?.id) {
    // console.log('check check...', check);

        check.state = typeof (check.state) === 'string' && ['up', 'down'].indexOf((check.state) > -1 ? check.state : 'down')
        check.lastChecked = typeof(check.lastChecked) === 'number' && check.lastChecked > 0 ? check.lastChecked : false

        // Pass the next process
        worker.performCheck(check)
        // console.log('check check...', check);
    } else {
        console.log('Error: check was invalid or not properly formated!')
    }
}

// Perform check
worker.performCheck = (check) => {
    // Prepare the initial outcome
    let checkOutCome = {
        error: false,
        responseStatus: false
    }

    // console.log('check checkOutCome...', checkOutCome);

    // Mark the outcome has not been send yet
    let outComeSent = false 

    // Check the hostname & full url
    const parsedUrl = url.parse(`${check.protocol}://${check.url}`, true)
    const hostname = parsedUrl.hostname
    const path = parsedUrl.path

    // Constract the request
    const reqDetails = {
        protocol: `${check.protocol}:`,
        hostname: hostname,
        method: check.method.toUpperCase(),
        path: path,
        timeout: check.timeout * 1000
    }

    // Request protocol
    const reqProtocol = check.protocol === 'http' ? http : https

    // Send the request
    const req = reqProtocol.request(reqDetails, (res) => {
        // Get status code
        const status = res.statusCode

        // console.log('check status code...', status);

        // Update the check outcome and pass to the next process
        checkOutCome.statusCode = status

        // console.log('check out come status code...', checkOutCome);
        if (!outComeSent) {
            worker.processCheckOutCome(check, checkOutCome)
            outComeSent = true
        }
    })


    // Error event
    req.on('error', (err) => {
        // Update checkOutCome
        checkOutCome = {
            error: true,
            value: err
        }

        if (!outComeSent) {
            worker.processCheckOutCome(check, checkOutCome)
            outComeSent = true
        }
    })


    // Timeout
    req.on('timeout', (e) => {
        // Update checkOutCome
        checkOutCome = {
            error: true,
            value: 'timeout'
        }

        if (!outComeSent) {
            worker.processCheckOutCome(check, checkOutCome)
            outComeSent = true
        }
    })

    // Request sent
    req.end()
}

// Process checkout come
worker.processCheckOutCome = (check, checkOutCome) => {
    // console.log('check process check out come...', check);
    // console.log('check process out come cehckout come...', checkOutCome);
    // let state = !checkOutCome.error && checkOutCome.statusCode && check.statusCodes && check.statusCodes.indexOf((checkOutCome.statusCode) > -1 ? 'up' : 'down')
    const state = !checkOutCome.error && checkOutCome.statusCode && check.statusCodes.indexOf(checkOutCome.statusCode) > -1 ? 'up' : 'down';
    // console.log('check state...', state);
    // console.log(!checkOutCome.error && checkOutCome.statusCode && check.statusCodes)
    // console.log('check state...', check.statusCodes);
    // console.log('check out come state...', checkOutCome.statusCode);
    // Decide whether we should alert the user or not
    let alert = check.lastChecked && check.state !== state ? true : false

    // Update the check
    let newCheck = check
    newCheck.state = state
    newCheck.lastChecked = Date.now()

    // Update the datebase
    data.update('checks', newCheck.id, newCheck, (err) => {
        if (!err) {
            // Send the check to next process
            if (alert) {
                worker.alertToUser(newCheck)
            } else {
                console.log('No need alert to state change!', err)
            }

        } else {
            console.log('Error: save the check data!', err)
        }
    })
}


// Send notification to user for state change
worker.alertToUser = (check) => {
    // console.log('check alert user check...', check);
    // Message
    const msg = `Alert: your check for ${check.method.toUpperCase()} ${check.protocol}://${check.url} is currently ${check.state}`

    // console.log('check...', check);
    // console.log('msg:', msg)

    // Send alert to user using twilio
    sendSMS(check.phone, msg, (err) => {
        // console.log('check send SMS...', err);
        if (!err) {
            console.log(`User was alerted to status change via sms: ${msg}`)
        } else {
            console.log('There was problem to send sms to user!', err)
        }
    })

    sendSMS('01768665824', 'Hello', (err) => {
        console.log('send sms...', err);
    })


}

// Timer to execute the worker process once per minute
worker.loop = () => {
    setInterval(()=> {
        worker.gatherAllChecks()
    }, 2000 * 2)
}

// Start the server
worker.init = () => {
    // Execute all checks
    worker.gatherAllChecks()

    // Call the loop so that checks continue
    worker.loop()
    // console.log('workers started...')
}

module.exports = worker
