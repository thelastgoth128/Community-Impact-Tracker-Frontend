import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { motion } from 'framer-motion';
import { Download, AlertCircle, Loader2, FileText, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Set up the worker for react-pdf
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const PDFViewer = ({ secureUrl, signedUrl, fileName }) => {
    const [numPages, setNumPages] = useState(null);
    const [url, setUrl] = useState(secureUrl);
    const [hasError, setHasError] = useState(false);
    const [scale, setScale] = useState(1.0);
    const [containerWidth, setContainerWidth] = useState(null);

    useEffect(() => {
        // Reset state when url changes
        setNumPages(null);
        setHasError(false);
        setUrl(secureUrl);
    }, [secureUrl]);

    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
        setHasError(false);
    };

    const handleLoadError = () => {
        if (url === secureUrl && signedUrl) {
            setUrl(signedUrl);
        } else {
            setHasError(true);
        }
    };

    const handleDownload = async () => {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = blobUrl;
            link.setAttribute('download', fileName || 'document.pdf');
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (err) {
            window.open(url, '_blank');
        }
    };

    return (
        <div className="flex flex-col h-full bg-gray-100 rounded-xl overflow-hidden border border-gray-200">
            {/* Header / Controls */}
            <div className="bg-white border-b border-gray-200 p-4 flex justify-between items-center z-10 shadow-sm">
                <h3 className="text-sm font-semibold text-gray-700 flex items-center truncate max-w-50 sm:max-w-md">
                    <FileText className="w-4 h-4 mr-2 text-blue-600 shrink-0" />
                    <span className="truncate">{fileName || 'Report Preview'}</span>
                </h3>

                <div className="flex items-center space-x-2">
                    <div className="hidden sm:flex items-center bg-gray-100 rounded-lg p-1 mr-2">
                        <button
                            onClick={() => setScale(s => Math.max(s - 0.1, 0.5))}
                            className="p-1 hover:bg-white rounded transition-colors text-gray-600"
                            title="Zoom Out"
                        >
                            <ZoomOut className="w-4 h-4" />
                        </button>
                        <span className="text-xs font-medium w-12 text-center text-gray-600">{Math.round(scale * 100)}%</span>
                        <button
                            onClick={() => setScale(s => Math.min(s + 0.1, 2.0))}
                            className="p-1 hover:bg-white rounded transition-colors text-gray-600"
                            title="Zoom In"
                        >
                            <ZoomIn className="w-4 h-4" />
                        </button>
                    </div>

                    <button
                        onClick={handleDownload}
                        className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-1.5 rounded-lg hover:bg-blue-700 transition-colors text-xs font-bold shadow-sm"
                    >
                        <Download className="w-4 h-4" />
                        <span className="hidden sm:inline">Download PDF</span>
                    </button>
                </div>
            </div>

            {/* Viewer Area */}
            <div className="flex-1 relative overflow-auto bg-gray-50 flex justify-center p-4 sm:p-8">
                {hasError ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500 max-w-sm text-center">
                        <AlertCircle className="w-12 h-12 text-rose-500 mb-4" />
                        <p className="font-semibold text-gray-900">Unable to render preview</p>
                        <p className="text-sm mt-2 text-gray-500">The file might be restricted or corrupted.</p>
                        <button
                            onClick={handleDownload}
                            className="mt-6 text-blue-600 font-bold hover:underline flex items-center"
                        >
                            Download File Instead
                        </button>
                    </div>
                ) : (
                    <div
                        className="w-full max-w-4xl"
                        ref={(el) => setContainerWidth(el?.clientWidth)}
                    >
                        <Document
                            file={url}
                            onLoadSuccess={onDocumentLoadSuccess}
                            onLoadError={handleLoadError}
                            loading={
                                <div className="flex flex-col items-center justify-center py-20">
                                    <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
                                    <p className="text-sm text-gray-500 font-medium">Loading Document...</p>
                                </div>
                            }
                            error={
                                <div className="text-center py-10">
                                    <p className="text-rose-500 mb-2">Failed to load PDF.</p>
                                </div>
                            }
                            className="flex flex-col items-center gap-6"
                        >
                            {Array.from(new Array(numPages || 0), (el, index) => (
                                <motion.div
                                    key={`page_${index + 1}`}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="shadow-md rounded-sm overflow-hidden"
                                >
                                    <Page
                                        pageNumber={index + 1}
                                        width={containerWidth ? Math.min(containerWidth, 800) * scale : 600}
                                        renderAnnotationLayer={false}
                                        renderTextLayer={true}
                                        className="bg-white"
                                    />
                                </motion.div>
                            ))}
                        </Document>

                        {numPages && (
                            <div className="text-center mt-6 mb-4 text-xs text-gray-400 font-medium uppercase tracking-wider">
                                Showing {numPages} {numPages === 1 ? 'Page' : 'Pages'}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PDFViewer;
