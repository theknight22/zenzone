const ADMIN_SESSION_STORAGE_KEY = 'zenzone_admin_session';

export interface StoredAdminSession {
  sessionToken: string;
  expiresAt: number;
}

export function getStoredAdminSession(): StoredAdminSession | null {
  const raw = localStorage.getItem(ADMIN_SESSION_STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<StoredAdminSession>;
    if (typeof parsed.sessionToken !== 'string' || typeof parsed.expiresAt !== 'number') {
      return null;
    }

    const session = {
      sessionToken: parsed.sessionToken,
      expiresAt: parsed.expiresAt,
    };

    if (session.expiresAt <= Date.now()) {
      localStorage.removeItem(ADMIN_SESSION_STORAGE_KEY);
      return null;
    }

    return session;
  } catch {
    return null;
  }
}

export function setStoredAdminSession(session: StoredAdminSession): void {
  localStorage.setItem(ADMIN_SESSION_STORAGE_KEY, JSON.stringify(session));
}

export function clearStoredAdminSession(): void {
  localStorage.removeItem(ADMIN_SESSION_STORAGE_KEY);
}
