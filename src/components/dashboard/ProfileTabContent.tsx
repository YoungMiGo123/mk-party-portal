
import { User } from "@/store/authStore";
import MembershipCardSection from "./MembershipCardSection";
import MembershipStatusCard from "./MembershipStatusCard";
import VotingInfoCard from "./VotingInfoCard";
import PersonalInfoCard from "./PersonalInfoCard";

interface ProfileTabContentProps {
  user: User;
  isExpired: boolean;
  membershipExpiryDate: Date;
  formatDate: (dateString: string) => string;
}

const ProfileTabContent = ({ 
  user, 
  isExpired, 
  membershipExpiryDate, 
  formatDate 
}: ProfileTabContentProps) => {
  return (
    <div className="space-y-6">
      <MembershipCardSection 
        user={user} 
        isExpired={isExpired} 
        membershipExpiryDate={membershipExpiryDate} 
      />

      <MembershipStatusCard 
        isExpired={isExpired}
        formatDate={formatDate}
        joinDate={user.joinDate}
        membershipExpiryDate={membershipExpiryDate}
      />

      <VotingInfoCard user={user} />

      <PersonalInfoCard 
        user={user} 
        formatDate={formatDate}
      />
    </div>
  );
};

export default ProfileTabContent;
