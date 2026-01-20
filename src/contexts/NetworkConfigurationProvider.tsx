import { useLocalStorage } from "@solana/wallet-adapter-react";
import { createContext, FC, ReactNode, useContext } from "react";

export interface NetworkConfigurationState {
  networkConfiguration: string;
  setNetworkConfiguration: (network: string) => void;
}

const NetworkConfigurationContext =
  createContext<NetworkConfigurationState | undefined>(undefined);

export function useNetworkConfiguration(): NetworkConfigurationState {
  const context = useContext(NetworkConfigurationContext);
  if (!context) {
    throw new Error(
      "useNetworkConfiguration must be used within NetworkConfigurationProvider"
    );
  }
  return context;
}

export const NetworkConfigurationProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [networkConfiguration, setNetworkConfiguration] =
    useLocalStorage<string>("network", "devnet");

  return (
    <NetworkConfigurationContext.Provider
      value={{ networkConfiguration, setNetworkConfiguration }}
    >
      {children}
    </NetworkConfigurationContext.Provider>
  );
};
