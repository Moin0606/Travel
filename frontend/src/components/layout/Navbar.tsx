
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import NavLogo from './NavLogo';
import NavbarLink from './NavbarLink';
import UserMenu from './UserMenu';
import MobileMenu from './MobileMenu';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  
  // For demo purposes, we'll assume the user is not logged in initially
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Toggle auth state (just for demo)
  const toggleAuth = () => {
    setIsLoggedIn(!isLoggedIn);
  };

  return (
    <nav 
      className={cn(
        'fixed top-0 w-full z-50 transition-all duration-300',
        {
          'bg-transparent': !isScrolled && isHomePage,
          'bg-white shadow-md': isScrolled || !isHomePage
        }
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <NavLogo isScrolled={isScrolled} isHomePage={isHomePage} />
          
          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-8">
            <NavbarLink to="/" isScrolled={isScrolled} isHomePage={isHomePage}>
              Home
            </NavbarLink>
            <NavbarLink to="/reservations" isScrolled={isScrolled} isHomePage={isHomePage}>
              Reservations
            </NavbarLink>
            <NavbarLink to="/contact" isScrolled={isScrolled} isHomePage={isHomePage}>
              Contact Us
            </NavbarLink>
            
            <UserMenu isLoggedIn={isLoggedIn} onToggleAuth={toggleAuth} />
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={cn(
                "p-2 rounded-md focus:outline-none",
                (!isScrolled && isHomePage) ? 'text-white' : 'text-gray-700'
              )}
            >
              {mobileMenuOpen ? 
                <X className="h-6 w-6" /> : 
                <Menu className="h-6 w-6" />
              }
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <MobileMenu 
        isOpen={mobileMenuOpen} 
        isLoggedIn={isLoggedIn}
        onClose={() => setMobileMenuOpen(false)}
        onToggleAuth={toggleAuth}
      />
    </nav>
  );
};

export default Navbar;
