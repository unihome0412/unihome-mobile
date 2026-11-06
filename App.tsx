import React from "react";
import { ActivityIndicator, StatusBar, StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { AuthProvider, useAuth } from "./src/context/AuthContext";
import { WelcomeScreen } from "./src/screens/WelcomeScreen";
import { LoginScreen } from "./src/screens/LoginScreen";
import { RegisterScreen } from "./src/screens/RegisterScreen";
import { ConfirmEmailScreen } from "./src/screens/ConfirmEmailScreen";
import {
  DeleteAccountScreen,
  FirstEntryScreen,
  LegalScreen,
} from "./src/screens/FirstEntryScreens";
import { colors } from "./src/theme/tokens";

/**
 * Mapa tipado de rutas de navegación para los flujos F01 (Registro y Confirmación),
 * F02 (Login y Sesión Persistente) y FT-06 (Recorrido Inicial Pos-Login).
 */
export type RootStackParamList = {
  Welcome: undefined;
  Login:
    | {
        prefillEmail?: string;
        confirmedMessage?: string;
      }
    | undefined;
  Register: undefined;
  ConfirmEmail: {
    correo: string;
    correoConfirmacionEnviado?: boolean;
  };
  FirstEntry: undefined;
  DeleteAccount: undefined;
  Legal: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  const { status } = useAuth();

  // Mientras se verifica expo-secure-store y POST /api/v1/auth/refresh al arrancar (CM-13 / SES-07)
  if (status === "Restaurando") {
    return (
      <View style={styles.splashContainer}>
        <ActivityIndicator size="large" color={colors.coral} />
        <Text style={styles.splashText}>Restaurando tu sesión segura...</Text>
      </View>
    );
  }

  const isAuthenticated = status === "ConSesion" || status === "Renovando";

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.paper },
          animation: "slide_from_right",
        }}
      >
        {isAuthenticated ? (
          <>
            <Stack.Screen name="FirstEntry" component={FirstEntryScreen} />
            <Stack.Screen name="DeleteAccount" component={DeleteAccountScreen} />
            <Stack.Screen
              name="Legal"
              component={LegalScreen}
              options={{ presentation: "modal" }}
            />
          </>
        ) : (
          <>
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="ConfirmEmail" component={ConfirmEmailScreen} />
            <Stack.Screen
              name="Legal"
              component={LegalScreen}
              options={{ presentation: "modal" }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
          <StatusBar barStyle="dark-content" />
          <AppNavigator />
        </SafeAreaView>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.paper,
  },
  splashContainer: {
    flex: 1,
    backgroundColor: colors.warmBg,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  splashText: {
    fontSize: 13.5,
    color: colors.slate,
    fontWeight: "600",
  },
});
