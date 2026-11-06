import React, { type ReactNode } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from "react-native";
import Svg, { Circle, Path, Rect } from "react-native-svg";
import { colors } from "../theme/tokens";
import logoWide from "../assets/unihome-logo-wide.png";

export type Role = "student" | "landlord" | "pending" | "admin";

export type IconName =
  | "home"
  | "search"
  | "wallet"
  | "chat"
  | "user"
  | "building"
  | "tools"
  | "bell"
  | "chevron"
  | "chevRight"
  | "map"
  | "bus"
  | "wifi"
  | "store"
  | "check"
  | "lock"
  | "file"
  | "shield"
  | "plus"
  | "users"
  | "clock"
  | "alert"
  | "calendar"
  | "arrow"
  | "camera"
  | "key"
  | "pin"
  | "list"
  | "x"
  | "face"
  | "sliders"
  | "graduation"
  | "school"
  | "eye"
  | "eyeOff"
  | "arrowRight"
  | "logout"
  | "heart"
  | "mail"
  | "verified"
  | "trash"
  | "compass";

/**
 * Componente Icon portado desde Figma/src/ui.tsx a react-native-svg
 */
export function Icon({
  name,
  size = 20,
  color = colors.ink,
}: {
  name: IconName;
  size?: number;
  color?: string;
}) {
  const strokeProps = {
    stroke: color,
    strokeWidth: 1.9,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    fill: "none",
  };

  const renderPaths = (): ReactNode => {
    switch (name) {
      case "home":
        return (
          <>
            <Path d="m3 10 9-7 9 7" {...strokeProps} />
            <Path d="M5 9v11h14V9M9 20v-6h6v6" {...strokeProps} />
          </>
        );
      case "search":
        return (
          <>
            <Circle cx="11" cy="11" r="7" {...strokeProps} />
            <Path d="m20 20-4-4" {...strokeProps} />
          </>
        );
      case "wallet":
        return (
          <>
            <Rect x="3" y="5" width="18" height="15" rx="3" {...strokeProps} />
            <Path d="M16 13h5M3 9h18" {...strokeProps} />
          </>
        );
      case "chat":
        return (
          <>
            <Path
              d="M20 15a4 4 0 0 1-4 4H8l-5 2 1.5-4A7 7 0 0 1 3 13V8a4 4 0 0 1 4-4h9a4 4 0 0 1 4 4Z"
              {...strokeProps}
            />
            <Path d="M8 11h.01M12 11h.01M16 11h.01" {...strokeProps} />
          </>
        );
      case "user":
        return (
          <>
            <Circle cx="12" cy="8" r="4" {...strokeProps} />
            <Path d="M4 21a8 8 0 0 1 16 0" {...strokeProps} />
          </>
        );
      case "building":
        return (
          <Path
            d="M4 21V5l8-3 8 3v16M9 21v-4h6v4M8 8h1M15 8h1M8 12h1M15 12h1"
            {...strokeProps}
          />
        );
      case "tools":
        return (
          <Path
            d="m14.7 6.3 3-3a4 4 0 0 1-5 5L5 16l-1 4 4-1 7.7-7.7a4 4 0 0 1 5-5l-3 3Z"
            {...strokeProps}
          />
        );
      case "bell":
        return (
          <Path
            d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"
            {...strokeProps}
          />
        );
      case "chevron":
      case "chevRight":
        return <Path d="m9 18 6-6-6-6" {...strokeProps} />;
      case "map":
        return (
          <>
            <Path d="m9 18-6 3V6l6-3 6 3 6-3v15l-6 3Z" {...strokeProps} />
            <Path d="M9 3v15M15 6v15" {...strokeProps} />
          </>
        );
      case "bus":
        return (
          <>
            <Rect x="5" y="3" width="14" height="16" rx="3" {...strokeProps} />
            <Path
              d="M5 10h14M8 15h.01M16 15h.01M8 19l-1 2M16 19l1 2"
              {...strokeProps}
            />
          </>
        );
      case "wifi":
        return (
          <>
            <Path
              d="M5 12.5a10 10 0 0 1 14 0M8.5 16a5 5 0 0 1 7 0"
              {...strokeProps}
            />
            <Circle cx="12" cy="19" r="1" {...strokeProps} />
          </>
        );
      case "store":
        return (
          <>
            <Path d="M4 10v10h16V10M3 10l2-6h14l2 6" {...strokeProps} />
            <Path
              d="M3 10a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0M9 20v-5h6v5"
              {...strokeProps}
            />
          </>
        );
      case "check":
      case "verified":
        return <Path d="m5 12 4 4L19 6" {...strokeProps} />;
      case "lock":
        return (
          <>
            <Rect x="5" y="10" width="14" height="11" rx="3" {...strokeProps} />
            <Path d="M8 10V7a4 4 0 0 1 8 0v3" {...strokeProps} />
          </>
        );
      case "file":
        return (
          <>
            <Path d="M6 2h8l4 4v16H6Z" {...strokeProps} />
            <Path d="M14 2v5h5M9 13h6M9 17h4" {...strokeProps} />
          </>
        );
      case "shield":
        return (
          <>
            <Path
              d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11"
              {...strokeProps}
            />
            <Path d="m9 12 2 2 4-5" {...strokeProps} />
          </>
        );
      case "plus":
        return <Path d="M12 5v14M5 12h14" {...strokeProps} />;
      case "users":
        return (
          <>
            <Path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" {...strokeProps} />
            <Circle cx="9" cy="7" r="4" {...strokeProps} />
            <Path
              d="M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"
              {...strokeProps}
            />
          </>
        );
      case "clock":
        return (
          <>
            <Circle cx="12" cy="12" r="9" {...strokeProps} />
            <Path d="M12 7v5l3 2" {...strokeProps} />
          </>
        );
      case "alert":
        return (
          <>
            <Path
              d="M10.3 3.8 2.4 18a2 2 0 0 0 1.8 3h15.6a2 2 0 0 0 1.8-3L13.7 3.8a2 2 0 0 0-3.4 0"
              {...strokeProps}
            />
            <Path d="M12 9v4M12 17h.01" {...strokeProps} />
          </>
        );
      case "calendar":
        return (
          <>
            <Rect x="3" y="5" width="18" height="16" rx="3" {...strokeProps} />
            <Path d="M16 3v4M8 3v4M3 10h18" {...strokeProps} />
          </>
        );
      case "arrow":
        return <Path d="M19 12H5M11 18l-6-6 6-6" {...strokeProps} />;
      case "camera":
        return (
          <>
            <Path d="M4 8h3l2-3h6l2 3h3v12H4Z" {...strokeProps} />
            <Circle cx="12" cy="13" r="3.5" {...strokeProps} />
          </>
        );
      case "key":
        return (
          <>
            <Circle cx="8" cy="15" r="4" {...strokeProps} />
            <Path d="m11 12 9-9M16 7l3 3M14 9l2 2" {...strokeProps} />
          </>
        );
      case "pin":
        return (
          <>
            <Path
              d="M12 22s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12"
              {...strokeProps}
            />
            <Circle cx="12" cy="10" r="2.5" {...strokeProps} />
          </>
        );
      case "list":
        return (
          <Path
            d="M8 6h13M8 12h13M8 18h13M3.5 6h.01M3.5 12h.01M3.5 18h.01"
            {...strokeProps}
          />
        );
      case "x":
        return <Path d="M6 6l12 12M18 6 6 18" {...strokeProps} />;
      case "face":
        return (
          <>
            <Path
              d="M4 8V6a2 2 0 0 1 2-2h2M16 4h2a2 2 0 0 1 2 2v2M20 16v2a2 2 0 0 1-2 2h-2M8 20H6a2 2 0 0 1-2-2v-2"
              {...strokeProps}
            />
            <Path
              d="M9 10v1M15 10v1M9.5 15a3.5 3.5 0 0 0 5 0"
              {...strokeProps}
            />
          </>
        );
      case "sliders":
        return (
          <>
            <Path d="M4 7h9M17 7h3M4 17h3M11 17h9" {...strokeProps} />
            <Circle cx="15" cy="7" r="2" {...strokeProps} />
            <Circle cx="9" cy="17" r="2" {...strokeProps} />
          </>
        );
      case "graduation":
      case "school":
        return (
          <>
            <Path d="m2 9 10-5 10 5-10 5Z" {...strokeProps} />
            <Path
              d="M6 11.5V16c0 1.5 3 3 6 3s6-1.5 6-3v-4.5M22 9v6"
              {...strokeProps}
            />
          </>
        );
      case "eye":
        return (
          <>
            <Path
              d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12"
              {...strokeProps}
            />
            <Circle cx="12" cy="12" r="3" {...strokeProps} />
          </>
        );
      case "eyeOff":
        return (
          <>
            <Path d="m3 3 18 18" {...strokeProps} />
            <Path
              d="M10.6 5.2A9.8 9.8 0 0 1 12 5c6.4 0 10 7 10 7a15.8 15.8 0 0 1-2.1 3.1M6.6 6.6C3.7 8.4 2 12 2 12s3.6 7 10 7a9.8 9.8 0 0 0 4.1-.9M9.9 9.9a3 3 0 0 0 4.2 4.2"
              {...strokeProps}
            />
          </>
        );
      case "arrowRight":
        return <Path d="M5 12h14M13 6l6 6-6 6" {...strokeProps} />;
      case "logout":
        return (
          <>
            <Path d="M10 17l5-5-5-5M15 12H3" {...strokeProps} />
            <Path
              d="M14 3h5a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-5"
              {...strokeProps}
            />
          </>
        );
      case "heart":
        return (
          <Path
            d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z"
            {...strokeProps}
          />
        );
      case "mail":
        return (
          <>
            <Rect x="3" y="5" width="18" height="14" rx="2" {...strokeProps} />
            <Path d="m3 7 9 6 9-6" {...strokeProps} />
          </>
        );
      case "trash":
        return (
          <>
            <Path d="M3 6h18M8 6V4h8v2M6 6v14a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V6" {...strokeProps} />
            <Path d="M10 11v6M14 11v6" {...strokeProps} />
          </>
        );
      case "compass":
        return (
          <>
            <Circle cx="12" cy="12" r="9" {...strokeProps} />
            <Path d="m15 9-2 6-6 2 2-6 6-2Z" {...strokeProps} />
          </>
        );
    }
  };

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" accessibilityElementsHidden>
      {renderPaths()}
    </Svg>
  );
}

