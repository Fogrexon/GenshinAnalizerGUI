export class SimpleStore {
  private static store: Record<string, unknown> = {}
  public static get<T>(key: string): T | null {
    const val = this.store[key]
    if (val === undefined) {
      return null
    }
    return val as T
  }
  public static set<T>(key: string, value: T): void {
    this.store[key] = value
  }
}
