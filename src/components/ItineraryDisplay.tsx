
import React from "react";
import { TravelItinerary } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Calendar, Clock, MapPin, DollarSign } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ItineraryDisplayProps {
  itinerary: TravelItinerary;
  onNewTrip: () => void;
}

const ItineraryDisplay: React.FC<ItineraryDisplayProps> = ({ itinerary, onNewTrip }) => {
  const handleShareItinerary = () => {
    try {
      // Create a text version of the itinerary to share
      let shareText = `${itinerary.title}\n\n${itinerary.summary}\n\n`;
      
      // Add day-by-day breakdown
      itinerary.days.forEach(day => {
        shareText += `Day ${day.day} - ${day.date}\n`;
        day.activities.forEach(activity => {
          shareText += `${activity.time}: ${activity.description} at ${activity.location} ${activity.cost ? `(${activity.cost})` : ''}\n`;
        });
        shareText += '\n';
      });
      
      // Add tips
      shareText += 'Travel Tips:\n';
      itinerary.tips.forEach(tip => {
        shareText += `- ${tip}\n`;
      });
      
      navigator.clipboard.writeText(shareText);
      toast.success("Itinerary copied to clipboard!");
    } catch (error) {
      console.error("Failed to copy itinerary:", error);
      toast.error("Failed to copy itinerary");
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="mb-8 border-t-4 border-t-primary shadow-lg">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-3xl font-bold text-primary">{itinerary.title}</CardTitle>
              <CardDescription className="text-lg mt-2">{itinerary.summary}</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleShareItinerary} variant="outline">
                Share
              </Button>
              <Button onClick={onNewTrip} variant="outline">
                New Trip
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Budget breakdown if available */}
      {itinerary.budgetBreakdown && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary" /> Budget Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm font-medium">Accommodation</p>
                <p className="text-lg font-bold">{itinerary.budgetBreakdown.accommodation}</p>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm font-medium">Transportation</p>
                <p className="text-lg font-bold">{itinerary.budgetBreakdown.transportation}</p>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm font-medium">Activities</p>
                <p className="text-lg font-bold">{itinerary.budgetBreakdown.activities}</p>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm font-medium">Food</p>
                <p className="text-lg font-bold">{itinerary.budgetBreakdown.food}</p>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm font-medium">Miscellaneous</p>
                <p className="text-lg font-bold">{itinerary.budgetBreakdown.misc}</p>
              </div>
              <div className="p-3 bg-primary rounded-lg text-white">
                <p className="text-sm font-medium">Total</p>
                <p className="text-lg font-bold">{itinerary.budgetBreakdown.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Daily itinerary */}
      <div className="space-y-6">
        {itinerary.days.map((day, index) => (
          <Card key={index}>
            <CardHeader className="bg-muted/50 border-b">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Day {day.day} - {new Date(day.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-6">
                {day.activities.map((activity, actIndex) => (
                  <div key={actIndex} className="relative border-l-2 border-primary/30 pl-5 pb-5">
                    <div className="absolute w-3 h-3 bg-primary rounded-full -left-[7px] top-1"></div>
                    <div className="flex flex-col md:flex-row md:items-start gap-2 md:gap-4">
                      <Badge variant="outline" className="flex items-center gap-1 md:w-24 justify-center whitespace-nowrap">
                        <Clock className="h-3 w-3" /> {activity.time}
                      </Badge>
                      <div className="flex-1">
                        <h4 className="font-medium text-lg">{activity.description}</h4>
                        {activity.location && (
                          <p className="text-muted-foreground flex items-center gap-1 mt-1">
                            <MapPin className="h-3 w-3" /> {activity.location}
                          </p>
                        )}
                      </div>
                      {activity.cost && (
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3" /> {activity.cost}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Travel tips */}
      <Card className="mt-8 border-t-4 border-t-secondary">
        <CardHeader>
          <CardTitle>Travel Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {itinerary.tips.map((tip, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="inline-flex items-center justify-center bg-secondary text-white rounded-full w-6 h-6 text-xs flex-shrink-0 mt-0.5">
                  {index + 1}
                </span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default ItineraryDisplay;
