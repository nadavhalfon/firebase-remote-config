var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { WebPlugin } from "@capacitor/core";
export class FirebaseRemoteConfigWeb extends WebPlugin {
    constructor() {
        super({
            name: "FirebaseRemoteConfig",
            platforms: ["web"],
        });
        this.options_missing_mssg = "Firebase options are missing";
        this.scripts = [
            {
                key: "firebase-app",
                src: "https://www.gstatic.com/firebasejs/7.15.4/firebase-app.js",
            },
            {
                key: "firebase-rc",
                src: "https://www.gstatic.com/firebasejs/7.15.4/firebase-remote-config.js",
            },
        ];
        this.ready = new Promise((resolve) => (this.readyResolver = resolve));
        this.loadScripts();
    }
    setDefaultWebConfig(options) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            yield this.ready;
            if (!options) {
                reject("No default configuration found.");
                return;
            }
            if (!this.remoteConfigRef) {
                reject("Remote config is not initialized. Make sure initialize() is called at first.");
                return;
            }
            this.remoteConfigRef.defaultConfig = options;
            resolve();
        }));
    }
    initialize(options) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            yield this.ready;
            if (!this.remoteConfigRef) {
                reject("Remote config is not initialized. Make sure initialize() is called at first.");
                return;
            }
            const interval = options && options.minimumFetchIntervalInSeconds
                ? options.minimumFetchIntervalInSeconds
                : 3600;
            this.remoteConfigRef.settings = {
                minimumFetchIntervalInSeconds: interval,
            };
            resolve();
        }));
    }
    fetch() {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            yield this.ready;
            if (!this.remoteConfigRef) {
                reject("Remote config is not initialized. Make sure initialize() is called at first.");
                return;
            }
            this.remoteConfigRef.fetch().then(resolve).catch(reject);
        }));
    }
    activate() {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            yield this.ready;
            if (!this.remoteConfigRef) {
                reject("Remote config is not initialized. Make sure initialize() is called at first.");
                return;
            }
            this.remoteConfigRef.activate().then(resolve).catch(reject);
        }));
    }
    fetchAndActivate() {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            yield this.ready;
            if (!this.remoteConfigRef) {
                reject("Remote config is not initialized. Make sure initialize() is called at first.");
                return;
            }
            window.firebase
                .remoteConfig()
                .fetchAndActivate()
                .then((data) => {
                // console.log(data);
                resolve(data);
            })
                .catch(reject);
        }));
    }
    getBoolean(options) {
        return this.getValue(options, "Boolean");
    }
    getByteArray(options) {
        // Should be deprecated 
        // - was implemented as a string which ruined the data.
        // - FB doesn't support byteArray - https://firebase.google.com/docs/reference/js/firebase.remoteconfig.RemoteConfig
        return this.getString(options);
    }
    getNumber(options) {
        return this.getValue(options, "Number");
    }
    getString(options) {
        return this.getValue(options, "String");
    }
    getValue(options, format = null) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.ready;
            if (!this.remoteConfigRef)
                throw new Error("Remote config is not initialized. Make sure initialize() is called at first.");
            const retVal = this.remoteConfigRef.getValue(options.key);
            return {
                key: options.key,
                value: format ? retVal["as" + format]() : retVal._value,
                source: retVal._source,
            };
        });
    }
    get remoteConfig() {
        return this.remoteConfigRef;
    }
    // 
    // Note: The methods below are common to all Firebase capacitor plugins. Best to create `capacitor-community / firebase-common`,
    // move the code there and add it as module to all FB plugins.
    // 
    /**
     * Configure and Initialize FirebaseApp if not present
     * @param options - web app's Firebase configuration
     * @returns firebase analytics object reference
     * Platform: Web
     */
    initializeFirebase(options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!options)
                throw new Error(this.options_missing_mssg);
            yield this.firebaseObjectReadyPromise();
            const app = this.isFirebaseInitialized() ? window.firebase : window.firebase.initializeApp(options);
            this.remoteConfigRef = app.remoteConfig();
            this.readyResolver();
            return this.remoteConfigRef;
        });
    }
    /**
     * Check for existing loaded script and load new scripts
     */
    loadScripts() {
        return Promise.all(this.scripts.map(s => this.loadScript(s.key, s.src)));
    }
    /**
     * Loaded single script with provided id and source
     * @param id - unique identifier of the script
     * @param src - source of the script
     */
    loadScript(id, src) {
        return new Promise((resolve, reject) => {
            if (document.getElementById(id)) {
                resolve(null);
            }
            else {
                const file = document.createElement("script");
                file.type = "text/javascript";
                file.src = src;
                file.id = id;
                file.onload = resolve;
                file.onerror = reject;
                document.querySelector("head").appendChild(file);
            }
        });
    }
    firebaseObjectReadyPromise() {
        var tries = 100;
        return new Promise((resolve, reject) => {
            const interval = setInterval(() => {
                var _a;
                if ((_a = window.firebase) === null || _a === void 0 ? void 0 : _a.remoteConfig) {
                    clearInterval(interval);
                    resolve(null);
                }
                else if (tries-- <= 0) {
                    reject("Firebase fails to load");
                }
            }, 50);
        });
    }
    isFirebaseInitialized() {
        var _a, _b;
        const length = (_b = (_a = window.firebase) === null || _a === void 0 ? void 0 : _a.apps) === null || _b === void 0 ? void 0 : _b.length;
        return length && length > 0;
    }
}
const FirebaseRemoteConfig = new FirebaseRemoteConfigWeb();
export { FirebaseRemoteConfig };
import { registerWebPlugin } from "@capacitor/core";
registerWebPlugin(FirebaseRemoteConfig);
//# sourceMappingURL=web.js.map