import React, { useState } from 'react';

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-gray-900 shadow-lg p-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="text-white text-xl font-bold">
          <p>Diabetes Calculator</p>
        </div>
        <div className="hidden md:block">
          <div className="flex space-x-4">
            <a href="/dashboard" className="text-white hover:text-gray-200">Home</a>
            <a href="/diary" className="text-white hover:text-gray-200">Diary</a>
            <a href="/calculation" className="text-white hover:text-gray-200">Calculator</a>
            <a href="/recipes" className="text-white hover:text-gray-200">Recipes</a>
            <a href="/account" className="text-white hover:text-gray-200">Account</a>
          </div>
        </div>
        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-white">
            {isOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6">
                <path fillRule="evenodd" d="M6.707 6.707a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0l5 5a1 1 0 01-1.414 1.414L12 2.414 7.707 6.707zM6.707 13.293a1 1 0 010 1.414l5 5a1 1 0 001.414-1.414L12 17.586l4.293-4.293a1 1 0 00-1.414-1.414l-4.293 4.293L6.707 13.293z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            )}
          </button>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden">
          <a href="/" className="block text-white py-2 px-4 hover:bg-blue-700">Home</a>
          <a href="/diary" className="block text-white py-2 px-4 hover:bg-blue-700">Diary</a>
          <a href="/calculation" className="block text-white py-2 px-4 hover:bg-blue-700">Calculator</a>
          <a href="/account" className="block text-white py-2 px-4 hover:bg-blue-700">Account</a>
          <a href="/recipes" className="block text-white py-2 px-10 hover:bg-blue-700">Recipes</a>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
