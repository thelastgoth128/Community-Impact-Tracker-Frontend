import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axiosConfig';

export const fetchReports = createAsyncThunk(
    'reports/fetchAll',
    async (projectId, { rejectWithValue }) => {
        try {
            const response = await api.get(`/reports/all?projectId=${projectId}`);
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
            });
    },
});

export const { setCurrentReport } = reportSlice.actions;
export default reportSlice.reducer;
