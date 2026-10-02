<template>
  <div class="flex h-screen overflow-hidden bg-background">
    <!-- Mobile overlay -->
    <Transition name="fade">
      <div
        v-if="sidebarOpen"
        class="fixed inset-0 z-40 bg-foreground/20 lg:hidden"
        @click="sidebarOpen = false"
      />
    </Transition>

    <!-- Sidebar -->
    <div
      :class="[
        'fixed inset-y-0 left-0 z-50 transform transition-transform duration-200 ease-in-out lg:relative lg:translate-x-0',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      ]"
    >
      <AppSidebar
        :active-view="activeView"
        @change-view="handleChangeView"
      />
    </div>

    <!-- Main Content -->
    <main class="flex flex-1 flex-col overflow-hidden">
      <!-- Top Bar -->
      <header class="flex items-center gap-3 border-b border-border bg-card px-4 py-0 lg:px-6 sticky top-0 z-30">
        <button
          class="flex h-9 w-9 items-center justify-center rounded-md text-card-foreground hover:bg-muted lg:hidden"
          @click="sidebarOpen = !sidebarOpen"
          :aria-label="sidebarOpen ? 'Cerrar menu' : 'Abrir menu'"
        >
          <X v-if="sidebarOpen" class="h-5 w-5" />
          <Menu v-else class="h-5 w-5" />
        </button>
        <div class="flex-1 overflow-hidden">
          <h2 class="text-sm sm:text-[13px] font-black text-slate-800 uppercase tracking-tight truncate leading-none mb-0 mt-0">{{ viewTitle }}</h2>
        </div>
        <div class="hidden sm:block">
          <span class="text-sm font-extrabold text-slate-700 uppercase">Usuario: {{ empleadoLogueado }}</span>
        </div>
      </header>

      <!-- Content Area -->
      <div class="flex-1 overflow-y-auto p-4 lg:p-6 bg-slate-50">
        <!-- Pacientes view -->
        <div v-if="activeView === 'pacientes'" class="grid grid-cols-1 gap-6">
          <PatientListView 
            :pacientes="pacientes" 
            :selected-id="String(selectedPatient?.id)"
            :notas="notas"
            :servicios="servicios"
            :servicio-seleccionado="servicioSeleccionado"
            :refresh-pacientes-sin-cama-token="refreshPacientesSinCamaToken"
            @select="handleSelectPatient" 
            @new-note="handleNewNoteFromList"
            @edit-draft="handleEditDraft"
            @cambio-servicio="cambiarServicio"
            @view-bed="handleViewBed"
            @view-transfer="handleViewTransfer"
            @assign-bed="handleAssignBed"
            @view-total="handleViewTotalBeds"
          >
            <template #inside-list>
              <NotesHistoryPanel
                class="h-full rounded-none border-0 shadow-none"
                :notas="notas"
                :selected-patient="selectedPatient"
                @view-note="handleViewNote"
              />
            </template>
          </PatientListView>
        </div>

        <!-- New note form -->
        <NewNoteForm
          v-if="activeView === 'nueva-nota'"
          :pacientes="pacientes"
          :selected-patient="selectedPatient"
          @save="handleSaveNote"
        />

        <!-- Vitals overview -->
        <VitalsOverview
          v-if="activeView === 'vitales'"
          :pacientes="pacientes"
          :notas="notas"
        />
      </div>
    </main>

    <!-- Modals -->
    <NewNoteModal
      v-if="patientForNewNote"
      :is-open="isNewNoteModalOpen"
      :patient="patientForNewNote"
      :nota="selectedNoteForModal || undefined"
      :note-number="modalNoteNumber"
      @save="handleSaveNote"
      @sign="handleSignNote"
      @close="handleCloseModal"
    />

    <SuccessModal 
      :show="showSuccessModal" 
      :title="successModalTitle"
      :button-label="successModalButtonLabel"
      :check-only-button="successModalCheckOnlyButton"
      @confirm="handleConfirmSuccess" 
    />

    <BedModal
      :is-open="isBedModalOpen"
      :servicio-seleccionado="servicioSeleccionado"
      :id-especialidad="pacienteSinCamaSeleccionado?.IdEspecialidad ?? null"
      :mostrar-medico="!!pacienteSinCamaSeleccionado"
      @close="handleCloseBedModal"
      @select-paciente="handleSelectPaciente"
    />

    <TransferModal
      :is-open="isTransferModalOpen"
      :patient="patientForTransfer"
      :servicios="servicios"
      @close="handleCloseTransferModal"
      @confirm="handleConfirmTransfer"
    />

    <TotalBedsModal
      :is-open="isTotalBedsModalOpen"
      :pacientes="pacientes"
      @close="isTotalBedsModalOpen = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { Menu, X } from 'lucide-vue-next'
