<template>
  <Teleport to="body">
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black/50" @click="$emit('close')"></div>
      
      <!-- Modal Content -->
      <div class="relative z-10 w-full max-w-4xl rounded-xl bg-white shadow-2xl max-h-[90vh] flex flex-col">
        <!-- Header -->
        <div class="flex items-center justify-between border-b border-sky-700 bg-sky-800 px-4 py-2.5">
          <div class="flex items-center gap-3">
            <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-white/15 text-white">
              <Bed class="h-5 w-5" />
            </div>
            <div>
              <h3 class="text-lg font-bold text-white">Camas Disponibles</h3>
            </div>
          </div>
          <button
            @click="$emit('close')"
            class="rounded-lg p-2 text-sky-100 hover:bg-sky-700 hover:text-white"
          >
            <X class="h-5 w-5" />
          </button>
        </div>

        <!-- Body -->
        <div class="flex-1 overflow-y-auto p-4">
          <!-- Camas disponibles -->
          <div>
            <h4 class="text-sm font-bold text-slate-700 mb-2">{{ servicioActual }}</h4>
            <div v-if="loading" class="flex items-center justify-center py-4">
              <div class="h-6 w-6 animate-spin rounded-full border-3 border-blue-200 border-t-blue-600"></div>
            </div>
            <div v-else-if="pacientes.length === 0" class="text-center py-4 text-slate-400 text-sm">
              No hay camas disponibles
            </div>
            <div v-else class="grid grid-cols-5 gap-2">
              <button
                v-for="paciente in pacientes"
                :key="paciente.id"
                @click="selectPaciente(paciente)"
                :class="[
                  'flex h-[52px] flex-col items-center justify-center px-2 rounded-lg border transition-all text-center text-slate-800',
                  selectedPaciente?.id === paciente.id
                    ? 'border-green-600 bg-green-600 text-white'
                    : 'border-slate-200 hover:border-green-500 hover:bg-green-500 hover:text-white'
                ]"
              >
                <p class="w-full text-center text-[17px] font-bold leading-none translate-y-[8px]">{{ paciente.apellido }}</p>
              </button>
            </div>
            <div v-if="mostrarMedico" class="mt-3 relative">
              <label class="block text-sm font-bold text-slate-800 uppercase mb-1">Médico</label>
              <input
                v-model="medicoSearch"
                type="text"
                placeholder="Nombre del médico"
                class="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-base text-slate-800 shadow-sm focus:border-sky-400 focus:ring-2 focus:ring-sky-200"
                :readonly="!!medicoSeleccionadoNombre && !editandoMedico"
                @focus="openMedicosDropdown"
                @click="openMedicosDropdown"
                @input="onMedicoInput"
                @blur="scheduleCloseMedicos"
              />
              <div
                v-if="showMedicos"
                class="fixed left-1/2 -translate-x-1/2 z-[1000] mt-1 max-h-64 w-[90vw] max-w-2xl overflow-auto rounded-xl border border-slate-200 bg-white shadow-2xl ring-1 ring-slate-100"
              >
                <div v-if="loadingMedicos" class="px-3 py-2 text-xs text-slate-500">Cargando...</div>
                <div v-else-if="medicosError" class="px-3 py-2 text-xs text-red-500">{{ medicosError }}</div>
                <template v-else>
                  <button
                    v-for="med in filteredMedicos"
                    :key="med.IdMedico"
                    type="button"
                    class="block w-full px-4 py-2.5 text-left text-[13px] font-semibold text-slate-800 hover:bg-emerald-50"
                    @mousedown.prevent="selectMedico(med)"
                  >
                    {{ med.Medico }}
                  </button>
                <div v-if="filteredMedicos.length === 0" class="px-3 py-2 text-xs text-slate-400">Sin resultados</div>
                </template>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="flex justify-end gap-2 border-t border-slate-100 px-6 py-2">
          <button
            @click="guardarSeleccion"
            :disabled="!selectedPaciente || (mostrarMedico && !medicoSeleccionadoNombre && !medicoSearch)"
            class="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Guardar
          </button>
          <button
            @click="$emit('close')"
            class="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { Bed, X } from 'lucide-vue-next'
import type { Patient } from '@/types'
import { catalogosService, pacientesService } from '@/services/api'

const props = defineProps<{
  isOpen: boolean
  servicioSeleccionado?: string
  idEspecialidad?: string | number | null
  mostrarMedico?: boolean
}>()

const emit = defineEmits<{
  close: []
  'select-paciente': [paciente: Patient]
}>()

