
import { CreditCard, ExternalLink, Share2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { User } from "@/store/authStore";
import VirtualMembershipCard from "@/components/membership/VirtualMembershipCard";

interface MembershipCardSectionProps {
  user: User;
  isExpired: boolean;
  membershipExpiryDate: Date;
}

const MembershipCardSection = ({ 
  user, 
  isExpired, 
  membershipExpiryDate 
}: MembershipCardSectionProps) => {
  const { toast } = useToast();

  const shareCard = () => {
    if (navigator.share) {
      navigator.share({
        title: "MK Party Membership Card",
        text: "Check out my MK Party membership card!",
        url: window.location.origin + "/membership-card",
      })
      .then(() => {
        toast({
          title: "Shared Successfully",
          description: "Your membership card has been shared.",
        });
      })
      .catch((error) => {
        console.error("Error sharing:", error);
      });
    } else {
      navigator.clipboard.writeText(window.location.origin + "/membership-card")
        .then(() => {
          toast({
            title: "Link Copied",
            description: "Your membership card link has been copied to clipboard.",
          });
        })
        .catch((error) => {
          console.error("Error copying:", error);
        });
    }
  };

  return (
    <Card className="shadow-glass-sm overflow-hidden">
      <CardHeader className="pb-2 flex flex-row justify-between items-center">
        <div>
          <CardTitle className="flex items-center text-lg">
            <CreditCard size={18} className="mr-2 text-primary" />
            Your Membership Card
          </CardTitle>
          <CardDescription>
            {isExpired 
              ? "Your membership has expired. Please renew to continue benefits."
              : "Your digital membership card for MK Party"}
          </CardDescription>
        </div>
        <Link to="/membership-card">
          <Button variant="ghost" size="sm">
            <ExternalLink size={14} className="mr-1" />
            View Full Card
          </Button>
        </Link>
      </CardHeader>
      
      <CardContent className="p-6 flex flex-col items-center">
        <VirtualMembershipCard 
          user={user} 
          isExpired={isExpired} 
          expiryDate={membershipExpiryDate.toISOString()}
          previewMode={true}
        />
        
        <div className="flex gap-2 mt-4 w-full max-w-md">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1" 
            onClick={shareCard}
          >
            <Share2 size={14} className="mr-1" />
            Share Card
          </Button>
          <Link to="/membership-card" className="flex-1">
            <Button 
              variant="default" 
              size="sm" 
              className="w-full"
            >
              <CreditCard size={14} className="mr-1" />
              View Full Card
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default MembershipCardSection;
