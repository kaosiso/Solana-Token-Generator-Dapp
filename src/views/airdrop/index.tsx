import React, { FC, useEffect, useCallback } from "react";
import useUserSOLBalanceStore from "stores/useUserSOLBalanceStore";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL, TransactionSignature } from "@solana/web3.js";
import { notify } from "utils/notifications";
import { AiOutlineClose } from "react-icons/ai";
import Branding from "components/Branding";

// Fixed the prop name to match common usage or your intended setter
interface AirdropViewProps {
  setOpenAirdrop: (open: boolean) => void;
}

export const AirdropView: FC<AirdropViewProps> = ({ setOpenAirdrop }) => {
  const { connection } = useConnection();
  const { publicKey } = useWallet();

  const balance = useUserSOLBalanceStore((s) => s.balance);
  const { getUserSOLBalance } = useUserSOLBalanceStore();

  
  useEffect(() => {
    if (publicKey) {
      getUserSOLBalance(publicKey, connection);
    }
  }, [publicKey, connection, getUserSOLBalance]);

  const onClick = useCallback(async () => {
    if (!publicKey) {
      notify({
        type: "error",
        message: "Sorry Error",
        description: "Wallet not Connected",
      });
      return;
    }

    let signature: TransactionSignature = "";
    try {
      signature = await connection.requestAirdrop(publicKey, LAMPORTS_PER_SOL);
      
      notify({
        type: "success",
        message: "You have successfully claimed 1 Airdrop",
        txid: signature,
      });

      const latestBlockHash = await connection.getLatestBlockhash();
      await connection.confirmTransaction({
        blockhash: latestBlockHash.blockhash,
        lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
        signature,
      });

      getUserSOLBalance(publicKey, connection);
    } catch (error: any) {
      notify({
        type: "error",
        message: "Airdrop failed",
        description: error?.message,
        txid: signature,
      });
    }
  }, [publicKey, connection, getUserSOLBalance]);

  const CloseModal = () => (
    <button
      onClick={() => setOpenAirdrop(false)}
      className="group mt-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white/20 backdrop-blur-2xl transition-all duration-500 hover:bg-blue-600/60"
    >
      <i className="text-2xl text-white">
        <AiOutlineClose />
      </i>
    </button>
  );

  return (
    <section className="fixed inset-0 z-50 flex h-full w-full items-start justify-center overflow-y-auto bg-black/50 py-6 px-0 lg:p-10">
      <div className="container">
        <div className="relative w-full rounded-2xl bg-default-950/40 backdrop-blur-2xl px-6 lg:px-10 my-6">
          <div className="grid gap-10 lg:grid-cols-2">
            <Branding
              image="auth-img"
              title="To Build your Solana token creator"
              message="Try and create your first ever Solana project, and if you want to master blockchain development then check the course"
            />

            <div className="lg:ps-0 flex h-full flex-col p-10 text-center">
              <div className="pb-10">
                <div className="flex justify-center lg:justify-start">
                  <img src="assets/images/logo1.png" className="h-10" alt="logo" />
                </div>
              </div>

              <h4 className="mb-4 text-2xl font-bold text-white">
                {publicKey ? (
                  <p>SOL Balance: {(balance || 0).toLocaleString()}</p>
                ) : (
                  <p>Wallet Not Connected</p>
                )}
              </h4>

              <p className="text-default-300 mx-auto mb-5 max-w-sm">
                Now you can claim your 1 Airdrop and use to test and create token in our platform.
              </p>

              <div className="flex items-start justify-center">
                <img src="assets/images/logout.svg" alt="" className="h-40" />
              </div>

              <div className="mb-6 text-center">
                <button
                  onClick={onClick}
                  disabled={!publicKey}
                  className="bg-primary-600/90 border border-white/30 hover:bg-primary-600 group mt-5 inline-flex w-full items-center justify-center rounded-lg px-6 py-2 text-white backdrop-blur-2xl transition-all duration-500 disabled:opacity-50"
                >
                  <span className="font-bold">AirDrop 1</span>
                </button>
              </div>

              <div className="mt-6 flex justify-center">
                <CloseModal />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AirdropView;