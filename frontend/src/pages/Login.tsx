import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import { Mail, Lock } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "../store/useAuthStore";

const Login = () => {
  const { login, isLoggingIn } = useAuthStore();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    login(formData);
  };
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="pt-16 md:pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden animate-scale-in">
            <div className="p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
                LOGIN
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email
                  </label>
                  <div className="relative">
                    <Mail
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-travely-blue"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <Lock
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-travely-blue"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-travely-blue text-white font-medium py-2 rounded-md hover:bg-travely-dark-blue transition-colors duration-300"
                >
                  Sign In
                </button>
              </form>

              <div className="mt-6 text-center">
                <Link
                  to="/forgot-password"
                  className="text-sm text-travely-blue hover:text-travely-dark-blue"
                >
                  Forgot Password?
                </Link>
              </div>

              <div className="mt-8 border-t border-gray-200 pt-6 text-center">
                <p className="text-sm text-gray-600">
                  Not a member yet?{" "}
                  <Link
                    to="/register"
                    className="text-travely-blue font-medium hover:text-travely-dark-blue"
                  >
                    Sign Up
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

export default Login;
