// useLocalStorage hook placeholder - will be implemented in task 3
export function useLocalStorage<T>(key: string, initialValue: T) {
  return [initialValue, () => {}] as const
}