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
            @edit-draft="handleEditDraft($event, selectedPatient)"
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
          @save="onSaveNote"
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
      @save="onSaveNote"
      @sign="onSignNote"
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
import { ref, computed, onMounted } from 'vue'
import { Menu, X } from 'lucide-vue-next'
import type { Patient, NotaEnfermeria } from '@/types'
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

import { usePatients } from '@/composables/usePatients'
import { useNotes } from '@/composables/useNotes'
import { useBedModals } from '@/composables/useBedModals'
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
} = usePatients()

// 2. Estado y operaciones de Notas de Enfermería
const {
  notas,
  isNewNoteModalOpen,
  patientForNewNote,
  selectedNoteForModal,
  cargarNotasDesdeBackend,
  handleViewNote,
  handleNewNoteFromList,
  handleEditDraft,
  handleCloseModal,
  guardarNota,
  firmarNota,
} = useNotes(pacientes)

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
  await guardarNota(nota)
  successModalType.value = 'nota'
  showSuccessModal.value = true
}

async function onSignNote(nota: NotaEnfermeria) {
  await firmarNota(nota)
  successModalType.value = 'nota'
  showSuccessModal.value = true
}

onMounted(async () => {
  await cargarServicios()

  // Seleccionar Medicina o el primer servicio disponible
  if (servicios.value.length > 0) {
    const servicioMedicina = servicios.value.find(s => s.Nombre.toUpperCase().includes('MEDICINA'))
    const servicioInicial = servicioMedicina || servicios.value[0]
    servicioSeleccionado.value = String(servicioInicial.IdServicio)
    await cargarPacientes(servicioSeleccionado.value)
  }

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
