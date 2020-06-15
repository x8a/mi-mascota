const {Schema, model} = require('mongoose');

const petSchema = new Schema ({
  name: {
    type: String,
    trim: true,
    required: [true, 'Required field']
  },
  owner: {type: Schema.Types.ObjectId, ref: 'User'},
  animal: {
    type: String,
    enum: ['cat', 'dog'],
    trim: true,
    required: true
  },
  breed: {
    type: String,
    required: true,
    trim: true,
  },
  birthdate: {
    type: Date,
    required: true,
  },
  age: {
    type: Number
  },
  appointments: [{type: Schema.Types.ObjectId, ref: 'Appointment'}]
})

module.exports = model('Pet', petSchema);