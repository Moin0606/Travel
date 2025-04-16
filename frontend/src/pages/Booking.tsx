import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { BookingModal } from '@/components/booking/BookingModal';
import { HotelCard } from '@/components/booking/HotelCard';
import { UserBookings } from '@/components/booking/UserBookings';
import { Hotel } from '@/types/booking';
import Navbar from '@/components/layout/Navbar';
import { useAuthStore } from "../store/useAuthStore";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Booking = () => {
    const navigate = useNavigate();
    const { authUser } = useAuthStore();
    const [HOTELS, setHotels] = useState<Hotel[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Redirect if not authenticated
    useEffect(() => {
        if (!authUser) {
            navigate('/');
        }
    }, [authUser, navigate]);

    useEffect(() => {
        const fetchHotels = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/hotel/gethotels');
                setHotels(response.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch hotels');
                setLoading(false);
            }
        };

        fetchHotels();
    }, []);

    const handleHotelClick = (hotel: Hotel) => {
        setSelectedHotel(hotel);
        setIsModalOpen(true);
    };

    const handleBooking = async (bookingData: {
        checkIn: Date;
        days: number;
        people: number;
    }) => {
        try {
            // This toast will show when the booking is successful
            toast.success('Booking confirmed successfully!');
        } catch (error) {
            console.error('Booking failed:', error);
            toast.error('Failed to confirm booking');
        }
    };

    if (!authUser) {
        return null; // or a loading spinner
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            
            <div className="pt-16 md:pt-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Hotel Listings */}
                        <div className="lg:col-span-2">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Hotels</h2>
                            
                            {loading ? (
                                <div className="text-center py-8">Loading hotels...</div>
                            ) : error ? (
                                <div className="text-center py-8 text-red-500">{error}</div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {HOTELS.map((hotel) => (
                                        <HotelCard 
                                            key={hotel._id}
                                            hotel={hotel}
                                            onClick={() => handleHotelClick(hotel)}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                        
                        {/* User Bookings */}
                        <div className="lg:col-span-1">
                            <UserBookings userId={authUser._id} />
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Booking Modal */}
            {selectedHotel && (
                <BookingModal
                    isOpen={isModalOpen}
                    hotel={selectedHotel}
                    onClose={() => setIsModalOpen(false)}
                    onBook={handleBooking}
                    userId={authUser._id}
                />
            )}
        </div>
    );
};

export default Booking;