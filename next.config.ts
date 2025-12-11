import type { NextConfig } from "next"
import createNextIntlPlugin from "next-intl/plugin"

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts")

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
let supabaseHostname: string | undefined
try {
  if (supabaseUrl) {
    const u = new URL(supabaseUrl)
    supabaseHostname = u.hostname
  }
} catch {}

const nextConfig: NextConfig = {
  turbopack: {},
  images: {
    remotePatterns: supabaseHostname
      ? [
          { protocol: "https", hostname: supabaseHostname, pathname: "/storage/v1/object/public/**" },
          { protocol: "https", hostname: "nueqjouelukdspbjbseo.supabase.co", pathname: "/storage/v1/object/public/**" }
        ]
      : [
          { protocol: "https", hostname: "nueqjouelukdspbjbseo.supabase.co", pathname: "/storage/v1/object/public/**" }
        ]
  }
}

export default withNextIntl(nextConfig)
