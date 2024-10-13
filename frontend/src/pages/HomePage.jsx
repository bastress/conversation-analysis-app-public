import React from 'react';

const HomePage = () => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h1 className="text-4xl font-bold mb-4">Welcome to the Conversation Analysis App</h1>
            <p className="text-lg mb-4">Upload, analyze, and visualize your audio files with ease.</p>
            <a href="/upload" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                Get Started
            </a>
        </div>
    );
};

export default HomePage;