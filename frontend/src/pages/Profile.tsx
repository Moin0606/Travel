import Navbar from '@/components/layout/Navbar';
import { Mail, Home, CalendarCheck, BadgeCheck, UserCircle } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore'; // Adjust path if needed
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { authUser } = useAuthStore();
  const navigate = useNavigate();

  if (!authUser) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="pt-16 md:pt-24">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden animate-fade-in p-8">
            
            {/* Avatar & Username */}
            <div className="flex flex-col items-center mb-8">
              <div className="h-32 w-32 rounded-full overflow-hidden border-4 border-blue-400 shadow-md mb-4">
                <img 
                  src={authUser.profilePicture || `https://api.dicebear.com/7.x/adventurer/svg?seed=${authUser?.username || "User"}`} 
                  alt={authUser.username} 
                  className="w-full h-full object-cover"
                />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900">{authUser.username}</h2>
              <p className="text-sm text-gray-500">Welcome to your profile</p>
            </div>

            {/* Profile Info Section */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
             

              {/* Email */}
              <div className="flex flex-col items-center bg-gray-100 rounded-lg p-4">
                <Mail className="text-blue-500 mb-2" size={22} />
                <p className="text-xs text-gray-500">Email</p>
                <p className="text-sm font-semibold text-gray-800">{authUser.email}</p>
              </div>

              {/* Age */}
              <div className="flex flex-col items-center bg-gray-100 rounded-lg p-4">
                <CalendarCheck className="text-blue-500 mb-2" size={22} />
                <p className="text-xs text-gray-500">Age</p>
                <p className="text-sm font-semibold text-gray-800">{authUser.age} years</p>
              </div>

              {/* Gender */}
              <div className="flex flex-col items-center bg-gray-100 rounded-lg p-4">
                <UserCircle className="text-blue-500 mb-2" size={22} />
                <p className="text-xs text-gray-500">Gender</p>
                <p className="text-sm font-semibold text-gray-800 capitalize">{authUser.gender}</p>
              </div>

              {/* Mobile Number */}
                <div className="flex flex-col items-center bg-gray-100 rounded-lg p-4">
                  <BadgeCheck className="text-blue-500 mb-2" size={22} />
                  <p className="text-xs text-gray-500">Mobile Number</p>
                  <p className="text-sm font-semibold text-gray-800">{authUser.phoneNumber}</p>
                </div>

              {/* Address */}
              <div className="flex flex-col items-center bg-gray-100 rounded-lg p-4 col-span-1 sm:col-span-2">
                <Home className="text-blue-500 mb-2" size={22} />
                <p className="text-xs text-gray-500">Address</p>
                <p className="text-sm font-semibold text-gray-800 text-center">{authUser.address}</p>
              </div>
            </div>

            {/* Verification */}
            {authUser.verificationImage && (
              <div className="pt-6 text-center">
                <h4 className="text-sm font-medium text-gray-500 mb-2">Verification</h4>
                <img 
                  src={authUser.verificationImage} 
                  alt="Verified Badge" 
                  className="h-12 mx-auto"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
