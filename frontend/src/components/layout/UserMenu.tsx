
import React from 'react';
import { Link } from 'react-router-dom';
import { User } from 'lucide-react';

interface UserMenuProps {
  isLoggedIn: boolean;
  onToggleAuth: () => void;
}

const UserMenu = ({ isLoggedIn, onToggleAuth }: UserMenuProps) => {
  if (isLoggedIn) {
    return (
      <div className="relative group">
        <Link 
          to="/profile" 
          className="flex items-center space-x-2 focus:outline-none" 
          aria-label="User profile"
        >
          <div className="h-8 w-8 rounded-full bg-travely-blue text-white flex items-center justify-center">
            <User size={18} />
          </div>
        </Link>
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-right">
          <Link 
            to="/profile" 
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            My Profile
          </Link>
          <Link 
            to="/reservations" 
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            My Reservations
          </Link>
          <button 
            onClick={onToggleAuth}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Sign Out
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex space-x-4">
      <Link 
        to="/login" 
        className="py-2 px-4 rounded-md transition-all duration-300 text-travely-blue border border-travely-blue hover:bg-travely-blue hover:text-white"
      >
        Sign In
      </Link>
      <Link 
        to="/register" 
        className="py-2 px-4 rounded-md transition-all duration-300 bg-travely-blue text-white hover:bg-travely-dark-blue"
      >
        Sign Up
      </Link>
    </div>
  );
};

export default UserMenu;
