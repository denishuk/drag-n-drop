import { FileError, UploadedFile } from '@/components/FileUpload/types.ts';
import FileUpload from '@/components/FileUpload.tsx';


function App() {
  const handleFileUpload = (files: UploadedFile[]) => {
    console.log('Files uploaded:', files);
  };

  const handleFileRemove = (fileId: string) => {
    console.log('File removed:', fileId);
  };

  const handleFileError = (error: FileError) => {
    console.error('Upload error:', error);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <FileUpload
        acceptedTypes={[ 'image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ]}
        maxFileSize={10 * 1024 * 1024} // 10MB
        maxFiles={10}
        showPreviews={true}
        allowMultiple={true}
        onFileUpload={handleFileUpload}
        onFileRemove={handleFileRemove}
        onFileError={handleFileError}
      />
    </div>
  );
}

export default App;
