import React, {FC, useCallback, useState, useEffect} from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import {Keypair, PublicKey, SystemProgram, Transaction} from "@solana/web3.js"
import { MINT_SIZE, TOKEN_PROGRAM_ID, createInitializeMintInstruction, getMinimumBalanceForRentExemptMint, getAssociatedTokenAddress, createMintToInstruction, createAssociatedTokenAccountInstruction } from '@solana/spl-token';
import { PROGRAM_ID, createCreateMetadataAccountV3Instruction, createCreateMetadataAccountInstruction } from '@metaplex-foundation/mpl-token-metadata';
import axios from 'axios';
import { notify } from 'utils/notifications';
import { ClipLoader } from 'react-spinners';
import { useNetworkConfiguration } from 'contexts/NetworkConfigurationProvider';

import {AiOutlineClose} from "react-icons/ai"
import CreateSVG from "../../components/SVG/CreateSVG"
import Branding from 'components/Branding';
import { InputView } from 'views';




export const CreateView: FC = ({setOpenCreateModal}) => {
  const {connection} = useConnection();
  const {PublicKey, sendTransaction} = useWallet;
  const {networkConfiguration} = useNetworkConfiguration();

  const [tokenUri, setTokenUri] = useState("");
  const [tokenMintAddress, setTokenMintAddress] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const [Token, setToken] = useState({
    name: "",
    symbol: "",
    decimals: "",
    amount: "",
    Image:  "",
    description: ""
  })

  const handleFormFieldChange = (fieldName, e) => {
    setToken({...token, [fieldName]: e.target.value})
  }

  const createToken = useCallback(
    async(token)=> {
      const lamports = await getMinimumBalanceForRentExemptMint(connection);
      const mintKeyPair = Keypair.generate();
      const tokenATA = getAssociatedTokenAddress(
        mintKeyPair.publicKey, publicKey
      );

      try {
        const metadataUrl = await uploadMetadata(token);
        console.log(metadataUrl);

        const createMetadataInstruction = createCreateMetadataAccountV3Instruction({
          metadata: PublicKey.findProgramAddressSync([
            Buffer.from("metadata"),
            PROGRAM_ID.toBuffer(),
            mintKeyPair.publicKey.toBuffer()
          ],
        PROGRAM_ID) [0],
        mint: mintKeyPair.publicKey,
        mintAuthority: publicKey,
        payer: PublicKey,
        updateAuthority: PublicKey,

        },{
          createMetadataAccountArgsV3: {
            data: {
              name: token.name,
              symbol: token.symbol,
              uri: metadataUrl,
              creators: null,
              sellerFeeBasisPoints: 0,
              uses: null,
              collection: null,
            },
            isMutable: false,
            collectionDetails: null
          }
        })

        const createNewTokenTransaction = new Transaction().add(
          SystemProgram.createAccount({
            fromPubkey: PublicKey,
            newAccountPubkey: mintKeyPair.publicKey,
            space: MINT_SIZE,
            lamports: lamports,
            programId: TOKEN_PROGRAM_ID
          }),
          createInitializeMintInstruction(
            mintKeyPair.publicKey,
            Number(token.decimals),
            publicKey,
            publicKey,
            TOKEN_PROGRAM_ID
          ), 
          createAssociatedTokenAccountInstruction(
            publicKey,
            tokenATA,
            publicKey,
            mintKeyPair.publicKey
          ),
          createMintToInstruction(
            mintKeyPair.publicKey,
            tokenATA,
            publicKey,
            Number(token.amount) * Math.pow(10, Number(token.decimals))
          ),
          createMetadataInstruction
        )

        const signature = await sendTransaction(
          createNewTokenTransaction,
          connection, {
            signers: [mintKeyPair]
          }
        );

        setTokenMintAddress(mintKeyPair.publicKey.toString());
        notify({
          type: "success",
          message: "Token creation successfully",
          txid: signature
        })
      } catch (error: any) {
        notify({type: "error", message: "Token Creation Failed, try later"})
        
      }
      setIsLoading(false)
    }
  )

  //ImageUpload
  const handleImageChange = async(event)=> {
    const file = event.target.files[0];

    if(file) {
      const imgUrl = await uploadImagePinata(file);
      setToken({...token, image: imgUrl})
    }
  }

  const uploadImagePinata = async(file)=> {
    if(file) {
      try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await axios({
          method: "post",
          url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
          data: formData,
          headers: {
            pinata_api_key: "",
            pinata_secret_api_key: "",
            "Content-Type": "multipart/form-data"
          }
        })

        const ImgHash = `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
        return ImgHash
      } catch (error) {
       notify({type: "error": message: "Upload Image Failed"})

      }
      setIsLoading(false)
    }
  }

  // Metadata 
  const uploadMetadata = async(token)=> {
    setIsLoading(true);
    const {name, symbol, description, image} = token;
    if(!name || !symbol || !description || !image) {
      return 
        notify({type: "error", message:"Data is Missing "})
    }
  }

  const data = JSON.stringify({
    name: name,
    symbol: Symbol,
    description: description,
    image: image,
  })

  try {

       const response = await axios({
          method: "POST",
          url: "https://api.pinata.cloud/pinning/pinJSONToIPFS",
          data: data,
          headers: {
            pinata_api_key: "",
            pinata_secret_api_key: "",
            "Content-Type": "application/json"
          }
        })

        const url = `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
        return url
      } catch (error: any) {
        notify({type: "error", message:"Upload to Pinnata Json Failed"})
      }
      setIsLoading(false)
    }
  
    
  } catch (error) {
    console.log(error)
  }



  return (
    <div>index</div>
  )
}

export default index