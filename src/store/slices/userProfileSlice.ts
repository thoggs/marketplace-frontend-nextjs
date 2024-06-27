import { UserProfileSliceType } from "@/store/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";


const initialState: UserProfileSliceType = {
  id: String(),
  name: String(),
  email: String(),
  accessToken: String(),
  profileImage: String(),
}

export const userProfileSlice = createSlice({
  name: 'userProfile',
  initialState,
  reducers: {
    setValue: (
      _state,
      action: PayloadAction<UserProfileSliceType>) => action.payload,
  },
});

export const {
  setValue: setUserProfile,
} = userProfileSlice.actions;

export default userProfileSlice.reducer;