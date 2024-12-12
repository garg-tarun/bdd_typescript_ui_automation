class DataStore {
    private store: Record<string, any>;
  
    constructor() {
      this.store = {};
    }
  
    set(key: string, value: any): void {
      this.store[key] = value;
    }
  
    get(key: string): any {
      if (!(key in this.store)) {
        throw new Error(`Key "${key}" does not exist in the DataStore.`);
      }
      return this.store[key];
    }
  
    clear(): void {
      this.store = {};
    }
  }
  
  export const dataStore = new DataStore(); // Singleton instance