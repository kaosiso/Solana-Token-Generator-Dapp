import React, { FC } from "react";
import { LuArrowRightFromLine } from "react-icons/lu";
import { MdGeneratingTokens, MdToken } from "react-icons/md";
import { RiTokenSwapFill } from "react-icons/ri";
import { RxTokens } from "react-icons/rx";

interface FeatureViewProps {
  setOpenAirdrop: (value: boolean) => void;
  setOpenContact: (value: boolean) => void;
  setOpenCreateModal: (value: boolean) => void;
  setOpenSendTransaction: (value: boolean) => void;
  setOpenTokenMetaData: (value: boolean) => void;
}

export const FeatureView: FC<FeatureViewProps> = ({
  setOpenAirdrop,
  setOpenContact,
  setOpenCreateModal,
  setOpenSendTransaction,
  setOpenTokenMetaData,
}) => {
  const features = [
    {
      name: "Token Generator",
      icon: <MdGeneratingTokens />,
      description:
        "Start working with Solana token creator, it allows you to create solana token by creating, deploying, airdrop, transferring and updating token",
      action: setOpenCreateModal,
    },
    {
      name: "Get Airdrop",
      icon: <MdToken />,
      description:
        "Start working with Solana token creator, it allows you to create solana token by creating, deploying, airdrop, transferring and updating token",
      action: setOpenAirdrop,
    },
    {
      name: "Transfer Sol",
      icon: <RiTokenSwapFill />,
      description:
        "Start working with Solana token creator, it allows you to create solana token by creating, deploying, airdrop, transferring and updating token",
      action: setOpenSendTransaction,
    },
    {
      name: "Token Metadata",
      icon: <RxTokens />,
      description:
        "Start working with Solana token creator, it allows you to create solana token by creating, deploying, airdrop, transferring and updating token",
      action: setOpenTokenMetaData,
    },
  ];

  return (
    <section  id="features" className="py-20">
      <div className="container">
        <div className="mb-10 flex items-end justify-between">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-medium capitalize text-white">
              Choose Solana Blockchain generator
            </h2>
            <p className="text-default-200 text-sm font-medium">
              Now you can create Solana Token <br /> without code instantly
            </p>
          </div>
        </div>

        <div className="bg-default-950/40 flex flex-wrap items-center rounded-xl backdrop-blur-3xl">
          {features.map((list, index) => (
            <div
              key={list.name}
              className={`w-auto grow border-b border-white/10 md:w-1/2 ${
                index === 0
                  ? "md:border-e"
                  : index === 2
                  ? "md:border-e md:border-b-0"
                  : ""
              }`}
            >
              <div className="p-8 sm:p-10">
                <div className="bg-primary/10 text-primary mb-10 inline-flex h-16 w-16 items-center justify-center rounded-xl">
                  {list.icon}
                </div>

                <h2 className="mb-4 text-2xl font-medium text-white">
                  {list.name}
                </h2>

                <p className="text-default-200 mb-6 text-base">
                  {list.description}
                </p>

                <button
                  onClick={() => list.action(true)}
                  className="hover:bg-primary inline-flex items-center justify-center gap-2 rounded-full border border-white/10 px-6 py-2 text-white transition-all duration-300"
                >
                  Use Tools <LuArrowRightFromLine />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureView;
