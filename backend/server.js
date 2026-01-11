require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Contact = require('./models/Contact');
const Product = require('./models/Product');
const Order = require('./models/Order');
const path = require('path');


const app = express();
const PORT = process.env.PORT || 5000;

// ==================== MIDDLEWARE ====================
app.use(cors({
  origin: ['http://localhost:5500', 'http://127.0.0.1:5500', 'http://localhost:3000', 'http://localhost:8080', 'http://localhost:5000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json());

// ==================== SERVE FRONTEND ====================
app.use(express.static(path.join(__dirname, '..')));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// ==================== MONGODB CONNECTION ====================
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/herbal_garden';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000,
})
.then(async () => {
  console.log('✅ Connected to MongoDB Atlas!');
  console.log('📁 Database: herbal_garden');
  
  // Seed products if database is empty
  await seedProducts();
})
.catch((err) => {
  console.log('⚠️  MongoDB Connection Warning:', err.message);
  console.log('💡 If using MongoDB Atlas:');
  console.log('   1. Check your connection string in .env');
  console.log('   2. Add your IP to MongoDB Atlas IP Whitelist');
  console.log('   3. Check your username/password');
});

// ==================== SEED PRODUCTS ====================
async function seedProducts() {
  try {
    const count = await Product.countDocuments();
    
    if (count === 0) {
      console.log('🌱 Seeding products to MongoDB...');
      
      const products = [
        {
          id: 1,
          name: "Tulsi",
          scientificName: "Ocimum sanctum",
          description: "Holy Basil, known for its spiritual significance and medicinal properties.",
          medicinalUses: "Anti-inflammatory, anti-viral, antioxidant properties. Boosts immunity, relieves stress.",
          habitat: "Native to India, commonly found in gardens and tropical regions.",
          cultivation: "Prefers warm climates, well-drained soil, and regular watering.",
          price: 13.43,
          previousPrice: 15.99,
          image: "https://static.tnn.in/thumb/msid-97568598,thumbsize-124936,width-1280,height-720,resizemode-75/97568598.jpg",
          images: [
            "https://static.tnn.in/thumb/msid-97568598,thumbsize-124936,width-1280,height-720,resizemode-75/97568598.jpg",
            "https://thumbs.dreamstime.com/b/green-fresh-basil-leaves-isolated-white-background-151477477.jpg"
          ],
          properties: ["Immune Booster", "Respiratory Health", "Stress Relief", "Antibacterial"],
          category: "medicinal",
          rating: { stars: 4.5, reviewCount: 128 },
          featured: true
        },
        {
          id: 2,
          name: "Ashwagandha",
          scientificName: "Withania somnifera",
          description: "Powerful adaptogen used in Ayurveda for stress relief and energy.",
          medicinalUses: "Adaptogen, reduces stress and anxiety, boosts immunity, improves sleep.",
          habitat: "Native to India, grows well in arid regions and dry soil.",
          cultivation: "Prefers dry, well-drained soil and full sunlight. Drought-resistant.",
          price: 16.43,
          previousPrice: 17.99,
          image: "https://aussiegreenthumb.com/wp-content/uploads/2022/12/What-is-Ashwagandha.jpg",
          images: [
            "https://aussiegreenthumb.com/wp-content/uploads/2022/12/What-is-Ashwagandha.jpg"
          ],
          properties: ["Stress Relief", "Sleep Aid", "Energy Booster", "Cognitive Function"],
          category: "medicinal",
          rating: { stars: 5, reviewCount: 134 },
          featured: true
        },
        {
          id: 3,
          name: "Turmeric",
          scientificName: "Curcuma longa",
          description: "Golden spice with powerful anti-inflammatory properties.",
          medicinalUses: "Anti-inflammatory, antioxidant, supports digestive health, arthritis relief.",
          habitat: "Native to Southeast Asia, requires warm, humid climate.",
          cultivation: "Grows in rich, well-drained soil with ample rainfall.",
          price: 12.43,
          previousPrice: 18.99,
          image: "https://th.bing.com/th/id/OIP.sizCpPqnIOesAxX6Dl7LHgHaEG?w=309&h=180&c=7&r=0&o=5&pid=1.7",
          properties: ["Anti-inflammatory", "Arthritis Relief", "Antioxidant", "Brain Health"],
          category: "medicinal",
          rating: { stars: 4, reviewCount: 97 }
        },
        {
          id: 4,
          name: "Aloe Vera",
          scientificName: "Aloe barbadensis miller",
          description: "Succulent plant known for its skin healing properties.",
          medicinalUses: "Skin healing, soothing burns, aids digestion, wound healing.",
          habitat: "Native to Arabian Peninsula, grows in hot, dry climates.",
          cultivation: "Thrives in sandy, well-drained soil with sunlight.",
          price: 18.43,
          previousPrice: 20.00,
          image: "https://th.bing.com/th/id/OIP.lwWEMHGUg26UBnLz44nRFwHaE8?w=278&h=186&c=7&r=0&o=5&pid=1.7",
          properties: ["Burn Relief", "Skin Hydration", "Wound Healing", "Nutrient Rich"],
          category: "medicinal",
          rating: { stars: 4.5, reviewCount: 153 }
        },
        {
          id: 5,
          name: "Neem",
          scientificName: "Azadirachta indica",
          description: "Traditional medicinal tree with antibacterial properties.",
          medicinalUses: "Antibacterial, antifungal, supports skin health, dental health.",
          habitat: "Native to India, thrives in tropical, dry regions.",
          cultivation: "Grows in poor, well-drained soil with full sun.",
          price: 9.43,
          previousPrice: 10.90,
          image: "https://th.bing.com/th/id/OIP.obxGbOVgD-NWDDXADi9apwHaE4?w=264&h=180&c=7&r=0&o=5&pid=1.7",
          properties: ["Dental Health", "Natural Pesticide", "Skin Health", "Antiviral"],
          category: "medicinal",
          rating: { stars: 3.5, reviewCount: 65 }
        },
        {
          id: 6,
          name: "Clove",
          scientificName: "Syzygium aromaticum",
          description: "Aromatic flower buds with medicinal and culinary uses.",
          medicinalUses: "Pain relief, antibacterial, antioxidant properties, dental health.",
          habitat: "Native to Indonesia, thrives in tropical climates.",
          cultivation: "Prefers warm, humid conditions with rich, well-drained soil.",
          price: 13.43,
          previousPrice: 15.43,
          image: "https://plantura.garden/uk/wp-content/uploads/sites/2/2022/08/flowering-clove-tree.jpeg",
          properties: ["Cognitive Function", "Sleep Aid", "Energy Booster", "Stress Relief"],
          category: "medicinal",
          rating: { stars: 4.5, reviewCount: 117 }
        }
      ];

      await Product.insertMany(products);
      console.log(`✅ ${products.length} products seeded to MongoDB Atlas!`);
    } else {
      console.log(`📊 Found ${count} existing products in database`);
    }
  } catch (error) {
    console.error('❌ Error seeding products:', error.message);
  }
}

// ==================== ROUTES ====================

// Home Route
// ==================== HOME ROUTE ====================
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// Health Check
app.get('/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    database: dbStatus,
    mongodbState: mongoose.connection.readyState,
    collections: ['contacts', 'products', 'orders']
  });
});

