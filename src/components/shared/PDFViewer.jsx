import React, { useState } from 'react';
import { Download, AlertCircle, Loader2 } from 'lucide-react';

const PDFViewer = ({ secureUrl, signedUrl, fileName }) => {
    const [url, setUrl] = useState(secureUrl);
    const [hasError, setHasError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const handleLoadError = () => {
        if (url === secureUrl && signedUrl) {
            setUrl(signedUrl);
        } else {
            setHasError(true);
        }
        setIsLoading(false);
    };

    const handleDownload = () => {
        window.open(url, '_blank');
    };

    return (
        <div className="flex flex-col h-full bg-gray-100 rounded-xl overflow-hidden border border-gray-200">
            <div className="bg-white border-b border-gray-200 p-4 flex justify-between items-center">
                <h3 className="text-sm font-semibold text-gray-700 flex items-center">
                    <FileText className="w-4 h-4 mr-2 text-blue-600" />
                    {fileName || 'Report Preview'}
                </h3>
                <button
                    onClick={handleDownload}
                    className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-1.5 rounded-lg hover:bg-blue-700 transition-colors text-xs font-bold"
                >
                    <Download className="w-4 h-4" />
                    <span>Download PDF</span>
                </button>
            </div>

            <div className="flex-1 relative">
                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10">
                        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                    </div>
                )}

                {hasError ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500 p-8 text-center">
                        <AlertCircle className="w-12 h-12 text-rose-500 mb-4" />
                        <p className="font-semibold text-gray-900">Unable to load preview</p>
                        <p className="text-sm mt-2">The direct link failed. Please try downloading the file instead.</p>
                        <button
                            onClick={handleDownload}
                            className="mt-6 text-blue-600 font-bold hover:underline"
                        >
                            Download Report
                        </button>
                    </div>
                ) : (
                    <iframe
                        src={`${url}#toolbar=0`}
                        className="w-full h-full border-none"
                        onLoad={() => setIsLoading(false)}
                        onError={handleLoadError}
                        title="PDF Preview"
                    />
                )}
            </div>
        </div>
    );
};

import { FileText } from 'lucide-react';
export default PDFViewer;
