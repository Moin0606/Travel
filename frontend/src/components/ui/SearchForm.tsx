
import React, { useState } from 'react';
import { Search, Calendar, Users, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchFormProps {
  className?: string;
  onSubmit?: (formData: any) => void;
}

const SearchForm: React.FC<SearchFormProps> = ({ className, onSubmit }) => {
  const [destination, setDestination] = useState('');
  const [duration, setDuration] = useState('');
  const [people, setPeople] = useState('');
  const [dates, setDates] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit({
        destination,
        duration,
        people,
        dates
      });
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className={cn(
        "glass-card p-6 rounded-lg grid grid-cols-1 md:grid-cols-4 gap-4 transform animate-scale-in",
        className
      )}
    >
      <div className="relative">
        <label htmlFor="destination" className="block text-sm font-medium text-gray-700 mb-1">Type a destination</label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            id="destination"
            type="text"
            placeholder="Where are you going?"
            className="search-input pl-10 w-full"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          />
        </div>
      </div>
      
      <div>
        <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">Select Duration</label>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <select
            id="duration"
            className="search-input pl-10 w-full appearance-none"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          >
            <option value="">Select days</option>
            <option value="1-3">1-3 days</option>
            <option value="4-7">4-7 days</option>
            <option value="8-14">8-14 days</option>
            <option value="15+">15+ days</option>
          </select>
        </div>
      </div>
      
      <div>
        <label htmlFor="people" className="block text-sm font-medium text-gray-700 mb-1">Add People</label>
        <div className="relative">
          <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <select
            id="people"
            className="search-input pl-10 w-full appearance-none"
            value={people}
            onChange={(e) => setPeople(e.target.value)}
          >
            <option value="">How many?</option>
            <option value="1">1 person</option>
            <option value="2">2 people</option>
            <option value="3">3 people</option>
            <option value="4">4 people</option>
            <option value="5+">5+ people</option>
          </select>
        </div>
      </div>
      
      <div>
        <label htmlFor="dates" className="block text-sm font-medium text-gray-700 mb-1 opacity-0 md:opacity-100">Search</label>
        <button
          type="submit"
          className="btn-primary w-full h-[46px] flex items-center justify-center"
        >
          <Search className="mr-2" size={18} />
          Explore
        </button>
      </div>
    </form>
  );
};

export default SearchForm;
