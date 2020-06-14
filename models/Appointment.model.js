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
  date: {
    type: Date,
    required: true
  },
  time: {
    type: Date,
    required: true
  },
  comments: {
    type: String,
    trim: true
  }
})

module.exports = mongoose.model('Appointment', appointmentSchema)