
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

const Events = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Open the external events page in a new tab
    window.open("https://mkparty.org.za/category/media-and-press/events/", "_blank");
    
    // Navigate back to login/dashboard based on auth status after a short delay
    const timer = setTimeout(() => {
      navigate("/");
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-mkneutral-50">
      <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md">
        <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto mb-4" />
        <h1 className="text-2xl font-medium mb-2">Redirecting you to Events</h1>
        <p className="text-mkneutral-500 mb-4">
          You're being redirected to the official MK Party events page.
          If you're not redirected automatically, please click the link below:
        </p>
        <a 
          href="https://mkparty.org.za/category/media-and-press/events/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-primary hover:underline font-medium"
        >
          Go to MK Party Events →
        </a>
      </div>
    </div>
  );
};

export default Events;
