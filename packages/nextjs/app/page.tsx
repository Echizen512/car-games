"use client";

import React, { useState } from "react";
// import CarCard from "./components/CarCard";
// import { carData } from "./data/carData";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import NftCard from "~~/components/NftCard";
// import { BugAntIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
// import { Address } from "~~/components/scaffold-eth";
import { useScaffoldContract, useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

const Home: NextPage = () => {
  const { address } = useAccount();
  const [selectedRarity, setSelectedRarity] = useState<string>("all");

  const rarityTypes = ["All", "Common", "Uncommon", "Rare", "Epic"];

  //smart contract
  const { data: userNFTs } = useScaffoldReadContract({
    contractName: "RoninZodiacs",
    functionName: "getUserNFTs",
    args: [address],
  });

  const { data: userBalance } = useScaffoldReadContract({
    contractName: "Finance",
    functionName: "balances",
    args: [address],
  });

  const { data: revealNFT } = useScaffoldReadContract({
    contractName: "RoninZodiacs",
    functionName: "reveal",
  });

  const { data: maxNftID } = useScaffoldReadContract({
    contractName: "RoninZodiacs",
    functionName: "nextTokenId",
  });

  const { data: zodiacContract } = useScaffoldContract({ contractName: "RoninZodiacs" });

  //write smart
  const { writeContractAsync: writeRoninZodiacsAsync } = useScaffoldWriteContract({ contractName: "RoninZodiacs" });

  //functions
  const updateOpenSeaMetaData = async () => {
    if (maxNftID === undefined) return;
    for (let i = 0; i < maxNftID; i++) {
      await fetch(
        `https://testnets-api.opensea.io/api/v2/chain/saigon_testnet/contract/${zodiacContract?.address}/nfts/${i}/refresh`,
        { method: "POST" },
      );
    }
  };

  return (
    <section className="flex flex-col w-full h-full">
      <article className="flex gap-5 mt-2 w-full justify-center">
        {rarityTypes.map((x, y) => (
          <button
            key={y}
            onClick={() => setSelectedRarity(x.toLowerCase())}
            className={`${selectedRarity.toLowerCase() === x.toLowerCase() ? "btn-primary" : "btn-secondary"} btn w-28`}
          >
            {x}
          </button>
        ))}
      </article>

      <button
        className="btn btn-warning w-40 mt-5 mx-auto"
        onClick={async () => {
          try {
            await writeRoninZodiacsAsync({
              functionName: "disclose",
            });

            await updateOpenSeaMetaData();
          } catch (err) {
            console.log(err);
          }
        }}
        // disabled={revealNFT}
      >
        Disclose All NFT
      </button>

      <article className="flex gap-5 mt-2 w-full justify-center">
        <h2 className="text-xl font-bold">
          Your Balance: {userBalance ? `${userBalance.toString()} Ronin` : "0 (RON)"}
        </h2>
      </article>

      <section className="grid grid-cols-4 p-5 gap-2">
        {userNFTs?.map((data, key) => (
          <NftCard key={key} data={data} revealNFT={revealNFT} selectedRarity={selectedRarity} />
        ))}
      </section>

      {/* <div className="grow bg-base-300 w-full mt-12 px-8 py-12"> */}
      {/* <div className="flex flex-col items-center">
          <h2 className="text-3xl font-bold mb-4">Car Collection</h2>
          <div className="flex gap-2 mb-6">
            {rarityTypes.map(rarity => (
              <button
                key={rarity}
                onClick={() => setSelectedRarity(rarity.toLowerCase())}
                className={`btn btn-primary  rounded-lg font-medium transition-colors ${
                  selectedRarity === rarity.toLowerCase()
                    ? "bg-rose-600 text-white"
                    : "bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                {rarity}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCars.map(car => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        </div>
      </div> */}
    </section>
  );
};

// function NftGallery({ nose }) {
//   const [previews, setPreviews] = useState({});

//   useEffect(() => {
//     async function fetchPreviews() {
//       const previewData = {};

//       for (const x of nose) {
//         const preview = await getPreviewNft(x.tokenURI);
//         previewData[x.tokenId] = preview; // Guardar cada NFT con su ID
//       }

//       setPreviews(previewData);
//     }

//     fetchPreviews();
//   }, [nose]);

//   return (
//     <div>
//       {nose?.map((x, y) => {
//         const res = previews[x.tokenId]; // Obtener los datos del NFT ya procesado

//         return (
//           <div key={y} className="card bg-base-100 w-96 shadow-sm">
//             <figure>
//               <img src={res?.image} alt="NFT" />
//             </figure>
//             <div className="card-body">
//               <h2 className="card-title">{x.tokenId.toString()}</h2>
//               <p>Descripción del NFT</p>
//               <div className="card-actions justify-end">
//                 <button className="btn btn-primary">Comprar</button>
//               </div>
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   );
// }

export default Home;
