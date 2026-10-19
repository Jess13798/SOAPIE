<template>
  <!-- min-h-full: el formulario ocupa al menos toda la altura del modal, así el
       pie con Firmar/Guardar queda siempre abajo (mt-auto) y el contenido no
       "salta" al cambiar de pestaña SOAPIE. -->
  <div class="flex min-h-full flex-col gap-0 bg-white">
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

    <!-- Turno (automático) y Autoría -->
    <NoteShiftBar
      :turno="turnoMostrado"
      :enfermera="nombreEnfermeraActual"
    />

    <!-- Fila de Signos Vitales -->
    <VitalsGrid :form="form" :read-only="isReadOnly" />

    <!-- SOAPIE -->
    <SoapieEditor
      v-model:section="activeTab"
      :form="form"
      :read-only="isReadOnly"
      :permite-editar-analisis="permiteEditarAnalisisAnterior"
    />

    <p
      v-if="planFueHeredado && ['a', 'p', 'i', 'e'].includes(activeTab)"
      class="border-b border-sky-100 bg-sky-50 px-4 py-1.5 text-[11px] font-semibold text-sky-800"
    >
      Plan heredado de la nota anterior: revise los diagnósticos y marque en Intervención lo que se ejecutó.
    </p>

    <SoapieCarePlanSelector
      v-if="['a', 'p', 'i', 'e'].includes(activeTab)"
      v-model="planCuidados"
      :section="activeTab"
      :disabled="isReadOnly"
    />

    <!-- Pie del Formulario / Botones de Acción -->
    <!-- `sticky bottom-0` mantiene los botones pegados al borde inferior visible
         del modal sin importar la pestaña SOAPIE ni el largo del contenido. -->
    <footer class="modal-footer sticky bottom-0 z-10 mt-auto py-2 px-4 bg-slate-50 border-t border-slate-200 flex justify-end items-center gap-3 rounded-b-xl">
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
import type { Patient, NotaEnfermeria, PlanCuidadoNota } from '@/types'
import NoteShiftBar from './NoteShiftBar.vue'
import VitalsGrid from './VitalsGrid.vue'
import SoapieEditor from './SoapieEditor.vue'
import SoapieCarePlanSelector from './SoapieCarePlanSelector.vue'
import {
  NIC_BLOQUE_TITULO,
  NOC_BLOQUE_TITULO,
  NOC_EVALUACION_BLOQUE_TITULO,
  NOC_META_MARCADOR,
  NOC_RESULTADO_MARCADOR,
  heredarPlanCuidados,
  hidratarPlanCuidados,
  lineasIntervenciones,
} from '../planCuidados'

const props = defineProps<{
  pacientes: Patient[]
  selectedPatient: Patient | null
  enfermeraProp?: string
  initialNota?: NotaEnfermeria
  // Nota más reciente del paciente. Solo se usa al crear una nota NUEVA, para
  // precargar el plan de cuidados (NANDA/NOC/NIC) del turno anterior.
  notaAnterior?: NotaEnfermeria | null
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
  a: textoLibre(props.initialNota?.analisis || "", 'DIAGNOSTICOS NANDA'),
  p: textoLibre(props.initialNota?.plan || "", NOC_BLOQUE_TITULO),
  i: textoLibre(props.initialNota?.intervencion || "", NIC_BLOQUE_TITULO),
  e: textoLibre(props.initialNota?.evaluacion || "", NOC_EVALUACION_BLOQUE_TITULO),
  antecedentes: props.initialNota?.antecedentes || "", 
  diagnosticos: props.initialNota?.diagnosticos || "", 
  farmacia: props.initialNota?.farmacia || "", 
  laboratorio: props.initialNota?.laboratorio || "", 
  imagen: props.initialNota?.imagen || "",
})