// Test endpoint for frontend
app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    message: 'Backend is running!',
    timestamp: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    readyState: mongoose.connection.readyState
  });
});

// ==================== PRODUCT ROUTES ====================

// GET ALL PRODUCTS
app.get('/api/products', async (req, res) => {
  try {
    const { search, category, minPrice, maxPrice, featured } = req.query;
    
    let filter = {};
    
    // Search by name
    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }
    
    // Filter by category
    if (category) {
      filter.category = category;
    }
    
    // Filter by price range
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    
    // Filter featured products
    if (featured === 'true') {
      filter.featured = true;
    }
    
    const products = await Product.find(filter).sort({ createdAt: -1 });
    
    console.log(`📦 Sent ${products.length} products to client`);
    
    res.json({
      success: true,
      count: products.length,
      data: products
    });
    
  } catch (error) {
    console.error('❌ Error fetching products:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching products',
      error: error.message
    });
  }
});

// GET SINGLE PRODUCT
app.get('/api/products/:id', async (req, res) => {
  try {
    let product;
    
    // Try to find by MongoDB _id first
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      product = await Product.findById(req.params.id);
    }
    
    // If not found, try by numeric id
    if (!product) {
      product = await Product.findOne({ id: parseInt(req.params.id) });
    }
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    res.json({
      success: true,
      data: product
    });
    
  } catch (error) {
    console.error('❌ Error fetching product:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching product',
      error: error.message
    });
  }
});

// SEARCH PRODUCTS
app.get('/api/products/search/:query', async (req, res) => {
  try {
    const query = req.params.query;
    
    const products = await Product.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { scientificName: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ]
    });
    
    res.json({
      success: true,
      count: products.length,
      data: products
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error searching products',
      error: error.message
    });
  }
});

