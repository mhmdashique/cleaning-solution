export function getSafeAdminNext(value: string | string[] | undefined): string {
  if (
    typeof value !== "string" ||
    !value.startsWith("/admin") ||
    value.startsWith("//") ||
    value.includes("\\")
  ) {
    return "/admin";
  }

  const origin = "https://plancsolutions.invalid";
  const target = new URL(value, origin);
  if (
    target.origin !== origin ||
    (target.pathname !== "/admin" && !target.pathname.startsWith("/admin/"))
  ) {
    return "/admin";
  }

  return `${target.pathname}${target.search}${target.hash}`;
}
