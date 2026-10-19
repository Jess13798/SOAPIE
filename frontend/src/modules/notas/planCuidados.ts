// Lógica pura del plan de cuidados (NANDA / NOC / NIC) de una nota SOAPIE.
// Vive aparte de los componentes para poder probarse sin montar Vue.
//
// Persistencia: el backend solo guarda `idNANDA`, `comentario`, `nocIds` y
// `nicIds` (columnas de dbo.NotaEnfermeriaPlanCuidado). El estado de ejecución
// de cada NIC y las metas/evaluaciones de cada NOC viajan dentro del TEXTO de la
// nota, en los bloques `[...]` de las secciones P / I / E, y se reconstruyen al
// reabrir la nota.

import type { NotaEnfermeria, PlanCuidadoNota } from '@/types'

export type NicEstado = 'sin_registrar' | 'realizada' | 'no_realizada'

// Títulos de los bloques estructurados dentro del texto de la nota. NO cambiar:
// las notas ya guardadas los usan como marca para separar texto libre de datos.
export const NOC_BLOQUE_TITULO = 'RESULTADOS NOC ESPERADOS Y NIC PLANIFICADAS'
export const NIC_BLOQUE_TITULO = 'INTERVENCIONES NIC REALIZADAS'
export const NOC_EVALUACION_BLOQUE_TITULO = 'EVALUACION DE RESULTADOS NOC'

// Marcadores internos de cada línea estructurada.
export const NIC_NO_REALIZADA_MARCADOR = ' | NO REALIZADA:'
export const NOC_META_MARCADOR = ' | Meta:'
export const NOC_RESULTADO_MARCADOR = ' | Resultado observado:'

export const NIC_ESTADOS: Array<{ value: NicEstado; label: string }> = [
  { value: 'realizada', label: 'Realizada' },
  { value: 'no_realizada', label: 'No realizada' },
  { value: 'sin_registrar', label: 'Sin registrar' },
]

/** Estado de ejecución de un NIC dentro de un plan. */
export function estadoNic(plan: PlanCuidadoNota, idNIC: number): NicEstado {
    if ((plan.nicRealizadasIds || []).includes(idNIC)) return 'realizada'
    if (plan.nicNoRealizadas && Object.prototype.hasOwnProperty.call(plan.nicNoRealizadas, idNIC)) {
        return 'no_realizada'
    }
    return 'sin_registrar'
}

/** NIC planificadas (las que el usuario marcó en la sección P). */
export function nicPlanificados(plan: PlanCuidadoNota) {
    return (plan.nic || []).filter(nic => plan.nicIds.includes(nic.id))
}

/** ¿Hay alguna intervención marcada como "no realizada" sin motivo? */
export function faltaMotivoNoRealizada(planCuidados: PlanCuidadoNota[]): boolean {
    return planCuidados.some(plan =>
        (plan.nic || []).some(nic =>
            estadoNic(plan, nic.id) === 'no_realizada'
            && !(plan.nicNoRealizadas?.[nic.id] || '').trim()))
}

/**
 * Convierte el plan de cuidados en las líneas que se anexan al texto de la
 * sección de Intervención. Solo se escriben los NIC con estado registrado; el
 * formato anterior (sin marcador) se mantiene para las realizadas.
 */
export function lineasIntervenciones(planCuidados: PlanCuidadoNota[]): string[] {
    const lineas: string[] = []
    for (const plan of planCuidados) {
        for (const nic of plan.nic || []) {
            if (!plan.nicIds.includes(nic.id)) continue
            const estado = estadoNic(plan, nic.id)
            if (estado === 'sin_registrar') continue
            const base = `NIC ${nic.codigo}: ${nic.intervencion}`
            if (estado === 'realizada') {
                lineas.push(base)
                continue
            }
            const motivo = (plan.nicNoRealizadas?.[nic.id] || '').trim()
            lineas.push(`${base}${NIC_NO_REALIZADA_MARCADOR} ${motivo}`.trimEnd())
        }
    }
    return lineas
}

