import { Link, useNavigate } from 'react-router-dom';
import { Avatar } from './Avatar';
import { FaPen, FaSignOutAlt } from 'react-icons/fa';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useUserData } from '../hooks';
import { Logo } from './Logo'; 
export const Appbar = () => {
  // Get the user ID from local storage (assuming it's stored there)
  const userId = localStorage.getItem("userId");
  
  // Fetch user data using the hook
  const { loading, userData } = useUserData(userId || ''); // Provide a default empty string if userId is null

  const [showLogoutMenu, setShowLogoutMenu] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove the token from local storage
    localStorage.removeItem('token');
    localStorage.removeItem('userId'); // Also remove userId if stored

    // Show toast notification
    toast.success('Logged out successfully!');

    // Redirect to sign-in page
    navigate('/signin');
  };

  return (
    <nav className="bg-gray-900 border-b border-gray-700 px-4 py-3 flex justify-between items-center shadow-lg">
      <div className="flex items-center space-x-2 mb-2 md:mb-0">
        <Link to="/blogs">
          <Logo className="bubbly-logo" /> {/* Adjust size as needed */}
        </Link>
      </div>
      <div className="flex items-center space-x-4 relative">
        <Link to="/publish">
          <button className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 flex items-center space-x-2 transition duration-300">
            <FaPen className="text-sm" />
            <span>Compose</span>
          </button>
        </Link>
        <div className="relative">
          <button onClick={() => setShowLogoutMenu(!showLogoutMenu)}> 
            {/* Display Avatar with user's name */}
            <Avatar name={loading ? '★' : userData?.name || 'User'} size="large" />
          </button>
         
          {showLogoutMenu && (
            <div className="absolute right-0 mt-2 bg-white border border-gray-200 rounded shadow-lg">
              <button
                onClick={handleLogout}
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition duration-300"
              >
                <FaSignOutAlt className="inline mr-2" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
