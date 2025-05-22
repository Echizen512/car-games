import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { NextPage } from "next";
import { ChevronDoubleDownIcon } from "@heroicons/react/24/outline";
import { RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";

const Presentation: NextPage = () => {
  //states
  const [load, setLoad] = useState(false);

  //effects
  useEffect(() => {
    setLoad(true);
  }, []);

  return (
    <main className="flex flex-col flex-1 justify-center items-center">
      {!load ? (
        <div className="w-screen h-screen flex justify-center items-center">
          <span className="loading loading-spinner loading-xl scale-105" />
        </div>
      ) : (
        <>
          <motion.section
            className={`h-screen w-full flex flex-col justify-end pointer-events-none overflow-x-hidden`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 0.5,
              delay: 0.1,
              ease: "easeInOut",
            }}
          >
            <motion.article
              initial={{ opacity: 0, scale: 0.3 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.5,
                delay: 0.1,
                ease: "easeInOut",
              }}
              className="flex flex-col gap-3 justify-center items-center mb-18 pointer-events-auto"
            >
              <img src="/ronin.png" alt="NFT Racing Logo" className="mx-auto mt-2 w-20 h-auto" />
              <h1 className="text-6xl font-semibold">Ronken Ships</h1>
              
              <span className="w-4/12 text-center">
                Get ready for battle on the high seas. Face the challenge, claim your place and win great rewards in
                $RKS.
              </span>

              <div className="scale-125">
                <RainbowKitCustomConnectButton />
              </div>
            </motion.article>

            {/* cars */}
            <div className="flex justify-center top-14">
              <motion.img
                initial={{ x: -800 }}
                animate={{ x: 0, y: 20 }}
                transition={{
                  duration: 8,
                  delay: 0.0,
                  ease: "easeInOut",
                }}
                src="/NFT.png"
                alt="ship"
                className=" w-36 h-36 mx-12"
              />

              <motion.img
                initial={{ x: -800 }}
                animate={{ x: 0 }}
                transition={{
                  duration: 8,
                  delay: 0.2,
                  ease: "easeInOut",
                }}
                src="NFT2.png"
                alt="ship"
                className=" w-36 h-36 mx-12"
              />
              <motion.img
                initial={{ x: -800 }}
                animate={{ x: 0 }}
                transition={{
                  duration: 8,
                  delay: 0.4,
                  ease: "easeInOut",
                }}
                src="NFT3.png"
                alt="ship"
                className=" w-36 h-36 mx-12"
              />
            </div>

            {/* Wave */}
            <Image src="/wave-haikei.png" width={1000} height={500} alt="wave" className="w-full h-40 absolute" />

            <div className="w-full h-32 relative z-10">
              <div className="w-full absolute bottom-0 flex justify-center items-center z-0">
                <motion.span
                  animate={{ scale: [1, 0.8, 1], y: [-6, 0, -6] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="btn btn-circle btn-ghost z-0"
                >
                  <ChevronDoubleDownIcon />
                </motion.span>
              </div>
            </div>
          </motion.section>

          {/* Title  */}
          <section className="mt-12">
            <h3 className="text-center text-3xl font-semibold">What is Ronken Ships?</h3>
            <div className="text-center mb-12 lg:w-6/12 mx-auto">
              <p className="text-lg text-justify">
                Ronken Ships is an NFT-powered racing game where your ship competes against three virtual rivals. With fuel strategy, rare ships, and token rewards, speed is key to victory! 🚢🏆
              </p>

              <span>
                For more details on the economics of the game and our long-term vision, see our white paper &nbsp;
                <a href="https://ronkeships.gitbook.io/ronkeships-whitepaper" className="link-info">
                  here
                </a>
              </span>
            </div>

            <div className="flex gap-6 justify-center mb-4">
              {/* Card Game Mode */}
              <div className="bg-primary shadow-lg rounded-lg overflow-hidden transform hover:-translate-y-2 transition duration-500 w-80">
                <img src="/game-mode.png" alt="Game Mode 🎮" className="w-full h-44" />
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Game Mode 🎮</h2>
                  <p className="text-justify">
                    🚢 In each race, you’ll face off against three virtual opponents, making a total of four contenders battling for victory. 🏆 The top three finishers will earn valuable token rewards, so strategy and speed are key to securing your place on the leaderboard!
                  </p>
                  <ul className="list-disc pl-5">
                    <li className="mb-3">
                      🥇 <span className="font-bold">1st place:</span> 
                    </li>
                    <li className="mb-3">
                      🥈 <span className="font-bold">2nd place:</span> 
                    </li>
                    <li className="mb-3">
                      🥉 <span className="font-bold">3rd place:</span> 
                    </li>
                  </ul>
                </div>
              </div>

              {/* Card Fuel System */}
              <div className="bg-primary shadow-lg rounded-lg overflow-hidden transform hover:-translate-y-2 transition duration-500 w-80">
                <img src="/game-system.jpg" alt="Fuel System ⛽" className="w-full h-44" />
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Fuel System ⛽</h2>
                  <p className="text-justify">
                    The amount of fuel depends on the rarity of the NFT. Each race consumes 15 fuel, so strategic
                    management will be key:
                  </p>
                  <ul className="list-disc pl-5">
                    <li className="mb-2">
                      🟢 <span className="font-bold">Common:</span> 30 fuel
                    </li>
                    <li className="mb-2">
                      🔵 <span className="font-bold">Uncommon:</span> 45 fuel
                    </li>
                    <li className="mb-2">
                      🟣 <span className="font-bold">Rare:</span> 60 fuel
                    </li>
                    <li className="mb-2">
                      🟠 <span className="font-bold">Epic:</span> 75 fuel
                    </li>
                  </ul>
                </div>
              </div>

              {/* Card Rewards System */}
              <div className="bg-primary shadow-xl rounded-lg overflow-hidden transform hover:-translate-y-2 transition duration-500 w-80">
                <img src="/rewards.png" alt="Rewards System 💰" className="w-full h-44" />
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4 text-white">Rewards System 💰</h2>
                  <p className="text-white text-lg text-justify">
                    To prevent massive dumping, token withdrawals have penalties based on waiting time:
                  </p>
                  <ul className="list-disc pl-5">
                    <li className="mb-3">
                      🚨 <span className="font-bold">Immediate withdrawal:</span> 50% penalty
                    </li>
                    <li className="mb-3">
                      ⏳ <span className="font-bold">After 24 hours:</span> 30%
                    </li>
                    <li className="mb-3">
                      🔄 <span className="font-bold">After 48 hours:</span> 20%
                    </li>
                    <li className="mb-3">
                      ✅ <span className="font-bold">After 72 hours:</span> Only 5%
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>
        </>
      )}
    </main>
  );
};

export default Presentation;
