// Composable para encapsular la navegación y el estado visual del dashboard.
// Esto separa la lógica del componente principal y deja la vista más pequeña,
// fácil de leer y más preparada para crecer con nuevos módulos clínicos.

import { computed, ref, type Ref } from 'vue'
import type { NotaEnfermeria, Patient } from '@/types'

interface UseDashboardParams {
  activeView: Ref<string>
  selectedPatient: Ref<Patient | null>
  pacientes: Ref<Patient[]>
  notas: Ref<NotaEnfermeria[]>
  servicioSeleccionado: Ref<string>
  cargarPacientes: (servicioId: string) => Promise<void>
  refreshPacientesSinCamaToken: Ref<number>
  successModalType: Ref<string>
  showSuccessModal: Ref<boolean>
  handleCloseModal: () => void
}

export function useDashboard({
  activeView,
  selectedPatient,
  pacientes,
  notas,
  servicioSeleccionado,
  cargarPacientes,
  refreshPacientesSinCamaToken,
  successModalType,
  showSuccessModal,
  handleCloseModal,
}: UseDashboardParams) {
  const sidebarOpen = ref(false)
  const empleadoLogueado = ref(
    sessionStorage.getItem('empleadoLogueado') || sessionStorage.getItem('usuarioLogueado') || '',
  )

  const viewTitles: Record<string, string> = {
    pacientes: '',
    notas: 'Notas de Enfermeria',
    'nueva-nota': 'Nueva Nota de Enfermeria',
    vitales: 'Signos Vitales',
  }

  const totalNotesForSelected = computed(() => {
    const patientId = selectedPatient.value?.id
    if (!patientId) return 0
    return notas.value.filter(n => String(n.pacienteId) === String(patientId)).length
  })

  const modalNoteNumber = computed(() => {
    const currentPatient = selectedPatient.value
    if (!currentPatient) return 1

    const patientNotas = notas.value
      .filter(n => String(n.pacienteId) === String(currentPatient.id))
      .sort((a, b) => {
        const dateA = new Date(`${a.fecha}T${a.hora}`)
        const dateB = new Date(`${b.fecha}T${b.hora}`)
        return dateA.getTime() - dateB.getTime()
      })

    const index = patientNotas.findIndex(n => String(n.pacienteId) === String(currentPatient.id))
    return index !== -1 ? index + 1 : Math.max(totalNotesForSelected.value + 1, 1)
  })

  const viewTitle = computed(() => {
    if (activeView.value === 'pacientes' && selectedPatient.value) {
      return `${selectedPatient.value.nombre} ${selectedPatient.value.apellido}`
    }

    if (activeView.value === 'nueva-nota') {
      return `NOTA DE ENFERMERIA NRO ${totalNotesForSelected.value + 1}`
    }

    return viewTitles[activeView.value] || 'Seleccionar Paciente'
  })

  const successModalTitle = computed(() => {
    if (successModalType.value === 'asignacion-cama') return 'SE REGISTRO CORRECTAMENTE'
    if (successModalType.value === 'transferencia') return 'TRANSFERENCIA GUARDADA'
    return 'SE REGISTRO'
  })

  const successModalButtonLabel = computed(() => {
    if (successModalType.value === 'asignacion-cama') return 'SE REGISTRO CORRECTAMENTE'
    return 'ENTENDIDO'
  })

  const successModalCheckOnlyButton = computed(() => {
    return successModalType.value === 'asignacion-cama'
  })

  function handleSelectPatient(patient: Patient) {
    selectedPatient.value = patient
    sidebarOpen.value = false
  }

  function handleChangeView(view: string) {
    activeView.value = view
    sidebarOpen.value = false
  }

  function handleConfirmSuccess() {
    showSuccessModal.value = false

    if (successModalType.value === 'asignacion-cama') {
      cargarPacientes(servicioSeleccionado.value)
      refreshPacientesSinCamaToken.value++
      return
    }

    handleCloseModal()
    if (activeView.value === 'nueva-nota') {
      activeView.value = 'pacientes'
    }
  }

  return {
    sidebarOpen,
    empleadoLogueado,
    totalNotesForSelected,
    modalNoteNumber,
    viewTitle,
    successModalTitle,
    successModalButtonLabel,
    successModalCheckOnlyButton,
    handleSelectPatient,
    handleChangeView,
    handleConfirmSuccess,
  }
}
