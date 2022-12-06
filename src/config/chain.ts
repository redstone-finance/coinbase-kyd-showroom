import { utils } from "ethers";
import WalletIcon from "../assets/icons/wallet.png";

export interface ChainDetails {
  chainId: string;
  rpcUrls: string[];
  chainName: string;
  label: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  blockExplorerUrls: string[];
  contractAddress: string;
  contractExplorerUrl: string;
  logo?: any;
}

export const chain = {
  chainId: utils.hexValue(5),
  rpcUrls: ["https://goerli.infura.io/v3/"],
  chainName: "Goerli Test Network",
  label: "Connect your wallet",
  nativeCurrency: {
    name: "GoerliETH",
    symbol: "GoerliETH",
    decimals: 18,
  },
  blockExplorerUrls: ["https://goerli.etherscan.io/"],
  contractAddress: "0xf9fd9413e6144ea666d025ecfcafc936224ab6a9",
  contractExplorerUrl:
    "https://goerli.etherscan.io/address/0xf9fd9413e6144ea666d025ecfcafc936224ab6a9",
  logo: WalletIcon,
};
