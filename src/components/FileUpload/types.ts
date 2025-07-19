export interface FileUploadProps {
  acceptedTypes?: string[];
  maxFileSize?: number;
  maxFiles?: number;
  onFileUpload?: (files: UploadedFile[]) => void;
  onFileRemove?: (fileId: string) => void;
  onFileError?: (error: FileError) => void;
  className?: string;
  disabled?: boolean;
  showPreviews?: boolean;
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

export interface FileQueueItem extends UploadedFile {
  uploadStartTime?: number;
}
