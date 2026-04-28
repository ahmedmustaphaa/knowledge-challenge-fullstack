import express from 'express';
// تغيير الاسم جوه الكود لـ resultRouter
const resultRouter = express.Router(); 

import { getLeaderboard ,  saveResult, 
  getMyResults, 
  deleteResult  } from '../controller/resultController.js';

import auth from '../middleware/auth.js';


// استخدام الاسم الجديد في التعريفات
resultRouter.get('/leaderboard', auth, getLeaderboard);
resultRouter.post('/save', auth, saveResult);
resultRouter.get('/my-history', auth, getMyResults);
resultRouter.delete('/:id', auth, deleteResult);

// تصديره بالاسم الجديد
export default resultRouter;