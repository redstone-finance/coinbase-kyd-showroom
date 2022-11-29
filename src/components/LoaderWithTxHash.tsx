import { LoaderWithText } from "./LoaderWithText";

interface Props {
  text: string;
  transactionHash: string;
}

export const LoaderWithTxHash = ({ text, transactionHash }: Props) => (
  <div>
    <LoaderWithText text={text} />
    {transactionHash && (
      <p className="pt-2">
        {`Transaction hash: `}
        <a
          className="underline"
          href={`https://goerli.etherscan.io/tx/${transactionHash}`}
          target="blank"
          referrerPolicy="no-referrer"
        >
          {` ${transactionHash.slice(0, 8)}...${transactionHash.slice(-6)}`}
        </a>
      </p>
    )}
  </div>
);