/**
 * Botón principal y secundario fiel a `Button` en Figma/src/App.tsx
 */
export function Button({
  children,
  onPress,
  variant = "primary",
  size = "lg",
  full = true,
  loading = false,
  icon,
  secondary = false,
  disabled = false,
  style,
}: {
  children: ReactNode;
  onPress?: () => void;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  full?: boolean;
  loading?: boolean;
  icon?: ReactNode;
  secondary?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const effectiveVariant = secondary ? "secondary" : variant;
  const isDisabled = disabled || loading;

  const variantStyle =
    effectiveVariant === "secondary"
      ? styles.buttonSecondary
      : effectiveVariant === "ghost"
        ? styles.buttonGhost
        : effectiveVariant === "danger"
          ? styles.buttonDanger
          : styles.buttonPrimary;

  const textStyle =
    effectiveVariant === "secondary" || effectiveVariant === "ghost"
      ? styles.buttonTextSecondary
      : styles.buttonTextPrimary;

  const sizeStyle =
    size === "sm"
      ? { minHeight: 36, paddingVertical: 8, paddingHorizontal: 12 }
      : size === "md"
        ? { minHeight: 42, paddingVertical: 10, paddingHorizontal: 14 }
        : styles.buttonBase;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled }}
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.buttonBase,
        sizeStyle,
        !full ? { width: "auto", alignSelf: "flex-start" } : null,
        variantStyle,
        isDisabled && styles.buttonDisabled,
        pressed && !isDisabled && styles.buttonPressed,
        style,
      ]}
    >
      <View style={styles.buttonContent}>
        {loading ? (
          <ActivityIndicator
            size="small"
            color={
              effectiveVariant === "secondary" || effectiveVariant === "ghost"
                ? colors.ink
                : colors.white
            }
          />
        ) : null}
        {typeof children === "string" ? (
          <Text style={[styles.buttonText, textStyle]}>{children}</Text>
        ) : (
          children
        )}
        {!loading && icon ? icon : null}
      </View>
    </Pressable>
  );
}

