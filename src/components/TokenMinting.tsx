import { Contract, Signer, utils } from "ethers";
import { ActionButton } from "./ActionButton";
import { abi } from "../config/contract.json";
import { useState } from "react";
import { LoaderWithText } from "./LoaderWithText";
import Modal from "./Modal";

interface Props {
  signer: Signer;
  contractAddress: string;
}

export const TokenMinting = ({ signer, contractAddress }: Props) => {
  const [isMinting, setIsMinting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [transactionHash, setTransactionHash] = useState("");
  const [addressBalance, setAddressBalance] = useState("");

  const onMintToken = async () => {
    setIsMinting(true);
    try {
      const contract = new Contract(contractAddress, abi, signer);
      const transaction = await contract.mintToken();
      setTransactionHash(transaction.hash);
      await transaction.wait();
      await getBalanceForAddress();
      setIsMinting(false);
    } catch (error: any) {
      if (
        error?.reason === "execution reverted: Account already minted token"
      ) {
        setErrorMessage("Account already minted token");
      } else {
        setErrorMessage(
          "There was problem with minting token. Please try again or contact RedStone team."
        );
      }
      setIsMinting(false);
    }
  };

  const getBalanceForAddress = async () => {
    const contract = new Contract(contractAddress, abi, signer);
    const address = await signer.getAddress();
    const balance = await contract.balanceOf(address);
    setAddressBalance(utils.formatUnits(balance, 18));
  };

  return (
    <div>
      {isMinting ? (
        <div>
          <LoaderWithText text="Minting token" />
          {transactionHash && (
            <p className="pt-2">
              {`Transaction hash: `}
              <a
                className="underline"
                href={`https://goerli.etherscan.io/tx/${transactionHash}`}
                target="blank"
                referrerPolicy="no-referrer"
              >
                {` ${transactionHash.slice(0, 8)}...${transactionHash.slice(
                  -6
                )}`}
              </a>
            </p>
          )}
        </div>
      ) : !!addressBalance ? (
        <table className="w-full table-auto border">
          <tbody className="text-md">
            <tr>
              <td className="py-3 px-6 text-left">KPT Token balance</td>
              <td className="py-3 px-6 text-right">{addressBalance}</td>
            </tr>
          </tbody>
        </table>
      ) : (
        <div>
          <p className="text-lg font-bold mb-6">
            Congrats!! Your address is verified, you can mint token
          </p>
          <ActionButton action={() => onMintToken()} text="Mint token" />
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
