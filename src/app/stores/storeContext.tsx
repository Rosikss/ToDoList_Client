// stores/storeContext.tsx
import React from "react";
import { todoStore } from "./todoStore.ts";

export const StoreContext = React.createContext({ todoStore });
