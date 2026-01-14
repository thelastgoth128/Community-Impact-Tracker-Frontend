import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axiosConfig';

export const fetchMetrics = createAsyncThunk(
    'metrics/fetchByActivityQuery',
    async (activityId, { rejectWithValue }) => {
        try {
            const response = await api.get(`/metrics/all?activityId=${activityId}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchAllMetrics = createAsyncThunk(
    'metrics/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/metrics/all');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);
export const fetchMetricsByActivity = createAsyncThunk(
    'metrics/fetchByActivity',
    async (activityId, { rejectWithValue }) => {
        try {
            const response = await api.get(`/metrics/activity/${activityId}`);
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


export const updateMetric = createAsyncThunk(
    'metrics/update',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await api.patch(`/metrics/${id}`, data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const deleteMetric = createAsyncThunk(
    'metrics/delete',
    async (id, { rejectWithValue }) => {
        try {
            await api.delete(`/metrics/${id}`);
            return id;
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
            .addCase(fetchAllMetrics.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchAllMetrics.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchAllMetrics.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(createMetric.fulfilled, (state, action) => {
                state.items.push(action.payload);
            })
            .addCase(fetchMetricsByActivity.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchMetricsByActivity.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchMetricsByActivity.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateMetric.fulfilled, (state, action) => {
                const index = state.items.findIndex(m => m.id === action.payload.id);
                if (index !== -1) {
                    state.items[index] = { ...state.items[index], ...action.payload };
                }
            })
            .addCase(deleteMetric.fulfilled, (state, action) => {
                state.items = state.items.filter(m => m.id !== action.payload);
            });
    },
});

export default metricSlice.reducer;
