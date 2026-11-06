import * as fs from "fs";
import * as path from "path";

describe("Inspección Estática de Código y Manifiesto de Dependencias (ST-TRANS-003, ST-TRANS-006 parcial)", () => {
  test("ST-TRANS-003: Servicios de autenticación no contienen console.log de contraseñas o tokens (lectura estática de archivo)", () => {
    const servicesDir = path.resolve(__dirname, "../../src/services");
    const serviceFiles = ["authApi.ts", "sessionStorage.ts"];

    for (const file of serviceFiles) {
      const fullPath = path.join(servicesDir, file);
      if (fs.existsSync(fullPath)) {
        const content = fs.readFileSync(fullPath, "utf-8");
        // No deben existir console.log o console.info con passwords o tokens
        expect(content).not.toMatch(/console\.(log|debug|info)\(.*contrasena/i);
        expect(content).not.toMatch(/console\.(log|debug|info)\(.*token/i);
        expect(content).not.toMatch(/console\.(log|debug|info)\(.*password/i);
      }
    }
  });

  test("ST-TRANS-006 (Parcial - Verificación estática): package.json no incluye librerías no aprobadas (crypto-js, react-native-keychain)", () => {
    const pkgPath = path.resolve(__dirname, "../../package.json");
    const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));

    const deps = pkg.dependencies || {};

    // Comprobar que dependencias de producción no contengan paquetes prohibidos en el SDD
    expect(deps).not.toHaveProperty("crypto-js"); // Prohibido en SDD a favor de WebCrypto / Keystore
    expect(deps).not.toHaveProperty("react-native-keychain"); // Prohibido a favor de expo-secure-store

    // Comprobar que expo-secure-store está presente
    expect(deps).toHaveProperty("expo-secure-store");
  });
});
