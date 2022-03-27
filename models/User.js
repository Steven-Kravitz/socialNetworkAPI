const { Schema, model } = require('mongoose');


// Email validation regex
var validateEmail = function(email) {
  var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email)
}

// Schema to create a course model

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      unique: true
    },
    email: {
      type: String,
      default: true,
      trim: true,
      unique: true,
      validate: [validateEmail, 'Please enter a valid email address.']
    },
    thoughts: [{
      type: Schema.Types.ObjectId,
      ref: 'Thought'
    }],
    friends: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }]
  },
  {
    toJSON: {
      virtuals: true,
    },
  }
);

const User = model('User', userSchema);

module.exports = User;
