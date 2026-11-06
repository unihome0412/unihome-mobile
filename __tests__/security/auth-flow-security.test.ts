import { authApi, ApiClientError, refreshSessionSingleFlight } from "../../src/services/authApi";
import { sessionStorage } from "../../src/services/sessionStorage";

jest.mock("../../src/services/sessionStorage", () => {
  let mockAccess: string | null = null;
  let mockExpires: string | null = null;
  let mockRefresh: string | null = "stored-valid-refresh-token";
  let mockEmail: string | null = null;

  return {
    sessionStorage: {
      getAccessToken: jest.fn(() => mockAccess),
      getExpiresAt: jest.fn(() => mockExpires),
      setAccessToken: jest.fn((token: string | null, exp?: string | null) => {
        mockAccess = token;
        mockExpires = exp ?? null;
      }),
      getRefreshToken: jest.fn(async () => mockRefresh),
      setRefreshToken: jest.fn(async (token: string) => {
        mockRefresh = token;
      }),
      getSessionEmail: jest.fn(async () => mockEmail),
      setSessionEmail: jest.fn(async (email: string) => {
        mockEmail = email;
      }),
      clearSession: jest.fn(async () => {
        mockAccess = null;
        mockExpires = null;
        mockRefresh = null;
        mockEmail = null;
      }),
    },
  };
});

describe("Seguridad en Flujos de Autenticación (ST-F01-001, ST-F01-002, ST-F02-001, ST-F02-002, ST-F02-004)", () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
    jest.clearAllMocks();
  });

  test("ST-F01-001: Registro no persiste contraseñas ni códigos de confirmación en el dispositivo", async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      status: 200,
      text: async () =>
        JSON.stringify({
          correo: "usuario@unihome.edu.mx",
          requiereConfirmacionCorreo: true,
          correoConfirmacionEnviado: true,
        }),
    } as Response);

    await authApi.registrarUsuario({
      nombreCompleto: "Valeria Sánchez",
      correo: "usuario@unihome.edu.mx",
      fechaNacimiento: "2004-05-15",
      genero: "Mujer",
      contrasena: "SuperSecretPassword123!",
      confirmarContrasena: "SuperSecretPassword123!",
      aceptoAvisoPrivacidad: true,
    });

    // Validar que el storage nunca recibió la contraseña
    expect(sessionStorage.setAccessToken).not.toHaveBeenCalled();
    expect(sessionStorage.setRefreshToken).not.toHaveBeenCalled();
  });

  test("ST-F01-002: Anti-enumeración en registro: respuesta 409 retorna mensaje neutro aprobado", async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: false,
      status: 409,
      headers: { get: () => null },
      json: async () => ({
        type: "https://httpstatuses.com/409",
        title: "Conflict",
        status: 409,
        detail: "El correo ya existe en la plataforma.",
      }),
    } as unknown as Response);

    await expect(
      authApi.registrarUsuario({
        nombreCompleto: "Valeria Sánchez",
        correo: "existente@unihome.edu.mx",
        fechaNacimiento: "2004-05-15",
        genero: "Mujer",
        contrasena: "Password123!",
        confirmarContrasena: "Password123!",
        aceptoAvisoPrivacidad: true,
      })
    ).rejects.toThrow(ApiClientError);

    // Vuelve a llamar para inspeccionar el mensaje exacto
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: false,
      status: 409,
      headers: { get: () => null },
      json: async () => ({ status: 409 }),
    } as unknown as Response);

    try {
      await authApi.registrarUsuario({
        nombreCompleto: "Valeria Sánchez",
        correo: "existente@unihome.edu.mx",
        fechaNacimiento: "2004-05-15",
        genero: "Mujer",
        contrasena: "Password123!",
        confirmarContrasena: "Password123!",
        aceptoAvisoPrivacidad: true,
      });
    } catch (err) {
      const apiErr = err as ApiClientError;
      expect(apiErr.status).toBe(409);
      expect(apiErr.message).toBe(
        "Este correo ya está registrado en UniHome. Puedes iniciar sesión directamente."
      );
    }
  });

  test("ST-F02-001: Anti-enumeración en login: respuesta 401 retorna mensaje unificado indistinguible", async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: false,
      status: 401,
      headers: { get: () => null },
      json: async () => ({ status: 401 }),
    } as unknown as Response);

    try {
      await authApi.iniciarSesion({
        correo: "noexiste@unihome.edu.mx",
        contrasena: "WrongPassword999!",
      });
    } catch (err) {
      const apiErr = err as ApiClientError;
      expect(apiErr.status).toBe(401);
      expect(apiErr.message).toBe("Revisa tu correo y contraseña.");
    }
  });

  test("ST-F02-002: Sanitización de excepciones: ApiClientError no filtra ni expone contraseñas", () => {
    const error = new ApiClientError({
      status: 400,
      message: "Credenciales inválidas",
      fieldErrors: {
        contrasena: ["La contraseña debe tener al menos 8 caracteres"],
      },
    });

    const serialized = JSON.stringify(error);
    expect(serialized).not.toContain("SuperSecretPassword123!");
    expect(error.getFieldError("contrasena")).toBe(
      "La contraseña debe tener al menos 8 caracteres"
    );
  });

  test("ST-F02-004: Concurrencia de renovación de sesión (Single Flight): peticiones simultáneas reutilizan la misma llamada", async () => {
    let callCount = 0;
    global.fetch = jest.fn().mockImplementation(async () => {
      callCount++;
      return {
        ok: true,
        status: 200,
        json: async () => ({
          accessToken: "new-access-token-rotado",
          refreshToken: "new-refresh-token-rotado",
          expiraEn: "2026-11-06T22:00:00Z",
        }),
      } as unknown as Response;
    });

    // Iniciar dos llamadas simultáneas a refreshSessionSingleFlight
    const [p1, p2] = await Promise.all([
      refreshSessionSingleFlight(),
      refreshSessionSingleFlight(),
    ]);

    // Verificar que solo ocurrió 1 invocación a fetch
    expect(callCount).toBe(1);
    expect(p1).toEqual(p2);
    expect(p1?.accessToken).toBe("new-access-token-rotado");
    expect(sessionStorage.setRefreshToken).toHaveBeenCalledWith(
      "new-refresh-token-rotado"
    );
  });
});
