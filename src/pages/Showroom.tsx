import { useWeb3Modal } from "../hooks/useWeb3Modal";
import { useAddressVerification } from "../hooks/useAddressVerification";
import { LoaderWithText } from "../components/LoaderWithText";
import { ActionButton } from "../components/ActionButton";
import Modal from "../components/Modal";
import { ChainButton } from "../components/ChainButton";
import { ChainDataTable } from "../components/ChainDataTable";
import { ChainDetails, chains } from "../config/chains";
import { VerificationResult } from "../components/VerificationResult";
import { useState } from "react";

const chainsArray = Object.values(chains);

export const Showroom = () => {
  const [isLoading, setIsLoading] = useState(false);
  const {
    verificationResult,
    setVerificationResult,
    network,
    setNetwork,
    signer,
    connectWallet,
    walletAddress,
    isChangingNetwork,
    isConnecting,
  } = useWeb3Modal();
  const { errorMessage, setErrorMessage, verifyAddress } =
    useAddressVerification(
      network,
      signer,
      setVerificationResult,
      setIsLoading
    );

  const onChainClick = async (chain: ChainDetails) => {
    setNetwork(chain);
    if (!signer) {
      await connectWallet();
    }
  };

  const isVerificationComplete = verificationResult !== null;

  return (
    <div className="flex justify-center items-center flex-col">
      {!network && (
        <p className="mt-10 mb-0 text-lg font-bold">
          Please select a chain to verify your address
        </p>
      )}
      <div className="w-3/4 flex flex-wrap justify-center gap-3 px-10 mt-10">
        {chainsArray.map((chain) => (
          <ChainButton
            key={chain.chainId}
            chain={chain}
            onChainClick={onChainClick}
            disabled={isConnecting}
          />
        ))}
      </div>
      {isChangingNetwork && signer && (
        <p className="mt-10 mb-0 text-lg font-bold">
          Please change network in MetaMask
        </p>
      )}
      {isConnecting && (
        <p className="mt-10 mb-0 text-lg font-bold">Please login to MetaMask</p>
      )}
      {signer && !isChangingNetwork && (
        <div className="flex w-full justify-center items-center mt-8 flex-col">
          {network && (
            <ChainDataTable walletAddress={walletAddress} network={network} />
          )}
          {isLoading ? (
            <LoaderWithText text={"Verifying address"} />
          ) : isVerificationComplete ? (
            <VerificationResult
              verificationResult={verificationResult}
              signer={signer}
              contractAddress={network!.contractAddress}
            />
          ) : (
            network && (
              <ActionButton action={verifyAddress} text="Verify address" />
            )
          )}
        </div>
      )}
      {!!errorMessage && (
        <Modal
          closeModal={() => setErrorMessage("")}
          title="Problem with contract interaction"
          text={errorMessage}
        />
      )}
    </div>
  );
};
