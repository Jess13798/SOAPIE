import type { ServicioCatalogo } from '@/services/api'
import type { ServicioPlanificado } from '@/types'

export function agregarServicioPlanificado(
  servicios: ServicioPlanificado[],
  servicio: ServicioCatalogo,
): ServicioPlanificado[] {
  if (servicios.some(actual => actual.id === servicio.id)) return servicios
  return [...servicios, servicio]
}

export function quitarServicioPlanificado(
  servicios: ServicioPlanificado[],
  id: number,
): ServicioPlanificado[] {
  return servicios.filter(servicio => servicio.id !== id)
}
