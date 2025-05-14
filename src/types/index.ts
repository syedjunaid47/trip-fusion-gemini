
export interface TravelFormData {
  source: string;
  destination: string;
  startDate: string;
  endDate: string;
  budget: string;
  travelers: number;
  interests: string[];
}

export interface ItineraryDay {
  day: number;
  date: string;
  activities: ItineraryActivity[];
}

export interface ItineraryActivity {
  time: string;
  description: string;
  location?: string;
  cost?: string;
}

export interface TravelItinerary {
  title: string;
  summary: string;
  budgetBreakdown?: {
    accommodation: string;
    transportation: string;
    activities: string;
    food: string;
    misc: string;
    total: string;
  };
  days: ItineraryDay[];
  tips: string[];
}
