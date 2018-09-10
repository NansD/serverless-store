var mongoose = require('mongoose')
var sanitizerPlugin = require('mongoose-sanitizer')

// delete already existing model because of this issue : https://github.com/kriasoft/react-starter-kit/issues/1418
// see this answer : https://github.com/kriasoft/react-starter-kit/issues/1418#issuecomment-334913935
// this line doesn't crash if no model exists
delete mongoose.connection.models['Baskets']

const basketLineSchema = mongoose.Schema({
  productId: mongoose.Schema.Types.ObjectId,
  quantity: Number
})
// we use embedded Data models because it suits our needs (https://docs.mongodb.com/manual/core/data-model-design/)
const basketSchema = mongoose.Schema({
  basketLines: [basketLineSchema]
})
basketSchema.plugin(sanitizerPlugin)
const Basket = mongoose.model('Baskets', basketSchema)
module.exports = Basket
