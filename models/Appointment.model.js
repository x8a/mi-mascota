const {Schema,model} = require('mongoose');

const appointmentSchema = new Schema ({
  title: {
    type: String,
    trim: true,
    required: true
  },
  vet: {
    type: String,
    trim: true,
    required: true
  },
  pet: {type: Schema.Types.ObjectId, ref: 'Pet'},
  owner: {type: Schema.Types.ObjectId, ref: 'User'},
  date: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  comments: {
    type: String,
    trim: true
  }
})

module.exports = model('Appointment', appointmentSchema);