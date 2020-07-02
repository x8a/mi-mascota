require("dotenv").config()

const mongoose = require('mongoose');

mongoose
.connect(process.env.MONGODB_URI,
  {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })
.then(db => {
  console.log(`Connected to Mongo! Database name: "${db.connections[0].name}"`)
  })
.catch(err => {
  console.error('Error connecting to mongo', err)
  });