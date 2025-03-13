import React from 'react';
import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider';

interface BeforeAfterSliderProps {
  before: string;
  after: string;
}

const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({ before, after }) => {
  return (
    <ReactCompareSlider
      itemOne={
        <ReactCompareSliderImage
          src={before}
          alt="Before"
          style={{ objectFit: 'contain', height: '100%', width: '100%' }}
          onError={() => console.log('Failed to load before image:', before)}
        />
      }
      itemTwo={
        <ReactCompareSliderImage
          src={after}
          alt="After"
          style={{ objectFit: 'contain', height: '100%', width: '100%' }}
          onError={() => console.log('Failed to load after image:', after)}
        />
      }
      position={50}
      style={{
        height: '100%',
        width: '100%',
        borderRadius: '0.75rem',
        backgroundColor: '#0a0a14',
      }}
    />
  );
};

export default BeforeAfterSlider;