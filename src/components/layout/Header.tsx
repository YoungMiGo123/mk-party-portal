
import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Menu, X, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/store/authStore";

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

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isMenuOpen]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const isActive = (path: string) => location.pathname === path;

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
            to="/"
            className={`nav-link ${isActive("/") ? "active" : ""}`}
          >
            Home
          </Link>
          <Link
            to="/about"
            className={`nav-link ${isActive("/about") ? "active" : ""}`}
          >
            About Us
          </Link>
          <Link
            to="/events"
            className={`nav-link ${isActive("/events") ? "active" : ""}`}
          >
            Events
          </Link>
          <Link
            to="/contact"
            className={`nav-link ${isActive("/contact") ? "active" : ""}`}
          >
            Contact
          </Link>
          
          {isAuthenticated ? (
            <div className="flex items-center ml-4 space-x-2">
              <div className="flex items-center space-x-1 rounded-full bg-secondary px-3 py-1.5">
                <User size={16} className="text-mkneutral-500" />
                <span className="text-sm font-medium">{user?.name}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  logout();
                  navigate("/");
                }}
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

        {/* Mobile Navigation Toggle */}
        <button
          className="md:hidden p-2 rounded-md focus:outline-none"
          onClick={toggleMenu}
          aria-label="Toggle mobile menu"
        >
          {isMenuOpen ? (
            <X size={24} className="animate-scale" />
          ) : (
            <Menu size={24} className="animate-scale" />
          )}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      <div
        className={`fixed inset-0 z-40 bg-white transform transition-transform duration-300 ease-in-out ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="container mx-auto pt-20 px-4 h-full overflow-y-auto">
          <div className="flex flex-col space-y-6">
            <Link
              to="/"
              className="text-lg font-medium py-2"
              onClick={closeMenu}
            >
              Home
            </Link>
            <Link
              to="/about"
              className="text-lg font-medium py-2"
              onClick={closeMenu}
            >
              About Us
            </Link>
            <Link
              to="/events"
              className="text-lg font-medium py-2"
              onClick={closeMenu}
            >
              Events
            </Link>
            <Link
              to="/contact"
              className="text-lg font-medium py-2"
              onClick={closeMenu}
            >
              Contact
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
                    <span>My Profile</span>
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      closeMenu();
                      navigate("/");
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
        </div>
      </div>
    </header>
  );
};

export default Header;
