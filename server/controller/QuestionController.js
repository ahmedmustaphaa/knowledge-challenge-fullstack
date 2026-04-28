import { Question } from "../models/Question.js";
import User from '../models/UserModel.js';
import sendEmail from '../utiliz/nodemailr.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
export const addQuestion = async (req, res) => {
  try {
    const { questionText, options, correctAnswer, category, difficulty } = req.body;

    if (!questionText || !options || !correctAnswer) {
      return res.status(400).json({ message: "من فضلك املأ جميع الحقول المطلوبة" });
    }
    const newQuestion = new Question({
      questionText,
      options,
      correctAnswer,
      category,
      difficulty
    });

    await newQuestion.save();
    res.status(201).json({ message: "تم إضافة السؤال بنجاح", data: newQuestion });
  } catch (error) {
    res.status(500).json({ message: "حدث خطأ أثناء إضافة السؤال", error: error.message });
  }
};


export const getQuizQuestions = async (req, res) => {
  try {
    // هنجيب 10 أسئلة بشكل عشوائي تماماً
    const questions = await Question.aggregate([
      { $sample: { size: 10 } } 
    ]);

    if (questions.length === 0) {
      return res.status(404).json({ message: "مفيش أسئلة في الداتا بيز حالياً" });
    }

    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ message: "فشل في جلب الأسئلة", error: error.message });
  }
};

export const submitQuiz = async (req, res) => {
  try {
    const { userAnswers } = req.body; 
    let score = 0;
    const results = [];

    for (let ans of userAnswers) {
      const question = await Question.findById(ans.questionId);
      if (question) {
        const isCorrect = question.correctAnswer === ans.chosenOption;
        if (isCorrect) score++;
        
        results.push({
          question: question.questionText,
          correctAnswer: question.correctAnswer,
          userAnswer: ans.chosenOption,
          isCorrect
        });
      }
    }

    res.status(200).json({
      totalQuestions: userAnswers.length,
      correctAnswers: score,
      percentage: (score / userAnswers.length) * 100,
      details: results
    });
  } catch (error) {
    res.status(500).json({ message: "خطأ في حساب النتيجة", error: error.message });
  }
};



// --- 1. التسجيل (Register) ---
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "هذا الإيميل مسجل بالفعل" });

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashedPassword,
      otp: otpCode,
      isVerified: false
    });

    await sendEmail(email, otpCode);
    res.status(201).json({ message: "تم إرسال كود التحقق إلى إيميلك" });
  } catch (error) {
    res.status(500).json({ message: "خطأ في التسجيل", error: error.message });
  }
};

// --- 2. تفعيل الحساب (Verify OTP) ---
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "المستخدم غير موجود" });
    if (user.otp !== otp) return res.status(400).json({ message: "كود التحقق غير صحيح" });

    user.isVerified = true;
    user.otp = undefined; 
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(200).json({ 
      message: "تم تفعيل الحساب بنجاح", 
      token, 
      user: { name: user.name, email: user.email } 
    });
  } catch (error) {
    res.status(500).json({ message: "خطأ في عملية التأكيد" });
  }
};

// --- 3. تسجيل الدخول (Login) ---
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "المستخدم غير موجود" });
    if (!user.isVerified) return res.status(403).json({ message: "يرجى تفعيل حسابك أولاً" });

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) return res.status(400).json({ message: "كلمة المرور غير صحيحة" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(200).json({ 
      message: "تم تسجيل الدخول بنجاح", 
      token, 
      user: { name: user.name, email: user.email, isAdmin: user.isAdmin } 
    });
  } catch (error) {
    res.status(500).json({ message: "حدث خطأ في السيرفر" });
  }
};

// --- 4. نسيان كلمة المرور (Forgot Password) ---
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "المستخدم غير موجود" });

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otpCode;
    await user.save();

    await sendEmail(email, otpCode);
    res.status(200).json({ message: "تم إرسال كود استعادة الباسورد إلى إيميلك" });
  } catch (error) {
    res.status(500).json({ message: "خطأ في السيرفر" });
  }
};

// --- 5. تغيير كلمة المرور (Reset Password) ---
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || user.otp !== otp) {
      return res.status(400).json({ message: "كود التحقق غير صحيح أو منتهي" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.otp = undefined; // مسح الكود بعد التغيير
    await user.save();

    res.status(200).json({ message: "تم تغيير كلمة المرور بنجاح" });
  } catch (error) {
    res.status(500).json({ message: "فشل في تحديث كلمة المرور" });
  }
};

// دالة حذف السؤال
export const deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params; // بيجيب الـ id من الـ URL

    const question = await Question.findByIdAndDelete(id);

    if (!question) {
      return res.status(404).json({ message: "السؤال ده مش موجود أصلاً يا صاحبي" });
    }

    res.status(200).json({ message: "تم حذف السؤال بنجاح" });
  } catch (error) {
    res.status(500).json({ message: "حصلت مشكلة في السيرفر وأنا بمسح", error: error.message });
  }
};