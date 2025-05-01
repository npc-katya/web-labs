import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginUser, registerUser } from "../../api/authService";
import { jwtDecode } from "jwt-decode";

interface User {
  name: string;
  surname?: string;
  patronymic?: string;
  email: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isError: boolean;
  message: string;
  isInitialized: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  isError: false,
  message: "",
  isInitialized: false,
};

// получение токена из cookie
const getTokenFromCookie = (): string | null => {
  const cookies = document.cookie.split("; ");
  const tokenCookie = cookies.find((cookie) => cookie.startsWith("token="));
  return tokenCookie ? tokenCookie.split("=")[1] : null;
};

export const loginThunk = createAsyncThunk(
  "auth/login",
  async (
    { email, password }: { email: string; password: string },
    thunkAPI,
  ) => {
    try {
      const response = await loginUser(email, password);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue("ошибка при входе");
    }
  },
);

export const registerThunk = createAsyncThunk(
  "auth/register",
  async (
    {
      name,
      surname,
      patronymic,
      gender,
      dateOfBirth,
      email,
      password,
    }: {
      name: string;
      surname: string;
      patronymic: string;
      gender: string;
      dateOfBirth: Date;
      email: string;
      password: string;
    },
    thunkAPI,
  ) => {
    try {
      const response = await registerUser(
        name,
        surname,
        patronymic,
        gender as any,
        dateOfBirth,
        email,
        password,
      );
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue("ошибка при регистрации");
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      document.cookie =
        "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;";
    },
    initializeAuthFromCookie: (state) => {
      const token = getTokenFromCookie();
      if (token) {
        try {
          const decoded: any = jwtDecode(token);
          state.token = token;
          state.user = {
            name: decoded.name,
            email: decoded.email,
          };
          state.isAuthenticated = true;
        } catch (error) {
          console.error("ошибка декодирования токена", error);
          state.token = null;
          state.user = null;
          state.isAuthenticated = false;
        }
      } else {
        state.isAuthenticated = false;
      }
      state.isInitialized = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = "";
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.message = `добро пожаловать, ${action.payload.name}`;
        document.cookie = `token=${action.payload.token}; path=/;`;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isAuthenticated = false;
        state.message = action.payload as string;
      })

      .addCase(registerThunk.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = "";
      })
      .addCase(registerThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.message = "регистрация успешна";
        document.cookie = `token=${action.payload.token}; path=/;`;
      })
      .addCase(registerThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isAuthenticated = false;
        state.message = action.payload as string;
      });
  },
});

export const { logout, initializeAuthFromCookie } = authSlice.actions;
export default authSlice.reducer;
