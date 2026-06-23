const ASCII_ONLY = /^[\x00-\x7F]+$/;

export type SupabaseEnvIssue = {
  field: string;
  message: string;
};

function trim(value: string | undefined): string {
  return value?.trim() ?? "";
}

export function readSupabaseUrl(): string {
  return trim(process.env.NEXT_PUBLIC_SUPABASE_URL);
}

export function readSupabaseAnonKey(): string {
  return trim(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export function readSupabaseServiceRoleKey(): string {
  return trim(process.env.SUPABASE_SERVICE_ROLE_KEY);
}

export function readSupabaseAdminKey(): string {
  return readSupabaseServiceRoleKey() || readSupabaseAnonKey();
}

function findInvalidAsciiChar(value: string): string | null {
  for (const char of value) {
    if (char.charCodeAt(0) > 255) {
      return char;
    }
  }
  return null;
}

export function validateSupabaseEnvForServer(): SupabaseEnvIssue | null {
  const url = readSupabaseUrl();

  if (!url) {
    return {
      field: "NEXT_PUBLIC_SUPABASE_URL",
      message: "NEXT_PUBLIC_SUPABASE_URL manque sur Vercel.",
    };
  }

  const invalidUrlChar = findInvalidAsciiChar(url);
  if (invalidUrlChar) {
    return {
      field: "NEXT_PUBLIC_SUPABASE_URL",
      message:
        "NEXT_PUBLIC_SUPABASE_URL contient un caractere invalide (par ex. fleche ou accent). " +
        "Colle uniquement https://wbgztmysocsxdaysbrsp.supabase.co",
    };
  }

  if (!url.includes(".supabase.co")) {
    return {
      field: "NEXT_PUBLIC_SUPABASE_URL",
      message:
        "NEXT_PUBLIC_SUPABASE_URL doit etre https://wbgztmysocsxdaysbrsp.supabase.co (pas karta.club).",
    };
  }

  const serviceRoleKey = readSupabaseServiceRoleKey();
  if (!serviceRoleKey) {
    return {
      field: "SUPABASE_SERVICE_ROLE_KEY",
      message:
        "SUPABASE_SERVICE_ROLE_KEY manque sur Vercel. Supabase, Project Settings, API, service_role.",
    };
  }

  const invalidServiceKeyChar = findInvalidAsciiChar(serviceRoleKey);
  if (invalidServiceKeyChar) {
    return {
      field: "SUPABASE_SERVICE_ROLE_KEY",
      message:
        "SUPABASE_SERVICE_ROLE_KEY contient un caractere invalide (souvent une fleche copiee par erreur). " +
        "Recopie uniquement la longue cle JWT eyJ... sans texte autour.",
    };
  }

  const anonKey = readSupabaseAnonKey();
  if (anonKey) {
    const invalidAnonChar = findInvalidAsciiChar(anonKey);
    if (invalidAnonChar) {
      return {
        field: "NEXT_PUBLIC_SUPABASE_ANON_KEY",
        message:
          "NEXT_PUBLIC_SUPABASE_ANON_KEY contient un caractere invalide. Recopie uniquement la cle anon eyJ...",
      };
    }
  }

  return null;
}

export function isLikelySupabaseJwt(value: string): boolean {
  return value.startsWith("eyJ") && ASCII_ONLY.test(value);
}

function readJwtRole(value: string): string | null {
  if (!isLikelySupabaseJwt(value)) return null;

  try {
    const payload = value.split(".")[1];
    if (!payload) return null;
    const padded = payload + "=".repeat((4 - (payload.length % 4)) % 4);
    const json = JSON.parse(Buffer.from(padded, "base64url").toString("utf8")) as {
      role?: string;
    };
    return json.role ?? null;
  } catch {
    return null;
  }
}

export function validateSupabaseKeyRoles(): SupabaseEnvIssue | null {
  const anonKey = readSupabaseAnonKey();
  const serviceRoleKey = readSupabaseServiceRoleKey();

  if (anonKey && serviceRoleKey && anonKey === serviceRoleKey) {
    return {
      field: "NEXT_PUBLIC_SUPABASE_ANON_KEY",
      message:
        "NEXT_PUBLIC_SUPABASE_ANON_KEY est identique a SUPABASE_SERVICE_ROLE_KEY. " +
        "Sur Vercel, anon = cle anon public, service_role = cle secrete serveur.",
    };
  }

  const anonRole = anonKey ? readJwtRole(anonKey) : null;
  if (anonRole && anonRole !== "anon") {
    return {
      field: "NEXT_PUBLIC_SUPABASE_ANON_KEY",
      message:
        "NEXT_PUBLIC_SUPABASE_ANON_KEY n'est pas une cle anon (role JWT detecte: " +
        anonRole +
        "). Recopie la cle anon public depuis Supabase, API.",
    };
  }

  const serviceRole = serviceRoleKey ? readJwtRole(serviceRoleKey) : null;
  if (serviceRole && serviceRole !== "service_role") {
    return {
      field: "SUPABASE_SERVICE_ROLE_KEY",
      message:
        "SUPABASE_SERVICE_ROLE_KEY n'est pas une cle service_role. Recopie service_role depuis Supabase, API.",
    };
  }

  return null;
}
