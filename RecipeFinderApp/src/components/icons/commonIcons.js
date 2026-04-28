import React from 'react';
import Svg, { Circle, Line, Path } from 'react-native-svg';

// Search
export const SearchIcon = ({ color = '#9A9A9A', size = 24 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Circle
      cx="11"
      cy="11"
      r="7"
      stroke={color}
      strokeWidth="2"
      fill="none"
    />
    <Line
      x1="16"
      y1="16"
      x2="21"
      y2="21"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </Svg>
);

// <-
export const BackIcon = ({ color = '#000', size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M15 6l-6 6 6 6"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Heart (fav)
export const HeartIcon = ({ filled = false, color = '#FF7A2F', size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 20s-7-4.35-9-8.54C1.45 8.2 3.72 5 7.15 5c1.98 0 3.25 1.05 4.35 2.45C12.6 6.05 13.87 5 15.85 5 19.28 5 21.55 8.2 21 11.46 19 15.65 12 20 12 20Z"
      fill={filled ? color : 'none'}
      stroke={filled ? color : color}
      strokeWidth={filled ? '1.2' : '2'}
      strokeLinejoin="round"
    />
  </Svg>
);

// Clock
export const TimeIcon = ({ color = '#9A9A9A', size = 14 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2" fill="none" />
    <Path d="M12 7v5l3 2" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

// Calories
export const CalorieIcon = ({ color = '#9A9A9A', size = 10 }) => (
  <Svg width={size} height={size} viewBox="0 0 10 10">
    <Circle cx="4" cy="4" r="3" fill={color} />
  </Svg>
);

// People
export const PeopleIcon = ({ color = '#9A9A9A', size = 14 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Circle cx="8" cy="9" r="3" fill={color} />
    <Circle cx="16" cy="9" r="3" fill={color} />
    <Path d="M3 20c0-3 3-5 5-5s5 2 5 5" fill={color} />
    <Path d="M11 20c0-3 3-5 5-5s5 2 5 5" fill={color} />
  </Svg>
);

// Star
export const StarIcon = ({ color = '#FFD700', size = 14 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      d="M12 2l3 7h7l-5.5 4.2L18 21l-6-4-6 4 1.5-7.8L2 9h7l3-7Z"
      fill={color}
    />
  </Svg>
);

// Eye Open (password)
export const EyeIcon = ({ color = '#9A9A9A', size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Z"
      stroke={color}
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <Circle cx="12" cy="12" r="3" stroke={color} strokeWidth="2" />
  </Svg>
);

// Eye Close (password)
export const EyeOffIcon = ({ color = '#9A9A9A', size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M3 3l18 18"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <Path
      d="M10.6 6.3A11.8 11.8 0 0 1 12 6c6.5 0 10 6 10 6a17.6 17.6 0 0 1-4.1 4.6"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M6.1 7.1C3.5 8.8 2 12 2 12s3.5 6 10 6c1.6 0 3-.3 4.3-.9"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M9.9 9.9A3 3 0 0 0 14.1 14.1"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </Svg>
);

// x icon (close)
export const CloseIcon = ({ color = '#fff', size = 12 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M6 6l12 12M18 6l-12 12"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </Svg>
);

// x icon (clear) 
export const ClearIcon = ({ color = '#9A9A9A', size = 16 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M6 6l12 12M18 6l-12 12"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </Svg>
);

// for steps tab
export const CheckIcon = ({ color = '#fff', size = 14 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="m5 12 5 5L19 8"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// filter icon
export const FilterIcon = ({ color = '#FF7A2F', size = 18 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M4 6h16M7 12h10M10 18h4"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </Svg>
);

// edit icon
export const EditIcon = ({ size = 18, color = '#ff6b2c' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M14.06 4.94l3.75 3.75"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// ↑
export const UpIcon = ({ size = 14, color = '#FF6B3D' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 5l-7 7M12 5l7 7M12 5v14"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// ↓
export const DownIcon = ({ size = 14, color = '#FF6B3D' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 19l-7-7M12 19l7-7M12 19V5"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// +
export const PlusIcon = ({ color = '#fff', size = 22 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 5v14M5 12h14"
      stroke={color}
      strokeWidth="2.4"
      strokeLinecap="round"
    />
  </Svg>
);

// menu / 3-line icon
export const MenuIcon = ({ color = '#000', size = 22 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M4 7h16M4 12h16M4 17h16"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </Svg>
);