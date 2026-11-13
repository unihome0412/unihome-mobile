import crypto from "node:crypto";
import fs from "node:fs";

export const PLAY_API_BASE = "https://androidpublisher.googleapis.com/androidpublisher/v3";
export const PLAY_UPLOAD_BASE =
  "https://androidpublisher.googleapis.com/upload/androidpublisher/v3";
export const OAUTH_TOKEN_URL = "https://oauth2.googleapis.com/token";
export const ANDROID_PUBLISHER_SCOPE = "https://www.googleapis.com/auth/androidpublisher";

export const TARGETS = ["internal", "closed", "production"];
export const PRODUCTION_RELEASES = ["draft", "staged"];
export const RELEASE_STATUSES = ["completed", "draft", "inProgress", "halted"];

const SHA256_PATTERN = /^[a-f0-9]{64}$/;

function assertNonEmptyString(value, label) {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`${label} debe ser una cadena no vacía`);
  }
  return value.trim();
}

export function assertSha256(value, label = "sha256") {
  const normalized = String(value ?? "")
    .trim()
    .toLowerCase();
  if (!SHA256_PATTERN.test(normalized)) {
    throw new Error(`${label} no es un SHA256 hexadecimal de 64 caracteres`);
  }
  return normalized;
}

export function sha256File(filePath) {
  const contents = fs.readFileSync(filePath);
  return crypto.createHash("sha256").update(contents).digest("hex");
}

export function parseServiceAccountJson(raw) {
  if (typeof raw !== "string" || raw.trim() === "") {
    throw new Error("Falta PLAY_SERVICE_ACCOUNT_JSON en el environment protegido");
  }

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("PLAY_SERVICE_ACCOUNT_JSON no contiene JSON válido");
  }

  if (
    parsed.type !== "service_account" ||
    typeof parsed.client_email !== "string" ||
    typeof parsed.private_key !== "string"
  ) {
    throw new Error("PLAY_SERVICE_ACCOUNT_JSON no es una cuenta de servicio válida");
  }

  return {
    clientEmail: parsed.client_email,
    privateKey: parsed.private_key,
  };
}

export function readAppConfig(appJson) {
  const expo = appJson?.expo ?? appJson;
  const versionCode = expo?.android?.versionCode;

  if (!Number.isSafeInteger(versionCode) || versionCode <= 0) {
    throw new Error("app.json no contiene un versionCode entero positivo");
  }
  assertNonEmptyString(expo?.android?.package, "app.json android.package");
  assertNonEmptyString(expo?.version, "app.json version");

  return {
    packageName: expo.android.package.trim(),
    versionCode,
    versionName: expo.version.trim(),
  };
}

export function resolveTrackName({ target, closedTrack, availableTracks = [] }) {
  if (!TARGETS.includes(target)) {
    throw new Error(`Destino de Play desconocido: ${target}`);
  }

  if (target === "closed") {
    const trackName = assertNonEmptyString(closedTrack, "PLAY_CLOSED_TRACK para la pista cerrada");
    if (
      trackName === "internal" ||
      trackName === "production" ||
      trackName.endsWith(":production")
    ) {
      throw new Error("PLAY_CLOSED_TRACK debe ser el identificador de una pista cerrada");
    }
    if (availableTracks.length > 0 && !availableTracks.includes(trackName)) {
      throw new Error(
        `La pista cerrada configurada (${trackName}) no existe en Google Play; ` +
          `pistas disponibles: ${availableTracks.join(", ")}`,
      );
    }
    return trackName;
  }

  if (availableTracks.length > 0 && !availableTracks.includes(target)) {
    throw new Error(
      `La pista ${target} no existe en Google Play; ` +
        `pistas disponibles: ${availableTracks.join(", ")}`,
    );
  }
  return target;
}

function parseUserFraction(value) {
  if (value === undefined || value === null || String(value).trim() === "") {
    return undefined;
  }
  const fraction = Number(value);
  if (!Number.isFinite(fraction) || fraction <= 0 || fraction >= 1) {
    throw new Error("user_fraction debe ser un número mayor que 0 y menor que 1");
  }
  return fraction;
}

