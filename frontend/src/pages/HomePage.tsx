import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../components/Logo'; // Adjust the path as needed

export const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white px-4">
      <div className="flex flex-col items-center mb-6">
        <Logo/>
      </div>
      <h1 className="text-3xl font-bold mb-4 md:text-4xl text-center">Welcome to Blogr</h1>
      <p className="text-base mb-8 md:text-lg text-center max-w-md">
        Your go-to platform for reading and writing amazing blogs.
      </p>
      <Link to="/signup">
        <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg shadow-lg transition duration-300 md:py-3 md:px-6">
          Get Started
        </button>
      </Link>
    </div>
  );
};
