// Configuración de signos vitales obligatorios y rangos por servicio.
//
// Es la MISMA fuente que usa el backend
// (backend/src/modules/notas/signosVitalesConfig.js). Al vivir también en el
// frontend, la pantalla marca los campos correctos desde el primer render, sin
// depender de una consulta al servidor.
import config from './signosVitales.json'

export type RangoVital = {
  min?: number
  max?: number
  sisMin?: number
  sisMax?: number
  diaMin?: number
  diaMax?: number
}

export const CAMPOS_SIGNOS_VITALES: string[] = config.campos

// Servicios sin configuración: se exigen todos (comportamiento histórico).
export const CAMPOS_OBLIGATORIOS_POR_DEFECTO: string[] = config.porDefecto.obligatorios

export function camposObligatoriosDeServicio(idServicio?: string | null): string[] {
  const id = String(idServicio ?? '').trim()
  const c = id && config.porServicio ? config.porServicio[id] : undefined
  return (c && c.obligatorios) || config.porDefecto.obligatorios
}

// Rangos (min/max) configurados para el servicio. Sirven para validar y para
// mostrar el rango permitido en la pantalla. Si no hay configuración, se usan
// los límites técnicos de porDefecto.
export function rangosDeServicio(idServicio?: string | null): Record<string, RangoVital> {
  const id = String(idServicio ?? '').trim()
  const c = id && config.porServicio ? config.porServicio[id] : undefined
  return (c && c.rangos) || config.porDefecto.rangos || {}
}

export function rangoDeServicio(idServicio: string | null | undefined, campo: string): RangoVital | null {
  const r = rangosDeServicio(idServicio)
  return r && r[campo] ? r[campo] : null
}

// El formulario usa claves cortas para temperatura y saturación; el resto
// coincide con el nombre del payload.
export function claveConfiguracionVital(claveFormulario: string): string {
  if (claveFormulario === 'temp') return 'temperatura'
  if (claveFormulario === 'spo2') return 'saturacionOxigeno'
  return claveFormulario
}
