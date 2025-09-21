import { memo } from "react";
import { 
  Navbar, 
  NavBody, 
  NavItems, 
  MobileNav, 
  MobileNavHeader, 
  MobileNavMenu, 
  MobileNavToggle, 
  NavbarLogo, 
  NavbarButton 
} from "@/components/ui/resizable-navbar";

interface NavigationSectionProps {
  navItems: Array<{ name: string; link: string }>;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  onSignIn: () => void;
  onSignUp: () => void;
}

export const NavigationSection = memo(({ 
  navItems, 
  isMobileMenuOpen, 
  setIsMobileMenuOpen, 
  onSignIn, 
  onSignUp 
}: NavigationSectionProps) => {
  return (
    <Navbar>
      <NavBody>
        <NavbarLogo />
        <NavItems items={navItems} />
        <div className="flex items-center space-x-4">
          <NavbarButton 
            as="button" 
            variant="secondary"
            onClick={onSignIn}
          >
            Sign In
          </NavbarButton>
          <NavbarButton 
            as="button"
            onClick={onSignUp}
          >
            Get Started
          </NavbarButton>
        </div>
      </NavBody>
      <MobileNav>
        <MobileNavHeader>
          <NavbarLogo />
          <MobileNavToggle 
            isOpen={isMobileMenuOpen} 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
          />
        </MobileNavHeader>
        <MobileNavMenu 
          isOpen={isMobileMenuOpen} 
          onClose={() => setIsMobileMenuOpen(false)}
        >
          {navItems.map((item, idx) => (
            <a
              key={idx}
              href={item.link}
              className="w-full px-4 py-2 text-gray-300 hover:text-white transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item.name}
            </a>
          ))}
          <div className="flex flex-col space-y-2 w-full pt-4 border-t border-white/20">
            <NavbarButton 
              as="button" 
              variant="secondary"
              onClick={() => {
                onSignIn();
                setIsMobileMenuOpen(false);
              }}
              className="w-full"
            >
              Sign In
            </NavbarButton>
            <NavbarButton 
              as="button"
              onClick={() => {
                onSignUp();
                setIsMobileMenuOpen(false);
              }}
              className="w-full"
            >
              Get Started
            </NavbarButton>
          </div>
        </MobileNavMenu>
      </MobileNav>
    </Navbar>
  );
});

NavigationSection.displayName = "NavigationSection";