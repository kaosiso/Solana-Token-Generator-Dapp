import { PublicKey } from "@solana/web3.js";

export function getExploreUrl(
  endpoint: string,
  viewTypeOrItemAddress: "inspector" | PublicKey | string,
  itemType: "address" | "tx" | "block" = "address"
): string {
  // Convert PublicKey to string if needed
  const address =
    viewTypeOrItemAddress instanceof PublicKey
      ? viewTypeOrItemAddress.toBase58()
      : viewTypeOrItemAddress;

  // Build cluster query parameter
  const getClusterUrlParam = (): string => {
    let cluster = "";

    if (endpoint === "Localnet") {
      cluster = `custom&customUrl=${encodeURIComponent("http://127.0.0.1:8899")}`;
    } else if (endpoint === "http://api.devnet.solana.com") {
      cluster = "devnet";
    }

    return cluster ? `?cluster=${cluster}` : "";
  };

  // Return full Solana Explorer URL
  return `https://explorer.solana.com/${itemType}/${address}${getClusterUrlParam()}`;
}
