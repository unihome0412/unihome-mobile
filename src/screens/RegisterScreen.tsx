import React, { useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Button, Field, Icon, inputStyle, Note, PageHeader } from "../components/ui";
import {
  ApiError,
  authApi,
  GeneroDisplay,
  PRIVACY_NOTICE_VERSION,
} from "../services/authApi";
import { colors, fonts } from "../theme/tokens";
import { RootStackParamList } from "../../App";

type Props = NativeStackScreenProps<RootStackParamList, "Register">;

const MONTHS_ES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

const WEEKDAYS_SHORT = ["L", "M", "M", "J", "V", "S", "D"];

const GENDER_OPTIONS: GeneroDisplay[] = ["Mujer", "Hombre", "Prefiero no decir"];

const MAX_NAME_LENGTH = 80;
const MAX_EMAIL_LENGTH = 100;
const MAX_PASSWORD_LENGTH = 30;

/**
 * Filtra cualquier carácter que no sea letra (incluyendo acentos y ñ/ü) o espacio,
 * y aplica el límite máximo de 80 caracteres.
 */
function sanitizeFullName(input: string): string {
  return input
    .replace(/[^a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]/g, "")
    .replace(/\s{2,}/g, " ")
    .slice(0, MAX_NAME_LENGTH);
}

/**
 * Validación estricta de nombre completo: solo letras, espacios y acentos, entre 3 y 80 caracteres.
 */
function validateFullName(name: string): string | null {
  const clean = name.trim();
  if (!clean) {
    return "Ingresa tu nombre completo.";
  }
  if (clean.length < 3 || clean.length > MAX_NAME_LENGTH) {
    return `El nombre debe tener entre 3 y ${MAX_NAME_LENGTH} caracteres.`;
  }
  if (!/^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ]+(?:\s+[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ]+)*$/.test(clean)) {
    return "Solo se permiten letras, espacios y acentos.";
  }
  return null;
}

/**
 * Validación estricta de formato de correo electrónico (máximo 100 caracteres).
 */
function validateStrictEmail(email: string): string | null {
  const clean = email.trim();
  if (!clean) {
    return "Ingresa tu correo electrónico.";
  }
  if (clean.length > MAX_EMAIL_LENGTH) {
    return `El correo no puede exceder ${MAX_EMAIL_LENGTH} caracteres.`;
  }
  if (clean.includes(" ") || clean.includes("..")) {
    return "Ingresa un correo electrónico con formato válido (ej. nombre@dominio.mx).";
  }
  const parts = clean.split("@");
  if (parts.length !== 2) {
    return "El correo debe incluir un símbolo '@' y un dominio válido.";
  }
  const [local, domain] = parts;
  if (
    !local ||
    !domain ||
    local.startsWith(".") ||
    local.endsWith(".") ||
    domain.startsWith(".") ||
    domain.endsWith(".")
  ) {
    return "Ingresa un correo electrónico con formato válido.";
  }
  const strictRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,10}$/;
  if (!strictRegex.test(clean)) {
    return "Ingresa un dominio de correo válido (ej. tu.correo@ejemplo.mx).";
  }
  return null;
}

/**
 * Detecta si una cadena contiene números consecutivos ascendentes o descendentes
 * (por ejemplo "12", "23", "123", "456", "321", "98").
 */
function hasConsecutiveNumbers(value: string): boolean {
  for (let i = 0; i < value.length - 1; i++) {
    const c1 = value.charCodeAt(i);
    const c2 = value.charCodeAt(i + 1);
    const isDigit1 = c1 >= 48 && c1 <= 57;
    const isDigit2 = c2 >= 48 && c2 <= 57;
    if (isDigit1 && isDigit2 && Math.abs(c2 - c1) === 1) {
      return true;
    }
  }
  return false;
}

interface PasswordChecks {
  minLength: boolean;
  upperAndLower: boolean;
  hasNumber: boolean;
  hasSpecial: boolean;
  noConsecutiveNumbers: boolean;
  matchesConfirm: boolean;
  allPasswordRulesValid: boolean;
}

