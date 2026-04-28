import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice'; 
import adminReducer from './adminSlice'; 
import quizReducer from './quizSlice'; // استيراد الـ default export

export const store = configureStore({
  reducer: {
    auth: authReducer, 
    admin: adminReducer,
    quiz: quizReducer, // نربط الـ reducer هنا
  },
});