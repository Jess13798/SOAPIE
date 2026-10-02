<template>
  <Teleport to="body">
    <div v-if="isOpen && patient" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="absolute inset-0 bg-black/50" @click="$emit('close')"></div>

      <div class="relative z-10 w-[86vw] max-w-2xl max-h-[90vh] overflow-visible rounded-xl bg-white shadow-2xl flex flex-col">
        <div class="flex items-center justify-between border-b border-emerald-700 bg-emerald-800 px-4 py-2.5">
          <div class="flex items-center gap-3">
            <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-white/15 text-white">
              <ArrowLeftRight class="h-5 w-5" />
            </div>
            <div>
              <h5 class="text-lg font-bold text-white">Transferencia de Paciente</h5>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <div class="inline-flex items-center gap-2 rounded-full border border-emerald-400/60 bg-emerald-700/40 px-3 py-1.5 text-[12px] font-semibold text-emerald-50 shadow-inner">
              <Clock3 class="h-4 w-4 text-emerald-100" />
              <span>{{ fechaHoraActual }}</span>
            </div>
            <button
              @click="$emit('close')"
              class="rounded-lg p-2 text-emerald-100 hover:bg-emerald-700 hover:text-white"
              aria-label="Cerrar"
            >
              <X class="h-5 w-5" />
            </button>
          </div>
        </div>

        <div class="flex-1 overflow-visible px-5 pb-5 pt-3 space-y-3">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pb-3 mb-3 border-b border-slate-200">
            <div class="flex flex-col gap-0.5">
              <span class="text-[11px] font-semibold text-slate-500 uppercase">PACIENTE</span>
              <span class="text-sm font-bold text-slate-800">{{ patient.apellido }}</span>
            </div>
            <div class="flex flex-col gap-0.5 md:items-center md:text-center">
              <span class="text-[11px] font-semibold text-slate-500 uppercase">SERVICIO ACTUAL</span>
              <span class="text-sm font-bold text-slate-800">{{ patient.servicio || 'N/D' }}</span>
            </div>
          </div>

          <div class="grid grid-cols-1 gap-4">
            <label class="block text-sm font-semibold text-slate-700 relative">
              SERVICIO DE DESTINO
              <input
                v-model="servicioSearch"
                type="text"
                placeholder="Escriba o seleccione servicio"
                class="mt-1 block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
                :readonly="!!servicioSeleccionadoNombre && !editandoServicio"
                @focus="openServiciosDropdown()"
                @click="openServiciosDropdown()"
                @input="onServicioInput"
                @blur="scheduleCloseDropdown"
              />
              <div
                v-if="showServicios"
                class="absolute z-30 mt-1 w-full max-h-52 overflow-auto rounded-lg border border-slate-200 bg-white shadow-lg"
              >
                <button
                  v-for="srv in filteredServicios"
                  :key="srv.IdServicio"
                  type="button"
                  class="block w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-emerald-50"
                  @mousedown.prevent="selectServicio(String(srv.IdServicio), srv.Nombre)"
                >
                  {{ srv.Nombre }}
                </button>
                <div v-if="filteredServicios.length === 0" class="px-3 py-2 text-xs text-slate-400">
                  Sin resultados
                </div>
              </div>
            </label>

            <label class="block text-sm font-semibold text-slate-700">
              DIAGNOSTICO
              <div class="flex items-center gap-1 text-[11px] font-semibold text-slate-500 uppercase mt-1 pl-2">
                <span class="min-w-[60px] pl-2">Cie10</span>
                <span class="min-w-[16px] text-center">Tipo</span>
                <span class="flex-1 pl-4">Descripción</span>
              </div>
              <div class="relative">
                <input
                  v-model="diagnosticoSearch"
                  type="text"
                  placeholder="Escriba o seleccione diagnóstico"
                  class="mt-1 block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 font-mono leading-tight"
                  :readonly="!!diagnosticoSeleccionadoResumen && !editandoDiagnostico"
                  @focus="openDiagnosticosDropdown"
                  @click="openDiagnosticosDropdown"
                  @input="onDiagnosticoInput"
                  @blur="scheduleCloseDiagnosticos"
                />
                <div
                  v-if="showDiagnosticos"
                  class="absolute z-50 mt-1 w-full max-h-60 overflow-auto rounded-lg border border-slate-200 bg-white shadow-lg"
                >
                  <div class="sticky top-0 flex items-center gap-1 px-3 py-2 text-[11px] font-semibold text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                    <span class="min-w-[60px] pl-2">Cie10</span>
                    <span class="min-w-[16px] text-center">Tipo</span>
                <span class="flex-1 pl-4">Descripción</span>
                  </div>
                  <div v-if="loadingDiagnosticos" class="px-3 py-2 text-xs text-slate-500">Cargando...</div>
                  <div v-else-if="diagnosticosError" class="px-3 py-2 text-xs text-red-500">{{ diagnosticosError }}</div>
                  <template v-else>
                    <button
                      v-for="diag in filteredDiagnosticos"
                      :key="diag.IdDiagnostico + '-' + diag.CodigoCIE10"
                      type="button"
                      class="flex w-full items-center gap-3 px-3 py-2 text-left text-sm text-slate-700 hover:bg-emerald-50"
                      @mousedown.prevent="selectDiagnostico(diag)"
                    >
                      <div class="min-w-[60px] font-semibold text-slate-800">{{ diag.CodigoCIE10 }}</div>
                      <div class="min-w-[16px] text-center text-sm text-slate-600">({{ diag.Codigo }})</div>
                      <div class="flex-1 text-sm text-slate-700 leading-tight flex items-center">{{ diag.Descripcion }}</div>
                    </button>
                    <div v-if="filteredDiagnosticos.length === 0" class="px-3 py-2 text-xs text-slate-400">Sin resultados</div>
                  </template>
                </div>
              </div>
            </label>

            <label class="block text-sm font-semibold text-slate-700">
              MEDICO QUE ORDNEDA
              <div class="relative">
                <input
                  v-model="medicoSearch"
                  type="text"
                  placeholder="Nombre del médico"
                  class="mt-1 block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
                  :readonly="!!medicoSeleccionadoNombre && !editandoMedico"
                  @focus="openMedicosDropdown"
                  @click="openMedicosDropdown"
                  @input="onMedicoInput"
                  @blur="scheduleCloseMedicos"
                />
                <div
                  v-if="showMedicos"
                  class="absolute z-40 mt-1 w-full max-h-52 overflow-auto rounded-lg border border-slate-200 bg-white shadow-lg"
                >
                  <div v-if="loadingMedicos" class="px-3 py-2 text-xs text-slate-500">Cargando...</div>
                  <div v-else-if="medicosError" class="px-3 py-2 text-xs text-red-500">{{ medicosError }}</div>
                  <template v-else>
                    <button
                      v-for="med in filteredMedicos"
                      :key="med.IdMedico"
                      type="button"
                      class="block w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-emerald-50"
                      @mousedown.prevent="selectMedico(med)"
                    >
                      {{ med.Medico }}
                    </button>
                    <div v-if="filteredMedicos.length === 0" class="px-3 py-2 text-xs text-slate-400">Sin resultados</div>
                  </template>
                </div>
              </div>
            </label>

            <div class="flex justify-end gap-2 pt-1">
              <button
                @click="submit"
                :disabled="!formCompleto"
                class="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-emerald-400"
              >
                Guardar transferencia
              </button>
              <button
                @click="$emit('close')"
                class="rounded-lg bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-300"
              >
                Cancelar
              </button>
            </div>
          </div>
      </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch, computed, onBeforeUnmount } from 'vue'
