// Configuración de signos vitales obligatorios por servicio.
//
// Es la MISMA fuente que usa el backend
// (backend/src/modules/notas/signosVitalesConfig.js). Al vivir también en el
// frontend, la pantalla marca los campos correctos desde el primer render, sin
// depender de una consulta al servidor.
import config from './signosVitales.json'

export const CAMPOS_SIGNOS_VITALES: string[] = config.campos

// Servicios sin configuración: se exigen todos (comportamiento histórico).
export const CAMPOS_OBLIGATORIOS_POR_DEFECTO: string[] = config.porDefecto

export function camposObligatoriosDeServicio(idServicio?: string | null): string[] {
  const id = String(idServicio ?? '').trim()
  const configurado = id ? (config.porServicio as Record<string, string[]>)[id] : undefined
  return configurado || config.porDefecto
}

// El formulario usa claves cortas para temperatura y saturación; el resto
// coincide con el nombre del payload.
export function claveConfiguracionVital(claveFormulario: string): string {
  if (claveFormulario === 'temp') return 'temperatura'
  if (claveFormulario === 'spo2') return 'saturacionOxigeno'
  return claveFormulario
}
