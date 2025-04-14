import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import NavLogo from './NavLogo';
import NavbarLink from './NavbarLink';
import UserMenu from './UserMenu';
import MobileMenu from './MobileMenu';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === '/';

  const { authUser, logout, setLoggedInUser } = useAuthStore();

  // Scroll behavior
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    localStorage.clear();
    setLoggedInUser('');
    navigate('/', { state: { fromLogout: true } });
    window.location.reload();
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

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <NavbarLink to="/" isScrolled={isScrolled} isHomePage={isHomePage}>Home</NavbarLink>
            <NavbarLink to="/dashboard" isScrolled={isScrolled} isHomePage={isHomePage}>Dashboard</NavbarLink>
            <NavbarLink to="/contact" isScrolled={isScrolled} isHomePage={isHomePage}>Contact Us</NavbarLink>

            {authUser ? (
              <Button
                onClick={handleLogout}
                variant="ghost"
                size="sm"
                className="text-gray-700"
              >
                <LogOut size={18} />
                <span className="ml-2 hidden md:inline">Log out</span>
              </Button>
            ) : (
              <UserMenu />
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={cn(
                'p-2 rounded-md focus:outline-none',
                (!isScrolled && isHomePage) ? 'text-white' : 'text-gray-700'
              )}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        isLoggedIn={!!authUser}
        onClose={() => setMobileMenuOpen(false)}
        onToggleAuth={handleLogout}
      />
    </nav>
  );
};

export default Navbar;
