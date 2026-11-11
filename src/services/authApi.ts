import { sessionStorage } from "./sessionStorage";

/**
 * URL base confirmada del backend desplegado en Azure Container Apps
 */
export const API_BASE_URL =
  "https://unihome-api.agreeablesky-4cd63e24.eastus.azurecontainerapps.io";

/**
 * Versión fija del aviso de privacidad aprobada en DEC-M05 (2026-11-05)
 */
export const PRIVACY_NOTICE_VERSION = "1.0";

export type ApiGender = "Mujer" | "Hombre" | "PrefiereNoDecir";
export type GeneroDisplay = "Mujer" | "Hombre" | "Prefiero no decir";

export interface RegistroRequest {
  nombreCompleto: string;
  correo: string;
  fechaNacimiento: string; // AAAA-MM-DD
  genero: ApiGender;
  contrasena: string;
  confirmarContrasena: string;
  aceptoAvisoPrivacidad: boolean;
  versionAvisoPrivacidad: string;
}

export interface RegistroInput {
  nombreCompleto: string;
  correo: string;
  fechaNacimiento: string;
  genero: GeneroDisplay | ApiGender;
  contrasena: string;
  confirmarContrasena: string;
  aceptoAvisoPrivacidad: boolean;
  versionAvisoPrivacidad?: string;
}

export interface RegistroResponse {
  id?: string;
  usuarioId?: string;
  correo: string;
  correoConfirmado?: boolean;
  requiereConfirmacionCorreo: boolean;
  correoConfirmacionEnviado: boolean;
}

export interface ConfirmacionCorreoRequest {
  correo: string;
  codigo: string;
}

export interface ConfirmacionCorreoResponse {
  correo: string;
  confirmado: boolean;
}

export interface ReenvioCodigoRequest {
  correo: string;
}

export interface LoginRequest {
  correo: string;
  contrasena: string;
}

export type LoginInput = LoginRequest;

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  expiraEn: string;
}

export interface EliminarCuentaRequest {
  contrasena: string;
  confirmacionPerdidaInformacion: boolean;
}

export type EliminarCuentaInput = EliminarCuentaRequest;

export interface ProblemDetails {
  type?: string;
  title?: string;
  status?: number;
  detail?: string;
  traceId?: string;
  errors?: Record<string, string[]>;
}

export class ApiClientError extends Error {
  status: number;
  detail: string;
  traceId?: string;
  fieldErrors: Record<string, string[]>;
  retryAfterSeconds?: number;

  constructor(params: {
    status: number;
    message: string;
    detail?: string;
    traceId?: string;
    fieldErrors?: Record<string, string[]>;
    retryAfterSeconds?: number;
  }) {
    super(params.message);
    this.name = "ApiClientError";
    this.status = params.status;
    this.detail = params.detail || params.message;
    this.traceId = params.traceId;
    this.fieldErrors = params.fieldErrors ?? {};
    this.retryAfterSeconds = params.retryAfterSeconds;
  }

  getFieldError(fieldName: string): string | null {
    const pascal = fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
    const list =
      this.fieldErrors[fieldName] ??
      this.fieldErrors[pascal] ??
      this.fieldErrors[fieldName.toLowerCase()];
    return list && list.length > 0 ? list[0] : null;
  }
}

export { ApiClientError as ApiError };

/**
 * Convierte la opción visual de género de la maqueta al contrato de la API (REG-04 / RC-03).
 */
export function toApiGender(uiGender: string): ApiGender {
  if (uiGender === "Mujer") return "Mujer";
  if (uiGender === "Hombre") return "Hombre";
  return "PrefiereNoDecir";
}

/**
 * Cola única de renovación de sesión en vuelo (SES-10 / MV-A03-R03):
 * Evita reutilizar un refreshToken en paralelo y que el servidor revoque la familia de sesiones.
 */
let activeRefreshPromise: Promise<TokenResponse | null> | null = null;

