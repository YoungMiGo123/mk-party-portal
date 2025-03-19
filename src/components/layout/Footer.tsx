
import { Link } from "react-router-dom";
import { Facebook, Twitter, Youtube } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Left Column - Logo and Contact */}
          <div className="flex flex-col items-center md:items-start">
            <div className="mb-4 text-center md:text-left">
              <h2 className="text-3xl font-bold text-white mb-1">MK PARTY</h2>
              <div className="bg-yellow-500 text-black px-4 py-1 font-medium text-sm">
                UMKHONTO WESIZWE
              </div>
            </div>
            <div className="text-sm text-gray-300 mt-2">
              info@mkparty.co.za | mkparty.org.za
            </div>
          </div>

          {/* Right Column - Slogan and Social */}
          <div className="flex flex-col items-center md:items-end">
            <div className="border border-white p-4 mb-6 text-center md:text-right max-w-sm">
              <p className="text-sm">
                TIME TO RISE UP | ISIKHATHI SOKUVUKA | KE NAKO YA GO TSOGA
              </p>
            </div>
            <p className="text-sm mb-6">info@mkparty.co.za</p>
            <div className="flex space-x-3">
              <a 
                href="https://twitter.com/MKParty" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="bg-green-500 p-3 rounded-full hover:bg-green-600 transition-colors"
              >
                <Twitter size={20} className="text-white" />
              </a>
              <a 
                href="https://www.facebook.com/mkparty" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="bg-green-500 p-3 rounded-full hover:bg-green-600 transition-colors"
              >
                <Facebook size={20} className="text-white" />
              </a>
              <a 
                href="https://www.youtube.com/mkparty" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="bg-green-500 p-3 rounded-full hover:bg-green-600 transition-colors"
              >
                <Youtube size={20} className="text-white" />
              </a>
            </div>
          </div>
        </div>

        {/* Mission Statement */}
        <div className="mb-8 text-center md:text-left max-w-4xl mx-auto md:mx-0">
          <p className="text-sm text-gray-300 leading-relaxed">
            Celebrating unity, advocating for positive change, and shaping a brighter tomorrow. uMkhonto
            weSizwe Party is more than a political force; it's a movement dedicated to the people. Explore our
            vision, mission, and the stories that define us. Read more about our journey and commitment to
            building a society that truly belongs to all. Join us in the pursuit of progress.
          </p>
        </div>

        {/* Copyright */}
        <div className="text-xs text-gray-400 border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p>© COPYRIGHT {currentYear} • MK PARTY • ALL RIGHTS RESERVED</p>
          <Link to="/cookie-policy" className="text-green-500 hover:underline mt-2 md:mt-0">
            COOKIE POLICY
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
