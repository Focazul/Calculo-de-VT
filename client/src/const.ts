export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

// Generate login URL at runtime so redirect URI reflects the current origin.
export const getLoginUrl = () => {
  // Adicionado o operador '||' para garantir valores padrão caso o .env falhe
  const oauthPortalUrl = import.meta.env.VITE_OAUTH_PORTAL_URL || "http://localhost:3000";
  const appId = import.meta.env.VITE_APP_ID || "local-dev-app";
  const redirectUri = typeof window !== "undefined" ? `${window.location.origin}/api/oauth/callback` : "http://localhost:3000/api/oauth/callback";
  
  // Evita quebra de código caso o redirectUri não consiga ser convertido em base64 no ambiente node/server
  const state = typeof window !== "undefined" ? btoa(redirectUri) : "";

  try {
    const url = new URL(`${oauthPortalUrl}/app-auth`);
    url.searchParams.set("appId", appId);
    url.searchParams.set("redirectUri", redirectUri);
    url.searchParams.set("state", state);
    url.searchParams.set("type", "signIn");

    return url.toString();
  } catch (error) {
    // Retorna uma rota amigável em vez de estourar um erro na tela
    return "/auth/login";
  }
};