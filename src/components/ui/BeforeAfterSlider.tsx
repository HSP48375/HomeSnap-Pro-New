
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
  // Default fallback images if the provided ones don't load
  const defaultImage = '/assets/placeholder-property.jpg';

  const handleBeforeImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    console.error(`Failed to load before image: ${beforeImage}`);
    e.currentTarget.src = defaultImage;
  };

  const handleAfterImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    console.error(`Failed to load after image: ${afterImage}`);
    e.currentTarget.src = defaultImage;
  };

  // Get specific styles for before image based on edit type
  const getBeforeStyle = () => {
    if (isBeforeDark) {
      return {
        filter: 'brightness(0.85) contrast(0.9) saturate(0.9)',
      };
    }
    if (isVirtualStaging) {
      return {
        filter: 'brightness(1.0) contrast(1.0) saturate(1.0)',
      };
    }
    if (isTwilight) {
      return {
        filter: 'brightness(1.0) contrast(1.0) saturate(1.0)',
      };
    }
    if (isDecluttering) {
      return {
        filter: 'brightness(1.0) contrast(1.0) saturate(1.0)',
      };
    }
    return {
      filter: 'brightness(1.0) contrast(1.0) saturate(1.0)',
    };
  };

  // Get specific styles for after image based on edit type
  const getAfterStyle = () => {
    if (isBeforeDark) {
      return {
        filter: 'brightness(1.1) contrast(1.05) saturate(1.1)',
      };
    }
    if (isVirtualStaging) {
      return {
        filter: 'brightness(1.05) contrast(1.05) saturate(1.05)',
      };
    }
    if (isTwilight) {
      return {
        filter: 'brightness(1.0) contrast(1.0) saturate(1.0)',
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
    <div className="compare-slider-container">
      {/* BEFORE Label */}
      <div className="compare-slider-label" style={{ top: '12px', left: '12px' }}>
        {beforeLabel}
      </div>

      {/* AFTER Label */}
      <div className="compare-slider-label" style={{ top: '12px', right: '12px' }}>
        {afterLabel}
      </div>

      {/* Slider */}
      <ReactCompareSlider
        className="slider-background"
        itemOne={
          <ReactCompareSliderImage
            src={beforeImage}
            alt="Before editing"
            onError={handleBeforeImageError}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
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
              objectFit: 'contain',
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
