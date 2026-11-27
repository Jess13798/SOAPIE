// Propósito: Implementación del archivo serviciosPlanificados.ts.
// Responsable de mantener separadas las reglas de este archivo.

import type { Diagnostico, ServicioCatalogo } from '@/services/api'
import type { ServicioPlanificado } from '@/types'

/**


 * Implementa la operación "agregarServicioPlanificado".


 * Mantiene aislada la responsabilidad principal de este archivo.


 */


export function agregarServicioPlanificado(
  servicios: ServicioPlanificado[],
  servicio: ServicioCatalogo,
  diagnostico?: Pick<Diagnostico, 'IdAtencionDiagnostico' | 'CodigoCIE10'>,
): ServicioPlanificado[] {
  if (servicios.some(actual => actual.id === servicio.id)) return servicios
  return [...servicios, {
    ...servicio,
    cantidad: 1,
    idAtencionDiagnostico: diagnostico?.IdAtencionDiagnostico ?? null,
    codigoCIE10: diagnostico?.CodigoCIE10 ?? null,
  }]
}

/**


 * Implementa la operación "quitarServicioPlanificado".


 * Mantiene aislada la responsabilidad principal de este archivo.


 */


export function quitarServicioPlanificado(
  servicios: ServicioPlanificado[],
  id: number,
): ServicioPlanificado[] {
  return servicios.filter(servicio => servicio.id !== id)
}
