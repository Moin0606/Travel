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
import { useForm, SubmitHandler } from "react-hook-form";
import { useTravelPostStore } from "../../store/useTravelPostStore";

// Define the form data structure
interface FormData {
  destination: string;
  travelDates: {
    start: string;
    end: string;
  };
  image?: File | null;
  description?: string;
  budget?: number;
  travelStyle?: string;
  requirements: {
    minAge?: number;
    maxAge?: number;
    genderPreference?: string;
  };
}

interface PostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PostModal: React.FC<PostModalProps> = ({ isOpen, onClose }) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Zustand store actions
  const { createPost } = useTravelPostStore();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>();

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
  const onSubmitHandler: SubmitHandler<FormData> = async (data) => {
  try {
    setLoading(true);

    const formData = new FormData();

    // Append simple fields
    formData.append("destination", data.destination);
    if (data.description) formData.append("description", data.description);
    if (data.budget) formData.append("budget", data.budget.toString());
    if (data.travelStyle) formData.append("travelStyle", data.travelStyle);

    // Serialize nested objects
    formData.append("travelDates", JSON.stringify({
      start: data.travelDates.start,
      end: data.travelDates.end,
    }));

    formData.append("requirements", JSON.stringify({
      minAge: data.requirements.minAge ? Number(data.requirements.minAge) : undefined,
      maxAge: data.requirements.maxAge ? Number(data.requirements.maxAge) : undefined,
      genderPreference: data.requirements.genderPreference,
    }));

    // Append image if present
    if (data.image) {
      formData.append("image", data.image);
    }

    // Log all form data entries for debugging
    console.log("FormData contents:");
    for (const [key, value] of formData.entries()) {
      console.log(key, ":", value);
    }

    // Send request
    await createPost(formData);

    onClose();
  } catch (error) {
    console.error("Error creating post", error);
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
          {/* Destination */}
          <div className="col-span-2">
            <Label htmlFor="destination">Destination</Label>
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
              <div className="mt-2">
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

          {/* Footer Buttons */}
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