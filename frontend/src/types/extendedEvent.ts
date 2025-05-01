export interface EventWithCreator {
  id: number;
  title: string;
  date: Date;
  location: string;
  description: string;
  coordinates: number[];
  createdBy: number;
  creatorName: string;
}
