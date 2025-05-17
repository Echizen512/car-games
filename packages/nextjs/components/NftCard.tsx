import { useEffect, useState } from "react";
import { NextPage } from "next";

type NftPreview = { name: string; description: string; image: string };

type NftCardProps = {
  data: {
    tokenId: bigint;
    tokenURI: string;
  };
};

const NftCard: NextPage<NftCardProps> = ({ data }) => {
  //effects
  const [nftPreview, setNftPreview] = useState<NftPreview | undefined>(undefined);

  //functions
  const getPreviewNft = async (tokenUri: string) => {
    try {
      const CID = tokenUri.replace("ipfs://", "");

      const req = await fetch(`https://gateway.pinata.cloud/ipfs/${CID}`);
      const res: NftPreview = await req.json();
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

  return (
    <div className="card bg-base-100 flex-1 shadow-sm">
      {nftPreview?.image !== undefined ? (
        <figure>
          <img src={nftPreview.image} alt="Shoes" />
        </figure>
      ) : (
        <div className="skeleton w-full h-full rounded-b-none" />
      )}
      <div className="card-body">
        <h2 className="card-title">{data.tokenId.toString()}</h2>
        <p>{nftPreview?.description}</p>
        {/* <div className="card-actions justify-end">
          <button className="btn btn-primary">Buy Now</button>
        </div> */}
      </div>
    </div>
  );
};

export default NftCard;
