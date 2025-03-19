
import { CheckCircle, XCircle, Clock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface MembershipStatusCardProps {
  isExpired: boolean;
  formatDate: (dateString: string) => string;
  joinDate: string;
  membershipExpiryDate: Date;
}

const MembershipStatusCard = ({ 
  isExpired, 
  formatDate, 
  joinDate, 
  membershipExpiryDate 
}: MembershipStatusCardProps) => {
  return (
    <Card className={`shadow-glass-sm border-l-4 ${isExpired ? 'border-red-500' : 'border-primary'}`}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center">
          {isExpired ? (
            <>
              <XCircle size={20} className="mr-2 text-red-500" />
              <span className="text-red-500">Expired Membership</span>
            </>
          ) : (
            <>
              <CheckCircle size={20} className="mr-2 text-primary" />
              <span className="text-primary">Active Membership</span>
            </>
          )}
        </CardTitle>
        <CardDescription>
          {isExpired 
            ? "Your membership has expired and needs to be renewed" 
            : "Your membership is active and in good standing"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-mkneutral-50 p-3 rounded-lg">
            <div className="text-xs text-mkneutral-500 mb-1">Member Since</div>
            <div className="font-medium flex items-center">
              <Clock size={14} className="mr-1 text-mkneutral-400" />
              {formatDate(joinDate)}
            </div>
          </div>
          <div className="bg-mkneutral-50 p-3 rounded-lg">
            <div className="text-xs text-mkneutral-500 mb-1">Status</div>
            <div className="font-medium flex items-center">
              {isExpired ? (
                <>
                  <XCircle size={14} className="mr-1 text-red-500" />
                  <span className="text-red-500">Expired</span>
                </>
              ) : (
                <>
                  <CheckCircle size={14} className="mr-1 text-primary" />
                  <span className="text-primary">Active</span>
                </>
              )}
            </div>
          </div>
          <div className="bg-mkneutral-50 p-3 rounded-lg">
            <div className="text-xs text-mkneutral-500 mb-1">
              {isExpired ? "Expired On" : "Expires On"}
            </div>
            <div className="font-medium flex items-center">
              <Clock size={14} className="mr-1 text-mkneutral-400" />
              {formatDate(membershipExpiryDate.toISOString())}
            </div>
          </div>
        </div>
        {isExpired && (
          <div className="mt-4">
            <Button variant="default" className="w-full sm:w-auto">
              Renew Membership
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MembershipStatusCard;
