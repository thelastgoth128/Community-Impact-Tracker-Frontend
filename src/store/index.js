import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import projectReducer from './slices/projectSlice';
import activityReducer from './slices/activitySlice';
import metricReducer from './slices/metricSlice';
import reportReducer from './slices/reportSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        projects: projectReducer,
        activities: activityReducer,
        metrics: metricReducer,
        reports: reportReducer,
    },
});
