export type UserId = string;

export interface User {
  id: UserId;
  email: string;
  name: string | null;
  createdAt: string;
}

export interface RecordEntry {
  id: string;
  userId: UserId;
  score: number;
  gameType: string;
  reactionTime?: number;
  level: number;
  accuracy?: number;
  createdAt: string;
  updatedAt: string;
}
