'use client';
import { Provider } from 'react-redux'
import React from "react";
import store from "@/store";
import { StoreProviderProps } from "@/app/providers/store/types";
import { setUserProfile } from "@/store/slices/userProfileSlice";

export default function StoreProvider({ children, userProfile }: StoreProviderProps) {
  store.dispatch(setUserProfile(userProfile));
  return <Provider store={store}>{children}</Provider>
}