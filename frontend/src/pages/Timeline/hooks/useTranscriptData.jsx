import { useState, useEffect } from 'react';
import { fetchTranscript } from '../../../services/transcriptService.js';
import { DataSet } from 'vis-timeline/standalone';

// Function to process the transcript data
const processTranscriptData = (transcriptData, colorFeature) => {
    const groups = new DataSet();
    groups.add(Object.keys(transcriptData.speakers).map(speakerId => ({
        id: parseInt(speakerId),
        content: transcriptData.speakers[speakerId].name
    })));

    const initialTime = 5 * 60 * 60 * 1000;

    const items = new DataSet(transcriptData.utterances.flatMap(utterance =>
        utterance.sentences.map(sentence => {
            return {
                id: `${utterance.line}-${sentence.sentence_number}`,
                group: utterance.speaker,
                content: `${utterance.line}-${sentence.sentence_number}`,
                start: new Date(initialTime + sentence.start_time),
                end: new Date(initialTime + sentence.end_time),
                sentence: sentence.sentence,
                tense: sentence.tense,
                start_time: sentence.start_time,
                end_time: sentence.end_time,
                sentiment: sentence.sentiment,
                isPause: false,
                className: getColorClass(colorFeature, sentence)
            };
        })
    ));

    // Prepare data for Google Charts
    const tenseCount = {};
    const sentimentCount = {};

    transcriptData.utterances.forEach(utterance => {
        if (!tenseCount[utterance.speaker]) {
            tenseCount[utterance.speaker] = {};
        }
        if (!sentimentCount[utterance.speaker]) {
            sentimentCount[utterance.speaker] = {};
        }

        utterance.sentences.forEach(sentence => {
            tenseCount[utterance.speaker][sentence.tense] = (tenseCount[utterance.speaker][sentence.tense] || 0) + 1;
            sentimentCount[utterance.speaker][sentence.sentiment] = (sentimentCount[utterance.speaker][sentence.sentiment] || 0) + 1;
        });
    });

    const tenseData = {};
    const sentimentData = {};

    Object.keys(tenseCount).forEach(speaker => {
        tenseData[speaker] = Object.entries(tenseCount[speaker]).map(([tense, count]) => [tense, count]);
    });

    Object.keys(sentimentCount).forEach(speaker => {
        sentimentData[speaker] = Object.entries(sentimentCount[speaker]).map(([sentiment, count]) => [sentiment, count]);
    });

    return {
        groups,
        items,
        tenseData,
        sentimentData,
        title: transcriptData.title,
        speakerNames: transcriptData.speakers
    };
};

// Utility function to get the color class based on the feature and item
const getColorClass = (feature, item) => {
    if (feature === 'tense') {
        return `tense-${item.tense.toLowerCase()}`;
    } else if (feature === 'sentiment') {
        return `sentiment-${item.sentiment.toLowerCase()}`;
    }
    return 'normal-item';
};

// Custom hook to fetch and process transcript data
const useTranscriptData = (transcriptId, colorFeature) => {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!transcriptId) return;

        const fetchData = async () => {
            try {
                const transcriptData = await fetchTranscript(transcriptId);
                const processedData = processTranscriptData(transcriptData, colorFeature);
                setData(processedData);
            } catch (err) {
                setError(err);
            }
        };

        fetchData();
    }, [transcriptId, colorFeature]);

    return { data, error };
};

export default useTranscriptData;
