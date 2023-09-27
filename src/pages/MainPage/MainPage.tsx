import InputForm from "src/pages/MainPage/InputForm/InputForm.tsx";
import styles from "./styles.module.scss";
import {
  WalletDialogProvider,
  WalletMultiButton,
} from "@solana/wallet-adapter-material-ui";
import { StreamflowSolana } from "@streamflow/stream";
import StreamsList from "src/pages/MainPage/StreamsList/StreamsList.tsx";

const MainPage = () => {
  const client = new StreamflowSolana.SolanaStreamClient(
    "https://api.devnet.solana.com/",
  );

  return (
    <main className={styles.page}>
      <WalletDialogProvider>
        <WalletMultiButton className={styles.walletButton} />
      </WalletDialogProvider>
      <InputForm client={client} />
      <StreamsList client={client} />
    </main>
  );
};

export default MainPage;
