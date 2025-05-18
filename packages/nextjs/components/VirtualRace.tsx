import React, { useEffect, useRef, useState } from "react";
import Confetti from "react-confetti";

interface Car {
  id: string;
  name: string;
  type: string;
  image?: string;
  stats: {
    handling: number;
    acceleration: number;
    speed: number;
    fuel: number;
    grip: number;
  };
}

interface RacerPosition {
  id: string;
  name: string;
  position: number;
  image?: string;
  stats: {
    handling: number;
    acceleration: number;
    speed: number;
    grip: number;
  };
}

interface VirtualRaceProps {
  car: Car;
  onClose: () => void;
}

const styles = `
  @keyframes flipReplace {
    0% { transform: perspective(500px) rotateX(0deg); opacity: 1; }
    50% { transform: perspective(500px) rotateX(180deg); opacity: 0.5; }
    100% { transform: perspective(500px) rotateX(360deg); opacity: 1; }
  }

  @keyframes movePosition {
    0% { transform: translateY(var(--startY)); }
    100% { transform: translateY(0); }
  }

  .animate-flip-move {
    animation: flipReplace 0.5s ease-in-out, movePosition 0.5s ease-in-out;
  }
`;

const VirtualRace: React.FC<VirtualRaceProps> = ({ car, onClose }) => {
  const [countdown, setCountdown] = useState<string | number>("READY");
  const [isRacing, setIsRacing] = useState(false);
  const [raceTime, setRaceTime] = useState(30);
  const [positions, setPositions] = useState<RacerPosition[]>([]);
  const [triggerAnimation, setTriggerAnimation] = useState(0);
  const [playerPosition, setPlayerPosition] = useState<string | null>(null);
  const [isCarVisible, setIsCarVisible] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);
  const [confettiPieces, setConfettiPieces] = useState(0);
  const previousPositionsRef = useRef<RacerPosition[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playbackRate, setPlaybackRate] = useState(1);

  const carSize = 280;

  useEffect(() => {
    const availableOpponents = [
      {
        id: "opponent1",
        name: "Mystery Racer 1",
        position: 2,
        stats: {
          handling: 75,
          acceleration: 75,
          speed: 75,
          grip: 75,
        },
      },
      {
        id: "opponent2",
        name: "Mystery Racer 2",
        position: 3,
        stats: {
          handling: 70,
          acceleration: 70,
          speed: 70,
          grip: 70,
        },
      },
      {
        id: "opponent3",
        name: "Mystery Racer 3",
        position: 4,
        stats: {
          handling: 65,
          acceleration: 65,
          speed: 65,
          grip: 65,
        },
      },
    ];

    const opponents: RacerPosition[] = [
      {
        id: car.id,
        name: car.name,
        position: 1,
        stats: {
          handling: Math.floor(car.stats.handling * 0.8),
          acceleration: Math.floor(car.stats.acceleration * 0.9),
          speed: car.stats.speed,
          grip: Math.floor(car.stats.grip * 0.85),
        },
        image: car.image,
      },
      ...availableOpponents,
    ];

    setPositions(opponents);
    previousPositionsRef.current = opponents;
  }, [car]);

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
    const video = videoRef.current;
    if (!video) return;

    if (isRacing && raceTime > 0) {
      video.play().catch(error => {
        console.error("Error playing video:", error);
      });
    } else if (raceTime <= 0) {
      video.pause();
    }
  }, [isRacing, raceTime]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleEnded = () => {
      setPlaybackRate(prev => {
        const newRate = Math.min(prev + 0.5, 4);
        video.playbackRate = newRate;
        return newRate;
      });
      video.currentTime = 0;
      video.play().catch(error => {
        console.error("Error restarting video:", error);
      });
    };

    video.addEventListener("ended", handleEnded);

    return () => {
      video.removeEventListener("ended", handleEnded);
    };
  }, []);

  useEffect(() => {
    if (!isRacing) return;

    const raceInterval = setInterval(() => {
      setRaceTime(prev => {
        if (prev <= 0) {
          clearInterval(raceInterval);
          const player = positions.find(racer => racer.id === car.id);
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
  }, [isRacing, raceTime, positions, car.id]);

  const getTranslateY = (racer: RacerPosition) => {
    const previousPosition = previousPositionsRef.current.find(p => p.id === racer.id)?.position || racer.position;
    const positionDiff = previousPosition - racer.position;
    return positionDiff * 60;
  };

  const toggleCarVisibility = () => {
    setIsCarVisible(prev => !prev);
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

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <style>{styles}</style>
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          numberOfPieces={confettiPieces}
          recycle={false}
        />
      )}
      <div className="bg-white rounded-lg w-full max-w-4xl">
        <div className="bg-white p-4 rounded-t-lg h-[500px] relative">
          <div className="relative h-full flex items-center justify-center">
            {raceTime <= 0 && (
              <button
                onClick={toggleCarVisibility}
                className="absolute top-4 left-4 bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition-colors z-30"
              >
                {isCarVisible ? "Hide Car" : "Show Car"}
              </button>
            )}

            <video
              ref={videoRef}
              src="https://raw.githubusercontent.com/Luis901702/Mikucars/main/Comp%201_2.mp4"
              className="w-[695px] h-[495px] object-contain z-10 track"
              style={{ position: "absolute", zIndex: 10 }}
              preload="auto"
              muted
              playsInline
            />

            {isCarVisible && (
              <img
                src={car.image || "https://via.placeholder.com/80?text=Car"}
                alt={car.name}
                className="absolute top-[20px] left-[300px] z-20 car"
                style={{ width: `${carSize}px`, height: `${carSize}px`, zIndex: 20 }}
                onError={e => (e.currentTarget.src = "https://via.placeholder.com/80?text=Car+Error")}
              />
            )}

            {countdown !== 0 && <div className="absolute inset-0 bg-gray-500/30 z-40"></div>}
          </div>
          {countdown !== 0 && (
            <div className="absolute inset-0 flex items-center justify-center z-50">
              <span className="text-8xl font-bold text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">{countdown}</span>
            </div>
          )}
          {raceTime <= 0 && playerPosition && (
            <div className="absolute inset-0 flex items-center justify-center z-50">
              <span className="text-8xl font-bold text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
                {playerPosition}
              </span>
            </div>
          )}
        </div>

        <div className="bg-[#1a1a1a] p-4">
          <div className="space-y-2">
            {positions.map(racer => {
              const translateY = getTranslateY(racer);
              return (
                <div
                  key={`${racer.id}-${triggerAnimation}`}
                  className={`flex items-center gap-4 p-2 rounded animate-flip-move ${
                    racer.id === car.id ? "bg-yellow-500/20" : ""
                  }`}
                  style={{ "--startY": `${translateY}px` } as React.CSSProperties}
                >
                  {getPositionCircle(racer.position)}
                  {racer.image ? (
                    <img
                      src={racer.image}
                      alt={racer.name}
                      className="w-8 h-8 rounded-full object-cover"
                      onError={e => (e.currentTarget.src = "https://via.placeholder.com/32?text=Car+Error")}
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-700"></div>
                  )}
                  <div className="flex-1">
                    <div className="text-white font-medium">{racer.name}</div>
                    <div className="grid grid-cols-4 gap-4 mt-1">
                      <div className="text-gray-400 text-sm">Handling: {racer.stats.handling}</div>
                      <div className="text-gray-400 text-sm">Acceleration: {racer.stats.acceleration}</div>
                      <div className="text-gray-400 text-sm">Speed: {racer.stats.speed}</div>
                      <div className="text-gray-400 text-sm">Grip: {racer.stats.grip}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-[#1a1a1a] p-4 rounded-b-lg flex items-center justify-between">
          <div className="text-white text-xl font-medium">Time: {raceTime}s</div>
          {raceTime <= 0 && (
            <button
              onClick={onClose}
              className="bg-red-500 text-white px-6 py-2 rounded-full hover:bg-red-600 transition-colors"
            >
              Exit Race
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VirtualRace;
