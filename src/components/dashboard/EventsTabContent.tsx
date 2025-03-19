
import { CalendarCheck, ChevronRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface EventsTabContentProps {
  mockEvents: any[];
  formatDate: (dateString: string) => string;
}

const EventsTabContent = ({ mockEvents, formatDate }: EventsTabContentProps) => {
  const { toast } = useToast();

  const rsvpForEvent = (eventId: string) => {
    toast({
      title: "RSVP Successful",
      description: "You have successfully RSVP'd for this event.",
    });
  };

  return (
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
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary/90">
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
  );
};

export default EventsTabContent;
