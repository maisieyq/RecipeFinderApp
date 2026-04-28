import React from 'react';
import Svg, { Path, Circle, Rect } from 'react-native-svg';

export const FavouriteIcon = ({ color = '#FF7A2F', size = 22 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 20.5s-6.5-4.1-8.4-8.2C2 8.7 4.2 5.5 7.6 5.5c1.9 0 3.1 1 4.4 2.5 1.3-1.5 2.5-2.5 4.4-2.5 3.4 0 5.6 3.2 4 6.8-1.9 4.1-8.4 8.2-8.4 8.2Z"
      stroke={color}
      strokeWidth="2"
      strokeLinejoin="round"
      fill="none"
    />
  </Svg>
);

export const HistoryIcon = ({ color = '#FF7A2F', size = 22 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M4 6.5 9 4l6 3 5-2.5V17.5L15 20l-6-3-5 2.5V6.5Z"
      stroke={color}
      strokeWidth="2"
      strokeLinejoin="round"
      fill="none"
    />
    <Path d="M9 4v13M15 7v13" stroke={color} strokeWidth="2" />
  </Svg>
);

export const SettingIcon = ({ color = '#FF7A2F', size = 22 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="3.2" stroke={color} strokeWidth="2" />
    <Path
      d="M12 2.8v2.1M12 19.1v2.1M4.9 4.9l1.5 1.5M17.6 17.6l1.5 1.5M2.8 12h2.1M19.1 12h2.1M4.9 19.1l1.5-1.5M17.6 6.4l1.5-1.5"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </Svg>
);

export const EditIcon = ({ color = '#fff', size = 18 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M4 20h4l10-10a2.1 2.1 0 0 0-4-4L4 16v4Z"
      stroke={color}
      strokeWidth="2"
      strokeLinejoin="round"
      fill="none"
    />
  </Svg>
);

export const LogoutIcon = ({ color = '#fff', size = 18 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M10 17l5-5-5-5"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M15 12H4"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <Path
      d="M14 4h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-4"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </Svg>
);

export const ChevronRightIcon = ({ color = '#9A9A9A', size = 18 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M9 6l6 6-6 6" stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);