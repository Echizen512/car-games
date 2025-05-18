import React, { useEffect, useState } from 'react';

interface StatBarProps {
  label: string;
  value: number;
  maxValue: number;
  colorClass: string;
}

const StatBar: React.FC<StatBarProps> = ({ label, value, maxValue, colorClass }) => {
  const [currentValue, setCurrentValue] = useState(0);
  
  // Animation effect for the progress bar
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentValue(value);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [value]);

  const percentage = (currentValue / maxValue) * 100;
  
  return (
    <div className="w-full">
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-700 font-medium">{label}</span>
        <span className="text-gray-600">{currentValue}/{maxValue}</span>
      </div>
      <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className={`h-full ${colorClass} transition-all duration-1000 ease-out`} 
          style={{ width: `${percentage}%` }}
          aria-valuenow={currentValue}
          aria-valuemin={0}
          aria-valuemax={maxValue}
        />
      </div>
    </div>
  );
};

export default StatBar;