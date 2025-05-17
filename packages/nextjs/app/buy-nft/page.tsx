"use client";

import Image from "next/image";
import { NextPage } from "next";
import { useAccount } from "wagmi";
import { BanknotesIcon } from "@heroicons/react/24/outline";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

const BuyNft: NextPage = () => {
  const { address } = useAccount();

  //smart contract
  const { data: nextTokenId } = useScaffoldReadContract({
    contractName: "RoninZodiacs",
    functionName: "nextTokenId",
  });

  const { writeContractAsync: writeRoninZodiacsAsync } = useScaffoldWriteContract({ contractName: "RoninZodiacs" });

  //functions
  const handleBuyNft = async () => {
    try {
      await writeRoninZodiacsAsync({
        functionName: "safeMint",
        args: [address],
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <section className="flex justify-center flex-col items-center h-screen w-full">
      <div className="card bg-base-100 w-96 shadow-sm">
        <div className="relative h-64 w-full bg-white rounded-t-2xl">
          <Image
            src="https://cuteroot.com/cdn/shop/products/Mystery_1024x.png?v=1622141560"
            alt="mistery"
            fill={true}
          />
        </div>

        <div className="card-body">
          <h2 className="text-center font-bold text-2xl">NFT #{nextTokenId}</h2>
          <p className="text-center font-semibold">The NFT will be disclosed after 48 hours.</p>
          <div className="card-actions justify-center">
            <button className="btn btn-primary px-10 flex gap-2" onClick={() => handleBuyNft()}>
              <BanknotesIcon className="w-4 h-4" />
              Buy NFT
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BuyNft;
