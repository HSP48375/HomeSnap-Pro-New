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
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Upload, Grid, Plus, ArrowRight } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { supabase } from '../lib/api';
import { useAuthStore } from '../stores/authStore';

const FloorplanPage = () => {
  const [floorplans, setFloorplans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuthStore();

  useEffect(() => {
    fetchFloorplans();
  }, []);

  const fetchFloorplans = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('floorplans')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setFloorplans(data || []);
    } catch (error) {
      console.error('Error fetching floorplans:', error);
      toast.error('Failed to load floorplans');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select a file to upload');
      return;
    }

    try {
      toast.loading('Uploading floorplan...');
      
      // Upload file to storage
      const fileName = `${user.id}-${Date.now()}-${selectedFile.name}`;
      const { data: fileData, error: fileError } = await supabase.storage
        .from('floorplans')
        .upload(fileName, selectedFile);
      
      if (fileError) throw fileError;
      
      // Get public URL
      const { data: urlData } = supabase.storage
        .from('floorplans')
        .getPublicUrl(fileName);
      
      // Save to database
      const { error: dbError } = await supabase
        .from('floorplans')
        .insert({
          user_id: user.id,
          file_path: fileName,
          file_url: urlData.publicUrl,
          name: selectedFile.name,
          status: 'processing'
        });
      
      if (dbError) throw dbError;
      
      toast.dismiss();
      toast.success('Floorplan uploaded successfully');
      setSelectedFile(null);
      fetchFloorplans();
    } catch (error) {
      console.error('Error uploading floorplan:', error);
      toast.dismiss();
      toast.error('Failed to upload floorplan');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Floorplans</h1>
        
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Create New Floorplan</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Upload interface */}
            <div className="bg-gray-700 rounded-lg p-6 hover:bg-gray-600 transition-colors">
              <div className="flex flex-col items-center">
                <Upload className="w-12 h-12 mb-4 text-blue-400" />
                <h3 className="text-lg font-medium mb-2">Upload Image</h3>
                <p className="text-gray-300 text-sm mb-4 text-center">
                  Upload an existing floorplan image for processing
                </p>
                <input
                  type="file"
                  id="floorplan-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                <label
                  htmlFor="floorplan-upload"
                  className="px-4 py-2 bg-blue-500 rounded hover:bg-blue-600 cursor-pointer"
                >
                  Select File
                </label>
                {selectedFile && (
                  <div className="mt-4 text-center">
                    <p className="text-sm text-gray-300 mb-2">{selectedFile.name}</p>
                    <button
                      onClick={handleUpload}
                      className="px-4 py-2 bg-green-500 rounded hover:bg-green-600"
                    >
                      Upload Now
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            {/* Capture New button */}
            <div className="bg-gray-700 rounded-lg p-6 hover:bg-gray-600 transition-colors">
              <div className="flex flex-col items-center">
                <Camera className="w-12 h-12 mb-4 text-purple-400" />
                <h3 className="text-lg font-medium mb-2">Capture New</h3>
                <p className="text-gray-300 text-sm mb-4 text-center">
                  Use the mobile app to capture and generate a floorplan
                </p>
                <div className="flex flex-col gap-2 items-center">
                  <a 
                    href="#" 
                    className="px-4 py-2 bg-purple-500 rounded hover:bg-purple-600 flex items-center"
                  >
                    Open Mobile App <ArrowRight className="ml-2 w-4 h-4" />
                  </a>
                  <p className="text-xs text-gray-400 mt-2">
                    Requires HomeSnap Pro mobile app with AR capabilities
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Gallery View */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Your Floorplans</h2>
          
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-gray-300">Loading your floorplans...</p>
            </div>
          ) : floorplans.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {floorplans.map((floorplan) => (
                <div 
                  key={floorplan.id} 
                  className="bg-gray-800 rounded-lg overflow-hidden"
                >
                  <div className="aspect-video bg-gray-700 relative">
                    {floorplan.file_url ? (
                      <img 
                        src={floorplan.file_url} 
                        alt={floorplan.name} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <Grid className="w-12 h-12 text-gray-500" />
                      </div>
                    )}
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 px-2 py-1 rounded text-xs">
                      {floorplan.status}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium truncate">{floorplan.name}</h3>
                    <p className="text-gray-400 text-sm mt-1">
                      {new Date(floorplan.created_at).toLocaleDateString()}
                    </p>
                    <div className="mt-4 flex justify-between">
                      <button 
                        onClick={() => navigate(`/floorplan/${floorplan.id}`)}
                        className="px-3 py-1 bg-blue-500 rounded text-sm hover:bg-blue-600"
                      >
                        View Details
                      </button>
                      <button className="px-3 py-1 bg-gray-600 rounded text-sm hover:bg-gray-500">
                        Share
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-800 rounded-lg">
              <Grid className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-medium mb-2">No Floorplans Yet</h3>
              <p className="text-gray-400 mb-6">
                Upload an image or use the mobile app to create your first floorplan
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FloorplanPage;
