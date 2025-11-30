import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';
import connectDB from './config/db.js';

dotenv.config();

const plants = [
  {
    name: 'Neem',
    description: 'Neem is known for its antibacterial properties.',
    image: '/images/neem.jpg'   // Make sure this file exists in public/images/
    
  },
  {
    name: 'Tulsi',
    description: 'Holy Basil (Tulsi) boosts immunity.',
    image: '/images/tulsi.jpg'
    
  },
  {
    name: 'Aloe Vera',
    description: 'Used for skin and digestion.',
    image: '/images/aloe.jpg'
    
  }
];

const importData = async () => {
  try {
    await connectDB();          // Connect to MongoDB
    await Product.deleteMany(); // Clear existing products
    await Product.insertMany(plants); // Insert new products
    console.log("Data Imported Successfully!");
    process.exit();
  } catch (error) {
    console.error("Error importing data:", error);
    process.exit(1);
  }
};

importData();
