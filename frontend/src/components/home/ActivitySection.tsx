
import React, { useState } from 'react';
import { Search, Calendar, Clock, Tag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface Activity {
  id: string;
  title: string;
  image: string;
  description: string;
  time: string;
}

const ACTIVITIES: Activity[] = [
  {
    id: '1',
    title: 'Boat Safari',
    image: 'https://images.unsplash.com/photo-1584637904683-5ed617b6b3f4?q=80&w=500',
    description: 'A boat safari is a type of safari that takes place on water. It is a great way to see wildlife.',
    time: '09:00 - 16:30'
  },
  {
    id: '2',
    title: 'Music Fiesta',
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=500',
    description: 'Enjoy vibrant beach party with a diverse music festival. The music event hosts famous DJs.',
    time: '15:00 - 23:00'
  }
];

const ActivitySection = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [category, setCategory] = useState('');

  const handleView = (activity: Activity) => {
    toast.success(`Viewing details for ${activity.title}`);
  };

  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16 animate-scale-in">
          <h2 className="inline-block text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            FIND THE <span className="text-travely-blue">SPECIAL ACTIVITY</span><br />
            FOR YOUR NEXT STAY TODAY!
          </h2>
          <p className="text-gray-600">EXPLORE OUR ACTIVITIES</p>
        </div>
        
        {/* Search Bar */}
        <div className="max-w-4xl mx-auto mb-12 animate-fade-in">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search activities..."
                  className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-travely-blue"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button 
                className="bg-travely-blue text-white px-6 py-2 rounded-md hover:bg-travely-dark-blue transition-colors duration-300"
                onClick={() => toast.success('Searching for activities...')}
              >
                Search
              </button>
            </div>
          </div>
        </div>
        
        {/* Filters */}
        <div className="max-w-5xl mx-auto mb-12 animate-slide-up">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Filter Activities</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <div className="text-sm font-medium text-gray-700 mb-2">Start Date</div>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="date"
                    className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-travely-blue"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <div className="text-sm font-medium text-gray-700 mb-2">End Date</div>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="date"
                    className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-travely-blue"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <div className="text-sm font-medium text-gray-700 mb-2">Category</div>
                <div className="relative">
                  <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <select
                    className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-travely-blue appearance-none"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="">All Categories</option>
                    <option value="adventure">Adventure</option>
                    <option value="cultural">Cultural</option>
                    <option value="wellness">Wellness</option>
                    <option value="water">Water Sports</option>
                    <option value="music">Music & Events</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Activity Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-slide-up">
          {ACTIVITIES.map((activity, index) => (
            <div 
              key={activity.id} 
              className={cn(
                "bg-white rounded-lg shadow-md overflow-hidden flex hover-card",
                index === 0 ? "animate-fade-in [animation-delay:200ms]" : "animate-fade-in [animation-delay:400ms]"
              )}
            >
              <div className="w-1/3">
                <img
                  src={activity.image}
                  alt={activity.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="w-2/3 p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{activity.title}</h3>
                <p className="text-gray-600 mb-4 text-sm">{activity.description}</p>
                <div className="flex items-center text-gray-500 text-sm mb-4">
                  <Clock className="mr-1" size={14} />
                  <span>{activity.time}</span>
                </div>
                <button
                  onClick={() => handleView(activity)}
                  className="px-4 py-1 bg-travely-blue text-white rounded-md hover:bg-travely-dark-blue transition-colors duration-300 text-sm"
                >
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ActivitySection;
