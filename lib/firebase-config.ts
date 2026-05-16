export type FirebaseWebConfig = {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
};

const envConfig: FirebaseWebConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "pro-3-e6f35",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? "pro-3-e6f35.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? ""
};

let cachedConfig: FirebaseWebConfig | null = null;

export function hasStaticFirebaseConfig() {
  return Boolean(envConfig.apiKey && envConfig.projectId);
}

export function getFirebaseProjectId() {
  return envConfig.projectId || "pro-3-e6f35";
}

export async function getFirebaseConfig(): Promise<FirebaseWebConfig | null> {
  if (cachedConfig) return cachedConfig;

  if (hasStaticFirebaseConfig()) {
    cachedConfig = envConfig;
    return cachedConfig;
  }

  if (typeof window !== "undefined") {
    try {
      const response = await fetch("/__/firebase/init.json", { cache: "force-cache" });
      if (response.ok) {
        const hostingConfig = (await response.json()) as Partial<FirebaseWebConfig>;
        if (hostingConfig.apiKey && hostingConfig.projectId) {
          cachedConfig = {
            apiKey: hostingConfig.apiKey,
            authDomain: hostingConfig.authDomain ?? `${hostingConfig.projectId}.firebaseapp.com`,
            projectId: hostingConfig.projectId,
            storageBucket: hostingConfig.storageBucket ?? `${hostingConfig.projectId}.appspot.com`,
            messagingSenderId: hostingConfig.messagingSenderId ?? "",
            appId: hostingConfig.appId ?? ""
          };
          return cachedConfig;
        }
      }
    } catch {
      return null;
    }
  }

  return null;
}

export async function isFirebaseConfigured() {
  return Boolean(await getFirebaseConfig());
}
