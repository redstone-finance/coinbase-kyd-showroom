import { Signer } from "ethers";
import { TokenMinting } from "./TokenMinting";

interface Props {
  verificationResult: boolean;
  signer: Signer;
  contractAddress: string;
}

export const VerificationResult = ({
  verificationResult,
  signer,
  contractAddress,
}: Props) => (
  <div className="w-3/5 text-center mt-3">
    <div>
      {verificationResult ? (
        <TokenMinting signer={signer} contractAddress={contractAddress} />
      ) : (
        <p className="text-lg font-bold">
          Sorry, your address doesn't have required KYD Level
        </p>
      )}
    </div>
  </div>
);
