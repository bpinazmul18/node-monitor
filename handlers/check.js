/*
*
* Title: Check handler
* Description: Check handler to check user defined links.
* Data: 25-02-2022
*
* */

// Dependencies
const config = require('config')
const data = require('../lib/data')
const { hash, randStr } = require('../helpers/utilities')
const { parseJSON } = require('../helpers/utilities')
const { _token } = require('./token')

// App object - module scaffolding
const handler = {}

handler.checkHandler = (reqProps, callback) => {
    const acceptedMethod = ['get', 'post', 'put', 'delete']
    const reqMethod = acceptedMethod.indexOf(reqProps.method)
    if (reqMethod > -1) {
        handler._check[reqProps.method](reqProps, callback)
    } else {
        callback(405)
    }
}

handler._check = {}

handler._check.post = (reqProps, callback) => {
    // Input validation
    const protocol = typeof(reqProps.body.protocol) === 'string' && ['http', 'https'].indexOf(reqProps.body.protocol) > -1 ? reqProps.body.protocol : false
    const url = typeof(reqProps.body.url) === 'string' && reqProps.body.url.trim().length > 0 ? reqProps.body.url : false
    const method = typeof(reqProps.body.method) === 'string' && ['post', 'get', 'put', 'delete'].indexOf(reqProps.body.method) > -1 ? reqProps.body.method : false
    const statusCodes = typeof(reqProps.body.statusCodes) === 'object' && reqProps.body.statusCodes instanceof Array ? reqProps.body.statusCodes : false
    const timeout = typeof(reqProps.body.timeout) === 'number' && reqProps.body.timeout % 1 === 0 && reqProps.body.timeout >= 1 && reqProps.body.timeout <= 5 ? reqProps.body.timeout : false

    // Check validation
    if (protocol && url && method && statusCodes && timeout) {
        // Get token from headers
        const token = typeof(reqProps.headersObjects.token) === 'string' ? reqProps.headersObjects.token : false
        if (token) {
            // Lookup the user phone by reading the token
            data.read('tokens', token, (err, result) => {
                if (!err && result) {
                // Parse JSON data
                const tokenData = parseJSON(result)

                // Get user phone number 
                const phone = tokenData.phone

                // Lookup the user data
                data.read('users', phone, (err, result) => {
                    // Parse JSON data
                    const user = parseJSON(result)

                    if (!err && user) {
                        // Check token
                        _token.verify(token, phone, (tokenIsValid) => {
                            // Check token validity
                            if (tokenIsValid) {
                                // Check user cheks availability
                                const userChecks = typeof(user.checks) === 'object' && user.checks instanceof Array ? user.checks : []
                                const maxChecks = config.get('maxChecks')

                                // User checks limited
                                if (userChecks.length < maxChecks) {
                                    // Create checkId
                                    const checkId = randStr(20)
                                    const check = {
                                        id: checkId,
                                        phone,
                                        protocol,
                                        url,
                                        method,
                                        statusCodes,
                                        timeout
                                    }

                                    // Save the check object
                                    data.create('checks', checkId, check, (err) => {
                                        if (!err) {
                                            // Add the check id to the users object
                                            user.checks = userChecks
                                            user.checks.push(checkId)

                                            // Save the new user data
                                            data.update('users', phone, user, (err) => {
                                                if (!err) {
                                                    callback(200, check)
                                                } else {
                                                    callback(500, {
                                                        error: 'There was a problem in server'
                                                    })
                                                }
                                            })
                                        } else {
                                            callback(500, {
                                                error: 'There was a problem in server!'
                                            })
                                        }
                                    })
                                } else {
                                    callback(401, {
                                        error: 'User has already reached max check limit!'
                                    })
                                }

                            } else {
                                callback(401, {
                                    error: 'Authentication problem!'
                                })
                            }
                        })

                    } else {
                        callback(404, {
                            error: 'User not found!'
                        })
                    }
                })
                } else {
                    callback(401, {
                        error: 'Authentication problem!'
                    })
                }
            })

        } else {
            callback(401, {
                error: 'Unauthorized user!'
            })
        }
    } else {
        callback(400, {
            error: 'You have problem in your request!'
        })
    }


}

handler._check.get = (reqProps, callback) => {
    // Get id from queryString
    const id = typeof reqProps.queryStringObject.id === 'string' && reqProps.queryStringObject.id.trim().length === 20 ? reqProps.queryStringObject.id : false

    if (id) {
        // Lookup the check
        data.read('checks', id, (err, result) => {
            // Parse JSON data
            const checkData = parseJSON(result)
            const phone = checkData.phone

            if (!err && checkData) {
                // Get token from header
                const token = typeof(reqProps.headersObjects.token) === 'string' ? reqProps.headersObjects.token : false

                // Check authenticate user
                _token.verify(token, phone, (tokenIsValid) => {
                    if (tokenIsValid) {
                        callback(200, checkData)
                    } else {
                        callback(401, {
                            error: 'User not authenticate!'
                        })
                    }
                })
            } else {
                callback(404, {
                    error: 'Not found!'
                })
            }
        })
    } else {
        callback(400, {
            error: 'You have problem in your request!'
        })
    }
}

