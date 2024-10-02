import React from 'react';

const ColorFeatureSelector = ({ colorFeature, setColorFeature }) => {
    return (
        <div>
            <label htmlFor="colorFeature" className="mr-2">Color by:</label>
            <select
                id="colorFeature"
                value={colorFeature}
                onChange={(event) => setColorFeature(event.target.value)}
                className="border rounded-md p-2"
            >
                <option value="">None</option>
                <option value="tense">Tense</option>
                <option value="sentiment">Sentiment</option>
            </select>
        </div>
    );
};

export default ColorFeatureSelector;
