import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axiosConfig';

export const fetchReports = createAsyncThunk(
    'reports/fetchByProject',
    async (projectId, { rejectWithValue }) => {
        try {
            const response = await api.get(`/reports/all?projectId=${projectId}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchAllReports = createAsyncThunk(
    'reports/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/reports/all');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchReportById = createAsyncThunk(
    'reports/fetchById',
    async (id, { rejectWithValue }) => {
        try {
            const response = await api.get(`/reports/${id}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const generateReport = createAsyncThunk(
    'reports/generate',
    async (reportData, { rejectWithValue }) => {
        try {
            const response = await api.post('/reports/create', reportData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);


export const deleteReport = createAsyncThunk(
    'reports/delete',
    async (id, { rejectWithValue }) => {
        try {
            await api.delete(`/reports/${id}`);
            return id;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const reportSlice = createSlice({
    name: 'reports',
    initialState: {
        items: [],
        loading: false,
        error: null,
        currentReport: null,
    },
    reducers: {
        setCurrentReport: (state, action) => {
            state.currentReport = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchReports.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchReports.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchReports.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchAllReports.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchAllReports.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchAllReports.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchReportById.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchReportById.fulfilled, (state, action) => {
                state.loading = false;
                // Check if exists to avoid duplicates or just update
                const index = state.items.findIndex(i => i.id === action.payload.id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                } else {
                    state.items.push(action.payload);
                }
                state.currentReport = action.payload;
            })
            .addCase(fetchReportById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(generateReport.pending, (state) => {
                state.loading = true;
            })
            .addCase(generateReport.fulfilled, (state, action) => {
                state.loading = false;
                state.items.push(action.payload);
                state.currentReport = action.payload;
            })
            .addCase(generateReport.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(deleteReport.fulfilled, (state, action) => {
                state.items = state.items.filter(r => r.id !== action.payload);
            });
    },
});

export const { setCurrentReport } = reportSlice.actions;
export default reportSlice.reducer;
