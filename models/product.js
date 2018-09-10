var mongoose = require('mongoose')

// delete already existing model because of this issue : https://github.com/kriasoft/react-starter-kit/issues/1418
// see this answer : https://github.com/kriasoft/react-starter-kit/issues/1418#issuecomment-334913935
// this line doesn't crash if no model exists
delete mongoose.connection.models['Products']
const ProductSchema = mongoose.Schema({
  name: String,
  price: Number,
  description: String,
  discount: String,
  type: String,
  imgUrl: String,
  stock: { type: Number, default: 0 }
})
// TODO: Define a type table ?
const Product = mongoose.model('Products', ProductSchema)
module.exports = Product
