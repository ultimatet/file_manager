import React, { useEffect, useState, useCallback } from 'react';
import { ref, listAll, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './firebase';
import FileUpload from './fileUpload'; 
import './fileView.css';

const FileView = () => {
    const [files, setFiles] = useState([]);

    // Function to fetch all files initially
     const fetchFiles = useCallback(async () => {
    try {
        const storageRef = ref(storage, '/uploads');
        const result = await listAll(storageRef);

        // Fetch metadata from your backend
        const response = await fetch('http://localhost:3001/api/file'); 
        const fileMetadata = await response.json(); 

        const filePromises = result.items.map(async (itemRef) => {
            const url = await getDownloadURL(itemRef);
            const extension = getFileExtension(itemRef.name);

            // Match Firebase file with DB metadata
            const metadata = fileMetadata.find(meta => meta.file_name === itemRef.name);
            if (!metadata) {
                console.warn(`No metadata found for ${itemRef.name}`);
}

            return {
                name: itemRef.name,
                url,
                extension,
                file_id: metadata ? metadata.file_id : null, // Get file_id from DB
            };
        });

        const files = await Promise.all(filePromises);
        setFiles(files);
    } catch (error) {
        console.error("Error fetching files:", error);
    }
}, []);
 // Empty dependency array means it won't change on re-renders

    const deleteFile = async (file) => {
        try {
            if (!file.file_id) {
                console.error("Cannot delete file: Missing file_id", file);
                return;
            }
            const storageRef = ref(storage, `uploads/${file.name}`);
            await deleteObject(storageRef);
            const response = await fetch(`http://localhost:3001/api/file/${file.file_id}`, {
                        method: 'DELETE',
                    });
            if (!response.ok) throw new Error('Failed to delete file metadata');
            if (response.ok) {
                console.log('File deleted successfully:', file);
                setFiles(files.filter(f => f !== file));
            }
            fetchFiles();
        } catch(err) {
            console.error('Failed to delete file:', err);
        }
    };

    useEffect(() => {
        fetchFiles(); 
    }, [fetchFiles]); // Fetch files on initial render

    const getFileExtension = (filename) => {
        const mainNameParts = filename.split('-');
        const nameWithoutTimestamp = mainNameParts[0];
        const parts = nameWithoutTimestamp.split('.');
        return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : '';
    };
    // Function to render preview based on file extension
    const renderFilePreview = (file) => {
        const { url, name } = file;
        const ext = name.split('.').pop().toLowerCase();

        // Image files
        if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) {
            return (
                <div className="file-preview">
                    <img src={url} alt={name} className="preview-image" />
                </div>
            );
        } 
        // PDF files
        else if (ext === 'pdf') {
            return (
                <div className="file-preview">
                    <iframe src={url} title={name} className="preview-pdf"  />
                </div>
            );
        }
        // Video files
        else if (['mp4', 'webm', 'ogg'].includes(ext)) {
            return (
                <div className="file-preview">
                    <video controls className="preview-video">
                        <source src={url} />
                        Your browser does not support video playback.
                    </video>
                </div>
            );
        }
        // Audio files
        else if (['mp3', 'wav', 'ogg'].includes(ext)) {
            return (
                <div className="file-preview">
                    <audio controls className="preview-audio">
                        <source src={url} />
                        Your browser does not support audio playback.
                    </audio>
                </div>
            );
        }
        // Default for other file types
        else {
            return (
                <div className="file-preview">
                    <div className="generic-file-icon">
                        <i className="file-icon">📄</i>
                    </div>
                </div>
            );
        }
    };

    return (
        <div className="file-view-container">
            <FileUpload refreshFiles={fetchFiles} />
            <h1>Uploaded Files</h1>  
            <button onClick={fetchFiles} className="refresh-button">Refresh Files</button>
            
            {files.length === 0 ? (
                <p>No files found. Upload some files or click Refresh.</p>
            ) : (
                <div className="file-grid">
                    {files.map((file, index) => (
                        <div className="file-card" key={index}>
                            {renderFilePreview(file)}
                            <a href={file.url} target="_blank" rel="noopener noreferrer"> {file.name} </a>
                            <button onClick={() => deleteFile(file)}>Delete</button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FileView;