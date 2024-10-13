import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';

const Layout = () => {
    return (
        <div>
            <header className="bg-white shadow-md p-4">
                <div className="flex justify-between items-center">
                    <NavLink to="/" className="text-2xl font-bold text-blue-500 hover:text-blue-700">
                        Conversation Analysis
                    </NavLink>
                    <nav className="flex space-x-4">
                        <NavLink to="/upload">
                            <button className="text-blue-500 hover:text-blue-800 px-3 py-2 rounded-md text-lg">Upload</button>
                        </NavLink>
                        <NavLink to="/select">
                            <button className="text-blue-500 hover:text-blue-800 px-3 py-2 rounded-md text-lg">Select and Edit</button>
                        </NavLink>
                        <NavLink to="/timeline">
                            <button className="text-blue-500 hover:text-blue-800 px-3 py-2 rounded-md text-lg">Timeline</button>
                        </NavLink>
                    </nav>
                </div>
            </header>
            <main className="p-4">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;