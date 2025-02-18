import { useState, useEffect } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from './firebase';
import './fileUpload.css';

function FileUpload() {
  // State for managing the selected file and upload process
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  
  // State for managing uploaded files
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [error, setError] = useState(null);

  // Handle file selection
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setError(null);
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
      const filePath = `uploads/${selectedFile.name}-${Date.now()}`;
      const storageRef = ref(storage, filePath);

      const uploadTask = uploadBytesResumable(storageRef, selectedFile);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => {
          console.error('Upload error:', error);
          setError('Failed to upload file');
          setIsUploading(false);
        },
        async () => {
          try {
            const downloadUrl = await getDownloadURL(storageRef);

            const fileData = {
              file_name: selectedFile.name,
              firebase_url: downloadUrl,
              mime_type: selectedFile.type,
            };

            const response = await fetch('http://localhost:3001/api/file', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(fileData),
            });

            if (!response.ok) throw new Error('Failed to save file metadata');

            setIsUploading(false);
            setUploadProgress(0);
            setSelectedFile(null);

          } catch (err) {
            console.error('Error processing uploaded file:', err);
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
  const renderFilePreview = (file) => {
    if (!file.url) return null;

    if (file.type.startsWith('image/')) {
      return <img src={file.url} alt={file.name} className="file-preview-image" />;
    }

    return (
      <div className="file-download-link">
        <a href={file.url} target="_blank" rel="noopener noreferrer">
          {file.name} (Download)
        </a>
      </div>
    );
  };

  return (
    <div className="file-upload-view">
      <div className="upload-section">
        <input type="file" onChange={handleFileSelect} className="file-input" disabled={isUploading} />
        
        <button onClick={handleUpload} disabled={!selectedFile || isUploading} className="upload-button">
          {isUploading ? 'Uploading...' : 'Upload File'}
        </button>

        {isUploading && (
          <div className="progress-bar-container">
            <div className="progress-bar" style={{ width: `${uploadProgress}%` }} />
            <span className="progress-text">{Math.round(uploadProgress)}%</span>
          </div>
        )}

        {error && <div className="error-message">{error}</div>}
      </div>

    </div>
  );
}

export default FileUpload;
