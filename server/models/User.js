const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // Prevents duplicate registrations
  },
  password: {
    type: String,
    required: true,
  }
}, {
  timestamps: true
});

// Pre-save middleware to automatically hash the user's password before storing
userSchema.pre('save', async function() {
  // Only hash if the password was actually modified or is entirely new
  if (!this.isModified('password')) {
    return;
  }

  try {
    const salt = await bcrypt.genSalt(10);
    // Overwrite the raw plaintext password with the hashed variation
    this.password = await bcrypt.hash(this.password, salt);
  } catch (err) {
    throw err;
  }
});

// Helper method added directly to the User object to verify login passwords
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
