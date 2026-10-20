/**
 * Capa de Servicios de API para el Frontend
 * Centraliza todas las llamadas HTTP al backend para evitar URLs quemadas y código duplicado.
 */

import type { Patient, NotaEnfermeria, PacienteBD, SignoVitalHistorial } from '@/types'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

// ==========================================
// 0. SESIÓN / TOKEN
// ==========================================
const TOKEN_KEY = 'token'

export function getToken(): string | null {
    return sessionStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string): void {
    sessionStorage.setItem(TOKEN_KEY, token)
}

export function limpiarSesion(): void {
    sessionStorage.removeItem(TOKEN_KEY)
    sessionStorage.removeItem('usuarioLogueado')
    sessionStorage.removeItem('empleadoLogueado')
    sessionStorage.removeItem('idEmpleado')
    sessionStorage.removeItem('turno')
}

// Helper interno para peticiones JSON
async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${BASE_URL}${endpoint}`
    const token = getToken()

    const config: RequestInit = {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...options.headers,
        },
    }

    const response = await fetch(url, config)

    // Token inválido o expirado: se limpia la sesión y se vuelve al login
    if (response.status === 401) {
        limpiarSesion()
        if (typeof window !== 'undefined' && window.location.pathname !== '/') {
            window.location.href = '/'
        }
    }

    if (!response.ok) {
        let errorDetalle = `Error HTTP ${response.status}: ${response.statusText}`
        try {
            const errorJson = await response.json()
            if (errorJson?.mensaje) errorDetalle = errorJson.mensaje
        } catch {
            // Ignorar si la respuesta de error no es JSON
        }
        throw new Error(errorDetalle)
    }

    return response.json()
}

// ==========================================
// 1. AUTENTICACIÓN / LOGIN
// ==========================================
export interface LoginPayload {
    usuario: string
    Password: string
}

export interface LoginResponse {
    success: boolean
    mensaje: string
    token?: string
    usuario?: string
    empleado?: string
    idEmpleado?: string | number
    turno?: 'dia' | 'noche'
}

export const authService = {
    login(payload: LoginPayload): Promise<LoginResponse> {
        return request<LoginResponse>('/login', {
            method: 'POST',
            body: JSON.stringify(payload),
        })
    },
}

// ==========================================
// 2. PACIENTES Y SERVICIOS
// ==========================================
export interface Servicio {
    IdServicio: number
    Nombre: string
}

export interface PacienteSinCama {
    IdCuentaAtencion: string | number | null
    IdPaciente?: string | number | null
    PACIENTE?: string | null
    FECHA_ENVIO?: string | null
    HORA_ENVIO?: string | null
    INTERVALO_TIEMPO?: string | null
    SERVICIOFINAL?: string | null
    IdEspecialidad?: string | number | null
}

export interface PacienteBusqueda {
    IdPaciente: number
    Paciente: string
    Dni: string | null
    Historia: string | number | null
    IdServicio: number | null
    Servicio: string | null
    Cama: string | null
    IdCuentaAtencion: number | null
}

export const pacientesService = {
    getPacientes(servicioId?: string): Promise<PacienteBD[]> {
        const query = servicioId ? `?servicioId=${encodeURIComponent(servicioId)}` : ''
        return request<PacienteBD[]>(`/pacientes${query}`)
    },

    getServicios(): Promise<Servicio[]> {
        return request<Servicio[]>('/servicios')
    },

    buscarPacientes(query: string): Promise<PacienteBusqueda[]> {
        return request<PacienteBusqueda[]>(`/pacientes/buscar?q=${encodeURIComponent(query)}`)
    },

    getPacientesSinCama(nombreServicio?: string): Promise<PacienteSinCama[]> {
        const query = nombreServicio ? `?servicio=${encodeURIComponent(nombreServicio)}` : ''
        return request<PacienteSinCama[]>(`/pacientes-sin-cama${query}`)
    },
}

// ==========================================
// 3. GESTIÓN DE CAMAS Y TRASLADOS
// ==========================================
export interface AsignarCamaPayload {
    IdPaciente: number
    IdCuentaAtencion: number
    IdCama: number
    IdMedicoOrdena?: number | null
}

export interface MoverCamaPayload {
    IdPaciente: number
    IdCama: number
    IdCuentaAtencion: number
}

export interface TransferenciaEstanciaPayload {
    idAtencion: string | number
    idMedicoOrdena?: number | null
    idServicio: string | number
    idDiagnostico?: number | null
    fechaOcupacion: string
    horaOcupacion: string
    idProducto?: string | number
    idEmpleado?: string | number | null
    fechaModificacion?: string
    idPaciente?: string | number
}

export const camasService = {
    asignarCama(payload: AsignarCamaPayload): Promise<{ success: boolean; mensaje?: string }> {
        return request<{ success: boolean; mensaje?: string }>('/asignar-cama', {
            method: 'POST',
            body: JSON.stringify(payload),
        })
    },

    moverCama(payload: MoverCamaPayload): Promise<{ success: boolean; mensaje?: string }> {
        return request<{ success: boolean; mensaje?: string }>('/mover-cama', {
            method: 'POST',
            body: JSON.stringify(payload),
        })
    },

    registrarTransferencia(payload: TransferenciaEstanciaPayload): Promise<{ success: boolean; mensaje?: string }> {
        return request<{ success: boolean; mensaje?: string }>('/transferencia-estancia', {
            method: 'POST',
            body: JSON.stringify(payload),
        })
    },
}

// ==========================================
// 3.5. AUDITORÍA DE CAMAS
// ==========================================
export type AccionAuditoriaCama = 'ASIGNAR' | 'MOVER' | 'TRANSFERIR'

export interface RegistroAuditoriaCama {
    IdAuditoria: number
    FechaHora: string
    Accion: AccionAuditoriaCama | string
    IdCuentaAtencion: number | null
    IdPaciente: number | null
    Paciente: string | null
    IdCama: number | null
    Cama: string | null
    CamaAnterior: string | null
    IdServicio: number | null
    Servicio: string | null
    IdUsuario: number | null
    Usuario: string | null
    Detalle: string | null
    // Nombre completo del enfermero/a que hizo el movimiento (resuelto en el
    // backend desde Empleados). Cae al usuario de login si no se encuentra.
    NombreEnfermero?: string | null
    // Detalle clínico del movimiento (tabla EnfermeriaAuditoriaDetalle).
    // Vacío en los cambios de cama, que no llevan médico ni diagnóstico.
    IdEspecialidad?: number | null
    Especialidad?: string | null
    IdMedicoOrdena?: number | null
    MedicoOrdena?: string | null
    Diagnostico?: string | null
}

export interface FiltrosAuditoriaCamas {
    fechaDesde?: string
    fechaHasta?: string
    servicioId?: string | number
    accion?: string
    usuario?: string
    limit?: number
}

export const auditoriaCamasService = {
    getRegistros(filtros: FiltrosAuditoriaCamas = {}): Promise<RegistroAuditoriaCama[]> {
        const params = new URLSearchParams()
        if (filtros.fechaDesde) params.set('fechaDesde', filtros.fechaDesde)
        if (filtros.fechaHasta) params.set('fechaHasta', filtros.fechaHasta)
        if (filtros.servicioId) params.set('servicioId', String(filtros.servicioId))
        if (filtros.accion) params.set('accion', filtros.accion)
        if (filtros.usuario) params.set('usuario', filtros.usuario)
        if (filtros.limit) params.set('limit', String(filtros.limit))
        const query = params.toString()
        return request<RegistroAuditoriaCama[]>(`/auditoria-camas${query ? `?${query}` : ''}`)
    },
}

// ==========================================
// 4. NOTAS DE ENFERMERÍA Y SIGNOS VITALES
// ==========================================
export const notasService = {
    getNotas(): Promise<NotaEnfermeria[]> {
        return request<NotaEnfermeria[]>('/notas')
    },

    guardarNota(nota: Partial<NotaEnfermeria>): Promise<{ success: boolean; id: string | number; turno?: 'dia' | 'noche'; vitalesRegistrados?: boolean }> {
        return request<{ success: boolean; id: string | number; turno?: 'dia' | 'noche'; vitalesRegistrados?: boolean }>('/notas', {
            method: 'POST',
            body: JSON.stringify(nota),
        })
    },

    eliminarNota(id: string | number): Promise<{ success: boolean }> {
        return request<{ success: boolean }>(`/notas/${id}`, {
            method: 'DELETE',
        })
    },

    getHistorialVitals(idNota: string | number, limit = 10, page = 1): Promise<SignoVitalHistorial[]> {
        return request<SignoVitalHistorial[]>(`/notas/${idNota}/vitals?limit=${limit}&page=${page}`)
    },

    getHistorialVitalsPorAtencion(idCuenta: string | number, limit = 10, page = 1): Promise<SignoVitalHistorial[]> {
        return request<SignoVitalHistorial[]>(`/atenciones/${idCuenta}/vitals?limit=${limit}&page=${page}`)
    },
}

// ==========================================
// 5. DIAGNÓSTICOS Y MÉDICOS
// ==========================================
export interface Medico {
    IdMedico: number
    IdEmpleado: number
    IdEspecialidad: number
    Especialidad?: string
    Medico: string
}

export interface Diagnostico {
    CodigoCIE10: string
    IdDiagnostico: number
    Descripcion: string
    Codigo: string
}

export interface CatalogoNoc {
    id: number
    codigo: string
    resultado: string
    definicion: string | null
    escalaLikert: string | null
}

export interface CatalogoNic {
    id: number
    codigo: string
    intervencion: string
    definicion: string | null
}

export interface NandaConInterrelaciones {
    id: number
    codigo: string
    dominio: string | null
    clase: string | null
    diagnostico: string
    definicion: string | null
    noc: CatalogoNoc[]
    nic: CatalogoNic[]
}

export const catalogosService = {
    getMedicosPorEspecialidad(especialidadId: string | number): Promise<Medico[]> {
        return request<Medico[]>(`/medicos?especialidadId=${encodeURIComponent(especialidadId)}`)
    },

    getDiagnosticosPorCuenta(idCuentaAtencion: string | number): Promise<Diagnostico[]> {
        return request<Diagnostico[]>(`/diagnosticos?idCuentaAtencion=${encodeURIComponent(idCuentaAtencion)}`)
    },

    buscarNandaNocNic(buscar = ''): Promise<NandaConInterrelaciones[]> {
        const query = buscar ? `?buscar=${encodeURIComponent(buscar)}` : ''
        return request<NandaConInterrelaciones[]>(`/catalogos/nanda-noc-nic${query}`)
    },
}
