<template>
  <div v-if="isOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
    <!-- Backdrop -->
    <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"></div>
    
    <!-- Modal Content -->
    <!-- Altura fija (85vh): sin esto el modal crecía y se encogía según la
         pestaña SOAPIE, los resultados del buscador y el plan seleccionado,
         y todo el contenido "saltaba". El formulario de dentro ya tiene su
         propia área scrolleable. -->
    <div class="relative flex h-[85vh] w-full max-w-6xl transform flex-col overflow-hidden rounded-xl bg-white shadow-2xl border border-slate-200">
      <!-- Unified Header -->
      <div class="flex flex-col border-b border-slate-100 bg-white shrink-0">
        <!-- Top Bar: Title & Close -->
        <div class="flex items-center justify-between px-6 py-2.5 border-b border-slate-50">
          <div class="flex items-center gap-3">
            <div 
              :class="[
                'flex h-7 w-7 items-center justify-center rounded-lg shadow-sm',
                nota ? (nota.isFirmada ? 'bg-emerald-500' : 'bg-blue-600') : 'bg-blue-600'
              ]"
            >
              <ClipboardList v-if="nota && nota.isFirmada" class="h-4 w-4 text-white" />
              <Pencil v-else-if="nota" class="h-4 w-4 text-white" />
              <PlusCircle v-else class="h-4 w-4 text-white" />
            </div>
            <h3 class="text-[14.5px] font-black text-slate-800 uppercase tracking-tight leading-none mt-[2px]">
              {{ nota ? (nota.isFirmada ? 'DETALLE DE NOTA' : 'MODIFICAR NOTA') : 'NUEVA NOTA DE ENFERMERIA' }} 
              NRO {{ noteNumber }}
            </h3>
          </div>
          
          <div class="flex items-center gap-4">
            <div
              v-if="nota?.isFirmada"
              class="flex flex-col gap-0.5 text-slate-600 bg-slate-100/70 px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm"
            >
              <div class="grid grid-cols-[40px_1fr] items-center gap-1.5">
                <span class="text-[9px] font-black uppercase text-sky-600">Inicio</span>
                <span class="text-[10px] font-bold tabular-nums">
                  {{ nota.fecha }}<span class="mx-1 opacity-0">|</span>{{ nota.hora }}
                </span>
              </div>
              <div class="grid grid-cols-[40px_1fr] items-center gap-1.5">
                <span class="text-[9px] font-black uppercase text-emerald-600">Fin</span>
                <span class="text-[10px] font-bold tabular-nums">
                  {{ nota.fechaFirmada || nota.fecha }}<span class="mx-1 opacity-0">|</span>{{ nota.horaFirmada || nota.hora }}
                </span>
              </div>
            </div>
            <button
              v-if="nota?.isFirmada"
              type="button"
              @click="handlePrint"
              class="flex h-8 items-center gap-1.5 rounded-md bg-sky-700 px-2.5 text-[10px] font-bold text-white shadow-sm transition-colors hover:bg-sky-800"
              title="Imprimir nota SOAPIE firmada"
            >
              <Printer class="h-3.5 w-3.5" />
              Imprimir
            </button>

            <!-- Live Clock -->
            <div v-else class="flex items-center gap-2 text-slate-500 bg-slate-100/70 px-3 py-1.5 rounded-full border border-slate-200 shadow-sm">
              <Clock class="h-3.5 w-3.5" />
              <span class="text-[10.5px] font-black uppercase tracking-tight">{{ fechaHoraActual }}</span>
            </div>

            <button
              v-if="nota && !isNaN(Number(nota.id))"
              @click="showVitalsHistory = true"
              type="button"
              class="flex items-center justify-center w-8 h-8 rounded-md bg-slate-500 text-white hover:bg-slate-600 transition-colors shadow-sm active:scale-95 border border-slate-600"
              title="Historial de Signos Vitales"
            >
              <Book class="h-4 w-4" />
            </button>
            <button
              v-else
              type="button"
              disabled
              class="flex items-center justify-center w-8 h-8 rounded-md bg-slate-300 text-slate-400 cursor-not-allowed border border-slate-300"
              title="Historial disponible al guardar la nota"
            >
              <Book class="h-4 w-4" />
            </button>

            <!-- Vitales básicos: disponible siempre, incluso en nota nueva -->
            <button
              type="button"
              @click="showBasicVitals = true"
              class="flex items-center justify-center w-8 h-8 rounded-md bg-teal-600 text-white hover:bg-teal-700 transition-colors shadow-sm active:scale-95 border border-teal-700"
              title="Vitales básicos (SpO₂, P.A., Temp, Pulso)"
            >
              <Activity class="h-4 w-4" />
            </button>

            <button 
              @click="$emit('close')"
              class="rounded-md p-1 bg-red-500 text-white hover:bg-red-600 transition-colors shadow-sm"
            >
              <X class="h-4 w-4 stroke-[3px]" />
            </button>
          </div>
        </div>

        <p v-if="printError" role="alert" class="px-6 pb-2 text-right text-xs font-semibold text-red-700">
          {{ printError }}
        </p>

        <!-- Datos del paciente: siempre visibles -->
        <div class="flex flex-wrap items-center justify-start gap-x-6 gap-y-1 border-t border-slate-100 bg-slate-50/60 px-6 py-2">
          <div class="flex flex-col">
            <span class="text-[8px] font-bold text-slate-400 uppercase leading-none mb-1">Paciente</span>
            <span class="text-[10.5px] font-black text-slate-700 uppercase">{{ patient.nombreCompleto || `${patient.nombre} ${patient.apellido}`.trim() }}</span>
          </div>
          <div class="h-6 w-[1px] bg-slate-200"></div>
          <div class="flex flex-col">
            <div class="grid grid-cols-[1fr_auto_1fr] gap-x-2 items-center">
              <span class="text-[8px] font-bold text-slate-400 uppercase leading-none text-right">Cuenta</span>
              <span class="text-[8px] font-bold text-slate-300">|</span>
              <span class="text-[8px] font-bold text-slate-400 uppercase leading-none text-left">Hist</span>
            </div>
            <div class="grid grid-cols-[1fr_auto_1fr] gap-x-2 items-center mt-1">
              <span class="text-[10.5px] font-black text-slate-700 text-right">{{ patient.numCuenta }}</span>
              <span class="text-[10.5px] font-black text-slate-400">|</span>
              <span class="text-[10.5px] font-black text-slate-700 text-left">{{ patient.historiaClinica }}</span>
            </div>
          </div>
          <div class="h-6 w-[1px] bg-slate-200"></div>
          <div class="flex flex-col">
            <span class="text-[8px] font-bold text-slate-400 uppercase leading-none mb-1">Edad</span>
            <span class="text-[10.5px] font-black text-slate-700">{{ edadPacienteTexto }}</span>
          </div>
        </div>
      </div>

      <!-- Form Container (scrollable) -->
      <div class="min-h-0 flex-1 overflow-y-auto px-6 pt-1 pb-2 custom-scrollbar bg-white">
        <NewNoteForm
          ref="formRef"
          :pacientes="[patient]"
          :selected-patient="patient"
          :enfermera-prop="enfermeraMostrada"
          :initial-nota="nota"
          :nota-anterior="notaAnterior"
          :campos-obligatorios="camposObligatorios"
          :is-read-only="!!nota?.isFirmada"
          :is-submitting="isSubmitting"
          @save="handleSave"
          @sign="handleSign"
        />
      </div>

    </div>
  </div>
  <VitalsHistoryModal
    :is-open="showVitalsHistory"
    :id-cuenta="patient.numCuenta || ''"
    :registros-temporales="nota?.historialTemporalSignosVitales || []"
    @close="showVitalsHistory = false"
  />
  <VitalsChartModal
    :is-open="showBasicVitals"
    :id-cuenta="patient.numCuenta || ''"
    :patient="patient"
    :registros-temporales="nota?.historialTemporalSignosVitales || []"
    @close="showBasicVitals = false"
  />
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { PlusCircle, X, Clock, Pencil, ClipboardList, Plus, Book, Activity, Printer } from 'lucide-vue-next'
import type { Patient, NotaEnfermeria } from '@/types'
import NewNoteForm from './NewNoteForm.vue'
import VitalsHistoryModal from '@/modules/vitales/components/VitalsHistoryModal.vue'
import VitalsChartModal from '@/modules/vitales/components/VitalsChartModal.vue'
import { printNotaSoapie } from '../printNotaSoapie'

