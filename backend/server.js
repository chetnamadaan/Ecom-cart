const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mock-ecom-cart', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  description: String,
  image: String,
});

const Product = mongoose.model('Product', productSchema);

const cartItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  quantity: Number,
});

const CartItem = mongoose.model('CartItem', cartItemSchema);

const mockProducts = [
  {
    name: "Boat Rockerz Headphones",
    price: 1999,
    description: "Wireless headphones with 40mm drivers and 20hrs battery",
    image: "http://localhost:3000/images/headphone.webp"
  },
  {
    name: "OnePlus Nord 5G",
    price: 29999,
    description: "5G smartphone with 64MP camera and 90Hz display",
    image: "https://via.placeholder.com/300x300/059669/ffffff?text=Smartphone"
  },
  {
    name: "HP Pavilion Laptop",
    price: 64999,
    description: "Intel i5, 16GB RAM, 512GB SSD for work and gaming",
    image: "https://via.placeholder.com/300x300/d97706/ffffff?text=Laptop"
  },
  {
    name: "Noise ColorFit Pro",
    price: 3499,
    description: "Smartwatch with 1.3\" display and heart rate monitoring",
    image: "https://via.placeholder.com/300x300/7c3aed/ffffff?text=Smartwatch"
  },
  {
    name: "Samsung Galaxy Tab",
    price: 24999,
    description: "10.4\" tablet with S-Pen for creativity and productivity",
    image: "https://via.placeholder.com/300x300/dc2626/ffffff?text=Tablet"
  },
  {
    name: "Sony PlayStation 5",
    price: 49999,
    description: "Next-gen gaming console with 4K 120fps support",
    image: "https://via.placeholder.com/300x300/475569/ffffff?text=Gaming"
  },
  {
    name: "Canon EOS 200D",
    price: 45999,
    description: "DSLR camera with 24MP sensor for photography enthusiasts",
    image: "https://via.placeholder.com/300x300/1e40af/ffffff?text=Camera"
  },
  {
    name: "JBL Flip 5 Speaker",
    price: 9999,
    description: "Portable Bluetooth speaker with 12hrs battery life",
    image: "https://via.placeholder.com/300x300/ea580c/ffffff?text=Speaker"
  }
];

async function initializeProducts() {
  try {
    const count = await Product.countDocuments();
    if (count === 0) {
      await Product.insertMany(mockProducts);
      console.log('Mock products added to database');
    }
  } catch (error) {
    console.error('Error initializing products:', error);
  }
}

app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

app.post('/api/cart', async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    let cartItem = await CartItem.findOne({ productId });
    
    if (cartItem) {
      cartItem.quantity += quantity;
      await cartItem.save();
    } else {
      cartItem = new CartItem({ productId, quantity });
      await cartItem.save();
    }

    await cartItem.populate('productId');
    res.json(cartItem);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add item to cart' });
  }
});

app.delete('/api/cart/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await CartItem.findByIdAndDelete(id);
    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove item from cart' });
  }
});

app.get('/api/cart', async (req, res) => {
  try {
    const cartItems = await CartItem.find().populate('productId');
    
    let total = 0;
    const items = cartItems.map(item => {
      const itemTotal = item.productId.price * item.quantity;
      total += itemTotal;
      
      return {
        _id: item._id,
        product: item.productId,
        quantity: item.quantity,
        total: itemTotal
      };
    });

    res.json({ items, total: parseFloat(total.toFixed(2)) });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
});

app.post('/api/checkout', async (req, res) => {
  try {
    const { name, email } = req.body;
    
    const cartItems = await CartItem.find().populate('productId');
    
    let total = 0;
    const items = cartItems.map(item => {
      const itemTotal = item.productId.price * item.quantity;
      total += itemTotal;
      
      return {
        name: item.productId.name,
        price: item.productId.price,
        quantity: item.quantity,
        total: itemTotal
      };
    });

    await CartItem.deleteMany({});

    const receipt = {
      orderId: Math.random().toString(36).substr(2, 9).toUpperCase(),
      customer: { name, email },
      items,
      total: parseFloat(total.toFixed(2)),
      timestamp: new Date().toISOString(),
      status: 'completed'
    };

    res.json(receipt);
  } catch (error) {
    res.status(500).json({ error: 'Checkout failed' });
  }
});

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await initializeProducts();
});