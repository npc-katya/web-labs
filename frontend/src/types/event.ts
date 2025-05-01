export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  organizer: {
    id: string;
    name: string;
  };
}

export interface CreateEventData {
  title: string;
  description: string;
  date: string;
  location: string;
}