const loading = ref(false)
const pacientes = ref<Patient[]>([])
const selectedPaciente = ref<Patient | null>(null)
const medicos = ref<{ IdMedico: number; IdEmpleado: number; IdEspecialidad: number; Medico: string }[]>([])
const medicoSearch = ref('')
const medicoSeleccionadoNombre = ref('')
const medicoSeleccionadoId = ref<number | null>(null)
const showMedicos = ref(false)
const mostrarTodosMedicos = ref(true)
const medicosError = ref('')
const loadingMedicos = ref(false)
const hideMedicoTimeout = ref<number | null>(null)
const editandoMedico = ref(false)

async function fetchMedicos() {
  const especialidadId = props.idEspecialidad ?? props.servicioSeleccionado
  if (!especialidadId) {
    medicos.value = []
    medicosError.value = 'Seleccione un servicio primero'
    return
  }
  try {
    loadingMedicos.value = true
    medicosError.value = ''
    const data = await catalogosService.getMedicosPorEspecialidad(String(especialidadId))
    medicos.value = Array.isArray(data) ? data : []
  } catch (err: any) {
    console.error('Error cargando medicos', err)
    medicosError.value = err?.message || 'No se pudieron cargar los médicos'
    medicos.value = []
  } finally {
    loadingMedicos.value = false
  }
}

// Obtener el nombre del servicio del primer paciente
const servicioActual = computed(() => {
  if (pacientes.value.length > 0 && pacientes.value[0].servicio) {
    return pacientes.value[0].servicio
  }
  return 'Todos los servicios'
})

const filteredMedicos = computed(() => {
  if (mostrarTodosMedicos.value) return medicos.value
  const q = medicoSearch.value.trim().toLowerCase()
  if (!q) return medicos.value
  return medicos.value.filter(m => m.Medico.toLowerCase().includes(q))
})

async function fetchPacientes() {
  loading.value = true
  try {
    const data = await pacientesService.getPacientes(props.servicioSeleccionado)
    console.log('Pacientes recibidos:', data.length)
    
    // Convertir los datos al formato Patient - solo camas sin paciente
    pacientes.value = data
      .filter((p: any) => (!p.Pacientes || p.Pacientes.trim() === '') && !!p.IdCama)
      .map((p: any) => ({
        id: p.IdCama ? String(p.IdCama) : '',
        nombre: '',
        apellido: p.Codigo || '', // Mostrar el codigo de la cama
        edad: 0,
        genero: 'M' as const,
        dni: '',
        numCuenta: '',
        historiaClinica: '',
        servicio: p.Nombre || '',
        medico: '',
        financiamiento: 'ESTRATEGIA',
        habitacion: p.Codigo || '',
        cama: p.Codigo || '',
        diagnostico: '',
        fechaIngreso: new Date().toISOString().split('T')[0],
        estado: 'estable' as const,
      }))
  } catch (error) {
    console.error('Error fetching patients:', error)
    pacientes.value = []
  } finally {
    loading.value = false
  }
}

function selectPaciente(paciente: Patient) {
  selectedPaciente.value = paciente
}

function openMedicosDropdown() {
  clearMedicoHide()
  showMedicos.value = true
  mostrarTodosMedicos.value = true
  editandoMedico.value = true
  if (medicoSeleccionadoNombre.value) {
    medicoSearch.value = ''
  }
  if (!medicos.value.length) {
    fetchMedicos()
  }
}

function onMedicoInput() {
  showMedicos.value = true
  mostrarTodosMedicos.value = false
  editandoMedico.value = true
}

function selectMedico(med: { IdMedico: number; Medico: string }) {
  medicoSeleccionadoId.value = med.IdMedico
  medicoSeleccionadoNombre.value = med.Medico
  medicoSearch.value = med.Medico
  showMedicos.value = false
  mostrarTodosMedicos.value = false
  editandoMedico.value = false
}

function scheduleCloseMedicos() {
  clearMedicoHide()
  hideMedicoTimeout.value = window.setTimeout(() => {
    showMedicos.value = false
    editandoMedico.value = false
    if (medicoSeleccionadoNombre.value) {
      medicoSearch.value = medicoSeleccionadoNombre.value
    } else {
      medicoSearch.value = ''
    }
  }, 120)
}

function clearMedicoHide() {
  if (hideMedicoTimeout.value !== null) {
    clearTimeout(hideMedicoTimeout.value)
    hideMedicoTimeout.value = null
  }
}

function guardarSeleccion() {
  if (!selectedPaciente.value) return
  const nombreMedico = (medicoSeleccionadoNombre.value || medicoSearch.value).trim()
  emit('select-paciente', { ...selectedPaciente.value, medico: nombreMedico, idMedicoOrdena: medicoSeleccionadoId.value || null })
}

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    selectedPaciente.value = null
    medicoSeleccionadoNombre.value = ''
    medicoSeleccionadoId.value = null
    medicoSearch.value = ''
    medicos.value = []
    fetchPacientes()
  }
})
</script>
