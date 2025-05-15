"use client";

import React, { useState } from "react";
import Link from "next/link";
import CarCard from "./components/CarCard";
import { carData } from "./data/carData";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { BugAntIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Address } from "~~/components/scaffold-eth";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  const [selectedRarity, setSelectedRarity] = useState<string>("all");

  const filteredCars =
    selectedRarity === "all" ? carData : carData.filter(car => car.type.toLowerCase() === selectedRarity.toLowerCase());

  const rarityTypes = ["All", "Common", "Uncommon", "Rare", "Epic"];

  return (
    <>
      {/* <div className="grow bg-base-300 w-full mt-12 px-8 py-12">
        <div className="flex flex-col items-center">
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
    </>
  );
};

export default Home;
