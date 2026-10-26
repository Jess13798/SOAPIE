<template>
  <!-- min-h-full: el formulario ocupa al menos toda la altura del modal, así el
       pie con Firmar/Guardar queda siempre abajo (mt-auto) y el contenido no
       "salta" al cambiar de pestaña SOAPIE. -->
  <div class="flex min-h-full flex-col gap-0 bg-white">
    <!-- Toast notification -->
    <Transition name="toast">
      <div
        v-if="toast.show"
        role="alert"
        aria-live="assertive"
        :class="[
          'fixed top-4 right-4 z-[210] flex max-w-[calc(100vw-2rem)] items-start gap-2 rounded-lg border px-4 py-3 text-sm font-semibold leading-relaxed shadow-2xl',
          toast.type === 'success'
            ? 'border-emerald-700 bg-emerald-600 text-white'
            : 'border-red-800 bg-red-700 text-white'
        ]"
      >
        <CheckCircle v-if="toast.type === 'success'" class="mt-0.5 h-4 w-4 shrink-0" />
        <AlertCircle v-else class="mt-0.5 h-4 w-4 shrink-0" />
        <span>{{ toast.message }}</span>
      </div>
    </Transition>

    <!-- Turno (automático) y Autoría -->
    <NoteShiftBar
      :turno="turnoMostrado"
      :enfermera="nombreEnfermeraActual"
    />

    <!-- Confirmación de firma -->
    <Teleport to="body">
      <div
        v-if="pendingSignNote"
        class="fixed inset-0 z-[220] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
        @keydown.esc="cancelSign"
      >
        <section
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="sign-confirmation-title"
          aria-describedby="sign-confirmation-message"
          class="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl"
        >
          <h2 id="sign-confirmation-title" class="text-lg font-black text-slate-900">
            ¿Desea firmar la nota de enfermería?
          </h2>
          <p id="sign-confirmation-message" class="mt-3 text-sm leading-relaxed text-slate-600">
            Después de firmarla no se podrán realizar cambios y la nota quedará disponible solo en modo lectura.
          </p>
          <div class="mt-6 flex justify-end gap-3">
            <button
              type="button"
              class="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-100"
              @click="cancelSign"
            >
              Cancelar
            </button>
            <button
              type="button"
              class="rounded-lg bg-blue-700 px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-blue-800"
              @click="confirmSign"
            >
              Sí, firmar
            </button>
          </div>
        </section>
      </div>
    </Teleport>

    <!-- Fila de Signos Vitales -->
    <VitalsGrid :form="form" :read-only="isReadOnly" :campos-obligatorios="camposObligatorios" />

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
          :disabled="isSubmitting"
          class="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2 text-xs font-bold text-white hover:bg-blue-700 transition-all shadow-md shadow-blue-200 active:scale-95 disabled:cursor-wait disabled:opacity-60"
        >
          <CheckCircle class="h-4 w-4" />
          Firmar
        </button>
        <button 
          @click="() => handleSubmit(false)"
          :disabled="isSubmitting"
          class="flex items-center gap-2 rounded-lg bg-green-600 px-6 py-2 text-xs font-bold text-white hover:bg-green-700 transition-all shadow-md shadow-green-200 active:scale-95 disabled:cursor-wait disabled:opacity-60"
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
import { CAMPOS_OBLIGATORIOS_POR_DEFECTO } from '../vitalesConfig'
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

const props = withDefaults(defineProps<{
  pacientes: Patient[]
  selectedPatient: Patient | null
  enfermeraProp?: string
  initialNota?: NotaEnfermeria
  // Nota más reciente del paciente. Solo se usa al crear una nota NUEVA, para
  // precargar el plan de cuidados (NANDA/NOC/NIC) del turno anterior.
  notaAnterior?: NotaEnfermeria | null
  isReadOnly?: boolean
  isSubmitting?: boolean
  // Signos vitales que exige el servicio actual (los define el backend).
  camposObligatorios?: string[]
}>(), {
  camposObligatorios: () => [...CAMPOS_OBLIGATORIOS_POR_DEFECTO],
})

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
const pendingSignNote = ref<NotaEnfermeria | null>(null)

