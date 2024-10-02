import React, { createContext, useState } from 'react';

const TranscriptContext = createContext();

const TranscriptProvider = ({ children }) => {
    const [currentTranscriptId, setCurrentTranscriptId] = useState(null);

    return (
        <TranscriptContext.Provider value={{ currentTranscriptId, setCurrentTranscriptId }}>
            {children}
        </TranscriptContext.Provider>
    );
};

export { TranscriptContext, TranscriptProvider };