
import { Link, useNavigate } from "react-router-dom";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useEffect } from "react";

const MobileNav = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  const handleDrawerOpenChange = (open: boolean) => {
    setIsMenuOpen(open);
    
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  };

  useEffect(() => {
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const closeMenu = () => {
    setIsMenuOpen(false);
    document.body.style.overflow = "";
  };

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
    closeMenu();
  };

  return (
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
          <DrawerTitle className="sr-only">Navigation Menu</DrawerTitle>
          
          <div className="flex justify-between items-center px-4 mb-4">
            <h2 className="text-lg font-medium">Menu</h2>
            <DrawerClose asChild>
              <Button variant="ghost" size="icon" onClick={closeMenu}>
                <X size={24} className="animate-scale" />
                <span className="sr-only">Close</span>
              </Button>
            </DrawerClose>
          </div>
          
          <ScrollArea className="h-[calc(85vh-60px)] pb-6">
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
                      onClick={handleLogout}
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
          </ScrollArea>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default MobileNav;
