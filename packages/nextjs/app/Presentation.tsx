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
              <h1 className="text-6xl font-semibold">Car Game</h1>
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
            <h3 className="text-center text-3xl font-semibold">What is car games?</h3>
            <p className="px-28 text-lg indent-8 text-center">
              Car Games is a competitive game based on NFTs, where players participate in exciting races against three
              virtual machines, forming a total of four racers. Each NFT represents a car with unique statistics and
              four different configurations, which influences performance on the track.
            </p>

            <article className="flex gap-5 mx-4 mt-8">
              <div className="card bg-base-100 shadow-sm flex-1">
                <figure className="w-full">
                  <motion.img
                    src="https://coin-images.coingecko.com/coins/images/55344/large/ronen_profile.jpg?1745512221"
                    alt="Shoes"
                    className="w-full object-cover h-64"
                    whileHover={{ rotateY: [0, 360] }}
                    transition={{ duration: 1, ease: "easeInOut" }}
                  />
                </figure>
                <div className="card-body">
                  <h2 className="card-title">Basado en la red de Ronin</h2>
                  <p>Para mayor velocidad y seguirdad</p>
                </div>
              </div>

              <div className="card bg-base-100 shadow-sm flex-1">
                <figure>
                  <motion.img
                    src="https://static.vecteezy.com/system/resources/thumbnails/005/146/542/small_2x/winner-cups-in-pixel-art-style-vector.jpg"
                    alt="Shoes"
                    className="w-full object-cover h-64"
                    whileHover={{ rotateY: [0, 360] }}
                    transition={{ duration: 1, ease: "easeInOut" }}
                  />
                </figure>
                <div className="card-body">
                  <h2 className="card-title">Win Rate and Balance of Power</h2>
                  <p>
                    The win rate is determined by the rarity of the car. It would make no sense for a common car to beat
                    an epic, so the balance of power remains logical.
                  </p>
                </div>
              </div>

              <div className="card bg-base-100 shadow-sm flex-1">
                <figure>
                  <motion.img
                    src="https://logowik.com/content/uploads/images/ronin-wallet-icon5932.jpg"
                    alt="Shoes"
                    className="w-full object-cover h-64"
                    whileHover={{ rotateY: [0, 360] }}
                    transition={{ duration: 1, ease: "easeInOut" }}
                  />
                </figure>
                <div className="card-body">
                  <h2 className="card-title">Token Mechanics</h2>
                  <p>
                    The token will have a fee-based buyback system, which will allow stability within the game and
                    strengthen its financial ecosystem. Car Games is not only a speed race, but a game of strategy where
                    decisions about fuel, rarity and reward withdrawal make the difference in the success of the
                    players.
                  </p>
                </div>
              </div>
            </article>
          </section>
        </>
      )}
    </main>
  );
};

export default Presentation;
