"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import ParticleBackground from "./ParticleBackground";
import VirtualRace from "./VirtualRace";
import { AnimatePresence } from "motion/react";
import { NextPage } from "next";
import { useAccount } from "wagmi";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { INftAttribute, INftDataSea, INftPreview } from "~~/types/nftData.entity";

type NftCardProps = {
  data: INftDataSea;
  selectedRarity: string;
};

const NftCard: NextPage<NftCardProps> = ({ data, selectedRarity }) => {
  const { address } = useAccount();

  //states
  const [nftPreview, setNftPreview] = useState<INftPreview | null>(null);
  const [loadData, setLoadData] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [showRace, setShowRace] = useState<boolean>(false);
  const [selectedShip, setSelectedShip] = useState<any | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  //smart contract
  const { data: isOwner } = useScaffoldReadContract({
    contractName: "Finance",
    functionName: "nftOwner",
    args: [BigInt(data.identifier)],
  });

  const { data: oilBalance } = useScaffoldReadContract({
    contractName: "Finance",
    functionName: "oilBalances",
    args: [BigInt(data.identifier)],
  });

  const { data: rarityCommon } = useScaffoldReadContract({
    contractName: "Finance",
    functionName: "COMMON",
  });

  const { data: rarityUncommon } = useScaffoldReadContract({
    contractName: "Finance",
    functionName: "UNCOMMON",
  });

  const { data: rarityRare } = useScaffoldReadContract({
    contractName: "Finance",
    functionName: "RARE",
  });

  const { data: rarityEpic } = useScaffoldReadContract({
    contractName: "Finance",
    functionName: "EPIC",
  });

  const { writeContractAsync: writeFinancetAsync } = useScaffoldWriteContract({ contractName: "Finance" });

  //functions
  const getPreviewNft = useCallback(async () => {
    try {
      setLoadData(true);
      const req = await fetch(data.metadata_url);
      const res: INftPreview = await req.json();
      setNftPreview(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadData(false);
    }
  }, [data.metadata_url]);

  const prepareShipData = () => {
    if (!nftPreview) return null;

    return {
      id: data.identifier,
      name: nftPreview.name,
      type: "NFT Ship",
      image: data.image_url,
      stats: {
        fuel: nftPreview.attributes.find(attr => attr.trait_type === "oil")?.value || 50,
        power: nftPreview.attributes.find(attr => attr.trait_type === "power")?.value || 50,
        speed: nftPreview.attributes.find(attr => attr.trait_type === "speed")?.value || 50,
        handling: nftPreview.attributes.find(attr => attr.trait_type === "handling")?.value || 50,
        stormStability: nftPreview.attributes.find(attr => attr.trait_type === "storm_stability")?.value || 50,
      },
    };
  };

  const getRarity = () => {
    const rarity = nftPreview?.attributes[0]?.value.toLowerCase();
    let data: `0x${string}` = "0x0";

    switch (rarity) {
      case "common":
        data = rarityCommon ?? "0x0";
      case "uncommon":
        data = rarityUncommon ?? "0x0";
      case "epic":
        data = rarityRare ?? "0x0";
      case "rare":
        data = rarityEpic ?? "0x0";
    }

    return data;
  };

  const handleStartRace = async () => {
    try {
      await writeFinancetAsync({
        functionName: "raceStart",
        args: [BigInt(parseInt(data.identifier)), getRarity()],
      });

      setSelectedShip(prepareShipData());
      setShowRace(true);
    } catch (err) {
      console.log(err);
    }
  };

  //effects
  useEffect(() => {
    getPreviewNft();
  }, [getPreviewNft]);

  // Card Components
  const ImageContainerCard = () => {
    return (
      <article
        className="relative h-64 w-full bg-base-300 rounded-t-lg"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {nftPreview !== null ? (
          <>
            <div className="absolute left-0 bg-gray-500 text-white badge font-semibold p-1 px-2 rounded-full m-1">
              #{data.identifier}
            </div>
            {isHovered && nftPreview?.attributes && <ParticleBackground rarity={nftPreview.attributes[0]?.value} />}
            <Image
              src={data.image_url}
              alt={nftPreview.name}
              fill={true}
              className="object-contain p-4"
              draggable={false}
              priority
              sizes="100%"
            />
          </>
        ) : (
          <div className="skeleton w-full h-full rounded-b-none" />
        )}
      </article>
    );
  };

  const NftCardAttributes = (x: INftAttribute, y: number) => {
    const oilLimit = 75;
    const allStaticsLimit = 85;

    const oil = isOwner === undefined || isOwner.startsWith("0x000000") ? x.value : oilBalance?.toString();

    return (
      <div key={y} className="flex flex-col">
        <span className="font-semibold">{x.trait_type === "oil" ? "fuel" : x.trait_type.toString()}</span>
        <div className="flex items-center justify-center gap-5">
          <progress
            className="progress progress-success"
            value={x.trait_type === "oil" ? oil : x.value}
            max={x.trait_type === "oil" ? "75" : x.trait_type === "power" || x.trait_type === "speed" ? "100" : "85"}
          />
          <span className="font-semibold">
            {x.trait_type === "oil"
              ? `${oil}/${oilLimit}`
              : `${x.value}/${x.trait_type === "power" || x.trait_type === "speed" ? "100" : allStaticsLimit}`}
          </span>
        </div>
      </div>
    );
  };

  const BadgeRarityCard = () => {
    let bgRarity: string = "bg-gray-800";

    switch (nftPreview?.attributes[0].value) {
      case "common":
        bgRarity = "bg-gray-600";
        break;
      case "uncommon":
        bgRarity = "bg-green-600";
        break;
      case "rare":
        bgRarity = "bg-purple-600";
        break;
      case "epic":
        bgRarity = "bg-orange-500";
        break;
    }

    return (
      <div className="mx-auto my-5">
        <div className={`${bgRarity} text-white badge font-semibold p-4 rounded-full`}>
          {nftPreview?.attributes[0]?.value}
        </div>
      </div>
    );
  };

  return (
    <>
      <AnimatePresence>
        {showRace && selectedShip && <VirtualRace ship={selectedShip} onClose={() => setShowRace(false)} />}
      </AnimatePresence>

      {loadData ? (
        <div className="card bg-primary flex-1 shadow-sm rounded-xl h-50 p-5 gap-2 justify-center items-center">
          <span className="loading loading-spinner loading-xl" />
          <span className="text-white text-md">Loading...</span>
        </div>
      ) : nftPreview === null ? (
        <div className="card bg-secondary flex-1 shadow-sm rounded-xl h-50 p-5 gap-2 justify-center items-center">
          <h3 className="font-semibold text-md text-center">Check your internet connection and try again.</h3>
          <button className="btn btn-primary" onClick={getPreviewNft}>
            <ArrowPathIcon className="w-4 h-4" /> Reload
          </button>
        </div>
      ) : (
        (selectedRarity === "all" ||
          selectedRarity.toLowerCase() === nftPreview?.attributes[0]?.value.toLowerCase()) && (
          <div className="card bg-base-100 flex-1 shadow-sm rounded-xl overflow-hidden">
            {ImageContainerCard()}
            {BadgeRarityCard()}
            <div className="card-body p-5">
              <div className="w-full flex flex-col items-center">
                <h2 className="card-title text-xl font-bold text-center">{nftPreview?.name}</h2>
              </div>
              {nftPreview?.attributes?.slice(1).map((x, y) => NftCardAttributes(x, y))}

              <div className="grid grid-cols-2 gap-3 mt-5">
                <button
                  // onClick={handleStartRace}
                  onClick={() => {
                    setSelectedShip(prepareShipData());
                    setShowRace(true);
                  }}
                  className="btn btn-success rounded-md font-medium"
                  disabled={address === undefined}
                >
                  Start Virtual Race
                </button>

                {/* Claim Reward Modal */}
                <div>
                  <button
                    className="btn btn-withdraw w-full py-2 rounded-md font-medium opacity-50 cursor-not-allowed"

                  >
                    Claim Reward
                  </button>

                  
                </div>
              </div>
            </div>
          </div>
        )
      )}
    </>
  );
};

export default NftCard;
