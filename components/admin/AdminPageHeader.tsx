import Link from 'next/link'

interface Props {
  title: string
  subtitle?: string
  action?: { label: string; href: string }
}

export default function AdminPageHeader({ title, subtitle, action }: Props) {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-xl font-medium text-white">{title}</h1>
        {subtitle && <p className="text-sm text-[#666] mt-1">{subtitle}</p>}
      </div>
      {action && (
        <Link
          href={action.href}
          className="flex items-center gap-2 bg-[#C9A84C] text-black text-sm font-medium px-4 py-2 hover:bg-[#E2C97A] transition-colors"
        >
          + {action.label}
        </Link>
      )}
    </div>
  )
}
