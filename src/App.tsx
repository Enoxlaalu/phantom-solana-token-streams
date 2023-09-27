import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  WalletProvider,
  ConnectionProvider,
} from "@solana/wallet-adapter-react";
import { FC, useMemo } from "react";
import MainPage from "src/pages/MainPage/MainPage.tsx";

const App: FC = () => {
  // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
  const network = WalletAdapterNetwork.Devnet;

  const endpoint = useMemo(() => "https://api.devnet.solana.com/", []);
  const wallets = useMemo(() => [], [network]);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <MainPage />
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default App;
