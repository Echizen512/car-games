import { useEffect, useState } from "react";
import Image from "next/image";
import PlaceHolderNftCard from "./PlaceHolderNftCard";
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

//TODO: Aqui debo recibir el select filter y si actualmente esta discover
const NftCard: NextPage<NftCardProps> = ({ data, revealNFT, selectedRarity }) => {
  //effects
  const [nftPreview, setNftPreview] = useState<INftPreview | undefined>(undefined);
  const [loadData, setLoadData] = useState<boolean>(false);

  //functions
  const getPreviewNft = async (tokenUri: string) => {
    try {
      setLoadData(true);
      const CID = tokenUri.replace("ipfs://", "");

      const req = await fetch(`https://gateway.pinata.cloud/ipfs/${CID}`);
      const res: INftPreview = await req.json();
      return res;
    } catch (err) {
      console.log(err);
      return undefined;
    } finally {
      setLoadData(false);
    }
  };

  //effects
  useEffect(() => {
    const getData = async () => {
      const res = await getPreviewNft(data.tokenURI);

      setNftPreview(res);
    };

    getData();
  }, [data.tokenURI]);

  return !revealNFT ? (
    <div className="card bg-base-100 flex-1 shadow-sm">
      {nftPreview?.image !== undefined ? (
        <div className="relative h-60 w-full rounded-t-md">
          <Image src={nftPreview.image} alt={nftPreview.name} fill={true} />
        </div>
      ) : (
        <div className="skeleton w-full h-full rounded-b-none" />
      )}
      <div className="card-body">
        <h2 className="card-title">{data.tokenId.toString()}</h2>
        <p>{nftPreview?.description}</p>
      </div>
    </div>
  ) : loadData ? (
    <PlaceHolderNftCard />
  ) : (
    (selectedRarity === "all" || selectedRarity.toLowerCase() === nftPreview?.attributes[0].value.toLowerCase()) && (
      <div className="card bg-base-100 flex-1 shadow-sm">
        {nftPreview?.image !== undefined ? (
          <div className="relative h-60 w-full rounded-t-md">
            <Image src={nftPreview.image} alt={nftPreview.name} fill={true} />
          </div>
        ) : (
          <div className="skeleton w-full h-full rounded-b-none" />
        )}
        <div className="card-body">
          <h2 className="card-title">{data.tokenId.toString()}</h2>
          <p>{nftPreview?.description}</p>

          {revealNFT !== undefined && revealNFT && (
            <div className="flex items-center justify-center gap-5 px-2">
              <progress className="progress progress-success" value="40" max="100" />
              <p className="font-semibold">80/120</p>
            </div>
          )}
        </div>
      </div>
    )
  );
};

// QmYMeFEEi5ADFNsFGxdTCCS1ohEbK122u48X9FF7q4MQ16
export default NftCard;
