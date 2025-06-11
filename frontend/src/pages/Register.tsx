import React, { ChangeEvent, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import {
  User,
  Mail,
  Lock,
  CheckCircle,
  Phone,
  MapPin,
  File as LucideFile,
  Image as LucideImage,
  Calendar,
  UserCircle,
} from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "../store/useAuthStore";
import { Input } from "@/components/ui/input";
import { useForm, SubmitHandler } from "react-hook-form";

// Define types for form data
interface TravelPreferences {
  destinations: string[];
  budgetRange: {
    min: string;
    max: string;
  };
  travelStyles: string[];
}

interface FormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  age: string;
  gender: string;
  address: string;
  phoneNumber: string;
  image: FileList;
  verificationDocument: FileList;
  destinations: string;
  budgetMin: string;
  budgetMax: string;
  travelStyles: string[];
}

const Register = () => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [docPreview, setDocPreview] = useState<string | null>(null);
  const { signup } = useAuthStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    setValue,
    watch,
  } = useForm<FormData>();

  // Watch passwords to validate confirmation
  const password = watch("password");
  const confirmPassword = watch("confirmPassword");

  const onSubmit: SubmitHandler<FormData> = (data) => {
    const formData = new FormData();

    // Validate password match
    if (data.password !== data.confirmPassword) {
      setError("confirmPassword", {
        type: "manual",
        message: "Passwords do not match",
      });
      return;
    }

    // Append basic fields
    formData.append("username", data.username);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("age", data.age);
    formData.append("gender", data.gender);
    formData.append("address", data.address);
    formData.append("phoneNumber", data.phoneNumber);

    // Append files
    if (data.image && data.image[0]) {
      formData.append("image", data.image[0]);
    }
    if (data.verificationDocument && data.verificationDocument[0]) {
      formData.append("verificationDocument", data.verificationDocument[0]);
    }

    // Parse travel preferences
    const travelPreferences = {
      destinations: data.destinations.split(",").map((d) => d.trim()),
      budgetRange: {
        min: data.budgetMin,
        max: data.budgetMax,
      },
      travelStyles: data.travelStyles || [],
    };

    formData.append("travelPreferences", JSON.stringify(travelPreferences));

    // Call signup
    signup(formData);
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDocChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setDocPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-16 md:pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden animate-scale-in">
            <div className="p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
                SIGN UP
              </h2>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Username */}
                <InputField
                  id="username"
                  icon={<User size={18} />}
                  placeholder="Enter your full username"
                  register={register}
                  name="username"
                  error={errors.username?.message}
                />

                {/* Email */}
                <InputField
                  id="email"
                  icon={<Mail size={18} />}
                  placeholder="Enter your email"
                  register={register}
                  name="email"
                  error={errors.email?.message}
                />

                {/* Password */}
                <InputField
                  id="password"
                  icon={<Lock size={18} />}
                  placeholder="Create a password"
                  type="password"
                  register={register}
                  name="password"
                  error={errors.password?.message}
                />

                {/* Confirm Password */}
                <InputField
                  id="confirmPassword"
                  icon={<CheckCircle size={18} />}
                  placeholder="Confirm your password"
                  type="password"
                  register={register}
                  name="confirmPassword"
                  error={errors.confirmPassword?.message}
                />

                {/* Age */}
                <InputField
                  id="age"
                  icon={<Calendar size={18} />}
                  placeholder="Enter your age"
                  type="number"
                  register={register}
                  name="age"
                  error={errors.age?.message}
                />

                {/* Gender */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gender
                  </label>
                  <select
                    {...register("gender", { required: "Gender is required" })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                  {errors.gender && (
                    <span className="text-red-500 text-xs mt-1 block">
                      {errors.gender.message}
                    </span>
                  )}
                </div>

                {/* Address */}
                <InputField
                  id="address"
                  icon={<MapPin size={18} />}
                  placeholder="Enter your address"
                  register={register}
                  name="address"
                  error={errors.address?.message}
                />

                {/* Phone Number */}
                <InputField
                  id="phoneNumber"
                  icon={<Phone size={18} />}
                  placeholder="Enter your phone number"
                  register={register}
                  name="phoneNumber"
                  error={errors.phoneNumber?.message}
                />

                {/* Profile Picture Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Profile Picture
                  </label>
                  <Input
                    id="image"
                    type="file"
                    accept="image/jpeg, image/png, image/webp"
                    {...register("image", { required: "Profile picture is required" })}
                  />
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="mt-2 w-full h-32 object-cover rounded-md"
                    />
                  )}
                  {errors.image && (
                    <span className="text-red-500 text-xs mt-1 block">
                      {errors.image.message}
                    </span>
                  )}
                </div>

                {/* Destinations */}
                <InputField
                  id="destinations"
                  icon={<MapPin size={18} />}
                  placeholder="Enter destinations (comma-separated)"
                  register={register}
                  name="destinations"
                  error={errors.destinations?.message}
                />

                {/* Budget Range */}
                <div className="flex gap-4">
                  <InputField
                    id="budgetMin"
                    icon={<LucideFile size={18} />}
                    placeholder="Min Budget"
                    type="number"
                    register={register}
                    name="budgetMin"
                    error={errors.budgetMin?.message}
                  />
                  <InputField
                    id="budgetMax"
                    icon={<LucideFile size={18} />}
                    placeholder="Max Budget"
                    type="number"
                    register={register}
                    name="budgetMax"
                    error={errors.budgetMax?.message}
                  />
                </div>

                {/* Travel Styles */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Travel Styles
                  </label>
                  <select
                    multiple
                    {...register("travelStyles")}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Family">Family</option>
                    <option value="Luxury">Luxury</option>
                    <option value="Adventure">Adventure</option>
                    <option value="Backpacker">Backpacker</option>
                  </select>
                  {errors.travelStyles && (
                    <span className="text-red-500 text-xs mt-1 block">
                      {errors.travelStyles.message}
                    </span>
                  )}
                </div>

                {/* Verification Document */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Verification Document
                  </label>
                  <Input
                    id="verificationDocument"
                    type="file"
                    accept="image/jpeg, image/png, image/webp"
                    {...register("verificationDocument", {
                      required: "Verification document is required",
                    })}
                  />
                  {docPreview && (
                    <img
                      src={docPreview}
                      alt="Preview"
                      className="mt-2 w-full scale-50 object-cover rounded-md"
                    />
                  )}
                  {errors.verificationDocument && (
                    <span className="text-red-500 text-xs mt-1 block">
                      {errors.verificationDocument.message}
                    </span>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full bg-travely-blue text-white font-medium py-2 rounded-md hover:bg-travely-dark-blue transition-colors duration-300"
                >
                  Sign Up
                </button>
              </form>
              <div className="mt-8 border-t border-gray-200 pt-6 text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="text-travely-blue font-medium hover:text-travely-dark-blue"
                  >
                    Sign In
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable input field component
type InputFieldProps = {
  id: string;
  icon: React.ReactNode;
  placeholder: string;
  type?: string;
  register: any;
  name: string;
  error?: string;
};

const InputField = ({
  id,
  icon,
  placeholder,
  type = "text",
  register,
  name,
  error,
}: InputFieldProps) => (
  <div>
    <label
      htmlFor={id}
      className="block text-sm font-medium text-gray-700 mb-1 capitalize"
    >
      {id.replace(/([A-Z])/g, " $1")}
    </label>
    <div className="relative">
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
        {icon}
      </div>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        className={`w-full pl-10 px-4 py-2 border ${
          error ? "border-red-500" : "border-gray-300"
        } rounded-md focus:outline-none focus:ring-2 focus:ring-travely-blue`}
        {...register(name, { required: `${name} is required` })}
      />
    </div>
    {error && <span className="text-red-500 text-xs mt-1 block">{error}</span>}
  </div>
);

export default Register;