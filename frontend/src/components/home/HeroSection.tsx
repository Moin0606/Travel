import React from "react";
import { ArrowRight } from "lucide-react";
import SearchForm from "../ui/SearchForm";
import { toast } from "sonner";
import { Navigate } from "react-router-dom";
const HeroSection = () => {
  const handleSearch = (formData: any) => {
    // In a real app, this would search for travel options
    console.log("Search form data:", formData);
    toast.success("Searching for your perfect getaway!");
  };

  const handleExplore = () => {
    // In a real app, this would take users to a Sri Lanka exploration page
    toast.success("Redirect to dashboard!");
  };

  return (
    <section className="hero-section min-h-screen flex items-center justify-center px-4 py-20">
      <div className="max-w-6xl w-full space-y-12 animate-fade-in">
        {/* Hero Text */}
        <div className="text-center text-white space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            Do More With Travely
          </h1>
          <p className="text-xl md:text-2xl max-w-2xl mx-auto opacity-90">
            An All-In-One Platform to Connect with Travelers, Share Experiences,
            with like Minded Explorers.
          </p>
        </div>

        {/* Search Form */}
        <SearchForm onSubmit={handleSearch} className="max-w-5xl mx-auto" />

        {/* Explore Button */}
        <div className="text-center">
          <button
            onClick={handleExplore}
            className="inline-flex items-center text-white border-2 border-white hover:bg-white hover:text-travely-blue transition-colors duration-300 font-semibold py-3 px-6 rounded-md"
          >
            Explore
            <ArrowRight className="ml-2" size={18} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
