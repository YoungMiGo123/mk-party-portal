import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/store/authStore";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { mockEvents, mockPolls } from "@/lib/mockData";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import ProfileSummary from "@/components/dashboard/ProfileSummary";
import ProfileTabContent from "@/components/dashboard/ProfileTabContent";
import EventsTabContent from "@/components/dashboard/EventsTabContent";
import PollsTabContent from "@/components/dashboard/PollsTabContent";

const Dashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");

  if (!user) return null;

  const membershipStartDate = new Date(user.joinDate);
  const membershipExpiryDate = new Date(membershipStartDate);
  membershipExpiryDate.setFullYear(membershipExpiryDate.getFullYear() + 1); // Membership valid for 1 year
  const isExpired = new Date() > membershipExpiryDate;

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  return (
    <DashboardLayout>
      <DashboardHeader />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <ProfileSummary
            user={user}
            isExpired={isExpired}
            membershipExpiryDate={membershipExpiryDate}
            formatDate={formatDate}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </div>

        <div className="lg:col-span-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Tabs
              defaultValue={activeTab}
              value={activeTab}
              onValueChange={setActiveTab}
              className="space-y-6"
            >
              <TabsContent value="profile">
                <ProfileTabContent
                  user={user}
                  isExpired={isExpired}
                  membershipExpiryDate={membershipExpiryDate}
                  formatDate={formatDate}
                />
              </TabsContent>

              <TabsContent value="events">
                <EventsTabContent
                  mockEvents={mockEvents}
                  formatDate={formatDate}
                />
              </TabsContent>

              <TabsContent value="polls">
                <PollsTabContent
                  mockPolls={mockPolls}
                  formatDate={formatDate}
                />
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
