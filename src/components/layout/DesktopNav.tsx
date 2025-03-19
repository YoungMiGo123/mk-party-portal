
import { Link, useLocation, useNavigate } from "react-router-dom";
import { User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/store/authStore";

const DesktopNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
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
  );
};

export default DesktopNav;
