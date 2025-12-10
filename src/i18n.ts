import { getRequestConfig } from "next-intl/server"

export default getRequestConfig(async ({ locale }) => {
  const currentLocale = locale ?? "pt-BR"
  return {
    locale: currentLocale,
    messages: (await import(`./messages/${currentLocale}.json`)).default
  }
})

export const locales = ["pt-BR", "en-US"] as const
export const defaultLocale = "pt-BR"
