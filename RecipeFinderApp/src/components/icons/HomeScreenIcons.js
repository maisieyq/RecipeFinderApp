import React from 'react';
import Svg, { Path, Circle, Line } from 'react-native-svg';

export const ThemeIcon = ({ color = '#fff', size = 24 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      d="M21 14.5A8.5 8.5 0 0 1 9.5 3a8.5 8.5 0 1 0 11.5 11.5z"
      fill={color}
    />
  </Svg>
);

export const SunIcon = ({ color = '#fff', size = 24 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Circle cx="12" cy="12" r="4" fill={color} />
    <Line x1="12" y1="2" x2="12" y2="5" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Line x1="12" y1="19" x2="12" y2="22" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Line x1="2" y1="12" x2="5" y2="12" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Line x1="19" y1="12" x2="22" y2="12" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Line x1="4.9" y1="4.9" x2="7" y2="7" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Line x1="17" y1="17" x2="19.1" y2="19.1" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Line x1="17" y1="7" x2="19.1" y2="4.9" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Line x1="4.9" y1="19.1" x2="7" y2="17" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

export const StarIcon = ({ color = '#FFF', size = 14 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 3l2.6 5.3 5.9.9-4.3 4.2 1 5.8L12 16.9 6.8 19.2l1-5.8-4.3-4.2 5.9-.9L12 3z"
      fill={color}
    />
  </Svg>
);