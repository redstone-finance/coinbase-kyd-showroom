import { ActionButton } from "./ActionButton";

interface Props {
  verifyAddress: ({
    requiredAddressLevel,
  }: {
    requiredAddressLevel: number;
  }) => void;
}

export const VerificationButtons = ({ verifyAddress }: Props) => {
  return (
    <div className="flex flex-col gap-5">
      <ActionButton
        action={() => verifyAddress({ requiredAddressLevel: 1 })}
        text="Verify Level 1 address"
      />
      <ActionButton
        action={() => verifyAddress({ requiredAddressLevel: 2 })}
        text="Verify Level 2 address"
        outlined
      />
      <ActionButton
        action={() => verifyAddress({ requiredAddressLevel: 3 })}
        text="Verify Level 3 address"
      />
    </div>
  );
};
