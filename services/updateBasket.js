'use strict'
const Product = require('../models/product')
const User = require('../models/user')
const Basket = require('../models/basket')
const qs = require('qs')
const userUtils = require('../models/userUtils')

require('./db') // setup database connexion

module.exports.updateBasket = async (event, context) => {
  var statusCode = 200
  var message = 'updateBasket endpoint called'
  const formData = qs.parse(event.body)
  console.log(event.body)
  console.log('formData')
  console.log(formData)
  const basket = formData.basket
  console.log('basket')
  const basketLines = basket.basketLines.map(basketLine => {
    return {
      quantity: basketLine.quantity,
      productId: basketLine.product._id
    }
  })
  basket.basketLines = basketLines
  const updatedBasket = await Basket.findByIdAndUpdate(basket.id, basket, function (err, document) {
    if (err) {
      message += " couldn't update basket"
      throw (err)
    } else {
      message += ' basket updated'
      console.log('error')
      console.log(err)
      console.log('document')
      console.log(document)
      return document
    }
  })
  console.log('status code')
  console.log(statusCode)

  return {
    statusCode: statusCode,
    body: JSON.stringify({
      message: message,
      formData: formData,
      basket: updatedBasket
    })
  }
}
