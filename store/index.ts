import { enableStaticRendering } from "mobx-react-lite";

import { appStore } from "./app";

const isServer = typeof window === "undefined";
enableStaticRendering(isServer);

export const store = {
  app: appStore,
};

if (!isServer && process.env.NODE_ENV !== "production") {
  (window as any).store = store;
}