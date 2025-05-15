import { useEffect, useState } from "react";
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
    <main className="w-screen h-screen flex justify-center items-center flex-col">
      {!load ? (
        <span className="loading loading-spinner loading-xl text-warning" />
      ) : (
        <>
          <motion.section
            className="absolute flex flex-col justify-end w-full h-full pointer-events-none overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 0.5,
              delay: 0.1,
              ease: "easeInOut",
            }}
          >
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
                className="absolute w-36 h-36 mx-12"
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

            <div className="w-full h-32">
              <img
                src="https://png.pngtree.com/background/20220726/original/pngtree-road-vector-highway-background-line-picture-image_1817249.jpg"
                className="w-full h-full object-cover "
              />
            </div>
          </motion.section>

          <section className="flex flex-col gap-10 justify-center items-center mb-24">
            <h1 className="text-6xl font-semibold">Car Game</h1>
            <h3>Connect your wallet just now!</h3>

            <RainbowKitCustomConnectButton />
          </section>
        </>
      )}
    </main>
  );
};

export default Presentation;
