import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  id:Number,
  name: String,
  price: String,
  image: String,
  description: String,
  rating: {
    stars: Number,
    review: Number
  }
});

export default mongoose.model('Product', productSchema);
