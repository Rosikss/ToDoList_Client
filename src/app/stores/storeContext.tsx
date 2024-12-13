// stores/storeContext.tsx
import React from "react";
import { todoStore } from "./todoStore.ts";
import { statusStore } from "@stores/statusStore.ts";

export const StoreContext = React.createContext({ todoStore, statusStore });
