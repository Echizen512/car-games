import React, { useState } from 'react';
import StatBar from './StatBar';
import ParticleBackground from './ParticleBackground';
import VirtualRace from './VirtualRace';
import { Car } from '../app/types';

interface CarCardProps {
  car: Car;
}

const CarCard: React.FC<CarCardProps> = ({ car }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showRace, setShowRace] = useState(false);

  const commonCarConfigs = [
    { speed: 45, handling: 45, grip: 20, acceleration: 10 },
    { speed: 15, handling: 25, grip: 40, acceleration: 40 },
    { speed: 10, handling: 50, grip: 10, acceleration: 50 },
    { speed: 30, handling: 30, grip: 30, acceleration: 30 },
  ];

  let carStats = { ...car.stats }; 
  if (car.type.toLowerCase() === 'común' || car.type.toLowerCase() === 'common') {
    const configIndex = (parseInt(car.id) - 1) % commonCarConfigs.length;
    carStats = {
      fuel: 30, 
      ...commonCarConfigs[configIndex], 
    };
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case 'común':
      case 'common':
        return 'bg-blue-500';
      case 'poco común':
      case 'uncommon':
        return 'bg-green-500';
      case 'raro':
      case 'rare':
        return 'bg-purple-500';
      case 'épico':
      case 'epic':
        return 'bg-orange-500';
      case 'legendario':
      case 'legendary':
        return 'bg-yellow-400';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <>
      <div
        className="bg-white rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative">
          {isHovered && <ParticleBackground rarity={car.type} />}
          <div className="absolute top-2 left-2 bg-slate-800/70 text-white px-3 py-1 rounded-full text-sm font-semibold">
            #{car.id}
          </div>
          <img
            src={car.image}
            alt={car.name}
            className="w-full h-[400px] object-contain bg-gradient-to-b from-slate-100 to-slate-200 p-4"
          />
        </div>

        <div className="p-5">
          <div className="flex flex-col items-center gap-2 mb-3">
            <div>
              <div className={`${getRarityColor(car.type)} text-white text-center py-1 px-4 rounded-md font-medium min-w-[120px]`}>
                {car.type}
              </div>
            </div>
            <div>
              <div className="font-bold text-slate-800 text-3xl">
                {car.name}
              </div>
            </div>
          </div>

          <div className="space-y-3 mt-4">
            <StatBar label="Fuel" value={carStats.fuel} maxValue={carStats.fuel} colorClass="bg-red-500" />
            <StatBar label="Max Speed" value={carStats.speed} maxValue={100} colorClass="bg-red-500" />
            <StatBar label="Acceleration" value={carStats.acceleration} maxValue={100} colorClass="bg-red-500" />
            <StatBar label="Handling" value={carStats.handling} maxValue={100} colorClass="bg-red-500" />
            <StatBar label="Grip" value={carStats.grip} maxValue={100} colorClass="bg-red-500" />
          </div>

          <div className="grid grid-cols-2 gap-3 mt-5">
            <button
              onClick={() => setShowRace(true)}
              className="bg-rose-600 hover:bg-rose-700 text-white py-2 rounded-md font-medium transition-colors"
            >
              Start Virtual Race
            </button>
            <button className="bg-amber-500 hover:bg-amber-600 text-white py-2 rounded-md font-medium transition-colors">
              Claim Reward
            </button>
          </div>
        </div>
      </div>

      {showRace && (
        <VirtualRace car={car} onClose={() => setShowRace(false)} />
      )}
    </>
  );
};

export default CarCard;