import type { Patient, NotaEnfermeria, PacienteBD } from '@/types'
import AppSidebar from '@/components/AppSidebar.vue'
import PatientListView from '@/components/PatientListView.vue'
import NewNoteModal from '@/components/NewNoteModal.vue'
import NewNoteForm from '@/components/NewNoteForm.vue'
import VitalsOverview from '@/components/VitalsOverview.vue'
import SuccessModal from '@/components/SuccessModal.vue'
import BedModal from '@/components/BedModal.vue'
import NotesHistoryPanel from '@/components/NotesHistoryPanel.vue'
import TotalBedsModal from '@/components/TotalBedsModal.vue'
import TransferModal from '@/components/TransferModal.vue'
import { pacientesService, camasService, notasService } from '@/services/api'

interface PacienteSinCama {
  IdCuentaAtencion: string | number | null
  IdPaciente?: string | number | null
  PACIENTE?: string | null
  IdEspecialidad?: string | number | null
}

interface TransferPayload {
  pacienteId: string | number
  servicioDestino: string
  camaPreferida?: string
  motivo?: string
  camaActual?: string
  idMedicoOrdena?: number | null
  idDiagnostico?: number | null
  idCuentaAtencion?: string | number
  fechaOcupacion?: string
  horaOcupacion?: string
  idServicio?: string | number
  idProducto?: string | number
  idEmpleado?: string | number | null
  fechaModificacion?: string
  idPaciente?: string | number
}

const pacientes = ref<Patient[]>([])
const notas = ref<NotaEnfermeria[]>([])
const selectedPatient = ref<Patient | null>(null)

// Bed modal state
const isBedModalOpen = ref(false)
const selectedPatientForBed = ref<Patient | null>(null)
const pacienteSinCamaSeleccionado = ref<PacienteSinCama | null>(null)
const isTotalBedsModalOpen = ref(false)
const isTransferModalOpen = ref(false)
const patientForTransfer = ref<Patient | null>(null)
const refreshPacientesSinCamaToken = ref(0)
let autoRefreshInterval: number | null = null
const AUTO_REFRESH_ENABLED = false

// Handle view-bed event from PatientListView
function handleViewBed(patient: Patient) {
  selectedPatientForBed.value = patient
  pacienteSinCamaSeleccionado.value = null
  isBedModalOpen.value = true
}

function handleAssignBed(pacienteSinCama: PacienteSinCama) {
  pacienteSinCamaSeleccionado.value = pacienteSinCama
  isBedModalOpen.value = true
}

function handleViewTotalBeds() {
  isTotalBedsModalOpen.value = true
}

function handleViewTransfer(patient: Patient) {
  patientForTransfer.value = patient
  isTransferModalOpen.value = true
}

function handleCloseBedModal() {
  pacienteSinCamaSeleccionado.value = null
  selectedPatientForBed.value = null
  isBedModalOpen.value = false
}

function handleCloseTransferModal() {
  patientForTransfer.value = null
  isTransferModalOpen.value = false
}

