const {
  Schema,
  model
} = require('mongoose');

const userSchema = new Schema({
  firstname: {
    type: String,
    trim: true,
    required: [true, 'Required']
  },
  pets: [{type: Schema.Types.ObjectId, ref: 'Pet'}],
  lastname: {
    type: String,
    trim: true,
    required: [true, 'Required']
  },
  username: {
    type: String,
    trim: true,
    required: [true, 'Username is required.'],
    unique: true
  },
  email: {
    type: String,
    required: [true, 'Email is required.'],
    match: [/^\S+@\S+\.\S+$/, 'Invalid email address.'],
    unique: true,
    lowercase: true,
    trim: true
  },
  // add password property here
  passwordHash: {
    type: String,
    required: [true, 'Password is required.']
  }, 
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

module.exports = model('User', userSchema);