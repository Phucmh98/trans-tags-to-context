import { createContext, useContext } from "react";

export type AppContextType = {
  tag: string;
  setTag: (tags: string) => void;
};

export const AppContext = createContext<AppContextType | undefined>(undefined);

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used within AppProvider");
  return ctx;
}
