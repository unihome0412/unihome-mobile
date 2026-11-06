import { sessionStorage } from "../../src/services/sessionStorage";
import * as SecureStore from "expo-secure-store";

jest.mock("expo-secure-store", () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

describe("Seguridad de Almacenamiento (ST-TRANS-001, ST-F02-005, ST-F02-006)", () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    await sessionStorage.clearSession();
  });

  test("ST-TRANS-001: Access token vive exclusivamente en memoria y nunca se delega a almacenamiento persistente", () => {
    sessionStorage.setAccessToken("jwt-access-token-secret-12345", "2026-11-06T20:00:00Z");

    // Verificar que está disponible en memoria
    expect(sessionStorage.getAccessToken()).toBe("jwt-access-token-secret-12345");
    expect(sessionStorage.getExpiresAt()).toBe("2026-11-06T20:00:00Z");

    // Verificar que expo-secure-store NO fue invocado para almacenar el access token
    expect(SecureStore.setItemAsync).not.toHaveBeenCalledWith(
      expect.anything(),
      "jwt-access-token-secret-12345"
    );
  });

  test("ST-F02-006: Refresh token se guarda cifrado en almacenamiento seguro del sistema (expo-secure-store)", async () => {
    const mockRefreshToken = "jwt-refresh-token-rotativo-abcdef";

    await sessionStorage.setRefreshToken(mockRefreshToken);

    expect(SecureStore.setItemAsync).toHaveBeenCalledWith(
      "unihome_refresh_token",
      mockRefreshToken
    );

    (SecureStore.getItemAsync as jest.Mock).mockResolvedValueOnce(mockRefreshToken);
    const retrieved = await sessionStorage.getRefreshToken();
    expect(retrieved).toBe(mockRefreshToken);
    expect(SecureStore.getItemAsync).toHaveBeenCalledWith("unihome_refresh_token");
  });

  test("ST-F02-005: clearSession destruye tokens en memoria y elimina claves en SecureStore", async () => {
    sessionStorage.setAccessToken("token-en-memoria", "2026-11-06T20:00:00Z");
    await sessionStorage.setRefreshToken("token-en-disco");
    await sessionStorage.setSessionEmail("estudiante@unihome.edu.mx");

    await sessionStorage.clearSession();

    // Memoria vaciada
    expect(sessionStorage.getAccessToken()).toBeNull();
    expect(sessionStorage.getExpiresAt()).toBeNull();

    // Claves eliminadas en SecureStore
    expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith("unihome_refresh_token");
    expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith("unihome_session_email");
  });
});
