import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Camera, ArrowRight, CheckCircle, Zap, Image, Shield, Star, User, Lock } from 'lucide-react';
import BeforeAfterSlider from '../components/ui/BeforeAfterSlider';

const HomePage: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 gradient-text">
              Shoot Like a Pro. Sell Like a Boss.
            </h1>
            <p className="text-xl md:text-2xl mb-8">
              Using Just Your Smartphone.
            </p>
            <div className="flex justify-center gap-4">
              <a href="#" className="store-button">
                <img src="/assets/app-store-badge.svg" alt="Download on the App Store" />
              </a>
              <a href="#" className="store-button">
                <img src="/assets/google-play-badge.svg" alt="Get it on Google Play" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-12 gradient-text">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className="roadmap-step">
                <h3 className="text-xl font-bold mb-4">Download the App</h3>
                <p>Get started with HomeSnap Pro on your mobile device</p>
              </div>

              {/* Step 2 */}
              <div className="roadmap-step">
                <h3 className="text-xl font-bold mb-4">Take Photos</h3>
                <p>Capture your property photos using our guided camera system</p>
              </div>

              {/* Step 3 */}
              <div className="roadmap-step">
                <h3 className="text-xl font-bold mb-4">Get Pro Results</h3>
                <p>Receive professionally edited photos within 24 hours</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">Our Services</h2>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              We offer a range of professional editing services to make your property photos stand out in the market.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Service 1 - Standard Editing */}
            <div className="card hover:scale-105 transition-all duration-300">
              <div className="mb-4">
                <BeforeAfterSlider
                  beforeImage="/assets/before-after/Editing_Before.JPEG"
                  afterImage="/assets/before-after/Editing_After.JPEG"
                  beforeLabel="Before"
                  afterLabel="After"
                  height={250}
                  isBeforeDark={true}
                />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-center gradient-text">Standard Editing</h3>
              <p className="text-white/80 text-center">
                Professional color correction, exposure balance, and lens correction for perfect property photos.
              </p>
              <p className="text-center mt-4 text-white font-semibold">$1.50 per photo</p>
            </div>

            {/* Service 2 - Virtual Staging */}
            <div className="card hover:scale-105 transition-all duration-300">
              <div className="mb-4">
                <BeforeAfterSlider
                  beforeImage="/assets/before-after/VirtualStaging_Before.JPEG"
                  afterImage="/assets/before-after/VirtualStaging_After.JPEG"
                  beforeLabel="Empty"
                  afterLabel="Staged"
                  height={250}
                  isVirtualStaging={true}
                />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-center gradient-text">Virtual Staging</h3>
              <p className="text-white/80 text-center">
                Transform empty rooms with beautiful virtual furniture to help buyers visualize the space.
              </p>
              <p className="text-center mt-4 text-white font-semibold">$10.00 per photo</p>
            </div>

            {/* Service 3 - Twilight Conversion */}
            <div className="card hover:scale-105 transition-all duration-300">
              <div className="mb-4">
                <BeforeAfterSlider
                  beforeImage="/assets/before-after/Twilight_Before.JPG"
                  afterImage="/assets/before-after/Twilight_After.JPG"
                  beforeLabel="Day"
                  afterLabel="Twilight"
                  height={250}
                  isTwilight={true}
                />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-center gradient-text">Twilight Conversion</h3>
              <p className="text-white/80 text-center">
                Turn ordinary daylight exteriors into stunning twilight images with dramatic lighting.
              </p>
              <p className="text-center mt-4 text-white font-semibold">$3.99 per photo</p>
            </div>

            {/* Service 4 - Decluttering */}
            <div className="card hover:scale-105 transition-all duration-300">
              <div className="mb-4">
                <BeforeAfterSlider
                  beforeImage="/assets/before-after/Decluttering_Before.JPEG"
                  afterImage="/assets/before-after/Decluttering_After.JPEG"
                  beforeLabel="Cluttered"
                  afterLabel="Clean"
                  height={250}
                  isDecluttering={true}
                />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-center gradient-text">Decluttering</h3>
              <p className="text-white/80 text-center">
                Remove distracting elements and virtually tidy spaces for cleaner, more appealing photos.
              </p>
              <p className="text-center mt-4 text-white font-semibold">$2.99 per photo</p>
            </div>
          </div>
        </div>
      </div>

      <div className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card bg-gradient-to-br from-black to-black/80 border border-white/5">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 gradient-text text-center whitespace-nowrap" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Stand Out. Sell Faster. Snap Like a Pro!
              </h1>
              <p className="text-xl md:text-2xl text-white/80 text-center mb-12">
                The <span className="gradient-text">future</span> of real estate photography is here—fast, easy, and stunning.
              </p>
              <div className="store-buttons">
                <a href="#" className="store-button">
                  <img
                    src="/assets/app-store-badge.svg"
                    alt="Download on the App Store"
                  />
                </a>
                <a href="#" className="store-button">
                  <img
                    src="/assets/google-play-badge.svg"
                    alt="Get it on Google Play"
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;