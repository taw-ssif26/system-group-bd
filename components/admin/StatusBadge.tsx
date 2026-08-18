interface Props {
  label: string
  color?: 'gold' | 'green' | 'yellow' | 'red' | 'gray' | 'blue'
}

const colorMap = {
  gold:   'text-[#C9A84C]',
  green:  'text-green-400',
  yellow: 'text-yellow-400',
  red:    'text-red-400',
  gray:   'text-[#666]',
  blue:   'text-blue-400',
}

export default function StatusBadge({ label, color = 'gray' }: Props) {
  return (
    <span className={`font-mono text-xs ${colorMap[color]}`}>
      {label}
    </span>
  )
}
