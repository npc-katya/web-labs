export interface EventType {
  id: number;
  title: string;
  date: Date;
  location: string;
  description: string | null;
  createdBy: number;
}
