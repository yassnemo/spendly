import { memo } from "react";

interface FinanceSVGProps {
  className?: string;
}

export const FinanceSVG = memo(({ className }: FinanceSVGProps) => {
  return (
    <svg 
      className={className}
      viewBox="0 0 800 600" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background dashboard */}
      <rect x="50" y="50" width="700" height="500" rx="20" fill="hsl(240, 15%, 12%)" stroke="hsl(175, 70%, 55%)" strokeWidth="2"/>
      
      {/* Header bar */}
      <rect x="70" y="70" width="660" height="60" rx="10" fill="hsl(240, 10%, 18%)"/>
      <circle cx="100" cy="100" r="15" fill="hsl(2, 85%, 65%)"/>
      <rect x="130" y="90" width="120" height="8" rx="4" fill="hsl(175, 70%, 55%)"/>
      <rect x="130" y="105" width="80" height="6" rx="3" fill="hsl(150, 70%, 70%)"/>
      
      {/* Main chart area */}
      <rect x="70" y="150" width="400" height="300" rx="15" fill="hsl(240, 19%, 6%)" stroke="hsl(175, 70%, 55%)" strokeWidth="1"/>
      
      {/* Chart lines */}
      <path d="M100 400 L150 350 L200 320 L250 340 L300 280 L350 300 L400 250 L440 270" 
            stroke="hsl(2, 85%, 65%)" strokeWidth="3" fill="none"/>
      <path d="M100 420 L150 380 L200 360 L250 370 L300 320 L350 340 L400 290 L440 310" 
            stroke="hsl(175, 70%, 55%)" strokeWidth="3" fill="none"/>
      
      {/* Chart points */}
      <circle cx="150" cy="350" r="4" fill="hsl(2, 85%, 65%)"/>
      <circle cx="250" cy="340" r="4" fill="hsl(2, 85%, 65%)"/>
      <circle cx="350" cy="300" r="4" fill="hsl(2, 85%, 65%)"/>
      <circle cx="200" cy="360" r="4" fill="hsl(175, 70%, 55%)"/>
      <circle cx="300" cy="320" r="4" fill="hsl(175, 70%, 55%)"/>
      <circle cx="400" cy="290" r="4" fill="hsl(175, 70%, 55%)"/>
      
      {/* Side stats cards */}
      <rect x="500" y="150" width="230" height="80" rx="10" fill="hsl(240, 10%, 18%)" stroke="hsl(150, 70%, 70%)" strokeWidth="1"/>
      <circle cx="530" cy="175" r="8" fill="hsl(150, 70%, 70%)"/>
      <rect x="550" y="165" width="60" height="6" rx="3" fill="white"/>
      <rect x="550" y="180" width="40" height="4" rx="2" fill="hsl(150, 70%, 70%)"/>
      <rect x="620" y="165" width="80" height="12" rx="6" fill="hsl(2, 85%, 65%)"/>
      
      <rect x="500" y="250" width="230" height="80" rx="10" fill="hsl(240, 10%, 18%)" stroke="hsl(2, 85%, 65%)" strokeWidth="1"/>
      <circle cx="530" cy="275" r="8" fill="hsl(2, 85%, 65%)"/>
      <rect x="550" y="265" width="60" height="6" rx="3" fill="white"/>
      <rect x="550" y="280" width="40" height="4" rx="2" fill="hsl(2, 85%, 65%)"/>
      <rect x="620" y="265" width="80" height="12" rx="6" fill="hsl(175, 70%, 55%)"/>
      
      <rect x="500" y="350" width="230" height="80" rx="10" fill="hsl(240, 10%, 18%)" stroke="hsl(175, 70%, 55%)" strokeWidth="1"/>
      <circle cx="530" cy="375" r="8" fill="hsl(175, 70%, 55%)"/>
      <rect x="550" y="365" width="60" height="6" rx="3" fill="white"/>
      <rect x="550" y="380" width="40" height="4" rx="2" fill="hsl(175, 70%, 55%)"/>
      <rect x="620" y="365" width="80" height="12" rx="6" fill="hsl(150, 70%, 70%)"/>
      
      {/* Bottom navigation */}
      <rect x="70" y="470" width="660" height="60" rx="10" fill="hsl(240, 10%, 18%)"/>
      <circle cx="120" cy="500" r="12" fill="hsl(175, 70%, 55%)"/>
      <circle cx="180" cy="500" r="12" fill="hsl(240, 15%, 12%)" stroke="hsl(150, 70%, 70%)" strokeWidth="2"/>
      <circle cx="240" cy="500" r="12" fill="hsl(240, 15%, 12%)" stroke="hsl(150, 70%, 70%)" strokeWidth="2"/>
      <circle cx="300" cy="500" r="12" fill="hsl(240, 15%, 12%)" stroke="hsl(150, 70%, 70%)" strokeWidth="2"/>
      
      {/* Floating elements */}
      <circle cx="650" cy="120" r="20" fill="hsl(2, 85%, 65%)" opacity="0.8"/>
      <rect x="640" y="110" width="20" height="4" rx="2" fill="white"/>
      <rect x="640" y="120" width="20" height="4" rx="2" fill="white"/>
      <rect x="640" y="130" width="20" height="4" rx="2" fill="white"/>
    </svg>
  );
});

FinanceSVG.displayName = "FinanceSVG";