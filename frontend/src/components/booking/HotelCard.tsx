
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Star, DollarSign } from 'lucide-react';
import { Hotel } from '@/types/booking';

interface HotelCardProps {
  hotel: Hotel;
  onClick: () => void;
}

export const HotelCard: React.FC<HotelCardProps> = ({ hotel, onClick }) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-48 w-full overflow-hidden">
        <img
          src={hotel.image}
          alt={hotel.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        <div className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md">
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="text-xs font-semibold ml-1">{hotel.rating}</span>
          </div>
        </div>
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-bold text-lg">{hotel.name}</h3>
        
        <div className="flex items-center mt-1 text-gray-500">
          <MapPin className="h-4 w-4 mr-1" />
          <span className="text-sm">{hotel.location}</span>
        </div>
        
        <div className="mt-2 flex flex-wrap gap-1">
          {hotel.amenities.slice(0, 3).map((amenity, index) => (
            <span 
              key={index}
              className="inline-block px-2 py-1 text-xs bg-gray-100 rounded-md text-gray-700"
            >
              {amenity}
            </span>
          ))}
          {hotel.amenities.length > 3 && (
            <span className="inline-block px-2 py-1 text-xs bg-gray-100 rounded-md text-gray-700">
              +{hotel.amenities.length - 3} more
            </span>
          )}
        </div>
        
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center">
            <DollarSign className="h-4 w-4 text-travely-blue" />
            <span className="font-bold text-lg text-travely-blue">{hotel.price}</span>
            <span className="text-xs text-gray-500 ml-1">/ night</span>
          </div>
          
          <Button 
            onClick={onClick}
            className="bg-travely-blue hover:bg-travely-dark-blue"
            size="sm"
          >
            Book Now
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
