import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UploadTranscript from './pages/UploadTranscript';
import SelectTranscript from './pages/Transcript/SelectTranscript.jsx';
import TranscriptTimeline from "./pages/Timeline/TranscriptTimeline.jsx";
import Layout from './pages/Layout';
import './App.css';
import { TranscriptProvider } from "./pages/TranscriptContext";
import HomePage from "./pages/HomePage";

function App() {
    return (
        <TranscriptProvider>
            <Router>
                <div className="min-h-screen bg-gradient-to-r from-slate-200 to-sky-100">
                    <Routes>
                        <Route path="/" element={<Layout />}>
                            <Route index element={<HomePage />} />
                            <Route path="upload" element={<UploadTranscript />} />
                            <Route path="select" element={<SelectTranscript />} />
                            <Route path="timeline" element={<TranscriptTimeline />} />
                        </Route>
                    </Routes>
                </div>
            </Router>
        </TranscriptProvider>
    );
}

export default App;

