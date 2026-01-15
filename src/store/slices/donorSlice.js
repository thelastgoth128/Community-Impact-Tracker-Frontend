import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axiosConfig';

export const fetchDonors = createAsyncThunk(
    'donors/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/donors/all');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const createDonor = createAsyncThunk(
    'donors/create',
    async (donorData, { rejectWithValue }) => {
        try {
            const response = await api.post('/donors/create', donorData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const updateDonor = createAsyncThunk(
    'donors/update',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await api.patch(`/donors/${id}`, data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const deleteDonor = createAsyncThunk(
    'donors/delete',
    async (id, { rejectWithValue }) => {
        try {
            await api.delete(`/donors/${id}`);
            return id;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const donorSlice = createSlice({
    name: 'donors',
    initialState: {
        items: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch All
            .addCase(fetchDonors.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDonors.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchDonors.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Create
            .addCase(createDonor.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createDonor.fulfilled, (state, action) => {
                state.loading = false;
                state.items.push(action.payload);
            })
            .addCase(createDonor.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Update
            .addCase(updateDonor.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateDonor.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.items.findIndex((item) => item.id === action.payload.id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
            })
            .addCase(updateDonor.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Delete
            .addCase(deleteDonor.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteDonor.fulfilled, (state, action) => {
                state.loading = false;
                state.items = state.items.filter((item) => item.id !== action.payload);
            })
            .addCase(deleteDonor.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default donorSlice.reducer;
