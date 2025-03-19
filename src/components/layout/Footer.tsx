
import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-mkneutral-50 border-t border-mkneutral-100">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="md:col-span-1">
            <Link to="/" className="inline-flex items-center space-x-2 mb-4">
              <img 
                src="/logo.svg" 
                alt="MK Party" 
                className="h-10 w-auto"
              />
              <span className="font-heading text-xl font-medium">MK Party</span>
            </Link>
            <p className="text-mkneutral-600 mt-4 max-w-xs">
              Join the movement for a better South Africa. Your voice matters in shaping our nation's future.
            </p>
            
            <div className="flex space-x-4 mt-6">
              <a href="#" aria-label="Facebook" className="text-mkneutral-500 hover:text-primary transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" aria-label="Twitter" className="text-mkneutral-500 hover:text-primary transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" aria-label="Instagram" className="text-mkneutral-500 hover:text-primary transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" aria-label="LinkedIn" className="text-mkneutral-500 hover:text-primary transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h5 className="font-heading font-medium text-lg mb-4">Quick Links</h5>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-mkneutral-600 hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-mkneutral-600 hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/events" className="text-mkneutral-600 hover:text-primary transition-colors">
                  Events
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-mkneutral-600 hover:text-primary transition-colors">
                  Register
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-mkneutral-600 hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Legal */}
          <div>
            <h5 className="font-heading font-medium text-lg mb-4">Legal</h5>
            <ul className="space-y-3">
              <li>
                <Link to="/terms" className="text-mkneutral-600 hover:text-primary transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-mkneutral-600 hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/cookies" className="text-mkneutral-600 hover:text-primary transition-colors">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link to="/disclaimer" className="text-mkneutral-600 hover:text-primary transition-colors">
                  Disclaimer
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h5 className="font-heading font-medium text-lg mb-4">Contact</h5>
            <ul className="space-y-3">
              <li className="text-mkneutral-600">
                MK Party Head Office
              </li>
              <li className="text-mkneutral-600">
                123 Main Street, Johannesburg
              </li>
              <li className="text-mkneutral-600">
                South Africa, 2000
              </li>
              <li>
                <a href="tel:+27123456789" className="text-mkneutral-600 hover:text-primary transition-colors">
                  +27 12 345 6789
                </a>
              </li>
              <li>
                <a href="mailto:info@mkparty.org" className="text-mkneutral-600 hover:text-primary transition-colors">
                  info@mkparty.org
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-mkneutral-200 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-mkneutral-500 text-sm">
            &copy; {currentYear} MK Party. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0">
            <p className="text-mkneutral-500 text-sm">
              Designed with care for the people of South Africa
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