export function validateReleasePlan({
  target,
  productionRelease = "draft",
  userFraction,
  closedTrack,
  availableTracks = [],
}) {
  if (!TARGETS.includes(target)) {
    throw new Error(`Destino de Play desconocido: ${target}`);
  }
  if (!PRODUCTION_RELEASES.includes(productionRelease)) {
    throw new Error(`Modo de producción desconocido: ${productionRelease}`);
  }

  const fraction = parseUserFraction(userFraction);
  let status;
  let changesNotSentForReview;

  if (target === "production") {
    if (productionRelease === "draft") {
      if (fraction !== undefined) {
        throw new Error("Un release draft no admite userFraction");
      }
      status = "draft";
      changesNotSentForReview = true;
    } else {
      if (fraction === undefined) {
        throw new Error("Un rollout escalonado exige userFraction");
      }
      status = "inProgress";
      changesNotSentForReview = false;
    }
  } else {
    if (productionRelease !== "draft") {
      throw new Error("Solo producción puede usar un rollout escalonado");
    }
    if (fraction !== undefined) {
      throw new Error("Las pistas internas o cerradas no admiten userFraction");
    }
    status = "completed";
    changesNotSentForReview = false;
  }

  const trackName = resolveTrackName({
    target,
    closedTrack,
    availableTracks,
  });

  return {
    target,
    trackName,
    status,
    userFraction: fraction,
    changesNotSentForReview,
  };
}

export function findBundle(bundles, versionCode) {
  return (bundles ?? []).find((bundle) => String(bundle.versionCode) === String(versionCode));
}

export function findTestingTracks(tracks, versionCode) {
  return (tracks ?? [])
    .filter((track) => track.track !== "production" && !String(track.track).endsWith(":production"))
    .filter((track) =>
      (track.releases ?? []).some(
        (release) =>
          ["completed", "inProgress"].includes(release.status) &&
          (release.versionCodes ?? []).map(String).includes(String(versionCode)),
      ),
    )
    .map((track) => track.track);
}

export function decideBundleAction({ target, bundle, versionCode, sha256, testingTracks = [] }) {
  if (!TARGETS.includes(target)) {
    throw new Error(`Destino de Play desconocido: ${target}`);
  }
  const expectedSha = assertSha256(sha256);

  if (bundle) {
    if (String(bundle.versionCode) !== String(versionCode)) {
      throw new Error("El bundle encontrado no corresponde al versionCode esperado");
    }
    const remoteSha = assertSha256(bundle.sha256, "sha256 del bundle en Google Play");
    if (remoteSha !== expectedSha) {
      throw new Error(
        `El versionCode ${versionCode} ya existe en Google Play con otro SHA256; ` +
          "no se reutiliza ni se reemplaza",
      );
    }

    const sourceTracks = findTestingTracks(testingTracks, versionCode);
    if (target === "production" && sourceTracks.length === 0) {
      throw new Error(
        `El versionCode ${versionCode} no está asignado a una pista de pruebas; ` +
          "producción solo promociona un AAB ya probado",
      );
    }

    return {
      action: "reuse",
      sourceTracks,
    };
  }

  if (target === "production") {
    throw new Error(
      "No se sube un AAB nuevo directamente a producción; " +
        "primero debe cargarse y asignarse a una pista de pruebas",
    );
  }

  return {
    action: "upload",
    sourceTracks: [],
  };
}

export function buildTrackUpdate({ trackName, status, versionCode, versionName, userFraction }) {
  if (!RELEASE_STATUSES.includes(status)) {
    throw new Error(`Estado de release desconocido: ${status}`);
  }
  if (status === "inProgress" && userFraction === undefined) {
    throw new Error("inProgress exige userFraction");
  }
  if (status !== "inProgress" && userFraction !== undefined) {
    throw new Error(`${status} no admite userFraction`);
  }

  const release = {
    name: assertNonEmptyString(versionName, "versionName"),
    versionCodes: [String(versionCode)],
    status,
  };
  if (status === "inProgress") {
    release.userFraction = userFraction;
  }

  return {
    track: trackName,
    releases: [release],
  };
}

export function buildCommitRequest({ status }) {
  return {
    changesNotSentForReview: status === "draft",
  };
}

export function validateTrackUpdateResponse(response, expected) {
  if (response?.track !== expected.trackName) {
    throw new Error("Google Play no confirmó la pista actualizada");
  }
  const release = (response.releases ?? []).find((item) =>
    (item.versionCodes ?? []).map(String).includes(String(expected.versionCode)),
  );
  if (!release) {
    throw new Error("Google Play no confirmó el versionCode en la pista");
  }
  if (release.status !== expected.status) {
    throw new Error(
      `Google Play confirmó estado ${release.status}; se esperaba ${expected.status}`,
    );
  }
  if (expected.status === "inProgress") {
    if (Number(release.userFraction) !== Number(expected.userFraction)) {
      throw new Error("Google Play no confirmó el userFraction solicitado");
    }
  } else if (release.userFraction !== undefined) {
    throw new Error(`Google Play devolvió userFraction para un release ${expected.status}`);
  }
}

