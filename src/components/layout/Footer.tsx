
import { Link } from "react-router-dom";
import { Facebook, Youtube, Twitter } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Left Column - Logo, Contact, and Mission Statement */}
          <div className="flex flex-col items-start">
            {/* Logo */}
            <div className="mb-4">
              <div className="flex items-center gap-3 mb-2">
                <img 
                  src="/lovable-uploads/e91116c1-e7fb-4dfb-93bb-7b8d5e7f521e.png" 
                  alt="Tholispane" 
                  className="h-12" 
                />
                <div>
                  <h2 className="text-3xl font-bold text-white mb-1">MK PARTY</h2>
                  <div className="bg-gold px-4 py-1 font-medium text-sm">
                    UMKHONTO WESIZWE
                  </div>
                </div>
              </div>
            </div>
            
            {/* Contact Info */}
            <div className="text-sm text-gray-300 mb-8">
              info@mkparty.co.za | mkparty.org.za
            </div>
            
            {/* Mission Statement */}
            <p className="text-sm text-gray-300 leading-relaxed max-w-2xl">
              Celebrating unity, advocating for positive change, and shaping a brighter tomorrow. uMkhonto
              weSizwe Party is more than a political force; it's a movement dedicated to the people. Explore our
              vision, mission, and the stories that define us. Read more about our journey and commitment to
              building a society that truly belongs to all. Join us in the pursuit of progress.
            </p>
          </div>

          {/* Right Column - Slogan, Contact, and Social */}
          <div className="flex flex-col items-end">
            {/* Slogan */}
            <div className="border border-white p-4 mb-6 text-center md:text-right max-w-md">
              <p className="text-sm">
                TIME TO RISE UP | ISIKHATHI SOKUVUKA | KE NAKO YA GO TSOGA
              </p>
            </div>
            
            {/* Contact Email */}
            <p className="text-sm mb-6">info@mkparty.co.za</p>
            
            {/* Social Icons */}
            <div className="flex space-x-3">
              <a 
                href="https://twitter.com/MKParty" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="bg-primary p-3 rounded-full hover:bg-primary-700 transition-colors"
              >
                <Twitter size={20} className="text-white" />
              </a>
              <a 
                href="https://www.facebook.com/mkparty" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="bg-primary p-3 rounded-full hover:bg-primary-700 transition-colors"
              >
                <Facebook size={20} className="text-white" />
              </a>
              <a 
                href="https://www.youtube.com/mkparty" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="bg-primary p-3 rounded-full hover:bg-primary-700 transition-colors"
              >
                <Youtube size={20} className="text-white" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-xs text-gray-400 border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p>© COPYRIGHT {currentYear} • MK PARTY • ALL RIGHTS RESERVED</p>
          <Link to="/cookie-policy" className="text-primary hover:underline mt-2 md:mt-0">
            COOKIE POLICY
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
