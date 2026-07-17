import { headers } from "next/headers";

/** Absolute origin of the current request, e.g. "https://igotchu.vercel.app". */
export async function getOrigin() {
  const h = await headers();
  const host = h.get("host");
  const proto = h.get("x-forwarded-proto") || (process.env.NODE_ENV === "development" ? "http" : "https");
  return `${proto}://${host}`;
}
