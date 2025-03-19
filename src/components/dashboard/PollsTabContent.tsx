
import { useState } from "react";
import { Check, ChevronRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";

interface PollsTabContentProps {
  mockPolls: any[];
  formatDate: (dateString: string) => string;
}

const PollsTabContent = ({ mockPolls, formatDate }: PollsTabContentProps) => {
  const { toast } = useToast();
  const [selectedPollOptions, setSelectedPollOptions] = useState<Record<string, string>>({});

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

  return (
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
                      {poll.options.map((option: string) => (
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
  );
};

export default PollsTabContent;
