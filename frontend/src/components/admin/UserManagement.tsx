import React, { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogClose } from '@/components/ui/dialog';
import { Check, X, Image } from 'lucide-react';
import { toast } from 'sonner';
import { useUserStore } from '../../store/userStore'

interface User {
  _id: string;
  username: string;
  age: number;
  gender: string;
  profileImage: string;
  verificationImage: string;
  role?: string; 
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/users/getusers'); 
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        console.log(data)
        const filteredUsers = data.filter((user: User) => user.role === 'user');
        setUsers(filteredUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
        toast.error('Failed to fetch users');
        // Fallback mock users (only for dev/testing)
        // setUsers(initialUsers);
      }
    };

    fetchUsers();
  }, []);

  const handleAccept = async (userId: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/accept/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log(response)
      if (!response.ok) throw new Error('Failed to accept user');
      
      setUsers(prev => prev.filter(user => user._id !== userId));
      toast.success('User accepted successfully');
    } catch (error) {
      console.error('Error accepting user:', error);
      toast.error('Failed to accept user');
    }
  };
  
  const handleReject = async (userId: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/reject/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) throw new Error('Failed to reject user');
      
      setUsers(prev => prev.filter(user => user._id !== userId));
      toast.error('User rejected');
    } catch (error) {
      console.error('Error rejecting user:', error);
      toast.error('Failed to reject user');
    }
  };
  const openImageModal = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };
  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold text-travely-blue">User Management</h2>

      {users.length === 0 ? (
        <Card className="border-dashed border-2">
          <CardContent className="p-6 flex flex-col items-center justify-center">
            <p className="text-gray-500 text-center">No users to verify</p>
            <p className="text-sm text-gray-400 text-center mt-1">
              All users have been reviewed
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {users.map(user => (
            <Card key={user._id} className="hover:shadow-md transition-shadow duration-300">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src={user.profileImage} alt={user.username} />
                      <AvatarFallback>
                        {user.username.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{user.username}</p>
                      <div className="flex text-sm text-gray-500 space-x-4">
                        <span>Age: {user.age}</span>
                        <span>Gender: {user.gender}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center space-x-1 border-gray-300"
                      onClick={() => openImageModal(user.verificationImage)}
                    >
                      <Image size={16} />
                      <span>Verification Image</span>
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700 border-green-200"
                      onClick={() => handleAccept(user._id)}
                    >
                      <Check className="mr-1" size={16} />
                      Accept
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 border-red-200"
                      onClick={() => handleReject(user._id)}
                    >
                      <X className="mr-1" size={16} />
                      Reject
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Image Modal */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-2xl">
          <div className="flex justify-center p-2">
            <img 
              src={selectedImage || ''} 
              alt="Verification" 
              className="max-h-[70vh] object-contain rounded-md"
            />
          </div>
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement;
