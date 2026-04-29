import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'https://knowledge-challenge-fullstack.vercel.app/api/admin';
const API_URL_quistion = 'https://knowledge-challenge-fullstack.vercel.app/api/quistion';

// دالة مساعدة لجلب التوكن (عشان متكررش الكود)
const getAuthConfig = (thunkAPI) => {
  const token = thunkAPI.getState().auth.user?.token;
  return { headers: { Authorization: `Bearer ${token}` } };
};

// 1. جلب كل المستخدمين
export const getAllUsers = createAsyncThunk('admin/getUsers', async (_, thunkAPI) => {
  try {
    return (await axios.get(`${API_URL}/users`, getAuthConfig(thunkAPI))).data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

// 2. جلب كل الأسئلة
export const getAllQuestions = createAsyncThunk('admin/getQuestions', async (_, thunkAPI) => {
  try {
    return (await axios.get(`${API_URL_quistion}/all`, getAuthConfig(thunkAPI))).data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

// 3. إضافة سؤال جديد
export const createQuestion = createAsyncThunk('admin/createQuestion', async (questionData, thunkAPI) => {
  try {
    return (await axios.post(`${API_URL_quistion}/questions`, questionData, getAuthConfig(thunkAPI))).data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    users: [],
    questions: [],
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: '',
  },
  reducers: {
    resetAdmin: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      // --- جلب المستخدمين ---
      .addCase(getAllUsers.pending, (state) => { state.isLoading = true; })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // --- جلب الأسئلة ---
      .addCase(getAllQuestions.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllQuestions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.questions = Array.isArray(action.payload) ? action.payload : action.payload.data;
      })
      .addCase(getAllQuestions.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // --- إضافة سؤال ---
      .addCase(createQuestion.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createQuestion.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        // التعديل هنا: نتأكد إننا بنضيف السؤال الجديد للمصفوفة سواء جاي مباشر أو جوه data
        const newQuestion = action.payload.data || action.payload;
        state.questions.push(newQuestion); 
      })
      .addCase(createQuestion.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { resetAdmin } = adminSlice.actions;
export default adminSlice.reducer;