
import React, { useState } from 'react';
import { MapPin, Users, Calendar, Search } from 'lucide-react';
import { toast } from 'sonner';

interface Hotel {
  id: string;
  name: string;
  image: string;
  location: string;
  price: string;
  rating?: string;
}

interface TravelPartner {
  id: string;
  name: string;
  image: string;
  interests: string[];
  compatibility: number; // percentage match
  trips: number;
}

const HOTELS: Hotel[] = [
  {
    id: '1',
    name: 'Marina Beach Colombo',
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=500',
    location: 'Colombo',
    price: 'Starting from $70/night'
  },
  {
    id: '2',
    name: 'Grandhall Resort',
    image: 'https://images.unsplash.com/photo-1561501878-aabd62634533?q=80&w=500',
    location: 'Colombo',
    price: 'Starting from $120/night'
  },
  {
    id: '3',
    name: 'Airport',
    image: 'https://images.unsplash.com/photo-1523592121529-f6dde35f079e?q=80&w=500',
    location: 'Katunayaka',
    price: 'Starting from $90/night'
  },
  {
    id: '4',
    name: 'Bay Inn',
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=500',
    location: 'Galle',
    price: 'Starting from $100/night'
  }
];

// Sample travel partners data
const TRAVEL_PARTNERS: TravelPartner[] = [
  {
    id: '1',
    name: 'Emma R.',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=500',
    interests: ['Beaches', 'Hiking', 'Culture'],
    compatibility: 92,
    trips: 15
  },
  {
    id: '2',
    name: 'Michael K.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=500',
    interests: ['Photography', 'Food', 'History'],
    compatibility: 85,
    trips: 8
  },
  {
    id: '3',
    name: 'Sarah J.',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=500',
    interests: ['Adventure', 'Nature', 'Nightlife'],
    compatibility: 78,
    trips: 12
  },
  {
    id: '4',
    name: 'David L.',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=500',
    interests: ['Mountains', 'Local Cuisine', 'Museums'],
    compatibility: 72,
    trips: 6
  }
];

const HotelSection = () => {
  const [location, setLocation] = useState('');
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [travelers, setTravelers] = useState('1');
  const [activeTab, setActiveTab] = useState('places');

  const handleView = (hotel: Hotel) => {
    toast.success(`Viewing details for ${hotel.name}`);
  };

  const handleConnectPartner = (partner: TravelPartner) => {
    toast.success(`Connection request sent to ${partner.name}`);
  };

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16 animate-fade-in">
          <div className="max-w-5xl mx-auto mb-12">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-2">Location</div>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="text"
                      placeholder="Where are you going?"
                      className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-travely-blue"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  </div>
                </div>
                
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-2">Check-in date</div>
                  <input
                    type="date"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-travely-blue"
                    value={checkInDate}
                    onChange={(e) => setCheckInDate(e.target.value)}
                  />
                </div>
                
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-2">Check-out date</div>
                  <input
                    type="date"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-travely-blue"
                    value={checkOutDate}
                    onChange={(e) => setCheckOutDate(e.target.value)}
                  />
                </div>

                <div>
                  <div className="text-sm font-medium text-gray-700 mb-2">Travelers</div>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <select
                      className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-travely-blue appearance-none"
                      value={travelers}
                      onChange={(e) => setTravelers(e.target.value)}
                    >
                      <option value="1">1 Traveler</option>
                      <option value="2">2 Travelers</option>
                      <option value="3">3 Travelers</option>
                      <option value="4">4 Travelers</option>
                      <option value="5+">5+ Travelers</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-center">
                <button className="bg-travely-blue hover:bg-travely-dark-blue text-white px-6 py-2 rounded-md transition-colors duration-300 flex items-center">
                  <Search size={18} className="mr-2" />
                  Search & Find Travel Partners
                </button>
              </div>
            </div>
          </div>
          
          <div className="flex justify-between items-center mb-6">
            <div className="tabs border-b w-full">
              <button 
                className={`py-2 px-4 mr-4 font-medium ${activeTab === 'places' ? 'text-travely-blue border-b-2 border-travely-blue' : 'text-gray-500'}`}
                onClick={() => setActiveTab('places')}
              >
                Places to Stay
              </button>
              <button 
                className={`py-2 px-4 mr-4 font-medium ${activeTab === 'partners' ? 'text-travely-blue border-b-2 border-travely-blue' : 'text-gray-500'}`}
                onClick={() => setActiveTab('partners')}
              >
                Travel Partners
              </button>
            </div>
          </div>
        </div>
        
        {activeTab === 'places' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {HOTELS.map((hotel, index) => (
              <div 
                key={hotel.id} 
                className="bg-white rounded-lg shadow-md overflow-hidden hover-card animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="h-48 overflow-hidden">
                  <img 
                    src={hotel.image} 
                    alt={hotel.name} 
                    className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{hotel.name}</h3>
                  <div className="flex items-center text-gray-500 text-sm mb-2">
                    <MapPin className="mr-1" size={14} />
                    <span>{hotel.location}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">{hotel.price}</p>
                  <button
                    onClick={() => handleView(hotel)}
                    className="w-full px-4 py-2 bg-travely-blue text-white rounded-md hover:bg-travely-dark-blue transition-colors duration-300 text-sm"
                  >
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {TRAVEL_PARTNERS.map((partner, index) => (
              <div 
                key={partner.id} 
                className="bg-white rounded-lg shadow-md overflow-hidden hover-card animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="h-48 overflow-hidden relative">
                  <img 
                    src={partner.image} 
                    alt={partner.name} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-travely-blue text-white text-xs font-bold px-2 py-1 rounded-full">
                    {partner.compatibility}% Match
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{partner.name}</h3>
                  <div className="flex flex-wrap gap-1 my-2">
                    {partner.interests.map((interest, i) => (
                      <span key={i} className="text-xs bg-travely-light-blue text-travely-blue px-2 py-1 rounded-full">
                        {interest}
                      </span>
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 mb-4">{partner.trips} trips completed</p>
                  <button
                    onClick={() => handleConnectPartner(partner)}
                    className="w-full px-4 py-2 bg-travely-blue text-white rounded-md hover:bg-travely-dark-blue transition-colors duration-300 text-sm"
                  >
                    Connect
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default HotelSection;
