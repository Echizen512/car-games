import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { NextPage } from "next";
import { useWindowSize } from "usehooks-ts";
import { ChevronDoubleDownIcon } from "@heroicons/react/24/outline";
import { RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";

const Presentation: NextPage = () => {
  const { height } = useWindowSize();

  //states
  const [load, setLoad] = useState(false);

  //effects
  useEffect(() => {
    console.log(height);
    setLoad(true);
  }, []);

  return (
    <main className="flex flex-col justify-center items-center">
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
              className="flex flex-col gap-5 justify-center items-center mb-24 pointer-events-auto"
            >
              <h1 className="text-6xl font-semibold">Ronin Zodiacs</h1>
              <h3>Connect your wallet just now!</h3>

              <RainbowKitCustomConnectButton />
            </motion.article>

            <div className="flex justify-center top-14">
              <motion.img
                initial={{ x: 800 }}
                animate={{ x: 0 }}
                transition={{
                  duration: 8,
                  delay: 0.0,
                  ease: "easeInOut",
                }}
                src="https://i.seadn.io/s/raw/files/cdb5b18209009ac660230e86f8bea7df.png?auto=format&dpr=1&w=1920"
                alt="car blue"
                className=" w-36 h-36 mx-12"
              />

              <motion.img
                initial={{ x: 800 }}
                animate={{ x: 0 }}
                transition={{
                  duration: 8,
                  delay: 0.2,
                  ease: "easeInOut",
                }}
                src="https://i.seadn.io/s/raw/files/5b09658aed66253886ec4697a462b025.png?auto=format&dpr=1&w=1920"
                alt="car blue"
                className=" w-36 h-36 mx-12"
              />
              <motion.img
                initial={{ x: 800 }}
                animate={{ x: 0 }}
                transition={{
                  duration: 8,
                  delay: 0.4,
                  ease: "easeInOut",
                }}
                src="https://i.seadn.io/s/raw/files/191b602f782fd7362af9e508a2805f5a.png?auto=format&dpr=1&w=1920"
                alt="car blue"
                className=" w-36 h-36 mx-12"
              />
            </div>

            <div className="w-full h-32 relative z-10">
              <img
                src="https://png.pngtree.com/background/20220726/original/pngtree-road-vector-highway-background-line-picture-image_1817249.jpg"
                className="w-full h-full object-cover z-20"
                alt="carretera prestada"
              />

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

    <section className="mt-12">
  <h3 className="text-center text-3xl font-semibold">What is Ronin Zodiacs?</h3>
  <div className="text-center mb-12">
    <img src="/ronin.png" alt="NFT Racing Logo" className="mx-auto mb-4 w-20 h-auto" />
    <p className="text-lg">
      🚀 Ronin Zodiacs is a competitive game where your NFTs come to life in a fierce race against 3 virtual machines. With different rarities, strategic fuel consumption, and a reward system with optimized tokenomics, each race will push you to the limit.
    </p>
  </div>

  <div className="flex gap-6 justify-center mb-4">
    {/* Card Game Mode */}
    <div className="bg-primary shadow-lg rounded-lg overflow-hidden transform hover:-translate-y-2 transition duration-500 w-80">
      <img src="/game-mode.png" alt="Game Mode 🎮" className="w-full h-44" />
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">Game Mode 🎮</h2>
        <p className="text-justify">
          🏎️ In each match, you will compete against 3 virtual machines, ensuring a total of 4 racers on the competition leaderboard.
          🏆 The top 3 places will receive token rewards:
        </p>
        <ul className="list-disc pl-5">
          <li className='mb-3'>🥇 <span className="font-bold">1st place:</span> 10 tokens</li>
          <li className='mb-3'>🥈 <span className="font-bold">2nd place:</span> 7.5 tokens</li>
          <li className='mb-3'>🥉 <span className="font-bold">3rd place:</span> 5 tokens</li>
        </ul>
      </div>
    </div>

    {/* Card Fuel System */}
    <div className="bg-primary shadow-lg rounded-lg overflow-hidden transform hover:-translate-y-2 transition duration-500 w-80">
      <img src="/game-system.jpg" alt="Fuel System ⛽" className="w-full h-44" />
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">Fuel System ⛽</h2>
        <p className="text-justify">
          The amount of fuel depends on the rarity of the NFT. Each race consumes 15 fuel, so strategic management will be key:
        </p>
        <ul className="list-disc pl-5">
          <li className='mb-2'>🟢 <span className="font-bold">Common:</span> 30 fuel</li>
          <li className='mb-2'>🔵 <span className="font-bold">Uncommon:</span> 45 fuel</li>
          <li className='mb-2'>🟣 <span className="font-bold">Rare:</span> 60 fuel</li>
          <li className='mb-2'>🟠 <span className="font-bold">Epic:</span> 75 fuel</li>
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
          <li className='mb-3'>🚨 <span className="font-bold">Immediate withdrawal:</span> 50% penalty</li>
          <li className='mb-3'>⏳ <span className="font-bold">After 24 hours:</span> 30%</li>
          <li className='mb-3'>🔄 <span className="font-bold">After 48 hours:</span> 20%</li>
          <li className='mb-3'>✅ <span className="font-bold">After 72 hours:</span> Only 5%</li>
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
