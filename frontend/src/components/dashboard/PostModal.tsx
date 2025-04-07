
import React, { useState } from "react";
import { Image, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface PostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

const PostModal: React.FC<PostModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [description, setDescription] = useState("");
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedImage(file);
      
      // Create a preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleSubmit = () => {
    if (!description.trim() && !uploadedImage) {
      return; // Don't submit if both description and image are empty
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      resetForm();
      onSubmit();
    }, 1000);
  };

  const resetForm = () => {
    setDescription("");
    setUploadedImage(null);
    setImagePreview(null);
  };

  // Clean up any object URLs when component unmounts or when imagePreview changes
  React.useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md md:max-w-lg animate-scale-in">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Create Travel Post</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 mt-2">
          {/* Image Upload Section */}
          <div className="space-y-2">
            <Label htmlFor="post-image" className="flex items-center gap-2">
              <Image size={18} />
              Add a photo
            </Label>
            
            <div className="grid gap-2">
              <Input
                id="post-image"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="cursor-pointer"
              />
              
              {imagePreview && (
                <div className="relative mt-2 rounded-md overflow-hidden border border-gray-200">
                  <img 
                    src={imagePreview} 
                    alt="Image preview" 
                    className="w-full h-48 object-cover"
                  />
                  <Button
                    type="button"
                    size="icon"
                    variant="destructive"
                    className="absolute top-2 right-2 h-8 w-8 rounded-full"
                    onClick={() => {
                      URL.revokeObjectURL(imagePreview);
                      setImagePreview(null);
                      setUploadedImage(null);
                    }}
                  >
                    <X size={16} />
                  </Button>
                </div>
              )}
            </div>
          </div>
          
          {/* Description Textbox */}
          <div className="space-y-2">
            <Label htmlFor="post-description">Share your travel experience</Label>
            <Textarea
              id="post-description"
              placeholder="What's your travel story?"
              value={description}
              onChange={handleDescriptionChange}
              rows={4}
              className="resize-none"
            />
          </div>
          
          {/* Submit Button */}
          <div className="flex justify-end pt-2">
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || (!description.trim() && !uploadedImage)}
              className="bg-travely-blue hover:bg-travely-dark-blue transition-colors"
            >
              <Send size={16} className="mr-2" />
              {isSubmitting ? "Posting..." : "Post"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PostModal;
