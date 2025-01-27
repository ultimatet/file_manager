import './fileView.css';
import { storage } from './firebase';
import { ref, getDownloadURL } from 'firebase/storage';
import { useState, useEffect } from 'react';
 
function FileView({file}) {
    const fileUpload = {
        const { fileUpload, setFileUpload } = useState(null);
            
    };
    return (
        <div className="file-view">
            <h3>{file.name}</h3>
            <p>{file.content}</p>
        </div>
    );
}