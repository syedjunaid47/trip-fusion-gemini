
import React, { useState } from "react";
import TravelForm from "@/components/TravelForm";
import ItineraryDisplay from "@/components/ItineraryDisplay";
import { TravelFormData, TravelItinerary } from "@/types";
import { getItinerary } from "@/services/geminiService";
import { toast } from "sonner";
import { MapPin, DollarSign, Clock } from "lucide-react";

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [itinerary, setItinerary] = useState<TravelItinerary | null>(null);

  const handleFormSubmit = async (formData: TravelFormData) => {
    setIsLoading(true);
    try {
      const generatedItinerary = await getItinerary(formData);
      setItinerary(generatedItinerary);
    } catch (error) {
      console.error("Error generating itinerary:", error);
      toast.error("Failed to generate itinerary. Please check your API key and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewTrip = () => {
    setItinerary(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="travel-gradient text-white py-8 px-6 text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">Trip Fusion</h1>
        <p className="text-xl max-w-2xl mx-auto">
          Your AI-powered travel companion. Plan your perfect trip with personalized recommendations.
        </p>
      </div>
      
      <div className="container mx-auto px-4 pb-16">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative">
              <div className="h-32 w-32 rounded-full border-t-4 border-primary animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-16 w-16 rounded-full bg-primary/20 animate-pulse-slow"></div>
              </div>
            </div>
            <p className="mt-6 text-xl font-medium">Planning your perfect trip...</p>
            <p className="text-muted-foreground mt-2">This may take a moment as our AI crafts your personalized itinerary</p>
          </div>
        ) : itinerary ? (
          <ItineraryDisplay itinerary={itinerary} onNewTrip={handleNewTrip} />
        ) : (
          <div className="max-w-5xl mx-auto">
            <TravelForm onSubmit={handleFormSubmit} isLoading={isLoading} />
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col items-center text-center p-6 bg-muted rounded-lg">
                <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-medium mb-2">Personalized Itineraries</h3>
                <p className="text-muted-foreground">Get a custom travel plan tailored to your interests and budget</p>
              </div>
              <div className="flex flex-col items-center text-center p-6 bg-muted rounded-lg">
                <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                  <DollarSign className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-medium mb-2">Budget Breakdown</h3>
                <p className="text-muted-foreground">See estimated costs for every aspect of your trip</p>
              </div>
              <div className="flex flex-col items-center text-center p-6 bg-muted rounded-lg">
                <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-medium mb-2">Day-by-Day Planning</h3>
                <p className="text-muted-foreground">Get detailed daily schedules with activities and locations</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
