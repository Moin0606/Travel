import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Users, Clock } from 'lucide-react';

interface Booking {
  _id: string;
  hotelId: {
    _id: string;
    name: string;
    location: string;
    price: number;
    image: string;
    amenities: string[];
    rating: number;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
  checkIn: string;
  days: number;
  people: number;
  totalPrice: number;
}

interface Props {
  userId: string;
}

export const UserBookings: React.FC<Props> = ({ userId }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Fetching bookings for user:', userId);
        const res = await fetch('http://localhost:5000/api/book/getuserbooking', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId }),
        });

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        console.log('Received bookings data:', data);
        
        // Handle both possible response structures
        const receivedBookings = data.bookings || data || [];
        setBookings(receivedBookings);
      } catch (err) {
        console.error('Failed to fetch bookings:', err);
        setError('Failed to load bookings. Please try again later.');
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchBookings();
    } else {
      setError('No user ID provided');
      setLoading(false);
    }
  }, [userId]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Your Bookings</span>
          {!loading && (
            <span className="text-sm font-normal text-gray-500">
              {bookings.length} {bookings.length === 1 ? 'booking' : 'bookings'}
            </span>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading bookings...</div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">
            <p>{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-2 text-sm text-blue-500 hover:underline"
            >
              Try again
            </button>
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>You don't have any bookings yet.</p>
            <p className="text-sm mt-1">Book a hotel to see it here!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => {
              const checkInDate = new Date(booking.checkIn);
              const checkOutDate = new Date(checkInDate.getTime() + booking.days * 24 * 60 * 60 * 1000);

              return (
                <Card key={booking._id} className="bg-gray-50">
                  <CardContent className="p-4">
                    <div className="flex items-start">
                      <img 
                        src={booking.hotelId.image} 
                        alt={booking.hotelId.name}
                        className="w-16 h-16 object-cover rounded mr-4"
                      />
                      <div>
                        <h4 className="font-semibold">{booking.hotelId.name}</h4>
                        <p className="text-sm text-gray-500">{booking.hotelId.location}</p>
                      </div>
                    </div>

                    <div className="mt-3 space-y-2 text-sm">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                        <span>
                          {format(checkInDate, 'MMM dd, yyyy')} - {format(checkOutDate, 'MMM dd, yyyy')}
                        </span>
                      </div>

                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-gray-500" />
                        <span>{booking.days} {booking.days === 1 ? 'day' : 'days'}</span>
                      </div>

                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2 text-gray-500" />
                        <span>{booking.people} {booking.people === 1 ? 'person' : 'people'}</span>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t flex justify-between items-center">
                      <span className="text-gray-500 text-sm">Total</span>
                      <span className="font-bold text-travely-blue">${booking.totalPrice}</span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};