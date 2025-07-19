# FileUpload Component

A modern, standalone React drag-and-drop file upload component with TypeScript support, built with TailwindCSS and Lucide React icons.

## Features

- ✅ **Drag and Drop Interface** - Intuitive drag-and-drop with visual feedback
- ✅ **File Type Validation** - Configurable file type restrictions
- ✅ **File Size Validation** - Configurable maximum file size limits
- ✅ **Progress Tracking** - Real-time upload progress indicators
- ✅ **File Management** - View, download, and delete uploaded files
- ✅ **TypeScript Support** - Full TypeScript interfaces and type safety
- ✅ **Responsive Design** - Works on desktop and mobile devices
- ✅ **Accessibility** - ARIA labels and keyboard navigation support
- ✅ **Error Handling** - Comprehensive error messages and validation
- ✅ **Minimal Dependencies** - Only requires React and Lucide React icons

## Installation

```bash
npm install @your-org/file-upload
# or
yarn add @your-org/file-upload
```

### Dependencies

This component has minimal dependencies:

```json
{
  "peerDependencies": {
    "react": ">=18.0.0",
    "react-dom": ">=18.0.0"
  },
  "dependencies": {
    "lucide-react": "^0.453.0"
  }
}
```

## Usage

### Basic Usage

```tsx
import React from 'react';
import FileUpload from '@your-org/file-upload';

const App: React.FC = () => {
  const handleFileUpload = (files) => {
    console.log('Files uploaded:', files);
  };

  const handleFileError = (error) => {
    console.error('Upload error:', error);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <FileUpload
        onFileUpload={handleFileUpload}
        onFileError={handleFileError}
      />
    </div>
  );
};
```

### Advanced Configuration

```tsx
import React from 'react';
import FileUpload, { UploadedFile, FileError } from '@your-org/file-upload';

const App: React.FC = () => {
  const handleFileUpload = (files: UploadedFile[]) => {
    console.log('Files uploaded:', files);
    // Handle successful uploads
  };

  const handleFileRemove = (fileId: string) => {
    console.log('File removed:', fileId);
    // Handle file removal
  };

  const handleFileError = (error: FileError) => {
    console.error('Upload error:', error);
    // Handle upload errors
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <FileUpload
        acceptedTypes={[
          'image/jpeg',
          'image/png',
          'image/gif',
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ]}
        maxFileSize={10 * 1024 * 1024} // 10MB
        maxFiles={5}
        allowMultiple={true}
        disabled={false}
        onFileUpload={handleFileUpload}
        onFileRemove={handleFileRemove}
        onFileError={handleFileError}
        className="custom-upload-container"
      />
    </div>
  );
};
```

## Props

### FileUploadProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `acceptedTypes` | `string[]` | `['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']` | MIME types of files to accept |
| `maxFileSize` | `number` | `10485760` (10MB) | Maximum file size in bytes |
| `maxFiles` | `number` | `10` | Maximum number of files allowed |
| `allowMultiple` | `boolean` | `true` | Allow multiple file selection |
| `disabled` | `boolean` | `false` | Disable the upload component |
| `className` | `string` | `''` | Additional CSS classes |
| `onFileUpload` | `(files: UploadedFile[]) => void` | `undefined` | Callback when files are uploaded |
| `onFileRemove` | `(fileId: string) => void` | `undefined` | Callback when files are removed |
| `onFileError` | `(error: FileError) => void` | `undefined` | Callback when errors occur |

## Types

### UploadedFile

```typescript
interface UploadedFile {
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
```

### FileError

```typescript
interface FileError {
  type: 'size' | 'type' | 'count' | 'general';
  message: string;
  fileName?: string;
}
```

## Styling

This component uses TailwindCSS for styling. Make sure you have TailwindCSS installed and configured in your project.

### Required TailwindCSS Classes

The component uses standard TailwindCSS classes. No custom CSS is required.

### Customization

You can customize the appearance by:

1. **Overriding CSS classes** - Pass custom classes through the `className` prop
2. **Modifying TailwindCSS theme** - Adjust colors, spacing, etc. in your `tailwind.config.js`
3. **CSS-in-JS** - Use styled-components or emotion for more complex styling

## Examples

### Image Upload Only

```tsx
<FileUpload
  acceptedTypes={['image/jpeg', 'image/png', 'image/gif']}
  maxFileSize={5 * 1024 * 1024} // 5MB
  maxFiles={3}
  onFileUpload={(files) => console.log('Images:', files)}
/>
```

### Document Upload Only

```tsx
<FileUpload
  acceptedTypes={[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]}
  maxFileSize={20 * 1024 * 1024} // 20MB
  maxFiles={1}
  allowMultiple={false}
  onFileUpload={(files) => console.log('Documents:', files)}
/>
```

### Single File Upload

```tsx
<FileUpload
  maxFiles={1}
  allowMultiple={false}
  onFileUpload={(files) => console.log('Single file:', files[0])}
/>
```

## Development

### Building the Component

```bash
npm install
npm run build
```

### Running Development Server

```bash
npm run dev
```

### File Structure

```
src/
├── FileUpload.tsx      # Main component
├── Demo.tsx           # Demo component
└── index.ts           # Export file
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

- Create an issue on GitHub
- Check existing issues for solutions
- Review the documentation

## Changelog

### v1.0.0
- Initial release
- Drag and drop functionality
- File type validation
- Progress tracking
- TypeScript support
- Responsive design