const form = reactive(defaultForm())
// Sección SOAPIE activa. La maneja SoapieEditor (v-model:section) y la usa el
// selector de plan de cuidados para saber a qué sección agregar el NANDA/NOC/NIC.
const activeTab = ref<'s' | 'o' | 'a' | 'p' | 'i' | 'e'>('s')
// El textarea de Análisis solo se muestra si la nota traía un análisis previo;
// en notas nuevas el Análisis se arma con los diagnósticos NANDA seleccionados.
const permiteEditarAnalisisAnterior = ref(
  Boolean(textoLibre(props.initialNota?.analisis || '', 'DIAGNOSTICOS NANDA')),
)
const planFueHeredado = ref(!props.initialNota && Boolean(props.notaAnterior?.planCuidados?.length))
const planCuidados = ref<PlanCuidadoNota[]>(
  props.initialNota ? hidratarPlanCuidados(props.initialNota) : heredarPlanCuidados(props.notaAnterior),
)
const draftId = ref(props.initialNota?.id || `n${Date.now()}`)

// El turno ya no se elige: el servidor lo deriva de la hora al guardar la
// nota. Aquí solo se muestra. Para una nota ya guardada se usa su turno; para
// una nueva, el de la sesión (que el backend derivó al iniciar sesión) o la
// hora local como respaldo.
function turnoDesdeSesion(): 'dia' | 'noche' {
  const guardado = sessionStorage.getItem('turno')
  if (guardado === 'dia' || guardado === 'noche') return guardado
  const hora = new Date().getHours()
  return hora >= 7 && hora < 19 ? 'dia' : 'noche'
}

const turnoMostrado = computed<'dia' | 'noche'>(() => {
  if (props.initialNota?.turno === 'noche') return 'noche'
  if (props.initialNota?.turno === 'dia') return 'dia'
  return turnoDesdeSesion()
})

const nombreEnfermeraActual = computed(() => {
  return props.enfermeraProp || sessionStorage.getItem('empleadoLogueado') || sessionStorage.getItem('usuarioLogueado') || 'Enfermero/a en turno'
})

function textoLibre(texto: string, titulo: string) {
  const marker = `\n\n[${titulo}]`
  return texto.split(marker)[0].trimEnd()
}

function bloqueEstructurado(texto: string, titulo: string, lineas: string[]) {
  const base = textoLibre(texto, titulo)
  if (!lineas.length) return base
  const marker = `\n\n[${titulo}]`
  return `${base}${marker}\n${lineas.join('\n')}`
}

function lineasPlan() {
  const lineas: string[] = []
  for (const item of planCuidados.value) {
    for (const noc of item.noc || []) {
      if (!item.nocIds.includes(noc.id)) continue
      const meta = item.nocMetas?.[noc.id]?.trim()
      lineas.push(`NOC ${noc.codigo}: ${noc.resultado}${meta ? `${NOC_META_MARCADOR} ${meta}` : ''}`)
    }
    for (const nic of item.nic || []) {
      if (item.nicIds.includes(nic.id)) {
        lineas.push(`NIC ${nic.codigo}: ${nic.intervencion}`)
      }
    }
  }
  return lineas
}

function lineasEvaluacion() {
  const lineas: string[] = []
  for (const item of planCuidados.value) {
    for (const noc of item.noc || []) {
      if (!item.nocIds.includes(noc.id)) continue
      const resultado = item.nocEvaluaciones?.[noc.id]?.trim()
      if (resultado) lineas.push(`NOC ${noc.codigo}: ${noc.resultado}${NOC_RESULTADO_MARCADOR} ${resultado}`)
    }
  }
  return lineas
}