// Handle paciente selection - select the patient from the list
async function handleSelectPaciente(paciente: Patient) {
  const idCama = Number(paciente.id)

  if (!Number.isFinite(idCama)) {
    console.error('IdCama invÃ¡lido', { idCama })
    return
  }

  try {
    let data: { success: boolean; mensaje?: string }

    if (pacienteSinCamaSeleccionado.value) {
      const idPaciente = Number(pacienteSinCamaSeleccionado.value.IdPaciente)
      const idCuentaAtencion = Number(pacienteSinCamaSeleccionado.value.IdCuentaAtencion)
      const idMedico = (paciente as any).idMedicoOrdena ? Number((paciente as any).idMedicoOrdena) : null

      if (!Number.isFinite(idPaciente) || !Number.isFinite(idCuentaAtencion)) {
        console.error('IDs inválidos para asignar cama', { idCama, idPaciente, idCuentaAtencion })
        return
      }

      data = await camasService.asignarCama({
        IdPaciente: idPaciente,
        IdCuentaAtencion: idCuentaAtencion,
        IdCama: idCama,
        IdMedicoOrdena: idMedico
      })
    } else if (selectedPatientForBed.value) {
      const idPaciente = Number(selectedPatientForBed.value.id)
      const idCuentaAtencion = Number(selectedPatientForBed.value.numCuenta)
      if (!Number.isFinite(idPaciente)) {
        console.error('IdPaciente inválido para mover cama', { idPaciente })
        return
      }
      if (!Number.isFinite(idCuentaAtencion)) {
        console.error('IdCuentaAtencion inválido para mover cama', { idCuentaAtencion })
        return
      }

      data = await camasService.moverCama({
        IdPaciente: idPaciente,
        IdCama: idCama,
        IdCuentaAtencion: idCuentaAtencion
      })
    } else {
      isBedModalOpen.value = false
      return
    }

    if (!data?.success) {
      throw new Error(data?.mensaje || 'Error en la operación de cama')
    }

    await cargarPacientes(servicioSeleccionado.value)
    successModalType.value = 'asignacion-cama'
    showSuccessModal.value = true
  } catch (error) {
    console.error('Error asignando cama:', error)
    alert('No se pudo guardar el cambio de cama. Verifique los datos e intente nuevamente.')
  } finally {
    pacienteSinCamaSeleccionado.value = null
    selectedPatientForBed.value = null
    isBedModalOpen.value = false
  }
}

function handleConfirmTransfer(payload: TransferPayload) {
  console.log('Transferencia solicitada', payload)
  handleCloseTransferModal()
  const {
    idCuentaAtencion,
    idMedicoOrdena,
    idServicio,
    idDiagnostico,
    fechaOcupacion,
    horaOcupacion,
    idProducto,
    idEmpleado,
    fechaModificacion,
    idPaciente
  } = payload

  const pacienteIdEfectivo = idPaciente ?? payload.pacienteId

  if (!idCuentaAtencion || !idServicio || !fechaOcupacion || !horaOcupacion) {
    console.error('Datos incompletos para registrar transferencia', payload)
    return
  }

  camasService.registrarTransferencia({
    idAtencion: idCuentaAtencion,
    idMedicoOrdena,
    idServicio,
    idDiagnostico,
    fechaOcupacion,
    horaOcupacion,
    idProducto,
    idEmpleado: idEmpleado || sessionStorage.getItem('idEmpleado'),
    fechaModificacion: fechaModificacion || fechaOcupacion,
    idPaciente: pacienteIdEfectivo
  })
    .then(data => {
      if (!data?.success) throw new Error(data?.mensaje || 'Error al registrar transferencia')
      console.log('Transferencia registrada')
      successModalType.value = 'transferencia'
      showSuccessModal.value = true
      cargarPacientes(servicioSeleccionado.value)
    })
    .catch(err => {
      console.error('Error guardando transferencia', err)
      alert('No se pudo guardar la transferencia.')
    })
}

// Servicios para filtro
const servicios = ref<{IdServicio: number, Nombre: string}[]>([])
const servicioSeleccionado = ref<string>('')

// FunciÃƒÂ³n para limpiar notas con pacienteId invÃƒÂ¡lido
function limpiarNotasInvalidas() {
  const notasIniciales = notas.value
  const notasValidas = notasIniciales.filter(n => 
    n.pacienteId && 
    n.pacienteId !== 'undefined' && 
    n.pacienteId !== 'null' &&
    n.pacienteId !== '' &&
    n.pacienteId !== null
  )
  
  if (notasValidas.length !== notasIniciales.length) {
    console.warn(`Se eliminaron ${notasIniciales.length - notasValidas.length} notas con pacienteId invÃƒÂ¡lido`)
    notas.value = notasValidas
    // TambiÃƒÂ©n guardar en sessionStorage
    sessionStorage.setItem('notasEnfermeria', JSON.stringify(notasValidas))
  }
}
const isLoadingPacientes = ref(true)
const errorPacientes = ref<string | null>(null)

