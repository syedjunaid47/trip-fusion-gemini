import { TravelFormData, TravelItinerary } from "../types";
import { toast } from "sonner";
import { getFlights } from "./flightsService";

// In a real application, the API key should be stored securely
// This is just for demo purposes - in production, this would be handled by a backend service
let GEMINI_API_KEY = "";

export const setGeminiApiKey = (key: string) => {
  GEMINI_API_KEY = key;
};

export const getItinerary = async (formData: TravelFormData): Promise<TravelItinerary> => {
  if (!GEMINI_API_KEY) {
    throw new Error("Gemini API key not set");
  }

  try {
    const prompt = generateTravelPrompt(formData);
    
    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": GEMINI_API_KEY,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 8192,
        }
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Gemini API error:", errorData);
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Parse the response text to extract the itinerary
    const responseText = data.candidates[0]?.content?.parts?.[0]?.text;
    
    if (!responseText) {
      throw new Error("No response from Gemini API");
    }
    
    const itinerary = parseItineraryResponse(responseText, formData);
    
    // If user requested flight information, fetch it
    if (formData.includeFlights) {
      try {
        toast.info("Fetching flight information...");
        const flightsData = await getFlights(
          formData.source,
          formData.destination,
          formData.startDate
        );
        
        if (flightsData) {
          itinerary.flights = flightsData.best_flights;
          toast.success("Flight information added to your itinerary!");
        }
      } catch (error) {
        console.error("Error fetching flights:", error);
        toast.error("Could not fetch flight information, but your itinerary is ready.");
      }
    }
    
    return itinerary;
  } catch (error) {
    console.error("Error generating itinerary:", error);
    toast.error("Failed to generate itinerary. Please try again later.");
    throw error;
  }
};

function generateTravelPrompt(formData: TravelFormData): string {
  return `
You are an expert travel planner. Please create a detailed day-by-day travel itinerary from ${formData.source} to ${formData.destination} with the following details:

- Travel dates: ${formData.startDate} to ${formData.endDate}
- Budget: ${formData.budget}
- Number of travelers: ${formData.travelers}
- Interests: ${formData.interests.join(", ")}

Please provide:
1. A catchy title for the trip
2. A summary of the trip in 2-3 sentences
3. A day-by-day itinerary with:
   - The date for each day
   - 3-5 activities per day with approximate times
   - Locations and estimated costs for each activity
4. A budget breakdown for the entire trip (accommodation, transportation, activities, food, misc)
5. 3-5 travel tips for this specific destination

Format your response as JSON with the following structure:
{
  "title": "Catchy trip title",
  "summary": "Brief summary of the trip",
  "budgetBreakdown": {
    "accommodation": "$X",
    "transportation": "$X",
    "activities": "$X",
    "food": "$X",
    "misc": "$X",
    "total": "$X"
  },
  "days": [
    {
      "day": 1,
      "date": "YYYY-MM-DD",
      "activities": [
        {
          "time": "XX:XX AM/PM",
          "description": "Activity description",
          "location": "Location name",
          "cost": "$X"
        }
      ]
    }
  ],
  "tips": ["Tip 1", "Tip 2", "Tip 3"]
}
`;
}

function parseItineraryResponse(responseText: string, formData: TravelFormData): TravelItinerary {
  try {
    // Extract JSON from the response text
    // Look for text that looks like JSON (between curly braces)
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    
    if (jsonMatch) {
      const jsonStr = jsonMatch[0];
      const parsedData = JSON.parse(jsonStr);
      return parsedData as TravelItinerary;
    }
    
    // Fallback if we couldn't extract proper JSON
    throw new Error("Could not parse JSON from response");
  } catch (error) {
    console.error("Failed to parse itinerary response:", error);
    // Return a placeholder itinerary
    return {
      title: `${formData.source} to ${formData.destination} Trip`,
      summary: "We had trouble generating a detailed itinerary. Please try again with different parameters or check your API key.",
      days: [
        {
          day: 1,
          date: formData.startDate,
          activities: [
            {
              time: "All day",
              description: "Custom itinerary planning",
              location: formData.destination,
            },
          ],
        },
      ],
      tips: ["Always check local weather before traveling", "Research local customs and traditions"],
    };
  }
}
