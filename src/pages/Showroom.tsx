import { useState } from "react";
import { useWeb3Modal } from "../hooks/useWeb3Modal";
import { useAddressVerification } from "../hooks/useAddressVerification";
import { VerificationResult } from "../components/VerificationResult";
import { ChainDataTable } from "../components/ChainDataTable";
import Modal from "../components/Modal";
import { ChainButton } from "../components/ChainButton";
import { LoaderWithTxHash } from "../components/LoaderWithTxHash";
import { chain } from "../config/chain";
import { VerificationButtons } from "../components/VerificationButtons";

export const Showroom = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [verificationResult, setVerificationResult] = useState<boolean | null>(
    null
  );
  const {
    network,
    setNetwork,
    signer,
    connectWallet,
    walletAddress,
    isChangingNetwork,
    isConnecting,
  } = useWeb3Modal(setVerificationResult);
  const { verifyAddressAndMintToken, transactionHash, addressBalance, errorMessage, setErrorMessage } =
    useAddressVerification(
      network,
      signer,
      setVerificationResult,
      setIsLoading
    );

  const onChainClick = async () => {
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
        <ChainButton
          key={chain.chainId}
          chain={chain}
          onChainClick={onChainClick}
          disabled={isConnecting}
        />
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
              text="Verifying address and minting token"
              transactionHash={transactionHash}
            />
          ) : isVerificationComplete ? (
            <VerificationResult
              verificationResult={verificationResult}
              addressBalance={addressBalance}
            />
          ) : (
            network && <VerificationButtons verifyAddressAndMintToken={verifyAddressAndMintToken} />
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
