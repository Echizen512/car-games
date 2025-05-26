"use client";

import React, { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { NextPage } from "next";
import { formatEther } from "viem";
import { useAccount } from "wagmi";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import NftCard from "~~/components/NftCard";
import PlaceHolderNftCard from "~~/components/PlaceHolderNftCard";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";
import { INftDataSea, INftDataSeaResponse } from "~~/types/nftData.entity";

const Home: NextPage = () => {
  const { address } = useAccount();

  //constants
  const rarityColors: { [key: string]: string } = {
    all: "bg-blue-500",
    common: "bg-gray-600",
    uncommon: "bg-green-600",
    rare: "bg-purple-600",
    epic: "bg-orange-500",
  };
  const rarityTypes = ["All", "Common", "Uncommon", "Rare", "Epic"];
  const pageSize = 8;

  // States
  const [userNfts, setUserNfts] = useState<INftDataSea[] | null>(null);
  const [selectedRarity, setSelectedRarity] = useState<string>("all");
  const [loaderNft, setLoaderNft] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [currentViewNft, setCurrentViewNft] = useState<{ initial: number; end: number }>({ initial: 0, end: pageSize });

  //smart contract
  const { data: userBalance } = useScaffoldReadContract({
    contractName: "RonKe",
    functionName: "balanceOf",
    args: [address],
  });

  // Functions
  const getUserNFTs = useCallback(async () => {
    try {
      setLoaderNft(true);
      const req = await fetch(`api/nft?address=${"0xc8b7aefc4a85bbec9c2e7db9850c56eddd2800b2"}`);
      console.log(address);
      const res: INftDataSeaResponse = await req.json();
      setUserNfts(res.nfts);
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

  useEffect(() => {
    const newInitial = currentPage * pageSize;
    const newEnd = Math.min(newInitial + pageSize, userNfts?.length ?? 0);

    setCurrentViewNft({ initial: newInitial, end: newEnd });
  }, [currentPage, userNfts?.length]);

  return (
    <section className="flex flex-col w-full h-full">
      <div className="flex justify-center items-center p-2 mt-4">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-xl rounded-lg p-4 w-auto">
          <h2 className=" font-semibold flex items-center">
            Total Token Balance:
            <span className=" font-bold text-yellow-300"> {formatEther(userBalance ?? 0n)} RKS</span>
          </h2>
        </div>
      </div>

      <AnimatePresence>
        {userNfts !== null && userNfts !== undefined && userNfts.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <article className="flex gap-5 w-full justify-center">
              <div className="p-4 mx-auto grid grid-cols-3 sm:flex gap-5 justify-center">
                {rarityTypes.map((x: string, y: number) => (
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

            <div className="join justify-center w-full">
              <button
                onClick={() => setCurrentPage(prev => prev - 1)}
                className="join-item btn"
                disabled={currentPage === 0}
              >
                «
              </button>
              <button className="join-item btn">Page {currentPage + 1}</button>
              <button
                onClick={() => setCurrentPage(prev => prev + 1)}
                className="join-item btn"
                disabled={currentViewNft.end >= userNfts.length}
              >
                »
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {loaderNft ? (
        <article className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 p-5 gap-2">
          <PlaceHolderNftCard />
        </article>
      ) : userNfts === null || userNfts === undefined ? (
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
        <article className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 p-5 gap-2">
          {userNfts
            .sort((a: INftDataSea, b: INftDataSea) => parseInt(a.identifier) - parseInt(b.identifier))
            .slice(currentViewNft.initial, currentViewNft.end)
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
