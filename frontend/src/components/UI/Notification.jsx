import React from 'react';

const Notification = ({ message }) => {
    if (!message) return null;

    return (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 mt-4 p-2 bg-green-500 text-white rounded shadow-lg">
            {message}
        </div>
    );
};

export default Notification;
