import { createClient } from '@supabase/supabase-js'
import * as SecureStore from "expo-secure-store";
import { Database } from "../../types/supabaseTypes";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const ExpoSecureStoreAdapter = {
  getItem: (key: string) => {
    return SecureStore.getItemAsync(key);
  },
  setItem: (key: string, value: string) => {
    SecureStore.setItemAsync(key, value);
  },
  removeItem: (key: string) => {
    SecureStore.deleteItemAsync(key);
  },
};

const StoreAdapter = Platform.OS === 'web' ? AsyncStorage : ExpoSecureStoreAdapter;

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL as string; 
const supabaseAnonKey = process.env.EXPO_PUBLIC_ANON_KEY as string;



export const supabase = createClient<Database>(
  supabaseUrl, supabaseAnonKey, {
    auth: {
      storage: StoreAdapter as any,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
  },
})
