export interface Event {
  id: number;
  title: string;
  description: string;
  date: Date;
  location: string;
  createdBy: number;
}

export class EventService {
  private token: string | null = null;

  constructor(token: string | null) {
    this.token = token;
  }

  // получение всех событий
  public async fetchEvents(): Promise<Event[]> {
    try {
      const response = await fetch("http://localhost:8080/events", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${this.token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`ошибка при получении событий: ${response.statusText}`);
      }

      const data = await response.json();
      return data.map((event: Event) => ({
        ...event,
        date: new Date(event.date),
      }));
    } catch (error) {
      console.error("ошибка:", error);
      throw error;
    }
  }

  // получение события по ID
  public async fetchEventById(eventId: number): Promise<Event> {
    if (!this.token) throw new Error("токен отсутствует");

    try {
      const response = await fetch(
        `http://localhost:8080/protected/events/${eventId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${this.token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        throw new Error(
          `ошибка при получении события с ID ${eventId}: ${response.statusText}`,
        );
      }

      const eventData = await response.json();
      return {
        ...eventData,
        date: new Date(eventData.date),
      };
    } catch (error) {
      console.error("ошибка:", error);
      throw error;
    }
  }

  // создание события
  public async createEvent(eventData: Omit<Event, "id">): Promise<Event> {
    if (!this.token) throw new Error("токен отсутствует");

    try {
      const response = await fetch("http://localhost:8080/protected/events", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventData),
      });

      if (!response.ok) {
        throw new Error(`сетевая ошибка: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("ошибка:", error);
      throw error;
    }
  }

  // обновление события
  public async updateEvent(
    eventId: number,
    eventData: Omit<Event, "id" | "createdBy">,
  ): Promise<Event> {
    if (!this.token) throw new Error("токен отсутствует");

    try {
      const response = await fetch(
        `http://localhost:8080/protected/events/${eventId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${this.token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(eventData),
        },
      );

      if (!response.ok) {
        throw new Error(`сетевая ошибка: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("ошибка:", error);
      throw error;
    }
  }

  // удаление события
  public async deleteEvent(eventId: number): Promise<void> {
    if (!this.token) throw new Error("токен отсутствует");

    try {
      const response = await fetch(
        `http://localhost:8080/protected/events/${eventId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${this.token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        throw new Error(`сетевая ошибка: ${response.statusText}`);
      }
    } catch (error) {
      console.error("ошибка:", error);
      throw error;
    }
  }
}
