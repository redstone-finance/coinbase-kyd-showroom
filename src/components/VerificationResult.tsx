import { TokenMintingResult } from "./TokenMintingResult";

interface Props {
  verificationResult: boolean;
  addressBalance: string;
}

export const VerificationResult = ({
  verificationResult,
  addressBalance,
}: Props) => {
  return (
    <div className="w-3/5 text-center mt-3">
      <div>
        {verificationResult ? (
          <TokenMintingResult addressBalance={addressBalance} />
        ) : (
          <p className="text-lg font-bold">
            Sorry, your address doesn't have required KYD Level
          </p>
        )}
      </div>
    </div>
  );
} 