function evaluatePassword(pwd: string, pwd2: string): PasswordChecks {
  const minLength = pwd.length >= 8 && pwd.length <= MAX_PASSWORD_LENGTH;
  const upperAndLower =
    /[A-ZÁÉÍÓÚÜÑ]/.test(pwd) && /[a-záéíóúüñ]/.test(pwd);
  const hasNumber = /\d/.test(pwd);
  const hasSpecial = /[^a-zA-Z0-9áéíóúÁÉÍÓÚüÜñÑ\s]/.test(pwd);
  const noConsecutiveNumbers = hasNumber && !hasConsecutiveNumbers(pwd);
  const matchesConfirm = pwd.length > 0 && pwd2.length > 0 && pwd === pwd2;

  return {
    minLength,
    upperAndLower,
    hasNumber,
    hasSpecial,
    noConsecutiveNumbers,
    matchesConfirm,
    allPasswordRulesValid:
      minLength &&
      upperAndLower &&
      hasNumber &&
      hasSpecial &&
      noConsecutiveNumbers,
  };
}

function formatDisplayDateDDMMYYYY(date: Date): string {
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

function formatIsoDateYYYYMMDD(date: Date): string {
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();
  return `${yyyy}-${mm}-${dd}`;
}

/**
 * Pantalla de Registro de Cuenta (ruta "/registro" en Figma/src/App.tsx líneas 1625-1796).
 * Incluye:
 * - Validación de Nombre completo (solo letras, espacios y acentos).
 * - Validación estricta de Correo electrónico en tiempo real.
 * - Selector de fecha tipo Calendario con formato dd/mm/aaaa e ícono de calendario a la derecha.
 * - Campos de Contraseña y Confirmar contraseña en la misma fila con ícono de ojo interactivo.
 * - Validaciones estrictas de contraseña en tiempo real (8+ caracteres, mayúscula/minúscula,
 *   número, carácter especial, sin números consecutivos como 123/456 y coincidencia en tiempo real).
 */
export const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const [name, setName] = useState("");
  const [nameBlockedHint, setNameBlockedHint] = useState(false);
  const [email, setEmail] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);

  // Fecha de nacimiento seleccionada desde el Date Picker tipo Calendario
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [pickerYear, setPickerYear] = useState<number>(2004);
  const [pickerMonth, setPickerMonth] = useState<number>(4); // 0 = Enero, 4 = Mayo
  const [pickerDay, setPickerDay] = useState<number>(15);
  const [yearSelectorOpen, setYearSelectorOpen] = useState(false);

  const [gender, setGender] = useState<GeneroDisplay | "">("");

  // Contraseñas y visibilidad (ojo interactivo)
  const [pwd, setPwd] = useState("");
  const [pwd2, setPwd2] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [showPwd2, setShowPwd2] = useState(false);
  const [pwdTouched, setPwdTouched] = useState(false);
  const [pwd2Touched, setPwd2Touched] = useState(false);

  const [consent, setConsent] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [loading, setLoading] = useState(false);

  // Errores de validación
  const [fieldErrors, setFieldErrors] = useState<{
    nombreCompleto?: string | null;
    correo?: string | null;
    fechaNacimiento?: string | null;
    genero?: string | null;
    contrasena?: string | null;
    confirmarContrasena?: string | null;
    aceptoAvisoPrivacidad?: string | null;
  }>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [duplicateEmailConflict, setDuplicateEmailConflict] = useState(false);

  const pwdChecks = useMemo(() => evaluatePassword(pwd, pwd2), [pwd, pwd2]);

  // Error de correo en tiempo real
  const liveEmailError = useMemo(() => {
    if (fieldErrors.correo) return fieldErrors.correo;
    if (!emailTouched && email.length === 0) return null;
    if (email.length > 0) return validateStrictEmail(email);
    return null;
  }, [email, emailTouched, fieldErrors.correo]);

  // Años disponibles para el selector de calendario (cualquier fecha pasada válida — DEC-M10)
  const currentYear = new Date().getFullYear();
  const yearsList = useMemo(() => {
    const arr: number[] = [];
    for (let y = currentYear; y >= 1940; y--) {
      arr.push(y);
    }
    return arr;
  }, [currentYear]);

  // Días del mes activo en el calendario
  const calendarDaysGrid = useMemo(() => {
    const daysInMonth = new Date(pickerYear, pickerMonth + 1, 0).getDate();
    // 0 = Domingo -> convertir a Lunes = 0 .. Domingo = 6
    const firstDayWeek = (new Date(pickerYear, pickerMonth, 1).getDay() + 6) % 7;
    const cells: (number | null)[] = [];
    for (let i = 0; i < firstDayWeek; i++) {
      cells.push(null);
    }
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push(d);
    }
    return cells;
  }, [pickerYear, pickerMonth]);

  const isFutureDay = (year: number, month: number, day: number): boolean => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const candidate = new Date(year, month, day);
    return candidate >= today;
  };

  const openDatePicker = () => {
    const base = birthDate ?? new Date(2004, 4, 15);
    setPickerYear(base.getFullYear());
    setPickerMonth(base.getMonth());
    setPickerDay(base.getDate());
    setYearSelectorOpen(false);
    setCalendarOpen(true);
  };

  const confirmDateSelection = () => {
    const maxDay = new Date(pickerYear, pickerMonth + 1, 0).getDate();
    const safeDay = Math.min(pickerDay, maxDay);
    if (isFutureDay(pickerYear, pickerMonth, safeDay)) {
      setFieldErrors((prev) => ({
        ...prev,
        fechaNacimiento: "Selecciona una fecha de nacimiento pasada válida.",
      }));
      setCalendarOpen(false);
      return;
    }
    const chosen = new Date(pickerYear, pickerMonth, safeDay);
    setBirthDate(chosen);
    setFieldErrors((prev) => ({ ...prev, fechaNacimiento: null }));
    setCalendarOpen(false);
  };

  const handlePrevMonth = () => {
    if (pickerMonth === 0) {
      if (pickerYear > 1940) {
        setPickerYear((y) => y - 1);
        setPickerMonth(11);
      }
    } else {
      setPickerMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (pickerMonth === 11) {
      if (pickerYear < currentYear) {
        setPickerYear((y) => y + 1);
        setPickerMonth(0);
      }
    } else {
      setPickerMonth((m) => m + 1);
    }
  };

  const validateForm = (): boolean => {
    const nextErrors: typeof fieldErrors = {};

    const nameErr = validateFullName(name);
    if (nameErr) {
      nextErrors.nombreCompleto = nameErr;
    }

    const emailErr = validateStrictEmail(email);
    if (emailErr) {
      nextErrors.correo = emailErr;
    }

    if (!birthDate) {
      nextErrors.fechaNacimiento = "Selecciona tu fecha de nacimiento en el calendario.";
    } else if (isFutureDay(birthDate.getFullYear(), birthDate.getMonth(), birthDate.getDate())) {
      nextErrors.fechaNacimiento = "La fecha de nacimiento debe ser una fecha pasada válida.";
    }

    if (!gender) {
      nextErrors.genero = "Selecciona una opción de género.";
    }

    if (!pwdChecks.allPasswordRulesValid) {
      nextErrors.contrasena = "Cumple todos los requisitos de contraseña.";
    }

    if (!pwdChecks.matchesConfirm) {
      nextErrors.confirmarContrasena = "Las contraseñas no coinciden.";
    }

    if (!consent) {
      nextErrors.aceptoAvisoPrivacidad =
        "Debes aceptar el aviso de privacidad para crear tu cuenta.";
    }

    setPwdTouched(true);
    setPwd2Touched(true);
    setEmailTouched(true);
    setFieldErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async () => {
    setGeneralError(null);
    setDuplicateEmailConflict(false);
    if (!validateForm() || !gender || !birthDate) {
      return;
    }

    setLoading(true);
    try {
      const response = await authApi.registrarUsuario({
        nombreCompleto: name.trim(),
        correo: email.trim().toLowerCase(),
        contrasena: pwd,
        confirmarContrasena: pwd2,
        fechaNacimiento: formatIsoDateYYYYMMDD(birthDate),
        genero: gender,
        aceptoAvisoPrivacidad: consent,
        versionAvisoPrivacidad: PRIVACY_NOTICE_VERSION,
      });

      navigation.navigate("ConfirmEmail", {
        correo: response.correo || email.trim().toLowerCase(),
        correoConfirmacionEnviado: response.correoConfirmacionEnviado,
      });
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 409) {
          setDuplicateEmailConflict(true);
        } else if (err.status === 400) {
          setFieldErrors({
            nombreCompleto: err.getFieldError("nombreCompleto"),
            correo: err.getFieldError("correo"),
            fechaNacimiento: err.getFieldError("fechaNacimiento"),
            genero: err.getFieldError("genero"),
            contrasena: err.getFieldError("contrasena"),
            confirmarContrasena: err.getFieldError("confirmarContrasena"),
            aceptoAvisoPrivacidad:
              err.getFieldError("aceptoAvisoPrivacidad") ??
              err.getFieldError("versionAvisoPrivacidad"),
          });
          setGeneralError(err.detail);
        } else if (err.status === 429) {
          setGeneralError(
            "Realizaste demasiados intentos. Espera unos minutos antes de volver a intentarlo."
          );
        } else {
          setGeneralError(err.detail);
        }
      } else {
        setGeneralError(
          "No pudimos comunicarnos con el servidor. Verifica tu conexión a internet e inténtalo de nuevo."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const showPasswordChecklist =
    pwd.length > 0 ||
    pwd2.length > 0 ||
    pwdTouched ||
    pwd2Touched ||
    !!fieldErrors.contrasena ||
    !!fieldErrors.confirmarContrasena;

  const hasPwdInputError =
    (pwdTouched && !pwdChecks.allPasswordRulesValid) || !!fieldErrors.contrasena;
  const hasPwd2InputError =
    ((pwd2Touched || pwd2.length > 0) && !pwdChecks.matchesConfirm) ||
    !!fieldErrors.confirmarContrasena;

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <PageHeader
          title="Crea tu cuenta"
          subtitle="Un nuevo comienzo, con tus datos protegidos."
          onBack={() => navigation.goBack()}
        />

        <View style={styles.body}>
          {generalError ? (
            <View style={styles.noticeWrap}>
              <Note tone="danger" title="Revisa los datos ingresados">
                {generalError}
              </Note>
            </View>
          ) : null}

          {/* DEC-09 / REG-14: Error 409 Correo existente + botón directo "Iniciar sesión" */}
          {duplicateEmailConflict ? (
            <View style={styles.noticeWrap}>
              <Note tone="gold" title="Este correo ya tiene una cuenta">
                El correo {email.trim().toLowerCase()} ya está registrado en UniHome. Puedes iniciar sesión directamente con tu cuenta.
              </Note>
              <View style={{ marginTop: 10 }}>
                <Button
                  variant="secondary"
                  size="md"
                  onPress={() =>
                    navigation.navigate("Login", {
                      prefillEmail: email.trim().toLowerCase(),
                    })
                  }
                  icon={<Icon name="arrowRight" size={16} color={colors.ink} />}
                >
                  Iniciar sesión
                </Button>
              </View>
            </View>
          ) : null}

          {/* 1. Nombre completo: solo letras, espacios y acentos (máx. 80 caracteres) */}
          <Field
            label="Nombre completo"
            error={
              fieldErrors.nombreCompleto ??
              (nameBlockedHint
                ? "Solo se aceptan letras, espacios y acentos (sin números ni símbolos)."
                : null)
            }
          >
            <TextInput
              style={inputStyle(!!fieldErrors.nombreCompleto || nameBlockedHint)}
              placeholder="Ej. Valeria Sánchez"
              placeholderTextColor="#94a3b8"
              autoCapitalize="words"
              maxLength={MAX_NAME_LENGTH}
              value={name}
              onChangeText={(raw) => {
                const clipped = raw.slice(0, MAX_NAME_LENGTH);
                const sanitized = sanitizeFullName(clipped);
                setNameBlockedHint(clipped !== sanitized);
                setName(sanitized);
                setFieldErrors((prev) => ({ ...prev, nombreCompleto: null }));
              }}
            />
          </Field>

          {/* 2. Correo electrónico: validación estricta (máx. 100 caracteres) */}
          <Field label="Correo electrónico" error={liveEmailError}>
            <TextInput
              style={inputStyle(!!liveEmailError)}
              placeholder="tu.correo@ejemplo.mx"
              placeholderTextColor="#94a3b8"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              maxLength={MAX_EMAIL_LENGTH}
              value={email}
              onBlur={() => setEmailTouched(true)}
              onChangeText={(v) => {
                setEmail(v.slice(0, MAX_EMAIL_LENGTH));
                setDuplicateEmailConflict(false);
                setFieldErrors((prev) => ({ ...prev, correo: null }));
              }}
            />
          </Field>

          {/* 3. Fecha de nacimiento: Date Picker con formato dd/mm/aaaa e ícono de calendario */}
          <Field
            label="Fecha de nacimiento"
            hint="Para publicar un espacio como arrendador necesitas tener 18 años o más."
            error={fieldErrors.fechaNacimiento}
          >
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Seleccionar fecha de nacimiento"
              onPress={openDatePicker}
              style={[
                inputStyle(!!fieldErrors.fechaNacimiento),
                styles.datePickerTrigger,
              ]}
            >
              <Text
                style={[
                  styles.datePickerText,
                  !birthDate ? styles.datePickerPlaceholder : null,
                ]}
              >
                {birthDate ? formatDisplayDateDDMMYYYY(birthDate) : "dd/mm/aaaa"}
              </Text>
              <Icon name="calendar" size={18} color={colors.ink} />
            </Pressable>
          </Field>

          {/* 4. Género */}
          <Field label="Género" error={fieldErrors.genero}>
            <View style={styles.genderGrid}>
              {GENDER_OPTIONS.map((g) => {
                const selected = gender === g;
                return (
                  <TouchableOpacity
                    key={g}
                    activeOpacity={0.8}
                    onPress={() => {
                      setGender(g);
                      setFieldErrors((prev) => ({ ...prev, genero: null }));
                    }}
                    style={[
                      styles.genderButton,
                      selected ? styles.genderButtonSelected : null,
                    ]}
                  >
                    <Text
                      style={[
                        styles.genderButtonText,
                        selected ? styles.genderButtonTextSelected : null,
                      ]}
                    >
                      {g}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </Field>

          {/* 5. Contraseña y Confirmar contraseña en la misma fila con ícono de ojo interactivo */}
          <View style={styles.passwordRow}>
            <View style={styles.passwordCol}>
              <Text style={styles.passwordLabel}>Contraseña</Text>
              <View style={styles.passwordInputWrap}>
                <TextInput
                  style={[
                    inputStyle(hasPwdInputError),
                    styles.passwordInputCompact,
                  ]}
                  placeholder="Mínimo 8 caracteres"
                  placeholderTextColor="#94a3b8"
                  secureTextEntry={!showPwd}
                  autoCapitalize="none"
                  autoCorrect={false}
                  maxLength={MAX_PASSWORD_LENGTH}
                  value={pwd}
                  onBlur={() => setPwdTouched(true)}
                  onChangeText={(v) => {
                    setPwd(v.slice(0, MAX_PASSWORD_LENGTH));
                    setFieldErrors((prev) => ({ ...prev, contrasena: null }));
                  }}
                />
                <TouchableOpacity
                  onPress={() => setShowPwd((prev) => !prev)}
                  style={styles.eyeBtnCompact}
                  accessibilityLabel={
                    showPwd ? "Ocultar contraseña" : "Mostrar contraseña"
                  }
                >
                  <Icon
                    name={showPwd ? "eyeOff" : "eye"}
                    size={16}
                    color={colors.slate500}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.passwordCol}>
              <Text style={styles.passwordLabel}>Confirmar contraseña</Text>
              <View style={styles.passwordInputWrap}>
                <TextInput
                  style={[
                    inputStyle(hasPwd2InputError),
                    styles.passwordInputCompact,
                  ]}
                  placeholder="Repite tu contraseña"
                  placeholderTextColor="#94a3b8"
                  secureTextEntry={!showPwd2}
                  autoCapitalize="none"
                  autoCorrect={false}
                  maxLength={MAX_PASSWORD_LENGTH}
                  value={pwd2}
                  onBlur={() => setPwd2Touched(true)}
                  onChangeText={(v) => {
                    setPwd2(v.slice(0, MAX_PASSWORD_LENGTH));
                    setFieldErrors((prev) => ({
                      ...prev,
                      confirmarContrasena: null,
                    }));
                  }}
                />
                <TouchableOpacity
                  onPress={() => setShowPwd2((prev) => !prev)}
                  style={styles.eyeBtnCompact}
                  accessibilityLabel={
                    showPwd2
                      ? "Ocultar confirmación de contraseña"
                      : "Mostrar confirmación de contraseña"
                  }
                >
                  <Icon
                    name={showPwd2 ? "eyeOff" : "eye"}
                    size={16}
                    color={colors.slate500}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* 6. Panel compacto de requisitos y coincidencia de contraseña en tiempo real */}
          {showPasswordChecklist ? (
            <View style={styles.pwdChecklistCard}>
              <View style={styles.pwdChecklistGrid}>
                <PasswordRuleItem
                  ok={pwdChecks.minLength}
                  active={pwd.length > 0 || pwdTouched}
                  label="Mínimo 8 caracteres"
                />
                <PasswordRuleItem
                  ok={pwdChecks.upperAndLower}
                  active={pwd.length > 0 || pwdTouched}
                  label="Mayúscula y minúscula"
                />
                <PasswordRuleItem
                  ok={pwdChecks.hasNumber}
                  active={pwd.length > 0 || pwdTouched}
                  label="Al menos un número"
                />
                <PasswordRuleItem
                  ok={pwdChecks.hasSpecial}
                  active={pwd.length > 0 || pwdTouched}
                  label="Al menos 1 carácter especial"
                />
                <PasswordRuleItem
                  ok={pwdChecks.noConsecutiveNumbers}
                  active={pwd.length > 0 || pwdTouched}
                  label="Sin números consecutivos (ej. 123)"
                />
                <PasswordRuleItem
                  ok={pwdChecks.matchesConfirm}
                  active={pwd2.length > 0 || pwd2Touched}
                  label={
                    pwd2.length > 0 && !pwdChecks.matchesConfirm
                      ? "Las contraseñas no coinciden"
                      : "Las contraseñas coinciden"
                  }
                />
              </View>
            </View>
          ) : null}

          {/* Aviso de privacidad desplegable fiel a la imagen */}
          <View style={styles.privacyCard}>
            <TouchableOpacity
              onPress={() => setShowPrivacy((prev) => !prev)}
              activeOpacity={0.8}
              style={styles.privacyHeader}
            >
              <Text style={styles.privacyCaret}>
                {showPrivacy ? "▾" : "▸"}
              </Text>
              <Text style={styles.privacyHeaderTitle}>Aviso de privacidad</Text>
            </TouchableOpacity>

            {showPrivacy ? (
              <View style={styles.privacyBody}>
                <Text style={styles.privacyParagraph}>
                  Tus datos se usan para gestionar tu cuenta y la conexión con
                  alojamientos. Solo tú puedes consultar tus datos personales y
                  ejercer tus derechos ARCO desde tu perfil. Versión vigente:{" "}
                  v{PRIVACY_NOTICE_VERSION}.
                </Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate("Legal")}
                  style={styles.fullLegalLinkWrap}
                >
                  <Text style={styles.fullLegalLink}>
                    Ver aviso de privacidad completo →
                  </Text>
                </TouchableOpacity>
              </View>
            ) : null}
          </View>

          {/* Casilla de consentimiento obligatorio */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              setConsent((prev) => !prev);
              setFieldErrors((prev) => ({
                ...prev,
                aceptoAvisoPrivacidad: null,
              }));
            }}
            style={styles.consentRow}
          >
            <View
              style={[styles.checkbox, consent ? styles.checkboxChecked : null]}
            >
              {consent ? <Icon name="check" size={13} color="#ffffff" /> : null}
            </View>
            <Text style={styles.consentText}>
              He leído el aviso de privacidad y consiento el tratamiento de mis
              datos.
            </Text>
          </TouchableOpacity>

          {fieldErrors.aceptoAvisoPrivacidad ? (
            <Text style={styles.consentError}>
              {fieldErrors.aceptoAvisoPrivacidad}
            </Text>
          ) : null}

          <Button
            disabled={!consent}
            loading={loading}
            onPress={handleSubmit}
          >
            Crear mi cuenta
          </Button>
        </View>
      </ScrollView>

      {/* Modal de Calendario (Date Picker) */}
      <Modal
        visible={calendarOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setCalendarOpen(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.calendarDialog}>
            {/* Encabezado del calendario */}
            <View style={styles.calendarTopBanner}>
              <Text style={styles.calendarBannerEyebrow}>
                SELECCIONA TU FECHA DE NACIMIENTO
              </Text>
              <TouchableOpacity
                onPress={() => setYearSelectorOpen((prev) => !prev)}
                style={styles.calendarYearToggle}
                activeOpacity={0.8}
              >
                <Text style={styles.calendarBannerDate}>
                  {String(pickerDay).padStart(2, "0")}/
                  {String(pickerMonth + 1).padStart(2, "0")}/{pickerYear}
                </Text>
                <Text style={styles.calendarYearBadge}>
                  {yearSelectorOpen ? "Ver mes ▲" : "Cambiar año ▼"}
                </Text>
              </TouchableOpacity>
            </View>

            {yearSelectorOpen ? (
              <ScrollView
                style={styles.yearListScroll}
                contentContainerStyle={styles.yearListContent}
              >
                {yearsList.map((yr) => {
                  const selected = yr === pickerYear;
                  return (
                    <TouchableOpacity
                      key={yr}
                      onPress={() => {
                        setPickerYear(yr);
                        setYearSelectorOpen(false);
                      }}
                      style={[
                        styles.yearOption,
                        selected ? styles.yearOptionSelected : null,
                      ]}
                    >
                      <Text
                        style={[
                          styles.yearOptionText,
                          selected ? styles.yearOptionTextSelected : null,
                        ]}
                      >
                        {yr}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            ) : (
              <View style={styles.calendarBody}>
                <View style={styles.monthNavRow}>
                  <TouchableOpacity
                    onPress={handlePrevMonth}
                    style={styles.monthNavBtn}
                  >
                    <Text style={styles.monthNavArrow}>‹</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setYearSelectorOpen(true)}
                  >
                    <Text style={styles.monthTitleText}>
                      {MONTHS_ES[pickerMonth]} {pickerYear}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleNextMonth}
                    style={styles.monthNavBtn}
                  >
                    <Text style={styles.monthNavArrow}>›</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.weekdaysRow}>
                  {WEEKDAYS_SHORT.map((w, idx) => (
                    <Text key={idx} style={styles.weekdayLabel}>
                      {w}
                    </Text>
                  ))}
                </View>

                <View style={styles.daysGrid}>
                  {calendarDaysGrid.map((day, idx) => {
                    if (day === null) {
                      return <View key={`empty-${idx}`} style={styles.dayCell} />;
                    }
                    const disabled = isFutureDay(pickerYear, pickerMonth, day);
                    const isSelected = day === pickerDay;
                    return (
                      <TouchableOpacity
                        key={`day-${day}`}
                        disabled={disabled}
                        onPress={() => setPickerDay(day)}
                        style={[
                          styles.dayCell,
                          isSelected ? styles.dayCellSelected : null,
                          disabled ? styles.dayCellDisabled : null,
                        ]}
                      >
                        <Text
                          style={[
                            styles.dayCellText,
                            isSelected ? styles.dayCellTextSelected : null,
                            disabled ? styles.dayCellTextDisabled : null,
                          ]}
                        >
                          {day}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            )}

            <View style={styles.calendarFooter}>
              <TouchableOpacity
                onPress={() => setCalendarOpen(false)}
                style={styles.calendarActionBtn}
              >
                <Text style={styles.calendarCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={confirmDateSelection}
                style={[styles.calendarActionBtn, styles.calendarConfirmBtn]}
              >
                <Text style={styles.calendarConfirmText}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const PasswordRuleItem: React.FC<{
  ok: boolean;
  active: boolean;
  label: string;
}> = ({ ok, active, label }) => {
  const color = ok
    ? colors.mintDark
    : active
      ? colors.coralDeep
      : colors.slate500;
  const symbol = ok ? "✓" : active ? "✕" : "•";

  return (
    <View style={styles.pwdRuleItem}>
      <Text style={[styles.pwdRuleSymbol, { color }]}>{symbol}</Text>
      <Text style={[styles.pwdRuleText, { color }]} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: colors.white,
  },
  screen: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollContent: {
    paddingBottom: 34,
  },
  body: {
    paddingHorizontal: 22,
    paddingTop: 10,
  },
  noticeWrap: {
    marginBottom: 12,
  },
  datePickerTrigger: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  datePickerText: {
    fontSize: 13.5,
    fontWeight: "700",
    color: colors.ink,
  },
  datePickerPlaceholder: {
    color: colors.ink,
    fontWeight: "700",
  },
  genderGrid: {
    flexDirection: "row",
    gap: 8,
  },
  genderButton: {
    flex: 1,
    minHeight: 44,
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.slate200,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
  },
  genderButtonSelected: {
    borderColor: colors.coralDark,
    backgroundColor: colors.coralBadgeBg,
  },
  genderButtonText: {
    fontWeight: "600",
    fontSize: 12,
    color: colors.slate600,
    textAlign: "center",
  },
  genderButtonTextSelected: {
    color: colors.coralDark,
    fontWeight: "700",
  },
  passwordRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 8,
  },
  passwordCol: {
    flex: 1,
  },
  passwordLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.slate700,
    marginBottom: 6,
  },
  passwordInputWrap: {
    position: "relative",
    justifyContent: "center",
  },
  passwordInputCompact: {
    paddingRight: 34,
    paddingHorizontal: 11,
    fontSize: 12.5,
  },
  eyeBtnCompact: {
    position: "absolute",
    right: 4,
    width: 30,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
  },
  pwdChecklistCard: {
    marginBottom: 12,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: colors.slate50,
    borderWidth: 1,
    borderColor: colors.slate200,
  },
  pwdChecklistGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    rowGap: 4,
  },
  pwdRuleItem: {
    width: "50%",
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingRight: 4,
  },
  pwdRuleSymbol: {
    fontSize: 11.5,
    fontWeight: "800",
  },
  pwdRuleText: {
    fontSize: 11,
    fontWeight: "600",
    flexShrink: 1,
  },
  privacyCard: {
    borderRadius: 12,
    backgroundColor: colors.slate50,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 12,
  },
  privacyHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  privacyCaret: {
    fontSize: 12,
    color: colors.slate600,
    fontWeight: "700",
  },
  privacyHeaderTitle: {
    fontWeight: "700",
    fontSize: 12.5,
    color: colors.slate600,
  },
  privacyBody: {
    marginTop: 8,
  },
  privacyParagraph: {
    fontSize: 12,
    color: colors.slate600,
    lineHeight: 18,
  },
  fullLegalLinkWrap: {
    marginTop: 6,
  },
  fullLegalLink: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.coralDark,
    fontFamily: fonts.sans,
  },
  consentRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    marginBottom: 16,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: colors.slate400,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: colors.coralDark,
    borderColor: colors.coralDark,
  },
  consentText: {
    flex: 1,
    fontSize: 12,
    color: colors.slate600,
    lineHeight: 18,
  },
  consentError: {
    fontSize: 12,
    color: colors.danger,
    fontWeight: "600",
    marginTop: -10,
    marginBottom: 12,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.48)",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  calendarDialog: {
    width: "100%",
    maxWidth: 350,
    borderRadius: 20,
    backgroundColor: "#ffffff",
    overflow: "hidden",
    elevation: 8,
  },
  calendarTopBanner: {
    backgroundColor: colors.coralDark,
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  calendarBannerEyebrow: {
    fontSize: 10.5,
    fontWeight: "700",
    color: "rgba(255,255,255,0.85)",
    letterSpacing: 1,
  },
  calendarYearToggle: {
    marginTop: 4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  calendarBannerDate: {
    fontSize: 22,
    fontWeight: "800",
    color: "#ffffff",
  },
  calendarYearBadge: {
    fontSize: 11.5,
    fontWeight: "700",
    color: "#ffffff",
    backgroundColor: "rgba(0,0,0,0.18)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  yearListScroll: {
    maxHeight: 250,
  },
  yearListContent: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 12,
  },
  yearOption: {
    width: "25%",
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 10,
  },
  yearOptionSelected: {
    backgroundColor: colors.coralSoft,
  },
  yearOptionText: {
    fontSize: 14,
    color: colors.ink,
    fontWeight: "600",
  },
  yearOptionTextSelected: {
    color: colors.coralDark,
    fontWeight: "800",
  },
  calendarBody: {
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 8,
  },
  monthNavRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  monthNavBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.slate100,
    alignItems: "center",
    justifyContent: "center",
  },
  monthNavArrow: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.ink,
    lineHeight: 22,
  },
  monthTitleText: {
    fontSize: 14.5,
    fontWeight: "800",
    color: colors.ink,
  },
  weekdaysRow: {
    flexDirection: "row",
    marginBottom: 4,
  },
  weekdayLabel: {
    width: "14.285%",
    textAlign: "center",
    fontSize: 11.5,
    fontWeight: "700",
    color: colors.slate500,
  },
  daysGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  dayCell: {
    width: "14.285%",
    height: 38,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 19,
  },
  dayCellSelected: {
    backgroundColor: colors.coralDark,
  },
  dayCellDisabled: {
    opacity: 0.3,
  },
  dayCellText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.ink,
  },
  dayCellTextSelected: {
    color: "#ffffff",
    fontWeight: "800",
  },
  dayCellTextDisabled: {
    color: colors.slate400,
  },
  calendarFooter: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: colors.slate100,
  },
  calendarActionBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  calendarConfirmBtn: {
    backgroundColor: colors.coralDark,
  },
  calendarCancelText: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.slate600,
  },
  calendarConfirmText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#ffffff",
  },
});
