declare module 'feather-icons' {
  interface FeatherIcon {
    toSvg(attrs?: Record<string, string | number>): string
  }
  export const icons: Record<string, FeatherIcon>
}
