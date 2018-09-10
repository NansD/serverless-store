'use strict'

const User = require('../models/user')
require('./db') // setup database connexion

// TODO: use something else than GET for a authentication request ...

module.exports.auth = async (event, context) => {
  var statusCode = 0
  var message = 'auth endpoint called, nothing happened'
  const queryStringParameters = event.queryStringParameters
  if (!queryStringParameters.email || !queryStringParameters.password) {
    statusCode = 404
    message = 'Wrong parameters'
  }
  const user = await User.findOne(
    {
      email: queryStringParameters.email,
      password: queryStringParameters.password
    },
    function (err, doc) {
      if (err || doc === null) {
        statusCode = 500
        message =
          "auth endpoint called, but couldn't find a matching user in the database"
      } else {
        statusCode = 200
        message = 'auth endpoint called, user successfully authenticated'
      }
      return doc
    }
  )
  return {
    statusCode: statusCode,
    body: JSON.stringify({
      message: message,
      input: event.queryStringParameters,
      user: user
    })
  }
}