export function createSignedJwt({ clientEmail, privateKey, now = Math.floor(Date.now() / 1000) }) {
  const header = Buffer.from(JSON.stringify({ alg: "RS256", typ: "JWT" })).toString("base64url");
  const payload = Buffer.from(
    JSON.stringify({
      iss: clientEmail,
      scope: ANDROID_PUBLISHER_SCOPE,
      aud: OAUTH_TOKEN_URL,
      iat: now,
      exp: now + 3600,
    }),
  ).toString("base64url");
  const signingInput = `${header}.${payload}`;
  const signature = crypto
    .sign("RSA-SHA256", Buffer.from(signingInput), privateKey)
    .toString("base64url");
  return `${signingInput}.${signature}`;
}

async function parseResponse(response) {
  const text = await response.text();
  if (!text) {
    return {};
  }
  try {
    return JSON.parse(text);
  } catch {
    return { message: text.slice(0, 500) };
  }
}

function apiErrorMessage(data, fallback) {
  return (
    data?.error?.message ?? data?.error_description ?? data?.error ?? data?.message ?? fallback
  );
}

export async function getAccessToken({ serviceAccount, fetchImpl = globalThis.fetch, now }) {
  if (typeof fetchImpl !== "function") {
    throw new Error("fetch no está disponible en este runtime");
  }
  const assertion = createSignedJwt({
    clientEmail: serviceAccount.clientEmail,
    privateKey: serviceAccount.privateKey,
    now,
  });
  const response = await fetchImpl(OAUTH_TOKEN_URL, {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
  });
  const data = await parseResponse(response);
  if (!response.ok || typeof data.access_token !== "string") {
    throw new Error(
      `No se obtuvo token de Google Play: ${apiErrorMessage(data, `HTTP ${response.status}`)}`,
    );
  }
  return data.access_token;
}

