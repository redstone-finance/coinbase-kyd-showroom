import { utils } from "ethers";
import WalletIcon from "../assets/icons/wallet.png";

export type Chains = { [chainId in number]: ChainDetails };

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

export const chains: Chains = {
  [5]: {
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
    contractAddress: "0x136c7a2a012e479f0fc93288fbd73ed5dbd52649",
    contractExplorerUrl:
      "https://goerli.etherscan.io/address/0x136c7a2a012e479f0fc93288fbd73ed5dbd52649",
    logo: WalletIcon,
  },
};