/**
 * Campo con etiqueta fiel a `Field` en Figma/src/App.tsx
 */
export function Field({
  label,
  hint,
  error,
  errorText,
  children,
}: {
  label: string;
  hint?: string;
  error?: string | null;
  errorText?: string | null;
  children: ReactNode;
}) {
  const msg = error ?? errorText;
  return (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={styles.fieldInputWrap}>{children}</View>
      {hint && !msg ? <Text style={styles.fieldHint}>{hint}</Text> : null}
      {msg ? (
        <Text accessibilityRole="alert" style={styles.fieldError}>
          {msg}
        </Text>
      ) : null}
    </View>
  );
}

/**
 * Etiqueta `Tag` fiel a Figma/src/App.tsx
 */
export function Tag({
  children,
  tone = "mint",
  icon,
}: {
  children: ReactNode;
  tone?: "mint" | "gold" | "coral" | "slate";
  icon?: ReactNode;
}) {
  const bg =
    tone === "mint"
      ? colors.mintSoft
      : tone === "gold"
        ? colors.goldSoft
        : tone === "coral"
          ? colors.coralSoft
          : colors.slate100;
  const fg =
    tone === "mint"
      ? colors.mintDark
      : tone === "gold"
        ? colors.goldDark
        : tone === "coral"
          ? "#a83830"
          : colors.slate700;

  return (
    <View style={[styles.tag, { backgroundColor: bg, gap: 4 }]}>
      {icon}
      <Text style={[styles.tagText, { color: fg }]}>{children}</Text>
    </View>
  );
}

