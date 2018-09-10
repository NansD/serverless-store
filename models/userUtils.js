const User = require('./user')
const Basket = require('./basket')
const Product = require('./product')

require('../services/db') // setup database connexion

let userUtils = {}
userUtils.getUserAndBasket = async function (userId) {
  const user = await User.findById(userId, function (err, document) {
    if (err || document === null) {
    }
    return document
  })
  const basket = (user === null)
    ? '' : await Basket.findById(user.basketId, function (err, document) {
      if (err) {
      }
      return document
    })
  var promises = basket.basketLines.map(async function (basketLine) {
    console.log(basketLine)
    const productId = basketLine.productId
    const productInformation = await Product.findById(productId).exec()

    return new Promise((resolve, reject) => {
      var bLineToReturn = {
        quantity: basketLine.quantity,
        product: productInformation
      }
      // console.log(bLineToReturn)
      resolve(bLineToReturn)
    })
  })

  console.log(promises[0])
  return Promise.all(promises)
    .then((data) => {
      const filledBasket = {
        id: basket.id,
        basketLines: data
      }
      return {
        user: user,
        basket: filledBasket
      }
    })
    .catch((err) => {
      return err
    })
}
module.exports = userUtils