// ==================== CONTACT ROUTES ====================

// SUBMIT CONTACT FORM
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    const contact = new Contact({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject.trim(),
      message: message.trim()
    });

    await contact.save();

    console.log('='.repeat(50));
    console.log('📧 NEW FORM SUBMISSION SAVED!');
    console.log(`   👤 Name: ${name}`);
    console.log(`   📧 Email: ${email}`);
    console.log(`   📝 Subject: ${subject}`);
    console.log(`   🆔 ID: ${contact._id}`);
    console.log('='.repeat(50));

    res.status(201).json({
      success: true,
      message: 'Thank you! Your message has been sent.',
      data: {
        id: contact._id,
        submittedAt: contact.createdAt
      }
    });

  } catch (error) {
    console.error('❌ Error saving contact:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again.',
      error: error.message
    });
  }
});

// VIEW ALL CONTACTS
app.get('/api/contacts', async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: contacts.length,
      data: contacts
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching contacts',
      error: error.message
    });
  }
});

// ==================== ORDER ROUTES ====================

// CREATE ORDER
app.post('/api/orders', async (req, res) => {
  try {
    console.log('📥 Received order request:', JSON.stringify(req.body, null, 2));
    
    const { customer, items, totalAmount, paymentMethod, notes } = req.body;

    // Validate
    if (!customer || !customer.name || !customer.email || !items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Customer info and items are required'
      });
    }

    // Generate order ID
    const orderId = 'ORD' + Date.now() + Math.floor(Math.random() * 1000);

    const order = new Order({
      orderId,
      customer,
      items,
      totalAmount,
      paymentMethod: paymentMethod || 'cod',
      notes,
      status: 'pending',
      paymentStatus: paymentMethod === 'online' ? 'paid' : 'pending'
    });

    await order.save();

    console.log('='.repeat(50));
    console.log('🛒 NEW ORDER SAVED TO MONGODB!');
    console.log(`   📦 Order ID: ${orderId}`);
    console.log(`   👤 Customer: ${customer.name}`);
    console.log(`   📧 Email: ${customer.email}`);
    console.log(`   💰 Total: $${totalAmount}`);
    console.log(`   📝 Items: ${items.length} products`);
    console.log(`   🆔 MongoDB ID: ${order._id}`);
    console.log('='.repeat(50));

    res.status(201).json({
      success: true,
      message: 'Order placed successfully!',
      data: {
        orderId,
        orderDate: order.createdAt,
        totalAmount,
        mongoId: order._id
      }
    });

  } catch (error) {
    console.error('❌ Error creating order:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating order',
      error: error.message
    });
  }
});

// VIEW ALL ORDERS
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: orders.length,
      data: orders
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching orders',
      error: error.message
    });
  }
});

// ==================== START SERVER ====================
app.listen(PORT, () => {
  console.log('='.repeat(60));
  console.log('🚀 HERBAL GARDEN FULL BACKEND STARTED!');
  console.log(`📍 Port: ${PORT}`);
  console.log(`🌐 URL: http://localhost:${PORT}`);
  console.log(`🔗 Test: http://localhost:${PORT}/api/test`);
  console.log('='.repeat(60));
  console.log('📋 AVAILABLE ENDPOINTS:');
  console.log(`   📦 Products: http://localhost:${PORT}/api/products`);
  console.log(`   📧 Contact: http://localhost:${PORT}/api/contact`);
  console.log(`   🛒 Orders: http://localhost:${PORT}/api/orders`);
  console.log(`   👁️  View contacts: http://localhost:${PORT}/api/contacts`);
  console.log(`   👁️  View orders: http://localhost:${PORT}/api/orders`);
  console.log('='.repeat(60));
  console.log('💾 DATA WILL BE SAVED TO:');
  console.log('   • contacts - Form submissions');
  console.log('   • products - All medicinal plants');
  console.log('   • orders - Customer orders');
  console.log('='.repeat(60));
  console.log('⚠️  Make sure MongoDB Atlas is configured:');
  console.log('   1. Create free cluster at https://cloud.mongodb.com/');
  console.log('   2. Get connection string from "Connect" button');
  console.log('   3. Add to .env file: MONGODB_URI=your_connection_string');
  console.log('   4. Add your IP to Network Access in MongoDB Atlas');
  console.log('='.repeat(60));
});
