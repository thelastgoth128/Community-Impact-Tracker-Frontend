import React from 'react';
import { useSelector } from 'react-redux';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import LoginPage from '../pages/auth/LoginPage';
import MainLayout from '../components/layout/MainLayout';
import AdminDashboard from '../pages/dashboard/AdminDashboard';
import MemberDashboard from '../pages/dashboard/MemberDashboard';
import ProjectsListPage from '../pages/projects/ProjectsListPage';
import ProjectDetailPage from '../pages/projects/ProjectDetailPage';
import ReportViewerPage from '../pages/reports/ReportViewerPage';

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />

            <Route
                path="/"
                element={
                    <ProtectedRoute>
                        <MainLayout />
                    </ProtectedRoute>
                }
            >
                <Route index element={<Navigate to="/dashboard" replace />} />

                {/* Role-based dashboard redirect could be handled inside a Dashboard component */}
                <Route path="dashboard" element={
                    <ProtectedRoute roles={['admin', 'member', 'manager']}>
                        <DashboardSelector />
                    </ProtectedRoute>
                } />

                <Route path="projects" element={<ProjectsListPage />} />
                <Route path="projects/:id" element={<ProjectDetailPage />} />
                <Route path="reports/:id" element={<ReportViewerPage />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

const DashboardSelector = () => {
    const { role } = useSelector((state) => state.auth);
    if (role === 'admin' || role === 'manager') return <AdminDashboard />;
    return <MemberDashboard />;
};


