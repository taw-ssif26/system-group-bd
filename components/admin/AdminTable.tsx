interface Column<T> {
  key: string
  label: string
  render?: (row: T) => React.ReactNode
}

interface Props<T> {
  columns: Column<T>[]
  data: T[]
  keyField: keyof T
  emptyMessage?: string
}

export default function AdminTable<T extends Record<string, any>>({
  columns, data, keyField, emptyMessage = 'No records found.',
}: Props<T>) {
  if (data.length === 0) {
    return (
      <div className="text-center py-16 text-[#555] text-sm">{emptyMessage}</div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[#222]">
            {columns.map((col) => (
              <th key={col.key} className="text-left px-4 py-3 text-[#555] font-mono text-xs tracking-wider uppercase">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#1A1A1A]">
          {data.map((row) => (
            <tr key={String(row[keyField])} className="hover:bg-[#141414] transition-colors">
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-3 text-[#aaa]">
                  {col.render ? col.render(row) : String(row[col.key] ?? '—')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
