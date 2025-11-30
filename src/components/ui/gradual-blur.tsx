'use client';

// Component added by Ansh - github.com/ansh-dhanani
// Adapted for Next.js/React

import React, {
  CSSProperties,
  useEffect,
  useRef,
  useState,
  useMemo,
  PropsWithChildren,
} from 'react';

// Types
type GradualBlurPosition = 'top' | 'bottom' | 'left' | 'right';
type GradualBlurCurve = 'linear' | 'bezier' | 'ease-in' | 'ease-out' | 'ease-in-out';
type GradualBlurPreset =
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'subtle'
  | 'intense'
  | 'smooth'
  | 'sharp'
  | 'header'
  | 'footer'
  | 'sidebar'
  | 'page-header'
  | 'page-footer';

export interface GradualBlurProps {
  position?: GradualBlurPosition;
  strength?: number;
  height?: string;
  width?: string;
  divCount?: number;
  exponential?: boolean;
  zIndex?: number;
  animated?: boolean | 'scroll';
  duration?: string;
  easing?: string;
  opacity?: number;
  curve?: GradualBlurCurve;
  responsive?: boolean;
  mobileHeight?: string;
  tabletHeight?: string;
  desktopHeight?: string;
  mobileWidth?: string;
  tabletWidth?: string;
  desktopWidth?: string;
  preset?: GradualBlurPreset;
  gpuOptimized?: boolean;
  hoverIntensity?: number;
  target?: 'parent' | 'page';
  onAnimationComplete?: () => void;
  className?: string;
  style?: CSSProperties;
}

// Default configuration
const DEFAULT_CONFIG: Required<Omit<GradualBlurProps, 'preset' | 'onAnimationComplete' | 'children'>> = {
  position: 'bottom',
  strength: 2,
  height: '6rem',
  width: '',
  divCount: 5,
  exponential: false,
  zIndex: 1000,
  animated: false,
  duration: '0.3s',
  easing: 'ease-out',
  opacity: 1,
  curve: 'linear',
  responsive: false,
  mobileHeight: '',
  tabletHeight: '',
  desktopHeight: '',
  mobileWidth: '',
  tabletWidth: '',
  desktopWidth: '',
  gpuOptimized: false,
  hoverIntensity: 0,
  target: 'parent',
  className: '',
  style: {},
};

// Presets for common use cases
const PRESETS: Record<GradualBlurPreset, Partial<GradualBlurProps>> = {
  top: { position: 'top', height: '6rem' },
  bottom: { position: 'bottom', height: '6rem' },
  left: { position: 'left', height: '6rem' },
  right: { position: 'right', height: '6rem' },
  subtle: { height: '4rem', strength: 1, opacity: 0.8, divCount: 3 },
  intense: { height: '10rem', strength: 4, divCount: 8, exponential: true },
  smooth: { height: '8rem', curve: 'bezier', divCount: 10 },
  sharp: { height: '5rem', curve: 'linear', divCount: 4 },
  header: { position: 'top', height: '8rem', curve: 'ease-out' },
  footer: { position: 'bottom', height: '8rem', curve: 'ease-out' },
  sidebar: { position: 'left', height: '6rem', strength: 2.5 },
  'page-header': { position: 'top', height: '10rem', target: 'page', strength: 3 },
  'page-footer': { position: 'bottom', height: '10rem', target: 'page', strength: 3 },
};

// Curve functions for blur progression
const CURVE_FUNCTIONS: Record<GradualBlurCurve, (p: number) => number> = {
  linear: (p) => p,
  bezier: (p) => p * p * (3 - 2 * p),
  'ease-in': (p) => p * p,
  'ease-out': (p) => 1 - Math.pow(1 - p, 2),
  'ease-in-out': (p) => (p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2),
};

// Utility functions
const mergeConfigs = (...configs: Partial<GradualBlurProps>[]): GradualBlurProps => {
  return configs.reduce((acc, config) => ({ ...acc, ...config }), {}) as GradualBlurProps;
};

const getGradientDirection = (position: GradualBlurPosition): string => {
  const directions: Record<GradualBlurPosition, string> = {
    top: 'to top',
    bottom: 'to bottom',
    left: 'to left',
    right: 'to right',
  };
  return directions[position] || 'to bottom';
};

const debounce = <T extends (...args: unknown[]) => void>(fn: T, wait: number) => {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), wait);
  };
};

// Custom hooks
function useResponsiveDimension(
  responsive: boolean,
  config: GradualBlurProps,
  key: 'height' | 'width'
): string {
  const [value, setValue] = useState<string>((config[key] as string) || '');

  useEffect(() => {
    if (!responsive) return;

    const calculate = () => {
      const width = window.innerWidth;
      let result = config[key] || '';

      if (width <= 480 && config[`mobile${key.charAt(0).toUpperCase() + key.slice(1)}` as keyof GradualBlurProps]) {
        result = config[`mobile${key.charAt(0).toUpperCase() + key.slice(1)}` as keyof GradualBlurProps] as string;
      } else if (width <= 768 && config[`tablet${key.charAt(0).toUpperCase() + key.slice(1)}` as keyof GradualBlurProps]) {
        result = config[`tablet${key.charAt(0).toUpperCase() + key.slice(1)}` as keyof GradualBlurProps] as string;
      } else if (width <= 1024 && config[`desktop${key.charAt(0).toUpperCase() + key.slice(1)}` as keyof GradualBlurProps]) {
        result = config[`desktop${key.charAt(0).toUpperCase() + key.slice(1)}` as keyof GradualBlurProps] as string;
      }

      setValue(result as string);
    };

    const debouncedCalc = debounce(calculate, 100);
    calculate();
    window.addEventListener('resize', debouncedCalc);
    return () => window.removeEventListener('resize', debouncedCalc);
  }, [responsive, config, key]);

  return responsive ? value : ((config[key] as string) || '');
}

