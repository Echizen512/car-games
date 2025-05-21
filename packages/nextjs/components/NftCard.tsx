import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import ParticleBackground from "./ParticleBackground";
import PlaceHolderNftCard from "./PlaceHolderNftCard";
import VirtualRace from "./VirtualRace";
import { NextPage } from "next";
import { INftAttribute, INftDataSea, INftPreview } from "~~/types/nftData.entity";

type NftCardProps = {
  data: INftDataSea;
  selectedRarity: string;
};

const NftCard: NextPage<NftCardProps> = ({ data, selectedRarity }) => {
  const [nftPreview, setNftPreview] = useState<INftPreview | null>(null);
  const [loadData, setLoadData] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showRace, setShowRace] = useState(false);

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

  useEffect(() => {
    getPreviewNft();
  }, [getPreviewNft]);

  //Card Components
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

  return (
    <>
      {loadData ? (
        <div className="card bg-primary flex-1 shadow-sm rounded-xl h-50 p-5 gap-2 justify-center items-center">
          <span className="loading loading-spinner loading-xl" />
          <span className="text-white text-md">Loading...</span>
        </div>
      ) : (
        (selectedRarity === "all" ||
          selectedRarity.toLowerCase() === nftPreview?.attributes[0]?.value.toLowerCase()) && (
          <div className="card bg-base-100 flex-1 shadow-sm rounded-xl overflow-hidden">
            <div
              className="relative h-64 w-full bg-primary rounded-t-lg"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              {isHovered && nftPreview?.attributes && <ParticleBackground rarity={nftPreview.attributes[0]?.value} />}
              {nftPreview !== null ? (
                <Image src={data.image_url} alt={nftPreview.name} fill={true} className="object-contain p-4" />
              ) : (
                <div className="skeleton w-full h-full rounded-b-none" />
              )}
            </div>
            <div className="card-body p-5">
              <div className="w-full flex flex-col items-center">
                <div
                  className={`px-4 py-1 rounded-md text-white text-center font-bold mt-2 mb-4 ${
                    nftPreview?.attributes[0]?.value === "Common"
                      ? "bg-gray-600"
                      : nftPreview?.attributes[0]?.value === "Uncommon"
                        ? "bg-green-600"
                        : nftPreview?.attributes[0]?.value === "Rare"
                          ? "bg-purple-600"
                          : nftPreview?.attributes[0]?.value === "Epic"
                            ? "bg-orange-500"
                            : "bg-gray-800"
                  }`}
                >
                  {nftPreview?.attributes[0]?.value}
                </div>
                <h2 className="card-title text-xl font-bold text-center">{nftPreview?.name}</h2>
              </div>
              {nftPreview?.attributes?.slice(1).map((x, y) => NftCardAttributes(x, y))}

              <div className="grid grid-cols-2 gap-3 mt-5">
                <button onClick={() => setShowRace(true)} className="btn btn-primary py-2 rounded-md font-medium">
                  Start Virtual Race
                </button>
                <button className="btn btn-withdraw py-2 rounded-md font-medium">Claim Reward</button>
              </div>
            </div>
          </div>
        )
      )}
      {/* {showRace && nftPreview && <VirtualRace ship={nftPreview} onClose={() => setShowRace(false)} />} */}
    </>
  );
};

export default NftCard;
