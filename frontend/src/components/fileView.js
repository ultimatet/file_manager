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
        fetchFiles(); // Initial fetch

        // Set up WebSocket connection
        const socket = new WebSocket('ws://localhost:3000');

        socket.onopen = () => {
            console.log('WebSocket Connected');
        };

        socket.onmessage = async (event) => {
            await fetchFiles();
            console.log('WebSocket message event:', event);
            const data = JSON.parse(event.data);
            console.log('WebSocket message received:', data);

            if (data.action === 'insert') {
                console.log('Adding new file:', data.file);
                setFiles((prevFiles) => [...prevFiles, data.file]); // Add new file
            } else if (data.action === 'update') {
                console.log('Updating file:', data.file);
                setFiles((prevFiles) =>
                    prevFiles.map((file) =>
                        file.name === data.file.name ? { ...file, url: data.file.url } : file
                    )
                ); // Update file
            } else if (data.action === 'delete') {
                console.log('Deleting file:', data.file);
                setFiles((prevFiles) =>
                    prevFiles.filter((file) => file.name !== data.file.name)
                ); // Remove deleted file
            }
        };

        socket.onerror = (error) => {
            console.error('WebSocket Error:', error);
        };

        socket.onclose = () => {
            console.log('WebSocket Disconnected');
        };

        return () => {
            console.log('Cleaning up WebSocket connection');
            socket.close(); // Cleanup on unmount
        };
    }, []);

    return (
        <div>
            <h1>Uploaded Files</h1>
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
