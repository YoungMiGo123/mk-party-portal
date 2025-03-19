import { useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  User, MessageSquare, CalendarCheck, BarChart3, 
  LogOut, ChevronRight, ExternalLink, Check, Mail,
  MapPin, CreditCard, CheckCircle, XCircle, Clock,
  Download, Share2, Edit, AlertCircle, IdCard
} from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/store/authStore";
import { mockEvents, mockPolls } from "@/lib/mockData";
import VirtualMembershipCard from "@/components/membership/VirtualMembershipCard";

const Dashboard = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("profile");
  const [selectedPollOptions, setSelectedPollOptions] = useState<Record<string, string>>({});

  if (!isAuthenticated || !user) {
    toast({
      title: "Access Denied",
      description: "You need to be logged in to access your dashboard.",
      variant: "destructive",
    });
    return <Navigate to="/login" />;
  }

  const membershipStartDate = new Date(user.joinDate);
  const membershipExpiryDate = new Date(membershipStartDate);
  membershipExpiryDate.setFullYear(membershipExpiryDate.getFullYear() + 1); // Membership valid for 1 year
  const isExpired = new Date() > membershipExpiryDate;
  
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

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

  const submitPollAnswer = (pollId: string) => {
    if (selectedPollOptions[pollId]) {
      toast({
        title: "Response Submitted",
        description: "Thank you for participating in this poll!",
      });
    } else {
      toast({
        title: "No Option Selected",
        description: "Please select an option before submitting.",
        variant: "destructive",
      });
    }
  };

  const rsvpForEvent = (eventId: string) => {
    toast({
      title: "RSVP Successful",
      description: "You have successfully RSVP'd for this event.",
    });
  };

  const connectWhatsApp = () => {
    toast({
      title: "WhatsApp Redirect",
      description: "Connecting to WhatsApp...",
    });
    window.open("https://wa.me/27123456789", "_blank");
  };

  const [chatMessages, setChatMessages] = useState([
    { sender: "bot", text: "Hello! I'm Thando, your MK Party assistant. How can I help you today?" }
  ]);
  const [newMessage, setNewMessage] = useState("");

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newMessage.trim()) {
      setChatMessages(prev => [...prev, { sender: "user", text: newMessage }]);
      
      setTimeout(() => {
        let botResponse;
        
        if (newMessage.toLowerCase().includes("event")) {
          botResponse = "We have several upcoming events! Check the Events tab for details or I can help you RSVP.";
        } else if (newMessage.toLowerCase().includes("membership")) {
          botResponse = "Your membership is active and in good standing. Your membership number is " + user.membershipNumber;
        } else if (newMessage.toLowerCase().includes("vote") || newMessage.toLowerCase().includes("voting")) {
          botResponse = "The next election is approaching. Make sure your voter registration is up to date through the IEC website.";
        } else {
          botResponse = "Thank you for your message. Is there anything specific about the MK Party that you'd like to know?";
        }
        
        setChatMessages(prev => [...prev, { sender: "bot", text: botResponse }]);
      }, 1000);
      
      setNewMessage("");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-mkneutral-50">
      <Header />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-heading font-bold tracking-tight text-mkneutral-900">
                    Member Dashboard
                  </h1>
                  <p className="text-mkneutral-600 mt-2">
                    Welcome back, {user.name}! Manage your membership and stay connected with the party.
                  </p>
                </div>
                <div className="flex space-x-3">
                  <Link to="/membership-card">
                    <Button variant="outline" className="flex items-center">
                      <IdCard size={16} className="mr-2" />
                      View Membership Card
                    </Button>
                  </Link>
                  <Button 
                    variant="ghost" 
                    className="text-mkneutral-700 hover:text-red-600 hover:bg-red-50" 
                    onClick={() => {
                      logout();
                      toast({
                        title: "Logged Out",
                        description: "You have been successfully logged out.",
                      });
                    }}
                  >
                    <LogOut size={16} className="mr-2" />
                    Log Out
                  </Button>
                </div>
              </div>
            </motion.div>
            
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-1">
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
                              {user.name.charAt(0)}{user.surname.charAt(0)}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div>
                          <div className="font-medium">{user.name} {user.surname}</div>
                          <div className="text-sm text-mkneutral-500">{user.membershipType} Member</div>
                          <div className="flex items-center text-sm mt-1">
                            {isExpired ? (
                              <div className="flex items-center text-red-500">
                                <XCircle size={14} className="mr-1" />
                                <span>Expired on {formatDate(membershipExpiryDate.toISOString())}</span>
                              </div>
                            ) : (
                              <div className="flex items-center text-green-600">
                                <CheckCircle size={14} className="mr-1" />
                                <span>Active until {formatDate(membershipExpiryDate.toISOString())}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-mkneutral-500">Membership No:</span>
                          <span className="font-medium">{user.membershipNumber}</span>
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
                      <Button variant="outline" size="sm" className="w-full" onClick={connectWhatsApp}>
                        <Mail size={14} className="mr-2" />
                        Connect on WhatsApp
                      </Button>
                    </CardFooter>
                  </Card>
                  
                  <div className="lg:hidden mb-6">
                    <TabsList className="w-full grid grid-cols-3">
                      <TabsTrigger 
                        value="profile"
                        onClick={() => setActiveTab("profile")}
                        className={activeTab === "profile" ? "data-[state=active]:bg-primary data-[state=active]:text-white" : ""}
                      >
                        <User size={16} className="mr-2" />
                        Profile
                      </TabsTrigger>
                      <TabsTrigger 
                        value="events" 
                        onClick={() => setActiveTab("events")}
                        className={activeTab === "events" ? "data-[state=active]:bg-primary data-[state=active]:text-white" : ""}
                      >
                        <CalendarCheck size={16} className="mr-2" />
                        Events
                      </TabsTrigger>
                      <TabsTrigger 
                        value="polls"
                        onClick={() => setActiveTab("polls")}
                        className={activeTab === "polls" ? "data-[state=active]:bg-primary data-[state=active]:text-white" : ""}
                      >
                        <BarChart3 size={16} className="mr-2" />
                        Polls
                      </TabsTrigger>
                    </TabsList>
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
                            <span>Profile & Chat</span>
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
                </motion.div>
              </div>
              
              <div className="lg:col-span-3">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  {activeTab === "profile" && (
                    <div className="space-y-6">
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

                      <Card className={`shadow-glass-sm border-l-4 ${isExpired ? 'border-red-500' : 'border-green-500'}`}>
                        <CardHeader className="pb-2">
                          <CardTitle className="flex items-center">
                            {isExpired ? (
                              <>
                                <XCircle size={20} className="mr-2 text-red-500" />
                                <span className="text-red-500">Expired Membership</span>
                              </>
                            ) : (
                              <>
                                <CheckCircle size={20} className="mr-2 text-green-600" />
                                <span className="text-green-600">Active Membership</span>
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
                                {formatDate(user.joinDate)}
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
                                    <CheckCircle size={14} className="mr-1 text-green-600" />
                                    <span className="text-green-600">Active</span>
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

                      <Card className="bg-blue-50 border-blue-200 shadow-sm">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-blue-800 text-lg flex items-center">
                            <MapPin size={18} className="mr-2 text-blue-700" />
                            Voting Registration Information
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="text-blue-700">
                          <p className="mb-4">
                            Your voter registration appears to be valid. Below are your voting details:
                          </p>
                          <div className="bg-white/60 rounded-lg p-4 space-y-2 text-blue-900">
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
                            className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                          >
                            Visit IEC Website <ExternalLink size={14} className="ml-1" />
                          </a>
                        </CardFooter>
                      </Card>

                      <Card className="shadow-glass-sm">
                        <CardHeader className="flex flex-row justify-between items-start">
                          <div>
                            <CardTitle>Personal Information</CardTitle>
                            <CardDescription>
                              Your personal details and membership information
                            </CardDescription>
                          </div>
                          <Button variant="outline" size="sm">
                            <Edit size={14} className="mr-1" />
                            Edit
                          </Button>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                              <div>
                                <label className="text-sm text-mkneutral-500 block mb-1">Full Name</label>
                                <div className="font-medium">{user.name} {user.surname}</div>
                              </div>
                              <div>
                                <label className="text-sm text-mkneutral-500 block mb-1">ID Number</label>
                                <div className="font-medium">{user.idNumber.substring(0, 6)}******</div>
                              </div>
                              <div>
                                <label className="text-sm text-mkneutral-500 block mb-1">Date of Birth</label>
                                <div>{formatDate(user.dateOfBirth)}</div>
                              </div>
                              <div>
                                <label className="text-sm text-mkneutral-500 block mb-1">Gender</label>
                                <div>{user.gender}</div>
                              </div>
                              <div>
                                <label className="text-sm text-mkneutral-500 block mb-1">Race</label>
                                <div>{user.race}</div>
                              </div>
                              <div>
                                <label className="text-sm text-mkneutral-500 block mb-1">Language</label>
                                <div>{user.language}</div>
                              </div>
                            </div>
                            <div className="space-y-4">
                              <div>
                                <label className="text-sm text-mkneutral-500 block mb-1">Email Address</label>
                                <div>{user.email}</div>
                              </div>
                              <div>
                                <label className="text-sm text-mkneutral-500 block mb-1">Cellphone</label>
                                <div>{user.cellphone}</div>
                              </div>
                              <div>
                                <label className="text-sm text-mkneutral-500 block mb-1">Physical Address</label>
                                <div>{user.address}</div>
                              </div>
                              <div>
                                <label className="text-sm text-mkneutral-500 block mb-1">Occupation</label>
                                <div>{user.occupation || "-"}</div>
                              </div>
                              <div>
                                <label className="text-sm text-mkneutral-500 block mb-1">Employment Status</label>
                                <div>{user.employmentStatus}</div>
                              </div>
                              <div>
                                <label className="text-sm text-mkneutral-500 block mb-1">Disability</label>
                                <div>{user.disability || "None"}</div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className="shadow-glass-sm overflow-hidden">
                        <CardHeader className="bg-primary/5">
                          <div className="flex items-center">
                            <Avatar className="h-8 w-8 mr-3 border border-primary/20">
                              <AvatarFallback className="bg-primary text-white">T</AvatarFallback>
                            </Avatar>
                            <div>
                              <CardTitle className="text-lg">Chat with Thando</CardTitle>
                              <CardDescription>Your MK Party assistant</CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="p-0">
                          <div className="h-80 flex flex-col">
                            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                              {chatMessages.map((message, index) => (
                                <div 
                                  key={index} 
                                  className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                                >
                                  <div 
                                    className={`max-w-[80%] p-3 rounded-lg ${
                                      message.sender === "user" 
                                        ? "bg-primary text-white" 
                                        : "bg-mkneutral-100 text-mkneutral-800"
                                    }`}
                                  >
                                    {message.text}
                                  </div>
                                </div>
                              ))}
                            </div>
                            <form onSubmit={sendMessage} className="border-t p-4 flex gap-2">
                              <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Type your message..."
                                className="flex-1 form-input"
                              />
                              <Button type="submit">Send</Button>
                            </form>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                  
                  {activeTab === "events" && (
                    <div className="space-y-6">
                      <Card className="shadow-glass-sm">
                        <CardHeader>
                          <CardTitle>Upcoming Events</CardTitle>
                          <CardDescription>
                            Events and activities you can participate in
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                          <div className="divide-y">
                            {mockEvents.map((event) => (
                              <div key={event.id} className="p-6 flex flex-col md:flex-row gap-4 md:gap-6">
                                <div className="md:w-1/4">
                                  <div className="bg-mkneutral-100 rounded-lg p-3 text-center">
                                    <div className="text-mkneutral-500 text-sm">{new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}</div>
                                    <div className="text-2xl font-medium">{new Date(event.date).getDate()}</div>
                                    <div className="text-mkneutral-500 text-sm">{event.time}</div>
                                  </div>
                                </div>
                                <div className="flex-1">
                                  <h3 className="text-lg font-medium mb-2">{event.title}</h3>
                                  <div className="flex items-center text-mkneutral-500 text-sm mb-2">
                                    <CalendarCheck size={16} className="mr-2" />
                                    <span>{formatDate(event.date)} at {event.time}</span>
                                  </div>
                                  <div className="mb-4">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                      {event.location}
                                    </span>
                                  </div>
                                  <p className="text-mkneutral-600 mb-4">{event.description}</p>
                                  <Button onClick={() => rsvpForEvent(event.id)}>RSVP Now</Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                        <CardFooter className="flex justify-center p-4 border-t">
                          <a 
                            href="#" 
                            className="text-primary hover:text-primary/80 font-medium flex items-center"
                          >
                            View All Events <ChevronRight size={16} className="ml-1" />
                          </a>
                        </CardFooter>
                      </Card>
                      
                      <Card className="shadow-glass-sm">
                        <CardHeader>
                          <CardTitle>My RSVPs</CardTitle>
                          <CardDescription>
                            Events you've registered to attend
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="text-center p-6">
                            <div className="rounded-full bg-mkneutral-100 w-12 h-12 flex items-center justify-center mx-auto mb-4">
                              <CalendarCheck size={20} className="text-mkneutral-500" />
                            </div>
                            <h3 className="text-lg font-medium mb-2">No RSVPs Yet</h3>
                            <p className="text-mkneutral-500 max-w-md mx-auto mb-6">
                              You haven't RSVP'd to any upcoming events. Check out the events above
                              and register for those you'd like to attend.
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                  
                  {activeTab === "polls" && (
                    <div className="space-y-6">
                      <Card className="shadow-glass-sm">
                        <CardHeader>
                          <CardTitle>Polls & Surveys</CardTitle>
                          <CardDescription>
                            Share your opinions and help shape party policies
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                          <div className="divide-y">
                            {mockPolls.map((poll) => (
                              <div key={poll.id} className="p-6">
                                <h3 className="text-lg font-medium mb-4">{poll.question}</h3>
                                <div className="mb-6">
                                  <RadioGroup 
                                    value={selectedPollOptions[poll.id] || ""} 
                                    onValueChange={(value) => {
                                      setSelectedPollOptions(prev => ({
                                        ...prev,
                                        [poll.id]: value
                                      }));
                                    }}
                                  >
                                    <div className="space-y-3">
                                      {poll.options.map((option) => (
                                        <div key={option} className="flex items-center space-x-2">
                                          <RadioGroupItem value={option} id={`${poll.id}-${option}`} />
                                          <Label htmlFor={`${poll.id}-${option}`} className="cursor-pointer">
                                            {option}
                                          </Label>
                                        </div>
                                      ))}
                                    </div>
                                  </RadioGroup>
                                </div>
                                <div className="flex items-center justify-between">
                                  <div className="text-sm text-mkneutral-500">
                                    Poll ends: {formatDate(poll.endDate)}
                                  </div>
                                  <Button onClick={() => submitPollAnswer(poll.id)}>
                                    Submit Answer
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                        <CardFooter className="flex justify-center p-4 border-t">
                          <a 
                            href="#" 
                            className="text-primary hover:text-primary/80 font-medium flex items-center"
                          >
                            View All Polls <ChevronRight size={16} className="ml-1" />
                          </a>
                        </CardFooter>
                      </Card>
                      
                      <Card className="shadow-glass-sm">
                        <CardHeader>
                          <CardTitle>Recent Submissions</CardTitle>
                          <CardDescription>
                            Your recent poll and survey submissions
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="text-center p-6">
                            <div className="rounded-full bg-mkneutral-100 w-12 h-12 flex items-center justify-center mx-auto mb-4">
                              <Check size={20} className="text-mkneutral-500" />
                            </div>
                            <h3 className="text-lg font-medium mb-2">No Submissions Yet</h3>
                            <p className="text-mkneutral-500 max-w-md mx-auto mb-6">
                              You haven't submitted any poll or survey responses yet. 
                              Participate in the polls above to share your opinions.
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
