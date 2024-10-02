import React, { useState, useContext } from 'react';
import axios from 'axios';
import { TranscriptContext } from "./TranscriptContext.jsx";
import Button from "../components/Button.jsx";

const UploadTranscript = ({ onUploadSuccess }) => {
    const { setCurrentTranscriptId } = useContext(TranscriptContext);
    const [file, setFile] = useState(null);
    const [title, setTitle] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleTitleChange = (e) => {
        setTitle(e.target.value);
    };

    const handleUpload = async () => {
        if (!file || !title) {
            alert("Please provide a title and select a file.");
            return;
        }

        setIsProcessing(true); // Start processing
        setSuccessMessage(''); // Clear any previous success message

        const formData = new FormData();
        formData.append('file', file);
        formData.append('title', title);

        try {
            const response = await axios.post('http://localhost:8000/api/transcripts/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log(response.data);
            setCurrentTranscriptId(response.data.id);

            setSuccessMessage("File uploaded successfully.");
            setTimeout(() => setSuccessMessage(''), 4000);
        } catch (error) {
            console.error('Error uploading file:', error.response ? error.response.data : error);
        } finally {
            setIsProcessing(false); // End processing
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-2xl font-bold mb-4">Upload and Process New Audio File</h3>
            {isProcessing && <div className="bg-yellow-100 text-yellow-700 p-2 rounded-md mb-4">Your file is being processed. Please remain on this page.</div>}
            {successMessage && <div className="bg-green-100 text-green-700 p-2 rounded-md mb-4">{successMessage}</div>}
            <input
                type="text"
                placeholder="Title"
                aria-label="Title"
                value={title}
                onChange={handleTitleChange}
                className="block w-full p-2 border border-gray-300 rounded-md mb-4"
            />
            <input
                id="file-upload"
                type="file"
                aria-label="Upload File"
                onChange={handleFileChange}
                className="block w-full p-2 border border-gray-300 rounded-md mb-4"
            />
            <Button onClick={handleUpload} text="Upload" />
        </div>
    );
};

export default UploadTranscript;