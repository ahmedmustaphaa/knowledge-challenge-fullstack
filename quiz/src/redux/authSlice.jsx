import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// جلب اليوزر من الـ LocalStorage لو موجود
const user = JSON.parse(localStorage.getItem('user'));

const API_URL = 'https://knowledge-challenge-fullstack-63u8.vercel.app/api/user';

// 1. تسجيل مستخدم جديد
export const register = createAsyncThunk('auth/register', async (userData, thunkAPI) => {
    try {
        const response = await axios.post(`${API_URL}/register`, userData);
        return response.data;
    } catch (error) {
        const message = error.response?.data?.message || error.message;
        return thunkAPI.rejectWithValue(message);
    }
});

// 2. تأكيد كود الـ OTP
export const verifyOTP = createAsyncThunk('auth/verifyOTP', async (otpData, thunkAPI) => {
    try {
        const response = await axios.post(`${API_URL}/verify-otp`, otpData);
        if (response.data && response.data.token) {
            localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
    } catch (error) {
        const message = error.response?.data?.message || error.message;
        return thunkAPI.rejectWithValue(message);
    }
});

// 3. تسجيل الدخول
export const login = createAsyncThunk('auth/login', async (userData, thunkAPI) => {
    try {
        const response = await axios.post(`${API_URL}/login`, userData);
        if (response.data && response.data.token) {
            localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
    } catch (error) {
        const message = error.response?.data?.message || error.message;
        return thunkAPI.rejectWithValue(message);
    }
});

// 4. طلب كود استعادة الباسورد (Forgot Password)
export const forgotPassword = createAsyncThunk('auth/forgotPassword', async (emailData, thunkAPI) => {
    try {
        const response = await axios.post(`${API_URL}/forgot-password`, emailData);
        return response.data;
    } catch (error) {
        const message = error.response?.data?.message || error.message;
        return thunkAPI.rejectWithValue(message);
    }
});

// 5. تعيين الباسورد الجديد (Reset Password)
export const resetPassword = createAsyncThunk('auth/resetPassword', async (resetData, thunkAPI) => {
    try {
        const response = await axios.post(`${API_URL}/reset-password`, resetData);
        return response.data;
    } catch (error) {
        const message = error.response?.data?.message || error.message;
        return thunkAPI.rejectWithValue(message);
    }
});

// 6. تسجيل الخروج
export const logout = createAsyncThunk('auth/logout', async () => {
    localStorage.removeItem('user');
});


// --- الحالة المبدئية ---
const initialState = {
    user: user ? user : null,
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: '',
    isWaitingOTP: false,
    isResetMailSent: false, // لمتابعة حالة إرسال إيميل الاستعادة
};

// --- الـ Slice ---
export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false;
            state.isSuccess = false;
            state.isError = false;
            state.message = '';
            state.isWaitingOTP = false;
            state.isResetMailSent = false;
        },
    },
    extraReducers: (builder) => {
        builder
            // Register
            .addCase(register.pending, (state) => { state.isLoading = true; })
            .addCase(register.fulfilled, (state) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.isWaitingOTP = true; 
            })
            .addCase(register.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // Verify OTP
            .addCase(verifyOTP.pending, (state) => { state.isLoading = true; })
            .addCase(verifyOTP.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.user = action.payload;
            })
            .addCase(verifyOTP.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // Login
            .addCase(login.pending, (state) => { state.isLoading = true; })
            .addCase(login.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.user = action.payload;
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // Forgot Password
            .addCase(forgotPassword.pending, (state) => { state.isLoading = true; })
            .addCase(forgotPassword.fulfilled, (state) => {
                state.isLoading = false;
                state.isResetMailSent = true;
                state.isSuccess = true;
            })
            .addCase(forgotPassword.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // Reset Password
            .addCase(resetPassword.pending, (state) => { state.isLoading = true; })
            .addCase(resetPassword.fulfilled, (state) => {
                state.isLoading = false;
                state.isSuccess = true;
            })
            .addCase(resetPassword.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // Logout
            .addCase(logout.fulfilled, (state) => {
                state.user = null;
            });
    },
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;