import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Button, Field, Icon, inputStyle, Note, PageHeader } from "../components/ui";
import { ApiError, authApi } from "../services/authApi";
import { colors, fonts } from "../theme/tokens";
import { RootStackParamList } from "../../App";

type Props = NativeStackScreenProps<RootStackParamList, "ConfirmEmail">;

/**
 * Pantalla de Confirmación de Correo (ruta "/codigo" en Figma/src/App.tsx líneas 1564-1624).
 * Implementa F01 / FT-01 (REG-07 a REG-13):
 * - Conectada a POST /api/v1/auth/confirmacion-correo y POST /api/v1/auth/confirmacion-correo/reenvio.
 * - Muestra vigencia de 10 minutos y que solo sirve el código más reciente (REG-07).
 * - Si correoConfirmacionEnviado === false (REG-08), advierte y ofrece reenviar inmediatamente.
 * - Al reenviar (202 Accepted), limpia el campo de código e informa con honestidad que la
 *   solicitud fue aceptada sin asegurar entrega en bandeja (REG-11, REG-12).
 * - Al confirmar (200 OK), redirige a Iniciar sesión con el correo precargado (REG-13).
 */
export const ConfirmEmailScreen: React.FC<Props> = ({ navigation, route }) => {
  const correo = route.params.correo;
  const initialSent = route.params.correoConfirmacionEnviado ?? true;

  const [code, setCode] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);

  const [codeError, setCodeError] = useState<string | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [resendMessage, setResendMessage] = useState<string | null>(null);

  const handleVerify = async () => {
    setCodeError(null);
    setGeneralError(null);
    setResendMessage(null);

    const digits = code.replace(/\D/g, "");
    if (digits.length !== 6) {
      setCodeError("Ingresa el código numérico de 6 dígitos.");
      return;
    }

    setVerifying(true);
    try {
      const result = await authApi.confirmarCorreo({
        correo,
        codigo: digits,
      });

      // REG-13: POST /confirmacion-correo no emite tokens; redirigir a Login con el correo precargado
      navigation.navigate("Login", {
        prefillEmail: result.correo || correo,
        confirmedMessage:
          "¡Correo confirmado con éxito! Ahora inicia sesión con tu contraseña para continuar.",
      });
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 400) {
          setCodeError(
            err.getFieldError("codigo") ||
              err.detail ||
              "El código ingresado es incorrecto. Verifica los 6 dígitos."
          );
        } else if (err.status === 410) {
          setGeneralError(
            err.detail ||
              "El código ha expirado o fue reemplazado por uno más reciente. Solicita un código nuevo."
          );
        } else if (err.status === 409) {
          // Si ya estaba confirmado, llevar directo a Login
          navigation.navigate("Login", {
            prefillEmail: correo,
            confirmedMessage: "Tu correo ya se encontraba confirmado. Inicia sesión para continuar.",
          });
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
      setVerifying(false);
    }
  };

  const handleResend = async () => {
    setCodeError(null);
    setGeneralError(null);
    setResendMessage(null);
    setResending(true);

    try {
      const res = await authApi.reenviarCodigoConfirmacion(correo);
      // REG-11 y REG-12: Limpiar el código previo e informar que la solicitud fue aceptada (202)
      setCode("");
      setResendMessage(
        res.mensaje ||
          "Solicitud aceptada. Si el correo corresponde a una cuenta pendiente de confirmar, recibirás un nuevo código de 6 dígitos. Recuerda que los códigos anteriores quedan invalidados."
      );
    } catch (err) {
      if (err instanceof ApiError) {
        setGeneralError(err.detail);
      } else {
        setGeneralError("No pudimos solicitar un nuevo código. Revisa tu conexión.");
      }
    } finally {
      setResending(false);
    }
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
          title="Confirma tu correo"
          subtitle="Último paso para crear tu cuenta"
          onBack={() => navigation.goBack()}
        />

        <View style={styles.body}>
          {initialSent ? (
            <Note tone="mint" title="Revisa tu bandeja">
              Te enviamos un código de 6 dígitos a{" "}
              <Text style={styles.bold}>{correo}</Text>. Vence en 10 minutos. Solo sirve el código más reciente.
            </Note>
          ) : (
            <Note tone="gold" title="Tu cuenta fue creada, pero el correo no pudo enviarse">
              Registramos tu cuenta para <Text style={styles.bold}>{correo}</Text>, pero ocurrió un inconveniente al enviar el código inicial. Pulsa "Reenviar código" para solicitar uno nuevo.
            </Note>
          )}

          {resendMessage ? (
            <View style={styles.topSpacing}>
              <Note tone="mint" title="Solicitud de reenvío procesada">
                {resendMessage}
              </Note>
            </View>
          ) : null}

          {generalError ? (
            <View style={styles.topSpacing}>
              <Note tone="danger" title="No se pudo verificar el código">
                {generalError}
              </Note>
            </View>
          ) : null}

          <View style={styles.codeSection}>
            <Field label="Código de verificación" error={codeError}>
              <TextInput
                style={[inputStyle(!!codeError), styles.codeInput]}
                placeholder="123456"
                placeholderTextColor="#cbd5e1"
                keyboardType="number-pad"
                maxLength={6}
                value={code}
                onChangeText={(v) => {
                  setCode(v.replace(/\D/g, "").slice(0, 6));
                  setCodeError(null);
                  setGeneralError(null);
                }}
              />
            </Field>
          </View>

          <Button
            onPress={handleVerify}
            loading={verifying}
            disabled={code.replace(/\D/g, "").length !== 6}
          >
            Verificar y continuar
          </Button>

          <View style={{ marginTop: 10 }}>
            <Button
              variant="ghost"
              onPress={handleResend}
              loading={resending}
              icon={<Icon name="mail" size={16} color={colors.ink} />}
            >
              Reenviar código
            </Button>
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
    paddingTop: 16,
  },
  topSpacing: {
    marginTop: 12,
  },
  bold: {
    fontWeight: "700",
    color: colors.ink,
  },
  codeSection: {
    marginTop: 16,
  },
  codeInput: {
    fontSize: 22,
    letterSpacing: 8,
    textAlign: "center",
    fontWeight: "800",
    fontFamily: fonts.display,
  },
});
