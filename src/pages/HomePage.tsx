import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Camera, ArrowRight, CheckCircle, Zap, Image, Shield, Star, User, Lock } from 'lucide-react';
import BeforeAfterSlider from '../components/ui/BeforeAfterSlider';

const HomePage: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [activeWordIndex, setActiveWordIndex] = useState(0);
  const [prevWordIndex, setPrevWordIndex] = useState(-1);
  const spinningWords = ["Sell", "Rent", "Shine", "Inspire", "Create"];

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
  }, [activeWordIndex]);

  const renderHeadlineWithHighlight = (text: string, highlight: string) => {
    if (!text.includes(highlight)) return text;

    const parts = text.split(highlight);
    return (
      <>
        {parts[0]}
        <span className="text-purple-500 font-bold">{highlight}</span>
        {parts[1]}
      </>
    );
  };

  useEffect(() => {
    const spinningWordsInterval = setInterval(() => {
      setPrevWordIndex(activeWordIndex);
      setActiveWordIndex(prev => (prev + 1) % spinningWords.length);
    }, 3000);

    return () => clearInterval(spinningWordsInterval);
  }, [activeWordIndex, spinningWords.length]);

  useEffect(() => {
    const headlineInterval = setInterval(() => {
      setCurrentHeadlineIndex(prev => (prev + 1) % headlines.length);
    }, 5000);

    return () => clearInterval(headlineInterval);
  }, [headlines.length]);

  // Add ripple effect to buttons
  useEffect(() => {
    const buttons = document.querySelectorAll('.btn.ripple-effect');

    const handleClick = (e) => {
      const button = e.currentTarget;

      // Create ripple element
      const ripple = document.createElement('span');
      button.appendChild(ripple);

      // Position the ripple
      const rect = button.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      // Style the ripple
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      ripple.classList.add('ripple');

      // Remove the ripple after animation completes
      setTimeout(() => {
        ripple.remove();
      }, 600);
    };

    buttons.forEach(button => {
      button.addEventListener('click', handleClick);
    });

    return () => {
      buttons.forEach(button => {
        button.removeEventListener('click', handleClick);
      });
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-700"> {/* Added background gradient */}
      {/* Hero Section */}
      <div className="relative overflow-hidden py-12 md:py-16">
        {/* Floating orbs (modified for color) */}
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
          className="floating-orb floating-orb-purple w-80 h-80" {/* Changed color */}
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
                <Camera className="h-12 w-12 md:h-16 md:w-16 text-white text-purple-500" /> {/* Changed color */}
                <h1 className="text-5xl md:text-7xl font-bold text-purple-500 ml-4">HomeSnap Pro</h1> {/* Changed color */}
              </div>
            </div>

            {/* Subheadline with Dynamic Rotating Word */}
            <div className="text-xl md:text-2xl text-white/80 mb-12 text-center">
              <span>You Snap, We Edit, You</span>
              <span className="word-rotation-container">
                {spinningWords.map((word, index) => (
                  <span
                    key={word}
                    className={`word-rotation text-purple-500 ${index === activeWordIndex ? 'active' : index === prevWordIndex ? 'exit' : ''}`}
                  >
                    {word}
                  </span>
                ))}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/upload" className="btn btn-primary ripple-effect"> {/* Added ripple class */}
                Start Taking Photos Now
              </Link>
              <Link to="/tutorials" className="btn btn-outline ripple-effect"> {/* Added ripple class */}
                See How It Works
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* SnapSnapSnap-Inspired Section */}
      <div className="py-16 md:py-24 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Bold Headline with Gradient Highlight */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-wide headline-glow">
              {renderHeadlineWithHighlight(headlines[currentHeadlineIndex].text, headlines[currentHeadlineIndex].highlight)}
            </h2>
            <p className="text-white/80 mt-4 max-w-2xl mx-auto">
              Pro-quality edits at a fraction of the cost. No expensive equipment needed.
            </p>
          </div>

          {/* Phone Mockup and Before/After Slider */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mt-12">
            {/* Left Side: Phone Mockup */}
            <div className="flex justify-center">
              <div className="phone-mockup">
                <div className="phone-notch"></div>
                <div className="phone-screen">
                  {/* Camera Interface */}
                  <div className="relative h-full">
                    {/* Camera Preview */}
                    <div className="absolute inset-0">
                      <img
                        src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2053&q=80"
                        alt="Los Angeles luxury home exterior"
                        className="w-full h-full object-cover"
                      />

                      {/* Camera Grid Lines */}
                      <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none">
                        {Array.from({ length: 4 }).map((_, i) => (
                          <React.Fragment key={i}>
                            <div className="border-l border-white/30"></div>
                            <div className="border-t border-white/30"></div>
                          </React.Fragment>
                        ))}
                      </div>
                    </div>

                    {/* Bottom Bar with Apple-style Gradient */}
                    <div className="absolute bottom-0 left-0 right-0">
                      {/* Dark gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent h-32"></div>

                      {/* Controls */}
                      <div className="relative flex items-center justify-center py-6">
                        {/* Shutter Button */}
                        <button className="relative group ripple-effect"> {/* Added ripple class */}
                          {/* Outer ring */}
                          <div className="w-20 h-20 rounded-full border-2 border-white bg-black/20 backdrop-blur-sm flex items-center justify-center transition-transform transform group-active:scale-95">
                            {/* Inner circle */}
                            <div className="w-16 h-16 rounded-full bg-white transition-transform transform group-active:scale-95"></div>
                          </div>

                          {/* Subtle glow effect */}
                          <div className="absolute inset-0 rounded-full bg-white/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side: Before/After Slider */}
            <div>
              <BeforeAfterSlider
                beforeImage="https://images.unsplash.com/photo-1554995207-c18c203602cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80&brightness=0.8&contrast=0.8&saturation=0.8"
                afterImage="https://images.unsplash.com/photo-1554995207-c18c203602cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80&brightness=1.2&contrast=1.15&saturation=1.2"
                beforeLabel="AMATEUR SHOT"
                afterLabel="PROFESSIONAL"
                height={400}
              />
              <p className="text-white/70 text-center mt-4">
                Drag the slider to see the difference
              </p>
            </div>
          </div>

          {/* CTA Button */}
          <div className="text-center mt-12">
            <Link to="/upload" className="btn btn-primary text-lg px-8 py-3 ripple-effect"> {/* Added ripple class */}
              Start Taking Photos Now
            </Link>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-purple-500 mb-4"> {/* Changed color */}
              Our Services
            </h2>
            <p className="text-lg text-white/70">
              Transform your property photos with our professional editing services
            </p>
            <div className="h-1 w-32 mx-auto bg-gradient-to-r from-purple-500 via-pink-500 to-magenta-500 mt-6 rounded-full"></div> {/* Added gradient */}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Service 1: Standard Editing */}
            <div className="card hover:animate-pulse-slow">
              <div className="h-64 mb-4">
                <BeforeAfterSlider
                  beforeImage="/assets/before-after/Editing_Before.JPEG"
                  afterImage="/assets/before-after/Editing_After.JPEG"
                  beforeLabel="Before"
                  afterLabel="After"
                  height={300}
                  isBeforeDark={true}
                />
              </div>
              <h3 className="text-xl font-bold mb-2 text-purple-500">Standard Editing</h3> {/* Changed color */}
              <p className="text-white/70 mb-4">
                Color correction, exposure balancing, vertical alignment, and sky replacement.
              </p>
              <div className="flex items-center">
                <p className="text-white text-lg font-bold">$1.50</p>
                <span className="text-white/60 ml-1">per photo</span>
              </div>
            </div>

            {/* Service 2: Virtual Staging */}
            <div className="card hover:animate-pulse-slow">
              <div className="h-64 mb-4">
                <BeforeAfterSlider
                  beforeImage="/assets/before-after/VirtualStaging_Before.JPEG"
                  afterImage="/assets/before-after/VirtualStaging_After.JPEG"
                  beforeLabel="Empty"
                  afterLabel="Staged"
                  height={300}
                  isVirtualStaging={true}
                />
              </div>
              <h3 className="text-xl font-bold mb-2 text-pink-500">Virtual Staging</h3> {/* Changed color */}
              <p className="text-white/70 mb-4">
                Transform empty rooms with virtual furniture and decor for better visualization.
              </p>
              <div className="flex items-center">
                <p className="text-white text-lg font-bold">$10.00</p>
                <span className="text-white/60 ml-1">per photo</span>
              </div>
            </div>

            {/* Service 3: Twilight Conversion */}
            <div className="card hover:animate-pulse-slow">
              <div className="h-64 mb-4">
                <BeforeAfterSlider
                  beforeImage="/assets/before-after/Twilight_Before.JPG"
                  afterImage="/assets/before-after/Twilight_After.JPG"
                  beforeLabel="Day"
                  afterLabel="Twilight"
                  height={300}
                  isTwilight={true}
                />
              </div>
              <h3 className="text-xl font-bold mb-2 text-magenta-500">Twilight Conversion</h3> {/* Changed color */}
              <p className="text-white/70 mb-4">
                Convert daytime exterior shots into stunning twilight/dusk images.
              </p>
              <div className="flex items-center">
                <p className="text-white text-lg font-bold">$3.99</p>
                <span className="text-white/60 ml-1">per photo</span>
              </div>
            </div>

            {/* Service 4: Decluttering */}
            <div className="card hover:animate-pulse-slow">
              <div className="h-64 mb-4">
                <BeforeAfterSlider
                  beforeImage="/assets/before-after/Decluttering_Before.JPEG"
                  afterImage="/assets/before-after/Decluttering_After.JPEG"
                  beforeLabel="Cluttered"
                  afterLabel="Clean"
                  height={300}
                  isDecluttering={true}
                />
              </div>
              <h3 className="text-xl font-bold mb-2 text-purple-500">Decluttering</h3> {/* Changed color */}
              <p className="text-white/70 mb-4">
                Digital removal of objects, clutter, and eyesores from property photos.
              </p>
              <div className="flex items-center">
                <p className="text-white text-lg font-bold">$2.99</p>
                <span className="text-white/60 ml-1">per photo</span>
              </div>
            </div>
          </div>
        </div>
      </section>

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
          <div className="card bg-gradient-to-br from-blue-900 to-blue-700 border border-white/5"> {/* Updated background */}
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-purple-500 mb-4">Ready to Transform Your Property Photos?</h2> {/* Changed color */}
              <p className="text-lg text-white/80 max-w-2xl mx-auto mb-8">
                Join thousands of real estate professionals who trust HomeSnap Pro for their photo editing needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/upload" className="btn btn-primary ripple-effect"> {/* Added ripple class */}
                  Start Taking Photos Now
                </Link>
                <Link to="/tutorials" className="btn btn-outline ripple-effect"> {/* Added ripple class */}
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