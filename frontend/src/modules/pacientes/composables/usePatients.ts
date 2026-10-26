import { ref } from 'vue'
import type { Patient, PacienteBD } from '@/types'
import { pacientesService, type PacienteBusqueda, type Servicio } from '@/services/api'

export function usePatients() {
  const pacientes = ref<Patient[]>([])
  const selectedPatient = ref<Patient | null>(null)
  const servicios = ref<Servicio[]>([])
  const servicioSeleccionado = ref<string>('')
  const isLoadingPacientes = ref(false)
  const errorPacientes = ref<string | null>(null)

  function convertirPacienteBD(pacienteBD: PacienteBD): Patient {
    const pacienteId = pacienteBD.IdPaciente ? String(pacienteBD.IdPaciente) : (pacienteBD.IdCuentaAtencion || '')
    const edadNum = Number(pacienteBD.Edad)
    const edad = Number.isFinite(edadNum) ? edadNum : 0
    const edadDescripcion = (pacienteBD.TipoEdad || '').toString().trim()
    const nombreCompleto = (pacienteBD.Pacientes || '').trim()

    return {
      id: pacienteId,
      idEspecialidad: pacienteBD.IdEspecialidad ? String(pacienteBD.IdEspecialidad) : '',
      idProducto: pacienteBD.IdProducto ? String(pacienteBD.IdProducto) : '',
      nombreCompleto,
      nombre: nombreCompleto.split(/\s+/)[0] || '',
      apellido: nombreCompleto,
      edad,
      edadDescripcion,
      genero: 'M' as 'M' | 'F',
      dni: pacienteBD.Dni || '',
      numCuenta: pacienteBD.IdCuentaAtencion || '',
      historiaClinica: pacienteBD.NroHistoriaClinica || '',
      servicio: pacienteBD.Nombre || '',
      medico: '',
      financiamiento: 'ESTRATEGIA',
      habitacion: pacienteBD.Codigo || '',
      cama: '',
      diagnostico: '',
      fechaIngreso: new Date().toISOString().split('T')[0],
      estado: 'estable',
    }
  }

  async function cargarPacientes(servicioId: string = '') {
    // Sin servicio seleccionado: lista vacía (el usuario elige desde el buscador).
    // Con un servicio concreto se consulta al backend.
    if (!servicioId) {
      pacientes.value = []
      selectedPatient.value = null
      isLoadingPacientes.value = false
      return
    }

    try {
      isLoadingPacientes.value = true
      errorPacientes.value = null

      const data: PacienteBD[] = await pacientesService.getPacientes(servicioId)
      pacientes.value = data.map(convertirPacienteBD)

      if (pacientes.value.length > 0) {
        selectedPatient.value = pacientes.value[0]
      } else {
        selectedPatient.value = null
      }
    } catch (err: any) {
      console.error('Error cargando pacientes:', err)
      errorPacientes.value = err.message || 'Error al conectar con el servidor'
      pacientes.value = []
      selectedPatient.value = null
    } finally {
      isLoadingPacientes.value = false
    }
  }

  async function cargarServicios() {
    try {
      const data = await pacientesService.getServicios()
      servicios.value = data || []
    } catch (err) {
      console.error('Error cargando servicios:', err)
    }
  }

  function cambiarServicio(servicioId: string) {
    servicioSeleccionado.value = servicioId
    cargarPacientes(servicioId)
  }

  // Selecciona un paciente encontrado con el buscador global:
  // cambia al servicio donde está y lo marca como paciente seleccionado.
  async function seleccionarPacienteGlobal(paciente: PacienteBusqueda) {
    const servicioId = paciente.IdServicio ? String(paciente.IdServicio) : ''
    if (!servicioId) return

    servicioSeleccionado.value = servicioId
    await cargarPacientes(servicioId)

    const encontrado = pacientes.value.find((p) =>
      String(p.id) === String(paciente.IdPaciente) ||
      (paciente.IdCuentaAtencion != null && String(p.numCuenta) === String(paciente.IdCuentaAtencion))
    )
    if (encontrado) selectedPatient.value = encontrado
  }

  return {
    pacientes,
    selectedPatient,
    servicios,
    servicioSeleccionado,
    isLoadingPacientes,
    errorPacientes,
    cargarPacientes,
    cargarServicios,
    cambiarServicio,
    seleccionarPacienteGlobal,
  }
}
