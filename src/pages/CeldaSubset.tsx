// CeldaSubset.tsx
import React from 'react';
import { useSpring, animated, config } from '@react-spring/web';

export const DPCell = ({ value, delay, isHeader, headerText, isFirstColumn, firstColumnText }) => {
  const anim = useSpring({
    backgroundColor: isHeader || isFirstColumn ? '#3b82f6' : value ? '#10b981' : '#ef4444',
    opacity: 1,
    from: { opacity: 0 },
    delay,
    config: config.gentle,
  });
  
  return (
    <animated.div
      style={anim}
      className={`w-12 h-12 flex items-center justify-center border border-white text-white font-bold text-lg 
        ${isHeader || isFirstColumn ? 'bg-blue-500' : ''}`}
    >
      {isHeader ? headerText : isFirstColumn ? firstColumnText : value ? '✔️' : '❌'}
    </animated.div>
  );
};

export const ApproxCell = ({ value, highlight, style, isArrow = false }) => {
  return (
    <animated.div
      style={style}
      className={`w-16 h-16 m-1 flex items-center justify-center border-2 rounded-lg text-lg font-bold 
        ${highlight ? 'text-black bg-green-400 animate-pulse' : 'text-white bg-gray-700'} 
        ${isArrow ? 'bg-purple-500' : ''} animate-fade-in-up`}
    >
      {isArrow ? '➡️' : value}
    </animated.div>
  );
};