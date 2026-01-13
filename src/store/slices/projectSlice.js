import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axiosConfig';

export const fetchProjects = createAsyncThunk(
    'projects/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/projects/all');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchProjectsByUser = createAsyncThunk(
    'projects/fetchByUser',
    async (userid, { rejectWithValue }) => {
        try {
            const response = await api.get(`/projects/user/${userid}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const createProject = createAsyncThunk(
    'projects/create',
    async (projectData, { rejectWithValue }) => {
        try {
            const response = await api.post('/projects/create', projectData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const projectSlice = createSlice({
    name: 'projects',
    initialState: {
        items: [],
        loading: false,
        error: null,
        currentProject: null,
    },
    reducers: {
        clearCurrentProject: (state) => {
            state.currentProject = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProjects.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchProjects.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchProjects.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchProjectsByUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchProjectsByUser.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchProjectsByUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(createProject.fulfilled, (state, action) => {
                state.items.push(action.payload);
            });
    },
});

export const { clearCurrentProject } = projectSlice.actions;
export default projectSlice.reducer;
