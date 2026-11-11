import * as SecureStore from "expo-secure-store";

const REFRESH_TOKEN_KEY = "unihome_refresh_token";
const SESSION_EMAIL_KEY = "unihome_session_email";
const REGISTERED_EMAILS_KEY = "unihome_registered_emails";

/**
 * Access token vive únicamente en memoria del proceso (ADR-M002 Opción B / FT-02 §3).
 * Refresh token se guarda cifrado en Android Keystore mediante expo-secure-store (MM-104).
 */
let inMemoryAccessToken: string | null = null;
let inMemoryExpiresAt: string | null = null;
const inMemoryRegisteredEmails = new Set<string>();

export const sessionStorage = {
  getAccessToken(): string | null {
    return inMemoryAccessToken;
  },

  getExpiresAt(): string | null {
    return inMemoryExpiresAt;
  },

  setAccessToken(token: string | null, expiraEn?: string | null): void {
    inMemoryAccessToken = token;
    inMemoryExpiresAt = expiraEn ?? null;
  },

  async getRefreshToken(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
    } catch {
      return null;
    }
  },

  async setRefreshToken(token: string): Promise<void> {
    await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, token);
  },

  async getSessionEmail(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(SESSION_EMAIL_KEY);
    } catch {
      return null;
    }
  },

  async setSessionEmail(email: string): Promise<void> {
    await SecureStore.setItemAsync(SESSION_EMAIL_KEY, email);
    await this.addRegisteredEmail(email);
  },

  /**
   * Registro y consulta local de correos ya registrados (DEC-09 / MV-F01-R08)
   * Evita duplicados en cliente y complementa la validación 409 del backend.
   */
  async getRegisteredEmails(): Promise<string[]> {
    try {
      const stored = await SecureStore.getItemAsync(REGISTERED_EMAILS_KEY);
      if (stored) {
        const parsed: string[] = JSON.parse(stored);
        parsed.forEach((e) => inMemoryRegisteredEmails.add(e.trim().toLowerCase()));
      }
    } catch {
      // Ignorar si no hay datos o error de parseo
    }
    return Array.from(inMemoryRegisteredEmails);
  },

  async addRegisteredEmail(email: string): Promise<void> {
    const clean = email.trim().toLowerCase();
    if (!clean) return;
    inMemoryRegisteredEmails.add(clean);
    try {
      await SecureStore.setItemAsync(
        REGISTERED_EMAILS_KEY,
        JSON.stringify(Array.from(inMemoryRegisteredEmails))
      );
    } catch {
      // Ignorar si no se puede escribir
    }
  },

  async isEmailRegistered(email: string): Promise<boolean> {
    const clean = email.trim().toLowerCase();
    if (inMemoryRegisteredEmails.has(clean)) return true;
    const list = await this.getRegisteredEmails();
    return list.includes(clean);
  },

  /**
   * Limpia de forma total las credenciales en memoria y en el Keystore del dispositivo (SES-13 / MV-A03-R06).
   */
  async clearSession(): Promise<void> {
    inMemoryAccessToken = null;
    inMemoryExpiresAt = null;
    try {
      await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
      await SecureStore.deleteItemAsync(SESSION_EMAIL_KEY);
    } catch {
      // Ignorar si la clave ya no existía
    }
  },
};
