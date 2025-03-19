
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LogOut, IdCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/store/authStore";

const DashboardHeader = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-heading font-bold tracking-tight text-mkneutral-900">
            Dashboard
          </h1>
          <p className="text-mkneutral-600 mt-2">
            Welcome back, {user?.name}! Manage your membership and stay connected with the party.
          </p>
        </div>
        <div className="flex space-x-3">
          <Link to="/membership-card">
            <Button variant="outline" className="flex items-center">
              <IdCard size={16} className="mr-2" />
              View Membership Card
            </Button>
          </Link>
          <Button 
            variant="ghost" 
            className="text-mkneutral-700 hover:text-red-600 hover:bg-red-50" 
            onClick={handleLogout}
          >
            <LogOut size={16} className="mr-2" />
            Log Out
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default DashboardHeader;
