<template>
  <div v-if="isOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
    <!-- Backdrop -->
    <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"></div>
    
    <!-- Modal Content -->
    <div class="relative w-full max-w-5xl transform overflow-hidden rounded-xl bg-white shadow-2xl transition-all border border-slate-200">
      <!-- Unified Header -->
      <div class="flex flex-col border-b border-slate-100 bg-white">
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

            <!-- Live Clock -->
            <div v-else class="flex items-center gap-2 text-slate-500 bg-slate-100/70 px-3 py-1.5 rounded-full border border-slate-200 shadow-sm">
              <Clock class="h-3.5 w-3.5" />
              <span class="text-[10.5px] font-black uppercase tracking-tight">{{ fechaHoraActual }}</span>
            </div>

            <button 
              @click="$emit('close')"
              class="rounded-md p-1 bg-red-500 text-white hover:bg-red-600 transition-colors shadow-sm"
            >
              <X class="h-4 w-4 stroke-[3px]" />
            </button>
          </div>
        </div>

        <!-- Info Bar: Patient, Nurse & Clock -->
        <div class="flex items-center justify-between px-6 py-2 bg-slate-50/30">
          <div class="flex items-center gap-6">
            <div class="flex flex-col">
              <span class="text-[8px] font-bold text-slate-400 uppercase leading-none mb-1">Paciente</span>
              <span class="text-[10.5px] font-black text-slate-700 uppercase">{{ patient.nombre }} {{ patient.apellido }}</span>
            </div>
            <div class="h-6 w-[1px] bg-slate-200"></div>
            <div class="flex flex-col">
              <!-- Grid to sync the | separator -->
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
            <div class="h-6 w-[1px] bg-slate-200"></div>
            
            <!-- Enfermero/a Responsable (solo lectura, tomado del login) -->
            <div class="flex flex-col min-w-[200px]">
              <span class="text-[8px] font-bold text-slate-400 uppercase leading-none mb-1">Enfermero/a Responsable</span>
              <span class="text-[10.5px] font-black text-slate-700 uppercase leading-tight">
                {{ enfermeraMostrada }}
              </span>
            </div>
          </div>

          <!-- Boton + -->
          <div class="flex items-center gap-2">
            <!-- Boton Libro -->
            <button 
              @click="showVitalsHistory = true"
              type="button"
              class="flex items-center justify-center w-8 h-8 rounded-md bg-slate-500 text-white hover:bg-slate-600 transition-colors shadow-sm active:scale-95 border border-slate-600"
              title="Historial de Signos Vitales"
            >
              <Book class="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <!-- Form Container (scrollable) -->
      <div class="max-h-[75vh] overflow-y-auto px-6 pt-1 pb-2 custom-scrollbar bg-white">
        <NewNoteForm 
          ref="formRef"
          :pacientes="[patient]" 
          :selected-patient="patient"
          :enfermera-prop="enfermeraMostrada"
          :initial-nota="nota"
          :is-read-only="!!nota?.isFirmada"
          @save="handleSave"
          @sign="handleSign"
        />
      </div>
    </div>
  </div>
  <VitalsHistoryModal 
    :is-open="showVitalsHistory" 
    :id-nota="nota?.id || ''" 
    @close="showVitalsHistory = false"
  />
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { PlusCircle, X, Clock, Pencil, ClipboardList, Plus, Book } from 'lucide-vue-next'
import type { Patient, NotaEnfermeria } from '@/types'
import NewNoteForm from './NewNoteForm.vue'
import VitalsHistoryModal from './VitalsHistoryModal.vue'

const formRef = ref<InstanceType<typeof NewNoteForm> | null>(null)
const showVitalsHistory = ref(false)

const props = defineProps<{
  isOpen: boolean
  patient: Patient
  noteNumber: number
  nota?: NotaEnfermeria
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

