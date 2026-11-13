import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const getArg = (name) => {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] : undefined;
};

const apk = getArg("--apk");
const manifest = getArg("--manifest");
const profile = getArg("--profile") ?? "release";

if (!apk && !manifest) {
  throw new Error("Uso: node scripts/verify-android-manifest.mjs --apk <ruta> | --manifest <ruta>");
}
if (apk && manifest) {
  throw new Error("Elige --apk o --manifest, no ambos");
}
if (!["debug", "release", "release-source"].includes(profile)) {
  throw new Error(`Perfil desconocido: ${profile}`);
}

const appJson = JSON.parse(fs.readFileSync("app.json", "utf8")).expo;
const android = appJson.android;
const errors = [];
const allowedPermissions = new Set([
  "android.permission.INTERNET",
  "android.permission.VIBRATE",
  // Expo SecureStore declara capacidades biométricas aunque la app no las invoque.
  "android.permission.USE_BIOMETRIC",
  "android.permission.USE_FINGERPRINT",
  // Permiso de firma interno generado por AndroidX; no otorga acceso a datos.
  `${android.package}.DYNAMIC_RECEIVER_NOT_EXPORTED_PERMISSION`,
]);
if (profile === "debug") {
  allowedPermissions.add("android.permission.SYSTEM_ALERT_WINDOW");
  // Android 17 lo incorpora para depuración/Metro; no se permite en release.
  allowedPermissions.add("android.permission.ACCESS_LOCAL_NETWORK");
}

function fail(message) {
  errors.push(message);
}

function findAapt2() {
  const sdk = process.env.ANDROID_HOME ?? process.env.ANDROID_SDK_ROOT;
  if (!sdk) {
    throw new Error("ANDROID_HOME/ANDROID_SDK_ROOT no está definido; no se puede localizar aapt2");
  }
  const buildTools = path.join(sdk, "build-tools");
  if (!fs.existsSync(buildTools)) {
    throw new Error(`No existe ${buildTools}; instala Android Build Tools`);
  }
  const versions = fs
    .readdirSync(buildTools, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort((a, b) => b.localeCompare(a, undefined, { numeric: true }));
  for (const version of versions) {
    const candidate = path.join(
      buildTools,
      version,
      process.platform === "win32" ? "aapt2.exe" : "aapt2",
    );
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }
  throw new Error(`No se encontró aapt2 en ${buildTools}`);
}

function validateApk(file) {
  const aapt2 = findAapt2();
  const output = execFileSync(aapt2, ["dump", "badging", file], { encoding: "utf8" });
  const packageLine = output.match(
    /^package: name='([^']+)' versionCode='([^']+)' versionName='([^']+)'/m,
  );
  if (!packageLine) {
    fail(`${file}: aapt2 no devolvió package/versionCode/versionName`);
  } else {
    if (packageLine[1] !== android.package) {
      fail(`${file}: applicationId ${packageLine[1]} != ${android.package}`);
    }
    if (Number(packageLine[2]) !== android.versionCode) {
      fail(`${file}: versionCode ${packageLine[2]} != ${android.versionCode}`);
    }
    if (packageLine[3] !== appJson.version) {
      fail(`${file}: versionName ${packageLine[3]} != ${appJson.version}`);
    }
  }

  const targetSdk = output.match(/^targetSdkVersion:'([^']+)'/m);
  if (!targetSdk || Number(targetSdk[1]) < 36) {
    fail(`${file}: targetSdkVersion debe ser >= 36; encontrado ${targetSdk?.[1] ?? "ausente"}`);
  }

  const permissions = [...output.matchAll(/^uses-permission: name='([^']+)'/gm)].map(
    (match) => match[1],
  );
  for (const permission of permissions) {
    if (!allowedPermissions.has(permission)) {
      fail(`${file}: permiso no aprobado ${permission}`);
    }
  }

  const debuggable = /^application-debuggable$/m.test(output);
  if (profile === "release" && debuggable) {
    fail(`${file}: un APK release no puede ser debuggable`);
  }
  if (profile === "debug" && !debuggable) {
    fail(`${file}: el APK debug debe declararse debuggable`);
  }

  console.log(
    `${file}: package=${packageLine?.[1]} versionCode=${packageLine?.[2]} targetSdk=${targetSdk?.[1]}`,
  );
  console.log(`${file}: permisos=${permissions.join(", ")}`);
}

