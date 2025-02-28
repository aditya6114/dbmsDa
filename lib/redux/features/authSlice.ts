import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { supabase } from "@/lib/supabase";

// Types
export interface User {
  id: string;
  email: string;
  name: string;
  user_type: "admin" | "organizer" | "attendee";
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

// Async thunks
export const registerUser = createAsyncThunk(
  "auth/register",
  async (
    {
      email,
      password,
      name,
      user_type,
    }: {
      email: string;
      password: string;
      name: string;
      user_type: "admin" | "organizer" | "attendee";
    },
    { rejectWithValue }
  ) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      // Create user profile in users table
      const { error: profileError } = await supabase.from("users").insert([
        {
          id: data.user?.id,
          email,
          name,
          user_type,
        },
      ]);

      if (profileError) throw profileError;

      // Get the user profile
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("id", data.user?.id)
        .single();

      if (userError) throw userError;

      return userData as User;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Get the user profile
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("id", data.user?.id)
        .single();

      if (userError) throw userError;

      return userData as User;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return null;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const getCurrentUser = createAsyncThunk(
  "auth/getCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) throw error;
      if (!data.session) return null;

      // Get the user profile
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("id", data.session.user.id)
        .single();

      if (userError) throw userError;

      return userData as User;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Register
    builder.addCase(registerUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      registerUser.fulfilled,
      (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      }
    );
    builder.addCase(registerUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Login
    builder.addCase(loginUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      loginUser.fulfilled,
      (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      }
    );
    builder.addCase(loginUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Logout
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.user = null;
      state.isAuthenticated = false;
    });

    // Get current user
    builder.addCase(getCurrentUser.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      getCurrentUser.fulfilled,
      (state, action: PayloadAction<User | null>) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = !!action.payload;
      }
    );
    builder.addCase(getCurrentUser.rejected, (state, action) => {
      state.loading = false;
      state.user = null;
      state.isAuthenticated = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;