import { useEffect, useState } from "react";
import Image from "next/image";
import ParticleBackground from "./ParticleBackground";
import PlaceHolderNftCard from "./PlaceHolderNftCard";
// import VirtualRace from "./VirtualRace";
import { NextPage } from "next";
import { INftPreview } from "~~/types/nft-data";

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

  // const commonCarConfigs = [
  //   { speed: 45, handling: 45, grip: 20, acceleration: 10 },
  //   { speed: 15, handling: 25, grip: 40, acceleration: 40 },
  //   { speed: 10, handling: 50, grip: 10, acceleration: 50 },
  //   { speed: 30, handling: 30, grip: 30, acceleration: 30 },
  // ];

  const getPreviewNft = async (tokenUri: string) => {
    try {
      setLoadData(true);
      const CID = tokenUri.replace("ipfs://", "");
      const req = await fetch(`https://gateway.pinata.cloud/ipfs/${CID}`);
      const res: INftPreview = await req.json();
      return res;
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
      setNftPreview(res);
    };

    getData();
  }, [data.tokenURI]);

  return !revealNFT ? (
    <div className="card flex-1 bg-base-300 text-base-content shadow-sm rounded-xl overflow-hidden">
      <div
        className="relative h-64 w-full rounded-t-lg"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {nftPreview?.image ? (
          <Image src={nftPreview.image} alt={nftPreview.name} fill={true} className="object-contain p-4 bg-white" />
        ) : (
          <div className="skeleton w-full h-full rounded-b-none" />
        )}
      </div>
      <div className="card-body p-5">
        <h2 className=" text-center text-lg font-bold">{nftPreview?.name.toString()}</h2>
        {/* <p>{nftPreview?.description}</p> */}
      </div>
    </div>
  ) : loadData ? (
    <PlaceHolderNftCard />
  ) : (
    (selectedRarity === "all" || selectedRarity.toLowerCase() === nftPreview?.attributes[0]?.value.toLowerCase()) && (
      <div className="card bg-base-300 flex-1 shadow-sm rounded-xl overflow-hidden">
        <div
          className="relative h-64 w-full bg-white rounded-t-lg"
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
          <h2 className=" text-center text-lg font-bold">{nftPreview?.name.toString()}</h2>

          {/* <p className="text-white">{nftPreview?.description}</p> */}

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
              className="bg-rose-600 hover:bg-rose-700 text-white py-2 rounded-md font-medium transition-colors"
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
  );
};

export default NftCard;
