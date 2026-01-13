import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
    LayoutDashboard,
    FolderKanban,
    FileText,
    Users,
    Settings,
    LogOut
} from 'lucide-react';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';

const Sidebar = () => {
    const { role } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    const adminLinks = [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { name: 'Projects', path: '/projects', icon: FolderKanban },
        { name: 'Reports', path: '/reports', icon: FileText },
        { name: 'Users', path: '/users', icon: Users },
    ];

    const memberLinks = [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { name: 'My Projects', path: '/projects', icon: FolderKanban },
        { name: 'My Reports', path: '/reports', icon: FileText },
    ];

    const links = (role === 'admin' || role === 'manager') ? adminLinks : memberLinks;

    return (
        <aside className="w-64 bg-slate-900 text-white flex flex-col">
            <div className="p-6 text-xl font-bold border-b border-slate-800">
                Impact Tracker
            </div>
            <nav className="flex-1 p-4 space-y-2">
                {links.map((link) => (
                    <NavLink
                        key={link.path}
                        to={link.path}
                        className={({ isActive }) =>
                            `flex items-center space-x-3 p-3 rounded-lg transition-colors ${isActive ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 text-slate-400'
                            }`
                        }
                    >
                        <link.icon className="w-5 h-5" />
                        <span>{link.name}</span>
                    </NavLink>
                ))}
            </nav>
            <div className="p-4 border-t border-slate-800">
                <button
                    onClick={() => dispatch(logout())}
                    className="flex items-center space-x-3 p-3 w-full rounded-lg text-slate-400 hover:bg-slate-800 transition-colors"
                >
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
