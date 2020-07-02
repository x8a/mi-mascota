const {Schema, model} = require('mongoose');

const petSchema = new Schema ({
  pic: {
    type: String,
    trim: true,
    default: "https://res.cloudinary.com/santic/image/upload/v1592762356/mi-mascota/pet-pics/petDefaultPic_vza4ru.jpg"
  },
  name: {
    type: String,
    trim: true,
    required: [true, 'Required field']
  },
  owner: {type: Schema.Types.ObjectId, ref: 'User'},
  animal: {
    type: String,
    enum: ['Gato', 'Perro'],
    trim: true,
    required: true
  },
  breed: {
    type: String,
    required: true,
    trim: true,
  },
  birthdate: {
    type: String,
    required: true,
  },
  age: {
    type: Number
  },
  appointments: [{type: Schema.Types.ObjectId, ref: 'Appointment'}]
})

module.exports = model('Pet', petSchema);