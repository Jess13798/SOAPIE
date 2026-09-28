<template>
  <div class="flex flex-col gap-0 bg-white">
    <!-- Toast notification -->
    <Transition name="toast">
      <div
        v-if="toast.show"
        :class="[
          'fixed top-4 right-4 z-[110] flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium shadow-xl',
          toast.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-destructive text-white'
        ]"
      >
        <CheckCircle v-if="toast.type === 'success'" class="h-4 w-4" />
        <AlertCircle v-else class="h-4 w-4" />
        {{ toast.message }}
      </div>
    </Transition>

    <!-- Selector de 2 Turnos (12 Horas) y Autoría -->
    <div class="flex items-center justify-between bg-slate-100 px-4 py-2 border-b border-slate-200">
      <div class="flex items-center gap-2">
        <span class="text-xs font-black uppercase text-slate-600">Turno:</span>
        <div class="inline-flex rounded-md shadow-sm" role="group">
          <button
            type="button"
            @click="selectedTurno = 'dia'"
            :disabled="isReadOnly"
            :class="[
              'px-4 py-1 text-xs font-bold rounded-l-lg border transition-colors',
              selectedTurno === 'dia'
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
            ]"
          >
            ☀️ Día (07:00 - 19:00)
          </button>
          <button
            type="button"
            @click="selectedTurno = 'noche'"
            :disabled="isReadOnly"
            :class="[
              'px-4 py-1 text-xs font-bold rounded-r-lg border transition-colors',
              selectedTurno === 'noche'
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
            ]"
          >
            🌙 Noche (19:00 - 07:00)
          </button>
        </div>
      </div>

      <div class="text-xs font-bold text-slate-500">
        Enfermero/a: <span class="text-slate-800 font-extrabold uppercase">{{ nombreEnfermeraActual }}</span>
      </div>
    </div>

    <!-- Fila de Signos Vitales -->
    <section class="triaje-row grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 xl:grid-cols-10 gap-1 px-0 py-0.5 bg-blue-50/10 bg-blue-color-print">
      <div v-for="(label, key) in etiquetasVitals" :key="key" class="input-vitals bg-white border border-slate-200 rounded-md overflow-hidden hover:border-blue-300 transition-colors shadow-sm text-center flex flex-col">
        <div class="bg-blue-600 py-0.5 px-1 border-b border-blue-700">
          <label class="block text-[9.5px] font-black text-white uppercase">{{ label }}</label>
        </div>
        <div class="flex items-center justify-center gap-1 p-1 flex-1">
          <template v-if="key === 'presionArterial'">
            <input 
              type="text" 
              inputmode="numeric"
              v-model="sis"
              @input="sis = String(sis).replace(/[^0-9]/g, '')"
              placeholder="-"
              :disabled="isReadOnly"
              class="w-full border-none p-0 text-[13px] font-extrabold text-slate-800 focus:ring-0 bg-transparent text-center disabled:opacity-100 disabled:text-slate-800 min-w-0"
            />
            <span class="text-[16px] font-black text-slate-400 leading-none">/</span>
            <input 
              type="text" 
              inputmode="numeric"
              v-model="dia"
              @input="dia = String(dia).replace(/[^0-9]/g, '')"
              placeholder="-"
              :disabled="isReadOnly"
              class="w-full border-none p-0 text-[13px] font-extrabold text-slate-800 focus:ring-0 bg-transparent text-center disabled:opacity-100 disabled:text-slate-800 min-w-0"
            />
          </template>
          <template v-else>
            <input 
              type="text" 
              :inputmode="['frecuenciaCardiaca', 'frecuenciaRespiratoria', 'spo2'].includes(key) ? 'numeric' : 'decimal'"
              v-model="(form as any)[key]" 
              @input="(form as any)[key] = String((form as any)[key] || '').replace(['frecuenciaCardiaca', 'frecuenciaRespiratoria', 'spo2'].includes(key) ? /[^0-9]/g : /[^0-9.]/g, '')"
              :placeholder="placeholderVitals[key]"
              :disabled="isReadOnly"
              class="w-full border-none p-0 text-[13px] font-extrabold text-slate-800 focus:ring-0 bg-transparent text-center disabled:opacity-100 disabled:text-slate-800 min-w-0"
            />
          </template>
          <span class="text-[8px] font-bold text-slate-400 shrink-0">{{ getVitalUnit(key) }}</span>
        </div>
      </div>
    </section>

    <!-- Pestañas Clínicas SOAPIE -->
    <div class="bg-blue-600 shadow-md">
      <div class="flex items-center gap-7 px-5">
        <button 
          v-for="tab in clinicalTabs" 
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="[
            'py-3 text-[11px] font-black uppercase tracking-wider transition-all border-b-[3px]',
            activeTab === tab.id 
              ? 'border-white text-white' 
              : 'border-transparent text-blue-100/70 hover:text-white hover:bg-white/10 px-1'
          ]"
        >
          {{ tab.label }}
        </button>
      </div>
    </div>

    <!-- Área de Texto SOAPIE -->
    <div class="pt-1 bg-slate-50/50">
      <div class="border-x border-b border-slate-200 overflow-hidden shadow-sm h-[320px] bg-white flex">
        <div class="w-16 bg-blue-50/50 flex items-center justify-center border-r border-slate-100">
          <span class="text-4xl font-black text-blue-700 uppercase">{{ activeTab }}</span>
        </div>
        <div class="flex-1">
          <textarea 
            v-model="(form as any)[activeTab]"
            :placeholder="(soapiePlaceholders as any)[activeTab]"
            :disabled="isReadOnly"
            class="w-full h-full border-none p-6 text-[13px] font-semibold text-slate-800 bg-transparent focus:ring-0 resize-none leading-relaxed placeholder:italic placeholder:text-slate-300 disabled:opacity-100 disabled:text-slate-800"
          ></textarea>
        </div>
      </div>
    </div>

    <!-- Pie del Formulario / Botones de Acción -->
    <footer class="modal-footer py-2 px-4 bg-slate-50 border-t border-slate-200 flex justify-end items-center gap-3 rounded-b-xl">
      <template v-if="!isReadOnly">
        <button 
          @click="() => handleSubmit(true)"
          class="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2 text-xs font-bold text-white hover:bg-blue-700 transition-all shadow-md shadow-blue-200 active:scale-95"
        >
          <CheckCircle class="h-4 w-4" />
          Firmar
        </button>
        <button 
          @click="() => handleSubmit(false)"
          class="flex items-center gap-2 rounded-lg bg-green-600 px-6 py-2 text-xs font-bold text-white hover:bg-green-700 transition-all shadow-md shadow-green-200 active:scale-95"
        >
          <Save class="h-4 w-4" />
          {{ initialNota ? 'Modificar' : 'Guardar Nota' }}
        </button>
      </template>
      <div v-else class="flex items-center gap-2 px-4 py-2 text-xs font-black text-slate-400 bg-slate-100 rounded-lg uppercase tracking-widest italic">
        <CheckCircle class="h-4 w-4 text-emerald-500" />
        Nota Firmada (Solo Lectura)
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed } from 'vue'
import { Save, CheckCircle, AlertCircle } from 'lucide-vue-next'
import type { Patient, NotaEnfermeria } from '@/types'

