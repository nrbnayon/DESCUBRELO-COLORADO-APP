// utils/shadows.ts
import { Platform, ViewStyle } from "react-native";

type ShadowConfig = {
  x?: number;
  y?: number;
  blur?: number;
  color?: string;
  opacity?: number;
  elevation?: number; // Android-specific override
};

/**
 * Creates a cross-platform shadow style with optimized calculations
 * @param config Shadow configuration parameters
 * @returns ViewStyle with platform-appropriate shadow properties
 */
export const createShadow = (config: ShadowConfig = {}): ViewStyle => {
  const {
    x = 0,
    y = 4,
    blur = 12,
    color = "#000000",
    opacity = 0.15,
    elevation,
  } = config;

  // Normalize inputs
  const normalizedX = Number(x) || 0;
  const normalizedY = Number(y) || 0;
  const normalizedBlur = Math.max(0, Number(blur) || 0);
  const normalizedOpacity = Math.min(1, Math.max(0, Number(opacity) || 0));

  if (Platform.OS === "android") {
    // Calculate elevation based on shadow intensity
    const calculatedElevation =
      elevation !== undefined
        ? Math.max(0, Math.min(24, elevation)) // Android elevation range: 0-24
        : Math.max(
            1,
            Math.min(
              Math.round((Math.abs(normalizedY) + normalizedBlur) / 3),
              24
            )
          );

    return {
      elevation: calculatedElevation,
      shadowColor: color, // Android also respects shadowColor for elevation
    };
  }

  // iOS shadow properties with better calculations
  return {
    shadowColor: color,
    shadowOffset: {
      width: normalizedX,
      height: normalizedY,
    },
    shadowOpacity: normalizedOpacity,
    shadowRadius: Math.max(0, normalizedBlur / 2), // iOS shadowRadius ≈ blur/2
  };
};

/**
 * Predefined shadow presets optimized for both platforms
 */
export const shadows = {
  none: createShadow({ y: 0, blur: 0, opacity: 0, elevation: 0 }),
  xs: createShadow({ y: 1, blur: 3, opacity: 0.1, elevation: 1 }),
  sm: createShadow({ y: 1, blur: 6, opacity: 0.1, elevation: 2 }),
  md: createShadow({ y: 2, blur: 8, opacity: 0.12, elevation: 4 }),
  lg: createShadow({ y: 4, blur: 12, opacity: 0.15, elevation: 6 }),
  xl: createShadow({ y: 6, blur: 20, opacity: 0.15, elevation: 8 }),
  "2xl": createShadow({ y: 8, blur: 25, opacity: 0.2, elevation: 12 }),
  // Special presets
  button: createShadow({ y: 2, blur: 4, opacity: 0.1, elevation: 2 }),
  card: createShadow({ y: 2, blur: 8, opacity: 0.1, elevation: 3 }),
  modal: createShadow({ y: 10, blur: 40, opacity: 0.15, elevation: 10 }),
  floating: createShadow({ y: 6, blur: 16, opacity: 0.12, elevation: 8 }),
};

/**
 * Enhanced CSS box-shadow parser with better error handling
 * @param cssString e.g. "0 4px 12px rgba(0,0,0,0.15)" or "2px 4px 8px #000"
 */
