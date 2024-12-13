import React from "react";
import { todoStore } from "@stores/todoStore.ts";
import { StoreContext } from "@stores/storeContext.tsx";
import { statusStore } from "@stores/statusStore.ts";

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <StoreContext.Provider value={{ todoStore, statusStore }}>
    {children}
  </StoreContext.Provider>
);
