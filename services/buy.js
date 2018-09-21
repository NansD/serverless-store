const queryString = require('querystring')

const User = require('../models/user')
const Product = require('../models/product')
const Basket = require('../models/basket')
const sanitize = require('mongo-sanitize')
require('./db') // setup database connexion
module.exports.buy = async (event, context) => {
  var statusCode = 200
  var errorToSend = ''
  var promises = []
  const body = JSON.parse(event.body)
  const basket = body.basket
  promises = basket.basketLines.map((basketLine) => {
    return Product.findById(basketLine.product._id).then((product) => {
      const newStock = product.stock - basketLine.quantity
      product.set({
        stock: newStock
      })
      if (newStock < 0) {
        throw (new Error('Product stock can\'t be negative ! '))
      } else {
        return product.save().then((product, error) => {
          if (error) {
            throw (new Error(error))
          }
          return 'product saved !'
        })
      }
    }).catch((error) => {
      statusCode = 500
      errorToSend = error
    })
  })
  return Promise.all(promises).then((response) => {
    return {
      statusCode: statusCode,
      body: JSON.stringify({
        basket: basket,
        errorToSend: errorToSend
      })
    }
  })
}
