
import { MapPin, ExternalLink } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "@/store/authStore";

interface VotingInfoCardProps {
  user: User;
}

const VotingInfoCard = ({ user }: VotingInfoCardProps) => {
  return (
    <Card className="shadow-glass-sm border-primary/20 border">
      <CardHeader className="pb-2">
        <CardTitle className="text-mkneutral-800 text-lg flex items-center">
          <MapPin size={18} className="mr-2 text-primary" />
          Voting Registration Information
        </CardTitle>
      </CardHeader>
      <CardContent className="text-mkneutral-700">
        <p className="mb-4">
          Your voter registration appears to be valid. Below are your voting details:
        </p>
        <div className="bg-mkneutral-50/60 rounded-lg p-4 space-y-2 text-mkneutral-800">
          <div className="flex justify-between">
            <span className="font-medium">Voting Station:</span>
            <span>{user.votingStation || "Local Community Hall"}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Ward:</span>
            <span>{user.ward || "Ward 42"}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Municipality:</span>
            <span>City of Johannesburg</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Province:</span>
            <span>{user.province || "Gauteng"}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <a 
          href="https://www.elections.org.za/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-primary hover:text-primary/80 text-sm flex items-center"
        >
          Visit IEC Website <ExternalLink size={14} className="ml-1" />
        </a>
      </CardFooter>
    </Card>
  );
};

export default VotingInfoCard;
