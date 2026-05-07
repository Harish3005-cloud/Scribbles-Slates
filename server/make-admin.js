const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

dotenv.config();

const makeAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected');

    const email = 'eharish3005@gmail.com';
    const password = 'hari@121';

    let user = await User.findOne({ email });

    if (user) {
      // User exists, just update role and password if needed
      user.role = 'admin';
      // Mongoose pre-save hook will hash it if modified. 
      // We'll manually set it so it triggers the hook.
      user.password = password;
      await user.save();
      console.log(`✅ User ${email} has been updated to admin.`);
    } else {
      // Create new admin user
      user = new User({
        name: 'Harish Admin',
        email,
        password, // Pre-save hook hashes it
        role: 'admin'
      });
      await user.save();
      console.log(`✅ Admin user ${email} created.`);
    }

  } catch (err) {
    console.error('❌ Failed:', err);
  } finally {
    await mongoose.disconnect();
    console.log('MongoDB disconnected');
  }
};

makeAdmin();
