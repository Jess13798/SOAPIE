export interface Patient {
  id: string
  idEspecialidad?: string
  idProducto?: string
  nombreCompleto?: string
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
  tipoCama?: string
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
  comentario?: string
  nocIds: number[]
  nicIds: number[]
  // Estado de ejecución de cada NIC planificada.
  //   nicRealizadasIds  → NIC ejecutadas.
  //   nicNoRealizadas   → NIC no ejecutadas, con el motivo (puede ir vacío).
  // Un NIC planificado que no aparezca en ninguna de las dos queda "sin registrar".
  // El backend los persiste en dbo.NotaEnfermeriaPlanNIC (Realizada / Motivo) y
  // también viajan dentro del texto de la nota como respaldo legible.
  nicRealizadasIds?: number[]
  nicNoRealizadas?: Record<number, string>
  nocMetas?: Record<number, string>
  nocEvaluaciones?: Record<number, string>

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

export interface SignoVitalHistorial {
  IdSignoVital: string | number
  Fecha_Hora: string
  Peso?: string | number | null
  Talla?: string | number | null
  P_Cefalico?: string | number | null
  P_Abdominal?: string | number | null
  Hemoglucotest?: string | number | null
  Presion_Arterial?: string | null
  Frec_Cardiaca?: string | number | null
  Frec_Respiratoria?: string | number | null
  Temperatura?: string | number | null
  Saturacion?: string | number | null
  IdEmpleado?: string | number | null
  NombreEmpleado?: string | null
  TotalCount?: number
}

export interface NotaEnfermeria {
  id: string
  pacienteId: string
  idCuenta?: string
  servicioId?: number | null
  servicio?: string
  fecha: string
  hora: string
  turno: 'dia' | 'noche'
  tipo: 'valoracion' | 'evolucion' | 'medicacion' | 'procedimiento' | 'incidencia'
  signosVitales?: SignosVitales
  planCuidados?: PlanCuidadoNota[]
  estadoGuardado?: 'guardada' | 'temporal' | 'cambios-pendientes'
  historialTemporalSignosVitales?: SignoVitalHistorial[]
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