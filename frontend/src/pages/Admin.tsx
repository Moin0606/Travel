
import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import { 
  Users, 
  Hotel, 
  Package, 
  Car, 
  Train, 
  Utensils, 
  Calendar, 
  ClipboardList, 
  Settings 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import UserManagement from '@/components/admin/UserManagement';
import { useAuthStore } from "../store/useAuthStore";
import { useNavigate } from 'react-router-dom';

interface AdminMenuItem {
  id: string;
  name: string;
  icon: React.ElementType;
}

const ADMIN_MENU: AdminMenuItem[] = [
  { id: 'users', name: 'User Management', icon: Users },
  { id: 'hotels', name: 'Hotel Management', icon: Hotel },
  { id: 'packages', name: 'Tour Packages', icon: Package },
  { id: 'vehicles', name: 'Vehicle Management', icon: Car },
  { id: 'trains', name: 'Train Management', icon: Train },
  { id: 'restaurants', name: 'Restaurant Management', icon: Utensils },
  { id: 'events', name: 'Event Management', icon: Calendar },
  { id: 'reservations', name: 'Reservation Management', icon: ClipboardList },
  { id: 'other', name: 'Other', icon: Settings },
];

const Admin = () => {
  const navigate =useNavigate();

  const {authUser}=useAuthStore();
  if (!authUser){
    navigate('/');
  }
  const [activeMenuItem, setActiveMenuItem] = useState('users');
  
  const handleMenuItemClick = (id: string) => {
    setActiveMenuItem(id);
    toast.success(`${ADMIN_MENU.find(item => item.id === id)?.name} selected`);
  };
  
  const renderContent = () => {
    switch (activeMenuItem) {
      case 'users':
        return <UserManagement />;
      default:
        return (
          <div>
            <h3 className="text-xl font-semibold mb-4">
              {ADMIN_MENU.find(item => item.id === activeMenuItem)?.name}
            </h3>
            
            <p className="text-gray-500">
              This is a placeholder for the {ADMIN_MENU.find(item => item.id === activeMenuItem)?.name.toLowerCase()} interface. 
              In a complete implementation, this area would contain the relevant management tools and data.
            </p>
          </div>
        );
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-16 md:pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden animate-fade-in">
            <div className="p-6 md:p-8">
              <h2 className="text-2xl font-bold text-travely-blue mb-2">Travely Admin</h2>
              <p className="text-sm text-gray-500 mb-8">{authUser.username}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {ADMIN_MENU.map(item => (
                  <button
                    key={item.id}
                    className={cn(
                      "p-6 rounded-lg transition-all duration-300 hover:shadow-md border border-gray-200 flex items-center justify-center flex-col",
                      activeMenuItem === item.id ? "bg-travely-blue text-white shadow-md" : "bg-white text-gray-800 hover:bg-gray-50"
                    )}
                    onClick={() => handleMenuItemClick(item.id)}
                  >
                    <item.icon 
                      className={cn(
                        "h-10 w-10 mb-4",
                        activeMenuItem === item.id ? "text-white" : "text-travely-blue"
                      )} 
                    />
                    <span className="text-center font-medium">{item.name}</span>
                  </button>
                ))}
              </div>
              
              <div className="mt-10 p-6 border-t border-gray-200">
                {renderContent()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
