// ── Orange & White theme ─────────────────────────────────────────
export const colors = {
  // Brand orange palette
  orange:       '#FF6B2C',
  orangeLight:  '#FF8C55',
  orangePale:   '#FFF0E8',
  orangeMuted:  '#FFDBCA',

  // Neutrals
  white:        '#FFFFFF',
  offWhite:     '#FAFAFA',
  bgGray:       '#F5F5F5',
  borderLight:  '#EEEEEE',
  borderMed:    '#E0E0E0',

  // Text
  textDark:     '#1A1A1A',
  textMid:      '#555555',
  textMuted:    '#999999',
  textLight:    '#BBBBBB',

  // Status
  green:        '#4CAF50',
  greenPale:    '#E8F5E9',
  amber:        '#FF9800',
  amberPale:    '#FFF3E0',
  red:          '#F44336',

  // Misc
  black:        '#000000',
};

// Only one theme now — clean white/orange (light-mode focused)
export const lightTheme = {
  background:    colors.white,
  surface:       colors.offWhite,
  card:          colors.white,
  cardAlt:       colors.bgGray,
  border:        colors.borderLight,
  borderMed:     colors.borderMed,
  text:          colors.textDark,
  textSecondary: colors.textMid,
  textMuted:     colors.textMuted,
  accent:        colors.orange,
  accentLight:   colors.orangeLight,
  accentPale:    colors.orangePale,
  tabBar:        colors.white,
  header:        colors.white,
  input:         colors.bgGray,
  inputBorder:   colors.borderMed,
  placeholder:   colors.textLight,
  tag:           colors.orangePale,
  tagText:       colors.orange,
  shadow:        'rgba(0,0,0,0.08)',
};

// Dark theme kept for toggle compatibility
export const darkTheme = {
  background:    '#121212',
  surface:       '#1E1E1E',
  card:          '#252525',
  cardAlt:       '#2C2C2C',
  border:        '#333333',
  borderMed:     '#444444',
  text:          '#F5F5F5',
  textSecondary: '#CCCCCC',
  textMuted:     '#888888',
  accent:        colors.orange,
  accentLight:   colors.orangeLight,
  accentPale:    '#3D2010',
  tabBar:        '#1A1A1A',
  header:        '#1A1A1A',
  input:         '#2C2C2C',
  inputBorder:   '#444444',
  placeholder:   '#666666',
  tag:           '#2C1A0A',
  tagText:       colors.orangeLight,
  shadow:        'rgba(0,0,0,0.4)',
};

export const typography = {
  sizes: {
    xs:      11,
    sm:      13,
    base:    15,
    md:      17,
    lg:      20,
    xl:      24,
    xxl:     30,
    display: 38,
  },
  weights: {
    light:    '300',
    regular:  '400',
    medium:   '500',
    semibold: '600',
    bold:     '700',
    heavy:    '800',
  },
};

export const spacing = {
  xs:   4,
  sm:   8,
  md:   12,
  base: 16,
  lg:   20,
  xl:   24,
  xxl:  32,
  xxxl: 48,
};

export const radius = {
  sm:    6,
  md:    10,
  lg:    16,
  xl:    24,
  round: 999,
};

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
};
