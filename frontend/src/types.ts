export interface Patient {
  id: string
  idEspecialidad?: string
  idProducto?: string
  nombre: string
  apellido: string
  edad: number
  edadDescripcion?: string
  genero: 'M' | 'F'
  dni: string
  numCuenta: string
  historiaClinica: string
  servicio: string
  medico: string
  idMedico?: number | null
  idMedicoOrdena?: number | null
  financiamiento: string
  habitacion: string
  cama: string
  diagnostico: string
  fechaIngreso: string
  estado: 'estable' | 'observacion' | 'critico' | 'alta'
}

// Interface para paciente desde la base de datos real
export interface PacienteBD {
  IdCama?: number | null
  IdCuentaAtencion: string | null
  IdEspecialidad?: number | null
  IdProducto?: number | null
  Codigo: string
  EstadoCama: string
  TipoCama: string
  Pacientes: string
  NroHistoriaClinica: string
  Nombre: string
  Edad?: number | null
  TipoEdad?: string | null
  IdPaciente: number
}

export interface SignosVitales {
  temperatura: string
  presionArterial?: string
  frecuenciaCardiaca?: string
  frecuenciaRespiratoria?: string
  saturacionOxigeno: string
  glucosa?: string
  peso?: string
  talla?: string
  pCefalico?: string
  pAbdominal?: string
  hemoglobina?: string
  hemoglucotest?: string
}

export interface PlanCuidadoNota {
  idNANDA: number
  codigoNANDA: string
  diagnostico: string
  nocIds: number[]
  nicIds: number[]
  noc?: Array<{
    id: number
    codigo: string
    resultado: string
    escalaLikert?: string | null
  }>
  nic?: Array<{
    id: number
    codigo: string
    intervencion: string
  }>
}

export interface NotaEnfermeria {
  id: string
  pacienteId: string
  idCuenta?: string
  fecha: string
  hora: string
  turno: 'dia' | 'noche' | 'manana' | 'tarde' // <-- Cambiar esta línea
  tipo: 'valoracion' | 'evolucion' | 'medicacion' | 'procedimiento' | 'incidencia'
  signosVitales?: SignosVitales
  planCuidados?: PlanCuidadoNota[]
  subjetivo: string
  objetivo: string
  analisis: string
  plan: string
  intervencion: string
  evaluacion: string
  antecedentes?: string
  diagnosticos?: string
  farmacia?: string
  laboratorio?: string
  imagen?: string
  enfermera: string
  isFirmada?: boolean
  fechaFirmada?: string
  horaFirmada?: string
  idEmpleado?: string | number | null
}