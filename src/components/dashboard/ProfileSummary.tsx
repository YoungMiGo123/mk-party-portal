import { motion } from "framer-motion";
import { CheckCircle, XCircle, Mail } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@/store/authStore";
import { useToast } from "@/components/ui/use-toast";
import DashboardMenu from "./DashboardMenu";

interface ProfileSummaryProps {
  user: User;
  isExpired: boolean;
  membershipExpiryDate: Date;
  formatDate: (dateString: string) => string;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const ProfileSummary = ({
  user,
  isExpired,
  membershipExpiryDate,
  formatDate,
  activeTab,
  setActiveTab,
}: ProfileSummaryProps) => {
  const { toast } = useToast();

  const connectWhatsApp = () => {
    toast({
      title: "WhatsApp Redirect",
      description: "Connecting to WhatsApp...",
    });
    window.open("https://wa.me/27123456789", "_blank");
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="mb-6 shadow-glass-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Profile Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-4">
            <Avatar className="h-16 w-16 border border-mkneutral-200">
              {user.photoUrl ? (
                <AvatarImage src={user.photoUrl} alt={user.name} />
              ) : (
                <AvatarFallback className="bg-primary/10 text-primary text-lg">
                  {user.name.charAt(0)}
                  {user.surname.charAt(0)}
                </AvatarFallback>
              )}
            </Avatar>
            <div>
              <div className="font-medium">
                {user.name} {user.surname}
              </div>
              <div className="text-sm text-mkneutral-500">
                {user.membershipType} Member
              </div>
              <div className="flex items-center text-sm mt-1">
                {isExpired ? (
                  <div className="flex items-center text-red-500">
                    <XCircle size={14} className="mr-1" />
                    <span>
                      Expired on{" "}
                      {formatDate(membershipExpiryDate.toISOString())}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center text-green-600">
                    <CheckCircle size={14} className="mr-1" />
                    <span>
                      Active until{" "}
                      {formatDate(membershipExpiryDate.toISOString())}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-mkneutral-500">Membership:</span>
              <span className="font-medium">{user.membershipType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-mkneutral-500">Ward:</span>
              <span>{user.ward || "Ward 42"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-mkneutral-500">Province:</span>
              <span>{user.province || "Gauteng"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-mkneutral-500">Voting Station:</span>
              <span>{user.votingStation || "Local Community Hall"}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="pt-0">
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={connectWhatsApp}
          >
            <Mail size={14} className="mr-2" />
            Connect on WhatsApp
          </Button>
        </CardFooter>
      </Card>

      <DashboardMenu activeTab={activeTab} setActiveTab={setActiveTab} />
    </motion.div>
  );
};

export default ProfileSummary;
