import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Button, Icon } from "../components/ui";
import { colors, fonts } from "../theme/tokens";
import { RootStackParamList } from "../../App";
import logoWide from "../assets/unihome-logo-wide.png";
import heroAlojamiento from "../assets/estudiantes-alojamiento.jpg";

type Props = NativeStackScreenProps<RootStackParamList, "Welcome">;

/**
 * Pantalla de Bienvenida (ruta "/" en Figma/src/App.tsx líneas 1354-1419).
 * Utiliza el logotipo oficial y la ilustración de estudiantes buscando
 * departamentos y alojamiento universitario al mudarse lejos de su hogar.
 */
export const WelcomeScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Logotipo oficial UniHome */}
      <View style={styles.headerRow}>
        <Image
          source={logoWide}
          style={styles.logo}
          resizeMode="contain"
          accessibilityLabel="UniHome"
        />
      </View>

      {/* Ilustración de búsqueda de departamentos para estudiantes que viven lejos */}
      <View style={styles.heroContainer}>
        <Image
          source={heroAlojamiento}
          style={styles.heroImage}
          resizeMode="cover"
          accessibilityLabel="Estudiante universitario con equipaje buscando departamento acogedor cerca de su campus universitario"
        />

        <View style={styles.trustOverlayCard}>
          <View style={styles.trustIconCircle}>
            <Icon name="shield" size={20} color="#397b70" />
          </View>
          <View style={styles.trustTextWrap}>
            <Text style={styles.trustTitle}>Un comienzo con más confianza</Text>
            <Text style={styles.trustSub}>Conoce a arrendadores verificados.</Text>
          </View>
        </View>
      </View>

      {/* Mensaje editorial principal */}
      <View style={styles.copySection}>
        <Text style={styles.eyebrow}>CERCA DEL CAMPUS. CERCA DE TI.</Text>
        <Text style={styles.heroHeading}>
          {"Tu nueva etapa\nempieza en casa"}
          <Text style={styles.coralDot}>.</Text>
        </Text>
        <Text style={styles.heroBody}>
          Encuentra tu espacio universitario con arrendadores verificados.
        </Text>

        <View style={styles.primaryActionWrap}>
          <Button
            onPress={() => navigation.navigate("Register")}
            icon={<Icon name="chevron" size={18} color="#ffffff" />}
          >
            Explorar alojamientos
          </Button>
        </View>

        <TouchableOpacity
          onPress={() => navigation.navigate("Login")}
          style={styles.loginLinkBtn}
          activeOpacity={0.75}
        >
          <Text style={styles.loginLinkText}>
            Ya tengo cuenta <Text style={styles.loginArrow}>→</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 18,
    paddingBottom: 26,
    flexGrow: 1,
    justifyContent: "space-between",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  logo: {
    width: 144,
    height: 46,
  },
  heroContainer: {
    marginTop: 18,
    flex: 1,
    minHeight: 330,
    borderRadius: 24,
    overflow: "hidden",
    position: "relative",
    backgroundColor: colors.coralSoft,
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  trustOverlayCard: {
    position: "absolute",
    bottom: 18,
    left: 18,
    right: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderRadius: 14,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    paddingVertical: 11,
    paddingHorizontal: 12,
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  trustIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#e5f4f1",
    alignItems: "center",
    justifyContent: "center",
  },
  trustTextWrap: {
    flex: 1,
  },
  trustTitle: {
    fontWeight: "700",
    fontSize: 12.5,
    color: colors.ink,
  },
  trustSub: {
    fontSize: 12,
    color: colors.slate500,
    marginTop: 1,
  },
  copySection: {
    paddingTop: 22,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: "700",
    color: "#b54138",
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  heroHeading: {
    fontFamily: fonts.display,
    fontSize: 34,
    lineHeight: 39,
    marginTop: 10,
    fontWeight: "800",
    color: colors.ink,
    letterSpacing: -0.7,
  },
  coralDot: {
    color: "#F07666",
  },
  heroBody: {
    marginTop: 10,
    maxWidth: 305,
    color: colors.slate500,
    fontSize: 13.5,
    lineHeight: 22,
  },
  primaryActionWrap: {
    marginTop: 18,
  },
  loginLinkBtn: {
    marginTop: 14,
    paddingVertical: 6,
    alignItems: "center",
  },
  loginLinkText: {
    color: colors.slate700,
    fontWeight: "600",
    fontSize: 12.5,
  },
  loginArrow: {
    color: "#b54138",
    fontWeight: "700",
  },
});
