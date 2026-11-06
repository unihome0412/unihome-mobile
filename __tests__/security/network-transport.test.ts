import { API_BASE_URL, PRIVACY_NOTICE_VERSION } from "../../src/services/authApi";

describe("Seguridad de Transporte de Red (ST-TRANS-002, ST-TRANS-005)", () => {
  test("ST-TRANS-002: La comunicación con el backend utiliza estrictamente HTTPS", () => {
    expect(API_BASE_URL).toMatch(/^https:\/\//);
    expect(API_BASE_URL.startsWith("http://")).toBe(false);
  });

  test("ST-TRANS-005: La URL base no contiene credenciales incrustadas ni puertos inseguros", () => {
    const url = new URL(API_BASE_URL);
    expect(url.protocol).toBe("https:");
    expect(url.username).toBe("");
    expect(url.password).toBe("");
    expect(url.port).toBe("");
    expect(PRIVACY_NOTICE_VERSION).toBe("1.0");
  });
});
