import React from 'react';

const ColorKey = ({ colorFeature }) => {
    const tenseKey = (
        <div className="mt-4">
            <h4 className="text-lg font-semibold">Tense Color Key:</h4>
            <ul>
                <li className="p-1"><span className="inline-block w-4 h-4 bg-pink-500 mr-2"></span>Past</li>
                <li className="p-1"><span className="inline-block w-4 h-4 bg-amber-500 mr-2"></span>Present</li>
                <li className="p-1"><span className="inline-block w-4 h-4 bg-teal-500 mr-2"></span>Future</li>
                <li className="p-1"><span className="inline-block w-4 h-4 bg-gray-400 mr-2"></span>Ambiguous</li>
            </ul>
        </div>
    );

    const sentimentKey = (
        <div className="mt-4">
            <h4 className="text-lg font-semibold">Sentiment Color Key:</h4>
            <ul>
                <li className="p-1"><span className="inline-block w-4 h-4 bg-green-500 mr-2"></span>Positive</li>
                <li className="p-1"><span className="inline-block w-4 h-4 bg-gray-400 mr-2"></span>Neutral</li>
                <li className="p-1"><span className="inline-block w-4 h-4 bg-red-500 mr-2"></span>Negative</li>
            </ul>
        </div>
    );

    return (
        <div className="flex flex-wrap space-x-12">
            {colorFeature === 'tense' && tenseKey}
            {colorFeature === 'sentiment' && sentimentKey}
        </div>
    );
};

export default ColorKey;
