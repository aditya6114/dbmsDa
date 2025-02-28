import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { supabase } from "@/lib/supabase";
import { Ticket } from "./ticketSlice";

// Types
export interface Order {
  order_id: number;
  user_id: string;
  total_price: number;
  date: string;
  status: "pending" | "completed" | "cancelled";
}

export interface OrderItem {
  order_item_id: number;
  order_id: number;
  ticket_id: number;
}

export interface Payment {
  payment_id: number;
  order_id: number;
  payment_method: string;
  transaction_id: string;
  amount: number;
  status: "pending" | "completed" | "failed";
  date: string;
}

export interface OrderWithItems extends Order {
  items: Ticket[];
}

interface OrderState {
  orders: OrderWithItems[];
  currentOrder: OrderWithItems | null;
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: OrderState = {
  orders: [],
  currentOrder: null,
  loading: false,
  error: null,
};

// Async thunks
export const fetchUserOrders = createAsyncThunk(
  "orders/fetchUserOrders",
  async (userId: string, { rejectWithValue }) => {
    try {
      // Fetch orders
      const { data: orders, error: ordersError } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", userId)
        .order("date", { ascending: false });

      if (ordersError) throw ordersError;

      // For each order, fetch the order items and tickets
      const ordersWithItems = await Promise.all(
        orders.map(async (order) => {
          // Fetch order items
          const { data: orderItems, error: orderItemsError } = await supabase
            .from("order_items")
            .select("*")
            .eq("order_id", order.order_id);

          if (orderItemsError) throw orderItemsError;

          // Fetch tickets for each order item
          const ticketIds = orderItems.map((item) => item.ticket_id);
          const { data: tickets, error: ticketsError } = await supabase
            .from("tickets")
            .select("*")
            .in("ticket_id", ticketIds);

          if (ticketsError) throw ticketsError;

          return {
            ...order,
            items: tickets,
          };
        })
      );

      return ordersWithItems as OrderWithItems[];
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const createOrder = createAsyncThunk(
  "orders/createOrder",
  async (
    {
      userId,
      tickets,
      paymentMethod,
    }: {
      userId: string;
      tickets: Ticket[];
      paymentMethod: string;
    },
    { rejectWithValue }
  ) => {
    try {
      // Calculate total price
      const totalPrice = tickets.reduce((sum, ticket) => sum + ticket.price, 0);

      // Create order
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert([
          {
            user_id: userId,
            total_price: totalPrice,
            date: new Date().toISOString(),
            status: "pending",
          },
        ])
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = tickets.map((ticket) => ({
        order_id: order.order_id,
        ticket_id: ticket.ticket_id,
      }));

      const { error: orderItemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (orderItemsError) throw orderItemsError;

      // Update tickets to not available
      const ticketIds = tickets.map((ticket) => ticket.ticket_id);
      const { error: ticketsError } = await supabase
        .from("tickets")
        .update({ is_available: false })
        .in("ticket_id", ticketIds);

      if (ticketsError) throw ticketsError;

      // Create payment
      const { data: payment, error: paymentError } = await supabase
        .from("payments")
        .insert([
          {
            order_id: order.order_id,
            payment_method: paymentMethod,
            transaction_id: `txn_${Math.random().toString(36).substring(2, 15)}`,
            amount: totalPrice,
            status: "completed",
            date: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (paymentError) throw paymentError;

      // Update order status to completed
      const { data: updatedOrder, error: updateOrderError } = await supabase
        .from("orders")
        .update({ status: "completed" })
        .eq("order_id", order.order_id)
        .select()
        .single();

      if (updateOrderError) throw updateOrderError;

      return {
        ...updatedOrder,
        items: tickets,
      } as OrderWithItems;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Slice
const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    clearOrderError: (state) => {
      state.error = null;
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch user orders
    builder.addCase(fetchUserOrders.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      fetchUserOrders.fulfilled,
      (state, action: PayloadAction<OrderWithItems[]>) => {
        state.loading = false;
        state.orders = action.payload;
      }
    );
    builder.addCase(fetchUserOrders.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Create order
    builder.addCase(createOrder.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      createOrder.fulfilled,
      (state, action: PayloadAction<OrderWithItems>) => {
        state.loading = false;
        state.orders.unshift(action.payload);
        state.currentOrder = action.payload;
      }
    );
    builder.addCase(createOrder.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearOrderError, clearCurrentOrder } = orderSlice.actions;
export default orderSlice.reducer;