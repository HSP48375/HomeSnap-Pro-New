
import React from 'react';
import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider';

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
  height?: number;
}

const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({
  beforeImage,
  afterImage,
  beforeLabel = 'BEFORE',
  afterLabel = 'AFTER',
  height = 300,
}) => {
  // Default images if the provided ones don't load
  const defaultBeforeImage = 'https://images.unsplash.com/photo-1618220179428-22790b461013?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80';
  const defaultAfterImage = 'https://images.unsplash.com/photo-1618220179428-22790b461013?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80&brightness=1.2&contrast=1.1&saturation=1.2';

  const handleBeforeImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = defaultBeforeImage;
  };

  const handleAfterImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = defaultAfterImage;
  };

  return (
    <div className="relative rounded-lg overflow-hidden shadow-2xl">
      {/* BEFORE Label */}
      <div className="absolute top-4 left-4 z-10 px-3 py-1 bg-black/80 text-white text-sm font-bold rounded-lg backdrop-blur-sm">
        {beforeLabel}
      </div>

      {/* AFTER Label */}
      <div className="absolute top-4 right-4 z-10 px-3 py-1 bg-black/80 text-white text-sm font-bold rounded-lg backdrop-blur-sm">
        {afterLabel}
      </div>

      {/* Slider */}
      <ReactCompareSlider
        itemOne={
          <ReactCompareSliderImage
            src={beforeImage}
            alt="Before editing"
            onError={handleBeforeImageError}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              /* Enhance the effect to make it look more amateur */
              filter: 'brightness(0.7) contrast(0.85) saturate(0.8)',
            }}
          />
        }
        itemTwo={
          <ReactCompareSliderImage
            src={afterImage}
            alt="After editing"
            onError={handleAfterImageError}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              filter: 'brightness(1.1) contrast(1.05) saturate(1.1)',
            }}
          />
        }
        position={50}
        style={{
          height: `${height}px`,
          borderRadius: '8px',
        }}
      />
    </div>
  );
};

export default BeforeAfterSlider;
