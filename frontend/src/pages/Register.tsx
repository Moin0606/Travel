import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import {
  User,
  Mail,
  Lock,
  CheckCircle,
  Phone,
  MapPin,
  File,
  Image,
  Calendar,
  UserCircle,
} from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "../store/useAuthStore";

const Register = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { signup } = useAuthStore();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    profilePicture: "",
    age: "",
    gender: "",
    address: "",
    phoneNumber: "",
    verificationDocument: "",
    travelPreferences: {
      destinations: [],
      budgetRange: { min: "", max: "" },
      travelStyles: [],
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const {
      username,
      email,
      password,
      profilePicture,
      age,
      gender,
      address,
      phoneNumber,
      verificationDocument,
    } = formData;

    if (
      !username ||
      !email ||
      !password ||
      !confirmPassword ||
      !profilePicture ||
      !age ||
      !gender ||
      !address ||
      !phoneNumber ||
      !verificationDocument
    ) {
      toast.error("Please fill in all fields");
      return;
    }

    if (formData.password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setFormData((prev) => ({ ...prev, password }));

    signup(formData);
    toast.success("Registration successful!");
    setFormData({
      username: "",
      email: "",
      password: "",
      profilePicture: "",
      age: "",
      gender: "",
      address: "",
      phoneNumber: "",
      verificationDocument: "",
      travelPreferences: {
        destinations: [],
        budgetRange: { min: "", max: "" },
        travelStyles: [],
      },
    });
    setPassword("");
    setConfirmPassword("");
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

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Full Name */}
                <InputField
                  id="username"
                  icon={<User size={18} />}
                  placeholder="Enter your full username"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                />

                {/* Email */}
                <InputField
                  id="email"
                  icon={<Mail size={18} />}
                  placeholder="Enter your email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />

                {/* Password */}
                <InputField
                  id="password"
                  icon={<Lock size={18} />}
                  placeholder="Create a password"
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setFormData({ ...formData, password: e.target.value });
                  }}
                />

                {/* Confirm Password */}
                <InputField
                  id="confirmPassword"
                  icon={<CheckCircle size={18} />}
                  placeholder="Confirm your password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />

                {/* Age */}
                <InputField
                  id="age"
                  icon={<Calendar size={18} />}
                  placeholder="Enter your age"
                  type="number"
                  value={formData.age}
                  onChange={(e) =>
                    setFormData({ ...formData, age: e.target.value })
                  }
                />

                {/* Gender */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gender
                  </label>
                  <div className="flex items-center gap-2">
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={(e) =>
                        setFormData({ ...formData, gender: e.target.value })
                      }
                      className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                    <UserCircle size={18} className="text-gray-500" />
                  </div>
                </div>
                {/* Address */}
                <InputField
                  id="address"
                  icon={<MapPin size={18} />}
                  placeholder="Enter your address"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                />

                {/* Phone Number */}
                <InputField
                  id="phoneNumber"
                  icon={<Phone size={18} />}
                  placeholder="Enter your phone number"
                  value={formData.phoneNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, phoneNumber: e.target.value })
                  }
                />

                {/* Profile Picture URL */}
                <InputField
                  id="profilePicture"
                  icon={<Image size={18} />}
                  placeholder="Profile picture URL"
                  value={formData.profilePicture}
                  onChange={(e) =>
                    setFormData({ ...formData, profilePicture: e.target.value })
                  }
                />

                {/* Travel Destinations */}
                <InputField
                  id="destinations"
                  icon={<MapPin size={18} />}
                  placeholder="Enter destinations (comma-separated)"
                  value={formData.travelPreferences.destinations.join(", ")}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      travelPreferences: {
                        ...formData.travelPreferences,
                        destinations: e.target.value
                          .split(",")
                          .map((dest) => dest.trim()),
                      },
                    })
                  }
                />

                {/* Budget Range */}
                <div className="flex gap-4">
                  <InputField
                    id="budgetMin"
                    icon={<File size={18} />}
                    placeholder="Min Budget"
                    type="number"
                    value={formData.travelPreferences.budgetRange.min}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        travelPreferences: {
                          ...formData.travelPreferences,
                          budgetRange: {
                            ...formData.travelPreferences.budgetRange,
                            min: e.target.value,
                          },
                        },
                      })
                    }
                  />
                  <InputField
                    id="budgetMax"
                    icon={<File size={18} />}
                    placeholder="Max Budget"
                    type="number"
                    value={formData.travelPreferences.budgetRange.max}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        travelPreferences: {
                          ...formData.travelPreferences,
                          budgetRange: {
                            ...formData.travelPreferences.budgetRange,
                            max: e.target.value,
                          },
                        },
                      })
                    }
                  />
                </div>

                {/* Travel Styles */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Travel Styles
                  </label>
                  <div className="flex items-center gap-2">
                    <select
                      multiple
                      name="travelStyles"
                      value={formData.travelPreferences.travelStyles}
                      onChange={(e) => {
                        const selectedOptions = Array.from(
                          e.target.selectedOptions
                        ).map((option) => option.value);
                        setFormData({
                          ...formData,
                          travelPreferences: {
                            ...formData.travelPreferences,
                            travelStyles: selectedOptions,
                          },
                        });
                      }}
                      className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Family">Family</option>
                      <option value="Luxury">Luxury</option>
                      <option value="Adventure">Adventure</option>
                      <option value="Backpacker">Backpacker</option>
                    </select>
                    <User size={18} className="text-gray-500" />
                  </div>
                </div>

                {/* Verification Document URL */}
                <InputField
                  id="verificationDocument"
                  icon={<File size={18} />}
                  placeholder="Verification document URL"
                  value={formData.verificationDocument}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      verificationDocument: e.target.value,
                    })
                  }
                />

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
const InputField = ({
  id,
  icon,
  placeholder,
  type = "text",
  value,
  onChange,
}: {
  id: string;
  icon: React.ReactNode;
  placeholder: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => (
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
        className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-travely-blue"
        value={value}
        onChange={onChange}
      />
    </div>
  </div>
);

export default Register;
