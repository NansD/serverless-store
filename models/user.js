var mongoose = require('mongoose')
var uniqueValidator = require('mongoose-unique-validator')
// delete already existing model because of this issue : https://github.com/kriasoft/react-starter-kit/issues/1418
// see this answer : https://github.com/kriasoft/react-starter-kit/issues/1418#issuecomment-334913935
// this line doesn't crash if no model exists
delete mongoose.connection.models['Users']
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true },
  email: {
    type: String,
    unique: true,
    required: true },
  password: {
    type: String,
    required: true },
  updated: { type: Date, default: Date.now },
  basketId: mongoose.Schema.Types.ObjectId
})
userSchema.plugin(uniqueValidator)
const User = mongoose.model('Users', userSchema)

module.exports = User
