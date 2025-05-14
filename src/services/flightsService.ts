
import { toast } from "sonner";

// SerpApi key for flights API
const SERP_API_KEY = "2a79d0e65c7e4dd9c83aecb11b8f648b247e8366da5c72442479b8ec96dc23a4";

interface Airport {
  id: string;
  name: string;
  time: string;
}

export interface Flight {
  flight_number: string;
  airline: string;
  airline_logo: string;
  departure_airport: Airport;
  arrival_airport: Airport;
  duration: string;
  travel_class: string;
  airplane: string;
  legroom: string;
  overnight: boolean;
  often_delayed_by_over_30_min: boolean;
}

export interface FlightGroup {
  flights: Flight[];
  price?: string;
}

export interface FlightsResponse {
  best_flights: FlightGroup[];
}

export const getFlights = async (
  source: string, 
  destination: string, 
  departDate: string
): Promise<FlightsResponse | null> => {
  try {
    // Format the date to YYYY-MM-DD for the API
    const formattedDate = new Date(departDate).toISOString().split('T')[0];
    
    // Build the query parameters
    const params = new URLSearchParams({
      engine: "google_flights",
      departure_id: source,
      arrival_id: destination,
      outbound_date: formattedDate,
      api_key: SERP_API_KEY,
    });

    const url = `https://serpapi.com/search?${params.toString()}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch flights: ${response.status}`);
    }
    
    const data = await response.json();
    return data as FlightsResponse;
  } catch (error) {
    console.error("Error fetching flight information:", error);
    toast.error("Failed to fetch flight information. Please try again later.");
    return null;
  }
};
