import React from 'react';
import Logo from './Logo';

const Header = ({ token, setView, handleLogout, setSelectedRepoId }) => {
    return (
      <nav className="bg-gray-900 bg-opacity-90 backdrop-filter backdrop-blur-lg shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20"> {/* Increased height */}
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <button 
                  onClick={() => setView('landing')}
                  className="flex items-center p-2 hover:bg-gray-800 rounded-md transition duration-300"
                >
                  <Logo />
                </button>
              </div>
            </div>
            <div className="flex items-center">
              <button
                onClick={() => setView('landing')}
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700 focus:outline-none focus:text-white focus:bg-gray-700 transition duration-150 ease-in-out"
              >
                Home
              </button>
              {token && (
                <>
                  <button
                    onClick={() => setView('dashboard')}
                    className="ml-4 px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700 focus:outline-none focus:text-white focus:bg-gray-700 transition duration-150 ease-in-out"
                  >
                    Dashboard
                  </button>
                  <button 
                    onClick={() => {setSelectedRepoId(null); setView('prs')}}
                    className="ml-4 px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700 focus:outline-none focus:text-white focus:bg-gray-700 transition duration-150 ease-in-out"
                  >
                    Pull Requests
                  </button>
                  <button
                    onClick={() => setView('metrics')}
                    className="ml-4 px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700 focus:outline-none focus:text-white focus:bg-gray-700 transition duration-150 ease-in-out"
                  >
                    Metrics
                  </button>
                  <button
                    onClick={handleLogout}
                    className="ml-4 px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-red-500 focus:outline-none focus:text-red-500 transition duration-150 ease-in-out"
                  >
                    Logout
                  </button>
                </>
              )}
              {!token && (
                <button
                  onClick={() => setView('login')}
                  className="ml-4 px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700 focus:outline-none focus:text-white focus:bg-gray-700 transition duration-150 ease-in-out"
                >
                  Login
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>
    );
  };
  
  export default Header;