function validateManifest(file) {
  const xml = fs.readFileSync(file, "utf8");
  const allPermissions = [...xml.matchAll(/<uses-permission\b[^>]*>/g)].map((match) => match[0]);
  for (const element of allPermissions) {
    const name = element.match(/android:name="([^"]+)"/)?.[1];
    if (!name || /tools:node="remove"/.test(element)) {
      continue;
    }
    if (!allowedPermissions.has(name)) {
      fail(`${file}: permiso no aprobado ${name}`);
    }
  }

  const cleartext = /android:usesCleartextTraffic="true"/.test(xml);
  if (profile !== "debug" && cleartext) {
    fail(`${file}: usesCleartextTraffic=true no está permitido en release`);
  }

  const debuggable = /android:debuggable="true"/.test(xml);
  if (profile !== "debug" && debuggable) {
    fail(`${file}: android:debuggable=true no está permitido en release`);
  }

  const backup = xml.match(/<application\b[^>]*>/)?.[0] ?? "";
  if (/android:allowBackup="true"/.test(backup)) {
    if (
      !/android:dataExtractionRules="/.test(backup) ||
      !/android:fullBackupContent="/.test(backup)
    ) {
      fail(`${file}: allowBackup=true exige reglas de exclusión de SecureStore`);
    }
  }

  const exported = [
    ...xml.matchAll(/<(activity|activity-alias|service|receiver|provider)\b[^>]*>/g),
  ]
    .map((match) => match[0])
    .filter((element) => /android:exported="true"/.test(element))
    .map((element) => element.match(/android:name="([^"]+)"/)?.[1] ?? "(sin nombre)");
  const allowedExported = new Set([
    ".MainActivity",
    `${android.package}.MainActivity`,
    // Receptor estándar de AndroidX ProfileInstaller (protegido por android.permission.DUMP).
    "androidx.profileinstaller.ProfileInstallReceiver",
  ]);
  const unexpected = exported.filter((name) => !allowedExported.has(name));
  if (unexpected.length > 0) {
    fail(`${file}: componentes exportados no aprobados: ${unexpected.join(", ")}`);
  }

  const versionCode = xml.match(/android:versionCode="([^"]+)"/)?.[1];
  const versionName = xml.match(/android:versionName="([^"]+)"/)?.[1];
  const targetSdk = xml.match(/android:targetSdkVersion="([^"]+)"/)?.[1];
  if (profile === "release") {
    if (!versionCode) fail(`${file}: falta android:versionCode en el AAB release`);
    if (!versionName) fail(`${file}: falta android:versionName en el AAB release`);
    if (!targetSdk) fail(`${file}: falta android:targetSdkVersion en el AAB release`);
  }
  if (versionCode && Number(versionCode) !== android.versionCode) {
    fail(`${file}: versionCode ${versionCode} != ${android.versionCode}`);
  }
  if (versionName && versionName !== appJson.version) {
    fail(`${file}: versionName ${versionName} != ${appJson.version}`);
  }
  if (targetSdk && Number(targetSdk) < 36) {
    fail(`${file}: targetSdkVersion ${targetSdk} < 36`);
  }

  console.log(
    `${file}: permisos=${allPermissions.length} exportados=${exported.join(", ") || "ninguno"}`,
  );
}

if (apk) {
  validateApk(apk);
} else {
  validateManifest(manifest);
}

if (errors.length > 0) {
  errors.forEach((error) => console.error(`ERROR ${error}`));
  process.exitCode = 1;
} else {
  console.log(`OK ${apk ?? manifest}: configuración Android verificada (${profile})`);
}
