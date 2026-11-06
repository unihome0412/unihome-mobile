import React, { useState } from "react";
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
import {
  Button,
  Field,
  Icon,
  inputStyle,
  Note,
  PageHeader,
  Row,
  Tag,
} from "../components/ui";
import { SelectedUniversity, useAuth } from "../context/AuthContext";
import { ApiError, PRIVACY_NOTICE_VERSION } from "../services/authApi";
import { colors, fonts } from "../theme/tokens";
import { RootStackParamList } from "../../App";

/**
 * Catálogo inicial de universidades (de Figma/src/App.tsx líneas 244-322).
 * Etiquetado honestamente como referencia local mientras se habilita EP-M04 en el servidor (FT-06).
 */
const UNIVERSITIES: SelectedUniversity[] = [
  {
    id: "buap",
    siglas: "BUAP",
    nombre: "Benemérita Universidad Autónoma de Puebla",
    ciudad: "Puebla, Pue.",
  },
  {
    id: "udlap",
    siglas: "UDLAP",
    nombre: "Universidad de las Américas Puebla",
    ciudad: "San Andrés Cholula, Pue.",
  },
  {
    id: "itesm-pue",
    siglas: "Tec de Monterrey",
    nombre: "Tecnológico de Monterrey · Campus Puebla",
    ciudad: "Puebla, Pue.",
  },
  {
    id: "upaep",
    siglas: "UPAEP",
    nombre: "Universidad Popular Autónoma del Estado de Puebla",
    ciudad: "Puebla, Pue.",
  },
  {
    id: "ibero-pue",
    siglas: "IBERO Puebla",
    nombre: "Universidad Iberoamericana Puebla",
    ciudad: "San Andrés Cholula, Pue.",
  },
  {
    id: "unam",
    siglas: "UNAM",
    nombre: "Universidad Nacional Autónoma de México · CU",
    ciudad: "Ciudad de México",
  },
];

const SAMPLE_LISTINGS = [
  {
    id: "dep-1",
    titulo: "Estudio luminoso a 2 cuadras de CU BUAP",
    colonia: "Col. San Manuel, Puebla",
    renta: "$4,200 / mes",
    distancia: "6 min a pie del campus",
    verificado: true,
  },
  {
    id: "dep-2",
    titulo: "Habitación amueblada con servicios incluidos",
    colonia: "Col. Universidades, Puebla",
    renta: "$3,500 / mes",
    distancia: "8 min a pie del campus",
    verificado: true,
  },
];

type FirstEntryProps = NativeStackScreenProps<RootStackParamList, "FirstEntry">;

/**
 * Recorrido inicial posterior al inicio de sesión (FT-06 + DEC-M06):
 * - Si aún no eligió universidad, muestra "/universidad" ("¿Dónde vas a estudiar?").
 * - Al elegir universidad, muestra la barra inferior con Explorar ("/explorar"),
 *   Mensajes ("/mensajes") y Mi Perfil ("/perfil").
 * - En Mi Perfil muestra temporalmente el correo de la sesión autenticada (DEC-M06)
 *   y permite Cerrar sesión (POST /api/v1/auth/logout) o Eliminar cuenta (DELETE /api/v1/cuentas/mi-cuenta).
 */
