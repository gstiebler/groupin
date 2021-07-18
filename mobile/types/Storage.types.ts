export interface IStorage {
  getItem: (key: string) => Promise<unknown>;
  setItem: (key: string, value: unknown) => void;
}