// Update form if initialNota changes (useful if the modal stays open but note changes)
watch(() => props.initialNota, (newNote) => {
  if (newNote) {
      draftId.value = newNote.id
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
    form.a = textoLibre(newNote.analisis || "", 'DIAGNOSTICOS NANDA')
    permiteEditarAnalisisAnterior.value = Boolean(form.a)
    form.p = textoLibre(newNote.plan || "", NOC_BLOQUE_TITULO)
    form.i = textoLibre(newNote.intervencion || "", NIC_BLOQUE_TITULO)
    form.e = textoLibre(newNote.evaluacion || "", NOC_EVALUACION_BLOQUE_TITULO)
    form.antecedentes = newNote.antecedentes || ""
    form.diagnosticos = newNote.diagnosticos || ""
    form.farmacia = newNote.farmacia || ""
    form.laboratorio = newNote.laboratorio || ""
    form.imagen = newNote.imagen || ""
    planCuidados.value = hidratarPlanCuidados(newNote)
  }
  else {
    draftId.value = `n${Date.now()}`
    planCuidados.value = heredarPlanCuidados(props.notaAnterior)
    planFueHeredado.value = Boolean(props.notaAnterior?.planCuidados?.length)
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
  if (!form.s || !form.o || !form.p || !form.i || !form.e) {
    showToast('Por favor, complete todas las secciones del SOAPIE antes de guardar.', 'error')
    return
  }

  if (!form.a.trim() && planCuidados.value.length === 0) {
    showToast('Seleccione al menos un diagnóstico NANDA para completar la sección Análisis.', 'error')
    return
  }

  // Las intervenciones marcadas como "no realizada" deben explicar el motivo:
  // es justamente el dato que permite ver por qué no se cumplió el plan.
  const nicSinMotivo = planCuidados.value.some(item =>
    (item.nic || []).some(nic =>
      (item.nicNoRealizadas && Object.prototype.hasOwnProperty.call(item.nicNoRealizadas, nic.id))
      && !(item.nicNoRealizadas?.[nic.id] || '').trim(),
    ),
  )
  if (nicSinMotivo) {
    showToast('Indique el motivo de cada intervención marcada como "No realizada".', 'error')
    return
  }

  const now = new Date()

  let pacienteIdValue = ''
  const pacienteId = props.selectedPatient?.id
  if (pacienteId && pacienteId !== undefined && pacienteId !== null && pacienteId !== '' && pacienteId !== 'undefined') {
    pacienteIdValue = pacienteId
  } else {
    showToast('Error: No se ha seleccionado un paciente válido', 'error')
    return
  }
  
  const nota: NotaEnfermeria = {
    id: draftId.value,
    pacienteId: pacienteIdValue,
    fecha: props.initialNota?.fecha || now.toISOString().split('T')[0],
    hora: props.initialNota?.hora || `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`,
    turno: turnoMostrado.value,
    tipo: props.initialNota?.tipo || 'valoracion',
    signosVitales: {
      temperatura: form.temp,
      saturacionOxigeno: form.spo2,
      presionArterial: form.presionArterial,
      frecuenciaCardiaca: form.frecuenciaCardiaca,
      frecuenciaRespiratoria: form.frecuenciaRespiratoria,
      peso: form.peso,
      talla: form.talla,
      pCefalico: form.pCefalico,
      pAbdominal: form.pAbdominal,
      hemoglucotest: form.hemoglucotest,
    },
    subjetivo: form.s,
    objetivo: form.o,
    analisis: bloqueEstructurado(form.a, 'DIAGNOSTICOS NANDA', []),
    plan: bloqueEstructurado(form.p, NOC_BLOQUE_TITULO, lineasPlan()),
    intervencion: bloqueEstructurado(form.i, NIC_BLOQUE_TITULO, lineasIntervenciones(planCuidados.value)),
    evaluacion: bloqueEstructurado(form.e, NOC_EVALUACION_BLOQUE_TITULO, lineasEvaluacion()),
    antecedentes: form.antecedentes,
    diagnosticos: form.diagnosticos,
    farmacia: form.farmacia,
    laboratorio: form.laboratorio,
    imagen: form.imagen,
    planCuidados: planCuidados.value,
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
  transition: all 0.3s ease;
}
.toast-enter-from, .toast-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

@media print {
  .modal-footer { display: none; }
}
</style>
