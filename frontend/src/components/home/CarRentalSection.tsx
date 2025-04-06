
import React, { useState } from 'react';
import { Car, MapPin } from 'lucide-react';
import { toast } from 'sonner';

const CarRentalSection = () => {
  const [vehicleType, setVehicleType] = useState<string>('all');
  const [location, setLocation] = useState<string>('');

  const handleTryEV = () => {
    toast.success('Great choice! Electric vehicles help protect Sri Lanka\'s beautiful environment.');
  };

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="space-y-6 animate-slide-in">
            <div className="inline-block bg-travely-light-blue text-travely-blue px-4 py-1 rounded-full text-sm font-medium">
              Rental Service
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              FAST AND EASY WAY TO<br />
              <span className="text-travely-blue">RENT A CAR</span>
            </h2>
            
            <p className="text-gray-600 leading-relaxed">
              Experience the safe and convenient way to travel with our extensive fleet of high-quality vehicles. With Travely, you'll get a clean, sanitized, and well-maintained car that's ready when you need it. Whether you're planning a family vacation or a business trip, we have the perfect vehicle for your needs.
            </p>
            
            <p className="text-gray-600 leading-relaxed">
              Our simple booking process means you can reserve your rental vehicle with just a few clicks. Then just pick your vehicle up when you're ready for your journey, without unnecessary paperwork or delays.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label htmlFor="vehicleType" className="block text-sm font-medium text-gray-700 mb-1">
                  Vehicle Type
                </label>
                <select
                  id="vehicleType"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-travely-blue"
                  value={vehicleType}
                  onChange={(e) => setVehicleType(e.target.value)}
                >
                  <option value="all">All</option>
                  <option value="economy">Economy</option>
                  <option value="compact">Compact</option>
                  <option value="suv">SUV</option>
                  <option value="luxury">Luxury</option>
                  <option value="ev">Electric</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="pickupLocation" className="block text-sm font-medium text-gray-700 mb-1">
                  Pick-up Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    id="pickupLocation"
                    type="text"
                    placeholder="Colombo"
                    className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-travely-blue"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
              </div>
            </div>
            
            <button 
              onClick={handleTryEV}
              className="inline-flex items-center text-gray-700 hover:text-travely-blue transition-colors duration-300 font-medium"
            >
              <Car className="mr-2" size={20} />
              Try EV and Save Atmosphere
            </button>
          </div>
          
          {/* Car Image */}
          <div className="animate-fade-in">
            <img 
              src="/lovable-uploads/b9ce264d-d3e4-482d-a119-3f6e41b7412d.png" 
              alt="Blue Sports Car" 
              className="w-full h-auto object-cover rounded-lg transform hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CarRentalSection;
