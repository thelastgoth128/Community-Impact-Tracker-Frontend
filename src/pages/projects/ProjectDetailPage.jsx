import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchActivities, createActivity, updateActivity, deleteActivity } from '../../store/slices/activitySlice';
import { fetchMetrics, fetchMetricsByActivity, createMetric, updateMetric, deleteMetric } from '../../store/slices/metricSlice';
import { generateReport, fetchReports, deleteReport } from '../../store/slices/reportSlice';
import { Calendar, MapPin, FileText, Activity, BarChart3, Plus, Trash2, Edit2, Loader } from 'lucide-react';
import Modal from '../../components/shared/Modal';
import toast from 'react-hot-toast';
import { fetchProjectsById } from '../../store/slices/projectSlice';


const ProjectDetailPage = () => {
    const { id } = useParams();
    const [activeTab, setActiveTab] = useState('activities');
    const { user, role } = useSelector((state) => state.auth);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isMetricModalOpen, setIsMetricModalOpen] = useState(false);
    const [selectedActivityId, setSelectedActivityId] = useState(null);
    const [activityForm, setActivityForm] = useState({
        activity_name: '',
        activity_type: '',
        date: '',
        location: '',
        notes: '',
    });
    const [metricForm, setMetricForm] = useState({
        participants_count: '',
        male_count: '',
        female_count: '',
        impact_score: '',
        outcome_description: ''
    });
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [reportForm, setReportForm] = useState({
        summary: '',
        conclusions: '',
        recommendations: ''
    });

    const dispatch = useDispatch();
    const { items: projects, currentProject, loading: projectLoading, error: projectError } = useSelector((state) => state.projects);

    const { items: activities, loading: activitiesLoading } = useSelector((state) => state.activities);
    const { items: metrics, loading: metricsLoading } = useSelector((state) => state.metrics);
    const { items: reports, loading: reportsGenerating } = useSelector((state) => state.reports);

    const project = projects.find((p) => String(p.id) === id) || currentProject || {
        project_name: 'Project Details',
        description: 'Project data not found.',
        sector: 'Unknown',
        start_date: new Date(),
        end_date: new Date(),
    };

    const displayActivities = activities;
    const displayReports = reports;


    useEffect(() => {
        dispatch(fetchProjectsById(id));
        dispatch(fetchActivities(id));
        dispatch(fetchReports(id));
    }, [dispatch, id]);

    useEffect(() => {
        if (selectedActivityId) {
            dispatch(fetchMetricsByActivity(selectedActivityId));
        }
    }, [dispatch, selectedActivityId]);

    const handleGenerateReportStart = () => {
        setReportForm({
            summary: `Impact report for ${project.project_name}`,
            conclusions: '',
            recommendations: ''
        });
        setIsReportModalOpen(true);
    };

    const handleGenerateReportSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = {
                projectid: id,
                generated_by: user?.id,
                created_at: new Date(),
                summary: reportForm.summary,
                conclusions: reportForm.conclusions,
                recommendations: reportForm.recommendations,
                format: 'pdf',
            };
            await dispatch(generateReport(data)).unwrap();
            toast.success('Report generation started!');
            setIsReportModalOpen(false);
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

    const handleCreateMetric = async (e) => {
        e.preventDefault();
        if (!selectedActivityId) return toast.error('Please select an activity first');

        try {
            await dispatch(createMetric({
                ...metricForm,
                activityid: selectedActivityId,
                projectid: id
            })).unwrap();
            toast.success('Metric added successfully');
            setIsMetricModalOpen(false);
            setMetricForm({
                participants_count: '',
                male_count: '',
                female_count: '',
                impact_score: '',
                outcome_description: ''
            });
            dispatch(fetchMetricsByActivity(selectedActivityId));
        } catch (err) {
            toast.error('Failed to add metric');
        }
    };

    // --- Activity Handlers ---
    const handleEditActivity = async (activity) => {
        const newName = window.prompt("Enter new activity name:", activity.activity_name);
        if (newName && newName !== activity.activity_name) {
            try {
                await dispatch(updateActivity({ id: activity.id, data: { activity_name: newName } })).unwrap();
                toast.success('Activity updated');
            } catch (error) {
                toast.error('Failed to update activity');
            }
        }
    };

    const handleDeleteActivity = async (activityId) => {
        if (window.confirm('Are you sure you want to delete this activity?')) {
            try {
                await dispatch(deleteActivity(activityId)).unwrap();
                toast.success('Activity deleted');
            } catch (error) {
                toast.error('Failed to delete activity');
            }
        }
    };

    // --- Metric Handlers ---
    const handleDeleteMetric = async (metricId) => {
        if (window.confirm('Are you sure you want to delete this metric?')) {
            try {
                await dispatch(deleteMetric(metricId)).unwrap();
                toast.success('Metric deleted');
                // Refresh metrics for current activity
                if (selectedActivityId) dispatch(fetchMetricsByActivity(selectedActivityId));
            } catch (error) {
                toast.error('Failed to delete metric');
            }
        }
    };

    const handleEditMetric = async (metric) => {
        const newScore = window.prompt("Enter new Impact Score:", metric.impact_score);
        if (newScore && newScore !== String(metric.impact_score)) {
            try {
                await dispatch(updateMetric({ id: metric.id, data: { impact_score: newScore } })).unwrap();
                toast.success('Metric updated');
                if (selectedActivityId) dispatch(fetchMetricsByActivity(selectedActivityId));
            } catch (error) {
                toast.error('Failed to update metric');
            }
        }
    };


    // --- Report Handlers ---
    const handleDeleteReport = async (reportId) => {
        if (window.confirm('Are you sure you want to delete this report?')) {
            try {
                await dispatch(deleteReport(reportId)).unwrap();
                toast.success('Report deleted');
            } catch (error) {
                toast.error('Failed to delete report');
            }
        }
    };

    if (projectLoading && !currentProject && projects.length === 0) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (projectError) {
        return (
            <div className="p-8 text-center text-red-600">
                <p>Error loading project: {typeof projectError === 'object' ? JSON.stringify(projectError) : projectError}</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 text-black">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">{project.project_name}</h1>
                        <p className="text-gray-500 mt-2 max-w-2xl">{project.description}</p>
                    </div>
                    <button
                        onClick={handleGenerateReportStart}
                        disabled={reportsGenerating}
                        className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center space-x-2 disabled:opacity-50"
                    >
                        <FileText className="w-5 h-5" />
                        <span>{reportsGenerating ? 'Generating...' : 'Generate Report'}</span>
                    </button>

                    <Modal isOpen={isReportModalOpen} onClose={() => setIsReportModalOpen(false)} title="Generate Impact Report">
                        <form onSubmit={handleGenerateReportSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Executive Summary</label>
                                <textarea
                                    rows="3"
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={reportForm.summary}
                                    onChange={(e) => setReportForm({ ...reportForm, summary: e.target.value })}
                                ></textarea>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Conclusions</label>
                                <textarea
                                    rows="3"
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={reportForm.conclusions}
                                    onChange={(e) => setReportForm({ ...reportForm, conclusions: e.target.value })}
                                    placeholder="Enter report conclusions..."
                                ></textarea>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Recommendations</label>
                                <textarea
                                    rows="3"
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={reportForm.recommendations}
                                    onChange={(e) => setReportForm({ ...reportForm, recommendations: e.target.value })}
                                    placeholder="Enter recommendations..."
                                ></textarea>
                            </div>
                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={reportsGenerating}
                                    className="w-full bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {reportsGenerating ? (
                                        <>
                                            <Loader className="w-5 h-5 animate-spin" />
                                            <span>Generating...</span>
                                        </>
                                    ) : (
                                        <span>Generate PDF</span>
                                    )}
                                </button>
                            </div>
                        </form>
                    </Modal>
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
                                        <div className="flex items-center space-x-4">
                                            <div className="flex items-center space-x-2 text-sm text-gray-400">
                                                <MapPin className="w-4 h-4" />
                                                <span>{activity.location}</span>
                                            </div>
                                            {(role === 'admin' || role === 'manager') && (
                                                <div className="flex items-center space-x-2">
                                                    <button onClick={() => handleEditActivity(activity)} className="text-gray-400 hover:text-blue-600"><Edit2 className="w-4 h-4" /></button>
                                                    <button onClick={() => handleDeleteActivity(activity.id)} className="text-gray-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                                                </div>
                                            )}
                                        </div>
                                    </li>
                                ))}
                                {displayActivities.length === 0 && <li className="py-8 text-center text-gray-500">No activities recorded yet.</li>}
                            </ul>
                        </div>
                    )}

                    {activeTab === 'metrics' && (
                        <div className="space-y-6">
                            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex flex-col md:flex-row justify-between items-center gap-4">
                                <div className="w-full md:w-2/3">
                                    <label className="block text-sm font-medium text-blue-900 mb-2">Select Activity to View Metrics</label>
                                    <select
                                        className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white font-medium text-gray-700"
                                        onChange={(e) => setSelectedActivityId(e.target.value)}
                                        value={selectedActivityId || ''}
                                    >
                                        <option value="">-- Choose an Activity --</option>
                                        {displayActivities.map(a => <option key={a.id} value={a.id}>{a.activity_name}</option>)}
                                    </select>
                                </div>
                                <button
                                    onClick={() => {
                                        if (!selectedActivityId) return toast.error('Please select an activity first');
                                        setIsMetricModalOpen(true);
                                    }}
                                    className="w-full md:w-auto bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center space-x-2"
                                >
                                    <Plus className="w-4 h-4" />
                                    <span>Add Metrics</span>
                                </button>
                            </div>

                            <Modal isOpen={isMetricModalOpen} onClose={() => setIsMetricModalOpen(false)} title="Add Impact Metrics">
                                <form onSubmit={handleCreateMetric} className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Participants Count</label>
                                            <input
                                                type="number"
                                                required
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                                value={metricForm.participants_count}
                                                onChange={(e) => setMetricForm({ ...metricForm, participants_count: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Impact Score (0-100)</label>
                                            <input
                                                type="number"
                                                required
                                                min="0"
                                                max="100"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                                value={metricForm.impact_score}
                                                onChange={(e) => setMetricForm({ ...metricForm, impact_score: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Male Participants</label>
                                            <input
                                                type="number"
                                                required
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                                value={metricForm.male_count}
                                                onChange={(e) => setMetricForm({ ...metricForm, male_count: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Female Participants</label>
                                            <input
                                                type="number"
                                                required
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                                value={metricForm.female_count}
                                                onChange={(e) => setMetricForm({ ...metricForm, female_count: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Outcome Description</label>
                                        <textarea
                                            rows="3"
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                            value={metricForm.outcome_description}
                                            onChange={(e) => setMetricForm({ ...metricForm, outcome_description: e.target.value })}
                                            placeholder="Describe the impact and outcome of the activity..."
                                        ></textarea>
                                    </div>
                                    <div className="pt-4">
                                        <button
                                            type="submit"
                                            className="w-full bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors"
                                        >
                                            Save Metrics
                                        </button>
                                    </div>
                                </form>
                            </Modal>

                            {selectedActivityId && !metricsLoading && metrics.length > 0 && (
                                <div className="space-y-4">
                                    {metrics.map((metric) => (
                                        <div key={metric.id} className="space-y-4">
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                <div className="p-4 border border-gray-200 rounded-lg bg-white text-center relative group">
                                                    <p className="text-xs text-gray-500 uppercase font-bold">Participants</p>
                                                    <p className="text-2xl font-bold text-blue-600">{metric.participants_count}</p>
                                                    {(role === 'admin' || role === 'manager') && (
                                                        <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <button onClick={() => handleDeleteMetric(metric.id)} className="text-gray-300 hover:text-red-600"><Trash2 className="w-3 h-3" /></button>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="p-4 border border-gray-200 rounded-lg bg-white text-center">
                                                    <p className="text-xs text-gray-500 uppercase font-bold">Male</p>
                                                    <p className="text-2xl font-bold text-gray-900">{metric.male_count}</p>
                                                </div>
                                                <div className="p-4 border border-gray-200 rounded-lg bg-white text-center">
                                                    <p className="text-xs text-gray-500 uppercase font-bold">Female</p>
                                                    <p className="text-2xl font-bold text-gray-900">{metric.female_count}</p>
                                                </div>
                                                <div className="p-4 border border-gray-200 rounded-lg bg-white text-center relative group">
                                                    <p className="text-xs text-gray-500 uppercase font-bold">Impact Score</p>
                                                    <p className="text-2xl font-bold text-emerald-600">{metric.impact_score}<span className="text-sm text-gray-400">/100</span></p>
                                                    {(role === 'admin' || role === 'manager') && (
                                                        <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <button onClick={() => handleEditMetric(metric)} className="text-gray-300 hover:text-blue-600"><Edit2 className="w-3 h-3" /></button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {metric.outcome_description && (
                                                <div className="p-4 border border-gray-200 rounded-lg bg-white">
                                                    <h4 className="font-semibold text-gray-900 mb-2">Outcome Description</h4>
                                                    <p className="text-gray-600">{metric.outcome_description}</p>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {selectedActivityId && !metricsLoading && metrics.length === 0 && (
                                <div className="py-8 text-center text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                                    No metrics found for this activity.
                                </div>
                            )}

                            {!selectedActivityId && (
                                <div className="py-12 text-center text-gray-400">
                                    <BarChart3 className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                    <p>Please select an activity above to see the impact data.</p>
                                </div>
                            )}
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
                                                <p className="font-medium text-gray-900">{project.project_name} Impact Report</p>
                                                <p className="text-xs text-gray-500">Generated on {new Date(report.created_at).toLocaleString()}</p>
                                            </div>
                                        </div>
                                        <Link
                                            to={`/reports/${report.id}`}
                                            className="text-sm font-semibold text-blue-600 hover:text-blue-800"
                                        >
                                            View Report
                                        </Link>
                                        {(role === 'admin' || role === 'manager') && (
                                            <button onClick={() => handleDeleteReport(report.id)} className="ml-4 text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded-full">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}
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
