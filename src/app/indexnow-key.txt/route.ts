import { indexNowKey } from "@/lib/indexnow";

/** IndexNow key file — must serve the key as plain text at the keyLocation sent with each ping. */
export function GET() {
  return new Response(indexNowKey, { headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "public, max-age=86400" } });
}
