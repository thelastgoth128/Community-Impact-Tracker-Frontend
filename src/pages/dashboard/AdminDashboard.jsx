import React from 'react';

const AdminDashboard = () => {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Total Projects', value: '24', color: 'bg-blue-500' },
                    { label: 'Active Activities', value: '156', color: 'bg-emerald-500' },
                    { label: 'Reports Generated', value: '89', color: 'bg-amber-500' },
                    { label: 'Waitlist', value: '12', color: 'bg-rose-500' },
                ].map((stat) => (
                    <div key={stat.label} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                    </div>
                ))}
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Projects</h2>
                <div className="text-gray-500 text-sm">Dashboard content goes here...</div>
            </div>
        </div>
    );
};

export default AdminDashboard;
