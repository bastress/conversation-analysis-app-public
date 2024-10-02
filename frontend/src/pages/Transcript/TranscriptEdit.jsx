import React, { useState } from 'react';
import Button from "../../components/Button.jsx";

const TranscriptEdit = ({ title, speakers, utterances, onSaveTitle, onSaveSpeaker, onSaveSentence }) => {
    const [editedTitle, setEditedTitle] = useState(title);
    const [editedSpeakers, setEditedSpeakers] = useState({});
    const [editedUtterances, setEditedUtterances] = useState({});

    const handleSpeakerChange = (speakerId, newName) => {
        setEditedSpeakers({
            ...editedSpeakers,
            [speakerId]: newName
        });
    };

    const handleSentenceChange = (utteranceId, sentenceId, newValue) => {
        setEditedUtterances({
            ...editedUtterances,
            [utteranceId]: {
                ...editedUtterances[utteranceId],
                [sentenceId]: newValue
            }
        });
    };

    const saveChanges = () => {
        onSaveTitle(editedTitle);
        Object.keys(editedSpeakers).forEach(speakerId => onSaveSpeaker(speakerId, editedSpeakers[speakerId]));
        Object.keys(editedUtterances).forEach(utteranceId => {
            Object.keys(editedUtterances[utteranceId]).forEach(sentenceId => {
                onSaveSentence(utteranceId, sentenceId, editedUtterances[utteranceId][sentenceId]);
            });
        });
    };

    return (
        <div>
            <input
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                className="border rounded-md p-2"
            />
            {utterances.map((utterance) => (
                <div key={utterance.line}>
                    <input
                        type="text"
                        value={editedSpeakers[utterance.speaker] || speakers[utterance.speaker]?.name}
                        onChange={(e) => handleSpeakerChange(utterance.speaker, e.target.value)}
                        className="border rounded-md p-2"
                    />
                    {utterance.sentences.map((sentence) => (
                        <textarea
                            key={sentence.id}
                            value={editedUtterances[utterance.line]?.[sentence.id] || sentence.sentence}
                            onChange={(e) => handleSentenceChange(utterance.line, sentence.id, e.target.value)}
                            className="border rounded-md p-2 w-full"
                        />
                    ))}
                </div>
            ))}
            <Button onClick={saveChanges} text="Save All Changes" color="green" />
        </div>
    );
};

export default TranscriptEdit;
