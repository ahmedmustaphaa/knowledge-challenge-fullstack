import express from 'express';
import { 
  register, 
  verifyOTP, 
  login, 
  forgotPassword, 
  resetPassword, 
  getQuestionsForUser
} from '../controller/authController.js';
import auth from '../middleware/auth.js';

const userRoute = express.Router();

// --- مسارات إنشاء الحساب والتحقق ---
userRoute.post('/register', register);     // إرسال بيانات التسجيل وأول OTP
userRoute.post('/verify-otp', verifyOTP);   // التأكد من الكود وتفعيل الحساب

// --- مسار تسجيل الدخول ---
userRoute.post('/login', login);            // الدخول والحصول على التوكن

// --- مسارات استعادة كلمة المرور ---
userRoute.post('/forgot-password', forgotPassword); // إرسال كود Reset للإيميل
userRoute.post('/reset-password', resetPassword);  
userRoute.get('/questions', auth, getQuestionsForUser);
export default userRoute;