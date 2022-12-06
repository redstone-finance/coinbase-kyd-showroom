import { useState, Dispatch, SetStateAction } from "react";
import { providers, Contract, utils } from "ethers";
import { WrapperBuilder } from "@redstone-finance/evm-connector";
import { ScoreType } from "redstone-protocol";
import { ChainDetails } from "../config/chain";
import { abi } from "../config/contract.json";

export const useAddressVerification = (
  network: ChainDetails | null,
  signer: providers.JsonRpcSigner | null,
  setVerificationResult: Dispatch<SetStateAction<boolean | null>>,
  setIsLoading: Dispatch<SetStateAction<boolean>>
) => {
  const [errorMessage, setErrorMessage] = useState("");
  const [transactionHash, setTransactionHash] = useState("");
  const [addressBalance, setAddressBalance] = useState("");

  const verifyAddressAndMintToken = async ({
    requiredAddressLevel,
  }: {
    requiredAddressLevel: number;
  }) => {
    if (network && signer) {
      try {
        setIsLoading(true);
        const contractAddress = network.contractAddress;
        if (contractAddress) {
          const contract = new Contract(contractAddress, abi, signer);
          const transactionData = await verifyAddressAndMintTokenInContract(
            contract,
            requiredAddressLevel
          );
          const verificationResult = getVerificationResult(transactionData);
          setVerificationResult(!!verificationResult);
          const address = await signer.getAddress();
          const balance = await contract.balanceOf(address);
          setAddressBalance(utils.formatUnits(balance, 18));
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

  const verifyAddressAndMintTokenInContract = async (
    contract: Contract,
    requiredAddressLevel: number
  ) => {
    try {
      const nodeURL = process.env.NODE_URL;
      if (!nodeURL) {
        handleError();
      } else {
        const wrappedContract = WrapperBuilder.wrap(
          contract
        ).usingOnDemandRequest([nodeURL], ScoreType.coinbaseKYD);
        const transaction = await wrappedContract.verifyAddressAndMintToken(
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
    const [verificationResult] = contractInterface.decodeFunctionData(
      "verifyAddressAndMintToken",
      transactionData
    );
    return utils.formatUnits(verificationResult, 0);
  };

  return {
    verifyAddressAndMintToken,
    transactionHash,
    addressBalance,
    errorMessage,
    setErrorMessage,
  };
};
