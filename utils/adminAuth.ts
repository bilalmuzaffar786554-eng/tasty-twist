export const adminAuthStorageKey = "tasty-twist-admin-auth";

export function getAdminPassword() {
  return process.env.NEXT_PUBLIC_ADMIN_PASSWORD ?? "";
}

export function isAdminLoggedIn() {
  if (typeof window === "undefined") {
    return false;
  }

  return window.localStorage.getItem(adminAuthStorageKey) === "true";
}

export function saveAdminLogin() {
  window.localStorage.setItem(adminAuthStorageKey, "true");
}

export function clearAdminLogin() {
  window.localStorage.removeItem(adminAuthStorageKey);
}
