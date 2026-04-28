import express from 'express';
import { 
  register, 
  verifyOTP, 
  login, 
  forgotPassword, 
  resetPassword, 
  getQuestionsForUser
} from '../controller/authcontroller.js';
import auth from '../middleware/auth.js';

const userRoute = express.Router();

// --- مسارات إنشاء الحساب والتحقق ---
userRoute.post('/register', register);   
userRoute.post('/verify-otp', verifyOTP);   

// --- مسار تسجيل الدخول ---
userRoute.post('/login', login);          

// --- مسارات استعادة كلمة المرور ---
userRoute.post('/forgot-password', forgotPassword); 
userRoute.post('/reset-password', resetPassword);  
userRoute.get('/questions', auth, getQuestionsForUser);
export default userRoute;