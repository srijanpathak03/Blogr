import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { SignupInput } from '@srijanpathak/blog-common';
import { BACKEND_URL } from '../config';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [signupInputs, setSignupInputs] = useState<SignupInput>({
    name: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setSignupInputs({ ...signupInputs, [id]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${BACKEND_URL}/api/v1/user/signup`, signupInputs);
      const {jwt,userId} = response.data;
      localStorage.setItem('token', jwt);
      localStorage.setItem('userId', userId); // Store the user ID
      toast.success('Sign up successful!');
      navigate('/blogs');
    } catch (error) {
      console.error('Signup error:', error);
      toast.error('An error occurred during sign-up. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-gray-200 via-gray-300 to-gray-400 p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg overflow-hidden">
        <form onSubmit={handleSubmit} className="p-8">
          <h2 className="text-3xl font-bold text-gray-800 text-center">Sign Up</h2>
          <p className="mt-2 text-sm text-gray-600 text-center">Create an account to get started.</p>
          <div className="mt-8 space-y-4">
            <div className="relative">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
              <input
                id="name"
                type="text"
                value={signupInputs.name}
                onChange={handleInputChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Your Name"
                required
              />
            </div>
            <div className="relative">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                id="email"
                type="email"
                value={signupInputs.email}
                onChange={handleInputChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="you@gmail.com"
                required
              />
            </div>
            <div className="relative">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={signupInputs.password}
                onChange={handleInputChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 flex items-center px-3 py-2 pt-8"
              >
                <EyeIcon className="h-5 w-5 text-gray-500" />
                <span className="sr-only">Toggle password visibility</span>
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 mt-6 bg-black text-white rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            disabled={loading}
          >
            {loading ? <FancyLoader /> : 'Sign Up'}
          </button>
          <p className="mt-4 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/signin" className="text-blue-600 hover:text-blue-800">
              Sign In
            </Link>
          </p>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

const FancyLoader = () => (
  <div className="flex justify-center items-center space-x-1">
    <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
    <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
    <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
  </div>
);

function EyeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}