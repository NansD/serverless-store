const mongoose = require('mongoose')
const mongodbUri =
  'mongodb://admin:foo1bar@ds237072.mlab.com:37072/serverless-store'; // very secure credentials
mongoose.connect(mongodbUri)
const db = mongoose.connection

db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function () { })
