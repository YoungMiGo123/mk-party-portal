import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Menu, X, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/store/authStore";
import { 
  Drawer,
  DrawerContent,
  DrawerClose,
  DrawerTrigger,
  DrawerTitle
} from "@/components/ui/drawer";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle drawer open/close effects
  const handleDrawerOpenChange = (open: boolean) => {
    setIsMenuOpen(open);
    
    // Use a small timeout to ensure the drawer transition completes
    // before changing overflow style (prevents jumpy behavior)
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      // Use a small timeout to ensure the drawer transition completes before enabling scroll
      setTimeout(() => {
        document.body.style.overflow = "";
      }, 300);
    }
  };

  const closeMenu = () => setIsMenuOpen(false);

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/80 backdrop-blur-md shadow-sm py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <img
            src="/logo.svg"
            alt="MK Party"
            className="h-10 w-auto object-contain"
          />
          <span className="font-heading text-xl font-medium">MK Party</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          <Link
            to="/events"
            className={`nav-link ${isActive("/events") ? "active" : ""}`}
          >
            Events
          </Link>
          
          {isAuthenticated ? (
            <div className="flex items-center ml-4 space-x-2">
              <Link
                to="/dashboard"
                className={`flex items-center space-x-1 rounded-full ${
                  isActive("/dashboard") 
                    ? "bg-primary/10 text-primary" 
                    : "bg-secondary text-mkneutral-500 hover:bg-primary/5 hover:text-primary"
                } px-3 py-1.5 transition-colors`}
              >
                <User size={16} />
                <span className="text-sm font-medium">{user?.name}</span>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                title="Log out"
                className="rounded-full p-2"
              >
                <LogOut size={18} />
              </Button>
            </div>
          ) : (
            <div className="flex items-center ml-4 space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/login")}
                className="text-mkneutral-700 hover:text-primary hover:bg-primary/5"
              >
                Log in
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={() => navigate("/register")}
                className="bg-primary text-white rounded-full transition-all hover:bg-primary/90"
              >
                Register
              </Button>
            </div>
          )}
        </nav>

        {/* Mobile Navigation Drawer */}
        <div className="md:hidden">
          <Drawer open={isMenuOpen} onOpenChange={handleDrawerOpenChange}>
            <DrawerTrigger asChild>
              <Button
                className="p-2 rounded-md focus:outline-none"
                variant="ghost"
                aria-label="Toggle mobile menu"
              >
                <Menu size={24} className="animate-scale" />
              </Button>
            </DrawerTrigger>
            <DrawerContent className="h-[85vh] pt-5">
              {/* Add a hidden DrawerTitle for accessibility */}
              <DrawerTitle className="sr-only">Navigation Menu</DrawerTitle>
              
              <div className="flex justify-between items-center px-4 mb-4">
                <h2 className="text-lg font-medium">Menu</h2>
                <DrawerClose asChild>
                  <Button variant="ghost" size="icon">
                    <X size={24} className="animate-scale" />
                    <span className="sr-only">Close</span>
                  </Button>
                </DrawerClose>
              </div>
              <div className="px-4 flex flex-col space-y-6">
                <Link
                  to="/events"
                  className="text-lg font-medium py-2"
                  onClick={closeMenu}
                >
                  Events
                </Link>
                
                <div className="pt-4 border-t border-mkneutral-100">
                  {isAuthenticated ? (
                    <div className="flex flex-col space-y-4">
                      <Link
                        to="/dashboard"
                        className="flex items-center space-x-2 text-lg font-medium py-2"
                        onClick={closeMenu}
                      >
                        <User size={20} />
                        <span>My Dashboard</span>
                      </Link>
                      <button
                        onClick={() => {
                          closeMenu();
                          handleLogout();
                        }}
                        className="flex items-center space-x-2 text-lg font-medium py-2 text-red-500"
                      >
                        <LogOut size={20} />
                        <span>Log Out</span>
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col space-y-4">
                      <Button
                        variant="outline"
                        className="w-full text-center py-6"
                        onClick={() => {
                          closeMenu();
                          navigate("/login");
                        }}
                      >
                        Log in
                      </Button>
                      <Button
                        variant="default"
                        className="w-full text-center bg-primary hover:bg-primary/90 py-6"
                        onClick={() => {
                          closeMenu();
                          navigate("/register");
                        }}
                      >
                        Register
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      </div>
    </header>
  );
};

export default Header;
