interface Window {
  eel: Record<string, (...args: unknown[]) => (...args: unknown[]) => void>
}