const defaultForm = () => ({
  peso: props.initialNota?.signosVitales?.peso ?? "",
  talla: props.initialNota?.signosVitales?.talla ?? "",
  pCefalico: props.initialNota?.signosVitales?.pCefalico ?? "",
  pAbdominal: props.initialNota?.signosVitales?.pAbdominal ?? "",
  hemoglucotest: props.initialNota?.signosVitales?.hemoglucotest ?? props.initialNota?.signosVitales?.glucosa ?? "",
  presionArterial: props.initialNota?.signosVitales?.presionArterial ?? "",
  frecuenciaCardiaca: props.initialNota?.signosVitales?.frecuenciaCardiaca ?? "",
  frecuenciaRespiratoria: props.initialNota?.signosVitales?.frecuenciaRespiratoria ?? "",
  temp: props.initialNota?.signosVitales?.temperatura ?? "",
  spo2: props.initialNota?.signosVitales?.saturacionOxigeno ?? "",
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

// Los diagnósticos NANDA seleccionados se escriben solos en el texto de la
// sección Análisis (con su comentario), así quedan guardados aunque la
// enfermera no teclee nada en el textarea.
function lineasDiagnosticosNanda() {
  return planCuidados.value.map(item => {
    const comentario = item.comentario?.trim()
    return `NANDA ${item.codigoNANDA}: ${item.diagnostico}${comentario ? ` | Comentario: ${comentario}` : ''}`
  })
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
    form.peso = newNote.signosVitales?.peso ?? ""
    form.talla = newNote.signosVitales?.talla ?? ""
    form.pCefalico = newNote.signosVitales?.pCefalico ?? ""
    form.pAbdominal = newNote.signosVitales?.pAbdominal ?? ""
    form.hemoglucotest = newNote.signosVitales?.hemoglucotest ?? newNote.signosVitales?.glucosa ?? ""
    form.presionArterial = newNote.signosVitales?.presionArterial ?? ""
    form.frecuenciaCardiaca = newNote.signosVitales?.frecuenciaCardiaca ?? ""
    form.frecuenciaRespiratoria = newNote.signosVitales?.frecuenciaRespiratoria ?? ""
    form.temp = newNote.signosVitales?.temperatura ?? ""
    form.spo2 = newNote.signosVitales?.saturacionOxigeno ?? ""
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

function cancelSign() {
  pendingSignNote.value = null
}

function confirmSign() {
  if (!pendingSignNote.value || props.isSubmitting || props.isReadOnly) return
  emit('sign', pendingSignNote.value)
  pendingSignNote.value = null
}

function normalizedText(value: unknown) {
  return String(value ?? '').replace(/\r\n/g, '\n').trim()
}

function normalizedVital(value: unknown) {
  const text = String(value ?? '').trim()
  if (!text) return ''
  const numeric = Number(text)
  return Number.isFinite(numeric) ? String(numeric) : text
}

function vitalStateFromForm() {
  return {
    peso: normalizedVital(form.peso),
    talla: normalizedVital(form.talla),
    pCefalico: normalizedVital(form.pCefalico),
    pAbdominal: normalizedVital(form.pAbdominal),
    hemoglucotest: normalizedVital(form.hemoglucotest),
    presionArterial: normalizedVital(form.presionArterial),
    frecuenciaCardiaca: normalizedVital(form.frecuenciaCardiaca),
    frecuenciaRespiratoria: normalizedVital(form.frecuenciaRespiratoria),
    temperatura: normalizedVital(form.temp),
    saturacionOxigeno: normalizedVital(form.spo2),
  }
}

function vitalStateFromNota(nota?: NotaEnfermeria) {
  const vitals = nota?.signosVitales || {}
  return {
    peso: normalizedVital(vitals.peso),
    talla: normalizedVital(vitals.talla),
    pCefalico: normalizedVital(vitals.pCefalico),
    pAbdominal: normalizedVital(vitals.pAbdominal),
    hemoglucotest: normalizedVital(vitals.hemoglucotest ?? vitals.glucosa),
    presionArterial: normalizedVital(vitals.presionArterial),
    frecuenciaCardiaca: normalizedVital(vitals.frecuenciaCardiaca),
    frecuenciaRespiratoria: normalizedVital(vitals.frecuenciaRespiratoria),
    temperatura: normalizedVital(vitals.temperatura),
    saturacionOxigeno: normalizedVital(vitals.saturacionOxigeno),
  }
}

function normalizedPlan(items: PlanCuidadoNota[] = []) {
  return items.map(item => ({
    idNANDA: item.idNANDA,
    comentario: normalizedText(item.comentario),
    nocIds: [...(item.nocIds || [])].sort((a, b) => a - b),
    nicIds: [...(item.nicIds || [])].sort((a, b) => a - b),
    nicRealizadasIds: [...(item.nicRealizadasIds || [])].sort((a, b) => a - b),
    nocMetas: Object.fromEntries(Object.entries(item.nocMetas || {}).sort(([a], [b]) => Number(a) - Number(b))),
    nocEvaluaciones: Object.fromEntries(Object.entries(item.nocEvaluaciones || {}).sort(([a], [b]) => Number(a) - Number(b))),
  })).sort((a, b) => a.idNANDA - b.idNANDA)
}

function editableStateFromForm() {
  return {
    vitals: vitalStateFromForm(),
    subjetivo: normalizedText(form.s),
    objetivo: normalizedText(form.o),
    analisis: normalizedText(form.a),
    plan: normalizedText(form.p),
    intervencion: normalizedText(form.i),
    evaluacion: normalizedText(form.e),
    planCuidados: normalizedPlan(planCuidados.value),
  }
}

function editableStateFromNota(nota: NotaEnfermeria) {
  return {
    vitals: vitalStateFromNota(nota),
    subjetivo: normalizedText(nota.subjetivo),
    objetivo: normalizedText(nota.objetivo),
    analisis: normalizedText(textoLibre(nota.analisis || '', 'DIAGNOSTICOS NANDA')),
    plan: normalizedText(textoLibre(nota.plan || '', 'RESULTADOS NOC ESPERADOS Y NIC PLANIFICADAS')),
    intervencion: normalizedText(textoLibre(nota.intervencion || '', 'INTERVENCIONES NIC REALIZADAS')),
    evaluacion: normalizedText(textoLibre(nota.evaluacion || '', 'EVALUACION DE RESULTADOS NOC')),
    planCuidados: normalizedPlan(hidratarPlanCuidados(nota)),
  }
}

// Nombres legibles de los signos vitales, solo para los mensajes de validación
// (las claves coinciden con las del formulario y las de VitalsGrid).
const etiquetasVitals: Record<string, string> = {
  peso: 'PESO', talla: 'TALLA', pCefalico: 'P. CEFÁLICO', pAbdominal: 'P. ABDOMINAL',
  hemoglucotest: 'HEMOGLUCOTEST', presionArterial: 'PRESIÓN ART.', frecuenciaCardiaca: 'FREC. CARD.', frecuenciaRespiratoria: 'FREC. RESP.',
  temp: 'TEMPERATURA', spo2: 'SATURACIÓN'
}

// Etiquetas por clave del payload, para el mensaje de campos obligatorios.
const etiquetasVitalesConfig: Record<string, string> = {
  peso: 'PESO', talla: 'TALLA', pCefalico: 'P. CEFÁLICO', pAbdominal: 'P. ABDOMINAL',
  hemoglucotest: 'HEMOGLUCOTEST', presionArterial: 'PRESIÓN ART.',
  frecuenciaCardiaca: 'FREC. CARD.', frecuenciaRespiratoria: 'FREC. RESP.',
  temperatura: 'TEMPERATURA', saturacionOxigeno: 'SATURACIÓN',
}

function validateVitales(isExistingNote: boolean, changedVitalFields: string[]) {
  const values: Record<string, string> = {
    peso: form.peso,
    talla: form.talla,
    pCefalico: form.pCefalico,
    pAbdominal: form.pAbdominal,
    hemoglucotest: form.hemoglucotest,
    frecuenciaCardiaca: form.frecuenciaCardiaca,
    frecuenciaRespiratoria: form.frecuenciaRespiratoria,
    temperatura: form.temp,
    saturacionOxigeno: form.spo2,
  }
  const decimalLimits: Record<string, number> = {
    peso: 999.99,
    talla: 999.99,
    pCefalico: 999.99,
    pAbdominal: 999.99,
    hemoglucotest: 999.99,
    temperatura: 99.99,
  }
  const fieldsToValidate = isExistingNote ? changedVitalFields : Object.keys(values)

  for (const field of fieldsToValidate) {
    const value = values[field]
    if (!value) continue

    if (field in decimalLimits) {
      if (!/^\d{1,3}(\.\d{1,2})?$/.test(value) || Number(value) > decimalLimits[field]) {
        return `Revise el valor de ${etiquetasVitals[field === 'temperatura' ? 'temp' : field].toLowerCase()}; debe ser numérico y tener hasta dos decimales.`
      }
    } else if (field === 'saturacionOxigeno') {
      if (!/^\d{1,3}$/.test(value) || Number(value) > 100) {
        return 'La saturación de oxígeno debe ser un número entre 0 y 100%.'
      }
    } else if (!/^\d+$/.test(value)) {
      return 'La frecuencia cardiaca y respiratoria deben ser números enteros no negativos.'
    }
  }

  const pressureChanged = !isExistingNote || changedVitalFields.includes('presionArterial')
  if (pressureChanged && form.presionArterial) {
    const match = form.presionArterial.match(/^(\d{1,3})\/(\d{1,3})$/)
    if (!match || Number(match[1]) <= Number(match[2]) || Number(match[2]) === 0) {
      return 'La presión arterial debe tener formato sistólica/diastólica y la sistólica debe ser mayor.'
    }
  }
  return ''
}

function handleSubmit(shouldSign = false) {
  if (!props.selectedPatient) {
    showToast('Seleccione un paciente antes de continuar.', 'error')
    return
  }

  if (props.isReadOnly || props.isSubmitting) return

  const isExistingNote = Boolean(props.initialNota && /^\d+$/.test(props.initialNota.id))
  // Solo se exigen los campos configurados para el servicio actual. Los demás
  // se pueden dejar vacíos (p. ej. presión arterial en hospitalización
  // pediátrica).
  const valoresPorCampo: Record<string, string> = {
    peso: form.peso,
    talla: form.talla,
    pCefalico: form.pCefalico,
    pAbdominal: form.pAbdominal,
    hemoglucotest: form.hemoglucotest,
    presionArterial: form.presionArterial,
    frecuenciaCardiaca: form.frecuenciaCardiaca,
    frecuenciaRespiratoria: form.frecuenciaRespiratoria,
    temperatura: form.temp,
    saturacionOxigeno: form.spo2,
  }
  const vitalesFaltantes = props.camposObligatorios
    .filter(campo => !String(valoresPorCampo[campo] || '').trim())
    .map(campo => etiquetasVitalesConfig[campo] || campo)
  if (!isExistingNote && vitalesFaltantes.length > 0) {
    showToast(`Complete los signos vitales obligatorios: ${vitalesFaltantes.join(', ')}.`, 'error')
    return
  }

  if (![form.s, form.o, form.p, form.i, form.e].every(value => value.trim())) {
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

  const initialState = props.initialNota ? editableStateFromNota(props.initialNota) : null
  const currentState = editableStateFromForm()
  const vitalFields = Object.keys(currentState.vitals) as Array<keyof typeof currentState.vitals>
  const changedVitalFields = initialState
    ? vitalFields.filter(field => currentState.vitals[field] !== initialState.vitals[field])
    : vitalFields
  if (isExistingNote && changedVitalFields.length && !Object.values(currentState.vitals).some(Boolean)) {
    showToast('Registre al menos un signo vital para guardar una nueva toma.', 'error')
    return
  }
  const vitalValidationError = validateVitales(isExistingNote, changedVitalFields)
  if (vitalValidationError) {
    showToast(vitalValidationError, 'error')
    return
  }

  const noteHasChanges = !isExistingNote || !initialState || JSON.stringify(currentState) !== JSON.stringify(initialState)
  const signingChanges = shouldSign && !props.initialNota?.isFirmada
  if (!noteHasChanges && !signingChanges) {
    showToast('No hay cambios. No se guardó la nota ni se agregó una toma de signos vitales.', 'success')
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
    analisis: bloqueEstructurado(form.a, 'DIAGNOSTICOS NANDA', lineasDiagnosticosNanda()),
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
    pendingSignNote.value = nota
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
