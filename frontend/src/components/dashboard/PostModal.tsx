import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { axiosInstance } from "../../lib/axios";

interface PostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

const PostModal: React.FC<PostModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  // Handle image file selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setValue("image", file); // Set the file in the form state
    }
  };

  // Submit handler
  const onSubmitHandler = async (data: any) => {
    try {
      setLoading(true);

      // Prepare form data for submission
      const formData = new FormData();
      formData.append("destination", data.destination);
      formData.append("travelDates.start", data["travelDates.start"]);
      formData.append("travelDates.end", data["travelDates.end"]);
      if (data.image) formData.append("image", data.image);
      if (data.description) formData.append("description", data.description);
      if (data.budget) formData.append("budget", data.budget);
      if (data.travelStyle) formData.append("travelStyle", data.travelStyle);
      if (data.requirements.minAge)
        formData.append("requirements.minAge", data.requirements.minAge);
      if (data.requirements.maxAge)
        formData.append("requirements.maxAge", data.requirements.maxAge);
      if (data.requirements.genderPreference)
        formData.append(
          "requirements.genderPreference",
          data.requirements.genderPreference
        );

      // Send POST request to create a travel post
      await axiosInstance.post("/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Close modal and trigger success callback
      onSubmit();
      onClose();
    } catch (error) {
      console.error("Error creating travel post:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-fit max-h-[90vh] overflow-scroll no-scrollbar">
        <DialogHeader>
          <DialogTitle>Create Travel Post</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(onSubmitHandler)}
          className="space-y-4 grid grid-cols-2 grid-flow-row gap-x-6 gap-y-4"
        >
          <div className="col-span-2 gap-4">
            {/* Destination */}
            <div>
              <Label htmlFor="destination" className="flex flex-col gap-4">
                Destination
              </Label>
              <Input
                id="destination"
                placeholder="Enter destination"
                {...register("destination", {
                  required: "Destination is required",
                })}
              />
              {errors.destination && (
                <p className="text-red-500 text-sm">
                  {errors.destination.message}
                </p>
              )}
            </div>
            {/* Travel Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="start-date">Start Date</Label>
                <Input
                  id="start-date"
                  type="date"
                  {...register("travelDates.start", {
                    required: "Start date is required",
                  })}
                />
                {errors.travelDates?.start && (
                  <p className="text-red-500 text-sm">
                    {errors.travelDates.start.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="end-date">End Date</Label>
                <Input
                  id="end-date"
                  type="date"
                  {...register("travelDates.end", {
                    required: "End date is required",
                  })}
                />
                {errors.travelDates?.end && (
                  <p className="text-red-500 text-sm">
                    {errors.travelDates.end.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Image Upload */}
          <div className="col-span-2">
            <Label htmlFor="image">Image (Optional)</Label>
            <Input
              id="image"
              type="file"
              accept="image/jpeg, image/png, image/webp"
              onChange={handleImageChange}
            />
            {imagePreview && (
              <div className="">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-32 object-cover rounded-md"
                />
              </div>
            )}
          </div>

          {/* Description */}
          <div className="col-span-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Describe your trip..."
              {...register("description")}
            />
          </div>

          {/* Budget */}
          <div>
            <Label htmlFor="budget">Budget (Optional)</Label>
            <Input
              id="budget"
              type="number"
              placeholder="Enter budget"
              {...register("budget", { valueAsNumber: true })}
            />
          </div>

          {/* Travel Style */}
          <div>
            <Label htmlFor="travel-style">Travel Style (Optional)</Label>
            <Select
              onValueChange={(value) => setValue("travelStyle", value)}
              defaultValue={watch("travelStyle")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select travel style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="adventure">Adventure</SelectItem>
                <SelectItem value="luxury">Luxury</SelectItem>
                <SelectItem value="backpacker">Backpacker</SelectItem>
                <SelectItem value="family">Family</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Requirements */}
          <div className="col-span-2 space-y-2">
            <h3 className="font-medium text-gray-800">
              Age Requirements (Optional)
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <Input
                type="number"
                placeholder="Min Age"
                {...register("requirements.minAge", { valueAsNumber: true })}
              />
              <Input
                type="number"
                placeholder="Max Age"
                {...register("requirements.maxAge", { valueAsNumber: true })}
              />
            </div>
            <Select
              onValueChange={(value) =>
                setValue("requirements.genderPreference", value)
              }
              defaultValue={watch("requirements.genderPreference")}
            >
              <h3 className="font-medium text-gray-800">Gender Preference</h3>
              <SelectTrigger>
                <SelectValue placeholder="any" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="any">Any</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="col-span-2 flex justify-end">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Post"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PostModal;