import { ArrowLeftRight, X, Clock3 } from 'lucide-vue-next'
import type { Patient } from '@/types'
import { catalogosService } from '@/services/api'

const props = defineProps<{
  isOpen: boolean
  patient: Patient | null
  servicios?: { IdServicio: number; Nombre: string }[]
}>()

const emit = defineEmits<{
  close: []
  confirm: [payload: {
    pacienteId: string | number
    servicioDestino: string
    medicoOrdena?: string
    diagnostico?: string
    motivo?: string
    camaActual?: string
    idMedicoOrdena?: number | null
    idDiagnostico?: number | null
    idCuentaAtencion?: string | number | null
    fechaOcupacion?: string
    horaOcupacion?: string
    idServicio?: string | number
    idProducto?: string | number | null
  }]
}>()

const servicioDestino = ref<string>('')
const camaPreferida = ref('')
const motivo = ref('')
const medicoOrdena = ref('')
const servicioSearch = ref('')
const servicioSeleccionadoId = ref<string>('')
const servicioSeleccionadoNombre = ref('')
const showServicios = ref(false)
const hideDropdownTimeout = ref<number | null>(null)
const mostrarTodosServicios = ref(false)
const medicos = ref<{ IdMedico: number; IdEmpleado: number; IdEspecialidad: number; Medico: string }[]>([])
const medicoSearch = ref('')
const medicoSeleccionadoNombre = ref('')
const medicoSeleccionadoId = ref<number | null>(null)
const showMedicos = ref(false)
const mostrarTodosMedicos = ref(false)
const medicosError = ref('')
const loadingMedicos = ref(false)
const hideMedicoTimeout = ref<number | null>(null)
const fechaHoraActual = ref('')
let relojInterval: number | null = null
const diagnosticos = ref<{ CodigoCIE10: string; IdDiagnostico: number; Descripcion: string; Codigo: string }[]>([])
const diagnosticoSearch = ref('')
const showDiagnosticos = ref(false)
const diagHideTimeout = ref<number | null>(null)
const loadingDiagnosticos = ref(false)
const diagnosticosError = ref('')
const mostrarTodoDiagnostico = ref(false)
const diagnosticoSeleccionadoId = ref<number | null>(null)
const formCompleto = computed(() =>
  !!servicioDestino.value.trim() &&
  !!(medicoSeleccionadoNombre.value || medicoOrdena.value.trim() || medicoSearch.value.trim()) &&
  !!camaPreferida.value.trim()
)
const editandoServicio = ref(false)
const editandoMedico = ref(false)
const editandoDiagnostico = ref(false)
const diagnosticoSeleccionadoResumen = ref('')

