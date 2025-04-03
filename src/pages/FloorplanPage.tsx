import React, { useState } from 'react';
import { useFloorplanStore } from '../stores/floorplanStore';
import { Camera, Layers, CheckCircle, ArrowRight } from 'lucide-react';
import VideoRecorder from '../components/floorplan/VideoRecorder';
import PackageSelector from '../components/floorplan/PackageSelector';
import BrandingForm from '../components/floorplan/BrandingForm';
import FloorplanPreview from '../components/floorplan/FloorplanPreview';
import FloorplanCheckout from '../components/floorplan/FloorplanCheckout';

const FloorplanPage: React.FC = () => {
  const { videoRecording, currentOrder } = useFloorplanStore();
  const [currentStep, setCurrentStep] = useState<number>(1);
  
  const steps = [
    { id: 1, name: 'Record Video', icon: <Camera className="h-5 w-5" /> },
    { id: 2, name: 'Select Package', icon: <Layers className="h-5 w-5" /> },
    { id: 3, name: 'Review & Pay', icon: <CheckCircle className="h-5 w-5" /> }
  ];
  
  const handleNextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, steps.length));
  };
  
  const handlePrevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold neon-text">Floorplan Generator</h1>
        <p className="text-white/70 mt-2">
          Create professional floorplans from a simple video walkthrough of your property.
        </p>
      </div>
      
      {/* Steps */}
      <div className="flex items-center justify-center mb-8">
        <nav className="flex items-center">
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              {/* Step */}
              <div 
                className={`flex items-center ${
                  currentStep >= step.id ? 'text-primary' : 'text-white/50'
                }`}
              >
                <div className={`flex items-center justify-center h-10 w-10 rounded-full border-2 ${
                  currentStep >= step.id ? 'border-primary bg-primary/10' : 'border-white/30'
                }`}>
                  {currentStep > step.id ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    step.icon
                  )}
                </div>
                <span className={`ml-2 text-sm font-medium hidden sm:block ${
                  currentStep >= step.id ? 'text-white' : 'text-white/50'
                }`}>
                  {step.name}
                </span>
              </div>
              
              {/* Connector */}
              {index < steps.length - 1 && (
                <div className={`w-10 sm:w-16 h-1 mx-1 sm:mx-3 ${
                  currentStep > index + 1 ? 'bg-primary' : 'bg-white/20'
                }`}></div>
              )}
            </React.Fragment>
          ))}
        </nav>
      </div>
      
      {/* Step Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column */}
        <div>
          {currentStep === 1 && (
            <VideoRecorder />
          )}
          
          {currentStep === 2 && (
            <PackageSelector />
          )}
          
          {currentStep === 3 && (
            <FloorplanCheckout />
          )}
        </div>
        
        {/* Right Column */}
        <div>
          {currentStep === 1 && videoRecording && (
            <div className="card p-6">
              <h2 className="text-xl font-semibold mb-4">Video Preview</h2>
              <p className="text-white/70 mb-4">
                Your video has been recorded successfully. You can review it below or proceed to select your floorplan package.
              </p>
              <div className="aspect-video bg-dark-light rounded-lg overflow-hidden mb-6">
                <video 
                  src={URL.createObjectURL(videoRecording)} 
                  controls 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}
          
          {currentStep === 2 && currentOrder?.packageId === 'pro' && (
            <BrandingForm />
          )}
          
          {(currentStep === 2 || currentStep === 3) && (
            <FloorplanPreview is3D={currentOrder?.packageId === 'pro'} />
          )}
        </div>
      </div>
      
      {/* Navigation Buttons */}
      <div className="flex justify-between pt-6 border-t border-white/10">
        <button
          onClick={handlePrevStep}
          disabled={currentStep === 1}
          className={`btn btn-outline ${currentStep === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          Back
        </button>
        
        {currentStep < steps.length && (
          <button
            onClick={handleNextStep}
            disabled={(currentStep === 1 && !videoRecording) || (currentStep === 2 && !currentOrder)}
            className="btn btn-primary flex items-center"
          >
            Continue <ArrowRight className="ml-2 h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default FloorplanPage;
