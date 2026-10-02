import { ref } from 'vue'
import type { Patient, PacienteBD } from '@/types'
import { pacientesService, type Servicio } from '@/services/api'

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

    return {
      id: pacienteId,
      idEspecialidad: pacienteBD.IdEspecialidad ? String(pacienteBD.IdEspecialidad) : '',
      idProducto: pacienteBD.IdProducto ? String(pacienteBD.IdProducto) : '',
      nombre: pacienteBD.Pacientes?.split(' ')[0] || '',
      apellido: pacienteBD.Pacientes || '',
      edad,
      edadDescripcion,
      genero: 'M' as 'M' | 'F',
      dni: '',
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
    if (!servicioId || servicioId === 'todos') {
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
  }
}
