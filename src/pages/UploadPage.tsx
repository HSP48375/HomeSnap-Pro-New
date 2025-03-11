import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUploadStore } from '../stores/uploadStore';
import { useAuthStore } from '../stores/authStore';
import { toast } from 'react-hot-toast';
import { Upload, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';
import UploadForm from '../components/ui/UploadForm';
import PhotoPreview from '../components/ui/PhotoPreview';

const UploadPage: React.FC = () => {
  const { files, removeFile, clearFiles, uploadFiles, uploading } = useUploadStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [uploadComplete, setUploadComplete] = useState(false);
  
  const handleUpload = async () => {
    if (files.length === 0) {
      toast.error('Please add at least one photo before uploading');
      return;
    }
    
    const { success, error } = await uploadFiles();
    
    if (success) {
      toast.success('Photos uploaded successfully');
      setUploadComplete(true);
    } else {
      toast.error(error || 'Failed to upload photos');
    }
  };
  
  const handleContinue = () => {
    // Clear the upload store and navigate to the orders page
    clearFiles();
    navigate('/orders');
  };
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold neon-text">Upload Photos</h1>
        <p className="text-white/70 mt-2">
          Upload your property photos for professional editing. We accept JPEG, PNG, and HEIC formats.
        </p>
      </div>

      {!uploadComplete ? (
        <>
          <UploadForm />
          
          {files.length > 0 && (
            <div className="card bg-gradient-to-br from-primary/20 to-secondary/20">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Upload Summary</h2>
                <span className="text-white/70">{files.length} photos selected</span>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-white/70">Standard Editing</span>
                  <span>${(8.99 * files.length).toFixed(2)}</span>
                </div>
                
                {files.length >= 10 && (
                  <div className="flex justify-between text-neon-green">
                    <span>Volume Discount</span>
                    <span>
                      {files.length >= 20 ? '15% OFF' : '10% OFF'}
                    </span>
                  </div>
                )}
                
                <div className="border-t border-white/10 pt-2 mt-2">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Estimated Total</span>
                    <span>
                      ${(
                        files.length >= 20 
                          ? 8.99 * files.length * 0.85 
                          : files.length >= 10 
                            ? 8.99 * files.length * 0.9 
                            : 8.99 * files.length
                      ).toFixed(2)}
                    </span>
                  </div>
                  <div className="text-white/50 text-sm text-right">
                    Final price will be calculated at checkout
                  </div>
                </div>
              </div>
              
              <button
                onClick={handleUpload}
                disabled={uploading || files.length === 0}
                className="btn btn-primary w-full flex items-center justify-center"
              >
                {uploading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Uploading Photos...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Upload className="h-5 w-5 mr-2" />
                    Upload Photos
                  </span>
                )}
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="card bg-gradient-to-br from-neon-green/20 to-primary/20 p-8 text-center">
          <CheckCircle className="h-16 w-16 text-neon-green mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Upload Complete!</h2>
          <p className="text-white/80 mb-6 max-w-md mx-auto">
            Your photos have been uploaded successfully and are now being processed. You can view the status of your order in the Orders section.
          </p>
          <button
            onClick={handleContinue}
            className="btn btn-primary flex items-center justify-center mx-auto"
          >
            <span className="flex items-center">
              View My Orders <ArrowRight className="ml-2 h-5 w-5" />
            </span>
          </button>
        </div>
      )}
      
      {/* Empty State */}
      {!uploadComplete && files.length === 0 && (
        <div className="card bg-gradient-to-br from-primary/10 to-secondary/10 p-8">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-white/70" />
            <h3 className="text-xl font-semibold mb-2">No Photos Selected</h3>
            <p className="text-white/70 mb-6">
              Please upload at least one photo to continue with your order.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadPage;