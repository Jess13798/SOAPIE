<template>
  <div class="flex flex-col gap-4">
    <!-- Tabla de Pacientes Sin Cama (Subcomponente extraído) -->
    <PacientesSinCamaTable
      :pacientes-sin-cama="pacientesSinCama"
      :loading="loadingPacientesSinCama"
      :servicios="props.servicios"
      :servicio-seleccionado="props.servicioSeleccionado"
      :search-query="searchQuery"
      @update:search-query="searchQuery = $event"
      @assign-bed="$emit('assign-bed', $event)"
      @cambio-servicio="$emit('cambio-servicio', $event)"
    />

    <!-- Contenedor Lista de Pacientes con Cama -->
    <div class="rounded-lg border border-slate-200 bg-white shadow-sm overflow-visible">
      <!-- Header con Estadísticas (Subcomponente extraído) -->
      <BedCountersHeader
        title="Lista de Pacientes"
        :total="totalCamas"
        :ocupadas="camasOcupadas"
        :disponibles="camasDisponibles"
        @view-total="$emit('view-total')"
      />

      <div
        :class="[
          'grid grid-cols-1',
          $slots['inside-list'] ? 'xl:grid-cols-[280px_minmax(0,1fr)]' : ''
        ]"
      >
        <div v-if="$slots['inside-list']" class="border-b border-slate-100 bg-white xl:border-b-0 xl:border-r xl:border-slate-100">
          <slot name="inside-list" />
        </div>
        <div class="min-w-0 self-start w-full">
          <!-- Table -->
          <div class="overflow-x-auto">
            <table class="w-full table-fixed text-left border-collapse">
              <colgroup>
                <col class="w-[16%]" />
                <col class="w-[29%]" />
                <col class="w-[13%]" />
                <col class="w-[24%]" />
                <col class="w-[9%]" />
                <col class="w-[9%]" />
              </colgroup>
              <thead>
                <tr class="bg-sky-700 border-b border-sky-700">
                  <th class="bg-sky-700 px-6 py-2 text-[10px] font-bold text-white uppercase tracking-wider">
                    <div class="flex items-center gap-1 cursor-pointer hover:text-white/90">
                      Cama / Cuenta <ChevronDown class="h-3 w-3" />
                    </div>
                  </th>
                  <th class="bg-sky-700 px-6 py-2 text-[10px] font-bold text-white uppercase tracking-wider">
                    <div class="flex items-center gap-1 cursor-pointer hover:text-white/90">
                      <User class="h-3.5 w-3.5" />
                      Paciente <ChevronDown class="h-3 w-3" />
                    </div>
                  </th>
                  <th class="bg-sky-700 px-6 py-2 text-[10px] font-bold text-white uppercase tracking-wider text-center">
                    <div class="flex items-center justify-center gap-1">
                      <FileText class="h-3.5 w-3.5" />
                      <span>Historia</span>
                    </div>
                  </th>
                  <th class="bg-sky-700 px-6 py-2 text-[10px] font-bold text-white uppercase tracking-wider text-center">
                    <div class="flex items-center justify-center gap-1">
                      <BriefcaseMedical class="h-3.5 w-3.5" />
                      <span>Servicio</span>
                    </div>
                  </th>
                  <th class="bg-sky-700 px-6 py-2 text-[10px] font-bold text-white uppercase tracking-wider text-center">
                    <div class="flex items-center justify-center gap-1">
                      <HeartPulse class="h-3.5 w-3.5" />
                      <span>Estado</span>
                    </div>
                  </th>
                  <th class="bg-sky-700 px-6 py-2 text-[10px] font-bold text-white uppercase tracking-wider text-right">
                    <div class="flex items-center justify-end gap-1">
                      <Settings2 class="h-3.5 w-3.5" />
                      <span>Acciones</span>
                    </div>
                  </th>
                </tr>
              </thead>
            </table>

            <div :class="filteredPatients.length > 8 ? 'max-h-[560px] overflow-y-auto' : ''">
              <table class="w-full table-fixed text-left border-collapse">
                <colgroup>
                  <col class="w-[16%]" />
                  <col class="w-[29%]" />
                  <col class="w-[13%]" />
                  <col class="w-[24%]" />
                  <col class="w-[9%]" />
                  <col class="w-[9%]" />
                </colgroup>
                <tbody class="divide-y divide-slate-50">
                  <tr
                    v-for="(patient, index) in filteredPatients"
                    :key="patient.id || `patient-${index}`"
                    @click="$emit('select', patient)"
                    :class="[
                      'group border-transparent transition-all cursor-pointer hover:bg-blue-50/30',
                      selectedId === patient.id ? 'bg-blue-50/50 border-l-4 border-l-blue-500' : 'border-l-4 border-l-transparent'
                    ]"
                  >
                    <td class="px-6 py-2.5">
                      <div class="flex items-center gap-3">
                        <div
                          :class="[
                            'flex h-7 w-7 items-center justify-center rounded-full shadow-sm',
                            patient.numCuenta ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
                          ]"
                        >
                          <FileText class="h-4 w-4" />
                        </div>
                        <div class="flex flex-col">
                          <span class="text-sm font-bold" :class="patient.numCuenta ? 'text-red-600' : 'text-green-600'">{{ patient.habitacion }}</span>
                          <span v-if="patient.numCuenta" class="text-xs text-slate-400">{{ patient.numCuenta }}</span>
                          <span class="text-xs font-bold" :class="patient.numCuenta ? 'text-red-500' : 'text-green-500'">{{ patient.numCuenta ? 'Ocupada' : 'Disponible' }}</span>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-2.5">
                      <div class="flex flex-col">
                        <span class="text-sm font-bold text-slate-800 tracking-tight">{{ patient.apellido }}</span>
                      </div>
                    </td>
                    <td class="px-6 py-2.5 text-center">
                      <span class="text-sm font-bold text-slate-800">{{ patient.historiaClinica }}</span>
                    </td>
                    <td class="px-6 py-2.5 text-center">
                      <span class="text-sm font-bold text-slate-700">{{ patient.servicio }}</span>
                    </td>
                    <td class="px-6 py-2.5 text-center">
                      <span
                        :class="[
                          'inline-flex items-center gap-1.5 rounded bg-yellow-100 px-2 py-0.5 text-[9px] font-bold uppercase tracking-tight',
                          patient.estado === 'estable' ? 'bg-green-100 text-green-700 border border-green-200' :
                          patient.estado === 'critico' ? 'bg-red-100 text-red-700 border border-red-200' :
                          'bg-yellow-100 text-yellow-700 border border-yellow-200'
                        ]"
                      >
                        <div class="h-1.5 w-1.5 rounded-full" :class="patient.estado === 'estable' ? 'bg-green-500' : patient.estado === 'critico' ? 'bg-red-500' : 'bg-yellow-500'"></div>
                        {{ patient.estado }}
                      </span>
                    </td>
                    <td class="px-6 py-2.5 text-center">
                      <div class="flex items-center justify-center gap-2">
                        <template v-if="patient.numCuenta">
                          <!-- Menú de Cama extraído -->
                          <BedActionMenu
                            :patient="patient"
                            @view-bed="$emit('view-bed', $event)"
                            @view-transfer="$emit('view-transfer', $event)"
                          />
                          <button
                            v-if="draftNoteForPatient(patient.id)"
                            @click.stop="$emit('edit-draft', draftNoteForPatient(patient.id)!)"
                            class="flex items-center gap-1.5 rounded-full bg-orange-500 p-1.5 text-white hover:bg-orange-600 focus:ring-2 focus:ring-orange-400/50 transition-all shadow-sm shadow-orange-200/50"
                            title="Modificar nota borrador"
                          >
                            <Pencil class="h-4 w-4" />
                          </button>
                          <button
                            v-if="!draftNoteForPatient(patient.id)"
                            @click.stop="$emit('new-note', patient)"
                            class="flex items-center gap-1.5 rounded-full bg-emerald-500 p-1.5 text-white hover:bg-emerald-600 focus:ring-2 focus:ring-emerald-500/50 transition-all shadow-sm shadow-emerald-200/50"
                            title="Nueva Nota"
                          >
                            <Plus class="h-4 w-4" />
                          </button>
                        </template>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div v-if="filteredPatients.length === 0" class="flex flex-col items-center justify-center py-20 bg-slate-50/20">
            <div class="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400 mb-4">
              <Users class="h-8 w-8" />
            </div>
            <h3 class="text-sm font-bold text-slate-600">No se encontraron pacientes</h3>
            <p class="text-xs text-slate-400 mt-1">Pruebe con otros términos de búsqueda.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import {
  ChevronDown, FileText, Users, Plus, Pencil,
  User, Settings2, HeartPulse, BriefcaseMedical
} from 'lucide-vue-next'
import type { Patient, NotaEnfermeria } from '@/types'
import { pacientesService, type PacienteSinCama, type Servicio } from '@/services/api'
import PacientesSinCamaTable from '@/components/PacientesSinCamaTable.vue'
import BedCountersHeader from '@/components/BedCountersHeader.vue'
import BedActionMenu from '@/components/BedActionMenu.vue'

const props = defineProps<{
  pacientes: Patient[]
  selectedId?: string
  notas?: NotaEnfermeria[]
  servicios?: Servicio[]
  servicioSeleccionado?: string
  refreshPacientesSinCamaToken?: number
}>()

const emit = defineEmits<{
  select: [patient: Patient]
  'new-note': [patient: Patient]
  'edit-draft': [nota: NotaEnfermeria]
  'cambio-servicio': [servicioId: string]
  'view-bed': [patient: Patient]
  'view-transfer': [patient: Patient]
  'assign-bed': [paciente: PacienteSinCama]
  'view-total': []
}>()

const pacientesSinCama = ref<PacienteSinCama[]>([])
const loadingPacientesSinCama = ref(false)
const searchQuery = ref('')

const servicioNombreSeleccionado = computed(() => {
  if (!props.servicioSeleccionado || props.servicioSeleccionado === 'todos') return ''
  const servicio = props.servicios?.find(s => String(s.IdServicio) === String(props.servicioSeleccionado))
  return servicio?.Nombre || ''
})

async function cargarPacientesSinCama() {
  if (!servicioNombreSeleccionado.value) {
    pacientesSinCama.value = []
    loadingPacientesSinCama.value = false
    return
  }

  loadingPacientesSinCama.value = true
  try {
    const data = await pacientesService.getPacientesSinCama(servicioNombreSeleccionado.value)
    pacientesSinCama.value = Array.isArray(data) ? data : []
  } catch (error) {
    console.error('Error cargando pacientes sin cama:', error)
    pacientesSinCama.value = []
  } finally {
    loadingPacientesSinCama.value = false
  }
}

watch(
  () => [props.servicioSeleccionado, props.servicios?.length, props.refreshPacientesSinCamaToken],
  () => {
    cargarPacientesSinCama()
  },
  { immediate: true }
)

const filteredPatients = computed(() => {
  const query = (searchQuery.value || '').toLowerCase().trim()

  if (!query) {
    return props.pacientes.filter(p => p.numCuenta)
  }

  const filtered = props.pacientes.filter(patient => {
    const searchStr = `${patient.apellido} ${patient.nombre} ${patient.numCuenta || ''} ${patient.historiaClinica} ${patient.servicio}`.toLowerCase()
    return searchStr.includes(query)
  })

  return filtered.filter(p => p.numCuenta)
})

const totalCamas = computed(() => props.pacientes.length)
const camasOcupadas = computed(() => props.pacientes.filter(p => p.numCuenta).length)
const camasDisponibles = computed(() => totalCamas.value - camasOcupadas.value)

function draftNoteForPatient(patientId: string): NotaEnfermeria | null {
  if (!props.notas || !patientId) return null
  return props.notas.find(n => String(n.pacienteId) === String(patientId) && (n.isFirmada === false || n.isFirmada === undefined || n.isFirmada === null)) ?? null
}
</script>
