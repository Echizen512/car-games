import { useEffect, useState } from "react";
import Image from "next/image";
import { NextPage } from "next";
import { INftPreview } from "~~/types/nft-data";

type NftCardProps = {
  data: {
    tokenId: bigint;
    tokenURI: string;
  };
};

const NftCard: NextPage<NftCardProps> = ({ data }) => {
  //effects
  const [nftPreview, setNftPreview] = useState<INftPreview | undefined>(undefined);

  //functions
  const getPreviewNft = async (tokenUri: string) => {
    try {
      const CID = tokenUri.replace("ipfs://", "");

      const req = await fetch(`https://gateway.pinata.cloud/ipfs/${CID}`);
      const res: INftPreview = await req.json();
      return res;
    } catch (err) {
      console.log(err);
      return undefined;
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

  console.log(nftPreview);
  return (
    <div className="card bg-base-100 flex-1 shadow-sm">
      {nftPreview?.image !== undefined ? (
        <Image src={nftPreview.image} alt={nftPreview.name} fill={true} height={100} />
      ) : (
        // <figure>
        //   <img src={nftPreview.image} alt="Shoes" />
        // </figure>
        <div className="skeleton w-full h-full rounded-b-none" />
      )}
      <div className="card-body">
        <h2 className="card-title">{data.tokenId.toString()}</h2>
        <p>{nftPreview?.description}</p>

        <div className="flex items-center justify-center gap-5 px-2">
          <progress className="progress progress-success" value="40" max="100" />
          <p className="font-semibold">80/120</p>
        </div>
      </div>
    </div>
  );
};

export default NftCard;
