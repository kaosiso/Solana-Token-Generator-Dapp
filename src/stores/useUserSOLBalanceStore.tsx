import create, {State} from "zustand";
import { Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";


interface UserSOLBalanceStore extends State {
  balance: number;
  getUserSOLBalance: (publicKey: PublicKey, connection: Connection) => void;

}

const useUserSOLBalanceStore = create<UserSOLBalanceStore>((set, _get)=>({
  balance: 0,
  getUserSOLBalance: async (PublicKey, connection)=>{
    let balance = 0;

    try {
      balance = await connection.getBalance(PublicKey, "confirmed");
      balance = balance / LAMPORTS_PER_SOL;
    } catch (error) {
      console.log(error)
    }
    set((s)=> {
      s.balance = balance;
      console.log("Balance", balance)
    })
  }
}))

export default useUserSOLBalanceStore;