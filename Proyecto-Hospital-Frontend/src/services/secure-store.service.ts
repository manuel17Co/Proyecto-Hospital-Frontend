import { deleteItemAsync, getItemAsync, setItemAsync } from "expo-secure-store";

export abstract class SecureStore {
    static async set<T>(key: string, value: T): Promise<void> {
        await setItemAsync(key, JSON.stringify(value));
    }

    static async get<T>(key: string): Promise<T | null> {
        const item = await getItemAsync(key);
        return item ? (JSON.parse(item) as T) : null;
    }

    static async delete(key: string): Promise<void> {
        await deleteItemAsync(key);
    }
}
