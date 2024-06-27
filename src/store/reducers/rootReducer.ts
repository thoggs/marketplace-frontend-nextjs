import { combineReducers } from '@reduxjs/toolkit';
import themeColorSlice from "@/store/slices/themeColorSlice";
import userProfileSlice from "@/store/slices/userProfileSlice";

const rootReducer = combineReducers({
  themeColor: themeColorSlice,
  userProfile: userProfileSlice,
})

export type AppState = ReturnType<typeof rootReducer>
export default rootReducer
