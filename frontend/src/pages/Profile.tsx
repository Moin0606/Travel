
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import { Calendar, MapPin, Mail, Phone, Clock, Award } from 'lucide-react';
import { toast } from 'sonner';

const Profile = () => {
  // Mock user data
  const user = {
    name: 'Yasiru Deshan',
    country: 'Sri Lanka',
    email: 'yasiru@gmail.com',
    mobile: '0789055992',
    created: '25 days ago',
    updated: '2 days ago',
    points: 1600,
    status: 'Blue',
    avatar: '/lovable-uploads/dd74fe8c-3336-45b5-869c-469aacfadb39.png'
  };
  
  const handleUpdateProfile = () => {
    toast.success('Profile update feature will be available soon!');
  };
  
  const handleViewReservations = () => {
    toast.success('Reservations feature will be available soon!');
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-16 md:pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden animate-fade-in">
            <div className="p-6 md:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">My Profile</h2>
              <p className="text-sm text-travely-blue font-medium mb-6">traveler</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left Column - Avatar */}
                <div className="flex flex-col items-center space-y-6">
                  <div className="relative">
                    <div className="h-40 w-40 rounded-full overflow-hidden border-4 border-travely-light-blue">
                      <img 
                        src={user.avatar} 
                        alt={user.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  
                  <div className="text-center space-y-4 w-full">
                    <div className="bg-white rounded-lg border border-gray-200 p-4">
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Available Points</h3>
                      <p className="text-2xl font-bold text-travely-blue">{user.points}</p>
                    </div>
                    
                    <div className="bg-white rounded-lg border border-gray-200 p-4">
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Account Status</h3>
                      <p className="text-xl font-bold text-travely-blue">{user.status}</p>
                    </div>
                  </div>
                </div>
                
                {/* Right Column - User Details */}
                <div className="md:col-span-2 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Name:</h3>
                      <p className="text-gray-900 font-medium">{user.name}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Country:</h3>
                      <div className="flex items-center">
                        <MapPin className="mr-1 text-gray-400" size={16} />
                        <p className="text-gray-900">{user.country}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Email:</h3>
                      <div className="flex items-center">
                        <Mail className="mr-1 text-gray-400" size={16} />
                        <p className="text-gray-900">{user.email}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Created at:</h3>
                      <div className="flex items-center">
                        <Calendar className="mr-1 text-gray-400" size={16} />
                        <p className="text-gray-900">{user.created}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Mobile:</h3>
                      <div className="flex items-center">
                        <Phone className="mr-1 text-gray-400" size={16} />
                        <p className="text-gray-900">{user.mobile}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Updated at:</h3>
                      <div className="flex items-center">
                        <Clock className="mr-1 text-gray-400" size={16} />
                        <p className="text-gray-900">{user.updated}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-6 flex flex-col sm:flex-row gap-4">
                    <button
                      onClick={handleUpdateProfile}
                      className="btn-primary flex-1 flex justify-center items-center"
                    >
                      Update Profile
                    </button>
                    
                    <button
                      onClick={handleViewReservations}
                      className="btn-secondary flex-1 flex justify-center items-center"
                    >
                      My Reservations
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
