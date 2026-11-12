import fs from "node:fs";

const required = [
  "ANDROID_KEYSTORE_PATH",
  "ANDROID_KEYSTORE_PASSWORD",
  "ANDROID_KEY_ALIAS",
  "ANDROID_KEY_PASSWORD",
];
for (const name of required) {
  if (!process.env[name]) {
    throw new Error(`Falta la variable de entorno ${name}; la firma no puede continuar`);
  }
}

const gradleFile = "android/app/build.gradle";
let gradle = fs.readFileSync(gradleFile, "utf8");

if (gradle.includes("ANDROID_UPLOAD_KEYSTORE")) {
  console.log("La configuración de firma ya estaba inyectada; no se modifica de nuevo.");
  process.exit(0);
}

const signingConfigs = /(    signingConfigs \{\n        debug \{[\s\S]*?\n        \}\n)(    \})/;
if (!signingConfigs.test(gradle)) {
  throw new Error("No se encontró el bloque signingConfigs esperado en el Gradle generado");
}

gradle = gradle.replace(
  signingConfigs,
  `$1        release {
            // ANDROID_UPLOAD_KEYSTORE: los valores se leen del entorno del runner protegido.
            if (System.getenv("ANDROID_KEYSTORE_PATH")) {
                storeFile file(System.getenv("ANDROID_KEYSTORE_PATH"))
                storePassword System.getenv("ANDROID_KEYSTORE_PASSWORD")
                keyAlias System.getenv("ANDROID_KEY_ALIAS")
                keyPassword System.getenv("ANDROID_KEY_PASSWORD")
            }
        }
$2`,
);

const releaseDebugSigning = `        release {
            // Caution! In production, you need to generate your own keystore file.
            // see https://reactnative.dev/docs/signed-apk-android.
            signingConfig signingConfigs.debug`;
if (!gradle.includes(releaseDebugSigning)) {
  throw new Error("No se encontró la configuración release/debug esperada; no se aplica la firma");
}
gradle = gradle.replace(
  releaseDebugSigning,
  `        release {
            // Caution! In production, you need to generate your own keystore file.
            // see https://reactnative.dev/docs/signed-apk-android.
            signingConfig signingConfigs.release`,
);

fs.writeFileSync(gradleFile, gradle);
console.log("Firma release inyectada en el proyecto Android generado (sin imprimir valores).");
