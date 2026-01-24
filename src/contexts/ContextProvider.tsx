import { WalletAdapterNetwork, WalletError } from "@solana/wallet-adapter-base";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  TorusWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";
import { FC, ReactNode, useCallback, useMemo } from "react";
import { AutoConnectProvider, useAutoConnect } from "./AutoConnectProvider";
import {
  NetworkConfigurationProvider,
  useNetworkConfiguration,
} from "./NetworkConfigurationProvider";
import { notify } from "../utils/notifications";

const WalletContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { autoConnect } = useAutoConnect();
  const { networkConfiguration } = useNetworkConfiguration();

  const network = networkConfiguration as WalletAdapterNetwork;

  const endpoint = useMemo(() => {
    switch (network) {
      case WalletAdapterNetwork.Mainnet:
        return "https://solana-mainnet.g.alchemy.com/v2/..."; // Mainnet RPC
      case WalletAdapterNetwork.Devnet:
        return clusterApiUrl("devnet"); // Devnet RPC
      case WalletAdapterNetwork.Testnet:
        return clusterApiUrl("testnet"); // Testnet RPC
      default:
        return clusterApiUrl("devnet"); // Fallback
    }
  }, [network]);

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      new TorusWalletAdapter(),
    ],
    []
  );

  const onError = useCallback((error: WalletError) => {
    notify({
      type: "error",
      message: error.message
        ? `${error.name}: ${error.message}`
        : error.name,
    });
    console.error(error);
  }, []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect={autoConnect} onError={onError}>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export const ContextProvider:FC<{children: ReactNode}> = ({children}) => {
  return(
    <> 
    <NetworkConfigurationProvider>
      <AutoConnectProvider>
        <WalletContextProvider>
          {children}
        </WalletContextProvider>
      </AutoConnectProvider>
    </NetworkConfigurationProvider>
    </>
  )
}

export const AppWalletProvider: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <NetworkConfigurationProvider>
      <AutoConnectProvider>
        <WalletContextProvider>{children}</WalletContextProvider>
      </AutoConnectProvider>
    </NetworkConfigurationProvider>
  );
};
