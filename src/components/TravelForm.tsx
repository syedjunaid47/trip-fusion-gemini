
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, MapPin, Users, DollarSign, Search, Plane } from "lucide-react";
import { toast } from "sonner";
import { TravelFormData } from "@/types";
import { Badge } from "@/components/ui/badge";
import { setGeminiApiKey } from "@/services/geminiService";
import { Checkbox } from "@/components/ui/checkbox";

interface TravelFormProps {
  onSubmit: (data: TravelFormData) => void;
  isLoading: boolean;
}

const interestOptions = [
  "Sightseeing",
  "Adventure",
  "Food",
  "Culture",
  "History",
  "Nature",
  "Shopping",
  "Relaxation",
  "Nightlife",
  "Art",
  "Music",
  "Sports",
  "Photography",
  "Wildlife",
  "Beaches"
];

const TravelForm: React.FC<TravelFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<TravelFormData>({
    source: "",
    destination: "",
    startDate: "",
    endDate: "",
    budget: "",
    travelers: 1,
    interests: [],
    includeFlights: false
  });

  // Set the default API key when the component mounts
  useEffect(() => {
    setGeminiApiKey("AIzaSyAx94WJth-9k1P2D3Q9pHQ25XtqmQpZJec");
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    
    if (type === "number") {
      setFormData({
        ...formData,
        [name]: parseInt(value) || 1,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const toggleInterest = (interest: string) => {
    setFormData((prev) => {
      if (prev.interests.includes(interest)) {
        return {
          ...prev,
          interests: prev.interests.filter(i => i !== interest),
        };
      } else {
        return {
          ...prev,
          interests: [...prev.interests, interest],
        };
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Form validation
    if (!formData.source) {
      toast.error("Please enter your departure location");
      return;
    }

    if (!formData.destination) {
      toast.error("Please enter your destination");
      return;
    }

    if (!formData.startDate || !formData.endDate) {
      toast.error("Please enter travel dates");
      return;
    }

    if (!formData.budget) {
      toast.error("Please enter your budget");
      return;
    }

    if (formData.interests.length === 0) {
      toast.error("Please select at least one interest");
      return;
    }

    onSubmit(formData);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center gap-2 text-primary">
          <Search className="h-6 w-6" /> 
          Trip Planner
        </CardTitle>
        <CardDescription>
          Enter your trip details to get personalized recommendations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="source" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" /> From
              </Label>
              <Input
                id="source"
                name="source"
                placeholder="Your departure location"
                value={formData.source}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="destination" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" /> To
              </Label>
              <Input
                id="destination"
                name="destination"
                placeholder="Your destination"
                value={formData.destination}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" /> Start Date
              </Label>
              <Input
                id="startDate"
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="endDate" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" /> End Date
              </Label>
              <Input
                id="endDate"
                name="endDate"
                type="date"
                value={formData.endDate}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="budget" className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" /> Budget
              </Label>
              <Input
                id="budget"
                name="budget"
                placeholder="e.g. $2000"
                value={formData.budget}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="travelers" className="flex items-center gap-2">
                <Users className="h-4 w-4" /> Travelers
              </Label>
              <Input
                id="travelers"
                name="travelers"
                type="number"
                min="1"
                max="20"
                value={formData.travelers}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="block mb-2">Interests (select at least one)</Label>
            <div className="flex flex-wrap gap-2">
              {interestOptions.map(interest => (
                <Badge
                  key={interest}
                  variant={formData.interests.includes(interest) ? "default" : "outline"}
                  className={`cursor-pointer ${
                    formData.interests.includes(interest) 
                      ? "bg-primary hover:bg-primary/80" 
                      : "hover:bg-primary/10"
                  }`}
                  onClick={() => toggleInterest(interest)}
                >
                  {interest}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex items-start space-x-2">
            <Checkbox 
              id="includeFlights" 
              checked={formData.includeFlights}
              onCheckedChange={(checked) => {
                setFormData({
                  ...formData,
                  includeFlights: checked === true
                });
              }}
            />
            <div className="grid gap-1.5 leading-none">
              <Label 
                htmlFor="includeFlights" 
                className="text-sm font-medium leading-none flex items-center gap-2 cursor-pointer"
              >
                <Plane className="h-4 w-4" />
                Include flight information
              </Label>
              <p className="text-sm text-muted-foreground">
                Get transportation details using SERAPI flights API
              </p>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button 
          type="submit" 
          className="w-full travel-gradient" 
          disabled={isLoading}
          onClick={handleSubmit}
        >
          {isLoading ? "Planning your trip..." : "Plan My Trip"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TravelForm;