export function createPlayClient({
  serviceAccount,
  packageName,
  fetchImpl = globalThis.fetch,
  baseUrl = PLAY_API_BASE,
  uploadBaseUrl = PLAY_UPLOAD_BASE,
}) {
  const encodedPackage = encodeURIComponent(packageName);
  let cachedToken;
  let tokenExpiresAt = 0;

  async function token() {
    if (cachedToken && Date.now() < tokenExpiresAt) {
      return cachedToken;
    }
    cachedToken = await getAccessToken({ serviceAccount, fetchImpl });
    tokenExpiresAt = Date.now() + 55 * 60 * 1000;
    return cachedToken;
  }

  async function request(pathname, { method = "GET", body, headers = {}, base = baseUrl } = {}) {
    const accessToken = await token();
    const response = await fetchImpl(`${base}${pathname}`, {
      method,
      headers: {
        authorization: `Bearer ${accessToken}`,
        ...(body === undefined ? {} : { "content-type": "application/json" }),
        ...headers,
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    const data = await parseResponse(response);
    if (!response.ok) {
      throw new Error(
        `Google Play API ${method} ${pathname}: ` +
          apiErrorMessage(data, `HTTP ${response.status}`),
      );
    }
    return data;
  }

  async function uploadBundle(editId, aabPath) {
    const accessToken = await token();
    const response = await fetchImpl(
      `${uploadBaseUrl}/applications/${encodedPackage}/edits/${editId}/bundles?uploadType=media`,
      {
        method: "POST",
        headers: {
          authorization: `Bearer ${accessToken}`,
          "content-type": "application/octet-stream",
        },
        body: fs.readFileSync(aabPath),
      },
    );
    const data = await parseResponse(response);
    if (!response.ok) {
      throw new Error(
        `Google Play API POST upload bundle: ` + apiErrorMessage(data, `HTTP ${response.status}`),
      );
    }
    return data;
  }

  return {
    createEdit() {
      return request(`/applications/${encodedPackage}/edits`, {
        method: "POST",
      });
    },
    listBundles(editId) {
      return request(`/applications/${encodedPackage}/edits/${editId}/bundles`);
    },
    uploadBundle,
    listTracks(editId) {
      return request(`/applications/${encodedPackage}/edits/${editId}/tracks`);
    },
    updateTrack(editId, trackName, track) {
      return request(
        `/applications/${encodedPackage}/edits/${editId}/tracks/${encodeURIComponent(trackName)}`,
        {
          method: "PUT",
          body: track,
        },
      );
    },
    commitEdit(editId, { changesNotSentForReview }) {
      return request(
        `/applications/${encodedPackage}/edits/${editId}:commit?` +
          new URLSearchParams({
            changesNotSentForReview: String(Boolean(changesNotSentForReview)),
          }).toString(),
        {
          method: "POST",
        },
      );
    },
    deleteEdit(editId) {
      return request(`/applications/${encodedPackage}/edits/${editId}`, {
        method: "DELETE",
      });
    },
  };
}

export async function performPlayRelease({ client, aabPath, versionCode, versionName, plan }) {
  const sha256 = sha256File(aabPath);
  let editId;

  try {
    editId = (await client.createEdit()).id;
    if (!editId) {
      throw new Error("Google Play no devolvió un editId");
    }

    const tracksBefore = (await client.listTracks(editId)).tracks ?? [];
    resolveTrackName({
      target: plan.target,
      closedTrack: plan.trackName,
      availableTracks: tracksBefore.map((track) => track.track),
    });

    const bundles = (await client.listBundles(editId)).bundles ?? [];
    const activeBundle = findBundle(bundles, versionCode);
    const decision = decideBundleAction({
      target: plan.target,
      bundle: activeBundle,
      versionCode,
      sha256,
      testingTracks: tracksBefore,
    });

    if (decision.action === "upload") {
      const uploaded = await client.uploadBundle(editId, aabPath);
      if (String(uploaded.versionCode) !== String(versionCode)) {
        throw new Error(
          `Google Play subió versionCode ${uploaded.versionCode}; se esperaba ${versionCode}`,
        );
      }
      if (uploaded.sha256 !== undefined) {
        const remoteSha = assertSha256(uploaded.sha256, "sha256 del bundle subido a Google Play");
        if (remoteSha !== sha256) {
          throw new Error("Google Play devolvió un SHA256 distinto al AAB local");
        }
      }
    }

    const updated = await client.updateTrack(
      editId,
      plan.trackName,
      buildTrackUpdate({
        trackName: plan.trackName,
        status: plan.status,
        versionCode,
        versionName,
        userFraction: plan.userFraction,
      }),
    );
    validateTrackUpdateResponse(updated, {
      trackName: plan.trackName,
      status: plan.status,
      versionCode,
      userFraction: plan.userFraction,
    });

    await client.commitEdit(editId, buildCommitRequest({ status: plan.status }));
    editId = undefined;

    return {
      target: plan.target,
      trackName: plan.trackName,
      status: plan.status,
      userFraction: plan.userFraction,
      versionCode,
      versionName,
      sha256,
      uploaded: decision.action === "upload",
      reused: decision.action === "reuse",
      sourceTracks: decision.sourceTracks,
      changesNotSentForReview: plan.changesNotSentForReview,
    };
  } catch (error) {
    if (editId) {
      try {
        await client.deleteEdit(editId);
      } catch {
        // El error original es el que se reporta; el edit queda para revisión humana.
      }
    }
    throw error;
  }
}

export function validateMetadataForPlay({
  metadata,
  app,
  sha256,
  sizeBytes,
  expectedCommit,
  expectedRunId,
}) {
  const expectedSha = assertSha256(sha256);
  if (metadata?.commit !== expectedCommit) {
    throw new Error("El metadata del AAB no corresponde al commit de origen autorizado");
  }
  if (String(metadata?.runId) !== String(expectedRunId)) {
    throw new Error("El metadata del AAB no corresponde al run de release autorizado");
  }
  if (metadata?.ref !== "refs/heads/main") {
    throw new Error("El AAB no fue generado desde refs/heads/main");
  }
  if (metadata?.package !== app.packageName) {
    throw new Error("El applicationId del metadata no coincide con app.json");
  }
  if (Number(metadata?.versionCode) !== app.versionCode) {
    throw new Error("El versionCode del metadata no coincide con app.json");
  }
  if (metadata?.versionName !== app.versionName) {
    throw new Error("El versionName del metadata no coincide con app.json");
  }
  if (assertSha256(metadata?.sha256, "sha256 del metadata") !== expectedSha) {
    throw new Error("El SHA256 del metadata no coincide con el AAB");
  }
  if (Number(metadata?.sizeBytes) !== sizeBytes) {
    throw new Error("El tamaño del metadata no coincide con el AAB");
  }
}
