import React, { useEffect, useState } from 'react';
import { ref, listAll, getDownloadURL } from 'firebase/storage';
import { storage } from './firebase';

const FileView = () => {
    const [files, setFiles] = useState([]);

    // Function to fetch all files initially
    const fetchFiles = async () => {
        const storageRef = ref(storage, '/uploads');
        const result = await listAll(storageRef);
        const filePromises = result.items.map(async (itemRef) => {
            const url = await getDownloadURL(itemRef);
            return { name: itemRef.name, url };
        });
        const files = await Promise.all(filePromises);
        setFiles(files);
    };
useEffect(() => {
    fetchFiles();
}, []);


    return (
        <div>
            <h1>Uploaded Files</h1>
            <button onClick={fetchFiles}>Refresh Files</button>
            <ul>
                {files.map((file, index) => (
                    <li key={index}>
                        <a href={file.url} target="_blank" rel="noopener noreferrer">
                            {file.name}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default FileView;
