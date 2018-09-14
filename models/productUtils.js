const User = require('./user')
const Basket = require('./basket')
const Product = require('./product')

require('../services/db') // setup database connexion
let productUtils = {}
productUtils.checkAvailability = async function (basket) {
  const basketLines = basket.basketLines
  var availabilities = []
  // for each product in the basket
  // check if available stock
  // is superior or equal to the sum of the products
  // stored in the baskets
  // taking account of the basket that's going to be updated
  availabilities = basketLines.map((basketLine) => {
    const availability = Product.findById(basketLine.productId)
      .then((product) => {
        const availableStock = product.stock
        return Basket.find({}).then((baskets) => {
          var quantityInBaskets = 0
          baskets.forEach((document) => {
            if (document.id !== basket.id) {
              const basketLine = document.basketLines.find((basketLine) => {
                return basketLine.productId == product.id
              })
              if (basketLine !== undefined) {
                quantityInBaskets += parseInt(basketLine.quantity)
              }
            } else {
              // take the quantity in the updated basket
              const basketLine = basket.basketLines.find((basketLine) => {
                return basketLine.productId === product.id
              })
              quantityInBaskets += parseInt(basketLine.quantity)
            }
          })
          console.log(`Product ${product.name}, available ? ${availableStock >= quantityInBaskets}, quantity in baskets ${quantityInBaskets}`)
          return availableStock >= quantityInBaskets
        }).catch((error) => {
          console.log(error)
          return error
        })
      })
      .catch((error) => {
        console.log(error)
        return error
      })
    return availability
  })
  return Promise.all(availabilities).then((response) => {
    return !(response.indexOf(false) > -1)
  })
}
module.exports = productUtils
