const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const clearAllCarts = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected');

    const db = mongoose.connection.db;
    await db.collection('carts').deleteMany({});
    
    console.log('🎉 Completely cleared all carts from the database to reset corrupted state.');
  } catch (err) {
    console.error('❌ Failed:', err);
  } finally {
    await mongoose.disconnect();
  }
};

clearAllCarts();
