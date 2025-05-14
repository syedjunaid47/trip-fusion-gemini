
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { TravelItinerary } from "@/types";
import { Calendar, DollarSign, Share2, Clock, Map, Plane } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface ItineraryDisplayProps {
  itinerary: TravelItinerary;
  onNewTrip: () => void;
}

const ItineraryDisplay: React.FC<ItineraryDisplayProps> = ({ itinerary, onNewTrip }) => {
  const [activeTab, setActiveTab] = useState("itinerary");

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: itinerary.title,
        text: itinerary.summary,
      }).catch(err => {
        console.error("Error sharing:", err);
        toast.error("Could not share your itinerary.");
      });
    } else {
      toast.info("Sharing is not supported in your browser");
    }
  };

  const hasFlights = itinerary.flights && itinerary.flights.length > 0;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-background p-6 rounded-lg shadow-md">
        <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-primary mb-2">{itinerary.title}</h1>
            <p className="text-muted-foreground">{itinerary.summary}</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleShare} variant="outline" size="sm">
              <Share2 className="mr-2 h-4 w-4" /> Share
            </Button>
            <Button onClick={onNewTrip} variant="secondary" size="sm">
              Plan New Trip
            </Button>
          </div>
        </div>

        <Tabs defaultValue="itinerary" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="itinerary" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" /> Daily Itinerary
            </TabsTrigger>
            <TabsTrigger value="budget" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" /> Budget Breakdown
            </TabsTrigger>
            {hasFlights && (
              <TabsTrigger value="flights" className="flex items-center gap-2">
                <Plane className="h-4 w-4" /> Flight Options
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="itinerary" className="space-y-6">
            {itinerary.days.map((day) => (
              <Card key={day.day}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-xl font-medium">
                      Day {day.day} - {new Date(day.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                    </CardTitle>
                    <Badge variant="outline">{day.activities.length} Activities</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {day.activities.map((activity, i) => (
                      <div key={i} className="flex gap-2 p-3 rounded-md border border-border hover:bg-muted/40 transition-colors">
                        <div className="flex-shrink-0 flex items-start pt-0.5">
                          <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                            {i + 1}
                          </div>
                        </div>
                        <div className="flex-grow">
                          <div className="flex flex-wrap justify-between gap-2">
                            <h4 className="font-medium">{activity.description}</h4>
                            {activity.cost && (
                              <Badge variant="secondary" className="flex items-center">
                                <DollarSign className="h-3 w-3 mr-1" /> {activity.cost}
                              </Badge>
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground mt-1 flex flex-wrap gap-x-3 gap-y-1">
                            {activity.time && (
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" /> {activity.time}
                              </span>
                            )}
                            {activity.location && (
                              <span className="flex items-center gap-1">
                                <Map className="h-3 w-3" /> {activity.location}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="budget">
            <Card>
              <CardHeader>
                <CardTitle>Budget Breakdown</CardTitle>
                <CardDescription>Estimated costs for your trip</CardDescription>
              </CardHeader>
              <CardContent>
                {itinerary.budgetBreakdown ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center py-2 border-b">
                          <span className="text-muted-foreground">Accommodation</span>
                          <span className="font-medium">{itinerary.budgetBreakdown.accommodation}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b">
                          <span className="text-muted-foreground">Transportation</span>
                          <span className="font-medium">{itinerary.budgetBreakdown.transportation}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b">
                          <span className="text-muted-foreground">Activities</span>
                          <span className="font-medium">{itinerary.budgetBreakdown.activities}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center py-2 border-b">
                          <span className="text-muted-foreground">Food</span>
                          <span className="font-medium">{itinerary.budgetBreakdown.food}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b">
                          <span className="text-muted-foreground">Miscellaneous</span>
                          <span className="font-medium">{itinerary.budgetBreakdown.misc}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b bg-muted/30 font-medium">
                          <span>Total Budget</span>
                          <span className="text-primary">{itinerary.budgetBreakdown.total}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p>No budget breakdown available.</p>
                )}
              </CardContent>
            </Card>

            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2">Travel Tips</h3>
              <ul className="space-y-2">
                {itinerary.tips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="flex-shrink-0 h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center text-xs text-primary">
                      {i + 1}
                    </span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </TabsContent>

          {hasFlights && (
            <TabsContent value="flights">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plane className="h-5 w-5" /> 
                    Flight Options
                  </CardTitle>
                  <CardDescription>
                    Recommended flights for your trip
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {itinerary.flights.map((flightGroup, groupIndex) => (
                      <div key={groupIndex} className="border rounded-lg overflow-hidden">
                        {flightGroup.price && (
                          <div className="bg-muted p-3 border-b">
                            <div className="flex justify-between items-center">
                              <span className="font-medium">Flight Option {groupIndex + 1}</span>
                              <Badge variant="secondary">
                                <DollarSign className="h-3 w-3 mr-1" />
                                {flightGroup.price}
                              </Badge>
                            </div>
                          </div>
                        )}
                        
                        <div className="divide-y">
                          {flightGroup.flights.map((flight, flightIndex) => (
                            <div key={flightIndex} className="p-4">
                              <div className="flex flex-wrap items-center gap-2 mb-3">
                                <div className="flex items-center">
                                  <div className="h-8 w-8 mr-2">
                                    {flight.airline_logo && (
                                      <img 
                                        src={flight.airline_logo} 
                                        alt={`${flight.airline} logo`}
                                        className="h-full w-auto object-contain"
                                      />
                                    )}
                                  </div>
                                  <div>
                                    <div className="font-medium">{flight.airline}</div>
                                    <div className="text-xs text-muted-foreground">Flight #{flight.flight_number}</div>
                                  </div>
                                </div>
                                <Badge variant="outline" className="ml-auto">
                                  {flight.travel_class}
                                </Badge>
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                                <div>
                                  <div className="text-xs text-muted-foreground">Departure</div>
                                  <div className="font-medium">
                                    {flight.departure_airport.time}
                                  </div>
                                  <div>
                                    {flight.departure_airport.name} ({flight.departure_airport.id})
                                  </div>
                                </div>
                                
                                <div className="flex items-center justify-center">
                                  <div className="text-center">
                                    <div className="text-xs text-muted-foreground">Duration</div>
                                    <div>{flight.duration} min</div>
                                    <div className="text-xs">
                                      {flight.overnight && "Overnight"}
                                      {flight.often_delayed_by_over_30_min && "Often Delayed"}
                                    </div>
                                  </div>
                                </div>
                                
                                <div>
                                  <div className="text-xs text-muted-foreground">Arrival</div>
                                  <div className="font-medium">
                                    {flight.arrival_airport.time}
                                  </div>
                                  <div>
                                    {flight.arrival_airport.name} ({flight.arrival_airport.id})
                                  </div>
                                </div>
                              </div>
                              
                              <div className="mt-3 text-sm">
                                <div className="grid grid-cols-2 gap-2">
                                  <div>
                                    <span className="text-muted-foreground">Aircraft:</span> {flight.airplane}
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">Legroom:</span> {flight.legroom}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default ItineraryDisplay;
