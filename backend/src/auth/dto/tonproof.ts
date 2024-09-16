import { z } from "zod";

const TonAddress = z.string();

export const GenerateTonProofPayload = z.object({
  payload: z.string(),
});

const TonDomain = z.object({
  lengthBytes: z.number(),
  value: z.string(),
});

const TonProof = z.object({
  domain: TonDomain,
  payload: z.string(),
  signature: z.string(),
  state_init: z.string(),
  timestamp: z.number(),
});

const TonNetwork = z.union([
  z.literal("-239").transform(() => "MAINNET" as const),
  z.literal("-3").transform(() => "TESTNET" as const),
]);

export const CheckProofPayload = z.object({
  address: TonAddress,
  network: TonNetwork,
  proof: TonProof,
});

export const CheckTonProofSuccess = z.object({
  token: z.string(),
});

export const CheckTonProofError = z.object({
  error: z.string(),
});

export const CheckTonProof = z.union([
  CheckTonProofSuccess,
  CheckTonProofError,
]);

export const WalletAddress = z.object({
  address: z.string(),
});

export type GenerateTonProofPayload = z.infer<typeof GenerateTonProofPayload>;
export type TonDomain = z.infer<typeof TonDomain>;
export type TonProof = z.infer<typeof TonProof>;
export type TonNetwork = z.infer<typeof TonNetwork>;
export type CheckProofPayload = z.infer<typeof CheckProofPayload>;
export type CheckTonProof = z.infer<typeof CheckTonProof>;
export type CheckTonProofSuccess = z.infer<typeof CheckTonProofSuccess>;
export type CheckTonProofError = z.infer<typeof CheckTonProofError>;
export type WalletAddress = z.infer<typeof WalletAddress>;