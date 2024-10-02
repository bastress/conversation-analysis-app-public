import React, { useEffect, useRef } from 'react';
import { Timeline } from 'vis-timeline/standalone';
import 'vis-timeline/styles/vis-timeline-graph2d.min.css';
import ColorFeatureSelector from './ColorFeatureSelector.jsx';

const TimelineComponent = ({ groups, items, title, setSelectedItem, colorFeature, setColorFeature }) => {
    const timelineRef = useRef(null);

    useEffect(() => {
        if (groups && items && !timelineRef.current) {
            const container = document.getElementById('timeline');

            const options = {
                min: new Date(5 * 60 * 60 * 1000),
                max: new Date(7 * 60 * 60 * 1000), // 2 hour maximum
                zoomMin: 1000,
                zoomMax: 10000000,
                preferZoom: true,
                verticalScroll: true,
                orientation: { axis: "top", item: "top" },
                format: {
                    minorLabels: {
                        millisecond: 'SSS',
                        second: 'm:ss',
                        minute: 'HH:mm',
                        hour: 'HH:mm',
                    },
                    majorLabels: {
                        millisecond: 'HH:mm:ss',
                        second: 'HH:mm:ss',
                        minute: 'HH:mm',
                        hour: 'HH:mm',
                    }
                },
                stack: false
            };
            timelineRef.current = new Timeline(container, items, groups, options);

            timelineRef.current.on('click', function (properties) {
                if (properties.item) {
                    const item = items.get(properties.item);
                    setSelectedItem(item);
                }
            });
        } else if (timelineRef.current) {
            timelineRef.current.setItems(items);
        }
    }, [groups, items]);

    const fitTimeline = () => {
        if (timelineRef.current) {
            timelineRef.current.fit();
        }
    };

    return (
        <>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold px-2">
                    {title ? `Timeline: ${title}` : 'Transcript Timeline'}
                </h2>
                <div className="flex space-x-4">
                    <button onClick={fitTimeline} className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400">
                        Fit to View
                    </button>
                    <ColorFeatureSelector colorFeature={colorFeature} setColorFeature={setColorFeature} />
                </div>
            </div>
            <div id="timeline" className="bg-gray-100 rounded-md p-4"></div>
        </>
    );
};

export default TimelineComponent;

