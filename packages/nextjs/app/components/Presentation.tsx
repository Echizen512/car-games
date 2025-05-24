import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { NextPage } from "next";
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
              <Image src="/favicon.png" alt="Ronken Logo" width={100} height={100} className="mx-auto mt-2" />
              <h1 className="text-6xl font-semibold">Ronken Ships</h1>

              <span className="w-4/12 text-center">
                Get ready for battle on the high seas. Face the challenge, claim your place and win great rewards in
                $RKS.
              </span>

              <div className="scale-125">
                <RainbowKitCustomConnectButton />
              </div>
            </motion.article>

            {/* ships */}
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
                ></motion.span>
              </div>
            </div>
          </motion.section>
        </>
      )}
    </main>
  );
};

export default Presentation;
