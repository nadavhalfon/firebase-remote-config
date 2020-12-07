import { WebPlugin } from "@capacitor/core";
import { FirebaseRemoteConfigPlugin, RCValueOption, RCReturnData, RCReturnDataArray, FirebaseInitOptions } from "./definitions";
export declare class FirebaseRemoteConfigWeb extends WebPlugin implements FirebaseRemoteConfigPlugin {
    readonly options_missing_mssg = "Firebase options are missing";
    readonly ready: Promise<any>;
    private readyResolver;
    private remoteConfigRef;
    private scripts;
    constructor();
    setDefaultWebConfig(options: any): Promise<void>;
    initialize(options: {
        minimumFetchIntervalInSeconds: number;
    }): Promise<void>;
    fetch(): Promise<void>;
    activate(): Promise<void>;
    fetchAndActivate(): Promise<void>;
    getBoolean(options: RCValueOption): Promise<RCReturnData>;
    getByteArray(options: RCValueOption): Promise<RCReturnDataArray>;
    getNumber(options: RCValueOption): Promise<RCReturnData>;
    getString(options: RCValueOption): Promise<RCReturnData>;
    get remoteConfig(): any;
    /**
     * Configure and Initialize FirebaseApp if not present
     * @param options - web app's Firebase configuration
     * @returns firebase analytics object reference
     * Platform: Web
     */
    initializeFirebase(options: FirebaseInitOptions): Promise<any>;
    /**
     * Check for existing loaded script and load new scripts
     */
    private loadScripts;
    /**
     * Loaded single script with provided id and source
     * @param id - unique identifier of the script
     * @param src - source of the script
     */
    private loadScript;
    private firebaseObjectReadyPromise;
    private isFirebaseInitialized;
}
declare const FirebaseRemoteConfig: FirebaseRemoteConfigWeb;
export { FirebaseRemoteConfig };
