import Link from 'next/link'

export default function Breadcrumbs({ items }: { items: { label: string; href: string }[] }) {
  return (
    <nav className="text-sm text-zinc-700 dark:text-zinc-300">
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((it, i) => (
          <li key={i} className="flex items-center gap-2">
            <Link href={it.href} className="bubble-link">{it.label}</Link>
            {i < items.length - 1 && <span>/</span>}
          </li>
        ))}
      </ol>
    </nav>
  )
}
