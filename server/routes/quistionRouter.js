import express from 'express';
const quistionrouter = express.Router();
import {addQuestion,  deleteQuestion,  getQuizQuestions,   submitQuiz } from '../controller/QuestionController.js'

import auth from '../middleware/auth.js';

// 1. أي حد مسجل دخول يقدر يجيب أسئلة ويحل
quistionrouter.get('/all', auth, getQuizQuestions);
quistionrouter.post('/submit', auth, submitQuiz);

quistionrouter.post('/questions', auth, addQuestion);
quistionrouter.delete('/:id', auth, deleteQuestion);
export default quistionrouter;