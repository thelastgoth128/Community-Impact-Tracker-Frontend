import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axiosConfig';

export const fetchUsers = createAsyncThunk(
    'users/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/user/all');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchUserById = createAsyncThunk(
    'users/fetchById',
    async (userId, { rejectWithValue }) => {
        try {
            const response = await api.get(`/user/${userId}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const createUser = createAsyncThunk(
    'users/create',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await api.post('/user/register', { ...userData, role: 'member' });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const deleteUser = createAsyncThunk(
    'users/delete',
    async (userId, { rejectWithValue }) => {
        try {
            await api.delete(`/user/${userId}`);
            return userId;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const userSlice = createSlice({
    name: 'users',
    initialState: {
        items: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch Users
            .addCase(fetchUsers.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch User
            .addCase(fetchUserById.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchUserById.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(fetchUserById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Create User
            .addCase(createUser.fulfilled, (state, action) => {
                state.items.push(action.payload);
            })
            // Delete User
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.items = state.items.filter((user) => user.id !== action.payload);
            });
    },
});

export default userSlice.reducer;
