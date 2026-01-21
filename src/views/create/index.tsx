
import React, { FC, useCallback, useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import {
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction
} from '@solana/web3.js';
import {
  MINT_SIZE,
  TOKEN_PROGRAM_ID,
  createInitializeMintInstruction,
  getMinimumBalanceForRentExemptMint,
  getAssociatedTokenAddress,
  createMintToInstruction,
  createAssociatedTokenAccountInstruction
} from '@solana/spl-token';
import {
  PROGRAM_ID,
  createCreateMetadataAccountV3Instruction
} from '@metaplex-foundation/mpl-token-metadata';
import axios from 'axios';
import { notify } from 'utils/notifications';
import { ClipLoader } from 'react-spinners';
import { useNetworkConfiguration } from 'contexts/NetworkConfigurationProvider';

import { AiOutlineClose } from 'react-icons/ai';
import CreateSVG from '../../components/SVG/CreateSVG';
import { InputView } from 'views';
import Branding from 'components/Branding';

interface CreateViewProps {
  setOpenCreateModal: (open: boolean) => void;
}

interface TokenState {
  name: string;
  symbol: string;
  decimals: string;
  amount: string;
  image: string;
  description: string;
}

export const CreateView: FC<CreateViewProps> = ({ setOpenCreateModal }) => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const { networkConfiguration } = useNetworkConfiguration();

  const [token, setToken] = useState<TokenState>({
    name: '',
    symbol: '',
    decimals: '',
    amount: '',
    image: '',
    description: ''
  });

  const [tokenMintAddress, setTokenMintAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleFormFieldChange = (
    field: keyof TokenState,
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setToken(prev => ({ ...prev, [field]: e.target.value }));
  };

  const uploadImagePinata = async (file: File): Promise<string | undefined> => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await axios.post(
        'https://api.pinata.cloud/pinning/pinFileToIPFS',
        formData,
        {
          headers: {
            pinata_api_key: 'd4edf4259148cfc2948d',
            pinata_secret_api_key: '150e199067ea8ff67552a669fc106d67cc397f3b0a96d496d74ec6ce5f51fea5',
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      return `https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`;
    } catch {
      notify({ type: 'error', message: 'Image Upload Failed' });
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = await uploadImagePinata(file);
    if (url) setToken(prev => ({ ...prev, image: url }));
  };

  const uploadMetadata = async (): Promise<string | undefined> => {
    try {
      const res = await axios.post(
        'https://api.pinata.cloud/pinning/pinJSONToIPFS',
        {
          name: token.name,
          symbol: token.symbol,
          description: token.description,
          image: token.image
        },
        {
          headers: {
            pinata_api_key: 'd4edf4259148cfc2948d',
            pinata_secret_api_key: '150e199067ea8ff67552a669fc106d67cc397f3b0a96d496d74ec6ce5f51fea5',
            'Content-Type': 'application/json'
          }
        }
      );

      return `https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`;
    } catch {
      notify({ type: 'error', message: 'Metadata Upload Failed' });
    }
  };

  const createToken = useCallback(async () => {
    if (!publicKey) {
      notify({ type: 'error', message: 'Wallet not connected' });
      return;
    }

    if (
      !token.name ||
      !token.symbol ||
      !token.decimals ||
      !token.amount ||
      !token.image ||
      !token.description
    ) {
      notify({ type: 'error', message: 'Please fill all fields' });
      return;
    }

    const decimals = Number(token.decimals);
    const amount = Number(token.amount);

    if (isNaN(decimals) || isNaN(amount) || decimals < 0 || amount <= 0) {
      notify({ type: 'error', message: 'Invalid decimals or amount' });
      return;
    }

    setIsLoading(true);

    try {
      const mintKeypair = Keypair.generate();
      const lamports = await getMinimumBalanceForRentExemptMint(connection);
      const ata = await getAssociatedTokenAddress(mintKeypair.publicKey, publicKey);

      const metadataUrl = await uploadMetadata();
      if (!metadataUrl) throw new Error('Metadata failed');

      const metadataPDA = PublicKey.findProgramAddressSync(
        [
          Buffer.from('metadata'),
          PROGRAM_ID.toBuffer(),
          mintKeypair.publicKey.toBuffer()
        ],
        PROGRAM_ID
      )[0];

      const tx = new Transaction().add(
        SystemProgram.createAccount({
          fromPubkey: publicKey,
          newAccountPubkey: mintKeypair.publicKey,
          space: MINT_SIZE,
          lamports,
          programId: TOKEN_PROGRAM_ID
        }),
        createInitializeMintInstruction(
          mintKeypair.publicKey,
          decimals,
          publicKey,
          publicKey
        ),
        createAssociatedTokenAccountInstruction(
          publicKey,
          ata,
          publicKey,
          mintKeypair.publicKey
        ),
        createMintToInstruction(
          mintKeypair.publicKey,
          ata,
          publicKey,
          amount * Math.pow(10, decimals)
        ),
        createCreateMetadataAccountV3Instruction(
          {
            metadata: metadataPDA,
            mint: mintKeypair.publicKey,
            mintAuthority: publicKey,
            payer: publicKey,
            updateAuthority: publicKey
          },
          {
            createMetadataAccountArgsV3: {
              data: {
                name: token.name,
                symbol: token.symbol,
                uri: metadataUrl,
                creators: null,
                sellerFeeBasisPoints: 0,
                uses: null,
                collection: null
              },
              isMutable: false,
              collectionDetails: null
            }
          }
        )
      );

      const sig = await sendTransaction(tx, connection, {
        signers: [mintKeypair]
      });

      setTokenMintAddress(mintKeypair.publicKey.toString());
      notify({ type: 'success', message: 'Token created', txid: sig });
    } catch (err) {
      console.error(err);
      notify({ type: 'error', message: 'Token creation failed' });
    } finally {
      setIsLoading(false);
    }
  }, [token, publicKey, connection, sendTransaction]);

  // UI RENDER — unchanged
   return (
   <>
    <div className="fixed inset-0 z-40 overflow-y-auto scrollbar-hide">
      {isLoading && (
        <div className="absolute top-0 left-0 z-50 flex h-screen w-full items-center justify-center bg-black/[.3] backdrop-blur-[10px]">
          <ClipLoader />
        </div>
      )}
      {!tokenMintAddress ? (
        <section className="flex w-full min-h-screen items-center py-6 px-0 lg:p-10">
          <div className="container">
            <div className="relative w-full rounded-2xl bg-default-950/40 backdrop-blur-2xl px-6 lg:px-10 my-6">

              <div className="rounded-2xl">
                <div className="grid gap-10 lg:grid-cols-2">

                  {/* LEFT COLUMN: Upload & Description */}
                  <div className="py-4 pt-10 lg:pt-10 ps-4 flex flex-col justify-center">
                    <div className="upload relative w-full rounded-xl border-2 border-dashed border-white/20 bg-white/5 p-5 hover:border-white/40 transition-colors">
                      {token.image ? (
                        <div className="flex justify-center">
                          <img
                            src={token.image}
                            alt="token"
                            className="w-32 h-32 object-cover rounded-lg"
                          />
                        </div>
                      ) : (
                        <label htmlFor="file" className="custom-file-upload cursor-pointer">
                          <div className="icon flex justify-center mb-2">
                            <CreateSVG />
                          </div>
                          <div className="text text-center">
                            <span className="text-sm text-white/60">Click to upload image</span>
                          </div>
                          <input
                            type="file"
                            id="file"
                            onChange={handleImageChange}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>

                    <textarea
                      rows={4}
                      onChange={(e) => handleFormFieldChange('description', e)}
                      className="border-default-200 relative mt-32 block w-full rounded-lg border border-white/10 bg-white/5 py-3 px-4 text-white/80 focus:border-white/25 focus:ring-transparent focus:outline-none"
                      placeholder="Description of your token"
                    />
                  </div>

                  {/* RIGHT COLUMN: Token Details */}
                  <div className="flex flex-col justify-center p-6 lg:p-10">
                    <h4 className="mb-2 text-2xl font-bold text-white">
                      Solana Token Creator
                    </h4>
                    <p className="mb-6 max-w-sm text-default-300">
                      Kindly provide all the details about your token
                    </p>

                    <div className="space-y-4">
                      <InputView
                        name="Name"
                        placeholder="Token name"
                        clickhandle={(e) => handleFormFieldChange('name', e)}
                      />
                      <InputView
                        name="Symbol"
                        placeholder="Token symbol"
                        clickhandle={(e) => handleFormFieldChange('symbol', e)}
                      />
                      <InputView
                        name="Decimals"
                        placeholder="Decimals"
                        clickhandle={(e) => handleFormFieldChange('decimals', e)}
                      />
                      <InputView
                        name="Amount"
                        placeholder="Initial supply"
                        clickhandle={(e) => handleFormFieldChange('amount', e)}
                      />
                    </div>

                    {/* Create Token Button */}
                   <button
                      onClick={createToken}
                      disabled={isLoading}
                      className={`mt-8 mb-2 w-full border border-white rounded-lg bg-primary-600/90 py-3 text-white font-semibold transition hover:bg-primary-600 hover:border-white/40
                        ${isLoading ? "cursor-not-allowed opacity-60" : ""}
                      `}
                    >
                      {isLoading ? "Creating..." : "Create Token"}
                    </button>



                    {/* Close Button (X) under Create Token */}
                    <button
                      onClick={() => setOpenCreateModal(false)}
                      className="mt-2 w-full bg-white/10 hover:bg-white/20 text-white rounded-lg py-2 font-medium transition"
                    >
                      <AiOutlineClose className="inline-block mr-2 text-xl" />
                    </button>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className="flex w-full min-h-screen items-center py-6 px-0 lg:p-10">
          <div className="container">
            <div className="relative w-full rounded-2xl bg-default-950/40 backdrop-blur-2xl px-6 lg:px-10 my-6">
              <div className="grid gap-10 lg:grid-cols-2">

                <Branding image="auth-img" title="To Build your solana token creator" message="Try and create your first ever solana project, and if you want to master blockchain development then check the course" />

                {/* second  */}
                <div className="lg:ps-0 flex h-full flex-col p-10">
                  <div className="pb-10">
                    <a className='flex'><img src="assets/images/logo1.png" className='h-10' alt="logo" /></a>
                  </div>
                  <div className="my-auto pb-6 text-center ">
                    <h4 className='mb-4 text-2xl font-bold text-white' >
                      Link to your token
                    </h4>
                    <p className='text-default-300 mx-auto mb-5 max-w-sm ' >
                      Your Solana token is successfully created, check now explorer

                    </p>
                    <div className="flex items-start justify-center">
                      <img src={token.image || "assets/images/logo1.png"} alt="" className='h-40' />
                    </div>

                    <div className="mt-5 w-full text-center">
                      <p className='text-default-300 text-base font-medium leading-6' >
                        <InputView name={"Token Address"} placeholder={tokenMintAddress} />
                        <span
                          className="cursor-pointer text-blue-400 hover:underline"
                          onClick={() => {
                            if (tokenMintAddress) {
                              navigator.clipboard.writeText(tokenMintAddress);
                              alert("Token address copied!"); // optional notification
                            }
                          }}
                        >
                          Copy
                        </span>


                      </p>

                      <div className="mb-6 text-center">
                        <a
                          href={`https://explorer.solana.com/address/${tokenMintAddress}?cluster=${networkConfiguration}`}
                          target="_blank"
                          rel="noreferrer"
                          className="bg-primary-600/90 hover:bg-primary-600 group mt-5 inline-flex w-full items-center justify-center rounded-lg px-6 py-2 text-white backdrop-blur-2xl transition-all duration-500"
                        >
                          <span className='fw-bold' >
                            View on Solana
                          </span>
                        </a>
                      </div>
                      <div className="">
                          <button
                      onClick={() => setOpenCreateModal(false)}
                      className="mt-2 w-full bg-white/10 hover:bg-white/20 text-white rounded-lg py-2 font-medium transition"
                    >
                      <AiOutlineClose className="inline-block mr-2 text-xl" />
                    </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

      )}
    </div>
   </>
  );
};

export default CreateView;



