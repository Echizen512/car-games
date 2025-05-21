"use client";

import React, { useCallback, useEffect, useState } from "react";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import NftCard from "~~/components/NftCard";
import PlaceHolderNftCard from "~~/components/PlaceHolderNftCard";
import { INftDataSea, INftDataSeaResponse } from "~~/types/nftData.entity";

const Home: NextPage = () => {
  const { address } = useAccount();

  //states
  const [userNfts, setUserNfts] = useState<INftDataSea[] | null>(null);
  const [selectedRarity, setSelectedRarity] = useState<string>("all");
  const [loaderNft, setLoaderNft] = useState<boolean>(false);
  const rarityTypes = ["All", "Common", "Uncommon", "Rare", "Epic"];

  //functions
  const getUserNFTs = useCallback(async () => {
    try {
      setLoaderNft(true);
      const req = await fetch(
        `https://testnets-api.opensea.io/api/v2/chain/sepolia/account/${address}/nfts?collection=fuerza-com`,
      );

      const res: INftDataSeaResponse = await req.json();
      setUserNfts(res.nfts);

      console.log(res.nfts);
    } catch (err) {
      console.log(err);
    } finally {
      setLoaderNft(false);
    }
  }, [address]);

  //effects
  useEffect(() => {
    getUserNFTs();
  }, [getUserNFTs]);

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

      <section className="grid grid-cols-4 p-5 gap-2">
        {loaderNft ? (
          <PlaceHolderNftCard />
        ) : (
          userNfts !== null && userNfts.map((x, y) => <NftCard key={y} data={x} selectedRarity={selectedRarity} />)
        )}
      </section>
    </section>
  );
};

export default Home;
