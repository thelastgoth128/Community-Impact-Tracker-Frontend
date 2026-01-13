import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axiosConfig';

export const login = createAsyncThunk(
    'auth/login',
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await api.post('/auth/login', credentials);
            localStorage.setItem('token', response.data.access_token);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const initialState = {
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
    role: localStorage.getItem('role') || null,
    loading: false,
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.role = null;
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('role');
        },
        updateUser: (state, action) => {
            state.user = action.payload;
            localStorage.setItem('user', JSON.stringify(action.payload));
            state.role = action.payload.role;
            localStorage.setItem('role', action.payload.role);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.token = action.payload.access_token;
                state.user = action.payload.payload;
                state.role = action.payload.payload.role;
                localStorage.setItem('user', JSON.stringify(state.user));
                localStorage.setItem('role', state.role);
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { logout, updateUser } = authSlice.actions;
export default authSlice.reducer;
