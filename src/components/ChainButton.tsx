import { ChainDetails } from "../config/chains";

interface Props {
  chain: ChainDetails;
  onChainClick: (chain: ChainDetails) => void;
  disabled: boolean;
}

export const ChainButton = ({ chain, onChainClick, disabled }: Props) => (
  <button
    className="flex align-center gap-2 border py-3 px-6 rounded disabled:opacity-30 hover:scale-110	ease-in-out duration-300"
    onClick={() => onChainClick(chain)}
    disabled={disabled}
  >
    <img width={24} height={24} src={chain.logo} alt={`${chain.label} logo`} />
    {chain.label}
  </button>
);