export const FirstEntryScreen: React.FC<FirstEntryProps> = ({ navigation }) => {
  const {
    userEmail,
    selectedUniversity,
    setSelectedUniversity,
    logout,
  } = useAuth();
  const [activeTab, setActiveTab] = useState<"explorar" | "mensajes" | "perfil">(
    "explorar"
  );
  const [searchUni, setSearchUni] = useState("");
  const [loggingOut, setLoggingOut] = useState(false);

  // Paso 1 de FT-06: Selección de universidad ("/universidad" en Figma/src/App.tsx líneas 1848-1934)
  if (!selectedUniversity) {
    const filtered = UNIVERSITIES.filter(
      (u) =>
        u.siglas.toLowerCase().includes(searchUni.trim().toLowerCase()) ||
        u.nombre.toLowerCase().includes(searchUni.trim().toLowerCase()) ||
        u.ciudad.toLowerCase().includes(searchUni.trim().toLowerCase())
    );

    return (
      <View style={styles.screen}>
        <PageHeader
          title="¿Dónde vas a estudiar?"
          subtitle="Te mostraremos hogares cercanos a tu campus."
        />
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.body}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.searchWrap}>
            <Icon name="search" size={18} color={colors.slate} />
            <TextInput
              style={styles.searchInput}
              placeholder="Busca por siglas, nombre o ciudad..."
              placeholderTextColor="#94a3b8"
              value={searchUni}
              onChangeText={setSearchUni}
            />
          </View>

          <View style={styles.uniList}>
            {filtered.map((uni) => (
              <TouchableOpacity
                key={uni.id}
                activeOpacity={0.8}
                onPress={() => setSelectedUniversity(uni)}
                style={styles.uniCard}
              >
                <View style={styles.uniBadge}>
                  <Icon name="school" size={18} color={colors.coralDark} />
                </View>
                <View style={{ flex: 1 }}>
                  <View style={styles.uniRowTop}>
                    <Text style={styles.uniSiglas}>{uni.siglas}</Text>
                    <Tag tone="slate">{uni.ciudad}</Tag>
                  </View>
                  <Text style={styles.uniName}>{uni.nombre}</Text>
                </View>
                <Icon name="chevRight" size={18} color={colors.muted} />
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
    );
  }

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <View style={styles.screen}>
      {/* Contenido de la pestaña activa */}
      {activeTab === "explorar" ? (
        <ScrollView style={styles.flex} contentContainerStyle={styles.body}>
          <View style={styles.exploreHeader}>
            <View style={{ flex: 1 }}>
              <Text style={styles.eyebrow}>CERCA DE TU CAMPUS</Text>
              <Text style={styles.campusTitle}>{selectedUniversity.siglas}</Text>
              <Text style={styles.campusSub}>{selectedUniversity.nombre}</Text>
            </View>
            <Button
              variant="secondary"
              size="sm"
              full={false}
              onPress={() => setSelectedUniversity(null)}
            >
              Cambiar
            </Button>
          </View>

          <View style={{ marginVertical: 12 }}>
            <Note tone="gold" title="Vista previa del recorrido inicial (FT-06)">
              Has iniciado sesión como <Text style={styles.bold}>{userEmail}</Text>. Los alojamientos mostrados abajo son ejemplos de referencia de la maqueta mientras se conectan los módulos de catálogo (F04).
            </Note>
          </View>

          {SAMPLE_LISTINGS.map((item) => (
            <View key={item.id} style={styles.listingCard}>
              <View style={styles.listingBadges}>
                <Tag tone="coral">Ejemplo de maqueta</Tag>
                {item.verificado ? (
                  <Tag tone="mint" icon={<Icon name="verified" size={12} color={colors.mintDark} />}>
                    Arrendador verificado
                  </Tag>
                ) : null}
              </View>
              <Text style={styles.listingTitle}>{item.titulo}</Text>
              <Text style={styles.listingMeta}>
                {item.colonia} · {item.distancia}
              </Text>
              <View style={styles.listingFooter}>
                <Text style={styles.listingPrice}>{item.renta}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      ) : null}

      {activeTab === "mensajes" ? (
        <ScrollView style={styles.flex} contentContainerStyle={styles.body}>
          <Text style={styles.sectionTitle}>Mensajes</Text>
          <Text style={styles.sectionSub}>
            Conversa directamente con arrendadores verificados.
          </Text>
          <View style={styles.emptyCard}>
            <Icon name="chat" size={28} color={colors.coralDark} />
            <Text style={styles.emptyTitle}>Aún no tienes conversaciones</Text>
            <Text style={styles.emptySub}>
              Cuando el módulo de mensajería en tiempo real (F09) esté activo, tus chats aparecerán aquí.
            </Text>
          </View>
        </ScrollView>
      ) : null}

      {activeTab === "perfil" ? (
        <ScrollView style={styles.flex} contentContainerStyle={styles.body}>
          <Text style={styles.sectionTitle}>Mi perfil</Text>
          <Text style={styles.sectionSub}>
            Gestiona tu sesión, privacidad y seguridad de tu cuenta.
          </Text>

          {/* Tarjeta de identidad con correo de sesión (DEC-M06) */}
          <View style={styles.profileCard}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarInitial}>
                {(userEmail?.[0] ?? "U").toUpperCase()}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Tag tone="mint">Sesión activa</Tag>
              <Text style={styles.profileEmail}>
                {userEmail ?? "Correo autenticado"}
              </Text>
              <Text style={styles.profileUni}>
                Campus: {selectedUniversity.siglas} ({selectedUniversity.ciudad})
              </Text>
            </View>
          </View>

          <View style={styles.menuCard}>
            <Row
              icon="school"
              title="Cambiar universidad de interés"
              sub={`${selectedUniversity.siglas} · ${selectedUniversity.ciudad}`}
              onPress={() => setSelectedUniversity(null)}
            />
            <Row
              icon="shield"
              title="Aviso de privacidad y términos"
              sub={`Versión aceptada: v${PRIVACY_NOTICE_VERSION}`}
              onPress={() => navigation.navigate("Legal")}
            />
            <Row
              icon="trash"
              title="Eliminar mi cuenta"
              sub="Baja definitiva de tu cuenta y datos personales"
              danger
              onPress={() => navigation.navigate("DeleteAccount")}
            />
          </View>

          <View style={{ marginTop: 18 }}>
            <Button
              variant="secondary"
              loading={loggingOut}
              onPress={handleLogout}
              icon={<Icon name="logout" size={16} color={colors.ink} />}
            >
              Cerrar sesión
            </Button>
          </View>
        </ScrollView>
      ) : null}

      {/* Barra de navegación inferior fiel a la maqueta */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => setActiveTab("explorar")}
        >
          <Icon
            name="compass"
            size={20}
            color={activeTab === "explorar" ? colors.coralDark : colors.slate}
          />
          <Text
            style={[
              styles.tabLabel,
              activeTab === "explorar" ? styles.tabLabelActive : null,
            ]}
          >
            Explorar
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => setActiveTab("mensajes")}
        >
          <Icon
            name="chat"
            size={20}
            color={activeTab === "mensajes" ? colors.coralDark : colors.slate}
          />
          <Text
            style={[
              styles.tabLabel,
              activeTab === "mensajes" ? styles.tabLabelActive : null,
            ]}
          >
            Mensajes
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => setActiveTab("perfil")}
        >
          <Icon
            name="user"
            size={20}
            color={activeTab === "perfil" ? colors.coralDark : colors.slate}
          />
          <Text
            style={[
              styles.tabLabel,
              activeTab === "perfil" ? styles.tabLabelActive : null,
            ]}
          >
            Perfil
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

/**
 * Pantalla Legal ("/legal" en Figma/src/App.tsx + DEC-M05).
 * Muestra localmente el Aviso de Privacidad (versión 1.0) y los Términos de Uso.
 */
type LegalProps = NativeStackScreenProps<RootStackParamList, "Legal">;

export const LegalScreen: React.FC<LegalProps> = ({ navigation }) => {
  return (
    <View style={styles.screen}>
      <PageHeader
        title="Aviso de privacidad y términos"
        subtitle={`Versión vigente ${PRIVACY_NOTICE_VERSION} · UniHome`}
        onBack={() => navigation.goBack()}
      />
      <ScrollView style={styles.flex} contentContainerStyle={styles.body}>
        <Note tone="mint" title="Protección de tus datos personales">
          En UniHome tratamos tu información conforme a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP).
        </Note>

        <View style={styles.legalCard}>
          <Text style={styles.legalHeading}>1. Responsable y datos recabados</Text>
          <Text style={styles.legalText}>
            UniHome recaba tu nombre completo, correo electrónico, fecha de nacimiento, género y, cuando lo proporciones, teléfono de contacto e identificación para verificación, con el único fin de operar la plataforma estudiantil y conectarte con arrendadores verificados.
          </Text>

          <Text style={styles.legalHeading}>2. Finalidades del tratamiento</Text>
          <Text style={styles.legalText}>
            Crear y autenticar tu cuenta, enviarte códigos de confirmación de seguridad, mostrar alojamientos cercanos a tu universidad y permitir la comunicación segura dentro de la aplicación.
          </Text>

          <Text style={styles.legalHeading}>3. Derechos ARCO y baja de cuenta</Text>
          <Text style={styles.legalText}>
            Puedes acceder, rectificar, cancelar u oponerte al tratamiento de tus datos personales, así como eliminar tu cuenta de forma definitiva desde la opción "Eliminar mi cuenta" en tu perfil.
          </Text>

          <Text style={styles.legalHeading}>4. Regla de mayoría de edad para publicar</Text>
          <Text style={styles.legalText}>
            Cualquier estudiante puede registrarse y explorar alojamientos con una fecha de nacimiento válida. Para publicar un inmueble como arrendador es requisito tener 18 años cumplidos o más y acreditar la verificación de identidad.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

/**
 * Pantalla de Eliminación de Cuenta ("/eliminar-cuenta" en Figma/src/App.tsx + SES-12..14).
 * Conectada a DELETE /api/v1/cuentas/mi-cuenta enviando contrasena y confirmacionPerdidaInformacion.
 */
type DeleteAccountProps = NativeStackScreenProps<RootStackParamList, "DeleteAccount">;

export const DeleteAccountScreen: React.FC<DeleteAccountProps> = ({ navigation }) => {
  const { deleteAccount } = useAuth();
  const [pwd, setPwd] = useState("");
  const [confirmLoss, setConfirmLoss] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pwdError, setPwdError] = useState<string | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null);

  const handleDelete = async () => {
    setPwdError(null);
    setGeneralError(null);

    if (!pwd) {
      setPwdError("Ingresa tu contraseña actual para confirmar.");
      return;
    }
    if (!confirmLoss) {
      setGeneralError("Debes confirmar que comprendes que esta acción es permanente.");
      return;
    }

    setLoading(true);
    try {
      await deleteAccount({
        contrasena: pwd,
        confirmacionPerdidaInformacion: confirmLoss,
      });
      // Al completarse (204 No Content), AuthContext limpia expo-secure-store y regresa a Welcome
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 400) {
          setPwdError(err.getFieldError("contrasena") || err.detail);
        } else if (err.status === 401) {
          setPwdError("La contraseña ingresada no es correcta.");
        } else if (err.status === 409) {
          // SES-14: Obligaciones activas que impiden eliminar la cuenta
          setGeneralError(err.detail);
        } else {
          setGeneralError(err.detail);
        }
      } else {
        setGeneralError("No pudimos procesar la solicitud. Verifica tu conexión.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.body}
        keyboardShouldPersistTaps="handled"
      >
        <PageHeader
          title="Eliminar mi cuenta"
          subtitle="Esta acción dará de baja tu cuenta de forma permanente."
          onBack={() => navigation.goBack()}
        />

        <View style={{ marginTop: 12, marginBottom: 16 }}>
          <Note tone="danger" title="Atención: acción irreversible">
            Al eliminar tu cuenta se revocarán todas tus sesiones activas y perderás el acceso a tu perfil e historial en UniHome.
          </Note>
        </View>

        {generalError ? (
          <View style={{ marginBottom: 14 }}>
            <Note tone="gold" title="No se pudo eliminar la cuenta">
              {generalError}
            </Note>
          </View>
        ) : null}

        <Field label="Confirma tu contraseña actual" error={pwdError}>
          <TextInput
            style={inputStyle(!!pwdError)}
            placeholder="Ingresa tu contraseña"
            placeholderTextColor="#94a3b8"
            secureTextEntry
            autoCapitalize="none"
            maxLength={30}
            value={pwd}
            onChangeText={(v) => {
              setPwd(v.slice(0, 30));
              setPwdError(null);
            }}
          />
        </Field>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setConfirmLoss((prev) => !prev)}
          style={styles.consentRow}
        >
          <View style={[styles.checkbox, confirmLoss ? styles.checkboxDanger : null]}>
            {confirmLoss ? <Icon name="check" size={14} color="#ffffff" /> : null}
          </View>
          <Text style={styles.consentText}>
            Entiendo que se eliminará mi cuenta y que esta acción no se puede deshacer.
          </Text>
        </TouchableOpacity>

        <Button
          variant="danger"
          disabled={!confirmLoss || !pwd}
          loading={loading}
          onPress={handleDelete}
          icon={<Icon name="trash" size={16} color="#ffffff" />}
        >
          Eliminar mi cuenta definitivamente
        </Button>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  screen: {
    flex: 1,
    backgroundColor: colors.paper,
  },
  body: {
    paddingHorizontal: 22,
    paddingTop: 16,
    paddingBottom: 32,
  },
  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.line,
    backgroundColor: colors.soft,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: colors.ink,
    fontFamily: fonts.sans,
  },
  uniList: {
    gap: 10,
  },
  uniCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: "#ffffff",
  },
  uniBadge: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: colors.coralSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  uniRowTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 3,
  },
  uniSiglas: {
    fontWeight: "800",
    fontSize: 15,
    color: colors.ink,
    fontFamily: fonts.display,
  },
  uniName: {
    fontSize: 12.5,
    color: colors.slate,
  },
  exploreHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: "800",
    color: colors.coralDark,
    letterSpacing: 0.7,
  },
  campusTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.ink,
    fontFamily: fonts.display,
  },
  campusSub: {
    fontSize: 12,
    color: colors.slate,
  },
  bold: {
    fontWeight: "700",
    color: colors.ink,
  },
  listingCard: {
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: "#ffffff",
    marginBottom: 12,
  },
  listingBadges: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 8,
  },
  listingTitle: {
    fontSize: 15.5,
    fontWeight: "800",
    color: colors.ink,
  },
  listingMeta: {
    fontSize: 12.5,
    color: colors.slate,
    marginTop: 4,
  },
  listingFooter: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.line,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  listingPrice: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.coralDeep,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.ink,
    fontFamily: fonts.display,
  },
  sectionSub: {
    fontSize: 13,
    color: colors.slate,
    marginTop: 3,
    marginBottom: 16,
  },
  emptyCard: {
    padding: 24,
    borderRadius: 18,
    backgroundColor: colors.soft,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: "center",
    gap: 8,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.ink,
  },
  emptySub: {
    fontSize: 12.5,
    color: colors.slate,
    textAlign: "center",
    lineHeight: 18,
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 16,
    borderRadius: 18,
    backgroundColor: colors.coralSoft,
    borderWidth: 1,
    borderColor: "#fde2dc",
    marginBottom: 16,
  },
  avatarCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.coral,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitial: {
    color: "#ffffff",
    fontSize: 22,
    fontWeight: "800",
  },
  profileEmail: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.ink,
    marginTop: 4,
  },
  profileUni: {
    fontSize: 12,
    color: colors.slate,
    marginTop: 2,
  },
  menuCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.line,
    paddingHorizontal: 14,
    backgroundColor: "#ffffff",
  },
  tabBar: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: colors.line,
    backgroundColor: "#ffffff",
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
  },
  tabLabel: {
    fontSize: 11.5,
    fontWeight: "600",
    color: colors.slate,
  },
  tabLabelActive: {
    color: colors.coralDark,
    fontWeight: "800",
  },
  legalCard: {
    marginTop: 14,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.soft,
    gap: 8,
  },
  legalHeading: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.ink,
    marginTop: 6,
  },
  legalText: {
    fontSize: 12.5,
    color: colors.inkSoft,
    lineHeight: 19,
  },
  consentRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    marginBottom: 18,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.8,
    borderColor: colors.line,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 1,
  },
  checkboxDanger: {
    backgroundColor: colors.danger,
    borderColor: colors.danger,
  },
  consentText: {
    flex: 1,
    fontSize: 12.5,
    color: colors.inkSoft,
    lineHeight: 18,
  },
});
