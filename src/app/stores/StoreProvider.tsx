import React from "react";
import {todoStore} from "@stores/todoStore.ts";
import {StoreContext} from "@stores/storeContext.tsx";

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <StoreContext.Provider value={{ todoStore }}>{children}</StoreContext.Provider>
);