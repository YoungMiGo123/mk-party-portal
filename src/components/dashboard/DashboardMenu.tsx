
import { User, CalendarCheck, BarChart3, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface DashboardMenuProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const DashboardMenu = ({ activeTab, setActiveTab }: DashboardMenuProps) => {
  return (
    <>
      <div className="lg:hidden mb-6">
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="profile">
              <User size={16} className="mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="events">
              <CalendarCheck size={16} className="mr-2" />
              Events
            </TabsTrigger>
            <TabsTrigger value="polls">
              <BarChart3 size={16} className="mr-2" />
              Polls
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <Card className="shadow-glass-sm hidden lg:block">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Dashboard Menu</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="flex flex-col">
            <button
              onClick={() => setActiveTab("profile")}
              className={`flex items-center justify-between px-6 py-3 hover:bg-mkneutral-100 transition-colors ${
                activeTab === "profile" ? "bg-primary/5 text-primary border-l-4 border-primary" : ""
              }`}
            >
              <div className="flex items-center">
                <User size={18} className="mr-3" />
                <span>Profile</span>
              </div>
              <ChevronRight size={16} />
            </button>
            <button
              onClick={() => setActiveTab("events")}
              className={`flex items-center justify-between px-6 py-3 hover:bg-mkneutral-100 transition-colors ${
                activeTab === "events" ? "bg-primary/5 text-primary border-l-4 border-primary" : ""
              }`}
            >
              <div className="flex items-center">
                <CalendarCheck size={18} className="mr-3" />
                <span>Events & RSVPs</span>
              </div>
              <ChevronRight size={16} />
            </button>
            <button
              onClick={() => setActiveTab("polls")}
              className={`flex items-center justify-between px-6 py-3 hover:bg-mkneutral-100 transition-colors ${
                activeTab === "polls" ? "bg-primary/5 text-primary border-l-4 border-primary" : ""
              }`}
            >
              <div className="flex items-center">
                <BarChart3 size={18} className="mr-3" />
                <span>Polls & Surveys</span>
              </div>
              <ChevronRight size={16} />
            </button>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default DashboardMenu;
