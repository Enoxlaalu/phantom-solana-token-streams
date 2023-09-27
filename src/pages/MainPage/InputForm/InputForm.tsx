import Input from "src/components/Input/Input.tsx";
import React, { useState } from "react";
import styles from "./styles.module.scss";
import Button from "src/components/Button/Button.tsx";
import { useWallet } from "@solana/wallet-adapter-react";
import { getBN, Types } from "@streamflow/stream";
import SolanaStreamClient, { BN } from "@streamflow/stream/dist/solana";
import {
  createMint,
  getOrCreateAssociatedTokenAccount,
} from "@solana/spl-token";
import {
  clusterApiUrl,
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";

interface IFormData {
  amount: number;
  recipient: string;
  name: string;
}

interface IInputForm {
  client: SolanaStreamClient;
}

const InputForm: React.FC<IInputForm> = ({ client }) => {
  const [tokenAccount, setTokenAccount] = useState<{
    address: string;
  } | null>(null);
  const [data, setData] = useState<IFormData>({
    recipient: "DYw8jCTfwHNRJhhmFcbXvVDTqWMEVFBX6ZKUmG5CNSKK",
  } as IFormData);
  const [error, setError] = useState("");

  const wallet = useWallet();
  console.log("wallet >>", wallet);

  const createToken = async () => {
    const payer = Keypair.generate();
    const mintAuthority = Keypair.generate();
    const freezeAuthority = Keypair.generate();

    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

    const airdropSignature = await connection.requestAirdrop(
      payer.publicKey,
      LAMPORTS_PER_SOL,
    );

    await connection.confirmTransaction(airdropSignature);

    const mint = await createMint(
      connection,
      payer,
      mintAuthority.publicKey,
      freezeAuthority.publicKey,
      9, // We are using 9 to match the CLI decimal default exactly
    );

    console.log(mint.toBase58());

    const tokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      payer,
      mint,
      payer.publicKey,
    );

    console.log(tokenAccount.address.toBase58());
    setTokenAccount(tokenAccount);
  };

  const createStream = async () => {
    const { amount, recipient, name } = data;

    const createStreamParams: Types.ICreateStreamData = {
      recipient, // Recipient address.
      tokenId:
        (tokenAccount?.address as string) ||
        "DNw99999M7e24g99999999WJirKeZ5fQc6KY999999gK", // Token mint address.
      start: 1643363040, // Timestamp (in seconds) when the stream/token vesting starts.
      amount: getBN(amount, 9), // depositing 100 tokens with 9 decimals mint.
      period: 1, // Time step (period) in seconds per which the unlocking occurs.
      cliff: 1643363160, // Vesting contract "cliff" timestamp in seconds.
      cliffAmount: new BN(10), // Amount unlocked at the "cliff" timestamp.
      amountPerPeriod: getBN(5, 9), // Release rate: how many tokens are unlocked per each period.
      name, // The stream name or subject.
      canTopup: false, // setting to FALSE will effectively create a vesting contract.
      cancelableBySender: true, // Whether or not sender can cancel the stream.
      cancelableByRecipient: false, // Whether or not recipient can cancel the stream.
      transferableBySender: true, // Whether or not sender can transfer the stream.
      transferableByRecipient: false, // Whether or not recipient can transfer the stream.
      automaticWithdrawal: true, // Whether or not a 3rd party (e.g. cron job, "cranker") can initiate a token withdraw/transfer.
      withdrawalFrequency: 10, // Relevant when automatic withdrawal is enabled. If greater than 0 our withdrawor will take care of withdrawals. If equal to 0 our withdrawor will skip, but everyone else can initiate withdrawals.
    };

    const solanaParams = {
      sender: wallet, // SignerWalletAdapter or Keypair of Sender account
    };

    try {
      const { ixs, tx, metadata } = await client.create(
        createStreamParams,
        solanaParams,
      ); // second argument differ depending on a chain
      debugger;
    } catch (exception) {
      setError(exception.message);
    }
  };

  const onChange = (id: string) => (value: string | number) => {
    setData({ ...data, [id]: value });
  };

  return (
    <div className={styles.form}>
      <Input
        id="amount"
        placeholder="Amount"
        onChange={onChange("amount")}
        value={data.amount}
      />
      <Input
        id="recipient"
        placeholder="Recipient Wallet Address"
        onChange={onChange("recipient")}
        value={data.recipient}
      />
      <Input
        id="contractTitle"
        placeholder="Contract Title"
        onChange={onChange("name")}
        value={data.name}
      />
      <Button text="Create stream" onClick={createStream} />
      {error && <p>{error}</p>}
      <Button text="Create token" onClick={createToken} />
    </div>
  );
};

export default InputForm;