async function parseErrorResponse(response: Response): Promise<ApiClientError> {
  const retryHeader = response.headers.get("Retry-After");
  const retryAfterSeconds = retryHeader ? Number(retryHeader) || undefined : undefined;

  let body: ProblemDetails | null = null;
  try {
    body = (await response.json()) as ProblemDetails;
  } catch {
    body = null;
  }

  const status = response.status;
  const detail = body?.detail || body?.title;
  const fieldErrors = body?.errors ?? {};

  let defaultMessage = "Ocurrió un problema al comunicarnos con el servidor. Inténtalo de nuevo.";
  if (status === 400) {
    defaultMessage = detail || "Revisa los campos marcados e inténtalo de nuevo.";
  } else if (status === 401) {
    defaultMessage = "Revisa tu correo y contraseña.";
  } else if (status === 403) {
    defaultMessage = detail || "Tu cuenta requiere confirmación de correo o no tiene acceso.";
  } else if (status === 409) {
    defaultMessage = "Este correo ya está registrado en UniHome. Puedes iniciar sesión directamente.";
    if (!fieldErrors.correo && !fieldErrors.Correo) {
      fieldErrors.correo = [defaultMessage];
    }
  } else if (status === 410) {
    defaultMessage = "El código de verificación venció (vigencia de 10 minutos). Solicita uno nuevo.";
  } else if (status === 429) {
    defaultMessage = retryAfterSeconds
      ? `Demasiados intentos. Espera ${retryAfterSeconds} segundos antes de volver a intentar.`
      : "Demasiados intentos seguidos. Espera un momento antes de volver a intentar.";
  } else if (status >= 500) {
    defaultMessage = "El servicio no está disponible temporalmente. Intenta de nuevo en unos momentos.";
  }

  return new ApiClientError({
    status,
    message: defaultMessage,
    detail: detail || defaultMessage,
    traceId: body?.traceId,
    fieldErrors,
    retryAfterSeconds,
  });
}

/**
 * EP-M01-08: POST /api/v1/auth/refresh
 * Ejecuta una sola renovación en vuelo y reemplaza de forma atómica el refreshToken en SecureStore (SES-09..12).
 */
