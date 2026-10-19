interface Props {
  size?: number
}

const base = (size: number) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
})

export const SunIcon = ({ size = 18 }: Props) => (
  <svg {...base(size)}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4" />
  </svg>
)

export const MoonIcon = ({ size = 18 }: Props) => (
  <svg {...base(size)}>
    <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" />
  </svg>
)

/** Marca de la app: una mesa vista desde arriba con tres comensales. */
export const LogoMark = ({ size = 30 }: Props) => (
  <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
    <rect width="32" height="32" rx="8" fill="var(--acc)" />
    <rect x="7" y="11" width="18" height="10" rx="2" fill="none" stroke="var(--acc-ink)" strokeWidth="1.8" />
    <path d="M11 7.5h2M19 7.5h2M11 24.5h2M19 24.5h2" stroke="var(--acc-ink)" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
)
