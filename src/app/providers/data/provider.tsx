import React, { ReactNode } from 'react';
import { assembleUserProfile } from "@/app/auth/session/assembleUserProfile";
import StoreProvider from "@/app/providers/store/provider";

export default async function DataProvider({ children }: { children: ReactNode }) {
  const loggedInUser = await assembleUserProfile();
  return <StoreProvider userProfile={loggedInUser}>{children}</StoreProvider>;
}