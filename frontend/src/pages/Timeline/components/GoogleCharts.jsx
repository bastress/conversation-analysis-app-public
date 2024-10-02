import React, { useEffect } from 'react';

const GoogleCharts = ({ tenseData, sentimentData, speakerNames }) => {
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://www.gstatic.com/charts/loader.js';
        script.onload = () => {
            window.google.charts.load('current', { packages: ['corechart'] });
            window.google.charts.setOnLoadCallback(drawCharts);
            window.addEventListener('resize', drawCharts); // Redraw charts on window resize
        };
        document.body.appendChild(script);
        return () => window.removeEventListener('resize', drawCharts); // Cleanup on component unmount
    }, [tenseData, sentimentData]);

    // Color mappings
    const tenseColors = {
        'PAST': '#ec4899', // Tailwind pink-500
        'PRESENT': '#f59e0b', // Tailwind amber-500
        'FUTURE': '#14b8a6', // Tailwind teal-500
        'AMBIGUOUS': '#9ca3af' // Tailwind gray-400
    };

    const sentimentColors = {
        'POSITIVE': '#22c55e', // Tailwind green-500
        'NEUTRAL': '#9ca3af', // Tailwind gray-400
        'NEGATIVE': '#ef4444' // Tailwind red-500
    };

    const drawCharts = () => {

        Object.keys(tenseData).forEach(speakerId => {
            const tenseChart = new window.google.visualization.PieChart(document.getElementById(`tense-pie-chart-${speakerId}`));
            const sentimentChart = new window.google.visualization.PieChart(document.getElementById(`sentiment-pie-chart-${speakerId}`));

            const tenseDataTable = new window.google.visualization.DataTable();
            tenseDataTable.addColumn('string', 'Tense');
            tenseDataTable.addColumn('number', 'Count');
            tenseDataTable.addRows(tenseData[speakerId]);

            const sentimentDataTable = new window.google.visualization.DataTable();
            sentimentDataTable.addColumn('string', 'Sentiment');
            sentimentDataTable.addColumn('number', 'Count');
            sentimentDataTable.addRows(sentimentData[speakerId]);

            const tenseOptions = {
                title: `${speakerNames[speakerId].name} - Tense Distribution`,
                titleTextStyle: { fontSize: 14 },
                pieHole: 0.4,
                colors: tenseData[speakerId].map(([tense]) => tenseColors[tense]),
                legend: { position: 'right' },
                width: '100%',
                height: '100%',
                fontSize: 12,
            };

            const sentimentOptions = {
                title: `${speakerNames[speakerId].name} - Sentiment Distribution`,
                titleTextStyle: { fontSize: 14 },
                pieHole: 0.4,
                colors: sentimentData[speakerId].map(([sentiment]) => sentimentColors[sentiment]),
                legend: { position: 'right' },
                width: '100%',
                height: '100%',
                fontSize: 12,
            };

            tenseChart.draw(tenseDataTable, tenseOptions);
            sentimentChart.draw(sentimentDataTable, sentimentOptions);
        });
    };

    return (
        <div className="mt-8">
            {Object.keys(tenseData).map(speakerId => (
                <div key={speakerId} className="flex justify-between mb-8">
                    <div className="w-1/2">
                        <div id={`tense-pie-chart-${speakerId}`} className="w-full h-64"></div>
                    </div>
                    <div className="w-1/2">
                        <div id={`sentiment-pie-chart-${speakerId}`} className="w-full h-64"></div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default GoogleCharts;

