import { combineReducers } from '@reduxjs/toolkit';
import themeColorSlice from "@/store/slices/themeColorSlice";

const rootReducer = combineReducers({
  themeColor: themeColorSlice,
})

export type RootState = ReturnType<typeof rootReducer>
export default rootReducer
