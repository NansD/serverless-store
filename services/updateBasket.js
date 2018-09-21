'use strict'
const Product = require('../models/product')
const User = require('../models/user')
const Basket = require('../models/basket')
const qs = require('qs')
const userUtils = require('../models/userUtils')
const productUtils = require('../models/productUtils')
const sanitize = require('mongo-sanitize')

require('./db') // setup database connexion

module.exports.updateBasket = (event, context) => {
  var statusCode = 200
  var message = 'updateBasket endpoint called'
  const formData = sanitize(qs.parse(event.body))
  const basket = formData.basket
  if (basket.basketLines === undefined) {
    basket.basketLines = []
  }
  const basketLines = basket.basketLines.map(basketLine => {
    return {
      quantity: basketLine.quantity,
      productId: basketLine.product._id
    }
  })
  basket.basketLines = basketLines
  return productUtils.checkAvailability(basket).then((availability) => {
    console.log('Is the product available ?', availability)
    if (!availability) { throw (new Error('The product is not available')) }
    return Basket.findByIdAndUpdate(basket.id, basket).then((document) => {
      message += ' basket updated'
      console.log('bakset updated ', document)
      return {
        statusCode: statusCode,
        body: JSON.stringify({
          message: message,
          formData: formData,
          basket: document
        })
      }
    }).catch((error) => {
      message += " couldn't update basket"
      throw (error)
    })
  }).catch(() => {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'the product is not available'
      })
    }
  })
}
