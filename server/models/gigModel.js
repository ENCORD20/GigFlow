import mongoose from 'mongoose';

const gigSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  budget: {
    type: Number,
    required: true,
    min: 1,
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['open', 'assigned'],
    default: 'open',
  },
}, { timestamps: true });

// Create index for search
gigSchema.index({ title: 'text' });

const Gig = mongoose.model('Gig', gigSchema);
export default Gig;
