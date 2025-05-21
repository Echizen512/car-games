"use client";

import React, { useState } from "react";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import NftCard from "~~/components/NftCard";
import { useScaffoldContract, useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

const Home: NextPage = () => {
  const { address } = useAccount();
  const [selectedRarity, setSelectedRarity] = useState<string>("all");

  const rarityTypes = ["All", "Common", "Uncommon", "Rare", "Epic"];

  // Smart contract
  const { data: userNFTs } = useScaffoldReadContract({
    contractName: "RoninZodiacs",
    functionName: "getUserNFTs",
    args: [address],
  });

  const { data: userBalance } = useScaffoldReadContract({
    contractName: "Finance",
    functionName: "balances",
    args: [address],
  });

  const { data: revealNFT } = useScaffoldReadContract({
    contractName: "RoninZodiacs",
    functionName: "reveal",
  });

  const { data: maxNftID } = useScaffoldReadContract({
    contractName: "RoninZodiacs",
    functionName: "nextTokenId",
  });

  const { data: zodiacContract } = useScaffoldContract({ contractName: "RoninZodiacs" });

  // Write smart contract
  const { writeContractAsync: writeRoninZodiacsAsync } = useScaffoldWriteContract({ contractName: "RoninZodiacs" });

  // Update OpenSea metadata
  const updateOpenSeaMetaData = async () => {
    if (maxNftID === undefined) return;
    for (let i = 0; i < maxNftID; i++) {
      await fetch(
        `https://testnets-api.opensea.io/api/v2/chain/saigon_testnet/contract/${zodiacContract?.address}/nfts/${i}/refresh`,
        { method: "POST" },
      );
    }
  };

  return (
    <section className="flex flex-col w-full h-full">
      <article className="flex gap-5 mt-2 w-full justify-center">
        {rarityTypes.map((x, y) => (
          <button
            key={y}
            onClick={() => setSelectedRarity(x.toLowerCase())}
            className={`${selectedRarity.toLowerCase() === x.toLowerCase() ? "btn-primary" : "btn-secondary"} btn w-28`}
          >
            {x}
          </button>
        ))}
      </article>

      <button
        className="btn btn-warning w-40 mt-5 mx-auto"
        onClick={async () => {
          try {
            await writeRoninZodiacsAsync({
              functionName: "disclose",
            });

            await updateOpenSeaMetaData();
          } catch (err) {
            console.log(err);
          }
        }}
      >
        Disclose All NFT
      </button>

      <article className="flex gap-5 mt-2 w-full justify-center">
        <h2 className="text-xl font-bold">
          Your Balance: {userBalance ? `${userBalance.toString()} Ronin` : "0 (RON)"}
        </h2>
      </article>

      <section className="grid grid-cols-4 p-5 gap-2">
        {/* Tarjeta NFT ficticia */}
        <NftCard
          data={{
            tokenId: BigInt(999),
            tokenURI: "https://example.com/nft-mock",
          }}
          revealNFT={true}
          selectedRarity="Epic"
        />

        {/* Tarjetas NFT reales obtenidas de la wallet */}
        {userNFTs?.map((data, key) => (
          <NftCard key={key} data={data} revealNFT={revealNFT} selectedRarity={selectedRarity} />
        ))}
      </section>
    </section>
  );
};

export default Home;
