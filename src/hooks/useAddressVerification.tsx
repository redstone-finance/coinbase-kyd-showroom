import { useState, Dispatch, SetStateAction } from "react";
import { providers, Contract, utils } from "ethers";
import { WrapperBuilder } from "@redstone-finance/evm-connector";
import { ScoreType } from "redstone-protocol";
import { ChainDetails } from "../config/chains";
import { abi } from "../config/contract.json";

export const useAddressVerification = (
  network: ChainDetails | null,
  signer: providers.JsonRpcSigner | null,
  setVerificationResult: Dispatch<SetStateAction<boolean | null>>,
  setIsLoading: Dispatch<SetStateAction<boolean>>
) => {
  const [errorMessage, setErrorMessage] = useState("");
  const [transactionHash, setTransactionHash] = useState("");

  const verifyAddress = async ({
    requiredAddressLevel,
  }: {
    requiredAddressLevel: number;
  }) => {
    if (network && signer) {
      try {
        setIsLoading(true);
        const contractAddress = network.contractAddress;
        if (contractAddress) {
          const transactionData = await verifyAddressInContract(
            contractAddress,
            signer,
            requiredAddressLevel
          );
          const verificationResult = getVerificationResult(transactionData);
          setVerificationResult(!!verificationResult);
          setIsLoading(false);
        }
      } catch (error) {
        console.error(error);
        handleError();
      }
    } else {
      handleError();
    }
  };

  const verifyAddressInContract = async (
    contractAddress: string,
    signer: providers.JsonRpcSigner,
    requiredAddressLevel: number
  ) => {
    try {
      const contract = new Contract(contractAddress, abi, signer);
      const nodeURL = process.env.NODE_URL;
      if (!nodeURL) {
        handleError();
      } else {
        const wrappedContract = WrapperBuilder.wrap(
          contract
        ).usingOnDemandRequest([nodeURL], "coinbase-kyd" as any);
        const transaction = await wrappedContract.verifyAddress(
          requiredAddressLevel,
          {
            gasLimit: 300000,
          }
        );
        setTransactionHash(transaction.hash);
        await transaction.wait();
        return transaction.data;
      }
    } catch (error) {
      setVerificationResult(false);
      setIsLoading(false);
    }
  };

  const handleError = () => {
    setIsLoading(false);
    setVerificationResult(null);
    setErrorMessage(
      "There was problem with verification address. Please try again or contact RedStone team"
    );
  };

  const getVerificationResult = (transactionData?: string) => {
    if (!transactionData) {
      return;
    }
    const contractInterface = new utils.Interface(abi);
    const [verificationResult] = contractInterface
      .decodeFunctionData("verifyAddress", transactionData);
    return utils.formatUnits(verificationResult, 0);
  }

  return {
    verifyAddress,
    transactionHash,
    errorMessage,
    setErrorMessage,
  };
};
