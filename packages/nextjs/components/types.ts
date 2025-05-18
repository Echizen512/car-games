export interface CarStats {
  speed: number;
  acceleration: number;
  handling: number;
  grip: number;
  fuel: number;
}

export interface Car {
  id: string;
  name: string;
  type: string;
  image: string;
  stats: CarStats;
}