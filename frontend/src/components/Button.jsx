import React from 'react';

const Button = ({ onClick, text, color = 'blue', className = '' }) => {
    const baseClasses = `text-white px-4 py-2 rounded-md hover:bg-${color}-700 ${className}`;
    const bgClass = `bg-${color}-500`;

    return (
        <button
            onClick={onClick}
            className={`${bgClass} ${baseClasses}`}
        >
            {text}
        </button>
    );
};

export default Button;
