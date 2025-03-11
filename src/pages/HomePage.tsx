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
            <div className="flex items-center justify-center mb-6">
              <Camera className="h-12 w-12 md:h-16 md:w-16 text-white gradient-text-accent" />
              <h1 className="text-5xl md:text-7xl font-bold gradient-text-accent ml-4">HomeSnap Pro</h1>
            </div>
            
            {/* Subheadline with Dynamic Rotating Word */}
            <div className="text-xl md:text-2xl text-white/80 mb-12 flex items-center justify-center">
              <div className="flex items-center justify-center">
                <div className="inline-flex items-baseline justify-center">
                  <span>You Snap, We Edit, You</span>
                  <div className="word-rotation-container" style={{ lineHeight: 'inherit' }}>
                    {spinningWords.map((word, index) => (
                      <span 
                        key={word} 
                        className={`word-rotation gradient-text-accent font-bold ${
                          index === activeWordIndex ? 'active' : 
                          index === prevWordIndex ? 'exit' : ''
                        }`}
                      >
                        {word}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
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
                        <button className="relative group">
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
                beforeImage="https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1600"
                afterImage="https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1600"
                beforeLabel="AMATEUR SHOT"
                afterLabel="PROFESSIONAL"
              />
              <p className="text-white/70 text-center mt-4">
                Drag the slider to see the difference
              </p>
            </div>
          </div>
          
          {/* CTA Button */}
          <div className="text-center mt-12">
            <Link to="/upload" className="btn btn-primary text-lg px-8 py-3">
              Start Taking Photos Now
            </Link>
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
            {/* Service 1 */}
            <div className="card hover:scale-105 transition-all duration-300">
              <div className="flex justify-center mb-4">
                <div className="h-16 w-16 rounded-full bg-white/5 flex items-center justify-center">
                  <Image className="h-8 w-8 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-center gradient-text">Standard Editing</h3>
              <p className="text-white/80 text-center">
                Professional color correction, exposure balance, and lens correction for perfect property photos.
              </p>
              <p className="text-center mt-4 text-white font-semibold">$8.99 per photo</p>
            </div>

            {/* Service 2 */}
            <div className="card hover:scale-105 transition-all duration-300">
              <div className="flex justify-center mb-4">
                <div className="h-16 w-16 rounded-full bg-white/5 flex items-center justify-center">
                  <Zap className="h-8 w-8 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-center gradient-text">Virtual Staging</h3>
              <p className="text-white/80 text-center">
                Transform empty rooms with beautiful virtual furniture to help buyers visualize the space.
              </p>
              <p className="text-center mt-4 text-white font-semibold">$15.99 per photo</p>
            </div>

            {/* Service 3 */}
            <div className="card hover:scale-105 transition-all duration-300">
              <div className="flex justify-center mb-4">
                <div className="h-16 w-16 rounded-full bg-white/5 flex items-center justify-center">
                  <Camera className="h-8 w-8 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-center gradient-text">Twilight Conversion</h3>
              <p className="text-white/80 text-center">
                Convert daytime exterior photos into stunning twilight scenes with glowing windows.
              </p>
              <p className="text-center mt-4 text-white font-semibold">$10.99 per photo</p>
            </div>

            {/* Service 4 */}
            <div className="card hover:scale-105 transition-all duration-300">
              <div className="flex justify-center mb-4">
                <div className="h-16 w-16 rounded-full bg-white/5 flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-center gradient-text">Decluttering</h3>
              <p className="text-white/80 text-center">
                Remove unwanted objects and clutter from your property photos for a cleaner look.
              </p>
              <p className="text-center mt-4 text-white font-semibold">$12.99 per photo</p>
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