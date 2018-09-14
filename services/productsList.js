'use strict'
const Product = require('../models/product')
const sanitize = require('mongo-sanitize')
require('./db') // setup database connexion

module.exports.productsList = async (event, context) => {
  var statusCode = 200
  var message = 'productsList endpoint called'
  const queryParameters = sanitize(event.queryStringParameters)
  const products = await Product.find(queryParameters, function (err, docs) {
    if (err || docs.length === 0) {
      statusCode = 404
      message = 'no product found'
    } else {
      message = 'products found'
    }
    return docs
  })

  return {
    statusCode: statusCode,
    body: JSON.stringify({
      message: message,
      input: event.queryStringParameters,
      products: products
    })
  }
}
