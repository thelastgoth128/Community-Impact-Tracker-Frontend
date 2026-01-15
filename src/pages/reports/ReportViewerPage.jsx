import { useRef, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchReportById, updateReport } from '../../store/slices/reportSlice';
import { fetchUserById } from '../../store/slices/userSlice';
import { Calendar, User as UserIcon, FileText, ArrowLeft, Download, Eye, Edit2, Clock } from 'lucide-react';
import PDFViewer from '../../components/shared/PDFViewer';
import Modal from '../../components/shared/Modal';
import toast from 'react-hot-toast';

const ReportViewerPage = () => {
    const { id } = useParams();
    const { items: reports, currentReport, loading: reportLoading } = useSelector((state) => state.reports);
    const { user: reportUser } = useSelector((state) => state.users);
    const { role } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editForm, setEditForm] = useState({
        summary: '',
        conclusions: '',
        recommendations: ''
    });

    const report = reports.find((r) => r.id === id) || (currentReport?.id === id ? currentReport : null);

    useEffect(() => {
        if (!report && id) {
            dispatch(fetchReportById(id));
        }
    }, [dispatch, id, report]);

    useEffect(() => {
        if (report?.generated_by) {
            dispatch(fetchUserById(report.generated_by));
        }
    }, [dispatch, report?.generated_by]);

    const handleEditStart = () => {
        setEditForm({
            summary: report.summary || '',
            conclusions: report.conclusions || '',
            recommendations: report.recommendations || ''
        });
        setIsEditModalOpen(true);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await dispatch(updateReport({ id: report.id, data: editForm })).unwrap();
            toast.success('Report updated and regenerating...');
            setIsEditModalOpen(false);
        } catch (error) {
            toast.error('Failed to update report');
        }
    };
    if (reportLoading && !report) {
        return <div className="flex justify-center py-20">Loading report...</div>;
    }

    if (!report) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <p className="text-gray-500">Report not found.</p>
                <Link to="/projects" className="mt-4 text-blue-600 hover:underline">Return to Projects</Link>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Link to={`/projects/${report.projectid}`} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Report Details</h1>
                        <p className="text-sm text-gray-500">Project Impact Assessment</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    {(role === 'admin' || role === 'manager') && (
                        <button
                            onClick={handleEditStart}
                            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                        >
                            <Edit2 className="w-4 h-4" />
                            <span>Edit</span>
                        </button>
                    )}
                </div>
            </div>

            <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Report Details">
                <form onSubmit={handleUpdate} className="space-y-4 text-black">
                    <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg text-sm text-yellow-800 mb-4">
                        Note: Updating these fields will regenerate the PDF file.
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Executive Summary</label>
                        <textarea
                            rows="3"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            value={editForm.summary}
                            onChange={(e) => setEditForm({ ...editForm, summary: e.target.value })}
                        ></textarea>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Conclusions</label>
                        <textarea
                            rows="3"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            value={editForm.conclusions}
                            onChange={(e) => setEditForm({ ...editForm, conclusions: e.target.value })}
                        ></textarea>
                    </div>
                    <div>
                        <label className="block  text-sm font-medium text-gray-700 mb-1">Recommendations</label>
                        <textarea
                            rows="3"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            value={editForm.recommendations}
                            onChange={(e) => setEditForm({ ...editForm, recommendations: e.target.value })}
                        ></textarea>
                    </div>
                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={reportLoading}
                            className="w-full bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
                        >
                            {reportLoading ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                    Regenerating...
                                </>
                            ) : (
                                'Update & Regenerate'
                            )}
                        </button>
                    </div>
                </form>
            </Modal>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-0">
                <div className="lg:col-span-3 h-full">
                    <PDFViewer
                        secureUrl={report.fileUrl}
                        signedUrl={report.signedUrl}
                        fileName={`Report_${id.slice(-6)}.pdf`}
                    />
                </div>

                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Metadata</h3>
                        <div className="space-y-4">
                            <div className="flex items-start space-x-3">
                                <Clock className="w-4 h-4 text-gray-400 mt-0.5" />
                                <div>
                                    <p className="text-xs text-gray-400 font-medium">Generated On</p>
                                    <p className="text-sm text-gray-700">{new Date(report.created_at).toLocaleString()}</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-3">
                                <UserIcon className="w-4 h-4 text-gray-400 mt-0.5" />
                                <div>
                                    <p className="text-xs text-gray-400 font-medium">Generated By</p>
                                    <p className="text-sm text-gray-700">{reportUser?.name || 'Unknown'}</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-3">
                                <Calendar className="w-4 h-4 text-gray-400 mt-0.5" />
                                <div>
                                    <p className="text-xs text-gray-400 font-medium">Project ID</p>
                                    <p className="text-sm text-gray-700 font-mono text-xs">{report.projectid}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                        <h3 className="text-sm font-bold text-blue-900 uppercase tracking-wider mb-2">Summary</h3>
                        <p className="text-sm text-blue-800 leading-relaxed">
                            {report.summary}
                        </p>
                    </div>

                    {report.conclusions && (
                        <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2">Conclusions</h3>
                            <p className="text-sm text-gray-700 leading-relaxed">
                                {report.conclusions}
                            </p>
                        </div>
                    )}

                    {report.recommendations && (
                        <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2">Recommendations</h3>
                            <p className="text-sm text-gray-700 leading-relaxed">
                                {report.recommendations}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReportViewerPage;
