import mongoose from 'mongoose';

const resultSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  score: { type: Number, required: true },
  totalQuestions: { type: Number, required: true },
  category: { type: String, required: true },
  date: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model('Result', resultSchema);