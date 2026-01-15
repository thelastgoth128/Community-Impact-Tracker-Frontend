import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProjects, createProject, fetchProjectsByUser, deleteProject, updateProject } from '../../store/slices/projectSlice';
import { Link } from 'react-router-dom';
import { Plus, Search, Trash2, Edit2 } from 'lucide-react';
import Modal from '../../components/shared/Modal';
import toast from 'react-hot-toast';

const ProjectsListPage = () => {
    const dispatch = useDispatch();
    const { items, loading } = useSelector((state) => state.projects);
    const { user, role } = useSelector((state) => state.auth);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        project_name: '',
        sector: '',
        description: '',
        start_date: '',
        end_date: '',
    });

    useEffect(() => {
        // If user is admin, fetch all projects; otherwise fetch only user's projects
        if (role === 'admin') {
            dispatch(fetchProjects());
        } else if (user?.id) {
            dispatch(fetchProjectsByUser(user.id));
        }
    }, [dispatch, role, user?.id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userId = user?.id;

        if (!userId) {
            toast.error('User ID not found. Please log in again.');
            return;
        }

        try {
            await dispatch(createProject({ ...formData, userid: userId })).unwrap();
            toast.success('Project created successfully!');
            setIsModalOpen(false);
            
            setFormData({
                project_name: '',
                sector: '',
                description: '',
                start_date: '',
                end_date: '',
            });
        } catch (err) {
            toast.error('Failed to create project');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this project?')) {
            try {
                await dispatch(deleteProject(id)).unwrap();
                toast.success('Project deleted');
            } catch (error) {
                toast.error('Failed to delete project');
            }
        }
    };

    const handleEdit = async (project) => {
        const newName = window.prompt("Enter new project name:", project.project_name);
        if (newName && newName !== project.project_name) {
            try {
                await dispatch(updateProject({ id: project.id, data: { project_name: newName } })).unwrap();
                toast.success('Project updated');
            } catch (error) {
                toast.error('Failed to update project');
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                    <Plus className="w-4 h-4" />
                    <span>New Project</span>
                </button>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Project">
                <form onSubmit={handleSubmit} className="space-y-4 text-black">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
                        <input
                            type="text"
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            value={formData.project_name}
                            onChange={(e) => setFormData({ ...formData, project_name: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Sector</label>
                        <select
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            value={formData.sector}
                            onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                        >
                            <option value="">Select Sector</option>
                            <option value="Health">Health</option>
                            <option value="Education">Education</option>
                            <option value="Agriculture">Agriculture</option>
                            <option value="Sanitation">Sanitation</option>
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                            <input
                                type="date"
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                value={formData.start_date}
                                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                            <input
                                type="date"
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                value={formData.end_date}
                                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            required
                            rows="3"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        ></textarea>
                    </div>
                    <div className="pt-4">
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors"
                        >
                            Create Project
                        </button>
                    </div>
                </form>
            </Modal>

            <div className="bg-white text-black rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                    <div className="relative w-72">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Filter by name..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-600 text-xs uppercase font-semibold">
                        <tr>
                            <th className="px-6 py-3">Project Name</th>
                            <th className="px-6 py-3">Sector</th>
                            <th className="px-6 py-3">Start Date</th>
                            <th className="px-6 py-3">End Date</th>
                            <th className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {loading ? (
                            <tr>
                                <td colSpan="5" className="px-6 py-10 text-center text-gray-500">Loading projects...</td>
                            </tr>
                        ) : items.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="px-6 py-10 text-center text-gray-500">No projects found.</td>
                            </tr>
                        ) : (
                            items.map((project) => (
                                <tr key={project.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-gray-900">{project.project_name}</td>
                                    <td className="px-6 py-4 text-gray-600">{project.sector}</td>
                                    <td className="px-6 py-4 text-gray-600">{new Date(project.start_date).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 text-gray-600">{new Date(project.end_date).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 flex items-center space-x-3">
                                        <Link to={`/projects/${project.id}`} className="text-blue-600 hover:text-blue-800 font-medium">View</Link>
                                        {(role === 'admin' || role === 'manager') && (
                                            <>
                                                <button onClick={() => handleEdit(project)} className="text-gray-500 hover:text-blue-600"><Edit2 className="w-4 h-4" /></button>
                                                <button onClick={() => handleDelete(project.id)} className="text-gray-500 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProjectsListPage;
