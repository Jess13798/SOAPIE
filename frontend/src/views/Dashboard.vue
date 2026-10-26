<template>
  <div class="flex h-screen overflow-hidden bg-background">
    <div
      v-if="notaError"
      role="alert"
      class="fixed right-4 top-4 z-[200] flex max-w-lg items-start gap-3 rounded-lg border border-red-300 bg-red-50 p-4 text-sm font-medium text-red-900 shadow-xl"
    >
      <span class="flex-1">{{ notaError }}</span>
      <button type="button" class="font-black text-red-700" aria-label="Cerrar error" @click="notaError = ''">×</button>
    </div>

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
            @buscar-paciente="handleBuscarPaciente" 
            @new-note="handleNewNoteFromList"
            @edit-draft="handleEditDraft($event, selectedPatient)"
            @cambio-servicio="cambiarServicio"
            @view-bed="handleViewBed"
            @view-transfer="handleViewTransfer"
            @view-vitals-history="handleViewVitalsHistory"
            @assign-bed="handleAssignBed"
            @view-total="handleViewTotalBeds"
          >
            <template #inside-list>
              <NotesHistoryPanel
                class="h-full rounded-none border-0 shadow-none"
                :notas="notas"
                :selected-patient="selectedPatient"
                :servicio-id="servicioSeleccionado"
                @view-note="handleViewNote($event, selectedPatient)"
              />
            </template>
          </PatientListView>
        </div>

        <!-- New note form -->
        <NewNoteForm
          v-if="activeView === 'nueva-nota'"
          :pacientes="pacientes"
          :selected-patient="selectedPatient"
          :nota-anterior="notaAnteriorSeleccionada"
          :campos-obligatorios="camposObligatoriosVitales"
          @save="onSaveNote"
        />

        <!-- Vitals overview -->
        <VitalsOverview
          v-if="activeView === 'vitales'"
          :pacientes="pacientes"
          :notas="notas"
        />

        <NandaNocNicView v-if="activeView === 'catalogos-nanda'" />

        <AuditoriaCamasView
          v-if="activeView === 'auditoria-camas'"
          :servicios="servicios"
        />
      </div>
    </main>

    <!-- Modals -->
    <NewNoteModal
      v-if="patientForNewNote"
      :is-open="isNewNoteModalOpen"
      :patient="patientForNewNote"
      :nota="selectedNoteForModal || undefined"
      :nota-anterior="notaAnteriorPacienteSeleccionado"
      :campos-obligatorios="camposObligatoriosVitales"
      :note-number="modalNoteNumber"
      :is-submitting="isSavingNote"
      @save="onSaveNote"
      @sign="onSignNote"
      @close="handleCloseModal"
    />

    <VitalsHistoryModal
      :is-open="isVitalsHistoryOpen"
      :id-cuenta="patientForVitalsHistory?.numCuenta || ''"
      @close="isVitalsHistoryOpen = false"
    />

    <SuccessModal 
      :show="showSuccessModal" 
      :title="successModalTitle"
      :button-label="successModalButtonLabel"
      :check-only-button="successModalCheckOnlyButton"
      :warning="successModalType === 'nota-temporal' || successModalType === 'nota-pendiente'"
      :warning-message="successModalType === 'nota-pendiente'
        ? 'La versión anterior de esta nota sigue en la base de datos. Los cambios pendientes solo están en la memoria de esta sesión y se perderán al cerrar o recargar.'
        : undefined"
      :info-message="successModalType === 'nota-editada-sin-toma'
        ? 'Los cambios SOAPIE se guardaron. No se agregó una nueva toma porque los signos vitales no cambiaron.'
        : undefined"
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
import { ref, computed, onMounted } from 'vue'
import { Menu, X } from 'lucide-vue-next'
import type { Patient, NotaEnfermeria } from '@/types'
import type { PacienteBusqueda } from '@/services/api'
import AppSidebar from '@/components/AppSidebar.vue'
import NandaNocNicView from '@/components/NandaNocNicView.vue'
import AuditoriaCamasView from '@/modules/auditoria/components/AuditoriaCamasView.vue'
import SuccessModal from '@/components/SuccessModal.vue'
import PatientListView from '@/modules/pacientes/components/PatientListView.vue'
import BedModal from '@/modules/pacientes/components/BedModal.vue'
import TotalBedsModal from '@/modules/pacientes/components/TotalBedsModal.vue'
import TransferModal from '@/modules/pacientes/components/TransferModal.vue'
import NewNoteModal from '@/modules/notas/components/NewNoteModal.vue'
import NewNoteForm from '@/modules/notas/components/NewNoteForm.vue'
import NotesHistoryPanel from '@/modules/notas/components/NotesHistoryPanel.vue'
import VitalsHistoryModal from '@/modules/vitales/components/VitalsHistoryModal.vue'
import VitalsOverview from '@/modules/vitales/components/VitalsOverview.vue'