const formRef = ref<InstanceType<typeof NewNoteForm> | null>(null)
const showVitalsHistory = ref(false)
const showBasicVitals = ref(false)
const printError = ref('')

const props = defineProps<{
  isOpen: boolean
  patient: Patient
  noteNumber: number
  nota?: NotaEnfermeria
  // Nota más reciente del paciente, para heredar el plan de cuidados al crear
  // una nota nueva (el formulario la ignora cuando se está editando `nota`).
  notaAnterior?: NotaEnfermeria | null
  isSubmitting?: boolean
  // Signos vitales que exige el servicio seleccionado.
  camposObligatorios?: string[]
}>()

const emit = defineEmits<{
  close: []
  save: [nota: NotaEnfermeria]
  sign: [nota: NotaEnfermeria]
}>()

// --- Header Logic ---
const enfermera = ref(sessionStorage.getItem('empleadoLogueado') || sessionStorage.getItem('usuarioLogueado') || 'SIN USUARIO')
const enfermeraMostrada = ref('')
const fechaHoraActual = ref("")
let timer: any

const edadPacienteTexto = computed(() => {
  const desc = (props.patient.edadDescripcion || '').trim()
  return desc ? `${props.patient.edad} ${desc}` : `${props.patient.edad} años`
})

const updateClock = () => {
  const now = new Date()
  fechaHoraActual.value = now.toLocaleString('es-ES', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit'
  })
}

onMounted(() => {
  enfermeraMostrada.value = props.nota?.enfermera || enfermera.value
  updateClock()
  timer = setInterval(updateClock, 1000)
})

onUnmounted(() => clearInterval(timer))


function handleSave(nota: NotaEnfermeria) {
  nota.enfermera = enfermeraMostrada.value
  const savedId = sessionStorage.getItem('idEmpleado')
  if (savedId) {
    nota.idEmpleado = (nota as any).idEmpleado || savedId
  }
  emit('save', nota)
}

function handleSign(nota: NotaEnfermeria) {
  nota.enfermera = enfermeraMostrada.value
  emit('sign', nota)
}

function handlePrint() {
  if (!props.nota) return
  printError.value = ''
  try {
    if (!printNotaSoapie(props.nota, props.patient, props.noteNumber)) {
      printError.value = 'El navegador bloqueó la ventana de impresión. Habilite las ventanas emergentes para este sitio e intente de nuevo.'
    }
  } catch (error) {
    printError.value = error instanceof Error ? error.message : 'No se pudo preparar la nota para impresión.'
  }
}

function handleClearVitals() {
  if (formRef.value) {
    formRef.value.clearVitals()
  }
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 5px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #cbd5e1;
}
</style>