const props = defineProps<{
  pacientes: Patient[]
  selectedPatient: Patient | null
  enfermeraProp?: string
  initialNota?: NotaEnfermeria
  isReadOnly?: boolean
}>()

const emit = defineEmits<{
  save: [nota: NotaEnfermeria]
  sign: [nota: NotaEnfermeria]
}>()

// --- State ---
const activeTab = ref('s')
const clinicalTabs = [
  { id: 's', label: 'Subjetivo' },
  { id: 'o', label: 'Objetivo' },
  { id: 'a', label: 'Análisis' },
  { id: 'p', label: 'Plan' },
  { id: 'i', label: 'Intervención' },
  { id: 'e', label: 'Evaluación' },
]

const toast = ref<{ show: boolean; message: string; type: 'success' | 'error' }>({
  show: false,
  message: '',
  type: 'success',
})

const defaultForm = () => ({
  peso: props.initialNota?.signosVitales?.peso || "", 
  talla: props.initialNota?.signosVitales?.talla || "", 
  pCefalico: props.initialNota?.signosVitales?.pCefalico || "", 
  pAbdominal: props.initialNota?.signosVitales?.pAbdominal || "", 
  hemoglucotest: props.initialNota?.signosVitales?.hemoglucotest || props.initialNota?.signosVitales?.glucosa || "",
  presionArterial: props.initialNota?.signosVitales?.presionArterial || "",
  frecuenciaCardiaca: props.initialNota?.signosVitales?.frecuenciaCardiaca || "",
  frecuenciaRespiratoria: props.initialNota?.signosVitales?.frecuenciaRespiratoria || "",
  temp: props.initialNota?.signosVitales?.temperatura || "36.6", 
  spo2: props.initialNota?.signosVitales?.saturacionOxigeno || "", 
  s: props.initialNota?.subjetivo || "", 
  o: props.initialNota?.objetivo || "", 
  a: props.initialNota?.analisis || "", 
  p: props.initialNota?.plan || "", 
  i: props.initialNota?.intervencion || "", 
  e: props.initialNota?.evaluacion || "",
  antecedentes: props.initialNota?.antecedentes || "", 
  diagnosticos: props.initialNota?.diagnosticos || "", 
  farmacia: props.initialNota?.farmacia || "", 
  laboratorio: props.initialNota?.laboratorio || "", 
  imagen: props.initialNota?.imagen || "",
})

