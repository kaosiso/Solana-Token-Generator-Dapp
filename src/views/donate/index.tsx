import React, {FC, useEffect, useCallback, useState} from "react";
import useUserSOLBalanceStore from "stores/useUserSOLBalanceStore";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL, TransactionSignature, PublicKey, Transaction, SystemProgram  } from "@solana/web3.js";
import { notify } from "utils/notifications";
import { AiOutlineClose } from "react-icons/ai";


// internal import 
import { InputView } from "views/input";
import Branding from "components/Branding";


const balance = useUserSOLBalanceStore((s) => s.balance);
const {getUserSOLBalance} = useUserSOLBalanceStore();

useEffect(()=>{
  if(WalletAccountError.pub)
})

export const DonateView = ({
  setOpenSendTransaction
}) => {
  return <div className=""></div>
}