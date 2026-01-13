import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchActivities, createActivity } from '../../store/slices/activitySlice';
import { fetchMetrics } from '../../store/slices/metricSlice';
import { generateReport, fetchReports } from '../../store/slices/reportSlice';
import { Calendar, MapPin, FileText, Activity, BarChart3, Plus } from 'lucide-react';
import Modal from '../../components/shared/Modal';
import toast from 'react-hot-toast';
import { MOCK_ACTIVITIES, MOCK_PROJECTS, MOCK_REPORTS } from '../../utils/mockData';

const ProjectDetailPage = () => {
    const { id } = useParams();
    const [activeTab, setActiveTab] = useState('activities');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activityForm, setActivityForm] = useState({
        activity_name: '',
        activity_type: '',
        date: '',
        location: '',
        notes: '',
    });

    const dispatch = useDispatch();
    const { items: projects } = useSelector((state) => state.projects);
    const { items: activities, loading: activitiesLoading } = useSelector((state) => state.activities);
    const { items: metrics, loading: metricsLoading } = useSelector((state) => state.metrics);
    const { items: reports, loading: reportsGenerating } = useSelector((state) => state.reports);

    const project = projects.find((p) => p.id === id) ||
        MOCK_PROJECTS.find(p => p.id === id) || {
        project_name: 'Project Details',
        description: 'Project data not found.',
        sector: 'Unknown',
        start_date: new Date(),
        end_date: new Date(),
    };

    const displayActivities = activities.length > 0 ? activities : (activitiesLoading ? [] : MOCK_ACTIVITIES.filter(a => a.projectid === id));
    const displayReports = reports.length > 0 ? reports : (reportsGenerating ? [] : MOCK_REPORTS.filter(r => r.projectid === id));

    useEffect(() => {
        dispatch(fetchActivities(id));
        dispatch(fetchReports(id));
    }, [dispatch, id]);

    const handleGenerateReport = async () => {
        try {
            const data = {
                projectid: id,
                generated_by: 'Current User',
                created_at: new Date(),
                summary: `Impact report for ${project.project_name}`,
                format: 'pdf',
            };
            await dispatch(generateReport(data)).unwrap();
            toast.success('Report generation started!');
        } catch (err) {
            toast.error('Failed to generate report');
        }
    };

    const handleCreateActivity = async (e) => {
        e.preventDefault();
        try {
            await dispatch(createActivity({ ...activityForm, projectid: id })).unwrap();
            toast.success('Activity added successfully!');
            setIsModalOpen(false);
        } catch (err) {
            toast.error('Failed to add activity');
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">{project.project_name}</h1>
                        <p className="text-gray-500 mt-2 max-w-2xl">{project.description}</p>
                    </div>
                    <button
                        onClick={handleGenerateReport}
                        disabled={reportsGenerating}
                        className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center space-x-2 disabled:opacity-50"
                    >
                        <FileText className="w-5 h-5" />
                        <span>{reportsGenerating ? 'Generating...' : 'Generate Report'}</span>
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 pt-8 border-t border-gray-50">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                            <Calendar className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 uppercase font-semibold">Timeline</p>
                            <p className="text-sm font-medium">{new Date(project.start_date).toLocaleDateString()} - {new Date(project.end_date).toLocaleDateString()}</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                            <BarChart3 className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 uppercase font-semibold">Sector</p>
                            <p className="text-sm font-medium">{project.sector}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="flex border-b border-gray-100">
                    {[
                        { id: 'activities', label: 'Activities', icon: Activity },
                        { id: 'metrics', label: 'Impact Metrics', icon: BarChart3 },
                        { id: 'reports', label: 'Reports', icon: FileText },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium transition-colors ${activeTab === tab.id
                                    ? 'border-b-2 border-blue-600 text-blue-600'
                                    : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <tab.icon className="w-4 h-4" />
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </div>

                <div className="p-6">
                    {activeTab === 'activities' && (
                        <div className="space-y-4">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold">Project Activities</h3>
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
                                >
                                    <Plus className="w-4 h-4" />
                                    <span>Add Activity</span>
                                </button>
                            </div>

                            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Activity">
                                <form onSubmit={handleCreateActivity} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Activity Name</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                            value={activityForm.activity_name}
                                            onChange={(e) => setActivityForm({ ...activityForm, activity_name: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Activity Type</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                            value={activityForm.activity_type}
                                            onChange={(e) => setActivityForm({ ...activityForm, activity_type: e.target.value })}
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                                            <input
                                                type="date"
                                                required
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                                value={activityForm.date}
                                                onChange={(e) => setActivityForm({ ...activityForm, date: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                                            <input
                                                type="text"
                                                required
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                                value={activityForm.location}
                                                onChange={(e) => setActivityForm({ ...activityForm, location: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                                        <textarea
                                            rows="2"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                            value={activityForm.notes}
                                            onChange={(e) => setActivityForm({ ...activityForm, notes: e.target.value })}
                                        ></textarea>
                                    </div>
                                    <div className="pt-4">
                                        <button
                                            type="submit"
                                            className="w-full bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors"
                                        >
                                            Save Activity
                                        </button>
                                    </div>
                                </form>
                            </Modal>

                            <ul className="divide-y divide-gray-100">
                                {displayActivities.map((activity) => (
                                    <li key={activity.id} className="py-4 flex justify-between items-center">
                                        <div>
                                            <p className="font-medium text-gray-900">{activity.activity_name}</p>
                                            <p className="text-sm text-gray-500">{activity.activity_type} • {new Date(activity.date).toLocaleDateString()}</p>
                                        </div>
                                        <div className="flex items-center space-x-2 text-sm text-gray-400">
                                            <MapPin className="w-4 h-4" />
                                            <span>{activity.location}</span>
                                        </div>
                                    </li>
                                ))}
                                {displayActivities.length === 0 && <li className="py-8 text-center text-gray-500">No activities recorded yet.</li>}
                            </ul>
                        </div>
                    )}

                    {activeTab === 'metrics' && (
                        <div className="py-8 text-center text-gray-500">
                            Select an activity from the tab above to view its impact metrics.
                        </div>
                    )}

                    {activeTab === 'reports' && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold mb-4">Generated Reports</h3>
                            <div className="grid grid-cols-1 gap-4">
                                {displayReports.map((report) => (
                                    <div key={report.id} className="p-4 border border-gray-100 rounded-lg flex justify-between items-center hover:bg-gray-50 transition-colors">
                                        <div className="flex items-center space-x-4">
                                            <div className="p-2 bg-rose-50 text-rose-600 rounded-lg">
                                                <FileText className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">Report #{report.id.slice(-6)}</p>
                                                <p className="text-xs text-gray-500">Generated on {new Date(report.created_at).toLocaleString()}</p>
                                            </div>
                                        </div>
                                        <Link
                                            to={`/reports/${report.id}`}
                                            className="text-sm font-semibold text-blue-600 hover:text-blue-800"
                                        >
                                            View Report
                                        </Link>
                                    </div>
                                ))}
                                {displayReports.length === 0 && <div className="py-8 text-center text-gray-500">No reports generated yet.</div>}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProjectDetailPage;