handler._check.put = (reqProps, callback) => {
    // Get id to update user
    const id = typeof(reqProps.body.id) === 'string' && reqProps.body.id.trim().length === 20 ? reqProps.body.id : false

    // Input validation
    const protocol = typeof(reqProps.body.protocol) === 'string' && ['http', 'https'].indexOf(reqProps.body.protocol) > -1 ? reqProps.body.protocol : false
    const url = typeof(reqProps.body.url) === 'string' && reqProps.body.url.trim().length > 0 ? reqProps.body.url : false
    const method = typeof(reqProps.body.method) === 'string' && ['post', 'get', 'put', 'delete'].indexOf(reqProps.body.method) > -1 ? reqProps.body.method : false
    const statusCodes = typeof(reqProps.body.statusCodes) === 'object' && reqProps.body.statusCodes instanceof Array ? reqProps.body.statusCodes : false
    const timeout = typeof(reqProps.body.timeout) === 'number' && reqProps.body.timeout % 1 === 0 && reqProps.body.timeout >= 1 && reqProps.body.timeout <= 5 ? reqProps.body.timeout : false

    if (id) {
        // Atleast one filed requiered to update check
        if (protocol || url || method || statusCodes || timeout) {
            // Lookup the checks
            data.read('checks', id, (err, result) => {
                const checkData = parseJSON(result)
                const phone = checkData.phone
                const token = typeof(reqProps.headersObjects.token) === 'string' ? reqProps.headersObjects.token : false

                if (!err && result) {
                    // Verify token

                    _token.verify(token, phone, (tokenIsValid) => {
                      if (tokenIsValid) {
                          if (protocol) checkData.protocol = protocol
                          if (url) checkData.url = url
                          if (method) checkData.method = method
                          if (statusCodes) checkData.statusCodes = statusCodes
                          if (timeout) checkData.timeout = timeout

                          // Update the check
                            data.update('checks', id, checkData, (err) => {
                                if (!err) {
                                    callback(200, checkData)
                                } else {
                                    callback(500, {
                                        error: 'There was a problem in server!'
                                    })
                                }
                            })
                      } else {
                          callback(401, {
                              error: 'Unauthorized user!'
                          })
                      }
                    })
                } else {
                    callback(500, {
                        error: 'There was a problem in server!'
                    })
                }
            })
        } else {
            callback(400, {
                error: 'Must provide at least one field to update!'
            })
        }

    } else {
        callback(400, {
            error: 'You have problem in your request!'
        })
    }



}

handler._check.delete = (reqProps, callback) => {
    // Get id from queryString
    const id = typeof reqProps.queryStringObject.id === 'string' && reqProps.queryStringObject.id.trim().length === 20 ? reqProps.queryStringObject.id : false

    if (id) {
        // Lookup the check
        data.read('checks', id, (err, result) => {
            // Parse JSON data
            const checkData = parseJSON(result)
            const phone = checkData.phone

            if (!err && checkData) {
                // Get token from header
                const token = typeof(reqProps.headersObjects.token) === 'string' ? reqProps.headersObjects.token : false

                // Check authenticate user
                _token.verify(token, phone, (tokenIsValid) => {
                    if (tokenIsValid) {
                        // Delete the check data
                        data.delete('checks', id, (err) => {
                            if (!err) {
                                // Lookup the user data
                                data.read('users', phone, (err, result) => {
                                    // Parse JSON data
                                    const userData = parseJSON(result)
                                    const checks = typeof(userData.checks) === 'object' && userData.checks instanceof Array ? userData.checks : []

                                    // check position
                                    const checkIndex = checks.indexOf(id)

                                    if (checkIndex > -1) {
                                        // Remove check
                                        checks.splice(checkIndex, 1)

                                        // Resave the user data
                                        data.update('users', phone, userData, (err) => {
                                            if (!err) {
                                                callback(200, userData)
                                            } else {
                                                callback(500, {
                                                    error: 'There was problem in server!'
                                                })
                                            }
                                        })
                                    } else {
                                        callback(500, {
                                            error: 'The checkId was not found in the user!'
                                        })
                                    }
                                })
                            } else {
                                callback(500, {
                                    error: 'There was problem in server!'
                                })
                            }
                        })
                        
                    } else {
                        callback(401, {
                            error: 'User not authenticate!'
                        })
                    }
                })
            } else {
                callback(404, {
                    error: 'Not found!'
                })
            }
        })
    } else {
        callback(400, {
            error: 'You have problem in your request!'
        })
    }
}

module.exports = handler
