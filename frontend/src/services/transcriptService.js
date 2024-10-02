import axios from 'axios';

export const fetchTranscript = async (transcriptId) => {
    const response = await axios.get(`http://localhost:8000/api/transcripts/${transcriptId}`);
    return response.data;
};
