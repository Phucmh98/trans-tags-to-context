'use client'
import { useState } from "react";
import { AppContext } from "./app-context";

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [tag, setTag] = useState<string>('');
  return (
    <AppContext.Provider value={{ tag, setTag }}>
      {children}
    </AppContext.Provider>
  );
}
