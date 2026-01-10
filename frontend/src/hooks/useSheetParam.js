import { useSearchParams } from 'react-router-dom'

/**
 * Hook to get the current sheet name from URL query parameter
 * Returns null for default sheet (backwards compatibility)
 * Returns sheet name for tenant sheets (e.g., "Aoife_Puzzles")
 */
export function useSheetParam() {
  const [searchParams] = useSearchParams()
  const sheet = searchParams.get('sheet')
  return sheet || null
}
