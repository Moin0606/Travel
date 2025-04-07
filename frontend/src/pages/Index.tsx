
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import HeroSection from '@/components/home/HeroSection';
import ExplorerSection from '@/components/home/ExplorerSection';
import ActivitySection from '@/components/home/ActivitySection';
import HotelSection from '@/components/home/HotelSection';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <HeroSection />
        <ExplorerSection />
        <ActivitySection />
        <HotelSection />
      </main>
      
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Travely</h3>
              <p className="text-gray-400 text-sm">
                An all-in-one platform to discover and explore Sri Lanka with ease.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="/" className="hover:text-white transition-colors">Home</a></li>
                <li><a href="/reservations" className="hover:text-white transition-colors">Reservations</a></li>
                <li><a href="/contact" className="hover:text-white transition-colors">Contact Us</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Car Rentals</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Hotels</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Activities</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Tour Packages</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <address className="text-sm text-gray-400 not-italic">
                <p>123 Travel Street</p>
                <p>Colombo, Sri Lanka</p>
                <p className="mt-2">info@travely.com</p>
                <p>+94 123 456 789</p>
              </address>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-gray-400 text-center">
            <p>&copy; {new Date().getFullYear()} Travely. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
