import React, { useState, useEffect } from 'react';
import { XMarkIcon, ExportIcon, MagnifyingGlassIcon } from '../../icons';

const DocumentViewer = ({ isOpen, onClose, documentUrl, documentName, documentType = 'pdf' }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    if (isOpen && documentUrl) {
      setIsLoading(true);
      setError(null);
    }
  }, [isOpen, documentUrl]);

  const handleLoad = () => {
    setIsLoading(false);
    setError(null);
  };

  const handleError = () => {
    setIsLoading(false);
    setError('Failed to load document');
  };

  const handleDownload = () => {
    if (documentUrl) {
      const link = document.createElement('a');
      link.href = documentUrl;
      link.download = documentName || 'document';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 25, 300));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 25, 50));
  };

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const resetView = () => {
    setZoom(100);
    setRotation(0);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-6xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <h3 className="text-xl font-semibold text-gray-800">
              {documentName || 'Document Viewer'}
            </h3>
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-sm rounded">
              {documentType.toUpperCase()}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              title="Download"
            >
              <ExportIcon className="h-5 w-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-2">
            <button
              onClick={handleZoomOut}
              className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
            >
              Zoom Out
            </button>
            <span className="px-3 py-1 text-sm bg-white border border-gray-300 rounded min-w-[60px] text-center">
              {zoom}%
            </span>
            <button
              onClick={handleZoomIn}
              className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
            >
              Zoom In
            </button>
            <button
              onClick={handleRotate}
              className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
            >
              Rotate
            </button>
            <button
              onClick={resetView}
              className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
            >
              Reset
            </button>
          </div>
          <div className="flex items-center gap-2">
            <MagnifyingGlassIcon className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">Use mouse wheel to zoom</span>
          </div>
        </div>

        {/* Document Content */}
        <div className="flex-1 overflow-hidden relative">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
              <div className="flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-700"></div>
                <p className="text-gray-600">Loading document...</p>
              </div>
            </div>
          )}

          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <div className="text-red-500 text-6xl mb-4">⚠️</div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Document Error</h3>
                <p className="text-gray-600 mb-4">{error}</p>
                <button
                  onClick={() => window.open(documentUrl, '_blank')}
                  className="px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  Open in New Tab
                </button>
              </div>
            </div>
          )}

          <div 
            className="w-full h-full overflow-auto bg-gray-100"
            style={{ 
              transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
              transformOrigin: 'top left'
            }}
          >
            {documentType === 'pdf' ? (
              <iframe
                src={documentUrl}
                className="w-full h-full border-0"
                onLoad={handleLoad}
                onError={handleError}
                title={documentName}
              />
            ) : (
              <img
                src={documentUrl}
                alt={documentName}
                className="w-full h-auto"
                onLoad={handleLoad}
                onError={handleError}
                style={{ 
                  maxWidth: 'none',
                  height: 'auto'
                }}
              />
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-between items-center text-sm text-gray-600">
            <span>Document: {documentName || 'Unknown'}</span>
            <span>URL: {documentUrl}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentViewer;
