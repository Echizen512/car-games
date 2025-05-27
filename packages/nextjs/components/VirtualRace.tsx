import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import Confetti from "react-confetti";

interface Ship {
  id: string;
  name: string;
  type: string;
  image?: string;
  stats: {
    oil: number;
    power: number;
    speed: number;
    handling: number;
    stormStability: number;
  };
}

interface RacerPosition {
  id: string;
  name: string;
  position: number;
  image?: string;
  stats: {
    oil: number;
    power: number;
    speed: number;
    handling: number;
    stormStability: number;
  };
}

interface VirtualRaceProps {
  ship: Ship;
  onClose: () => void;
}

const configurations = [
  ["Common", "Common", "Epic"],
  ["Uncommon", "Uncommon", "Rare"],
  ["Epic", "Rare", "Common"],
  ["Common", "Rare", "Uncommon"],
];

const selectedConfig = configurations[Math.floor(Math.random() * configurations.length)];

const getStatsByCategory = (category: string) => {
  switch (category) {
    case "Common":
      return { oil: 60, power: 65, speed: 70, handling: 60, stormStability: 65 };
    case "Uncommon":
      return { oil: 70, power: 75, speed: 80, handling: 70, stormStability: 75 };
    case "Rare":
      return { oil: 80, power: 85, speed: 90, handling: 80, stormStability: 85 };
    case "Epic":
      return { oil: 90, power: 95, speed: 100, handling: 90, stormStability: 95 };
    default:
      return { oil: 50, power: 55, speed: 60, handling: 50, stormStability: 55 };
  }
};

const opponents = (ship: Ship) => [
  {
    id: ship.id,
    name: ship.name,
    position: 4,
    stats: {
      oil: ship.stats?.oil || 50,
      power: ship.stats?.power || 50,
      speed: ship.stats?.speed || 50,
      handling: ship.stats?.handling || 50,
      stormStability: ship.stats?.stormStability || 50,
    },
    image: ship.image,
  },
  ...availableOpponents,
];

const opponentNames = ["Falcon Fury", "Neon Phantom", "Shadow Blade", "Cosmic Titan"];

const getImageByCategory = (category: string) => {
  switch (category) {
    case "Common":
      return "/NFT.png";
    case "Uncommon":
      return "/NFT2.png";
    case "Rare":
      return "/NFT3.png";
    case "Epic":
      return "/NFT4.png";
    default:
      return "/NFT5.png";
  }
};

const availableOpponents = selectedConfig.map((category, index) => ({
  id: `opponent${index + 1}`,
  name: opponentNames[index % opponentNames.length],
  position: index + 1,
  image: getImageByCategory(category),
  stats: getStatsByCategory(category),
}));

