
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronDown, Calendar, MapPin, Users, ArrowRight } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AnimatedText from "@/components/ui/AnimatedText";
import { Button } from "@/components/ui/button";
import { mockEvents } from "@/lib/mockData";

const Index = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-24 md:pt-32 lg:pt-40 pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-mkgreen-50/60 to-white z-0"></div>
        <div className="container relative z-10 mx-auto px-4 md:px-6 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-block px-3 py-1 mb-6 rounded-full bg-mkgreen-100 text-mkgreen-600 text-sm font-medium">
              Building South Africa Together
            </div>
            <h1 className="text-4xl md:text-6xl font-heading font-bold tracking-tight text-mkneutral-900 mb-6">
              <AnimatedText 
                text="Become a member of the MK Party" 
                speed="normal"
              />
            </h1>
            <p className="text-lg md:text-xl text-mkneutral-600 mb-8 max-w-2xl mx-auto">
              Join us in our mission to create a better South Africa with equal opportunities,
              growth, and prosperity for all our citizens.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <Button 
                onClick={() => navigate('/register')}
                size="lg"
                className="bg-primary text-white rounded-full px-8 py-6 text-lg font-medium hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl"
              >
                Register Now
              </Button>
              <Button 
                onClick={() => navigate('/about')}
                variant="outline"
                size="lg"
                className="rounded-full border-mkneutral-300 px-8 py-6 text-lg font-medium hover:bg-mkneutral-50 transition-all"
              >
                Learn More
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="mt-16 md:mt-20 w-full max-w-5xl relative"
          >
            <div className="aspect-video bg-mkneutral-200 rounded-xl overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80" 
                alt="MK Party rally" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
              <button 
                onClick={() => {
                  const announcementSection = document.getElementById('announcements');
                  announcementSection?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="rounded-full bg-white/90 backdrop-blur-sm p-3 shadow-lg hover:shadow-xl transition-all animate-pulse-light"
                aria-label="Scroll down"
              >
                <ChevronDown size={24} className="text-mkneutral-600" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Announcement Section */}
      <section id="announcements" className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold tracking-tight text-mkneutral-900 mb-4">
              Latest Announcements
            </h2>
            <p className="text-mkneutral-600 max-w-2xl mx-auto">
              Stay updated with the latest news, events, and initiatives from the MK Party
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Event Card 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl overflow-hidden shadow-glass card-hover border border-mkneutral-100"
            >
              <div className="aspect-video bg-mkneutral-100 relative">
                <img 
                  src="https://images.unsplash.com/photo-1475721027785-f74eccf877e2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80" 
                  alt="MK Party Rally" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-white/80 backdrop-blur-sm text-sm font-medium text-primary">
                  Upcoming Event
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-heading font-medium mb-2">National Party Rally</h3>
                <div className="flex items-center text-mkneutral-500 mb-1">
                  <Calendar size={16} className="mr-2" />
                  <span className="text-sm">{formatDate(mockEvents[0].date)} at {mockEvents[0].time}</span>
                </div>
                <div className="flex items-center text-mkneutral-500 mb-4">
                  <MapPin size={16} className="mr-2" />
                  <span className="text-sm">{mockEvents[0].location}</span>
                </div>
                <p className="text-mkneutral-600 mb-6">
                  {mockEvents[0].description}
                </p>
                <Button variant="outline" className="w-full rounded-lg border-mkneutral-200">
                  Learn More
                </Button>
              </div>
            </motion.div>

            {/* News Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl overflow-hidden shadow-glass card-hover border border-mkneutral-100"
            >
              <div className="aspect-video bg-mkneutral-100 relative">
                <img 
                  src="https://images.unsplash.com/photo-1577563908411-5077b6dc7624?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80" 
                  alt="Policy Announcement" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-white/80 backdrop-blur-sm text-sm font-medium text-mkgreen-600">
                  Latest News
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-heading font-medium mb-2">New Economic Policy Framework</h3>
                <div className="flex items-center text-mkneutral-500 mb-4">
                  <Calendar size={16} className="mr-2" />
                  <span className="text-sm">November 28, 2023</span>
                </div>
                <p className="text-mkneutral-600 mb-6">
                  Our party has introduced a comprehensive economic policy framework aimed at addressing unemployment and fostering inclusive growth across all sectors.
                </p>
                <Button variant="outline" className="w-full rounded-lg border-mkneutral-200">
                  Read Full Story
                </Button>
              </div>
            </motion.div>

            {/* Poll Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl overflow-hidden shadow-glass card-hover border border-mkneutral-100"
            >
              <div className="aspect-video bg-mkneutral-100 relative">
                <img 
                  src="https://images.unsplash.com/photo-1494172961521-33799ddd43a5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1171&q=80" 
                  alt="Opinion Poll" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-white/80 backdrop-blur-sm text-sm font-medium text-blue-600">
                  Latest Poll
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-heading font-medium mb-2">What Issues Matter Most?</h3>
                <div className="flex items-center text-mkneutral-500 mb-4">
                  <Users size={16} className="mr-2" />
                  <span className="text-sm">Over 5,000 responses</span>
                </div>
                <p className="text-mkneutral-600 mb-6">
                  Participate in our latest opinion poll to help us understand what issues matter most to you and your community. Your voice counts!
                </p>
                <Button variant="outline" className="w-full rounded-lg border-mkneutral-200">
                  Take the Poll
                </Button>
              </div>
            </motion.div>
          </div>

          <div className="mt-12 text-center">
            <Button 
              variant="ghost" 
              className="text-primary hover:text-primary/80 hover:bg-primary/5"
              onClick={() => navigate('/news')}
            >
              View All Announcements <ArrowRight size={16} className="ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-mkneutral-50 relative">
        <div className="absolute inset-0 bg-[url('/hero-bg.jpg')] bg-cover bg-center opacity-10"></div>
        <div className="container relative z-10 mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl p-8 md:p-12 shadow-glass border border-mkneutral-100 max-w-4xl mx-auto"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-heading font-bold tracking-tight text-mkneutral-900 mb-4">
                Be Part of the Change
              </h2>
              <p className="text-mkneutral-600 max-w-2xl mx-auto">
                Join thousands of South Africans who have already become members of the MK Party. 
                Together, we can build a better future for all.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-mkneutral-50 rounded-xl p-6 text-center">
                <div className="rounded-full bg-mkgreen-100 w-12 h-12 flex items-center justify-center mx-auto mb-4">
                  <Users size={20} className="text-primary" />
                </div>
                <h3 className="text-xl font-medium mb-2">Standard Member</h3>
                <p className="text-mkneutral-500 text-sm mb-4">
                  Basic membership with voting rights and regular updates
                </p>
                <Button variant="outline" className="w-full" onClick={() => navigate('/register')}>
                  Join Now
                </Button>
              </div>
              
              <div className="bg-mkgreen-50 rounded-xl p-6 text-center border-2 border-primary relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 px-3 py-1 rounded-full bg-primary text-white text-xs font-medium">
                  Most Popular
                </div>
                <div className="rounded-full bg-primary/20 w-12 h-12 flex items-center justify-center mx-auto mb-4">
                  <Users size={20} className="text-primary" />
                </div>
                <h3 className="text-xl font-medium mb-2">Premium Member</h3>
                <p className="text-mkneutral-500 text-sm mb-4">
                  Enhanced benefits including exclusive events and resources
                </p>
                <Button className="w-full bg-primary hover:bg-primary/90" onClick={() => navigate('/register')}>
                  Join Now
                </Button>
              </div>
              
              <div className="bg-mkneutral-50 rounded-xl p-6 text-center">
                <div className="rounded-full bg-mkgreen-100 w-12 h-12 flex items-center justify-center mx-auto mb-4">
                  <Users size={20} className="text-primary" />
                </div>
                <h3 className="text-xl font-medium mb-2">Volunteer Member</h3>
                <p className="text-mkneutral-500 text-sm mb-4">
                  Active participation in campaigns and community initiatives
                </p>
                <Button variant="outline" className="w-full" onClick={() => navigate('/register')}>
                  Join Now
                </Button>
              </div>
            </div>
            
            <div className="text-center text-mkneutral-500 text-sm">
              Already a member? <a href="/login" className="text-primary hover:underline">Log in here</a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold tracking-tight text-mkneutral-900 mb-4">
              Member Voices
            </h2>
            <p className="text-mkneutral-600 max-w-2xl mx-auto">
              Hear from our members who are actively involved in building a better South Africa
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl p-6 shadow-glass-sm border border-mkneutral-100"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-mkneutral-200 overflow-hidden mr-4">
                  <img 
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80" 
                    alt="Testimonial Avatar" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-medium">Thabo Mokoena</h4>
                  <p className="text-sm text-mkneutral-500">Member since 2022</p>
                </div>
              </div>
              <p className="text-mkneutral-600 italic">
                "Joining the MK Party has given me the opportunity to contribute meaningfully to my community. The events and initiatives have been empowering."
              </p>
            </motion.div>

            {/* Testimonial 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl p-6 shadow-glass-sm border border-mkneutral-100"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-mkneutral-200 overflow-hidden mr-4">
                  <img 
                    src="https://images.unsplash.com/photo-1531123897727-8f129e1688ce?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80" 
                    alt="Testimonial Avatar" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-medium">Nomsa Tshabalala</h4>
                  <p className="text-sm text-mkneutral-500">Member since 2023</p>
                </div>
              </div>
              <p className="text-mkneutral-600 italic">
                "The MK Party represents the values I believe in for our country. I'm proud to be part of a movement that truly listens to the people."
              </p>
            </motion.div>

            {/* Testimonial 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl p-6 shadow-glass-sm border border-mkneutral-100"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-mkneutral-200 overflow-hidden mr-4">
                  <img 
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80" 
                    alt="Testimonial Avatar" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-medium">Matthew Johnson</h4>
                  <p className="text-sm text-mkneutral-500">Member since 2022</p>
                </div>
              </div>
              <p className="text-mkneutral-600 italic">
                "The digital membership card makes it easy to stay connected with the party. I appreciate how the MK Party embraces technology."
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 md:py-24 bg-primary">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-5xl font-heading font-bold tracking-tight text-white mb-6">
              Join the Movement Today
            </h2>
            <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
              Your voice matters. Your vote counts. Be part of the change you want to see
              in South Africa by becoming a member of the MK Party.
            </p>
            <Button 
              onClick={() => navigate('/register')}
              size="lg"
              className="bg-white text-primary rounded-full px-8 py-6 text-lg font-medium hover:bg-white/90 transition-all"
            >
              Register Now
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
