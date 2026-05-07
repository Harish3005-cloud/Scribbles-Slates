const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Cart = require('./models/Cart');

dotenv.config();

const fixCarts = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected for fixing carts');

    const carts = await Cart.find();
    let fixed = 0;
    
    for (const cart of carts) {
      const originalLength = cart.items.length;
      // Keep only items that have a valid price and name
      cart.items = cart.items.filter(i => i.priceAtAdd != null && !Number.isNaN(i.priceAtAdd) && i.name);
      
      if (cart.items.length !== originalLength) {
        await cart.save();
        fixed++;
        console.log(`✅ Fixed cart for user ${cart.userId}`);
      }
    }
    
    console.log(`🎉 Done fixing carts. Fixed ${fixed} carts.`);
  } catch (err) {
    console.error('❌ Failed:', err);
  } finally {
    await mongoose.disconnect();
  }
};

fixCarts();