const form = reactive(defaultForm())

// Presion Arterial dividida SIS / DIA
const sis = computed({
  get: () => form.presionArterial.split('/')[0] || '',
  set: (val) => {
    const diaVal = form.presionArterial.split('/')[1] || ''
    if (!val && !diaVal) form.presionArterial = ''
    else form.presionArterial = `${val}/${diaVal}`
  }
})

const dia = computed({
  get: () => form.presionArterial.split('/')[1] || '',
  set: (val) => {
    const sisVal = form.presionArterial.split('/')[0] || ''
    if (!sisVal && !val) form.presionArterial = ''
    else form.presionArterial = `${sisVal}/${val}`
  }
})
const selectedTurno = ref<'dia' | 'noche'>(
  (props.initialNota?.turno as 'dia' | 'noche') || 'dia'
)

const nombreEnfermeraActual = computed(() => {
  return props.enfermeraProp || sessionStorage.getItem('empleadoLogueado') || sessionStorage.getItem('usuarioLogueado') || 'Enfermero/a en turno'
})
// Update form if initialNota changes (useful if the modal stays open but note changes)
watch(() => props.initialNota, (newNote) => {
  if (newNote) {
      if (newNote.turno) {
  selectedTurno.value = (newNote.turno === 'noche' ? 'noche' : 'dia') as 'dia' | 'noche'
  }
    form.peso = newNote.signosVitales?.peso || ""
    form.talla = newNote.signosVitales?.talla || ""
    form.pCefalico = newNote.signosVitales?.pCefalico || ""
    form.pAbdominal = newNote.signosVitales?.pAbdominal || ""
    form.hemoglucotest = newNote.signosVitales?.hemoglucotest || newNote.signosVitales?.glucosa || ""
    form.presionArterial = newNote.signosVitales?.presionArterial || ""
    form.frecuenciaCardiaca = newNote.signosVitales?.frecuenciaCardiaca || ""
    form.frecuenciaRespiratoria = newNote.signosVitales?.frecuenciaRespiratoria || ""
    form.temp = newNote.signosVitales?.temperatura || "36.6"
    form.spo2 = newNote.signosVitales?.saturacionOxigeno || ""
    form.s = newNote.subjetivo || ""
    form.o = newNote.objetivo || ""
    form.a = newNote.analisis || ""
    form.p = newNote.plan || ""
    form.i = newNote.intervencion || ""
    form.e = newNote.evaluacion || ""
    form.antecedentes = newNote.antecedentes || ""
    form.diagnosticos = newNote.diagnosticos || ""
    form.farmacia = newNote.farmacia || ""
    form.laboratorio = newNote.laboratorio || ""
    form.imagen = newNote.imagen || ""
  }
  
}, { deep: true })

// --- UI Configuration ---
const etiquetasVitals: Record<string, string> = {
  peso: "PESO", talla: "TALLA", pCefalico: "P. CEFÁLICO", pAbdominal: "P. ABDOMINAL",
  hemoglucotest: "HEMOGLUCOTEST", presionArterial: "PRESIÓN ART.", frecuenciaCardiaca: "FREC. CARD.", frecuenciaRespiratoria: "FREC. RESP.",
  temp: "TEMPERATURA", spo2: "SATURACIÓN"
}

const placeholderVitals: Record<string, string> = {
  peso: "-", talla: "-", pCefalico: "-", pAbdominal: "-", hemoglucotest: "-", presionArterial: "-", frecuenciaCardiaca: "-", frecuenciaRespiratoria: "-", temp: "36.6", spo2: "-"
}

const soapieLabels = {
  s: "S", o: "O", a: "A", p: "P", i: "I", e: "E"
}

const soapiePlaceholders = {
  s: "Paciente refiere...",
  o: "Hallazgos observables...",
  a: "Diagnósticos o interpretación...",
  p: "Plan de acción...",
  i: "Intervenciones realizadas...",
  e: "Respuesta del paciente..."
}

// --- Logic ---
function getSoapieColor(key: string) {
  const colors: Record<string, string> = {
    s: 'bg-blue-400', o: 'bg-emerald-400', a: 'bg-indigo-400', p: 'bg-orange-400', i: 'bg-purple-400', e: 'bg-rose-400'
  }
  return colors[key] || 'bg-slate-400'
}

