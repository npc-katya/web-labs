import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { registerUser } from "../../api/authService";

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

interface RegisterState {
  isLoading: boolean;
  isError: boolean;
  successMessage: string | null;
}

const initialState: RegisterState = {
  isLoading: false,
  isError: false,
  successMessage: null,
};

export const registerThunk = createAsyncThunk(
  "register/user",
  async (data: RegisterPayload, thunkAPI) => {
    try {
      const response = await registerUser(data.name, data.email, data.password);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue("ошибка при регистрации");
    }
  },
);

const registerSlice = createSlice({
  name: "register",
  initialState,
  reducers: {
    resetRegisterState: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerThunk.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.successMessage = null;
      })
      .addCase(registerThunk.fulfilled, (state) => {
        state.isLoading = false;
        state.successMessage = `пользователь успешно зарегистрирован`;
      })
      .addCase(registerThunk.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      });
  },
});

export const { resetRegisterState } = registerSlice.actions;
export default registerSlice.reducer;
