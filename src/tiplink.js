import {
  PublicKey,
  Keypair,
  Connection,
  clusterApiUrl,
  sendAndConfirmTransaction,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";

import { TipLink } from "@tiplink/api";

const SOLANA_TRANSACTION_FEE_LAMPORTS = 5000; // to derive the real cost use: Connection.getFeeForMessage()
const TIPLINK_SOL_ONLY_LINK_MINIMUM_LAMPORTS = 100000000;

// ここで使用している秘密鍵は先ほど作ったもので、資産は入っていません。
// faucetで最初に５トークンだけエアドロしました。
const secretKey = new Uint8Array([
  23, 61, 53, 58, 147, 55, 9, 176, 195, 241, 236, 44, 211, 204, 254, 203, 9,
  154, 165, 154, 66, 192, 248, 14, 2, 58, 47, 220, 106, 31, 42, 186, 232, 163,
  172, 57, 132, 233, 80, 23, 247, 117, 220, 138, 55, 27, 31, 70, 19, 8, 242, 98,
  6, 8, 230, 54, 62, 247, 73, 204, 6, 98, 100, 14,
]);

const createAndFundKeypair = async () => {
  const sourceKeypair = Keypair.fromSecretKey(secretKey);
  console.log("sourceKeypair: ", sourceKeypair.publicKey.toBase58());

  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
  //   const airdropSignature = await connection.requestAirdrop(
  //     sourceKeypair.publicKey,
  //     TIPLINK_SOL_ONLY_LINK_MINIMUM_LAMPORTS + SOLANA_TRANSACTION_FEE_LAMPORTS
  //   );
  //   const confirmation = await connection.confirmTransaction(
  //     airdropSignature,
  //     "confirmed"
  //   );
  //   if (confirmation.value.err !== null) {
  //     throw "Unable to fund new wallet";
  //   }
  return sourceKeypair;
};

const fundTipLink = async (sourceKeypair, destinationTipLink) => {
  /* TipLink.create() should not be able to generate invalid addresses
   * this check is purely for demonstrational purposes
   */
  const isValidAddress = await PublicKey.isOnCurve(
    destinationTipLink.keypair.publicKey
  );
  if (!isValidAddress) {
    throw "Invalid TipLink";
  }

  let transaction = new Transaction();
  let connection = new Connection(clusterApiUrl("devnet"), "confirmed");

  transaction.add(
    SystemProgram.transfer({
      fromPubkey: sourceKeypair.publicKey,
      toPubkey: destinationTipLink.keypair.publicKey,
      lamports: TIPLINK_SOL_ONLY_LINK_MINIMUM_LAMPORTS,
    })
  );

  const transactionSignature = await sendAndConfirmTransaction(
    connection,
    transaction,
    [sourceKeypair],
    { commitment: "confirmed" }
  );
  if (transactionSignature === null) {
    throw "Unable to fund TipLink's public key";
  }
  return transactionSignature;
};

const createAndFundTipLink = async () => {
  const sourceKeypair = await createAndFundKeypair();
  const destinationTipLink = await TipLink.create();
  const tx = await fundTipLink(sourceKeypair, destinationTipLink);
  console.log("tx: ", tx);
  console.log(
    "visit",
    destinationTipLink.url.toString(),
    "to view your balance and perform other wallet actions"
  );
  console.log(
    "The TipLink should have 90000 lamports worth of sol on it: the minimum recommended amount for a usable TipLink"
  );
};

createAndFundTipLink();
