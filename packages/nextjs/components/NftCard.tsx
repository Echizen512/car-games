import { useEffect, useState } from "react";
import Image from "next/image";
import PlaceHolderNftCard from "./PlaceHolderNftCard";
import { NextPage } from "next";
import { INftPreview } from "~~/types/nft-data";
import ParticleBackground from "./ParticleBackground";
import VirtualRace from "./VirtualRace";

type NftCardProps = {
  data: {
    tokenId: bigint;
    tokenURI: string;
  };
  revealNFT: boolean | undefined;
  selectedRarity: string;
};

const NftCard: NextPage<NftCardProps> = ({ data, revealNFT, selectedRarity }) => {
  const [nftPreview, setNftPreview] = useState<INftPreview | undefined>(undefined);
  const [loadData, setLoadData] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showRace, setShowRace] = useState(false);

  const getPreviewNft = async (tokenUri: string) => {
    try {
      setLoadData(true);
      if (tokenUri.startsWith("ipfs://")) {
        const CID = tokenUri.replace("ipfs://", "");
        const req = await fetch(`https://gateway.pinata.cloud/ipfs/${CID}`);
        const res: INftPreview = await req.json();
        return res;
      } else {
        return {
          image: "/ship.png",
          name: "Storm Chaser",
          description: "A legendary vehicle built for power and endurance in extreme conditions.",
          attributes: [
            { trait_type: "Rarity", value: "Epic" },
            { trait_type: "Oil", value: 90 },
            { trait_type: "Power", value: 85 },
            { trait_type: "Speed", value: 80 },
            { trait_type: "Handling", value: 70 },
            { trait_type: "Storm Stability", value: 95 },
          ],
        };
      }
    } catch (err) {
      console.error(err);
      return undefined;
    } finally {
      setLoadData(false);
    }
  };

  useEffect(() => {
    const getData = async () => {
      const res = await getPreviewNft(data.tokenURI);
      if (res) setNftPreview(res);
    };

    getData();
  }, [data.tokenURI]);

  return (
    <>
      {!revealNFT ? (
        <div className="card bg-primary flex-1 shadow-sm rounded-xl overflow-hidden">
          <div
            className="relative h-64 w-full bg-primary rounded-t-lg"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {isHovered && nftPreview?.attributes && <ParticleBackground rarity={nftPreview.attributes[0]?.value} />}
            {nftPreview?.image ? (
              <Image src={nftPreview.image} alt={nftPreview.name} fill={true} className="object-contain p-4" />
            ) : (
              <div className="skeleton w-full h-full rounded-b-none" />
            )}
          </div>
          <div className="card-body p-5">
            <h2 className="card-title text-center text-lg font-bold">{data.tokenId.toString()}</h2>
            <p className="text-gray-600">{nftPreview?.description}</p>
          </div>
        </div>
      ) : loadData ? (
        <PlaceHolderNftCard />
      ) : (
        (selectedRarity === "all" || selectedRarity.toLowerCase() === nftPreview?.attributes[0]?.value.toLowerCase()) && (
          <div className="card bg-primary flex-1 shadow-sm rounded-xl overflow-hidden">
            <div
              className="relative h-64 w-full bg-primary rounded-t-lg"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              {isHovered && nftPreview?.attributes && <ParticleBackground rarity={nftPreview.attributes[0]?.value} />}
              {nftPreview?.image ? (
                <Image src={nftPreview.image} alt={nftPreview.name} fill={true} className="object-contain p-4" />
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
              {nftPreview?.attributes?.slice(1).map((x, y) => (
                <div key={y} className="flex flex-col">
                  <span className="font-semibold">{x.trait_type.toString()}</span>
                  <div className="flex items-center justify-center gap-5">
                    <progress className="progress progress-success" value={x.value} max="100" />
                    <span className="font-semibold">{x.value}/100</span>
                  </div>
                </div>
              ))}

              <div className="grid grid-cols-2 gap-3 mt-5">
                <button
                  onClick={() => setShowRace(true)}
                  className="bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-md font-medium transition-colors"
                >
                  Start Virtual Race
                </button>
                <button className="bg-amber-500 hover:bg-amber-600 text-white py-2 rounded-md font-medium transition-colors">
                  Claim Reward
                </button>
              </div>
            </div>
          </div>
        )
      )}

      {showRace && (
        <VirtualRace
          ship={nftPreview}
          onClose={() => setShowRace(false)}
        />
      )}
    </>
  );
};

export default NftCard;



// QmYMeFEEi5ADFNsFGxdTCCS1ohEbK122u48X9FF7q4MQ16