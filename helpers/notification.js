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

// Module scaffolding
const notifications = {}

// Send sms to user using twilio api
notifications.sendSMS = (phone, msg, callback) => {
   // Input validation
   const userPhone = typeof phone === 'string' && phone.trim().length === 11 ? phone.trim() : false
   const userMsg = typeof msg === 'string' && msg.trim().length > 0 && msg.trim().length <= 1600 ? msg.trim() : false

   if (userPhone && userMsg) {
       // Configure the request payload
       const payload = {
           From: config.get('twilio').from,
           To: `+88${userPhone}`,
           Body: userMsg,
       };

       // Stringify the payload
       const stringifyPayload = querystring.stringify(payload);

       // Configure the request details
       const reqDetails = {
           hostname: 'api.twilio.com',
           method: 'POST',
           path: `/2010-04-01/Accounts/${config.get('twilio').accountSID}/Messages.json`,
           auth: `${config.get('twilio').accountSID}:${config.get('twilio').authToken}`,
           headers: {
               'Content-Type': 'application/x-www-form-urlencoded',
           },
       };

       // Instantiate the request object
       const req = https.request(reqDetails, (res) => {
           // Get the status of the sent request
           const status = res.statusCode;
           // Callback successfully if the request went through
           if (status === 200 || status === 201) {
               callback(false)
           } else {
               callback(`Status code returned was ${status}`)
           }
       });

       req.on('error', (e) => {
           callback(e);
       });

       req.write(stringifyPayload);
       req.end();
   } else {
       callback('Given parameters were missing or invalid!');
   }
};

module.exports = notifications;
