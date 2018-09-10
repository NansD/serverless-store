const mongoose = require('mongoose')

// recommended options for mlab
const options = {
  server: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } },
  replset: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } }
}

// TODO: hide credentials
const mongodbUri =
  'mongodb://admin:foo1bar@ds237072.mlab.com:37072/serverless-store' // very secure credentials

mongoose.connect(
  mongodbUri,
  options
)
var db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function () {
  console.log('We are connected !')
  var User, Product, Basket
  let arrayOfSchemas = createSchemas()
  User = arrayOfSchemas[0]
  Product = arrayOfSchemas[1]
  Basket = arrayOfSchemas[2]
  console.log('Schemas have been created, models are available')
  createDummyData(User, Product, Basket)
})

let createSchemas = function () {
  const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    updated: { type: Date, default: Date.now },
    basketId: mongoose.Schema.Types.ObjectId
  })
  const User = mongoose.model('Users', userSchema)
  const ProductSchema = mongoose.Schema({
    name: String,
    price: Number,
    description: String,
    discount: String
  })
  const Product = mongoose.model('Products', ProductSchema)
  const basketLineSchema = mongoose.Schema({
    productId: mongoose.Schema.Types.ObjectId,
    quantity: Number
  })
  // we use embedded Data models because it suits our needs (https://docs.mongodb.com/manual/core/data-model-design/)
  const basketSchema = mongoose.Schema({
    customerId: mongoose.Schema.Types.ObjectId,
    basketLines: [basketLineSchema]
  })
  const Basket = mongoose.model('Baskets', basketSchema)

  return [User, Product, Basket]
}

let createDummyData = function (User, Product, Basket) {
  var johnDoe = new User({
    name: 'John Doe',
    email: 'john@doe.com',
    password: 'supersafe'
  }).save(function () {
    User.find(function (err, users) {
      if (err) return console.error(err)
      console.log(users)
    })
  })

  var cake = new Product({
    name: 'Cake',
    price: 2.0
  }).save(function () {
    Product.find(function (err, products) {
      console.log(products)
    })
  })

  var basket = new Basket({
    customerId: User.findOne({ name: 'John Doe' }).id,
    basketLines: [
      {
        productId: Product.findOne({ name: 'Cake' }).id,
        quantity: 2.0
      }
    ]
  }).save(function (err, baskets) {
    if (err) return console.error(err)
    console.log(baskets)
  })
}

let deleteAllCollections = function (User, Product, Basket) {
  let callback = function () {
    console.log(`Removed all the collections of the model`)
  }
  User.deleteMany({}, callback)
  Product.deleteMany({}, callback)
  Basket.deleteMany({}, callback)
}