const filteredServicios = computed(() => {
  if (mostrarTodosServicios.value) return props.servicios || []
  const q = servicioSearch.value.trim().toLowerCase()
  const list = props.servicios || []
  if (!q) return list
  return list.filter(s => s.Nombre.toLowerCase().includes(q))
})

const filteredMedicos = computed(() => {
  if (mostrarTodosMedicos.value) return medicos.value
  const q = medicoSearch.value.trim().toLowerCase()
  if (!q) return medicos.value
  return medicos.value.filter(m => m.Medico.toLowerCase().includes(q))
})

const filteredDiagnosticos = computed(() => {
  if (mostrarTodoDiagnostico.value) return diagnosticos.value
  const q = diagnosticoSearch.value.trim().toLowerCase()
  if (!q) return diagnosticos.value
  return diagnosticos.value.filter(d =>
    d.Descripcion.toLowerCase().includes(q) ||
    d.CodigoCIE10.toLowerCase().includes(q) ||
    (d.Codigo || '').toLowerCase().includes(q)
  )
})

function resetForm() {
  servicioDestino.value = ''
  camaPreferida.value = ''
  motivo.value = ''
  medicoOrdena.value = ''
  servicioSearch.value = ''
  servicioSeleccionadoId.value = ''
  servicioSeleccionadoNombre.value = ''
  medicoSearch.value = ''
  medicoSeleccionadoNombre.value = ''
  medicoSeleccionadoId.value = null
  medicos.value = []
  medicosError.value = ''
  diagnosticoSearch.value = ''
  diagnosticos.value = []
  diagnosticosError.value = ''
  diagnosticoSeleccionadoResumen.value = ''
  diagnosticoSeleccionadoId.value = null
  fechaHoraActual.value = formatFechaHora()
  // No preseleccionar servicio: dejar en blanco para que el usuario escriba/busque
  servicioDestino.value = ''
  servicioSearch.value = ''
  servicioSeleccionadoId.value = ''
  servicioSeleccionadoNombre.value = ''
  editandoServicio.value = false
  editandoMedico.value = false
  editandoDiagnostico.value = false
}

