import { useState } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from './firebase';
import './fileUpload.css';

function FileUpload() {
  // State for managing the selected file and upload process
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  
  // State for managing the uploaded file's information
  const [uploadedFile, setUploadedFile] = useState(null);
  const [fileUrl, setFileUrl] = useState('');
  const [error, setError] = useState(null);

  // Handle file selection from input
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setError(null); // Clear any previous errors
    }
  };

const handleUpload = async () => {
  if (!selectedFile) {
    setError('Please select a file first');
    return;
  }

  setIsUploading(true);
  setError(null);

  try {
    // Create a unique file path in Firebase Storage
    const filePath = `uploads/${selectedFile.name}-${Date.now()}`;
    const storageRef = ref(storage, filePath);

    // Start the upload task
    const uploadTask = uploadBytesResumable(storageRef, selectedFile);

    // Monitor the upload progress
    uploadTask.on(
      'state_changed',
      // Progress callback
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },
      // Error callback
      (error) => {
        console.error('Upload error:', error);
        setError('Failed to upload file');
        setIsUploading(false);
      },
      // Completion callback
      async () => {
        try {
          // Get the download URL once upload is complete
          const downloadUrl = await getDownloadURL(storageRef);

          // Store the uploaded file information
          const fileData = {
            name: selectedFile.name,
            path: filePath,
            type: selectedFile.type,
            size: selectedFile.size,
            url: downloadUrl
          };

          // Make API call to save file metadata
          const response = await fetch('/api/files', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(fileData)
          });

          if (!response.ok) {
            throw new Error('Failed to save file metadata');
          }

          // Update state with file information
          setUploadedFile(fileData);
          setFileUrl(downloadUrl);
          setIsUploading(false);
          setUploadProgress(0);
          setSelectedFile(null); // Reset file input
          
        } catch (err) {
          console.error('Error getting download URL or saving metadata:', err);
          setError('Failed to process uploaded file');
          setIsUploading(false);
        }
      }
    );
  } catch (err) {
    console.error('Upload setup error:', err);
    setError('Failed to start upload');
    setIsUploading(false);
  }
};

  // Render file preview based on file type
  const renderFilePreview = () => {
    if (!fileUrl) return null;

    if (uploadedFile?.type?.startsWith('image/')) {
      return <img src={fileUrl} alt={uploadedFile.name} className="file-preview-image" />;
    }

    return (
      <div className="file-download-link">
        <a href={fileUrl} target="_blank" rel="noopener noreferrer">
          View {uploadedFile.name}
        </a>
      </div>
    );
  };

  return (
    <div className="file-upload-view">
      {/* File Upload Section */}
      <div className="upload-section">
        <input
          type="file"
          onChange={handleFileSelect}
          className="file-input"
          disabled={isUploading}
        />
        
        <button
          onClick={handleUpload}
          disabled={!selectedFile || isUploading}
          className="upload-button"
        >
          {isUploading ? 'Uploading...' : 'Upload File'}
        </button>

        {/* Upload Progress Indicator */}
        {isUploading && (
          <div className="progress-bar-container">
            <div 
              className="progress-bar"
              style={{ width: `${uploadProgress}%` }}
            />
            <span className="progress-text">{Math.round(uploadProgress)}%</span>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
      </div>

      {/* File Preview Section */}
      {uploadedFile && (
        <div className="preview-section">
          <h3>Uploaded File</h3>
          <div className="file-info">
            <p>Name: {uploadedFile.name}</p>
            <p>Size: {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB</p>
          </div>
          {renderFilePreview()}
        </div>
      )}
      <div className="file-grid">
        <div className="file-grid-item">File 1</div>
        <div className="file-grid-item">File 2</div>
        <div className="file-grid-item">File 3</div>

      </div>
    </div>
  );
}

export default FileUpload;