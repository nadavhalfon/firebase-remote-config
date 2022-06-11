import { FirebaseApp } from "firebase/app";

export interface FirebaseRemoteConfigPlugin {
  initializeFirebase(app: FirebaseApp): Promise<void>;
  setDefaultConfig(options: any): Promise<void>;
  initialize(options?: initOptions): Promise<void>;
  fetch(): Promise<void>;
  activate(): Promise<void>;
  fetchAndActivate(): Promise<void>;
  getBoolean(options: RCValueOption): Promise<RCReturnData<boolean>>;
  getNumber(options: RCValueOption): Promise<RCReturnData<number>>;
  getString(options: RCValueOption): Promise<RCReturnData<string>>;
}

export interface initOptions {
  minimumFetchInterval?: number;
  fetchTimeout?: number;
}

export interface RCValueOption {
  key: string;
}

export interface RCReturnData<T = string> {
  key: string;
  value: T;
  source: string;
}

export interface RCReturnDataArray {
  key: string;
  value: any[];
  source: string;
}

export interface FirebaseInitOptions {
  apiKey: string;
  authDomain: string;
  databaseURL: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId: string;
}
