import React, { FC } from "react";
import { LuArrowRightFromLine } from "react-icons/lu";
import { MdGeneratingTokens } from "react-icons/md";
import {IoIosArrowRoundForward} from "react-icons/io";

interface ToolViewProps {
  setOpenAirdrop: (value: boolean) => void;
  setOpenContact: (value: boolean) => void;
  setOpenCreateModal: (value: boolean) => void;
  setOpenSendTransaction: (value: boolean) => void;
  setOpenTokenMetaData: (value: boolean) => void;
}

export const ToolView: FC<ToolViewProps> = ({
  setOpenAirdrop,
  setOpenContact,
  setOpenCreateModal,
  setOpenSendTransaction,
  setOpenTokenMetaData,
}) => {
  const tools = [
    { name: "Create Token", icon: <MdGeneratingTokens />, action: setOpenCreateModal },
    { name: "Token Metadata", icon: <MdGeneratingTokens />, action: setOpenTokenMetaData },
    { name: "Contact Us", icon: <MdGeneratingTokens />, action: setOpenContact },
    { name: "Airdrop", icon: <MdGeneratingTokens />, action: setOpenAirdrop },
    { name: "Send Transactions", icon: <MdGeneratingTokens />, action: setOpenSendTransaction },
    { name: "Koko Tokens", icon: <MdGeneratingTokens />, action: setOpenSendTransaction },
    { name: "Biggy Tokens", icon: <MdGeneratingTokens />, action: setOpenSendTransaction },
    { name: "Solo Tokens", icon: <MdGeneratingTokens />, action: setOpenSendTransaction },
  ];

  const colors = [
    "text-red-500",
    "text-sky-500",
    "text-indigo-500",
    "text-yellow-500",
    "text-teal-500",
  ];

  return (
    <section id="tools" className="py-20">
      <div className="container">
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <h2 className="mb-4 text-3xl font-medium text-white">
            Solana Powerful Tools
          </h2>
          <p className="text-default-200 text-sm font-medium">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {tools.map((tool, index) => (
            <div
              key={tool.name}
              onClick={() => tool.action(true)}
              className="cursor-pointer bg-default-950/40 rounded-xl backdrop-blur-3xl hover:scale-105 transition"
            >
              <div className="p-6">
                <div className="flex items-center gap-4">
                  <div
                    className={`inline-flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/20 ${colors[index % colors.length]}`}
                  >
                    <i data-lucide="dribble" className="" >
                    {tool.icon}

                    </i>
                  </div>
                  <h3 className="text-default-200 text-xl font-medium">{tool.name}</h3>
                </div>
                <a className="text-primary group relative inline-flex items-center gap-2 ">
                  <span className="bg-primary/80 absolute -bottom-0 h-px w-7/12 rounded transition-all duration-500 group-hover:w-full " >


                  </span>
                  Select & try
                  <i data-lucide={"move-right"}>
                    <LuArrowRightFromLine/>
                  </i>
                </a>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-10 flex justify-center">
          <a className="hover:b-primary-hover bg-primary inline-flex items-center justify-center gap-2 rounded-full px-6
                       py-2 text-white transition-all duration-500">More Tools</a>
                       <i>
<IoIosArrowRoundForward/>
                       </i>
        </div>
      </div>
    </section>
  );
};
