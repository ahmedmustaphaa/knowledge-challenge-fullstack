import User from '../models/UserModel.js';
import { Question } from '../models/Question.js';
import Result from '../models/Result.js';

// 1. دالة الإحصائيات (الأرقام اللي في الـ 4 كروت فوق)
export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalQuestions = await Question.countDocuments();
    
    // أعلى سكور تم تسجيله في المنصة كلها
    const topScoreRecord = await Result.findOne().sort({ score: -1 });
    const topScore = topScoreRecord ? topScoreRecord.score : 0;

    // نشاط اليوم (عدد الكويزات اللي خلصت النهاردة)
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const todayActivity = await Result.countDocuments({ 
      createdAt: { $gte: startOfToday } 
    });

    res.json({ totalUsers, totalQuestions, topScore, todayActivity });
  } catch (error) {
    res.status(500).json({ message: "خطأ في جلب الإحصائيات" });
  }
};


export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "خطأ في جلب المستخدمين" });
  }
};

// 3. دالة مسح مستخدم (زرار الحذف في الجدول)
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      await user.deleteOne();
      res.json({ message: "تم حذف المستخدم بنجاح" });
    } else {
      res.status(404).json({ message: "المستخدم غير موجود" });
    }
  } catch (error) {
    res.status(500).json({ message: "خطأ في الحذف" });
  }
};

// 4. دالة جلب كل الأسئلة (عشان جدول بنك الأسئلة)
export const getAllQuestions = async (req, res) => {
  try {
    const questions = await Question.find({}).sort({ createdAt: -1 });
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: "خطأ في جلب الأسئلة" });
  }
};

// 5. دالة مسح سؤال (زرار الحذف في جدول الأسئلة)
export const deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (question) {
      await question.deleteOne();
      res.json({ message: "تم حذف السؤال بنجاح" });
    } else {
      res.status(404).json({ message: "السؤال غير موجود" });
    }
  } catch (error) {
    res.status(500).json({ message: "خطأ في حذف السؤال" });
  }
};