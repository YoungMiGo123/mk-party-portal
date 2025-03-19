
import { QrCode, Clock } from "lucide-react";
import { User } from "@/store/authStore";

interface VirtualMembershipCardProps {
  user: User;
  isExpired: boolean;
  expiryDate: string;
  previewMode?: boolean;
}

const VirtualMembershipCard = ({ 
  user, 
  isExpired, 
  expiryDate,
  previewMode = false 
}: VirtualMembershipCardProps) => {
  
  // Format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div 
      className={`${previewMode ? "max-w-md w-full scale-[0.85] my-[-24px]" : "max-w-md w-full"}`}
    >
      {/* Card Container */}
      <div 
        className={`aspect-[1.586/1] rounded-2xl overflow-hidden shadow-2xl relative bg-gradient-to-br from-primary to-primary-700`}
      >
        {/* Card Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 right-0 h-32 bg-white/10" />
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-black/10" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.1),transparent_50%)]" />
        </div>
        
        {/* Logo and Card Title */}
        <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center">
          <div className="flex items-center">
            <img src="/logo.png" alt="MK Party" className="h-8 w-auto mr-2" />
            <span className="text-white font-heading font-bold tracking-wide">MK PARTY</span>
          </div>
          <div className="text-white/90 text-xs font-medium">
            OFFICIAL MEMBER
          </div>
        </div>
        
        {/* Member Photo and Info */}
        <div className="absolute top-20 left-0 right-0 px-6 flex">
          <div className="w-24 h-24 rounded-lg bg-white/10 overflow-hidden backdrop-blur-sm mr-4 border border-white/20">
            {user.photoUrl ? (
              <img 
                src={user.photoUrl} 
                alt={`${user.name} ${user.surname}`} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-primary/30 text-white">
                <span className="font-heading text-2xl">{user.name.charAt(0)}{user.surname.charAt(0)}</span>
              </div>
            )}
          </div>
          <div className="flex-1">
            <h3 className="text-white font-heading text-xl font-medium tracking-wide">
              {user.name} {user.surname}
            </h3>
            <div className="mt-1 text-white/80 text-sm">
              Member since: {formatDate(user.joinDate)}
            </div>
            <div className="mt-1 text-white/80 text-sm flex items-center">
              <Clock size={12} className="mr-1" />
              {isExpired ? "Expired: " : "Expires: "}
              {formatDate(expiryDate)}
            </div>
            <div className={`mt-3 inline-block px-2 py-1 rounded-full text-xs border border-white/20 
              ${isExpired 
                ? 'bg-red-500/70 text-white' 
                : 'bg-gold/70 text-white'
              }`}
            >
              {isExpired ? "EXPIRED" : `${user.membershipType || "STANDARD"} MEMBER`}
            </div>
          </div>
        </div>
        
        {/* Member Details */}
        <div className="absolute bottom-0 left-0 right-0 p-6 pt-10 bg-gradient-to-t from-black/40 to-transparent">
          <div className="grid grid-cols-2 gap-3 text-white/90">
            <div>
              <div className="text-xs text-white/70 mb-1">Membership No:</div>
              <div className="font-mono font-medium">{user.membershipNumber}</div>
            </div>
            <div>
              <div className="text-xs text-white/70 mb-1">ID Number:</div>
              <div className="font-mono font-medium">
                {user.idNumber.substring(0, 6)}******
              </div>
            </div>
            <div>
              <div className="text-xs text-white/70 mb-1">Province:</div>
              <div>{user.province || "Gauteng"}</div>
            </div>
            <div>
              <div className="text-xs text-white/70 mb-1">Ward:</div>
              <div>{user.ward || "Ward 42"}</div>
            </div>
          </div>
        </div>
        
        {/* Status Badge */}
        {isExpired && (
          <div className="absolute top-6 right-6 -rotate-12 bg-red-500 text-white text-xs font-bold py-1 px-3 rounded-full border-2 border-white shadow-lg">
            EXPIRED
          </div>
        )}
        
        {/* QR Code (placeholder) */}
        <div className="absolute bottom-6 right-6 w-16 h-16 bg-white rounded-lg p-2">
          <QrCode className="w-full h-full text-primary" />
        </div>
      </div>
    </div>
  );
};

export default VirtualMembershipCard;
