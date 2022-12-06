import { ActionButton } from "./ActionButton";

interface Props {
  verifyAddressAndMintToken: ({
    requiredAddressLevel,
  }: {
    requiredAddressLevel: number;
  }) => void;
}

export const VerificationButtons = ({ verifyAddressAndMintToken }: Props) => {
  return (
    <div className="flex flex-col gap-5">
      <ActionButton
        action={() => verifyAddressAndMintToken({ requiredAddressLevel: 1 })}
        text="Verify Level 1 address"
        subtext="Any transaction from Coinbase"
        background="bg-redstone-light"
      />
      <ActionButton
        action={() => verifyAddressAndMintToken({ requiredAddressLevel: 2 })}
        text="Verify Level 2 address"
        subtext="ETH transactions from Coinbase for more than 100 USD, based on today's rate"
        background="bg-redstone"
      />
      <ActionButton
        action={() => verifyAddressAndMintToken({ requiredAddressLevel: 3 })}
        text="Verify Level 3 address"
        subtext="All transactions incoming from Coinbase"
        background="bg-redstone-dark"
      />
    </div>
  );
};
