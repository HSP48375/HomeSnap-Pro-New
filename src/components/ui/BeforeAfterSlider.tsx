
import React from 'react';
import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider';

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
  height?: number;
  isBeforeDark?: boolean;
  isVirtualStaging?: boolean;
  isTwilight?: boolean;
  isDecluttering?: boolean;
}

const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({
  beforeImage,
  afterImage,
  beforeLabel = 'BEFORE',
  afterLabel = 'AFTER',
  height = 300,
  isBeforeDark = false,
  isVirtualStaging = false,
  isTwilight = false,
  isDecluttering = false,
}) => {
  // Default images if the provided ones don't load
  const defaultBeforeImage = 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
  const defaultAfterImage = 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';

  const handleBeforeImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = defaultBeforeImage;
  };

  const handleAfterImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = defaultAfterImage;
  };

  // Apply appropriate styling based on the edit type
  const getBeforeStyle = () => {
    if (isBeforeDark) {
      return {
        filter: 'brightness(0.7) contrast(0.85) saturate(0.8)',
      };
    }
    if (isVirtualStaging) {
      return {
        filter: 'brightness(0.95) contrast(0.95)',
      };
    }
    if (isTwilight) {
      return {
        filter: 'brightness(1.05) contrast(1.0) saturate(1.0)',
      };
    }
    if (isDecluttering) {
      return {
        filter: 'brightness(1.0) contrast(1.0) saturate(1.0)',
      };
    }
    return {
      filter: 'brightness(0.85) contrast(0.9) saturate(0.85)',
    };
  };

  const getAfterStyle = () => {
    if (isBeforeDark) {
      return {
        filter: 'brightness(1.1) contrast(1.05) saturate(1.1)',
      };
    }
    if (isVirtualStaging) {
      // Virtual staging effect
      return {
        filter: 'brightness(1.05) contrast(1.05) saturate(1.05)',
        backgroundImage: `url(https://images.unsplash.com/photo-1582417728413-b2347161b864?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: 0.99, // Slightly transparent to blend
      };
    }
    if (isTwilight) {
      return {
        filter: 'brightness(0.75) contrast(1.15) saturate(1.2) hue-rotate(-10deg)',
        backgroundImage: 'linear-gradient(to bottom, rgba(20, 30, 100, 0.5), rgba(10, 20, 60, 0.7))',
        backgroundBlendMode: 'overlay',
      };
    }
    if (isDecluttering) {
      return {
        filter: 'brightness(1.05) contrast(1.05) saturate(1.02)',
      };
    }
    return {
      filter: 'brightness(1.1) contrast(1.05) saturate(1.1)',
    };
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
              ...getBeforeStyle(),
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
              ...getAfterStyle(),
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
