import { useState } from 'react';
import { ref, uploadBytesResumable, getDownloadURL, listAll } from 'firebase/storage';
import { storage } from './firebase';
import './fileUpload.css';

function FileUpload({refreshFiles}) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);

  // Handle file selection
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setError(null);
    }
  };

  // Handle file upload
  const handleUpload = async () => {
    if (!selectedFile) {
        setError('Please select a file first');
        return;
    }

    setIsUploading(true);
    setError(null);

    try {
        const originalName = selectedFile.name;
        const nameWithoutExtension = originalName.substring(0, originalName.lastIndexOf(".")) || originalName;
        const extension = originalName.split('.').pop();

        let fileName = originalName;
        let counter = 1;

        // Check if file already exists in Firebase Storage
        const storageRef = ref(storage, 'uploads');
        const result = await listAll(storageRef);
        const existingFiles = result.items.map(item => item.name);

        // If file already exists, find the next available numbered filename
        while (existingFiles.includes(fileName)) {
            fileName = `${nameWithoutExtension}(${counter}).${extension}`;
            counter++;
        }

        // Full path for Firebase upload
        const filePath = `uploads/${fileName}`;

        // Upload file with unique name
        const fileRef = ref(storage, filePath);
        const uploadTask = uploadBytesResumable(fileRef, selectedFile);

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
                    const downloadUrl = await getDownloadURL(fileRef);

                    // Important: Save just the filename, not the full path
                    const fileData = {
                        file_name: fileName, // Save just the filename
                        firebase_url: downloadUrl,
                        mime_type: selectedFile.type,
                    };

                    console.log('Saving metadata for file:', fileName);

                    const response = await fetch('http://localhost:3001/api/file', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(fileData),
                    });

                    if (!response.ok) throw new Error('Failed to save file metadata');

                    const responseData = await response.json();
                    console.log('File metadata saved:', responseData);

                    setIsUploading(false);
                    setUploadProgress(0);
                    setSelectedFile(null);
                    
                    // Give a small delay to ensure database is updated
                    setTimeout(() => {
                        refreshFiles(); // Refresh file list after upload
                    }, 500);
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