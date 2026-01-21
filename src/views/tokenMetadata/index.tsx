import React, { FC, useCallback, useState } from "react";
import { useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { Metadata, PROGRAM_ID } from "@metaplex-foundation/mpl-token-metadata";
import { AiOutlineClose } from "react-icons/ai";
import { ClipLoader } from "react-spinners";
import { notify } from "utils/notifications";

import { InputView } from "views/input";
import Branding from "components/Branding";

interface TokenMetadataProps {
  setOpenTokenMetaData: (open: boolean) => void;
}

export const TokenMetadata: FC<TokenMetadataProps> = ({ setOpenTokenMetaData }) => {
  const { connection } = useConnection();

  const [tokenAddress, setTokenAddress] = useState<string>("");
  const [tokenMetadata, setTokenMetadata] = useState<Metadata["data"] | null>(null);
  const [logo, setLogo] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getMetadata = useCallback(async (mintAddress: string) => {
    setIsLoading(true);
    try {
      const tokenMint = new PublicKey(mintAddress);

      const [metadataPDA] = PublicKey.findProgramAddressSync(
        [Buffer.from("metadata"), PROGRAM_ID.toBuffer(), tokenMint.toBuffer()],
        PROGRAM_ID
      );

      const metadataAccount = await connection.getAccountInfo(metadataPDA);
      if (!metadataAccount) throw new Error("Metadata account not found");

      const [metadata] = Metadata.deserialize(metadataAccount.data);
      const logoRes = await fetch(metadata.data.uri);
      const logoJson = await logoRes.json();
      const { img } = logoJson;

      setTokenMetadata(metadata.data);
      setLogo(img ?? null);
      setTokenAddress("");

      notify({ type: "success", message: "Successfully fetched token metadata" });
    } catch (error) {
      notify({ type: "error", message: "Token metadata failed" });
    } finally {
      setIsLoading(false);
    }
  }, [connection]);

  const CloseModal = () => (
    <a
      onClick={() => setOpenTokenMetaData(false)}
      className="group mt-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white/20 backdrop-blur-2xl transition-all duration-500 hover:bg-blue-600/60"
    >
      <i className="text-2xl text-white group-hover:text-white">
        <AiOutlineClose />
      </i>
    </a>
  );

  return (
    <div className="fixed inset-0 z-40 overflow-y-auto scrollbar-hide">
      {isLoading && (
        <div className="absolute top-0 left-0 z-50 flex h-screen w-full items-center justify-center bg-black/[.3] backdrop-blur-[10px]">
          <ClipLoader />
        </div>
      )}

      <section className="flex w-full min-h-screen items-center py-6 px-0 lg:p-10">
        <div className="container">
          <div className="relative w-full rounded-2xl bg-default-950/40 backdrop-blur-2xl px-6 lg:px-10 my-6">
            <div className="grid gap-10 lg:grid-cols-2">

              <Branding
                image="auth-img"
                title="To Build your solana token creator"
                message="Try and create your first ever solana project, and if you want to master blockchain development then check the course"
              />

              {/* Right side panel */}
              {!tokenMetadata ? (
                <div className="lg:ps-0 flex h-full flex-col p-10 text-center ">
                  <div className="pb-10">
                    <a className="flex">
                      <img src="assets/images/logo1.png" className="h-10" alt="logo" />
                    </a>
                  </div>

                  <h4 className="mb-4 text-2xl font-bold text-white">Link to your token</h4>
                  <p className="text-default-300 mx-auto mb-5 max-w-sm">
                    Your Solana token is successfully created, check now explorer
                  </p>

                  <div className="flex items-start justify-center mb-6">
                    <img src="assets/images/logout.svg" alt="" className="h-40" />
                  </div>

                  <InputView
                    name="Token Address"
                    placeholder="address"
                    clickhandle={(e) => setTokenAddress(e.target.value)}
                  />
                  <button
                    onClick={() => getMetadata(tokenAddress)}
                    className="bg-primary-600/90 hover:bg-primary-600 group mt-5 inline-flex w-full items-center justify-center rounded-lg px-6 py-2 text-white backdrop-blur-2xl transition-all duration-500"
                  >
                    Get Token Metadata
                  </button>
                  <div className="mt-6 flex justify-center">
                    <CloseModal />
                  </div>

                </div>
              ) : (
                <div className="lg:ps-0 flex h-full flex-col p-10 text-center">
                  <div className="pb-10">
                    <a className="flex">
                      <img src={logo ?? "assets/images/logo1.png"} className="h-10" alt="logo" />
                    </a>
                  </div>

                  <InputView name="Token Address" placeholder={tokenMetadata.name} clickhandle={() => { }} />
                  <InputView name="Symbol" placeholder={tokenMetadata.symbol || "undefined"} clickhandle={() => { }} />
                  <InputView name="Token URI" placeholder={tokenMetadata.uri} clickhandle={() => { }} />

                  <div className="mb-6 text-center">
                    <a
                      href={tokenMetadata.uri}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-primary-600/90 hover:bg-primary-600 group mt-5 inline-flex w-full items-center justify-center rounded-lg px-6 py-2 text-white backdrop-blur-2xl transition-all duration-500"
                    >
                      OPEN YOUR URI
                    </a>
                  </div>

                  <CloseModal />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
