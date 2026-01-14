import React from 'react';
import { useSelector } from 'react-redux';
import { Search, Bell, User } from 'lucide-react';

const Topbar = () => {
    const { user, role } = useSelector((state) => state.auth);


    return (
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-6">
            <div className="flex items-center text-black bg-gray-100 rounded-lg px-3 py-1.5 w-96">
                <Search className="w-4 h-4 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search projects..."
                    className="bg-transparent border-none focus:ring-0 text-sm ml-2 w-full"
                />
            </div>
            <div className="flex items-center space-x-4">
                <span className="text-xs font-semibold px-2 py-1 bg-blue-100 text-blue-800 rounded-full uppercase">
                    {role}
                </span>
                <button className="text-gray-400 hover:text-gray-600">
                    <Bell className="w-5 h-5" />
                </button>
                <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {user?.email?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <span className="text-sm font-medium text-gray-700">{user?.name}</span>
                </div>
            </div>
        </header>
    );
};

export default Topbar;