/**
 * Recuadro informativo `Note` fiel a Figma/src/App.tsx
 */
export function Note({
  children,
  title,
  tone = "slate",
}: {
  children: ReactNode;
  title?: string;
  tone?: "slate" | "mint" | "gold" | "coral" | "danger";
}) {
  const bg =
    tone === "mint"
      ? colors.mintSoft
      : tone === "gold"
        ? colors.goldSoft
        : tone === "coral" || tone === "danger"
          ? colors.coralSoft
          : colors.slate100;
  const fg =
    tone === "mint"
      ? colors.mintDark
      : tone === "gold"
        ? colors.goldDark
        : tone === "coral" || tone === "danger"
          ? colors.coralDeep
          : colors.slate600;

  return (
    <View style={[styles.note, { backgroundColor: bg }]}>
      <View style={styles.noteIcon}>
        <Icon
          name={
            tone === "gold" || tone === "coral" || tone === "danger"
              ? "alert"
              : "shield"
          }
          size={15}
          color={fg}
        />
      </View>
      <View style={{ flex: 1 }}>
        {title ? (
          <Text style={[styles.noteTitle, { color: fg }]}>{title}</Text>
        ) : null}
        <Text style={[styles.noteText, { color: fg }]}>{children}</Text>
      </View>
    </View>
  );
}

/**
 * Fila de acción `Row` fiel a Figma/src/App.tsx
 */
export function Row({
  icon,
  title,
  subtitle,
  sub,
  danger = false,
  onPress,
  end,
}: {
  icon: IconName;
  title: string;
  subtitle?: string;
  sub?: string;
  danger?: boolean;
  onPress?: () => void;
  end?: ReactNode;
}) {
  const secondaryText = subtitle ?? sub;
  return (
    <Pressable
      accessibilityRole="button"
      disabled={!onPress}
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        pressed && onPress ? { backgroundColor: colors.slate50 } : null,
      ]}
    >
      <View
        style={[
          styles.rowIconBox,
          danger ? { backgroundColor: colors.coralSoft } : null,
        ]}
      >
        <Icon
          name={icon}
          size={20}
          color={danger ? colors.danger : colors.mintIcon}
        />
      </View>
      <View style={styles.rowBody}>
        <Text
          style={[
            styles.rowTitle,
            danger ? { color: colors.danger } : null,
          ]}
        >
          {title}
        </Text>
        {secondaryText ? (
          <Text style={styles.rowSubtitle}>{secondaryText}</Text>
        ) : null}
      </View>
      {end ?? (onPress ? <Icon name="chevron" size={17} color={colors.slate500} /> : null)}
    </Pressable>
  );
}

