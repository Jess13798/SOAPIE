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
    <NoteShiftBar
      :turno="selectedTurno"
      :enfermera="nombreEnfermeraActual"
      :read-only="isReadOnly"
      @update:turno="selectedTurno = $event"
    />

    <!-- Fila de Signos Vitales -->
    <VitalsGrid :form="form" :read-only="isReadOnly" />

    <!-- SOAPIE -->
    <SoapieEditor :form="form" :read-only="isReadOnly" />

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
import NoteShiftBar from './NoteShiftBar.vue'
import VitalsGrid from './VitalsGrid.vue'
import SoapieEditor from './SoapieEditor.vue'

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

function showToast(message: string, type: 'success' | 'error') {
  toast.value = { show: true, message, type }
  setTimeout(() => { toast.value.show = false }, 3000)
}

function handleSubmit(shouldSign = false) {
  if (!props.selectedPatient) {
    showToast('Seleccione un paciente antes de continuar.', 'error')
    return
  }

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
