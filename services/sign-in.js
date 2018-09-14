const queryString = require('querystring')

const User = require('../models/user')
const Basket = require('../models/basket')
const sanitize = require('mongo-sanitize')
require('./db') // setup database connexion
module.exports.signIn = async (event, context) => {
  let statusCode = 200
  let message = 'signIn endpoint called, user successfully registrated'
  let formData = sanitize(queryString.parse(event.body))
  // TODO: implement email uniqueness, mandatory fields ... email.toLowerCase

  // create Basket
  const user = await Basket.create({}).then((basket) => {
    formData.basketId = basket._id
    formData.email = formData.email.toLocaleLowerCase()
    formData.validateSync()
    return User.create(formData).then((user) => {
      var error = user.validateSync()
      return user
    })
  }).catch((error) => {
    message = error.message
    statusCode = 422
  })

  return {
    statusCode: statusCode,
    body: JSON.stringify({
      message: message,
      user: user
    })
  }
}
