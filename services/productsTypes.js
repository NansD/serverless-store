'use strict'
const Product = require('../models/product')
require('./db') // setup database connexion

module.exports.productsTypes = async (event, context) => {
  var statusCode = 200
  var message = 'productsTypes endpoint called'
  const types = await Product.find().distinct('type', function (err, docs) {
    if (err || docs.length === 0) {
      statusCode = 404
      message = 'no type found'
    } else {
      message = 'types found'
    }
    return docs
  })

  return {
    statusCode: statusCode,
    body: JSON.stringify({
      message: message,
      input: event.queryStringParameters,
      types: types
    })
  }
}
