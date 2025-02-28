import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { supabase } from "@/lib/supabase";

// Types
export interface Event {
  event_id: number;
  name: string;
  description: string;
  location: string;
  date: string;
  time: string;
  venue_id: number;
  image_url?: string;
  created_at: string;
}

export interface Venue {
  venue_id: number;
  name: string;
  address: string;
  city: string;
  state: string;
  zipcode: string;
  capacity: number;
}

export interface Speaker {
  speaker_id: number;
  name: string;
  bio: string;
  event_id: number;
  image_url?: string;
}

interface EventState {
  events: Event[];
  event: Event | null;
  venues: Venue[];
  venue: Venue | null;
  speakers: Speaker[];
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: EventState = {
  events: [],
  event: null,
  venues: [],
  venue: null,
  speakers: [],
  loading: false,
  error: null,
};

// Async thunks
export const fetchEvents = createAsyncThunk(
  "events/fetchEvents",
  async (_, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("date", { ascending: true });

      if (error) throw error;
      return data as Event[];
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchEventById = createAsyncThunk(
  "events/fetchEventById",
  async (id: number, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("event_id", id)
        .single();

      if (error) throw error;
      return data as Event;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchVenues = createAsyncThunk(
  "events/fetchVenues",
  async (_, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from("venues")
        .select("*")
        .order("name", { ascending: true });

      if (error) throw error;
      return data as Venue[];
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchVenueById = createAsyncThunk(
  "events/fetchVenueById",
  async (id: number, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from("venues")
        .select("*")
        .eq("venue_id", id)
        .single();

      if (error) throw error;
      return data as Venue;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchSpeakersByEventId = createAsyncThunk(
  "events/fetchSpeakersByEventId",
  async (eventId: number, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from("speakers")
        .select("*")
        .eq("event_id", eventId);

      if (error) throw error;
      return data as Speaker[];
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const createEvent = createAsyncThunk(
  "events/createEvent",
  async (event: Omit<Event, "event_id" | "created_at">, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from("events")
        .insert([event])
        .select()
        .single();

      if (error) throw error;
      return data as Event;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateEvent = createAsyncThunk(
  "events/updateEvent",
  async (
    { id, event }: { id: number; event: Partial<Event> },
    { rejectWithValue }
  ) => {
    try {
      const { data, error } = await supabase
        .from("events")
        .update(event)
        .eq("event_id", id)
        .select()
        .single();

      if (error) throw error;
      return data as Event;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteEvent = createAsyncThunk(
  "events/deleteEvent",
  async (id: number, { rejectWithValue }) => {
    try {
      const { error } = await supabase.from("events").delete().eq("event_id", id);

      if (error) throw error;
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Slice
const eventSlice = createSlice({
  name: "events",
  initialState,
  reducers: {
    clearEventError: (state) => {
      state.error = null;
    },
    clearCurrentEvent: (state) => {
      state.event = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch events
    builder.addCase(fetchEvents.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      fetchEvents.fulfilled,
      (state, action: PayloadAction<Event[]>) => {
        state.loading = false;
        state.events = action.payload;
      }
    );
    builder.addCase(fetchEvents.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Fetch event by id
    builder.addCase(fetchEventById.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      fetchEventById.fulfilled,
      (state, action: PayloadAction<Event>) => {
        state.loading = false;
        state.event = action.payload;
      }
    );
    builder.addCase(fetchEventById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Fetch venues
    builder.addCase(fetchVenues.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      fetchVenues.fulfilled,
      (state, action: PayloadAction<Venue[]>) => {
        state.loading = false;
        state.venues = action.payload;
      }
    );
    builder.addCase(fetchVenues.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Fetch venue by id
    builder.addCase(fetchVenueById.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      fetchVenueById.fulfilled,
      (state, action: PayloadAction<Venue>) => {
        state.loading = false;
        state.venue = action.payload;
      }
    );
    builder.addCase(fetchVenueById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Fetch speakers by event id
    builder.addCase(fetchSpeakersByEventId.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      fetchSpeakersByEventId.fulfilled,
      (state, action: PayloadAction<Speaker[]>) => {
        state.loading = false;
        state.speakers = action.payload;
      }
    );
    builder.addCase(fetchSpeakersByEventId.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Create event
    builder.addCase(createEvent.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      createEvent.fulfilled,
      (state, action: PayloadAction<Event>) => {
        state.loading = false;
        state.events.push(action.payload);
        state.event = action.payload;
      }
    );
    builder.addCase(createEvent.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Update event
    builder.addCase(updateEvent.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      updateEvent.fulfilled,
      (state, action: PayloadAction<Event>) => {
        state.loading = false;
        state.events = state.events.map((event) =>
          event.event_id === action.payload.event_id ? action.payload : event
        );
        state.event = action.payload;
      }
    );
    builder.addCase(updateEvent.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Delete event
    builder.addCase(deleteEvent.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      deleteEvent.fulfilled,
      (state, action: PayloadAction<number>) => {
        state.loading = false;
        state.events = state.events.filter(
          (event) => event.event_id !== action.payload
        );
        if (state.event?.event_id === action.payload) {
          state.event = null;
        }
      }
    );
    builder.addCase(deleteEvent.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearEventError, clearCurrentEvent } = eventSlice.actions;
export default eventSlice.reducer;