
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface MobileMenuProps {
  isOpen: boolean;
  isLoggedIn: boolean;
  onClose: () => void;
  onToggleAuth: () => void;
}

const MobileMenu = ({ 
  isOpen, 
  isLoggedIn, 
  onClose,
  onToggleAuth 
}: MobileMenuProps) => {
  return (
    <div 
      className={cn(
        "md:hidden transition-all duration-300 ease-in-out overflow-hidden",
        isOpen ? "max-h-64" : "max-h-0"
      )}
    >
      <div className="bg-white px-2 pt-2 pb-3 space-y-1 sm:px-3">
        <Link 
          to="/" 
          className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
          onClick={onClose}
        >
          Home
        </Link>
        <Link 
          to="/reservations" 
          className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
          onClick={onClose}
        >
          Reservations
        </Link>
        <Link 
          to="/contact" 
          className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
          onClick={onClose}
        >
          Contact Us
        </Link>
        
        {isLoggedIn ? (
          <>
            <Link 
              to="/profile" 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
              onClick={onClose}
            >
              My Profile
            </Link>
            <button 
              onClick={() => {
                onToggleAuth();
                onClose();
              }}
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
            >
              Sign Out
            </button>
          </>
        ) : (
          <div className="flex space-x-2 px-3 pt-2">
            <Link 
              to="/login" 
              className="flex-1 py-2 text-center rounded-md border border-travely-blue text-travely-blue"
              onClick={onClose}
            >
              Sign In
            </Link>
            <Link 
              to="/register" 
              className="flex-1 py-2 text-center rounded-md bg-travely-blue text-white"
              onClick={onClose}
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileMenu;
