import React from 'react';

const SelectedItemDetails = ({ selectedItem, setSelectedItem }) => {
    if (!selectedItem) return null;

    return (
        <div className="mt-4 bg-gray-50 p-4 rounded-md shadow-sm">
            <h3 className="text-xl font-semibold mb-2">Sentence Details</h3>
            <p><strong>Sentence:</strong> {selectedItem.sentence}</p>
            <p><strong>Tense:</strong> {selectedItem.tense}</p>
            <p><strong>Sentiment:</strong> {selectedItem.sentiment}</p>
            <p><strong>Time:</strong> {msToTimeFormat(selectedItem.start_time)} - {msToTimeFormat(selectedItem.end_time)}</p>
            <button onClick={() => setSelectedItem(null)} className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700">Close</button>
        </div>
    );
};

const msToTimeFormat = function (ms) {
    const remainder = ms - Math.floor(ms / 1000) * 1000
    let h, m, s;
    h = Math.floor(ms / 1000 / 60 / 60);
    m = Math.floor((ms / 1000 / 60 / 60 - h) * 60);
    s = Math.floor(((ms / 1000 / 60 / 60 - h) * 60 - m) * 60);

    s = `${s < 10 ? '0' : ''}${s}`;
    m = `${m < 10 ? '0' : ''}${m}`;
    h = `${h < 10 ? '0' : ''}${h}`;

    if (h !== '00') return `${h}:${m}:${s}`;
    if (m !== '00') return `${m}:${s}.${remainder}`;
    if (s !== '00') return `${s}.${remainder}`;
};

export default SelectedItemDetails;
