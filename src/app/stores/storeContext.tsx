// stores/storeContext.tsx
import React from "react";
import { todoStore } from "./todoStore.ts";

export const StoreContext = React.createContext({ todoStore });

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <StoreContext.Provider value={{ todoStore }}>{children}</StoreContext.Provider>
);