// FunciÃƒÂ³n para convertir datos de BD al formato Patient
function convertirPacienteBD(pacienteBD: PacienteBD): Patient {
  // Usar IdPaciente si existe, sino usar IdCuentaAtencion como fallback
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

// Cargar pacientes desde el backend
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
    
    console.log('Cargando pacientes para servicio:', servicioId)
    const data: PacienteBD[] = await pacientesService.getPacientes(servicioId)
    
    // Debug: mostrar servicios únicos recibidos
    const serviciosRecibidos = Array.from(new Set(data.map(p => p.Nombre)))
    console.log('Pacientes recibidos:', data.length, 'Servicios:', serviciosRecibidos)
    
    // Convertir los datos de la BD al formato Patient
    pacientes.value = data.map(convertirPacienteBD)
    
    // Seleccionar el primer paciente si hay pacientes
    if (pacientes.value.length > 0) {
      selectedPatient.value = pacientes.value[0]
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

// Cargar pacientes al iniciar
async function cargarNotasDesdeBackend() {
  try {
    const notasBD = await notasService.getNotas()
    notas.value = notasBD || []
    // Limpiar sessionStorage para evitar datos antiguos
    sessionStorage.setItem('notasEnfermeria', JSON.stringify(notas.value))
    console.log('Notas cargadas desde BD:', notasBD?.length || 0)
    return true
  } catch (err) {
    console.error('Error cargando notas desde BD:', err)
    return false
  }
}

// Cargar servicios desde el backend
async function cargarServicios() {
  try {
    const data = await pacientesService.getServicios()
    servicios.value = data || []
    console.log('Servicios cargados:', servicios.value.length)
  } catch (err) {
    console.error('Error cargando servicios:', err)
  }
}

// FunciÃƒÂ³n para cambiar el servicio seleccionado
function cambiarServicio(servicioId: string) {
  console.log('Cambiando servicio a:', servicioId)
  servicioSeleccionado.value = servicioId
  cargarPacientes(servicioId)
}

onMounted(async () => {
  // Cargar servicios
  await cargarServicios()
  
  // Cargar notas desde el backend (si no hay notas, ÃÂ±Ã‘Æ’ÃÂ´ÃÂµÃ‘â€š ÃÂ¿Ã‘Æ’Ã‘ÂÃ‘â€šÃÂ¾ÃÂ¹ ÃÂ¼ÃÂ°Ã‘ÂÃ‘ÂÃÂ¸ÃÂ²)
  await cargarNotasDesdeBackend()
  
  pacientes.value = []
  selectedPatient.value = null

  // Auto-refresh (pausado por ahora)
  if (AUTO_REFRESH_ENABLED) {
    autoRefreshInterval = window.setInterval(() => {
      const scrollY = window.scrollY
      cargarPacientes(servicioSeleccionado.value).finally(() => {
        window.scrollTo(0, scrollY)
      })
    }, 5000)
  }
})

onBeforeUnmount(() => {
  if (autoRefreshInterval !== null) {
    clearInterval(autoRefreshInterval)
    autoRefreshInterval = null
  }
})
const activeView = ref('pacientes') // Changed default back to patients for better UX after login
const sidebarOpen = ref(false)

// --- MODAL STATE (Unified New/Edit) ---
const isNewNoteModalOpen = ref(false)
const patientForNewNote = ref<Patient | null>(null)
const selectedNoteForModal = ref<NotaEnfermeria | null>(null)
const showSuccessModal = ref(false)
const successModalType = ref<'nota' | 'asignacion-cama' | 'transferencia'>('nota')
const empleadoLogueado = ref(sessionStorage.getItem('empleadoLogueado') || sessionStorage.getItem('usuarioLogueado') || '')

const successModalTitle = computed(() => {
  return successModalType.value === 'asignacion-cama'
    ? 'SE REGISTRO CORRECTAMENTE'
    : successModalType.value === 'transferencia'
      ? 'TRANSFERENCIA GUARDADA'
      : 'SE REGISTRO'
})

const successModalButtonLabel = computed(() => {
  return successModalType.value === 'asignacion-cama'
    ? 'SE REGISTRO CORRECTAMENTE'
    : 'ENTENDIDO'
})

const successModalCheckOnlyButton = computed(() => {
  return successModalType.value === 'asignacion-cama'
})

function handleViewNote(nota: NotaEnfermeria) {
  const patient = pacientes.value.find(p => 
    String(p.id) === String(nota.pacienteId) || 
    (p.numCuenta && String(p.numCuenta) === String(nota.pacienteId)) ||
    (p.numCuenta && String(p.numCuenta) === String((nota as any).idCuenta))
  )
  if (patient) {
    patientForNewNote.value = patient
    selectedNoteForModal.value = nota
    isNewNoteModalOpen.value = true
  } else if (selectedPatient.value) {
    // Si no lo encuentra en la lista global, usa el paciente actualmente seleccionado
    patientForNewNote.value = selectedPatient.value
    selectedNoteForModal.value = nota
    isNewNoteModalOpen.value = true
  }
}
function handleNewNoteFromList(patient: Patient) {
  selectedNoteForModal.value = null
  patientForNewNote.value = patient
  isNewNoteModalOpen.value = true
}

function handleEditDraft(nota: NotaEnfermeria) {
  const patient = pacientes.value.find(p => 
    String(p.id) === String(nota.pacienteId) || 
    (p.numCuenta && String(p.numCuenta) === String(nota.pacienteId)) ||
    (p.numCuenta && String(p.numCuenta) === String((nota as any).idCuenta))
  )
  if (patient) {
    patientForNewNote.value = patient
    selectedNoteForModal.value = nota
    isNewNoteModalOpen.value = true
  } else if (selectedPatient.value) {
    patientForNewNote.value = selectedPatient.value
    selectedNoteForModal.value = nota
    isNewNoteModalOpen.value = true
  }
}

function handleCloseModal() {
  isNewNoteModalOpen.value = false
  selectedNoteForModal.value = null
}

const viewTitles: Record<string, string> = {
  pacientes: '',
  notas: 'Notas de Enfermeria',
  'nueva-nota': 'Nueva Nota de Enfermeria',
  vitales: 'Signos Vitales',
}

const totalNotesForSelected = computed(() => {
  const patientId = patientForNewNote.value?.id || selectedPatient.value?.id
  if (!patientId) return 0
  return notas.value.filter(n => String(n.pacienteId) === String(patientId)).length
})

const modalNoteNumber = computed(() => {
  if (selectedNoteForModal.value) {
    // We need to find the absolute position of this note in the patient's history
    const patientNotas = notas.value
      .filter(n => String(n.pacienteId) === String(selectedNoteForModal.value?.pacienteId))
      .sort((a, b) => {
        const dateA = new Date(`${a.fecha}T${a.hora}`)
        const dateB = new Date(`${b.fecha}T${b.hora}`)
        return dateA.getTime() - dateB.getTime()
      })
    
    const index = patientNotas.findIndex(n => n.id === selectedNoteForModal.value?.id)
    return index !== -1 ? index + 1 : 0
  }
  return totalNotesForSelected.value + 1
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

const currentDate = computed(() =>
  new Date().toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
)

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

  isNewNoteModalOpen.value = false
  if (activeView.value === 'nueva-nota') {
    activeView.value = 'pacientes'
  }
}

function handleSaveNote(nota: NotaEnfermeria) {
  // Validar que la nota tenga un pacienteId vÃƒÂ¡lido
  const pid = nota.pacienteId
  if (!pid || pid === 'undefined' || pid === 'null' || pid === '') {
    console.error('No se puede guardar: la nota no tiene pacienteId vÃƒÂ¡lido', pid)
    return
  }
  
  // Actualizar estado local
  const index = notas.value.findIndex(n => n.id === nota.id)
  if (index !== -1) {
    const newNotas = [...notas.value]
    newNotas[index] = nota
    notas.value = newNotas
  } else {
    notas.value = [nota, ...notas.value]
  }
  
  // Preparar payload con idCuenta y idEmpleado
  const patient = pacientes.value.find(p => String(p.id) === String(nota.pacienteId))
  const payload = {
    ...nota,
    idCuenta: patient?.numCuenta || '',
    idEmpleado: sessionStorage.getItem('idEmpleado') || ''
  }

  // Guardar en el backend
  notasService.guardarNota(payload)
    .then(data => {
      if (data.success && data.id) {
        console.log('Nota guardada correctamente en BD con ID:', data.id)
        // Buscar la nota por su ID temporal (o el anterior) y actualizarla con el ID real de la BD
        const idx = notas.value.findIndex(n => n.id === nota.id)
        if (idx !== -1) {
          notas.value[idx].id = String(data.id)
        }
      } else if (!data.success) {
        console.error('Error al guardar nota')
      }
    })
    .catch(err => console.error('Error guardando nota en BD:', err))
  
  // Mantener el modal abierto; se cierra cuando el usuario confirme "Entendido"
  successModalType.value = 'nota'
  showSuccessModal.value = true
}

function handleSignNote(nota: NotaEnfermeria) {
  const now = new Date()
  const fechaFirmada = now.toISOString().split('T')[0]
  const horaFirmada = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
  handleSaveNote({ ...nota, isFirmada: true, fechaFirmada, horaFirmada })
}
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>