const VirtualRace: React.FC<VirtualRaceProps> = ({ ship, onClose }) => {
  //states
  const [positions, setPositions] = useState<RacerPosition[]>([]);
  const [countdown, setCountdown] = useState<string | number>("READY");
  const [isRacing, setIsRacing] = useState(false);
  const [raceTime, setRaceTime] = useState(30);
  const [triggerAnimation, setTriggerAnimation] = useState(0);
  const [playerPosition, setPlayerPosition] = useState<string | null>(null);
  const [isShipVisible, setIsShipVisible] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);
  const [confettiPieces, setConfettiPieces] = useState(0);
  const previousPositionsRef = useRef<RacerPosition[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playbackRate, setPlaybackRate] = useState(1);

  const fondoRef = useRef<HTMLVideoElement>(null);
  const frenteRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const fondoVideo = fondoRef.current;
    const frenteVideo = frenteRef.current;

    if (!fondoVideo || !frenteVideo) return;

    const handleEnded = () => {
      setPlaybackRate(prev => {
        const newRate = Math.min(prev + 0.5, 2);
        fondoVideo.playbackRate = newRate;
        frenteVideo.playbackRate = newRate;
        return newRate;
      });

      fondoVideo.currentTime = 0;
      frenteVideo.currentTime = 0;

      fondoVideo.play().catch(error => console.error("Error reiniciando fondo.mp4:", error));
      frenteVideo.play().catch(error => console.error("Error reiniciando frente.webm:", error));
    };

    fondoVideo.addEventListener("ended", handleEnded);
    frenteVideo.addEventListener("ended", handleEnded);

    return () => {
      fondoVideo.removeEventListener("ended", handleEnded);
      frenteVideo.removeEventListener("ended", handleEnded);
    };
  }, []);

  useEffect(() => {
    if (ship) setPositions(opponents(ship));
    setPositions(opponents(ship));
  }, [ship]);

  useEffect(() => {
    if (countdown === "READY") {
      setTimeout(() => setCountdown(3), 2000);
    } else if (typeof countdown === "number" && countdown > 0) {
      setTimeout(() => setCountdown(prev => (typeof prev === "number" ? prev - 1 : prev)), 1000);
    } else if (countdown === 0) {
      setIsRacing(true);
    }
  }, [countdown]);

  useEffect(() => {
    const fondoVideo = fondoRef.current;
    const frenteVideo = frenteRef.current;

    if (!fondoVideo || !frenteVideo) return;

    if (isRacing && raceTime > 0) {
      fondoVideo.play().catch(error => console.error("Error playing fondo.mp4:", error));
      frenteVideo.play().catch(error => console.error("Error playing frente.webm:", error));
    } else if (raceTime <= 0) {
      fondoVideo.pause();
      frenteVideo.pause();
      fondoVideo.currentTime = 0;
      frenteVideo.currentTime = 0;
    }
  }, [isRacing, raceTime]);

  useEffect(() => {
    if (!isRacing) return;

    const raceInterval = setInterval(() => {
      setRaceTime(prev => {
        if (prev <= 0) {
          clearInterval(raceInterval);
          const player = positions.find(racer => racer.id === ship.id);
          if (player) {
            switch (player.position) {
              case 1:
                setShowConfetti(true);
                setConfettiPieces(200);
                setPlayerPosition("First Place");
                break;
              case 2:
                setShowConfetti(true);
                setConfettiPieces(100);
                setPlayerPosition("Second Place");
                break;
              case 3:
                setShowConfetti(true);
                setConfettiPieces(50);
                setPlayerPosition("Third Place");
                break;
              case 4:
                setPlayerPosition("Fourth Place");
                break;
              default:
                setPlayerPosition("Unknown Place");
            }
          }
          return 0;
        }
        return prev - 1;
      });

      if (raceTime > 0 && raceTime % 5 === 0) {
        setPositions(prev => {
          previousPositionsRef.current = [...prev];
          const shuffled = [...prev].sort(() => Math.random() - 0.5);
          return shuffled.map((racer, index) => ({
            ...racer,
            position: index + 1,
          }));
        });
        setTriggerAnimation(prev => prev + 1);
      }
    }, 1000);

    return () => clearInterval(raceInterval);
  }, [isRacing, raceTime, positions, ship.id]);

  const getTranslateY = (racer: RacerPosition) => {
    const previousPosition = previousPositionsRef.current.find(p => p.id === racer.id)?.position || racer.position;
    const positionDiff = previousPosition - racer.position;
    return positionDiff * 60;
  };

  const getPositionCircle = (position: number) => {
    switch (position) {
      case 1:
        return <span className="w-3 h-3 rounded-full bg-red-500 inline-block mr-2"></span>;
      case 2:
        return <span className="w-3 h-3 rounded-full bg-blue-500 inline-block mr-2"></span>;
      case 3:
        return <span className="w-3 h-3 rounded-full bg-yellow-500 inline-block mr-2"></span>;
      default:
        return null;
    }
  };

  // const handleWinner = async () => {
  //   try {
  //     const req = await fetch("api/reward");
  //     const res = await req.json();

  //     console.log(res);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  // useEffect(() => {
  //   handleWinner();
  // }, []);

  return (
    <motion.div className="fixed top-0 left-0 bg-black/60 flex items-center justify-center w-screen h-screen overflow-hidden z-50">
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          numberOfPieces={confettiPieces}
          recycle={false}
        />
      )}

      <div className="rounded-lg w-full max-w-3xl">
        <div className="rounded-t-lg h-80 w-full relative">
          {/* container video */}
          <div className="relative h-full w-full flex items-center justify-center">
            {raceTime <= 0 && (
              <button
                onClick={() => setIsShipVisible(!isShipVisible)}
                className="btn btn-accent absolute top-4 left-4 z-[200]"
              >
                {isShipVisible ? "Hide Ship" : "Show Ship"}
              </button>
            )}

            <video
              ref={fondoRef}
              src="/fondo.mp4"
              className="w-full h-full object-fill absolute top-0 left-0 z-[1]"
              preload="auto"
              muted
              playsInline
            />

            <video
              ref={frenteRef}
              src="/frente.webm"
              className="absolute top-0 left-0 w-full h-full object-cover z-[3]"
              preload="auto"
              muted
              playsInline
            />
            {isShipVisible && (
              <motion.img
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                src={ship.image ?? ""}
                alt={ship.name}
                className="absolute bottom-[40px] left-[100px] z-1"
                width={150}
                height={150}
              />
            )}
          </div>
          {countdown !== 0 && (
            <div className="absolute inset-0 flex items-center justify-center z-50">
              <span className="text-5xl font-bold text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">{countdown}</span>
            </div>
          )}
          {raceTime === 0 && playerPosition && (
            <div className="absolute inset-0 flex items-center justify-center z-50">
              <span className="text-6xl font-bold text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
                {playerPosition}
              </span>
            </div>
          )}
        </div>

        <div className="bg-neutral-800 p-4">
          <div className="space-y-2">
            {positions.map(racer => {
              const translateY = getTranslateY(racer);
              return (
                <div
                  key={`${racer.id}-${triggerAnimation}`}
                  className={`flex items-center gap-4 p-2 rounded animate-flip-move ${racer.id === ship.id ? "bg-yellow-500/20" : ""
                    }`}
                  style={{ "--startY": `${translateY}px` } as React.CSSProperties}
                >
                  {getPositionCircle(racer.position)}
                  {racer.image ? (
                    <Image
                      src={racer.image}
                      alt={racer.name}
                      className="rounded-full object-cover"
                      width={30}
                      height={30}
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-700"></div>
                  )}
                  <div className="flex-1">
                    <div className="text-white font-medium">{racer.name}</div>
                    <div className="grid grid-cols-5 gap-4 mt-1">
                      <div className="text-gray-400 text-sm">Fuel: {racer.stats.oil}</div>
                      <div className="text-gray-400 text-sm">Power: {racer.stats.power}</div>
                      <div className="text-gray-400 text-sm">Speed: {racer.stats.speed}</div>
                      <div className="text-gray-400 text-sm">Handling: {racer.stats.handling}</div>
                      <div className="text-gray-400 text-sm">Storm Stability: {racer.stats.stormStability}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-neutral-800 p-4 rounded-b-lg flex items-center justify-between">
          <div className="text-white text-xl font-medium">
            {raceTime > 0 ? `Time: ${raceTime}$` : "Finished Career."}
          </div>
          {raceTime <= 0 && (
            <button onClick={onClose} className="btn btn-error text-white">
              Exit Race
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default VirtualRace;
