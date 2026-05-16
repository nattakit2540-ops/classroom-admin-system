import { getFirebaseConfig } from "@/lib/firebase-config";

type FirebaseAuthResponse = {
  localId: string;
  email: string;
  idToken: string;
  refreshToken: string;
  expiresIn: string;
};

type FirebaseRefreshResponse = {
  id_token: string;
  refresh_token: string;
  user_id: string;
  expires_in: string;
};

type FirestoreValue =
  | { stringValue: string }
  | { integerValue: string }
  | { doubleValue: number }
  | { booleanValue: boolean }
  | { timestampValue: string }
  | { nullValue: null }
  | { mapValue: { fields: Record<string, FirestoreValue> } }
  | { arrayValue: { values?: FirestoreValue[] } };

function toFirestoreValue(value: unknown): FirestoreValue {
  if (value === null || value === undefined) return { nullValue: null };
  if (typeof value === "string") return { stringValue: value };
  if (typeof value === "boolean") return { booleanValue: value };
  if (typeof value === "number" && Number.isInteger(value)) return { integerValue: String(value) };
  if (typeof value === "number") return { doubleValue: value };
  if (value instanceof Date) return { timestampValue: value.toISOString() };
  if (Array.isArray(value)) return { arrayValue: { values: value.map(toFirestoreValue) } };
  if (typeof value === "object") {
    return {
      mapValue: {
        fields: Object.fromEntries(
          Object.entries(value as Record<string, unknown>).map(([key, nestedValue]) => [key, toFirestoreValue(nestedValue)])
        )
      }
    };
  }
  return { stringValue: String(value) };
}

function toFirestoreFields(data: Record<string, unknown>) {
  return Object.fromEntries(Object.entries(data).map(([key, value]) => [key, toFirestoreValue(value)]));
}

function fromFirestoreValue(value: FirestoreValue): unknown {
  if ("stringValue" in value) return value.stringValue;
  if ("integerValue" in value) return Number(value.integerValue);
  if ("doubleValue" in value) return value.doubleValue;
  if ("booleanValue" in value) return value.booleanValue;
  if ("timestampValue" in value) return value.timestampValue;
  if ("nullValue" in value) return null;
  if ("arrayValue" in value) return (value.arrayValue.values ?? []).map(fromFirestoreValue);
  if ("mapValue" in value) {
    return Object.fromEntries(Object.entries(value.mapValue.fields ?? {}).map(([key, nestedValue]) => [key, fromFirestoreValue(nestedValue)]));
  }
  return null;
}

function fromFirestoreFields(fields: Record<string, FirestoreValue> = {}) {
  return Object.fromEntries(Object.entries(fields).map(([key, value]) => [key, fromFirestoreValue(value)]));
}

export async function signInWithEmailPassword(email: string, password: string) {
  const config = await getFirebaseConfig();
  if (!config) {
    return {
      localId: "local-demo-user",
      email,
      idToken: "local-demo-token",
      refreshToken: "local-demo-refresh-token",
      expiresIn: "3600"
    } satisfies FirebaseAuthResponse;
  }

  const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${config.apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, returnSecureToken: true })
  });

  if (!response.ok) {
    throw new Error("เข้าสู่ระบบไม่สำเร็จ กรุณาตรวจสอบอีเมลและรหัสผ่าน");
  }

  return (await response.json()) as FirebaseAuthResponse;
}

export async function refreshIdToken(refreshToken: string) {
  const config = await getFirebaseConfig();
  if (!config || refreshToken === "local-demo-refresh-token") {
    return {
      id_token: "local-demo-token",
      refresh_token: "local-demo-refresh-token",
      user_id: "local-demo-user",
      expires_in: "3600"
    } satisfies FirebaseRefreshResponse;
  }

  const response = await fetch(`https://securetoken.googleapis.com/v1/token?key=${config.apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken
    })
  });

  if (!response.ok) {
    throw new Error("ต่ออายุการเข้าสู่ระบบไม่สำเร็จ กรุณาเข้าสู่ระบบใหม่");
  }

  return (await response.json()) as FirebaseRefreshResponse;
}

export async function saveFirestoreDocument(collection: string, documentId: string, data: Record<string, unknown>, idToken?: string) {
  const config = await getFirebaseConfig();
  if (!config || !idToken || idToken === "local-demo-token") {
    return { mode: "local", id: documentId };
  }

  const response = await fetch(
    `https://firestore.googleapis.com/v1/projects/${config.projectId}/databases/(default)/documents/${collection}/${documentId}`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${idToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ fields: toFirestoreFields(data) })
    }
  );

  if (!response.ok) {
    throw new Error("บันทึกข้อมูลไป Firestore ไม่สำเร็จ");
  }

  return { mode: "firebase", id: documentId };
}

export async function listFirestoreDocuments<T extends Record<string, unknown>>(collection: string, idToken?: string): Promise<T[]> {
  const config = await getFirebaseConfig();
  if (!config || !idToken || idToken === "local-demo-token") return [];

  const response = await fetch(
    `https://firestore.googleapis.com/v1/projects/${config.projectId}/databases/(default)/documents/${collection}`,
    {
      headers: {
        Authorization: `Bearer ${idToken}`
      }
    }
  );

  if (!response.ok) return [];

  const payload = (await response.json()) as { documents?: Array<{ name: string; fields?: Record<string, FirestoreValue> }> };
  return (payload.documents ?? []).map((document) => ({
    id: document.name.split("/").pop() ?? "",
    ...fromFirestoreFields(document.fields)
  })) as unknown as T[];
}
