import { registerPlugin, WebPlugin } from "@capacitor/core";
import { FirebaseApp } from "@firebase/app";
import {
  activate,
  fetchAndActivate,
  fetchConfig,
  getRemoteConfig,
  getValue,
  RemoteConfig,
} from "firebase/remote-config";
import type {
  FirebaseRemoteConfigPlugin,
  initOptions,
  RCReturnData,
  RCValueOption,
} from "./definitions";

// Errors
const ErrRemoteConfigNotInitialiazed = new Error(
  "Remote config is not initialized. Make sure initialize() is called first."
);
const ErrMissingDefaultConfig = new Error("No default configuration found");

export class FirebaseRemoteConfigWeb
  extends WebPlugin
  implements FirebaseRemoteConfigPlugin
{
  private remoteConfigRef: RemoteConfig;

  constructor() {
    super();
  }

  async initializeFirebase(app: FirebaseApp) {
    this.remoteConfigRef = getRemoteConfig(app);
  }

  async setDefaultConfig(options: any): Promise<void> {
    if (!options) throw ErrMissingDefaultConfig;

    if (!this.remoteConfigRef) throw ErrRemoteConfigNotInitialiazed;

    this.remoteConfigRef.defaultConfig = options;
    return;
  }

  async initialize(options?: initOptions): Promise<void> {
    if (!this.remoteConfigRef) throw ErrRemoteConfigNotInitialiazed;

    this.remoteConfigRef.settings = {
      minimumFetchIntervalMillis: 1000 * 60 * 60 * 12, // default: 12 hours
      fetchTimeoutMillis: 1 * 60000, // default: 1 minute
      ...options,
    };

    return;
  }

  async fetch(): Promise<void> {
    if (!this.remoteConfigRef) throw ErrRemoteConfigNotInitialiazed;

    const data = await fetchConfig(this.remoteConfigRef);
    return data;
  }

  async activate(): Promise<void> {
    if (!this.remoteConfigRef) throw ErrRemoteConfigNotInitialiazed;

    await activate(this.remoteConfigRef);
    return;
  }

  async fetchAndActivate(): Promise<void> {
    if (!this.remoteConfigRef) throw ErrRemoteConfigNotInitialiazed;

    await fetchAndActivate(this.remoteConfigRef);
    return;
  }

  getBoolean(options: RCValueOption): Promise<RCReturnData<boolean>> {
    return this.getValue(options, "Boolean");
  }

  getNumber(options: RCValueOption): Promise<RCReturnData<number>> {
    return this.getValue(options, "Number");
  }

  getString(options: RCValueOption): Promise<RCReturnData> {
    return this.getValue(options, "String");
  }

  private async getValue<T>(
    options: RCValueOption,
    format: "String" | "Number" | "Boolean" = "String"
  ): Promise<RCReturnData<T>> {
    if (!this.remoteConfigRef)
      throw new Error(
        "Remote config is not initialized. Make sure initialize() is called at first."
      );
    const retVal = getValue(this.remoteConfigRef, options.key);
    return {
      key: options.key,
      value: (retVal as any)[`as${format}`](),
      source: retVal.getSource(),
    };
  }

  get remoteConfig() {
    return this.remoteConfigRef;
  }
}

const FirebaseRemoteConfig = registerPlugin<FirebaseRemoteConfigWeb>(
  "FirebaseRemoteConfig",
  {
    web: () => new FirebaseRemoteConfigWeb(),
  }
);

export { FirebaseRemoteConfig };
