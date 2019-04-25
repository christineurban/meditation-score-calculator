/* eslint-disable no-invalid-this */

const mongoose = require('mongoose'),
      crypto = require('crypto'),
      validator = require('validator');

const Schema = mongoose.Schema;


/**
 * A Validation function for local strategy email
 */
const validateEmail = function(email) {
  return validator.isEmail(email, {
    require_tld: false // eslint-disable-line camelcase
  });
};

/**
 * User Schema
 */
const UserSchema = new Schema({
  firstName: {
    type: String,
    trim: true,
    required: 'Please fill in your first name'
  },
  lastName: {
    type: String,
    trim: true,
    required: 'Please fill in your last name'
  },
  email: {
    type: String,
    index: {
      unique: true,
      sparse: true
    },
    lowercase: true,
    trim: true,
    validate: [validateEmail, 'Please fill in a valid email address']
  },
  password: {
    type: String,
    default: ''
  },
  salt: {
    type: String
  },

  /* For reset password */
  resetPasswordToken: {
    type: String
  },
  resetPasswordExpires: {
    type: Date
  }
}, {
  timestamps: true
});

/**
 * Hook a pre save method to hash the password
 */
UserSchema.pre('save', function(next) {
  if (this.password && this.isModified('password')) {
    this.salt = crypto.randomBytes(16).toString('base64');
    this.password = this.hashPassword(this.password);
  }

  next();
});

/**
 * Hook a pre validate method to test the local password
 */
UserSchema.pre('validate', function(next) {
  if (this.password && this.isModified('password')) {
    let error;

    if (this.password.length < 8) {
      error = 'The password must be at least 8 characters long.';
    }

    if (error) {
      return next(error);
    }
  }

  next();
});

/**
 * Create instance method for hashing a password
 */
UserSchema.methods.hashPassword = function(password) {
  if (this.salt && password) {
    // eslint-disable-next-line no-sync
    return crypto.pbkdf2Sync(password, Buffer.from(this.salt, 'base64'), 10000, 512, 'SHA512').toString('base64');
  } else {
    return password;
  }
};

/**
 * Create instance method for authenticating user
 */
UserSchema.methods.authenticate = function(password) {
  return this.password === this.hashPassword(password);
};


mongoose.model('User', UserSchema);
