import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { TranscriptContext } from "../TranscriptContext.jsx";
import TranscriptView from './TranscriptView.jsx';
import TranscriptEdit from './TranscriptEdit.jsx';
import Button from "../../components/Button.jsx";
import DividerLine from "../../components/DividerLine.jsx";

const SelectTranscript = () => {
    const { currentTranscriptId, setCurrentTranscriptId } = useContext(TranscriptContext);
    const [utterances, setUtterances] = useState([]);
    const [speakers, setSpeakers] = useState({});
    const [uploads, setUploads] = useState([]);
    const [selectedTitle, setSelectedTitle] = useState('');

    const [isEditing, setIsEditing] = useState(false);
    const [selectedId, setSelectedId] = useState('');

    useEffect(() => {
        fetchUploads();
        initializeTranscript();
    }, []);

    const fetchUploads = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/transcripts/');
            setUploads(response.data);
        } catch (error) {
            console.error('Error fetching uploads:', error);
        }
    };

    const initializeTranscript = async () => {
        if (!currentTranscriptId) return;

        try {
            const response = await axios.get(`http://localhost:8000/api/transcripts/${currentTranscriptId}/`);
            setUtterances(response.data.utterances);
            setSpeakers(response.data.speakers);
            setSelectedTitle(response.data.title);
        } catch (error) {
            console.error('Error fetching transcript:', error);
        }
    };

    const fetchTranscript = async () => {
        if (!selectedId) return;

        try {
            const response = await axios.get(`http://localhost:8000/api/transcripts/${selectedId}/`);
            setUtterances(response.data.utterances);
            setSpeakers(response.data.speakers);
            setSelectedTitle(response.data.title);
            setCurrentTranscriptId(selectedId);
        } catch (error) {
            console.error('Error fetching transcript:', error);
        }
    };

    const deleteTranscript = async () => {
        if (!currentTranscriptId) {
            alert("Please select a transcript to delete.");
            return;
        }

        try {
            await axios.delete(`http://localhost:8000/api/transcripts/${currentTranscriptId}/`);
            setUploads(uploads.filter(upload => upload.id !== currentTranscriptId));
            setCurrentTranscriptId('');
            setSelectedId('');
            setUtterances([]);
            setSpeakers({});
            setSelectedTitle('');
            alert("Transcript deleted successfully.");
        } catch (error) {
            console.error('Error deleting transcript:', error);
            alert("Failed to delete the transcript.");
        }
    };

    const toggleEditingMode = () => {
        setIsEditing(!isEditing);
    };

    const saveTitle = async (newTitle) => {
        try {
            await axios.patch(`http://localhost:8000/api/transcripts/${currentTranscriptId}/`, { title: newTitle });
            setSelectedTitle(newTitle);
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating title:', error);
        }
    };

    const saveSpeaker = async (speakerId, newName) => {
        try {
            await axios.patch(`http://localhost:8000/api/speakers/${speakerId}/`, { name: newName });
            setSpeakers({
                ...speakers,
                [speakerId]: { ...speakers[speakerId], name: newName }
            });
        } catch (error) {
            console.error('Error updating speaker:', error);
        }
    };

    const saveSentence = async (utteranceId, sentenceId, newSentence) => {
        try {
            await axios.patch(`http://localhost:8000/api/sentences/${sentenceId}/`, { sentence: newSentence });
            // Refresh data after save
            initializeTranscript();
        } catch (error) {
            console.error('Error updating sentence:', error);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
                <label htmlFor="transcripts" className="text-2xl font-bold">Select Transcript</label>
                {currentTranscriptId && (
                    <Button onClick={toggleEditingMode} text={isEditing ? 'Done Editing' : 'Edit Transcript'} />
                )}
            </div>
            <select
                id="transcripts"
                onChange={(e) => setSelectedId(e.target.value)}
                className="border rounded-md p-2 m-2"
            >
                <option value="">Select an upload</option>
                {uploads.map((upload) => (
                    <option key={upload.id} value={upload.id}>
                        {upload.title}
                    </option>
                ))}
            </select>
            <div className="flex space-x-2 mb-4">
                <Button onClick={fetchTranscript} text="Fetch Transcript" />
                {currentTranscriptId && (
                    <Button onClick={deleteTranscript} text="Delete Transcript" color="red" />
                )}
            </div>

            {currentTranscriptId && <DividerLine />}

            {isEditing ? (
                <TranscriptEdit
                    title={selectedTitle}
                    speakers={speakers}
                    utterances={utterances}
                    onSaveTitle={saveTitle}
                    onSaveSpeaker={saveSpeaker}
                    onSaveSentence={saveSentence}
                />
            ) : (
                <TranscriptView
                    title={selectedTitle}
                    speakers={speakers}
                    utterances={utterances}
                />
            )}
        </div>
    );
};

export default SelectTranscript;
