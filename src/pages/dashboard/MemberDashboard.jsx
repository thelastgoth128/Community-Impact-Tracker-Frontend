import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProjectsByUser } from '../../store/slices/projectSlice';
import { Link } from 'react-router-dom';

const MemberDashboard = () => {
    const dispatch = useDispatch();
    const { items: projects, loading } = useSelector((state) => state.projects);
    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        const userId = user?.id;

        if (userId) {
            dispatch(fetchProjectsByUser(userId));
        } else {
            console.error('No user ID found in user object!');
        }
    }, [dispatch, user]);

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">My Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <p className="text-sm font-medium text-gray-500">My Projects</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{projects.length}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <p className="text-sm font-medium text-gray-500">Activities Done</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">-</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <p className="text-sm font-medium text-gray-500">Reports Ready</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">-</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-900">My Projects</h2>
                </div>

                {loading ? (
                    <div className="p-6 text-center text-gray-500">Loading projects...</div>
                ) : projects.length === 0 ? (
                    <div className="p-6 text-center text-gray-500">
                        No projects found. Create your first project to get started!
                    </div>
                ) : (
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-600 text-xs uppercase font-semibold">
                            <tr>
                                <th className="px-6 py-3">Project Name</th>
                                <th className="px-6 py-3">Sector</th>
                                <th className="px-6 py-3">User ID</th>
                                <th className="px-6 py-3">Start Date</th>
                                <th className="px-6 py-3">End Date</th>
                                <th className="px-6 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {projects.map((project) => {
                                const userId = user?.id;
                                return (
                                    <tr key={project.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900">{project.project_name}</td>
                                        <td className="px-6 py-4 text-gray-600">{project.sector}</td>
                                        <td className="px-6 py-4 text-gray-600 text-xs">{project.userid || 'NO USERID'}</td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {new Date(project.start_date).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {new Date(project.end_date).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <Link
                                                to={`/projects/${project.id}`}
                                                className="text-blue-600 hover:text-blue-800 font-medium"
                                            >
                                                View
                                            </Link>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default MemberDashboard;
