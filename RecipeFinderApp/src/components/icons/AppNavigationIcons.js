import React from 'react';
import Svg, { Path, Circle, Rect, Line } from 'react-native-svg';

export const HomeIcon = ({ color = '#999', size = 24 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      d="M3 10.5L12 3l9 7.5v8a2 2 0 0 1-2 2h-4v-6H9v6H5a2 2 0 0 1-2-2z"
      fill={color}
    />
  </Svg>
);

export const PantryIcon = ({ color = '#999', size = 24 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Rect x="5" y="2" width="1.6" height="6" rx="0.8" fill={color} />
    <Rect x="7.2" y="2" width="1.6" height="6" rx="0.8" fill={color} />
    <Rect x="9.4" y="2" width="1.6" height="6" rx="0.8" fill={color} />
    <Rect x="7.1" y="8" width="1.8" height="14" rx="0.9" fill={color} />
    <Circle cx="16.5" cy="6" r="3.2" fill={color} />
    <Rect x="15.6" y="9" width="1.8" height="13" rx="0.9" fill={color} />
  </Svg>
);

export const ProfileIcon = ({ color = '#999', size = 24 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      d="M12 12a5 5 0 1 0-0.001-10.001A5 5 0 0 0 12 12zm0 2c-4.4 0-8 2.2-8 5v1h16v-1c0-2.8-3.6-5-8-5z"
      fill={color}
    />
  </Svg>
);