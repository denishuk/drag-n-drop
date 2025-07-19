import { FileError, UploadedFile } from './types';

export const formatFileSize = (bytes: number): string => {
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(1)} MB`;
};

export const getFileIcon = (type: string) => {
  if (type.startsWith('image/')) return 'image';
  if (type === 'application/pdf') return 'file-text';
  if (type.includes('document') || type.includes('msword')) return 'file-text';
  if (type.includes('spreadsheet') || type.includes('excel')) return 'file-spreadsheet';
  if (type.includes('presentation') || type.includes('powerpoint')) return 'file-presentation';
  return 'file';
};

export const getFileIconColor = (type: string) => {
  if (type.startsWith('image/')) return 'text-blue-600 bg-blue-100';
  if (type === 'application/pdf') return 'text-red-600 bg-red-100';
  if (type.includes('document') || type.includes('msword')) return 'text-blue-600 bg-blue-100';
  if (type.includes('spreadsheet') || type.includes('excel')) return 'text-green-600 bg-green-100';
  if (type.includes('presentation') || type.includes('powerpoint')) return 'text-orange-600 bg-orange-100';
  return 'text-gray-600 bg-gray-100';
};

export const validateFile = (
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

export const createFilePreview = (file: File): Promise<string | undefined> => {
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

export const simulateUpload = (file: UploadedFile, onProgress: (fileId: string, progress: number) => void): Promise<void> => {
  return new Promise((resolve) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15 + 5; // Random progress between 5-20%
      
      if (progress >= 100) {
        progress = 100;
        onProgress(file.id, progress);
        clearInterval(interval);
        resolve();
      } else {
        onProgress(file.id, progress);
      }
    }, 200 + Math.random() * 300); // Random interval between 200-500ms
  });
};

export const getTimeAgo = (timestamp: number): string => {
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