function useIntersectionObserver(
  ref: React.RefObject<HTMLDivElement | null>,
  shouldObserve: boolean = false
): boolean {
  const [isVisible, setIsVisible] = useState(!shouldObserve);

  useEffect(() => {
    if (!shouldObserve || !ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref, shouldObserve]);

  return isVisible;
}

// Main component
function GradualBlur({
  children,
  ...props
}: PropsWithChildren<GradualBlurProps>): React.ReactElement {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const config = useMemo(() => {
    const presetConfig = props.preset && PRESETS[props.preset] ? PRESETS[props.preset] : {};
    return mergeConfigs(DEFAULT_CONFIG, presetConfig, props);
  }, [props]);

  const responsiveHeight = useResponsiveDimension(
    config.responsive || false,
    config,
    'height'
  );
  const responsiveWidth = useResponsiveDimension(
    config.responsive || false,
    config,
    'width'
  );

  const isVisible = useIntersectionObserver(containerRef, config.animated === 'scroll');

  // Generate blur divs
  const blurDivs = useMemo(() => {
    const divs: React.ReactNode[] = [];
    const divCount = config.divCount || 5;
    const increment = 100 / divCount;
    const strength = config.strength || 2;
    const currentStrength =
      isHovered && config.hoverIntensity ? strength * config.hoverIntensity : strength;

    const curveFunc = CURVE_FUNCTIONS[config.curve || 'linear'] || CURVE_FUNCTIONS.linear;

    for (let i = 1; i <= divCount; i++) {
      let progress = i / divCount;
      progress = curveFunc(progress);

      let blurValue: number;
      if (config.exponential) {
        blurValue = Math.pow(2, progress * 4) * 0.0625 * currentStrength;
      } else {
        blurValue = 0.0625 * (progress * divCount + 1) * currentStrength;
      }

      const p1 = Math.round((increment * i - increment) * 10) / 10;
      const p2 = Math.round(increment * i * 10) / 10;
      const p3 = Math.round((increment * i + increment) * 10) / 10;
      const p4 = Math.round((increment * i + increment * 2) * 10) / 10;

      let gradient = `transparent ${p1}%, black ${p2}%`;
      if (p3 <= 100) gradient += `, black ${p3}%`;
      if (p4 <= 100) gradient += `, transparent ${p4}%`;

      const direction = getGradientDirection(config.position || 'bottom');

      const divStyle: CSSProperties = {
        maskImage: `linear-gradient(${direction}, ${gradient})`,
        WebkitMaskImage: `linear-gradient(${direction}, ${gradient})`,
        backdropFilter: `blur(${blurValue.toFixed(3)}rem)`,
        opacity: config.opacity,
        transition:
          config.animated && config.animated !== 'scroll'
            ? `backdrop-filter ${config.duration} ${config.easing}`
            : undefined,
      };

      divs.push(<div key={i} className="absolute inset-0" style={divStyle} />);
    }

    return divs;
  }, [config, isHovered]);

  // Container styles
  const containerStyle: CSSProperties = useMemo(() => {
    const position = config.position || 'bottom';
    const isVertical = ['top', 'bottom'].includes(position);
    const isHorizontal = ['left', 'right'].includes(position);
    const isPageTarget = config.target === 'page';

    const baseStyle: CSSProperties = {
      position: isPageTarget ? 'fixed' : 'absolute',
      pointerEvents: config.hoverIntensity ? 'auto' : 'none',
      opacity: isVisible ? 1 : 0,
      transition: config.animated ? `opacity ${config.duration} ${config.easing}` : undefined,
      zIndex: isPageTarget ? (config.zIndex || 1000) + 100 : config.zIndex,
      ...config.style,
    };

    if (isVertical) {
      baseStyle.height = responsiveHeight || config.height;
      baseStyle.width = responsiveWidth || '100%';
      baseStyle[position as 'top' | 'bottom'] = 0;
      baseStyle.left = 0;
      baseStyle.right = 0;
    } else if (isHorizontal) {
      baseStyle.width = responsiveWidth || responsiveHeight || config.height;
      baseStyle.height = '100%';
      baseStyle[position as 'left' | 'right'] = 0;
      baseStyle.top = 0;
      baseStyle.bottom = 0;
    }

    return baseStyle;
  }, [config, responsiveHeight, responsiveWidth, isVisible]);

  // Animation complete callback
  useEffect(() => {
    if (isVisible && config.animated === 'scroll' && config.onAnimationComplete) {
      const timeout = setTimeout(
        () => config.onAnimationComplete?.(),
        parseFloat(config.duration || '0.3') * 1000
      );
      return () => clearTimeout(timeout);
    }
  }, [isVisible, config]);

  return (
    <div
      ref={containerRef}
      className={`gradual-blur relative isolate ${
        config.target === 'page' ? 'gradual-blur-page' : 'gradual-blur-parent'
      } ${config.className || ''}`}
      style={containerStyle}
      onMouseEnter={config.hoverIntensity ? () => setIsHovered(true) : undefined}
      onMouseLeave={config.hoverIntensity ? () => setIsHovered(false) : undefined}
    >
      <div className="relative w-full h-full">{blurDivs}</div>
      {children && <div className="relative">{children}</div>}
    </div>
  );
}

export default React.memo(GradualBlur);
