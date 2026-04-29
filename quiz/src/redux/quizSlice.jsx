import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'https://knowledge-challenge-fullstack.vercel.app/api/user';

// 1. جلب الأسئلة المخصصة للمستخدم
export const getQuizQuestions = createAsyncThunk('quiz/getQuestions', async (_, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user?.token;
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.get(`${API_URL}/questions`, config);
        return response.data;
    } catch (error) {
        const message = error.response?.data?.message || error.message;
        return thunkAPI.rejectWithValue(message);
    }
});

const initialState = {
    questions: [],         // مصفوفة الأسئلة
    currentStep: 0,        // رقم السؤال الحالي
    userAnswers: [],       // الإجابات اللي اليوزر اختارها
    score: 0,              // السكور النهائي
    isFinished: false,     // هل خلص الكويز؟
    isLoading: false,
    isError: false,
    message: '',
};

export const quizSlice = createSlice({
    name: 'quiz',
    initialState,
    reducers: {
        // تصفير الكويز (لو عايز يعيد)
        resetQuiz: (state) => {
            state.currentStep = 0;
            state.userAnswers = [];
            state.score = 0;
            state.isFinished = false;
            state.isError = false;
        },
        // الانتقال للسؤال التالي مع حفظ الإجابة
        nextQuestion: (state, action) => {
            const { selectedAnswer, isCorrect } = action.payload;
            
            // حفظ الإجابة
            state.userAnswers.push(selectedAnswer);
            
            // زيادة السكور لو الإجابة صح
            if (isCorrect) {
                state.score += 1;
            }

            // التحقق هل ده كان آخر سؤال؟
            if (state.currentStep < state.questions.length - 1) {
                state.currentStep += 1;
            } else {
                state.isFinished = true;
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getQuizQuestions.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getQuizQuestions.fulfilled, (state, action) => {
                state.isLoading = false;
                state.questions = action.payload;
            })
            .addCase(getQuizQuestions.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            });
    },
});
// في نهاية ملف quizSlice.js
export const { resetQuiz, nextQuestion } = quizSlice.actions;
export default quizSlice.reducer; // السطر ده هو الأهم