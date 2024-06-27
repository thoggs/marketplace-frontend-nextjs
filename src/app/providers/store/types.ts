import { ReactNode } from "react";
import { UserProfileSliceType } from "@/store/types";

export type StoreProviderProps = {
  children: ReactNode;
  userProfile: UserProfileSliceType;
};