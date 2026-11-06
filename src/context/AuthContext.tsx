import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { authApi, EliminarCuentaInput, LoginInput } from "../services/authApi";
import { sessionStorage } from "../services/sessionStorage";

/**
 * Estados del ciclo de vida de sesión definidos en ARQM-003 (Sesión Persistente).
 */
export type SessionStatus =
  | "Restaurando"
  | "SinSesion"
  | "Autenticando"
  | "ConSesion"
  | "Renovando"
  | "Cerrando";

export interface SelectedUniversity {
  id: string;
  siglas: string;
  nombre: string;
  ciudad: string;
}

interface AuthContextValue {
  status: SessionStatus;
  userEmail: string | null;
  selectedUniversity: SelectedUniversity | null;
  setSelectedUniversity: (uni: SelectedUniversity | null) => void;
  login: (input: LoginInput) => Promise<void>;
  logout: () => Promise<void>;
  deleteAccount: (input: EliminarCuentaInput) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [status, setStatus] = useState<SessionStatus>("Restaurando");
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [selectedUniversity, setSelectedUniversity] = useState<SelectedUniversity | null>(null);

  /**
   * Al iniciar la aplicación (CM-13 / SES-07: sesión siempre viva):
   * 1. Lee el refreshToken de expo-secure-store (Android Keystore).
   * 2. Si existe, renueva silenciosamente el accessToken mediante POST /api/v1/auth/refresh.
   * 3. Si el refreshToken es válido, restaura la sesión sin pedir login de nuevo.
   */
  useEffect(() => {
    let mounted = true;
    const restoreSession = async () => {
      try {
        const storedRefreshToken = await sessionStorage.getRefreshToken();
        const storedEmail = await sessionStorage.getSessionEmail();
        if (!storedRefreshToken) {
          if (mounted) {
            setStatus("SinSesion");
          }
          return;
        }
        await authApi.refrescarSesion();
        if (mounted) {
          setUserEmail(storedEmail);
          setStatus("ConSesion");
        }
      } catch {
        // Si el refreshToken fue revocado (401) o no se pudo restaurar:
        await sessionStorage.clearSession();
        if (mounted) {
          setUserEmail(null);
          setStatus("SinSesion");
        }
      }
    };
    restoreSession();
    return () => {
      mounted = false;
    };
  }, []);

  const login = useCallback(async (input: LoginInput) => {
    setStatus("Autenticando");
    try {
      await authApi.iniciarSesion(input);
      const cleanEmail = input.correo.trim().toLowerCase();
      setUserEmail(cleanEmail);
      setStatus("ConSesion");
    } catch (error) {
      setStatus("SinSesion");
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    setStatus("Cerrando");
    try {
      await authApi.cerrarSesion();
    } finally {
      setUserEmail(null);
      setSelectedUniversity(null);
      setStatus("SinSesion");
    }
  }, []);

  const deleteAccount = useCallback(async (input: EliminarCuentaInput) => {
    await authApi.eliminarMiCuenta(input);
    setUserEmail(null);
    setSelectedUniversity(null);
    setStatus("SinSesion");
  }, []);

  return (
    <AuthContext.Provider
      value={{
        status,
        userEmail,
        selectedUniversity,
        setSelectedUniversity,
        login,
        logout,
        deleteAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return ctx;
}