export const cssToShadow = (cssString: string): ViewStyle => {
  if (!cssString || typeof cssString !== "string") {
    return {};
  }

  try {
    // Clean and normalize the input
    const cleanString = cssString
      .trim()
      .replace(/\s+/g, " ")
      .replace(/px/g, "");

    const parts = cleanString.split(" ");

    if (parts.length < 3) {
      console.warn("Invalid CSS shadow format. Expected: 'x y blur [color]'");
      return {};
    }

    const x = parseFloat(parts[0]) || 0;
    const y = parseFloat(parts[1]) || 0;
    const blur = Math.max(0, parseFloat(parts[2]) || 0);

    let color = "#000000";
    let opacity = 0.15;

    // Parse color (rgba, rgb, hex)
    const colorPart = parts.slice(3).join(" ");
    if (colorPart) {
      if (colorPart.includes("rgba") || colorPart.includes("rgb")) {
        const match = colorPart.match(/rgba?\s*\(\s*([^)]+)\s*\)/);
        if (match) {
          const values = match[1].split(",").map((v) => v.trim());
          if (values.length >= 3) {
            const r = Math.min(255, Math.max(0, parseInt(values[0]) || 0));
            const g = Math.min(255, Math.max(0, parseInt(values[1]) || 0));
            const b = Math.min(255, Math.max(0, parseInt(values[2]) || 0));

            color = `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;

            if (values[3] !== undefined) {
              opacity = Math.min(1, Math.max(0, parseFloat(values[3]) || 0));
            }
          }
        }
      } else if (colorPart.startsWith("#")) {
        // Validate hex color
        const hexMatch = colorPart.match(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/);
        if (hexMatch) {
          color = hexMatch[0];
        }
      }
    }

    return createShadow({ x, y, blur, color, opacity });
  } catch (error) {
    console.warn("Error parsing CSS shadow:", error);
    return {};
  }
};

/**
 * Creates layered shadows for more complex effects
 * @param shadows Array of shadow configurations
 */
export const createLayeredShadow = (
  shadowConfigs: ShadowConfig[]
): ViewStyle[] => {
  if (!Array.isArray(shadowConfigs) || shadowConfigs.length === 0) {
    return [];
  }

  return shadowConfigs.map((config) => createShadow(config));
};

/**
 * Utility to check if shadows are supported on current platform
 */
export const shadowsSupported = (): boolean => {
  return Platform.OS === "ios" || Platform.OS === "android";
};

/**
 * Get platform-specific shadow implementation info
 */
export const getShadowInfo = () => {
  return {
    platform: Platform.OS,
    supportsElevation: Platform.OS === "android",
    supportsShadowRadius: Platform.OS === "ios",
    maxElevation: Platform.OS === "android" ? 24 : null,
  };
};

// Usage examples with comprehensive scenarios
export const shadowExamples = {
  // Basic usage
  basic: createShadow({ y: 4, blur: 8, opacity: 0.1 }),

  // Custom shadow matching your design
  custom: createShadow({ x: 0, y: 4, blur: 14.9, opacity: 0.08 }),

  // Preset shadows
  cardShadow: shadows.card,
  buttonShadow: shadows.button,

  // From CSS
  fromCSS: cssToShadow("0 4px 12px rgba(0,0,0,0.15)"),
  fromCSSHex: cssToShadow("2px 4px 8px #333333"),

  // Layered shadows (for iOS mainly)
  layered: createLayeredShadow([
    { y: 1, blur: 3, opacity: 0.1 },
    { y: 4, blur: 12, opacity: 0.05 },
  ]),

  // Platform-specific optimized
  platformOptimized: Platform.select({
    ios: createShadow({ y: 2, blur: 8, opacity: 0.15 }),
    android: createShadow({ elevation: 4 }),
    default: {},
  }),
};

// // Usage Examples:
// import { createShadow, shadows, cssToShadow, shadowsSupported } from './utils/shadows';

// // Check if shadows are supported
// if (shadowsSupported()) {
//   // Basic usage
//   <View style={createShadow({ y: 4, blur: 12, opacity: 0.1 })} />

//   // Preset usage
//   <View style={shadows.card} />

//   // From CSS
//   <View style={cssToShadow("0 4px 12px rgba(0,0,0,0.15)")} />

//   // Combined with other styles
//   <View style={[styles.container, shadows.lg]} />

//   // Conditional shadows
//   <View style={[
//     styles.base,
//     Platform.OS === 'ios' && shadows.card,
//     Platform.OS === 'android' && { elevation: 4 }
//   ]} />
// }

// // utils/shadows.ts
// import { Platform, ViewStyle } from "react-native";

// type ShadowConfig = {
//   x?: number;
//   y?: number;
//   blur?: number;
//   spread?: number; // Note: Only affects iOS via shadowRadius approximation
//   color?: string;
//   opacity?: number;
//   elevation?: number; // Android-specific override
// };

// /**
//  * Creates a cross-platform shadow style
//  * @param config Shadow configuration parameters
//  * @returns ViewStyle with platform-appropriate shadow properties
//  */
// export const createShadow = (config: ShadowConfig = {}): ViewStyle => {
//   const {
//     x = 0,
//     y = 4,
//     blur = 12,
//     spread = 0,
//     color = "#000000",
//     opacity = 0.15,
//     elevation,
//   } = config;

//   if (Platform.OS === "android") {
//     return {
//       elevation:
//         elevation ?? Math.max(1, Math.min(Math.round((Math.abs(y) + blur) / 4), 24)),
//       shadowColor: color,
//     };
//   }

//   // iOS shadow properties
//   return {
//     shadowColor: color,
//     shadowOffset: {
//       width: x,
//       height: y,
//     },
//     shadowOpacity: opacity,
//     shadowRadius: Math.max(0, blur / 2), // Ensure non-negative
//   };
// };

// /**
//  * Predefined shadow presets for common use cases
//  */
// export const shadows = {
//   none: createShadow({ y: 0, blur: 0, opacity: 0, elevation: 0 }),
//   xs: createShadow({ y: 1, blur: 2, opacity: 0.05, elevation: 1 }),
//   sm: createShadow({ y: 2, blur: 4, opacity: 0.1, elevation: 2 }),
//   md: createShadow({ y: 4, blur: 8, opacity: 0.15, elevation: 4 }),
//   lg: createShadow({ y: 6, blur: 12, opacity: 0.2, elevation: 6 }),
//   xl: createShadow({ y: 8, blur: 16, opacity: 0.25, elevation: 8 }),
//   "2xl": createShadow({ y: 12, blur: 24, opacity: 0.3, elevation: 12 }),
//   inner: createShadow({ x: 0, y: 2, blur: 4, opacity: 0.05, elevation: 2 }),
//   outline: createShadow({ x: 0, y: 0, blur: 2, opacity: 0.5, elevation: 1 }),
// };

// /**
//  * Converts CSS box-shadow string to React Native shadow
//  * @param cssString e.g. "0 4px 12px rgba(0,0,0,0.15)"
//  */
// export const cssToShadow = (cssString: string): ViewStyle => {
//   try {
//     const parts = cssString.trim().replace(/\s+/g, ' ').split(' ');

//     if (parts.length < 3) return {};

//     const x = parseFloat(parts[0].replace('px', ''));
//     const y = parseFloat(parts[1].replace('px', ''));
//     const blur = parseFloat(parts[2].replace('px', ''));

//     let color = "#000000";
//     let opacity = 0.1;

//     const colorPart = parts[3];
//     if (colorPart) {
//       if (colorPart.includes("rgba")) {
//         const match = colorPart.match(/rgba?\(([^)]+)\)/);
//         if (match) {
//           const values = match[1].split(',').map(v => v.trim());
//           const r = parseInt(values[0]).toString(16).padStart(2, "0");
//           const g = parseInt(values[1]).toString(16).padStart(2, "0");
//           const b = parseInt(values[2]).toString(16).padStart(2, "0");
//           color = `#${r}${g}${b}`;
//           opacity = parseFloat(values[3]);
//         }
//       } else if (colorPart.startsWith("#")) {
//         color = colorPart;
//       }
//     }

//     return createShadow({ x, y, blur, color, opacity });
//   } catch (error) {
//     return {};
//   }
// };

// // Usage examples:
// export const shadowExamples = {
//   custom: createShadow({ x: 0, y: 4, blur: 14.9, opacity: 0.08 }), // From your design
//   preset: shadows.lg,
//   fromCSS: cssToShadow("0 4px 12px rgba(0,0,0,0.15)"),
// };

// // // Basic usage
// // import { createShadow, shadows } from './utils/shadows';

// // // Custom shadow
// // <View style={createShadow({ x: 0, y: 4, blur: 14.9, opacity: 0.08 })} />

// // // Preset shadow
// // <View style={shadows.md} />

// // // From CSS string
// // <View style={cssToShadow("0 4px 12px rgba(0,0,0,0.15)")} />
