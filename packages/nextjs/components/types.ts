export interface Car {
  id: string;
  name: string;
  type: string;
  image: string;
  stats: CarStats;
}

export interface CarStats {
  speed: number;
  acceleration: number;
  handling: number;
  grip: number;
  fuel: number;
}
