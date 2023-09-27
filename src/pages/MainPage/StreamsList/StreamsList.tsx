import React, { useEffect, useState } from "react";
import { Types } from "@streamflow/stream";
import { useWallet } from "@solana/wallet-adapter-react";
import SolanaStreamClient from "@streamflow/stream/dist/solana";

interface IStreamsList {
  client: SolanaStreamClient;
}

const StreamsList: React.FC<IStreamsList> = ({ client }) => {
  const [streams, setStreams] = useState([]);
  const wallet = useWallet();

  useEffect(() => {
    if (wallet.publicKey) {
      const getStreams = async () => {
        const data: Types.IGetAllData = {
          address: wallet.publicKey,
          type: Types.StreamType.All,
          direction: Types.StreamDirection.All,
        };

        try {
          const streams = await client.get(data);
          setStreams(streams);
        } catch (exception) {
          debugger;
          // handle exception
        }
      };

      getStreams();
    }
  }, [wallet]);

  return (
    <ul>
      {streams.map((s) => (
        <li key={s}>{s}</li>
      ))}
    </ul>
  );
};

export default StreamsList;
