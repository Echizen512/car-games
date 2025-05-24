"use client";

import React, { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import NftCard from "~~/components/NftCard";
import PlaceHolderNftCard from "~~/components/PlaceHolderNftCard";
import { INftDataSea, INftDataSeaResponse } from "~~/types/nftData.entity";

const Home: NextPage = () => {
  const { address } = useAccount();

  const rarityColors = {
    all: "bg-blue-500",
    common: "bg-gray-600",
    uncommon: "bg-green-600",
    rare: "bg-purple-600",
    epic: "bg-orange-500",
  };

  // States
  const [userNfts, setUserNfts] = useState<INftDataSea[] | null>(null);
  const [selectedRarity, setSelectedRarity] = useState<string>("all");
  const [loaderNft, setLoaderNft] = useState<boolean>(false);
  const rarityTypes = ["All", "Common", "Uncommon", "Rare", "Epic"];

  // Functions
  const getUserNFTs = useCallback(async () => {
    try {
      setLoaderNft(true);
      const req = await fetch(
        `https://testnets-api.opensea.io/api/v2/chain/sepolia/account/${address}/nfts?collection=fuerza-com`,
      );
      const res: INftDataSeaResponse = await req.json();
      setUserNfts(res.nfts);

      console.log(res);
    } catch (err) {
      console.log(err);
    } finally {
      setLoaderNft(false);
    }
  }, [address]);

  // Effects
  useEffect(() => {
    getUserNFTs();
  }, [getUserNFTs]);

  return (
    <section className="flex flex-col w-full h-full">
      <article className="flex gap-5 mt-2 w-full justify-center">
        <div className="p-4 mx-auto grid grid-cols-3 sm:flex gap-5 justify-center">
          {rarityTypes.map((x, y) => (
            <button
              key={y}
              onClick={() => setSelectedRarity(x.toLowerCase())}
              className={`btn w-28 text-white font-semibold ${rarityColors[x.toLowerCase()]} ${selectedRarity === x.toLowerCase() ? "ring-2 ring-yellow-400" : ""}`}
            >
              {x}
            </button>
          ))}
        </div>
      </article>

      {loaderNft ? (
        <article className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 p-5 gap-2">
          <PlaceHolderNftCard />
        </article>
      ) : userNfts === null ? (
        <AnimatePresence>
          <motion.article
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center flex-col gap-2 items-center h-96"
          >
            <h3 className="font-semibold text-2xl">Check your internet connection and try again.</h3>
            <button className="btn btn-primary" onClick={getUserNFTs}>
              <ArrowPathIcon className="w-4 h-4" /> Reload
            </button>
          </motion.article>
        </AnimatePresence>
      ) : userNfts.length > 0 ? (
        <article className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 p-5 gap-2">
          {userNfts
            .sort((a: INftDataSea, b: INftDataSea) => parseInt(a.identifier) - parseInt(b.identifier))
            .map((x, y) => (
              <NftCard key={y} data={x} selectedRarity={selectedRarity} />
            ))}
        </article>
      ) : (
        <motion.article
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-center flex-col gap-2 items-center h-96"
        >
          <h3 className="font-semibold text-2xl">You still do not have NFT.</h3>
          <button className="btn btn-primary" onClick={getUserNFTs}>
            <ArrowPathIcon className="w-4 h-4" /> Reload
          </button>
        </motion.article>
      )}
    </section>
  );
};

export default Home;