/**
 * Encabezado de página `PageHeader` fiel a Figma/src/App.tsx (incluye barra superior con logo UNIHOME)
 */
export function PageHeader({
  title,
  subtitle,
  onBack,
  showBrandBar = true,
}: {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  showBrandBar?: boolean;
}) {
  return (
    <View>
      {showBrandBar ? (
        <View style={styles.brandTopBar}>
          <Image
            source={logoWide}
            style={styles.brandTopLogo}
            resizeMode="contain"
          />
        </View>
      ) : null}
      <View style={styles.pageHeader}>
        <View style={styles.pageHeaderLeft}>
          {onBack ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Volver"
              onPress={onBack}
              style={styles.backBtn}
            >
              <Icon name="arrow" size={18} color={colors.ink} />
            </Pressable>
          ) : null}
          <View style={{ flex: 1 }}>
            <Text style={styles.pageTitle}>{title}</Text>
            {subtitle ? <Text style={styles.pageSubtitle}>{subtitle}</Text> : null}
          </View>
        </View>
      </View>
    </View>
  );
}

export function inputStyle(hasError?: boolean): TextStyle {
  return {
    width: "100%",
    borderRadius: 12,
    borderWidth: hasError ? 1.5 : 1,
    borderColor: hasError ? colors.coralDeep : colors.slate200,
    backgroundColor: colors.white,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 13.5,
    color: colors.ink,
  };
}

const styles = StyleSheet.create({
  buttonBase: {
    minHeight: 48,
    width: "100%",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonPrimary: {
    backgroundColor: colors.coralDark,
  },
  buttonSecondary: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.slate200,
  },
  buttonGhost: {
    backgroundColor: "transparent",
  },
  buttonDanger: {
    backgroundColor: colors.danger,
  },
  buttonDisabled: {
    opacity: 0.45,
  },
  buttonPressed: {
    transform: [{ scale: 0.98 }],
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  buttonText: {
    fontSize: 13.5,
    fontWeight: "700",
  },
  buttonTextPrimary: {
    color: colors.white,
  },
  buttonTextSecondary: {
    color: colors.ink,
  },
  fieldContainer: {
    marginBottom: 12,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.slate700,
  },
  fieldInputWrap: {
    marginTop: 6,
  },
  fieldHint: {
    marginTop: 4,
    fontSize: 11.5,
    color: colors.slate500,
    lineHeight: 16,
  },
  fieldError: {
    marginTop: 4,
    fontSize: 12,
    color: colors.coralDeep,
    fontWeight: "600",
  },
  tag: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  tagText: {
    fontSize: 12,
    fontWeight: "600",
  },
  note: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    borderRadius: 12,
    padding: 12,
  },
  noteIcon: {
    marginTop: 2,
  },
  noteTitle: {
    fontSize: 12.5,
    fontWeight: "700",
    marginBottom: 2,
  },
  noteText: {
    fontSize: 12,
    lineHeight: 18,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
    backgroundColor: colors.white,
    paddingVertical: 14,
  },
  rowIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.mintSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  rowBody: {
    flex: 1,
  },
  rowTitle: {
    fontSize: 13.5,
    fontWeight: "700",
    color: colors.ink,
  },
  rowSubtitle: {
    marginTop: 2,
    fontSize: 12,
    lineHeight: 17,
    color: colors.slate500,
  },
  brandTopBar: {
    paddingHorizontal: 22,
    paddingTop: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.slate100,
    backgroundColor: colors.white,
  },
  brandTopLogo: {
    width: 132,
    height: 38,
  },
  pageHeader: {
    paddingHorizontal: 22,
    paddingTop: 14,
    paddingBottom: 6,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  pageHeaderLeft: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    flex: 1,
  },
  backBtn: {
    width: 42,
    height: 42,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.slate200,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: colors.ink,
    letterSpacing: -0.5,
    lineHeight: 29,
  },
  pageSubtitle: {
    marginTop: 3,
    fontSize: 12.5,
    lineHeight: 18,
    color: colors.slate500,
  },
});
