
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface NavbarLinkProps {
  to: string;
  children: React.ReactNode;
  isScrolled: boolean;
  isHomePage: boolean;
  onClick?: () => void;
  className?: string;
}

const NavbarLink = ({ 
  to, 
  children, 
  isScrolled, 
  isHomePage,
  onClick,
  className
}: NavbarLinkProps) => {
  return (
    <Link 
      to={to} 
      className={cn(
        "transition-colors duration-300",
        (!isScrolled && isHomePage) ? 'nav-link' : 'text-gray-700 hover:text-travely-blue',
        className
      )}
      onClick={onClick}
    >
      {children}
    </Link>
  );
};

export default NavbarLink;
