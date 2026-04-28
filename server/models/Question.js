import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  questionText: { type: String, required: true }, // نص السؤال
  options: [
    { type: String, required: true } // الـ 4 اختيارات
  ],
  correctAnswer: { type: String, required: true }, // الإجابة الصحيحة
  category: { type: String, default: 'General' }, // قسم السؤال (تاريخ، طب، إلخ)
  difficulty: { type: String, enum: ['سهل', 'صعب', 'متوسط'], default: 'medium' }
}, { timestamps: true });
 export const Question= mongoose.model('Question', questionSchema);