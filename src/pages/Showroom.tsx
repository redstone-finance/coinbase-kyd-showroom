import { useState } from "react";
import { useWeb3Modal } from "../hooks/useWeb3Modal";
import { useAddressVerification } from "../hooks/useAddressVerification";
import { VerificationResult } from "../components/VerificationResult";
import { ChainDataTable } from "../components/ChainDataTable";
import Modal from "../components/Modal";
import { ActionButton } from "../components/ActionButton";
import { ChainButton } from "../components/ChainButton";
import { LoaderWithTxHash } from "../components/LoaderWithTxHash";
import { ChainDetails, chains } from "../config/chains";
import { VerificationButtons } from "../components/VerificationButtons";

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
  const { verifyAddress, transactionHash, errorMessage, setErrorMessage } =
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
          Please connect to verify your address
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
            <LoaderWithTxHash
              text="Verifying address"
              transactionHash={transactionHash}
            />
          ) : isVerificationComplete ? (
            <VerificationResult
              verificationResult={verificationResult}
              signer={signer}
              contractAddress={network!.contractAddress}
            />
          ) : (
            network && <VerificationButtons verifyAddress={verifyAddress} />
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
