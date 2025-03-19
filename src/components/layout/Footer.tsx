
import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-mkneutral-50 border-t border-mkneutral-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Logo and Description */}
          <div className="mb-6 md:mb-0 text-center md:text-left">
            <Link to="/" className="inline-flex items-center space-x-2 mb-4">
              <img 
                src="/logo.svg" 
                alt="MK Party" 
                className="h-10 w-auto"
              />
              <span className="font-heading text-xl font-medium">MK Party</span>
            </Link>
            <p className="text-mkneutral-600 mt-2 max-w-xs">
              Membership portal for MK Party. Access your membership information and events.
            </p>
          </div>
          
          {/* Quick Links */}
          <div className="flex flex-col items-center md:items-end">
            <div className="flex space-x-4 mb-4">
              <a href="https://www.facebook.com/mkparty" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-mkneutral-500 hover:text-primary transition-colors">
                <Facebook size={20} />
              </a>
              <a href="https://twitter.com/MKParty" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="text-mkneutral-500 hover:text-primary transition-colors">
                <Twitter size={20} />
              </a>
              <a href="https://www.instagram.com/mkparty" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-mkneutral-500 hover:text-primary transition-colors">
                <Instagram size={20} />
              </a>
            </div>
            
            <div className="flex space-x-4 text-sm">
              <Link to="/login" className="text-mkneutral-600 hover:text-primary transition-colors">
                Login
              </Link>
              <Link to="/register" className="text-mkneutral-600 hover:text-primary transition-colors">
                Register
              </Link>
              <Link to="/events" className="text-mkneutral-600 hover:text-primary transition-colors">
                Events
              </Link>
            </div>
          </div>
        </div>
        
        <div className="border-t border-mkneutral-200 mt-6 pt-6 text-center">
          <p className="text-mkneutral-500 text-sm">
            &copy; {currentYear} MK Party. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
