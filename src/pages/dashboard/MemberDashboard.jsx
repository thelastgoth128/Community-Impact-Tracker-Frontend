import React from 'react';

const MemberDashboard = () => {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">My Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'My Projects', value: '4', color: 'bg-blue-500' },
                    { label: 'Activities Done', value: '28', color: 'bg-emerald-500' },
                    { label: 'Reports Ready', value: '7', color: 'bg-amber-500' },
                ].map((stat) => (
                    <div key={stat.label} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MemberDashboard;
