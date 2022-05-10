interface Window {
  eel: Record<string, () => (...args: unknown[]) => void>
}
