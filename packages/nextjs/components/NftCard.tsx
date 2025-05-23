import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import ParticleBackground from "./ParticleBackground";
import VirtualRace from "./VirtualRace";
import { AnimatePresence } from "motion/react";
import { NextPage } from "next";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { INftAttribute, INftDataSea, INftPreview } from "~~/types/nftData.entity";

type NftCardProps = {
  data: INftDataSea;
  selectedRarity: string;
};

const NftCard: NextPage<NftCardProps> = ({ data, selectedRarity }) => {
  //states
  const [nftPreview, setNftPreview] = useState<INftPreview | null>(null);
  const [loadData, setLoadData] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showRace, setShowRace] = useState(false);
  const [selectedShip, setSelectedShip] = useState<any | null>(null);
  const [isOpen, setIsOpen] = useState(false);

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

  //effects
  useEffect(() => {
    getPreviewNft();
  }, [getPreviewNft]);

  const prepareShipData = () => {
    if (!nftPreview) return null;

    return {
      id: data.identifier,
      name: nftPreview.name,
      type: "NFT Ship",
      image: data.image_url,
      stats: {
        oil: nftPreview.attributes.find(attr => attr.trait_type === "oil")?.value || 50,
        power: nftPreview.attributes.find(attr => attr.trait_type === "power")?.value || 50,
        speed: nftPreview.attributes.find(attr => attr.trait_type === "speed")?.value || 50,
        handling: nftPreview.attributes.find(attr => attr.trait_type === "handling")?.value || 50,
        stormStability: nftPreview.attributes.find(attr => attr.trait_type === "storm_stability")?.value || 50,
      },
    };
  };

  // Card Components
  const NftCardAttributes = (x: INftAttribute, y: number) => {
    const oilLimit = 75;
    const allStaticsLimit = 80;

    return (
      <div key={y} className="flex flex-col">
        <span className="font-semibold">{x.trait_type.toString()}</span>
        <div className="flex items-center justify-center gap-5">
          <progress className="progress progress-success" value={x.value} max="100" />
          <span className="font-semibold">
            {x.value}/{x.trait_type === "oil" ? oilLimit : allStaticsLimit}
          </span>
        </div>
      </div>
    );
  };

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
                  onClick={() => {
                    setSelectedShip(prepareShipData());
                    setShowRace(true);
                  }}
                  className="btn btn-success rounded-md font-medium"
                >
                  Start Virtual Race
                </button>

                {/* Claim Reward Modal */}
                <div>
                  <button
                    className="btn btn-withdraw w-full py-2 rounded-md font-medium opacity-50 cursor-not-allowed"
                    disabled
                    onClick={() => setIsOpen(true)}
                  >
                    Claim Reward
                  </button>

                  {isOpen && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                      <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-xl font-semibold mb-4">Coming Soon! 🚀</h2>
                        <p className="text-lg">
                          The reward claiming feature will be available in the coming days. Stay tuned!
                        </p>
                        <button className="mt-4 btn btn-primary py-2 px-4 rounded-md" onClick={() => setIsOpen(false)}>
                          Close
                        </button>
                      </div>
                    </div>
                  )}
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
