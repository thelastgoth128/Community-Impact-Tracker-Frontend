import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axiosConfig';

export const fetchMetrics = createAsyncThunk(
    'metrics/fetchAll',
    async (activityId, { rejectWithValue }) => {
        try {
            const response = await api.get(`/metrics/all?activityId=${activityId}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const createMetric = createAsyncThunk(
    'metrics/create',
    async (metricData, { rejectWithValue }) => {
        try {
            const response = await api.post('/metrics/create', metricData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const metricSlice = createSlice({
    name: 'metrics',
    initialState: {
        items: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchMetrics.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchMetrics.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchMetrics.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(createMetric.fulfilled, (state, action) => {
                state.items.push(action.payload);
            });
    },
});

export default metricSlice.reducer;
