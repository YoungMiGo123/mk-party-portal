
import { useState, useRef } from "react";
import { Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Download, Share2, ArrowLeft, CheckCircle, XCircle, Clock } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/store/authStore";
import { useToast } from "@/components/ui/use-toast";
import html2canvas from "html2canvas";
import VirtualMembershipCard from "@/components/membership/VirtualMembershipCard";

const MembershipCard = () => {
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const cardRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  // Redirect if not authenticated
  if (!isAuthenticated || !user) {
    toast({
      title: "Access Denied",
      description: "You need to be logged in to view your membership card.",
      variant: "destructive",
    });
    return <Navigate to="/login" />;
  }

  // Calculate if membership is expired
  const membershipStartDate = new Date(user.joinDate);
  const membershipExpiryDate = new Date(membershipStartDate);
  membershipExpiryDate.setFullYear(membershipExpiryDate.getFullYear() + 1); // Membership valid for 1 year
  const isExpired = new Date() > membershipExpiryDate;

  // Format date
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "";
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Download card as image
  const downloadCard = async () => {
    if (cardRef.current) {
      setIsDownloading(true);
      try {
        const canvas = await html2canvas(cardRef.current, {
          scale: 2,
          backgroundColor: null,
        });
        
        const image = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = image;
        link.download = `MK_Membership_${user.surname}_${user.name}.png`;
        link.click();
        
        toast({
          title: "Download Complete",
          description: "Your membership card has been downloaded.",
        });
      } catch (error) {
        console.error("Error downloading card:", error);
        toast({
          title: "Download Failed",
          description: "There was an error downloading your card. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsDownloading(false);
      }
    }
  };

  // Share card
  const shareCard = () => {
    if (navigator.share) {
      navigator.share({
        title: "MK Party Membership Card",
        text: "Check out my MK Party membership card!",
        url: window.location.href,
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
      navigator.clipboard.writeText(window.location.href)
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
    <div className="flex flex-col min-h-screen bg-mkneutral-50">
      <Header />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <Link to="/dashboard" className="inline-flex items-center text-mkneutral-600 hover:text-primary mb-6">
              <ArrowLeft size={16} className="mr-1" />
              Back to Dashboard
            </Link>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-8"
            >
              <h1 className="text-3xl md:text-4xl font-heading font-bold tracking-tight text-mkneutral-900 mb-4">
                Your Membership Card
              </h1>
              <p className="text-mkneutral-600 max-w-2xl mx-auto">
                Your digital membership card for the MK Party. Download it to your device or share it with others.
              </p>
            </motion.div>
            
            {/* Membership Status Banner */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className={`mb-6 p-3 rounded-lg text-center ${
                isExpired 
                  ? "bg-red-100 text-red-800 border border-red-200" 
                  : "bg-green-100 text-green-800 border border-green-200"
              }`}
            >
              <div className="flex items-center justify-center">
                {isExpired ? (
                  <>
                    <XCircle size={18} className="mr-2" />
                    <span className="font-medium">Your membership expired on {formatDate(membershipExpiryDate.toISOString())}</span>
                  </>
                ) : (
                  <>
                    <CheckCircle size={18} className="mr-2" />
                    <span className="font-medium">Your membership is active until {formatDate(membershipExpiryDate.toISOString())}</span>
                  </>
                )}
              </div>
            </motion.div>
            
            {/* Membership Card */}
            <div className="flex flex-col items-center justify-center my-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-md"
                ref={cardRef}
              >
                <VirtualMembershipCard 
                  user={user} 
                  isExpired={isExpired} 
                  expiryDate={membershipExpiryDate.toISOString()}
                />
              </motion.div>
              
              {/* Card Actions */}
              <div className="flex flex-col sm:flex-row mt-8 space-y-4 sm:space-y-0 sm:space-x-4 w-full max-w-md">
                <Button
                  onClick={downloadCard}
                  className="flex-1 flex items-center justify-center"
                  disabled={isDownloading}
                >
                  {isDownloading ? (
                    <span className="animate-pulse">Processing...</span>
                  ) : (
                    <>
                      <Download size={16} className="mr-2" />
                      Download Card
                    </>
                  )}
                </Button>
                <Button
                  onClick={shareCard}
                  variant="outline"
                  className="flex-1 flex items-center justify-center"
                >
                  <Share2 size={16} className="mr-2" />
                  Share Card
                </Button>
              </div>
            </div>
            
            <div className="mt-12 p-6 bg-white rounded-lg shadow-glass border border-mkneutral-200">
              <h2 className="text-xl font-heading font-medium mb-4">Membership Card Information</h2>
              <div className="space-y-4 text-mkneutral-700">
                <p>
                  Your digital membership card serves as proof of your membership in the MK Party. 
                  You can present this card at party events and meetings.
                </p>
                <p>
                  The QR code on your card can be scanned to verify your membership status.
                  For security reasons, only a partial ID number is displayed on the card.
                </p>
                <p>
                  {isExpired ? (
                    <>
                      Your membership has <strong className="text-red-600">expired</strong>. Please renew your 
                      membership to continue enjoying member benefits. 
                    </>
                  ) : (
                    <>
                      Your membership is <strong className="text-green-600">active</strong> and will expire 
                      on {formatDate(membershipExpiryDate.toISOString())}. 
                    </>
                  )}
                  If you need to update your information or have any questions about your 
                  membership, please contact our membership support team at <a href="mailto:membership@mkparty.org" className="text-primary hover:underline">membership@mkparty.org</a>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default MembershipCard;
