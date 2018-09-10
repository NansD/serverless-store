const mongoose = require('mongoose')
const mongodbUri =
  'mongodb://admin:foo1bar@127.0.0.1:27017/sls-store' // very secure credentials
mongoose.connect(mongodbUri)
const db = mongoose.connection

module.exports = db