function submit() {
  if (!props.patient || !servicioDestino.value) return
  const fecha = formatFechaSQL()
  const hora = formatHoraCorta()
  emit('confirm', {
    pacienteId: props.patient.id,
    servicioDestino: servicioDestino.value,
    medicoOrdena: (medicoSeleccionadoNombre.value || medicoOrdena.value || medicoSearch.value).trim(),
    diagnostico: camaPreferida.value.trim(),
    motivo: motivo.value.trim(),
    camaActual: props.patient.habitacion || '',
    idMedicoOrdena: medicoSeleccionadoId.value,
    idDiagnostico: diagnosticoSeleccionadoId.value,
    idCuentaAtencion: props.patient.numCuenta,
    fechaOcupacion: fecha,
    horaOcupacion: hora,
    idServicio: servicioDestino.value,
    idProducto: props.patient.idProducto
  })
}

function openServiciosDropdown() {
  clearHideTimeout()
  showServicios.value = true
  mostrarTodosServicios.value = true
  editandoServicio.value = true
  if (servicioSeleccionadoNombre.value) {
    servicioSearch.value = ''
  }
}

function onServicioInput() {
  showServicios.value = true
  mostrarTodosServicios.value = false
  editandoServicio.value = true
}

function scheduleCloseDropdown() {
  clearHideTimeout()
  hideDropdownTimeout.value = window.setTimeout(() => {
    showServicios.value = false
    editandoServicio.value = false
    if (servicioSeleccionadoNombre.value) {
      servicioSearch.value = servicioSeleccionadoNombre.value
    } else {
      servicioSearch.value = ''
      servicioDestino.value = ''
    }
  }, 120)
}

function clearHideTimeout() {
  if (hideDropdownTimeout.value !== null) {
    clearTimeout(hideDropdownTimeout.value)
    hideDropdownTimeout.value = null
  }
}

function selectServicio(id: string, nombre: string) {
  servicioDestino.value = id
  servicioSearch.value = nombre
  servicioSeleccionadoId.value = id
  servicioSeleccionadoNombre.value = nombre
  editandoServicio.value = false
  showServicios.value = false
  mostrarTodosServicios.value = false
}

async function fetchMedicos() {
  if (!props.patient?.idEspecialidad) {
    medicos.value = []
    medicosError.value = 'El paciente no tiene especialidad'
    return
  }
  try {
    loadingMedicos.value = true
    medicosError.value = ''
    const data = await catalogosService.getMedicosPorEspecialidad(props.patient.idEspecialidad)
    medicos.value = Array.isArray(data) ? data : []
  } catch (err: any) {
    console.error('Error cargando medicos', err)
    medicosError.value = err?.message || 'No se pudieron cargar los médicos'
    medicos.value = []
  } finally {
    loadingMedicos.value = false
  }
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
}

function selectMedico(med: { IdMedico: number; Medico: string }) {
  medicoSeleccionadoId.value = med.IdMedico
  medicoSeleccionadoNombre.value = med.Medico
  medicoSearch.value = med.Medico
  medicoOrdena.value = med.Medico
  editandoMedico.value = false
  showMedicos.value = false
  mostrarTodosMedicos.value = false
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
      medicoOrdena.value = ''
      medicoSeleccionadoId.value = null
    }
  }, 120)
}

function clearMedicoHide() {
  if (hideMedicoTimeout.value !== null) {
    clearTimeout(hideMedicoTimeout.value)
    hideMedicoTimeout.value = null
  }
}

