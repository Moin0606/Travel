
import React, { useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

const ExplorerSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in');
            entry.target.classList.remove('opacity-0');
          }
        });
      },
      { threshold: 0.1 }
    );
    
    const section = sectionRef.current;
    if (section) {
      observer.observe(section);
    }
    
    return () => {
      if (section) {
        observer.unobserve(section);
      }
    };
  }, []);
  
  const handleGetStarted = () => {
    toast.success('Let\'s start your Sri Lankan adventure!');
  };

  return (
    <section 
      ref={sectionRef} 
      className="py-16 md:py-24 bg-white opacity-0 transition-opacity duration-1000 ease-in-out"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Explore<br />
              the Wonders in<br />
              <span className="text-travely-blue">Sri Lanka</span>
            </h2>
            
            <p className="text-gray-600 leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
            
            <button 
              onClick={handleGetStarted}
              className="bg-gray-900 text-white px-8 py-3 rounded-md hover:bg-gray-800 transition-colors duration-300 inline-flex items-center"
            >
              Get Started
              <ArrowRight className="ml-2" size={18} />
            </button>
          </div>
          
          {/* Image */}
          <div className="rounded-2xl overflow-hidden shadow-xl transition-all duration-500 hover:shadow-2xl">
            <img 
              src="/lovable-uploads/20a60bc4-7d67-4e5b-b31c-eea575375e3b.png" 
              alt="Explore Sri Lanka by boat" 
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExplorerSection;
