import React, { useState, useEffect } from "react";
import { Image, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import axios from "axios";

interface PostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void; // Callback after successful post
}

const PostModal: React.FC<PostModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [destination, setDestination] = useState("");
  const [description, setDescription] = useState("");
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    if (!destination.trim() || !description.trim() || !uploadedImage) return;

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("destination", destination);
      formData.append("description", description);
      formData.append("images", uploadedImage); // Assuming the API expects a single file

      await axios.post("/api/posts", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      onSubmit(); // Refresh post feed or show toast
      resetForm();
    } catch (error: any) {
      console.error("Error creating post:", error.message);
      alert("Failed to create post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setDestination("");
    setDescription("");
    setUploadedImage(null);
    setImagePreview(null);
    onClose();
  };

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md md:max-w-lg animate-scale-in">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Create Travel Post
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          {/* Destination */}
          <div className="space-y-2">
            <Label htmlFor="destination">Destination</Label>
            <Input
              id="destination"
              placeholder="e.g., Ella, Sigiriya, Colombo..."
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
            />
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <Label htmlFor="post-image" className="flex items-center gap-2">
              <Image size={18} />
              Add a photo
            </Label>

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

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="post-description">Description</Label>
            <Textarea
              id="post-description"
              placeholder="Share your experience..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-2">
            <Button
              onClick={handleSubmit}
              disabled={
                isSubmitting ||
                !description.trim() ||
                !uploadedImage ||
                !destination.trim()
              }
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
