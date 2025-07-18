import React, { useState, useCallback, useRef } from 'react';
import { 
  UploadCloud, 
  X, 
  Eye, 
  Download, 
  CheckCircle, 
  AlertCircle,
  Image,
  FileText,
  File
} from 'lucide-react';

// Types
export interface FileUploadProps {
  acceptedTypes?: string[];
  maxFileSize?: number;
  maxFiles?: number;
  onFileUpload?: (files: UploadedFile[]) => void;
  onFileRemove?: (fileId: string) => void;
  onFileError?: (error: FileError) => void;
  className?: string;
  disabled?: boolean;
  allowMultiple?: boolean;
}

export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  lastModified: number;
  uploadProgress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  preview?: string;
  error?: string;
  file?: File;
}

export interface FileError {
  type: 'size' | 'type' | 'count' | 'general';
  message: string;
  fileName?: string;
}

// Utilities
const formatFileSize = (bytes: number): string => {
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(1)} MB`;
};

const getFileIcon = (type: string) => {
  if (type.startsWith('image/')) return Image;
  if (type === 'application/pdf') return FileText;
  if (type.includes('document') || type.includes('msword')) return FileText;
  return File;
};

const getFileIconColor = (type: string) => {
  if (type.startsWith('image/')) return 'text-blue-600 bg-blue-100';
  if (type === 'application/pdf') return 'text-red-600 bg-red-100';
  if (type.includes('document') || type.includes('msword')) return 'text-blue-600 bg-blue-100';
  return 'text-gray-600 bg-gray-100';
};

const validateFile = (
  file: File,
  acceptedTypes: string[],
  maxFileSize: number
): FileError | null => {
  if (acceptedTypes.length > 0 && !acceptedTypes.includes(file.type)) {
    return {
      type: 'type',
      message: `File type ${file.type} is not supported. Supported types: ${acceptedTypes.join(', ')}`,
      fileName: file.name
    };
  }

  if (file.size > maxFileSize) {
    return {
      type: 'size',
      message: `File size ${formatFileSize(file.size)} exceeds maximum allowed size of ${formatFileSize(maxFileSize)}`,
      fileName: file.name
    };
  }

  return null;
};

const createFilePreview = (file: File): Promise<string | undefined> => {
  return new Promise((resolve) => {
    if (!file.type.startsWith('image/')) {
      resolve(undefined);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      resolve(e.target?.result as string);
    };
    reader.onerror = () => {
      resolve(undefined);
    };
    reader.readAsDataURL(file);
  });
};

const simulateUpload = (file: UploadedFile, onProgress: (fileId: string, progress: number) => void): Promise<void> => {
  return new Promise((resolve) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15 + 5;
      
      if (progress >= 100) {
        progress = 100;
        onProgress(file.id, progress);
        clearInterval(interval);
        resolve();
      } else {
        onProgress(file.id, progress);
      }
    }, 200 + Math.random() * 300);
  });
};

const getTimeAgo = (timestamp: number): string => {
  const now = Date.now();
  const diff = now - timestamp;
  
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (minutes < 60) {
    return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
  }
  if (hours < 24) {
    return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  }
  return `${days} ${days === 1 ? 'day' : 'days'} ago`;
};

// Default props
const defaultProps: Partial<FileUploadProps> = {
  acceptedTypes: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  maxFileSize: 10 * 1024 * 1024, // 10MB
  maxFiles: 10,
  allowMultiple: true,
  disabled: false,
};

// Main Component
const FileUpload: React.FC<FileUploadProps> = (props) => {
  const {
    acceptedTypes = defaultProps.acceptedTypes!,
    maxFileSize = defaultProps.maxFileSize!,
    maxFiles = defaultProps.maxFiles!,
    onFileUpload,
    onFileRemove,
    onFileError,
    className = '',
    disabled = defaultProps.disabled!,
    allowMultiple = defaultProps.allowMultiple!,
  } = props;

  const [uploadQueue, setUploadQueue] = useState<UploadedFile[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [errors, setErrors] = useState<FileError[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const newErrors: FileError[] = [];

    // Check file count limit
    if (uploadQueue.length + uploadedFiles.length + fileArray.length > maxFiles) {
      newErrors.push({
        type: 'count',
        message: `Maximum ${maxFiles} files allowed. Currently have ${uploadQueue.length + uploadedFiles.length} files.`
      });
      setErrors(newErrors);
      onFileError?.(newErrors[0]);
      return;
    }

    const validFiles: File[] = [];
    
    for (const file of fileArray) {
      const error = validateFile(file, acceptedTypes, maxFileSize);
      if (error) {
        newErrors.push(error);
      } else {
        validFiles.push(file);
      }
    }

    if (newErrors.length > 0) {
      setErrors(newErrors);
      onFileError?.(newErrors[0]);
    }

    // Process valid files
    const newQueueItems: UploadedFile[] = [];
    
    for (const file of validFiles) {
      const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const preview = await createFilePreview(file);
      
      const queueItem: UploadedFile = {
        id,
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified,
        uploadProgress: 0,
        status: 'pending',
        preview,
        file,
      };

      newQueueItems.push(queueItem);
    }

    setUploadQueue(prev => [...prev, ...newQueueItems]);

    // Start uploading files
    for (const queueItem of newQueueItems) {
      uploadFile(queueItem);
    }
  };

  const uploadFile = async (queueItem: UploadedFile) => {
    // Update status to uploading
    setUploadQueue(prev => prev.map(item => 
      item.id === queueItem.id 
        ? { ...item, status: 'uploading' as const }
        : item
    ));

    try {
      await simulateUpload(queueItem, (fileId, progress) => {
        setUploadQueue(prev => prev.map(item =>
          item.id === fileId
            ? { ...item, uploadProgress: progress }
            : item
        ));
      });

      // Move to uploaded files
      const uploadedFile: UploadedFile = {
        ...queueItem,
        status: 'success',
        uploadProgress: 100,
        lastModified: Date.now()
      };

      setUploadedFiles(prev => [...prev, uploadedFile]);
      setUploadQueue(prev => prev.filter(item => item.id !== queueItem.id));
      
      onFileUpload?.([uploadedFile]);
    } catch (error) {
      setUploadQueue(prev => prev.map(item =>
        item.id === queueItem.id
          ? { ...item, status: 'error' as const, error: 'Upload failed' }
          : item
      ));
    }
  };

  const removeFromQueue = (fileId: string) => {
    setUploadQueue(prev => prev.filter(item => item.id !== fileId));
    onFileRemove?.(fileId);
  };

  const removeUploadedFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(item => item.id !== fileId));
    onFileRemove?.(fileId);
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragOver(true);
    }
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragOver(false);
    }
  }, [disabled]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (disabled) return;

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFiles(files);
    }
  }, [disabled, handleFiles]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleViewFile = (file: UploadedFile) => {
    if (file.preview) {
      window.open(file.preview, '_blank');
    }
  };

  const handleDownloadFile = (file: UploadedFile) => {
    if (file.file) {
      const url = URL.createObjectURL(file.file);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const renderFileIcon = (file: UploadedFile, size: 'sm' | 'md' = 'md') => {
    const IconComponent = getFileIcon(file.type);
    const colorClass = getFileIconColor(file.type);
    const iconSize = size === 'sm' ? 'w-5 h-5' : 'w-6 h-6';
    const containerSize = size === 'sm' ? 'w-10 h-10' : 'w-12 h-12';

    return (
      <div className={`${containerSize} ${colorClass} rounded-lg flex items-center justify-center`}>
        <IconComponent className={iconSize} />
      </div>
    );
  };

  const getAcceptedTypesDisplay = () => {
    const typeNames = acceptedTypes.map(type => {
      if (type.startsWith('image/')) return type.split('/')[1].toUpperCase();
      if (type === 'application/pdf') return 'PDF';
      if (type.includes('document') || type.includes('msword')) return 'DOC';
      return type;
    });
    return typeNames.join(', ');
  };

  return (
    <div className={`container mx-auto px-4 py-8 max-w-6xl ${className}`}>
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">FileUpload Component</h1>
        <p className="text-lg text-gray-600">Drag and drop file uploader with TypeScript support</p>
      </div>

      {/* Error Messages */}
      {errors.length > 0 && (
        <div className="mb-6 space-y-2">
          {errors.map((error, index) => (
            <div key={index} className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
              <AlertCircle className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-red-800">{error.message}</p>
                {error.fileName && (
                  <p className="text-xs text-red-600 mt-1">File: {error.fileName}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Main Component */}
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Area */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-gray-900">Upload Files</h2>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <span>Max {formatFileSize(maxFileSize)} per file</span>
              </div>
            </div>

            {/* Drag and Drop Area */}
            <div
              className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 cursor-pointer ${
                isDragOver
                  ? 'border-blue-400 bg-blue-50'
                  : disabled
                  ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
                  : 'border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={handleClick}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple={allowMultiple}
                accept={acceptedTypes.join(',')}
                onChange={handleFileSelect}
                className="hidden"
                disabled={disabled}
              />
              
              <div className="space-y-4">
                <div className="flex justify-center">
                  <div className="bg-blue-100 p-4 rounded-full">
                    <UploadCloud className="w-8 h-8 text-blue-600" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Drop files here</h3>
                  <p className="text-gray-600 mb-4">or click to select files</p>
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={disabled}
                  >
                    Browse Files
                  </button>
                </div>
                <div className="text-xs text-gray-500">
                  Supported: {getAcceptedTypesDisplay()} (up to {formatFileSize(maxFileSize)} each)
                </div>
              </div>
            </div>

            {/* Upload Queue */}
            {uploadQueue.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Upload Queue</h3>
                  <span className="text-sm text-gray-500">{uploadQueue.length} files</span>
                </div>

                {uploadQueue.map((file) => (
                  <div key={file.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        {renderFileIcon(file)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                        <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {file.status === 'uploading' && (
                          <>
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full transition-all duration-200"
                                style={{ width: `${file.uploadProgress}%` }}
                              />
                            </div>
                            <span className="text-sm text-gray-500">{Math.round(file.uploadProgress)}%</span>
                          </>
                        )}
                        {file.status === 'error' && (
                          <span className="text-sm text-red-600">Error</span>
                        )}
                        {file.status === 'pending' && (
                          <span className="text-sm text-gray-500">Pending</span>
                        )}
                        <button
                          onClick={() => removeFromQueue(file.id)}
                          className="text-gray-400 hover:text-red-500 p-1"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Uploaded Files Panel */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-gray-900">Uploaded Files</h2>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>{uploadedFiles.length} files uploaded</span>
              </div>
            </div>

            {/* Uploaded Files List */}
            <div className="space-y-3">
              {uploadedFiles.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No files uploaded yet</p>
                </div>
              ) : (
                uploadedFiles.map((file) => (
                  <div key={file.id} className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        {renderFileIcon(file, 'sm')}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                        <p className="text-sm text-gray-500">
                          {formatFileSize(file.size)} • Uploaded {getTimeAgo(file.lastModified)}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {file.preview && (
                          <button
                            onClick={() => handleViewFile(file)}
                            className="text-gray-400 hover:text-blue-500 p-1"
                            title="View file"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDownloadFile(file)}
                          className="text-gray-400 hover:text-green-500 p-1"
                          title="Download file"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => removeUploadedFile(file.id)}
                          className="text-gray-400 hover:text-red-500 p-1"
                          title="Remove file"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;