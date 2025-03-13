import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Camera, ArrowRight, CheckCircle, Zap, Image, Shield, Star, User, Lock } from 'lucide-react';
import BeforeAfterSlider from '../components/ui/BeforeAfterSlider';

const HomePage: React.FC = () => {
  const spinningWords = ["Impress", "Close", "Sell"];
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [activeWordIndex, setActiveWordIndex] = useState(0);
  const [prevWordIndex, setPrevWordIndex] = useState(spinningWords.length - 1);

  const [currentHeadlineIndex, setCurrentHeadlineIndex] = useState(0);

  const headlines = [
    {
      text: "We're the app your photographer doesn't want you to find out about.",
      highlight: "photographer"
    },
    {
      text: "Edits so good, we make the pros nervous.",
      highlight: "nervous"
    },
    {
      text: "Why hire a photographer when you can outshoot them with your phone?",
      highlight: "outshoot"
    },
    {
      text: "Your photographer charges $$$$$. We charge $.",
      highlight: "$$$"
    },
    {
      text: "Professional photos edits minus the overpriced 'pro'.",
      highlight: "'pro'"
    },
    {
      text: "Photographers hate us. Sellers love us.",
      highlight: "hate"
    },
    {
      text: "Why pay a pro when we make your shots look pro?",
      highlight: "pro"
    },
    {
      text: "Expensive cameras are out. AI-powered editing is in.",
      highlight: "AI-powered"
    },
    {
      text: "The only editing app that actually makes you money.",
      highlight: "money"
    },
    {
      text: "Your secret weapon for stunning listing photos.",
      highlight: "secret weapon"
    }
  ];

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    const intervalRef = setInterval(() => {
      setPrevWordIndex(activeWordIndex);
      setActiveWordIndex((prev) => (prev + 1) % spinningWords.length);
    }, 3000);

    const headlineIntervalRef = setInterval(() => {
      setCurrentHeadlineIndex((prev) => (prev + 1) % headlines.length);
    }, 5000);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearInterval(intervalRef);
      clearInterval(headlineIntervalRef);
    };
  }, [activeWordIndex, spinningWords.length, headlines.length]);

  const renderHeadlineWithHighlight = (text: string, highlight: string) => {
    if (!text.includes(highlight)) return text;

    const parts = text.split(highlight);
    return (
      <>
        {parts[0]}
        <span className="gradient-text-accent font-bold">{highlight}</span>
        {parts[1]}
      </>
    );
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden py-12 md:py-16">
        {/* Floating orbs */}
        <div 
          className="floating-orb floating-orb-blue w-96 h-96"
          style={{
            top: '10%',
            left: '20%',
            transform: `translate(${(mousePosition.x - window.innerWidth / 2) / -30}px, ${(mousePosition.y - window.innerHeight / 2) / -30}px)`,
            animation: 'float 8s ease-in-out infinite'
          }}
        ></div>
        <div 
          className="floating-orb floating-orb-pink w-80 h-80"
          style={{
            bottom: '15%',
            right: '15%',
            transform: `translate(${(mousePosition.x - window.innerWidth / 2) / -40}px, ${(mousePosition.y - window.innerHeight / 2) / -40}px)`,
            animation: 'float 10s ease-in-out infinite 1s'
          }}
        ></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            {/* Main Logo & Headline */}
            <div className="mb-6">
              <div className="flex items-center justify-center">
                <Camera className="h-12 w-12 md:h-16 md:w-16 text-white gradient-text-accent" />
                <h1 className="text-5xl md:text-7xl font-bold gradient-text-accent ml-4">HomeSnap Pro</h1>
              </div>
            </div>

            {/* Subheadline with Dynamic Rotating Word */}
            <div className="text-xl md:text-2xl text-white/80 mb-12 text-center flex items-center justify-center flex-wrap">
              <span>You Snap, We Edit, You</span>
              <span className="word-rotation-container">
                {spinningWords.map((word, index) => (
                  <span 
                    key={word} 
                    className={`word-rotation gradient-text-accent ${
                      index === activeWordIndex ? 'active' : 
                      index === prevWordIndex ? 'exit' : ''
                    }`}
                  >
                    {word}
                  </span>
                ))}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/upload" className="btn btn-primary">
                Start Taking Photos Now
              </Link>
              <Link to="/tutorials" className="btn btn-outline">
                See How It Works
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works / Roadmap */}
      <div className="py-16 md:py-24 bg-hex-grid">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text" style={{ fontFamily: 'Poppins, sans-serif' }}>HomeSnap Pro – How It Works</h2>
          </div>

          <div className="mx-auto max-w-6xl">
            {/* Horizontal Flow Steps 1-3 */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-12 relative">
              {/* Step 1 */}
              <div className="roadmap-step rounded-xl p-6 w-full md:w-1/3 cursor-pointer relative overflow-visible">
                <div className="absolute -top-3 -left-3 bg-primary text-black font-bold h-10 w-10 rounded-full flex items-center justify-center text-sm z-[999]">1</div>
                <div className="text-center mb-3">
                  <div className="roadmap-icon-container mb-4">
                    <span className="text-3xl">📱</span>
                  </div>
                  <h3 className="text-xl font-bold text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>Download the App</h3>
                </div>
                <p className="text-white/70 text-center" style={{ fontFamily: 'Poppins, sans-serif' }}>Available on iOS & Android. No special camera needed!</p>
              </div>

              {/* Arrow 1 */}
              <div className="hidden md:block w-16 roadmap-arrow rounded-full"></div>

              {/* Step 2 */}
              <div className="roadmap-step rounded-xl p-6 w-full md:w-1/3 cursor-pointer relative overflow-visible">
                <div className="absolute -top-3 -left-3 bg-primary text-black font-bold h-10 w-10 rounded-full flex items-center justify-center text-sm z-[999]">2</div>
                <div className="text-center mb-3">
                  <div className="roadmap-icon-container mb-4">
                    <span className="text-3xl">👤</span>
                  </div>
                  <h3 className="text-xl font-bold text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>Create Your Free Account</h3>
                </div>
                <p className="text-white/70 text-center" style={{ fontFamily: 'Poppins, sans-serif' }}>Sign up in seconds. No subscription required!</p>
              </div>

              {/* Arrow 2 */}
              <div className="hidden md:block w-16 roadmap-arrow rounded-full"></div>

              {/* Step 3 */}
              <div className="roadmap-step rounded-xl p-6 w-full md:w-1/3 cursor-pointer relative overflow-visible">
                <div className="absolute -top-3 -left-3 bg-primary text-black font-bold h-10 w-10 rounded-full flex items-center justify-center text-sm z-[999]">3</div>
                <div className="text-center mb-3">
                  <div className="roadmap-icon-container mb-4">
                    <span className="text-3xl">🏡</span>
                  </div>
                  <h3 className="text-xl font-bold text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>Enter Property Address</h3>
                </div>
                <p className="text-white/70 text-center" style={{ fontFamily: 'Poppins, sans-serif' }}>Just type in the listing details when you're ready to shoot.</p>
              </div>
            </div>

            {/* Horizontal Flow Steps 4-6 */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-12 relative">
              {/* Step 4 */}
              <div className="roadmap-step rounded-xl p-6 w-full md:w-1/3 cursor-pointer relative overflow-visible">
                <div className="absolute -top-3 -left-3 bg-primary text-black font-bold h-10 w-10 rounded-full flex items-center justify-center text-sm z-[999]">4</div>
                <div className="text-center mb-3">
                  <div className="roadmap-icon-container mb-4">
                    <span className="text-3xl">📸</span>
                  </div>
                  <h3 className="text-xl font-bold text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>Take Photos & Scan Floorplan</h3>
                </div>
                <p className="text-white/70 text-center" style={{ fontFamily: 'Poppins, sans-serif' }}>Follow our built-in guides for the best shots.</p>
              </div>

              {/* Arrow 3 */}
              <div className="hidden md:block w-16 roadmap-arrow rounded-full"></div>

              {/* Step 5 */}
              <div className="roadmap-step rounded-xl p-6 w-full md:w-1/3 cursor-pointer relative overflow-visible">
                <div className="absolute -top-3 -left-3 bg-primary text-black font-bold h-10 w-10 rounded-full flex items-center justify-center text-sm z-[999]">5</div>
                <div className="text-center mb-3">
                  <div className="roadmap-icon-container mb-4">
                    <span className="text-3xl">✨</span>
                  </div>
                  <h3 className="text-xl font-bold text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>Select Add-Ons</h3>
                </div>
                <p className="text-white/70 text-center" style={{ fontFamily: 'Poppins, sans-serif' }}>Want an extra wow factor? Pick your enhancements.</p>
              </div>

              {/* Arrow 4 */}
              <div className="hidden md:block w-16 roadmap-arrow rounded-full"></div>

              {/* Step 6 */}
              <div className="roadmap-step rounded-xl p-6 w-full md:w-1/3 cursor-pointer relative overflow-visible">
                <div className="absolute -top-3 -left-3 bg-primary text-black font-bold h-10 w-10 rounded-full flex items-center justify-center text-sm z-[999]">6</div>
                <div className="text-center mb-3">
                  <div className="roadmap-icon-container mb-4">
                    <span className="text-3xl">✅</span>
                  </div>
                  <h3 className="text-xl font-bold text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>Submit Your Order</h3>
                </div>
                <p className="text-white/70 text-center" style={{ fontFamily: 'Poppins, sans-serif' }}>One tap, and we'll handle the rest!</p>
              </div>

              {/* Arrow 5 */}
              <div className="hidden md:block w-16 roadmap-arrow rounded-full"></div>

              {/* Step 7 - Final Step */}
              <div className="roadmap-final-step rounded-xl p-7 w-full md:w-1/3 cursor-pointer relative animate-pulse-slow overflow-visible">
                <div className="roadmap-step-number" style={{ background: 'linear-gradient(135deg, #FF00C1, #FF3DFF)', position: 'absolute', zIndex: 999, transform: 'scale(1.1)' }}>7</div>
                <div className="text-center mb-3">
                  <div className="roadmap-icon-container mb-4" style={{ boxShadow: 'inset 0 0 20px rgba(255, 0, 193, 0.5)' }}>
                    <span className="text-3xl">🚀</span>
                  </div>
                  <h3 className="text-xl font-bold text-white neon-text-magenta" style={{ fontFamily: 'Poppins, sans-serif' }}>Receive Stunning Photos</h3>
                </div>
                <p className="text-white/80 text-center" style={{ fontFamily: 'Poppins, sans-serif' }}>Professionally edited in <span className="font-bold gradient-text-accent">less than 12 hours!</span></p>
              </div>
            </div>

            {/* Final Highlighted Step */}
            <div className="max-w-xl mx-auto">
              {/* This section is already handled in the previous changes */}
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

      {/* Trust Signals Section */}
      <div className="py-8 md:py-12 bg-black/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            <div className="flex items-center justify-center">
              <Shield className="h-6 w-6 text-white mr-2" />
              <span className="text-white/80">Secure Payments via Stripe</span>
            </div>
            <div className="flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-white mr-2" />
              <span className="text-white/80">100% Satisfaction Guarantee</span>
            </div>
            <div className="flex items-center justify-center">
              <Lock className="h-6 w-6 text-white mr-2" />
              <span className="text-white/80">Privacy Protected</span>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card bg-gradient-to-br from-black to-black/80 border border-white/5">
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">Ready to Transform Your Property Photos?</h2>
              <p className="text-lg text-white/80 max-w-2xl mx-auto mb-8">
                Join thousands of real estate professionals who trust HomeSnap Pro for their photo editing needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/upload" className="btn btn-primary">
                  Start Taking Photos Now
                </Link>
                <Link to="/tutorials" className="btn btn-outline">
                  See How It Works
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;