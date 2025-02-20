import React, { useEffect, useState, useCallback } from 'react';
import { ref, listAll, getDownloadURL } from 'firebase/storage';
import { storage } from './firebase';
import FileUpload from './fileUpload'; 
import './fileView.css';

const FileView = () => {
    const [files, setFiles] = useState([]);

    // Function to fetch all files initially
     const fetchFiles = useCallback(async () => {
        const storageRef = ref(storage, '/uploads');
        const result = await listAll(storageRef);
        const filePromises = result.items.map(async (itemRef) => {
            const url = await getDownloadURL(itemRef);
            const extension = getFileExtension(itemRef.name);
            return { name: itemRef.name, url, extension };
        });
        const files = await Promise.all(filePromises);
        setFiles(files);
    }, []); // Empty dependency array means it won't change on re-renders

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
        console.log("Rendering file preview for:", file);

        // Image files
        if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) {
            return (
                <div className="file-preview">
                    <img src={url} alt={name} className="preview-image" />
                    <p>{name}</p>
                </div>
            );
        } 
        // PDF files
        else if (ext === 'pdf') {
            return (
                <div className="file-preview">
                    <iframe src={url} title={name} className="preview-pdf" />
                    <p>{name}</p>
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
                    <p>{name}</p>
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
                    <p>{name}</p>
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
                    <a href={url} target="_blank" rel="noopener noreferrer">
                        {name}
                    </a>
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
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FileView;