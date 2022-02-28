/*
*
* Title: Notification library
* Description: Notify to user using twilio.
* Data: 25-02-2022
*
* */

// Dependencies
const https = require('https')
const querystring = require('querystring')
const config = require('config')

// Notifications object - module scaffolding
let notifications = {}

// Send sms to user using twilio
notifications.sendSms = (_phone, _msg, callback) => {
    // Input validation
    const phone = typeof(_phone) === 'string' && _phone.trim().length === 11 ? _phone.trim() : false
    const userMsg = typeof(_msg) === 'string' && _msg.trim().length > 0 && _msg.trim().length <= 1600 ? _msg.trim() : false

    if (phone && userMsg) {
        // Configure the request payload
        // const payload = {
        //     from: config.get('twilio').from,
        //     to: `+88${phone}`,
        //     MessagingServiceSid: config.get('twilio').accountSID,
        //     Body: userMsg
        // }

        const payload = {
            to: `+88${phone}`,
            MessagingServiceSid: config.get('twilio').accountSID,
            Body: userMsg
        }

        console.log('check payload...', payload)

        // Stringify the payload
        const stringifyPayload = querystring.stringify(payload);

        console.log('check stringifyPayload...', stringifyPayload)
        console.log('Check accountSID: ', config.get('twilio').accountSID)
        console.log('Check authToken: ', config.get('twilio').authToken)

        // Configure the request details
        const reqDetails = {
            hostname: 'api.twilio.com',
            method: 'POST',
            path: `/2010-04-01/Accounts/${config.get('twilio').accountSID}}/Messages.json`,
            auth: `${config.get('twilio').accountSID}:${config.get('twilio').authToken}`,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        };

        console.log('check reqDetails...', reqDetails)


        // Instantiate the request object
        const req = https.request(reqDetails, (res) => {
            // Get the status of the sent request
            const status = res.statusCode;
            // Callback successfully if the request went through
            if (status === 200 || status === 201) {
                callback(false);
            } else {
                callback(`Status code returned was ${status}`);
            }
        });

        req.on('error', (e) => {
            callback(e);
        });

        req.write(stringifyPayload);
        req.end();


        
        // Request details
        // const reqDetails = {
        //     hostname : 'api.twilio.com',
        //     method : 'POST',
        //     // path : `/2010-04-01/Accounts/${config.get('twilio').accountSID}/Messages.json`,
        //     path : `/2010-04-01/Accounts/${config.get('twilio').accountSID}/Messages/MM800f449d0399ed014aae2bcc0cc2f2ec.json`,
        //     auth : `${config.get('twilio').accountSID}:${config.get('twilio').authToken}`,
        //     headers: {
        //         'Content-Type': 'application/x-www-form-urlencoded',
        //     },
        //     // headers: {
        //     //     'Content-Type' : 'application/x-www-form-urlencoded'
        //     // }
        // }

        // console.log('check reqDetails...', reqDetails)

        // Instantiate the request object
        // const req = https.request(reqDetails, (res) => {
        //     // Get the status code send the request
        //     const status = res.statusCode
            
        //     // Callback successfully if the request through
        //     if (status === 200 || status === 201) {
        //         callback(false)
        //     } else {
        //         callback(`Status code returned was ${status}`)
        //     }
        // })

        // Handle error events
        // req.on('error', (err) => {
        //     console.log('check error...', err)
        //     callback(err)
        // })

        // Send the payload
        // req.write(stringifyPayload)
        // req.end()
    } else {
        callback('Given parameters were missing or invalid!')
    }

}

module.exports = notifications
