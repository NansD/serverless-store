'use strict'
const userUtils = require('../models/userUtils')
const sanitize = require('mongo-sanitize')

require('./db') // setup database connexion

module.exports.getUser = async (event, context) => {
  var statusCode = 200
  var message = 'getUser endpoint called'
  var result = {}
  const queryStringParameters = sanitize(event.queryStringParameters)
  const userAndBasket = await userUtils.getUserAndBasket(queryStringParameters.userId)
  if (userAndBasket.user === null) {
    result = "couldn't find user"
    statusCode = 404
    message += 'user not found'
  } else {
    result = userAndBasket
    message += 'user found'
  }

  return {
    statusCode: statusCode,
    body: JSON.stringify({
      message: message,
      queryStringParameters: queryStringParameters,
      result: result
    })
  }
}
