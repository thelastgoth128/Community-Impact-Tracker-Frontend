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

export const fetchProjectsById = createAsyncThunk(
    'projects/fetchById',
    async (id, { rejectWithValue }) => {
        try {
            const response = await api.get(`/projects/${id}`);
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


export const updateProject = createAsyncThunk(
    'projects/update',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await api.patch(`/projects/${id}`, data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const deleteProject = createAsyncThunk(
    'projects/delete',
    async (id, { rejectWithValue }) => {
        try {
            await api.delete(`/projects/${id}`);
            return id;
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
            .addCase(fetchProjectsById.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchProjectsById.fulfilled, (state, action) => {
                state.loading = false;
                const rawProject = Array.isArray(action.payload) ? action.payload[0] : action.payload;
                // Normalize data structure if it comes nested in a 'data' property
                if (rawProject && rawProject.data) {
                    state.currentProject = { id: rawProject.id, ...rawProject.data };
                } else {
                    state.currentProject = rawProject;
                }
            })
            .addCase(fetchProjectsById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(createProject.fulfilled, (state, action) => {
                state.items.push(action.payload);
            })
            .addCase(updateProject.fulfilled, (state, action) => {
                const index = state.items.findIndex(p => p.id === action.payload.id);
                if (index !== -1) {
                    state.items[index] = { ...state.items[index], ...action.payload };
                }
                if (state.currentProject && state.currentProject.id === action.payload.id) {
                    state.currentProject = { ...state.currentProject, ...action.payload };
                }
            })
            .addCase(deleteProject.fulfilled, (state, action) => {
                state.items = state.items.filter(p => p.id !== action.payload);
                if (state.currentProject && state.currentProject.id === action.payload) {
                    state.currentProject = null;
                }
            });
    },
});

export const { clearCurrentProject } = projectSlice.actions;
export default projectSlice.reducer;
