import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Button, Field, Icon, inputStyle, Note, PageHeader } from "../components/ui";
import { useAuth } from "../context/AuthContext";
import { ApiError } from "../services/authApi";
import { colors, fonts } from "../theme/tokens";
import { RootStackParamList } from "../../App";

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

/**
 * Pantalla de Inicio de Sesión (ruta "/acceso" en Figma/src/App.tsx líneas 1420-1563).
 * Implementa F02 / FT-02:
 * - Conectada a POST /api/v1/auth/login.
 * - Sin accesos rápidos de demostración (SES-02).
 * - Botón para mostrar/ocultar contraseña (SES-03).
 * - Si devuelve 403 por correo no confirmado (DEC-M09 / SES-05), muestra el detalle del backend
 *   y ofrece el botón directo "Ingresar código de confirmación" hacia /codigo.
 * - Si el usuario pulsa "¿Olvidaste tu contraseña?" (SES-15), informa con honestidad que
 *   la recuperación en servidor aún no está disponible sin simular envío de correo.
 */
export const LoginScreen: React.FC<Props> = ({ navigation, route }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState(route.params?.prefillEmail ?? "");
  const [pwd, setPwd] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  const [emailError, setEmailError] = useState<string | null>(null);
  const [pwdError, setPwdError] = useState<string | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [unconfirmedDetail, setUnconfirmedDetail] = useState<string | null>(null);
  const [infoNotice, setInfoNotice] = useState<string | null>(route.params?.confirmedMessage ?? null);

  useEffect(() => {
    if (route.params?.prefillEmail) {
      setEmail(route.params.prefillEmail);
    }
    if (route.params?.confirmedMessage) {
      setInfoNotice(route.params.confirmedMessage);
    }
  }, [route.params?.prefillEmail, route.params?.confirmedMessage]);

  const handleSubmit = async () => {
    setEmailError(null);
    setPwdError(null);
    setGeneralError(null);
    setUnconfirmedDetail(null);

    const cleanEmail = email.trim();
    if (!cleanEmail || !cleanEmail.includes("@")) {
      setEmailError("Ingresa un correo electrónico válido.");
      return;
    }
    if (!pwd) {
      setPwdError("Ingresa tu contraseña.");
      return;
    }

    setLoading(true);
    try {
      await login({
        correo: cleanEmail,
        contrasena: pwd,
      });
      // Al autenticarse, AuthContext cambia a "ConSesion" y App.tsx dirige a FT-06 (DEC-M06).
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 400) {
          setEmailError(err.getFieldError("correo"));
          setPwdError(err.getFieldError("contrasena"));
          if (!err.getFieldError("correo") && !err.getFieldError("contrasena")) {
            setGeneralError(err.detail);
          }
        } else if (err.status === 401) {
          setGeneralError("Revisa tu correo y contraseña.");
        } else if (err.status === 403) {
          // DEC-M09 / SES-05: Cuenta pendiente de confirmar correo
          setUnconfirmedDetail(
            err.detail || "Debes confirmar tu correo electrónico antes de iniciar sesión."
          );
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

  const handleForgotPassword = () => {
    // SES-15: Mientras los endpoints EP-M01-06/07 no existan en el backend, informar sin simular envío.
    setInfoNotice(
      "La recuperación de contraseña por correo aún no está habilitada en el servidor en esta entrega."
    );
  };

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
          title="Qué bueno verte"
          subtitle="Inicia sesión y continúa tu nueva etapa."
          onBack={() => navigation.navigate("Welcome")}
        />

        <View style={styles.body}>
          {infoNotice ? (
            <View style={styles.noticeWrap}>
              <Note tone="mint" title="Aviso">
                {infoNotice}
              </Note>
            </View>
          ) : null}

          {generalError ? (
            <View style={styles.noticeWrap}>
              <Note tone="danger" title="No pudimos iniciar sesión">
                {generalError}
              </Note>
            </View>
          ) : null}

          {/* DEC-M09: Error 403 por correo aún no confirmado + botón a /codigo */}
          {unconfirmedDetail ? (
            <View style={styles.noticeWrap}>
              <Note tone="gold" title="Confirma tu correo para continuar">
                {unconfirmedDetail}
              </Note>
              <View style={{ marginTop: 10 }}>
                <Button
                  variant="secondary"
                  size="md"
                  onPress={() =>
                    navigation.navigate("ConfirmEmail", {
                      correo: email.trim().toLowerCase(),
                      correoConfirmacionEnviado: true,
                    })
                  }
                  icon={<Icon name="mail" size={16} color={colors.ink} />}
                >
                  Ingresar código de confirmación
                </Button>
              </View>
            </View>
          ) : null}

          <Field label="Correo electrónico" error={emailError}>
            <TextInput
              style={inputStyle(!!emailError)}
              placeholder="tu.correo@ejemplo.mx"
              placeholderTextColor="#94a3b8"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              maxLength={100}
              value={email}
              onChangeText={(v) => {
                setEmail(v.slice(0, 100));
                setEmailError(null);
                setGeneralError(null);
              }}
            />
          </Field>

          <Field label="Contraseña" error={pwdError}>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[inputStyle(!!pwdError), styles.passwordInput]}
                placeholder="••••••••"
                placeholderTextColor="#94a3b8"
                secureTextEntry={!showPwd}
                autoCapitalize="none"
                maxLength={30}
                value={pwd}
                onChangeText={(v) => {
                  setPwd(v.slice(0, 30));
                  setPwdError(null);
                  setGeneralError(null);
                }}
              />
              <TouchableOpacity
                onPress={() => setShowPwd((prev) => !prev)}
                style={styles.eyeButton}
                accessibilityLabel={showPwd ? "Ocultar contraseña" : "Ver contraseña"}
              >
                <Icon name={showPwd ? "eyeOff" : "eye"} size={18} color={colors.slate} />
              </TouchableOpacity>
            </View>
          </Field>

          <View style={styles.forgotRow}>
            <TouchableOpacity onPress={handleForgotPassword} activeOpacity={0.75}>
              <Text style={styles.forgotLink}>¿Olvidaste tu contraseña?</Text>
            </TouchableOpacity>
          </View>

          <Button
            onPress={handleSubmit}
            loading={loading}
            icon={<Icon name="arrowRight" size={18} color="#ffffff" />}
          >
            Iniciar sesión
          </Button>

          <View style={styles.registerPromptCard}>
            <Text style={styles.registerPromptLabel}>¿Aún no tienes cuenta?</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("Register")}
              activeOpacity={0.75}
              style={styles.registerPromptLinkWrap}
            >
              <Text style={styles.registerPromptLink}>Crear cuenta</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: colors.paper,
  },
  screen: {
    flex: 1,
    backgroundColor: colors.paper,
  },
  scrollContent: {
    paddingBottom: 36,
  },
  body: {
    paddingHorizontal: 22,
    paddingTop: 14,
  },
  noticeWrap: {
    marginBottom: 14,
  },
  passwordContainer: {
    position: "relative",
    justifyContent: "center",
  },
  passwordInput: {
    paddingRight: 44,
  },
  eyeButton: {
    position: "absolute",
    right: 10,
    width: 34,
    height: 34,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  forgotRow: {
    alignItems: "flex-end",
    marginTop: -4,
    marginBottom: 16,
  },
  forgotLink: {
    color: colors.coralDark,
    fontWeight: "700",
    fontSize: 12.5,
  },
  registerPromptCard: {
    marginTop: 22,
    padding: 16,
    borderRadius: 16,
    backgroundColor: colors.soft,
    alignItems: "center",
  },
  registerPromptLabel: {
    fontSize: 13,
    color: colors.slate,
  },
  registerPromptLinkWrap: {
    marginTop: 6,
  },
  registerPromptLink: {
    color: colors.coralDark,
    fontWeight: "800",
    fontSize: 14,
    fontFamily: fonts.sans,
  },
});
