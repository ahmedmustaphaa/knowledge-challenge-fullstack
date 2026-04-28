import express from 'express';
const adminRouter = express.Router();
import { 
  getDashboardStats, 
  getAllUsers, 
  deleteUser, 
  getAllQuestions, 
  deleteQuestion 
} from '../controller/adminController.js';
import auth from '../middleware/auth.js';

// كل مسارات الداشبورد في مكان واحد
adminRouter.get('/stats', auth, getDashboardStats);     // الأرقام
adminRouter.get('/users', auth, getAllUsers);      // جدول اليوزرز
adminRouter.delete('/users/:id', auth, deleteUser); // حذف يوزر
adminRouter.get('/questions', auth, getAllQuestions);  // جدول الأسئلة
adminRouter.delete('/questions/:id', auth, deleteQuestion); // حذف سؤال

export default adminRouter;