// Claves de los signos vitales tal como viajan al backend (/api/notas).
export const CAMPOS_SIGNOS_VITALES = [
  'peso', 'talla', 'pCefalico', 'pAbdominal', 'hemoglucotest',
  'presionArterial', 'frecuenciaCardiaca', 'frecuenciaRespiratoria',
  'temperatura', 'saturacionOxigeno',
] as const

// Hasta que responda /api/notas/configuracion-signos-vitales se exigen todos:
// es el comportamiento histórico y evita guardar notas incompletas por un
// problema de red.
export const CAMPOS_OBLIGATORIOS_POR_DEFECTO: string[] = [...CAMPOS_SIGNOS_VITALES]

// El formulario usa claves cortas para temperatura y saturación; el resto
// coincide con el nombre del payload.
export function claveConfiguracionVital(claveFormulario: string): string {
  if (claveFormulario === 'temp') return 'temperatura'
  if (claveFormulario === 'spo2') return 'saturacionOxigeno'
  return claveFormulario
}
