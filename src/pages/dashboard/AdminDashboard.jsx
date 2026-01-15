import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProjects } from '../../store/slices/projectSlice';
import { fetchAllActivities } from '../../store/slices/activitySlice';
import { fetchAllMetrics } from '../../store/slices/metricSlice';
import { fetchAllReports } from '../../store/slices/reportSlice';
import { fetchUsers } from '../../store/slices/userSlice';
import { Users, FolderGit2, Activity, FileText } from 'lucide-react';

const AdminDashboard = () => {
    const dispatch = useDispatch();

    const { items: projects } = useSelector((state) => state.projects);
    const { items: users } = useSelector((state) => state.users);
    const { items: reports } = useSelector((state) => state.reports);
    const { items: activities } = useSelector((state) => state.activities);
    const { items: metrics } = useSelector((state) => state.metrics);

    useEffect(() => {
        dispatch(fetchProjects());
        dispatch(fetchUsers());
        dispatch(fetchAllActivities());
        dispatch(fetchAllMetrics());
        dispatch(fetchAllReports());
    }, [dispatch]);

    // Derived stats
    const stats = [
        { label: 'Total Projects', value: projects.length, color: 'bg-blue-500', icon: FolderGit2 },
        { label: 'Total Users', value: users.length, color: 'bg-emerald-500', icon: Users },
        { label: 'Reports', value: reports.length, color: 'bg-amber-500', icon: FileText },
        { label: 'Activities', value: activities.length, color: 'bg-purple-500', icon: Activity },
    ];

    
    const totalParticipants = metrics.reduce((sum, m) => sum + (Number(m.participants_count) || 0), 0);
    const totalMale = metrics.reduce((sum, m) => sum + (Number(m.male_count) || 0), 0);
    const totalFemale = metrics.reduce((sum, m) => sum + (Number(m.female_count) || 0), 0);
    const avgImpact = metrics.length > 0
        ? (metrics.reduce((sum, m) => sum + (Number(m.impact_score) || 0), 0) / metrics.length).toFixed(1)
        : '0.0';

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <div key={stat.label} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                        </div>
                        <div className={`p-3 rounded-full ${stat.color} bg-opacity-10`}>
                            <stat.icon className={`w-6 h-6 ${stat.color.replace('bg-', 'text-')}`} />
                        </div>
                    </div>
                ))}
            </div>

            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold text-gray-900 mb-6">Overall Ecosystem Impact</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="p-4 bg-gray-50 rounded-lg text-center border border-gray-200">
                        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Total Participants</p>
                        <p className="text-3xl font-bold text-blue-600 mt-2">{totalParticipants.toLocaleString()}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg text-center border border-gray-200">
                        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Male</p>
                        <p className="text-3xl font-bold text-gray-800 mt-2">{totalMale.toLocaleString()}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg text-center border border-gray-200">
                        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Female</p>
                        <p className="text-3xl font-bold text-gray-800 mt-2">{totalFemale.toLocaleString()}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg text-center border border-gray-200">
                        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Avg Impact Score</p>
                        <p className="text-3xl font-bold text-emerald-600 mt-2">{avgImpact}<span className="text-sm text-gray-400 font-normal">/100</span></p>
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Welcome</h2>
                <p className="text-gray-500">Select an item from the sidebar to manage content.</p>
            </div>
        </div>
    );
};

export default AdminDashboard;
