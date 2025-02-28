import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { supabase } from "@/lib/supabase";

// Types
export interface Ticket {
  ticket_id: number;
  type: string;
  price: number;
  seat_number: string;
  event_id: number;
  is_available: boolean;
}

interface TicketState {
  tickets: Ticket[];
  selectedTickets: Ticket[];
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: TicketState = {
  tickets: [],
  selectedTickets: [],
  loading: false,
  error: null,
};

// Async thunks
export const fetchTicketsByEventId = createAsyncThunk(
  "tickets/fetchTicketsByEventId",
  async (eventId: number, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from("tickets")
        .select("*")
        .eq("event_id", eventId)
        .eq("is_available", true);

      if (error) throw error;
      return data as Ticket[];
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const bookTicket = createAsyncThunk(
  "tickets/bookTicket",
  async (ticketId: number, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from("tickets")
        .update({ is_available: false })
        .eq("ticket_id", ticketId)
        .select()
        .single();

      if (error) throw error;
      return data as Ticket;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Slice
const ticketSlice = createSlice({
  name: "tickets",
  initialState,
  reducers: {
    clearTicketError: (state) => {
      state.error = null;
    },
    addSelectedTicket: (state, action: PayloadAction<Ticket>) => {
      state.selectedTickets.push(action.payload);
    },
    removeSelectedTicket: (state, action: PayloadAction<number>) => {
      state.selectedTickets = state.selectedTickets.filter(
        (ticket) => ticket.ticket_id !== action.payload
      );
    },
    clearSelectedTickets: (state) => {
      state.selectedTickets = [];
    },
  },
  extraReducers: (builder) => {
    // Fetch tickets by event id
    builder.addCase(fetchTicketsByEventId.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      fetchTicketsByEventId.fulfilled,
      (state, action: PayloadAction<Ticket[]>) => {
        state.loading = false;
        state.tickets = action.payload;
      }
    );
    builder.addCase(fetchTicketsByEventId.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Book ticket
    builder.addCase(bookTicket.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      bookTicket.fulfilled,
      (state, action: PayloadAction<Ticket>) => {
        state.loading = false;
        state.tickets = state.tickets.filter(
          (ticket) => ticket.ticket_id !== action.payload.ticket_id
        );
      }
    );
    builder.addCase(bookTicket.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const {
  clearTicketError,
  addSelectedTicket,
  removeSelectedTicket,
  clearSelectedTickets,
} = ticketSlice.actions;
export default ticketSlice.reducer;