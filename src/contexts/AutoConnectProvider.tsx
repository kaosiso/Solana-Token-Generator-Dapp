import { useLocalStorage } from "@solana/wallet-adapter-react";
import { FC, createContext, useContext, ReactNode } from "react";

export interface AutoConnectContextState {
  autoConnect: boolean;
  setAutoConnect: (autoConnect: boolean) => void;
}

const AutoConnectContext =
  createContext<AutoConnectContextState | undefined>(undefined);

export function useAutoConnect(): AutoConnectContextState {
  const context = useContext(AutoConnectContext);
  if (!context) {
    throw new Error("useAutoConnect must be used within AutoConnectProvider");
  }
  return context;
}

export const AutoConnectProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [autoConnect, setAutoConnect] =
    useLocalStorage<boolean>("autoConnect", true);

  return (
    <AutoConnectContext.Provider value={{ autoConnect, setAutoConnect }}>
      {children}
    </AutoConnectContext.Provider>
  );
};
