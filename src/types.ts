export type PetType = 'cat' | 'dog' | 'rabbit' | 'dragon';

export interface Pet {
  id: string;
  name: string;
  type: PetType;
  level: number;
  exp: number;
  hunger: number; // 0-100
  happiness: number; // 0-100
  outfit: string[]; // IDs of items
  isAdopted: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  points: number;
  icon: string;
  category: 'life' | 'habit' | 'learning' | 'emotion';
}

export interface Item {
  id: string;
  name: string;
  price: number;
  type: 'food' | 'clothes' | 'accessory';
  image: string;
  effect?: {
    hunger?: number;
    happiness?: number;
  };
}

export interface UserStats {
  points: number;
  completedTaskIds: string[];
  inventory: string[]; // IDs of items
  lastResetDate: string; // YYYY-MM-DD
}
