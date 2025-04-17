import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface NavLogoProps {
  isScrolled: boolean;
  isHomePage: boolean;
}

const NavLogo = ({ isScrolled, isHomePage }: NavLogoProps) => {
  return (
    <div className="flex-shrink-0 flex items-center">
      <Link
        to="/"
        className={cn("text-2xl font-bold transition-colors duration-300", {
          "text-white": !isScrolled && isHomePage,
          "text-travely-blue": isScrolled || !isHomePage,
        })}
      >
        TripSync
      </Link>
    </div>
  );
};

export default NavLogo;
