import React from 'react';
import Svg, { Path, Circle, Rect } from 'react-native-svg';

export const LockIcon = ({ color = '#FF7A2F', size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="5" y="10" width="14" height="10" rx="2" stroke={color} strokeWidth="2" />
    <Path d="M8 10V7.8A4 4 0 0 1 12 4a4 4 0 0 1 4 3.8V10" stroke={color} strokeWidth="2" />
  </Svg>
);

export const SupportIcon = ({ color = '#FF7A2F', size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2" />
    <Path
      d="M9.5 9.5a2.5 2.5 0 1 1 4.3 1.7c-.9.9-1.8 1.4-1.8 2.8"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <Circle cx="12" cy="17.2" r="1" fill={color} />
  </Svg>
);

export const TermsIcon = ({ color = '#FF7A2F', size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M7 3h7l4 4v14H7z" stroke={color} strokeWidth="2" strokeLinejoin="round" />
    <Path d="M14 3v4h4" stroke={color} strokeWidth="2" strokeLinejoin="round" />
    <Path d="M10 12h6M10 16h6" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

export const PrivacyIcon = ({ color = '#FF7A2F', size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 3l7 3v5c0 4.5-2.7 7.8-7 10-4.3-2.2-7-5.5-7-10V6l7-3Z"
      stroke={color}
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <Path d="M10 12.2l1.4 1.4 2.9-3.2" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

export const VersionIcon = ({ color = '#FF7A2F', size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2" />
    <Path d="M12 10v5" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Circle cx="12" cy="7.2" r="1" fill={color} />
  </Svg>
);