import { usePatients } from '@/modules/pacientes/composables/usePatients'
import { useBedModals } from '@/modules/pacientes/composables/useBedModals'
import { useNotes } from '@/modules/notas/composables/useNotes'
import { useDashboard } from '@/composables/useDashboard'

// 1. Estado y operaciones de Pacientes y Servicios
const {
  pacientes,
  selectedPatient,
  servicios,
  servicioSeleccionado,
  cargarPacientes,
  cargarServicios,
  cambiarServicio,
  seleccionarPacienteGlobal,
} = usePatients()

// 2. Estado y operaciones de Notas de Enfermería
const {
  notas,
  camposObligatoriosVitales,
  isNewNoteModalOpen,
  patientForNewNote,
  selectedNoteForModal,
  cargarNotasDesdeBackend,
  handleViewNote,
  handleNewNoteFromList,
  handleEditDraft,
  handleCloseModal,
  ultimaNotaDePaciente,
  guardarNota,
  firmarNota,
} = useNotes(pacientes, servicioSeleccionado)

// Plan de cuidados heredado: al crear una nota nueva se precargan los
// diagnósticos NOC/NIC de la última nota del paciente (el formulario lo ignora
// cuando se está editando una nota existente).
const notaAnteriorPacienteSeleccionado = computed(() =>
  selectedNoteForModal.value ? null : ultimaNotaDePaciente(patientForNewNote.value),
)
const notaAnteriorSeleccionada = computed(() =>
  selectedPatient.value ? ultimaNotaDePaciente(selectedPatient.value) : null,
)

// 3. Modales de Camas y Transferencias
const {
  isBedModalOpen,
  isTotalBedsModalOpen,
  isTransferModalOpen,
  pacienteSinCamaSeleccionado,
  patientForTransfer,
  refreshPacientesSinCamaToken,
  showSuccessModal,
  successModalType,
  handleViewBed,
  handleAssignBed,
  handleViewTotalBeds,
  handleViewTransfer,
  handleCloseBedModal,
  handleCloseTransferModal,
  handleSelectPaciente,
  handleConfirmTransfer,
} = useBedModals(cargarPacientes, servicioSeleccionado)

// 4. Estado de Navegación y UI
const activeView = ref('pacientes')
const notaError = ref('')
const isSavingNote = ref(false)
const patientForVitalsHistory = ref<Patient | null>(null)
const isVitalsHistoryOpen = ref(false)

function handleViewVitalsHistory(patient: Patient) {
  patientForVitalsHistory.value = patient
  isVitalsHistoryOpen.value = true
}
const {
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
} = useDashboard({
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
})

async function onSaveNote(nota: NotaEnfermeria) {
  if (isSavingNote.value) return
  isSavingNote.value = true
  notaError.value = ''
  try {
    const result = await guardarNota(nota)
    if (!result.success) {
      notaError.value = result.error instanceof Error ? result.error.message : 'No se pudo guardar la nota SOAPIE.'
      return
    }
    successModalType.value = result.persisted === false
      ? (/^\d+$/.test(nota.id) ? 'nota-pendiente' : 'nota-temporal')
      : result.vitalesRegistrados === false && /^\d+$/.test(nota.id)
        ? 'nota-editada-sin-toma'
        : 'nota'
    showSuccessModal.value = true
  } catch (error) {
    notaError.value = error instanceof Error ? error.message : 'No se pudo guardar la nota SOAPIE.'
  } finally {
    isSavingNote.value = false
  }
}

async function onSignNote(nota: NotaEnfermeria) {
  if (isSavingNote.value) return
  isSavingNote.value = true
  notaError.value = ''
  try {
    const result = await firmarNota(nota)
    if (!result.success) {
      notaError.value = result.error instanceof Error ? result.error.message : 'No se pudo firmar la nota SOAPIE.'
      return
    }
    successModalType.value = result.persisted === false
      ? (/^\d+$/.test(nota.id) ? 'nota-pendiente' : 'nota-temporal')
      : result.vitalesRegistrados === false && /^\d+$/.test(nota.id)
        ? 'nota-editada-sin-toma'
        : 'nota'
    showSuccessModal.value = true
  } catch (error) {
    notaError.value = error instanceof Error ? error.message : 'No se pudo firmar la nota SOAPIE.'
  } finally {
    isSavingNote.value = false
  }
}

async function handleBuscarPaciente(paciente: PacienteBusqueda) {
  activeView.value = 'pacientes'
  await seleccionarPacienteGlobal(paciente)
}

onMounted(async () => {
  await cargarServicios()

  // Sin servicio preseleccionado: el usuario elige desde el buscador.
  // La lista de pacientes se carga al seleccionar un servicio.
  await cargarNotasDesdeBackend()
})
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
