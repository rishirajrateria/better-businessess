export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
export const formatDate = (d: Date | string | null | undefined, opts: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" }) =>
  d ? new Intl.DateTimeFormat("en-CA", opts).format(new Date(d)) : "";
export const formatNumber = (n: number) => new Intl.NumberFormat("en-CA").format(n);