export async function refreshSessionSingleFlight(): Promise<TokenResponse | null> {
  if (activeRefreshPromise) {
    return activeRefreshPromise;
  }

  activeRefreshPromise = (async () => {
    try {
      const storedRefresh = await sessionStorage.getRefreshToken();
      if (!storedRefresh) {
        await sessionStorage.clearSession();
        return null;
      }

      const response = await fetch(`${API_BASE_URL}/api/v1/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept-Language": "es-MX",
        },
        body: JSON.stringify({ refreshToken: storedRefresh }),
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          await sessionStorage.clearSession();
        }
        return null;
      }

      const data = (await response.json()) as TokenResponse;
      // Guardar primero el nuevo refreshToken antes de reintentar peticiones (SES-11)
      await sessionStorage.setRefreshToken(data.refreshToken);
      sessionStorage.setAccessToken(data.accessToken, data.expiraEn);
      return data;
    } catch {
      return null;
    } finally {
      activeRefreshPromise = null;
    }
  })();

  return activeRefreshPromise;
}

/**
 * Función interna de transporte HTTP con soporte para rutas protegidas y renovación única ante 401.
 */
async function request<T>(
  path: string,
  options: {
    method: "GET" | "POST" | "PUT" | "DELETE";
    body?: unknown;
    requiresAuth?: boolean;
    isRetry?: boolean;
  }
): Promise<T> {
  const headers: Record<string, string> = {
    "Accept": "application/json",
    "Accept-Language": "es-MX",
  };

  if (options.body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  if (options.requiresAuth) {
    let accessToken = sessionStorage.getAccessToken();
    const expiresAt = sessionStorage.getExpiresAt();
    const isExpiringSoon =
      expiresAt && new Date(expiresAt).getTime() - Date.now() < 30_000;

    if (!accessToken || isExpiringSoon) {
      const refreshed = await refreshSessionSingleFlight();
      accessToken = refreshed?.accessToken ?? null;
    }

    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    }
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method: options.method,
      headers,
      body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    });
  } catch {
    throw new ApiClientError({
      status: 0,
      message: "Sin conexión con el servidor. Verifica tu internet e inténtalo de nuevo.",
    });
  }

  // Si una ruta protegida responde 401, intentar renovar una sola vez (MV-A03-R03)
  if (response.status === 401 && options.requiresAuth && !options.isRetry) {
    const refreshed = await refreshSessionSingleFlight();
    if (refreshed?.accessToken) {
      return request<T>(path, { ...options, isRetry: true });
    }
    await sessionStorage.clearSession();
  }

  if (!response.ok) {
    throw await parseErrorResponse(response);
  }

  if (response.status === 202 || response.status === 204) {
    return undefined as T;
  }

  const text = await response.text();
  return (text ? JSON.parse(text) : undefined) as T;
}

/**
 * Cliente de Autenticación y Cuenta conectado a los 7 endpoints confirmados en Azure
 */
export const authApi = {
  /**
   * 1. POST /api/v1/auth/registro (EP-M01-01)
   */
  async registrarUsuario(payload: RegistroInput): Promise<RegistroResponse> {
    const cleanEmail = payload.correo.trim().toLowerCase();

    // Verificación preventiva de duplicados antes de despacho de red
    const isRegisteredLocally = await sessionStorage.isEmailRegistered(cleanEmail);
    if (isRegisteredLocally) {
      throw new ApiClientError({
        status: 409,
        message: "Este correo ya está registrado en UniHome. Puedes iniciar sesión directamente.",
        detail: "Este correo ya está registrado en UniHome. Puedes iniciar sesión directamente.",
        fieldErrors: {
          correo: ["Este correo ya está registrado en UniHome. Puedes iniciar sesión directamente."],
        },
      });
    }

    try {
      const response = await request<RegistroResponse>("/api/v1/auth/registro", {
        method: "POST",
        body: {
          nombreCompleto: payload.nombreCompleto.trim(),
          correo: cleanEmail,
          fechaNacimiento: payload.fechaNacimiento.trim(),
          genero: toApiGender(payload.genero),
          contrasena: payload.contrasena,
          confirmarContrasena: payload.confirmarContrasena,
          aceptoAvisoPrivacidad: payload.aceptoAvisoPrivacidad,
          versionAvisoPrivacidad: payload.versionAvisoPrivacidad ?? PRIVACY_NOTICE_VERSION,
        } satisfies RegistroRequest,
      });

      // Registrar correo en caché local tras registro exitoso
      await sessionStorage.addRegisteredEmail(cleanEmail);
      return response;
    } catch (error) {
      if (error instanceof ApiClientError && error.status === 409) {
        await sessionStorage.addRegisteredEmail(cleanEmail);
      }
      throw error;
    }
  },

  /**
   * 2. POST /api/v1/auth/confirmacion-correo (EP-M01-02)
   */
  async confirmarCorreo(payload: ConfirmacionCorreoRequest): Promise<ConfirmacionCorreoResponse> {
    const cleanEmail = payload.correo.trim().toLowerCase();
    const res = await request<Partial<ConfirmacionCorreoResponse> | undefined>(
      "/api/v1/auth/confirmacion-correo",
      {
        method: "POST",
        body: {
          correo: cleanEmail,
          codigo: payload.codigo.trim(),
        },
      }
    );
    return {
      correo: res?.correo || cleanEmail,
      confirmado: res?.confirmado ?? true,
    };
  },

  /**
   * 3. POST /api/v1/auth/confirmacion-correo/reenvio (EP-M01-03)
   */
  async reenviarCodigoConfirmacion(
    correoOrPayload: string | ReenvioCodigoRequest
  ): Promise<{ mensaje?: string }> {
    const cleanEmail =
      typeof correoOrPayload === "string"
        ? correoOrPayload.trim().toLowerCase()
        : correoOrPayload.correo.trim().toLowerCase();
    await request<void>("/api/v1/auth/confirmacion-correo/reenvio", {
      method: "POST",
      body: { correo: cleanEmail },
    });
    return {
      mensaje:
        "Solicitud aceptada. Si el correo corresponde a una cuenta pendiente de confirmar, recibirás un nuevo código de 6 dígitos.",
    };
  },

  /**
   * 4. POST /api/v1/auth/login (EP-M01-04)
   */
  async iniciarSesion(payload: LoginRequest): Promise<TokenResponse> {
    const cleanEmail = payload.correo.trim().toLowerCase();
    const tokens = await request<TokenResponse>("/api/v1/auth/login", {
      method: "POST",
      body: {
        correo: cleanEmail,
        contrasena: payload.contrasena,
      },
    });
    await sessionStorage.setRefreshToken(tokens.refreshToken);
    await sessionStorage.setSessionEmail(cleanEmail);
    sessionStorage.setAccessToken(tokens.accessToken, tokens.expiraEn);
    return tokens;
  },

  /**
   * 5. POST /api/v1/auth/refresh (EP-M01-08)
   */
  async refrescarSesion(): Promise<TokenResponse | null> {
    return refreshSessionSingleFlight();
  },

  /**
   * 6. POST /api/v1/auth/logout (EP-M01-05)
   * Limpia siempre la sesión local aunque falle la red (SES-13, SES-14).
   */
  async cerrarSesion(): Promise<{ serverNotified: boolean }> {
    try {
      await request<void>("/api/v1/auth/logout", {
        method: "POST",
        requiresAuth: true,
      });
      await sessionStorage.clearSession();
      return { serverNotified: true };
    } catch {
      await sessionStorage.clearSession();
      return { serverNotified: false };
    }
  },

  /**
   * 7. DELETE /api/v1/cuentas/mi-cuenta (EP-M01-09)
   */
  async eliminarMiCuenta(payload: EliminarCuentaRequest): Promise<void> {
    await request<void>("/api/v1/cuentas/mi-cuenta", {
      method: "DELETE",
      body: payload,
      requiresAuth: true,
    });
    await sessionStorage.clearSession();
  },
};
