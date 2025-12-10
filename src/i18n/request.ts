import { getRequestConfig } from "next-intl/server"

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = (await requestLocale) || "pt-BR"
  const loaders: Record<string, () => Promise<{ default: Record<string, unknown> }>> = {
    "pt-BR": () => import("../messages/pt-BR.json")
  }
  const load = loaders[locale] || loaders["pt-BR"]
  return {
    locale,
    messages: (await load()).default
  }
})