function buscarLinea(texto: string, prefijo: string, marcador: string): string | null {
    for (const linea of (texto || '').split('\n')) {
        const inicio = linea.indexOf(prefijo)
        if (inicio === -1) continue
        const marca = linea.indexOf(marcador)
        if (marca === -1) continue
        return linea.slice(marca + marcador.length).trim()
    }
    return null
}

/**
 * Reconstruye el estado de ejecución de los NIC a partir del bloque de texto de
 * la sección Intervención.
 *   - Línea con marcador "| NO REALIZADA:"  → no realizada + motivo.
 *   - Línea sin marcador                    → realizada (formato anterior).
 */
export function hidratarNicEstados(
    plan: PlanCuidadoNota,
    lineasIntervencion: string[],
): { realizadas: number[]; noRealizadas: Record<number, string> } {
    const realizadas = new Set<number>(plan.nicRealizadasIds || [])
    const noRealizadas: Record<number, string> = { ...(plan.nicNoRealizadas || {}) }

    for (const nic of plan.nic || []) {
        const prefijo = `NIC ${nic.codigo}:`
        const linea = lineasIntervencion.find(item => item.indexOf(prefijo) !== -1)
        if (!linea) continue

        const marca = linea.indexOf(NIC_NO_REALIZADA_MARCADOR)
        if (marca === -1) {
            realizadas.add(nic.id)
            delete noRealizadas[nic.id]
            continue
        }
        realizadas.delete(nic.id)
        noRealizadas[nic.id] = linea.slice(marca + NIC_NO_REALIZADA_MARCADOR.length).trim()
    }

    return { realizadas: Array.from(realizadas), noRealizadas }
}

/** Normaliza un plan de cuidados que viene de la base con lo leído en el texto. */
export function hidratarPlanCuidados(nota: NotaEnfermeria): PlanCuidadoNota[] {
    const lineasIntervencion = (nota.intervencion || '').split('\n')

    return (nota.planCuidados || []).map(plan => {
        const { realizadas, noRealizadas } = hidratarNicEstados(plan, lineasIntervencion)

        const nocMetas: Record<number, string> = { ...(plan.nocMetas || {}) }
        const nocEvaluaciones: Record<number, string> = { ...(plan.nocEvaluaciones || {}) }
        for (const noc of plan.noc || []) {
            const meta = buscarLinea(nota.plan, `NOC ${noc.codigo}:`, NOC_META_MARCADOR)
            if (meta) nocMetas[noc.id] = meta
            const resultado = buscarLinea(nota.evaluacion, `NOC ${noc.codigo}:`, NOC_RESULTADO_MARCADOR)
            if (resultado) nocEvaluaciones[noc.id] = resultado
        }

        return { ...plan, nicRealizadasIds: realizadas, nicNoRealizadas: noRealizadas, nocMetas, nocEvaluaciones }
    })
}

/**
 * Arma el plan de una nota NUEVA a partir de la nota anterior del mismo
 * paciente: se conservan los diagnósticos y las selecciones NOC/NIC (y las
 * metas), pero se limpia el estado de ejecución para que el turno actual lo
 * registre desde cero.
 */
export function heredarPlanCuidados(notaAnterior?: NotaEnfermeria | null): PlanCuidadoNota[] {
    if (!notaAnterior) return []

    return hidratarPlanCuidados(notaAnterior).map(plan => ({
        idNANDA: plan.idNANDA,
        codigoNANDA: plan.codigoNANDA,
        diagnostico: plan.diagnostico,
        comentario: '',
        nocIds: [...plan.nocIds],
        nicIds: [...plan.nicIds],
        nicRealizadasIds: [],
        nicNoRealizadas: {},
        nocMetas: { ...(plan.nocMetas || {}) },
        nocEvaluaciones: {},
        noc: plan.noc,
        nic: plan.nic,
    }))
}
