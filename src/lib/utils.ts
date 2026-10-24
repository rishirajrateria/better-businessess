import { site } from "./site";

export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
export const formatDate = (d: Date | string | null | undefined, opts: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" }) =>
  d ? new Intl.DateTimeFormat("en-CA", opts).format(new Date(d)) : "";
/** Date/time in the business time zone (admin screens). Public pages use formatDate, which keeps calendar dates as typed. */
export const formatAdminDate = (d: Date | string | null | undefined, opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) =>
  d ? new Intl.DateTimeFormat("en-CA", { timeZone: site.timeZone, ...opts }).format(new Date(d)) : "";
export const formatNumber = (n: number) => new Intl.NumberFormat("en-CA").format(n);

export const formatPrice = (n: number) => `$${new Intl.NumberFormat("en-CA").format(n)}`;
export const priceLabel = (p: { amount: number; unit: "month" | "project" }) => `${formatPrice(p.amount)} CAD${p.unit === "month" ? "/mo" : ""}`;
