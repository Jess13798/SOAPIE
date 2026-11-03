export const WONG_BAKER_MARKER = '[ESCALA_WONG_BAKER]'

export const WONG_BAKER_FACES = [
  { score: 0, face: '😊', meaning: 'No duele' },
  { score: 2, face: '🙂', meaning: 'Duele un poco' },
  { score: 4, face: '😐', meaning: 'Duele un poco más' },
  { score: 6, face: '🙁', meaning: 'Duele aún más' },
  { score: 8, face: '😣', meaning: 'Duele mucho' },
  { score: 10, face: '😭', meaning: 'El peor dolor' },
] as const

export type WongBakerScore = typeof WONG_BAKER_FACES[number]['score']

const escapedMarker = WONG_BAKER_MARKER.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

export function extractWongBakerScore(text: string): WongBakerScore | null {
  const markerPattern = new RegExp(`\\n\\n${escapedMarker}\\n(0|2|4|6|8|10)$`)
  const match = text.match(markerPattern)
  if (!match) return null

  const score = Number(match[1])
  return WONG_BAKER_FACES.some(face => face.score === score)
    ? score as WongBakerScore
    : null
}

export function removeWongBakerMarker(text: string): string {
  return text.replace(new RegExp(`\\n\\n${escapedMarker}\\n(?:0|2|4|6|8|10)$`), '').trimEnd()
}

export function appendWongBakerMarker(text: string, score: WongBakerScore | null): string {
  const cleanText = removeWongBakerMarker(text)
  return score === null ? cleanText : `${cleanText}\n\n${WONG_BAKER_MARKER}\n${score}`
}

export function wongBakerFace(score: number | null | undefined) {
  return WONG_BAKER_FACES.find(face => face.score === score)
}
