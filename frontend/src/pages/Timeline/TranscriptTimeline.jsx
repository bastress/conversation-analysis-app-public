import React, { useState, useEffect, useContext } from 'react';
import { DataSet } from 'vis-timeline/standalone';
import useTranscriptData from './hooks/useTranscriptData.jsx';
import { TranscriptContext } from "../TranscriptContext.jsx";
import { TimelineComponent, ColorKey, SelectedItemDetails, GoogleCharts } from './components';
import DividerLine from "../../components/DividerLine.jsx";

const TranscriptTimeline = () => {
    const { currentTranscriptId } = useContext(TranscriptContext);
    const [selectedItem, setSelectedItem] = useState(null);
    const [colorFeature, setColorFeature] = useState('');
    const [highlightedItems, setHighlightedItems] = useState(null);

    const { data, error } = useTranscriptData(currentTranscriptId, colorFeature);

    useEffect(() => {
        if (data) {
            // Highlight the selected item in the timeline
            const updatedItems = data.items.map(item => {
                return {
                    ...item,
                    className: `${getColorClass(colorFeature, item)} ${selectedItem && item.id === selectedItem.id ? 'highlighted-item' : ''}`
                };
            });
            setHighlightedItems(new DataSet(updatedItems));
        }
    }, [colorFeature, selectedItem, data]);

    if (error) {
        return <div>Error fetching transcript data: {error.message}</div>;
    }

    if (!data) {
        return <div>Please Select a transcript.</div>;
    }

    const { groups, tenseData, sentimentData, title } = data;

    const getColorClass = (feature, item) => {
        if (feature === 'tense') {
            return `tense-${item.tense.toLowerCase()}`;
        } else if (feature === 'sentiment') {
            return `sentiment-${item.sentiment.toLowerCase()}`;
        }
        return 'normal-item';
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <TimelineComponent
                groups={groups}
                items={highlightedItems || data.items} // Use highlighted item if available, otherwise use original items
                title={title}
                setSelectedItem={setSelectedItem}
                colorFeature={colorFeature}
                setColorFeature={setColorFeature}
            />
            {!currentTranscriptId && (
                <h3>Please upload or select a transcript to view its timeline.</h3>
            )}
            {selectedItem && (
                <SelectedItemDetails
                    selectedItem={selectedItem}
                    setSelectedItem={setSelectedItem}
                />
            )}
            {currentTranscriptId && <ColorKey colorFeature={colorFeature} />}
            {currentTranscriptId && (
                <>
                    <DividerLine />
                    <GoogleCharts
                        tenseData={tenseData}
                        sentimentData={sentimentData}
                        speakerNames={data.speakerNames}
                    />
                </>
            )}
        </div>
    );
};

export default TranscriptTimeline;

