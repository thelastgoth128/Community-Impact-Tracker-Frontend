import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axiosConfig';

export const fetchActivities = createAsyncThunk(
    'activities/fetchByProject',
    async (projectId, { rejectWithValue }) => {
        try {
            const response = await api.get(`/activities/all/${projectId}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchAllActivities = createAsyncThunk(
    'activities/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/activities/all');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const createActivity = createAsyncThunk(
    'activities/create',
    async (activityData, { rejectWithValue }) => {
        try {
            const response = await api.post('/activities/create', activityData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);


export const updateActivity = createAsyncThunk(
    'activities/update',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await api.patch(`/activities/${id}`, data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const deleteActivity = createAsyncThunk(
    'activities/delete',
    async (id, { rejectWithValue }) => {
        try {
            await api.delete(`/activities/${id}`);
            return id;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const activitySlice = createSlice({
    name: 'activities',
    initialState: {
        items: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchActivities.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchActivities.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchActivities.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchAllActivities.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchAllActivities.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchAllActivities.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(createActivity.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createActivity.fulfilled, (state, action) => {
                state.loading = false;
                state.items.push(action.payload);
            })
            .addCase(createActivity.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateActivity.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateActivity.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.items.findIndex(a => a.id === action.payload.id);
                if (index !== -1) {
                    state.items[index] = { ...state.items[index], ...action.payload };
                }
            })
            .addCase(updateActivity.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(deleteActivity.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteActivity.fulfilled, (state, action) => {
                state.loading = false;
                state.items = state.items.filter(a => a.id !== action.payload);
            })
            .addCase(deleteActivity.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default activitySlice.reducer;
