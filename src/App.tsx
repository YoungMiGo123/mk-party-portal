import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Events from "./pages/Events";
import MembershipCard from "./pages/MembershipCard";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import { useAuth } from "@/store/authStore";
import { useToast } from "./hooks/use-toast";
import ApiClientProvider from "./providers/ApiClientProvider";

const App = () => (
  <ApiClientProvider>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/events" element={<Events />} />
            <Route
              path="/membership-card"
              element={
                <GuardRoute description="You need to be logged in to view your membership card.">
                  <MembershipCard />
                </GuardRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <GuardRoute description="You need to be logged in to view your dashboard.">
                  <Dashboard />
                </GuardRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <GuardRoute description="You need to be an admin to view this page.">
                  <Admin />
                </GuardRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>
      </BrowserRouter>
    </TooltipProvider>
  </ApiClientProvider>
);

export default App;

const Home = () => {
  const { isAuthenticated } = useAuth();
  return <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />;
};

interface GuardRouteProps extends React.PropsWithChildren {
  description?: string;
}

const GuardRoute = (props: GuardRouteProps) => {
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();

  if (!isAuthenticated || !user) {
    toast({
      title: "Access Denied",
      description:
        props.description ?? "You need to be logged in to view page.",
      variant: "destructive",
    });
    return <Navigate to="/login" />;
  }

  return <>{props.children}</>;
};