function getVitalUnit(key: string) {
  const units: Record<string, string> = {
    peso: 'kg', talla: 'cm', pCefalico: 'cm', pAbdominal: 'cm', hemoglucotest: 'mg/dL', presionArterial: 'mmHg', frecuenciaCardiaca: 'lpm', frecuenciaRespiratoria: 'rpm', temp: '°C', spo2: '%'
  }
  return units[key] || ''
}

function showToast(message: string, type: 'success' | 'error') {
  toast.value = { show: true, message, type }
  setTimeout(() => { toast.value.show = false }, 3000)
}

function handleSubmit(shouldSign = false) {
  if (!props.selectedPatient) {
    showToast('Seleccione un paciente antes de continuar.', 'error')
    return
  }

  // If read-only, we shouldn't even be able to call this, but safety first
  if (props.isReadOnly) return

  // STRICT VALIDATION: All Signos Vitales must be filled
  if (!form.peso || !form.talla || !form.pCefalico || !form.pAbdominal || !form.hemoglucotest || !form.presionArterial || !form.frecuenciaCardiaca || !form.frecuenciaRespiratoria || !form.temp || !form.spo2) {
    showToast('Por favor, complete todos los Signos Vitales antes de guardar.', 'error')
    return
  }

  // STRICT VALIDATION: All SOAPIE fields must be filled
  if (!form.s || !form.o || !form.a || !form.p || !form.i || !form.e) {
    showToast('Por favor, complete todas las secciones del SOAPIE antes de guardar.', 'error')
    return
  }

  const now = new Date()
  
  // Debug: mostrar el paciente seleccionado para verificar
  console.log('Paciente seleccionado en handleSubmit:', JSON.stringify(props.selectedPatient))
  console.log('ID del paciente:', props.selectedPatient?.id)
  console.log('Todas las props:', JSON.stringify(props.selectedPatient))
  
  // Obtener el ID del paciente de forma segura
  let pacienteIdValue = ''
  const pacienteId = props.selectedPatient?.id
  if (pacienteId && pacienteId !== undefined && pacienteId !== null && pacienteId !== '' && pacienteId !== 'undefined') {
    pacienteIdValue = pacienteId
  } else {
    // Si no hay paciente seleccionado, mostrar error
    showToast('Error: No se ha seleccionado un paciente válido', 'error')
    return
  }
  
  const nota: NotaEnfermeria = {
    id: props.initialNota?.id || `n${Date.now()}`,
    pacienteId: pacienteIdValue,
    fecha: props.initialNota?.fecha || now.toISOString().split('T')[0],
    hora: props.initialNota?.hora || `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`,
    turno: selectedTurno.value,
    tipo: props.initialNota?.tipo || 'valoracion',
    signosVitales: {
      temperatura: form.temp,
      saturacionOxigeno: form.spo2,
      peso: form.peso,
      talla: form.talla,
      pCefalico: form.pCefalico,
      pAbdominal: form.pAbdominal,
      hemoglucotest: form.hemoglucotest,
      presionArterial: form.presionArterial,
      frecuenciaCardiaca: form.frecuenciaCardiaca,
      frecuenciaRespiratoria: form.frecuenciaRespiratoria,
    },
    subjetivo: form.s,
    objetivo: form.o,
    analisis: form.a,
    plan: form.p,
    intervencion: form.i,
    evaluacion: form.e,
    antecedentes: form.antecedentes,
    diagnosticos: form.diagnosticos,
    farmacia: form.farmacia,
    laboratorio: form.laboratorio,
    imagen: form.imagen,
    enfermera: props.initialNota?.enfermera || nombreEnfermeraActual.value,
    isFirmada: shouldSign || props.initialNota?.isFirmada
  }

  if (shouldSign) {
    emit('sign', nota)
  } else {
    emit('save', nota)
  }
}

function clearVitals() {
  form.peso = ""
  form.talla = ""
  form.pCefalico = ""
  form.pAbdominal = ""
  form.hemoglucotest = ""
  form.presionArterial = ""
  form.frecuenciaCardiaca = ""
  form.frecuenciaRespiratoria = ""
  form.temp = ""
  form.spo2 = ""
}

defineExpose({
  clearVitals
})
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 5px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }

.toast-enter-active, .toast-leave-active {
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.toast-enter-from, .toast-leave-to {
  opacity: 0;
  transform: translateX(100px);
}

@media print {
  .modal-footer { display: none !important; }
  .bg-blue-color-print { background-color: white !important; }
}
</style>
