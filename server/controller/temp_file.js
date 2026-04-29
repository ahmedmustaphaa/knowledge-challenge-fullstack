import { Question } from '../models/Question.js';
import User from '../models/UserModel.js';
import sendEmail from '../utiliz/nodemailr.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

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

export const getQuestionsForUser = async (req, res) => {
  try {
    // جلب الأسئلة واختيار الحقول اللي تظهر لليوزر بس (بدون correctAnswer)
    const questions = await Question.find()
    
    // اختيار 10 أسئلة عشوائية مثلاً
    const shuffled = questions.sort(() => 0.5 - Math.random()).slice(0, 10);

    res.status(200).json(shuffled);
  } catch (error) {
    res.status(500).json({ message: "فشل في جلب الأسئلة" });
  }
};