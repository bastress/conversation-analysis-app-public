import React from 'react';

const TranscriptView = ({ title, speakers, utterances }) => {
    return (
        <div>
            <h3 className="text-xl font-semibold mb-2">{title}</h3>
            {utterances.map((utterance) => (
                <div key={utterance.line}>
                    <h4 className="font-bold">{speakers[utterance.speaker]?.name}</h4>
                    {utterance.sentences.map((sentence) => (
                        <p key={sentence.id} className="ml-4">{sentence.sentence}</p>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default TranscriptView;
