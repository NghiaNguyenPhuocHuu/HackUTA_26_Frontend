export const LOGO_WIDTHS = [120, 240, 400, 640] as const;

export const COAST_WIDTHS = [400, 560, 800, 1120] as const;

const LOGO_FILES = {
  light: "hackuta-logo",
  dark: "hackuta-logo-white",
} as const;

export type LogoVariant = keyof typeof LOGO_FILES;
export type LogoLayout = "header" | "hero" | "footer";

export const LOGO_SIZES: Record<LogoLayout, string> = {
  header: "44px",
  hero: "(max-width: 599px) 200px, 320px",
  footer: "40px",
};

export const COAST_SIZES =
  "(max-width: 599px) 260px, (max-width: 959px) 360px, 560px";

export function logoSrcSet(variant: LogoVariant) {
  const base = LOGO_FILES[variant];
  return LOGO_WIDTHS.map((w) => `/images/logos/${base}-${w}.webp ${w}w`).join(
    ", ",
  );
}

export function logoDefaultSrc(variant: LogoVariant, width = 400) {
  const base = LOGO_FILES[variant];
  return `/images/logos/${base}-${width}.webp`;
}

export function coastSrcSet() {
  return COAST_WIDTHS.map(
    (w) => `/images/coast/coast-cliff-v7-${w}.webp ${w}w`,
  ).join(", ");
}

export const COAST_DEFAULT_SRC = "/images/coast/coast-cliff-v7-800.webp";
