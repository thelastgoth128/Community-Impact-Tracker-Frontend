import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axiosConfig';

export const fetchActivities = createAsyncThunk(
    'activities/fetchAll',
    async (projectId, { rejectWithValue }) => {
        try {
            const response = await api.get(`/activities/all/${projectId}`);
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
            .addCase(createActivity.fulfilled, (state, action) => {
                state.items.push(action.payload);
            });
    },
});

export default activitySlice.reducer;