async function fetchDiagnosticos() {
  if (!props.patient?.numCuenta) {
    diagnosticos.value = []
    diagnosticosError.value = 'El paciente no tiene cuenta de atención'
    return
  }
  try {
    loadingDiagnosticos.value = true
    diagnosticosError.value = ''
    const data = await catalogosService.getDiagnosticosPorCuenta(props.patient.numCuenta)
    diagnosticos.value = Array.isArray(data) ? data : []
  } catch (err: any) {
    console.error('Error cargando diagnósticos', err)
    diagnosticosError.value = err?.message || 'No se pudieron cargar los diagnósticos'
    diagnosticos.value = []
  } finally {
    loadingDiagnosticos.value = false
  }
}

function openDiagnosticosDropdown() {
  clearDiagHideTimeout()
  showDiagnosticos.value = true
  mostrarTodoDiagnostico.value = true
  editandoDiagnostico.value = true
  if (diagnosticoSeleccionadoResumen.value) {
    diagnosticoSearch.value = ''
  }
  if (!diagnosticos.value.length) {
    fetchDiagnosticos()
  }
}

function onDiagnosticoInput() {
  showDiagnosticos.value = true
  mostrarTodoDiagnostico.value = false
  camaPreferida.value = diagnosticoSearch.value
  editandoDiagnostico.value = true
}

function selectDiagnostico(diag: { Descripcion: string, CodigoCIE10?: string, Codigo?: string }) {
  const cie = diag.CodigoCIE10 || ''
  const tipo = diag.Codigo || ''
  const desc = diag.Descripcion || ''
  // Separar campos con espacio moderado para que queden alineados en la fuente monoespaciada
  const resumen = `${cie}(${tipo})${desc ? ' ' + desc : ''}`
  camaPreferida.value = resumen
  diagnosticoSearch.value = resumen
  diagnosticoSeleccionadoResumen.value = resumen
  diagnosticoSeleccionadoId.value = (diag as any).IdDiagnostico ?? null
  editandoDiagnostico.value = false
  showDiagnosticos.value = false
  mostrarTodoDiagnostico.value = false
}

function scheduleCloseDiagnosticos() {
  clearDiagHideTimeout()
  diagHideTimeout.value = window.setTimeout(() => {
    showDiagnosticos.value = false
    editandoDiagnostico.value = false
    if (diagnosticoSeleccionadoResumen.value) {
      diagnosticoSearch.value = diagnosticoSeleccionadoResumen.value
      camaPreferida.value = diagnosticoSeleccionadoResumen.value
    } else {
      diagnosticoSearch.value = ''
      camaPreferida.value = ''
    }
  }, 120)
}

function clearDiagHideTimeout() {
  if (diagHideTimeout.value !== null) {
    clearTimeout(diagHideTimeout.value)
    diagHideTimeout.value = null
  }
}

function formatFechaHora() {
  const now = new Date()
  const fecha = now.toLocaleDateString('es-PE')
  const hora = now.toLocaleTimeString('es-PE', { hour12: false }).padStart(8, '0')
  return `${fecha}, ${hora}`
}

function formatFechaSQL() {
  const now = new Date()
  const yyyy = now.getFullYear()
  const mm = String(now.getMonth() + 1).padStart(2, '0')
  const dd = String(now.getDate()).padStart(2, '0')
  return `${yyyy}${mm}${dd}`
}

function formatHoraCorta() {
  const now = new Date()
  const hh = String(now.getHours()).padStart(2, '0')
  const mm = String(now.getMinutes()).padStart(2, '0')
  return `${hh}:${mm}`
}

function startReloj() {
  stopReloj()
  fechaHoraActual.value = formatFechaHora()
  relojInterval = window.setInterval(() => {
    fechaHoraActual.value = formatFechaHora()
  }, 1000)
}

function stopReloj() {
  if (relojInterval !== null) {
    clearInterval(relojInterval)
    relojInterval = null
  }
}

watch(() => props.isOpen, (val) => {
  if (val) {
    resetForm()
    startReloj()
  } else {
    stopReloj()
  }
})

onBeforeUnmount(() => {
  stopReloj()
})
</script>
