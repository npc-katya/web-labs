import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { EventService } from "../../api/eventService";
import { UserService } from "../../api/userService";
import { jwtDecode } from "jwt-decode";

export interface EventWithCreator {
  id: number;
  title: string;
  description: string;
  date: Date;
  location: string;
  coordinates: number[];
  createdBy: number;
  creatorName: string;
}

interface EventsState {
  events: EventWithCreator[];
  isLoading: boolean;
  isError: boolean;
  message: string | null;
}

const initialState: EventsState = {
  events: [],
  isLoading: false,
  isError: false,
  message: null,
};

// утилита для получения токена
const getTokenFromCookie = (): string | null => {
  const cookies = document.cookie.split("; ");
  const tokenCookie = cookies.find((cookie) => cookie.startsWith("token="));
  return tokenCookie ? tokenCookie.split("=")[1] : null;
};

// загрузка событий с получением имени создателя
export const fetchEventsThunk = createAsyncThunk<EventWithCreator[]>(
  "events/fetchEvents",
  async (_, { rejectWithValue }) => {
    const token = getTokenFromCookie();
    const eventService = new EventService(token);
    const userService = new UserService(token);

    try {
      const rawEvents = await eventService.fetchEvents();

      let currentUserId: number | null = null;
      let currentUserName: string = "";

      if (token) {
        try {
          const decoded = jwtDecode<{ id: number; name: string }>(token);
          currentUserId = decoded?.id ?? null;
          currentUserName = decoded?.name ?? "";
        } catch (decodeError) {
          console.error("ошибка при декодировании токена:", decodeError);
        }
      }

      const enrichedEvents = await Promise.all(
        rawEvents.map(async (event) => {
          const coords = event.location
            .split(",")
            .map((c) => parseFloat(c.trim()));
          let creatorName = "кто-то";

          if (token) {
            if (event.createdBy === currentUserId) {
              creatorName = currentUserName || "вы";
            } else {
              const creator = await userService.fetchUserById(event.createdBy);
              creatorName = creator.name;
            }
          }

          return {
            ...event,
            coordinates: coords,
            creatorName,
          };
        }),
      );

      return enrichedEvents;
    } catch (error) {
      console.error("ошибка при получении событий:", error);
      return rejectWithValue("ошибка при получении событий");
    }
  },
);

const eventsSlice = createSlice({
  name: "events",
  initialState,
  reducers: {
    clearEventsState: (state) => {
      state.events = [];
      state.isError = false;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEventsThunk.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = null;
      })
      .addCase(fetchEventsThunk.fulfilled, (state, action) => {
        state.events = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchEventsThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      });
  },
});

export const { clearEventsState } = eventsSlice.actions;
export default eventsSlice.reducer;
