<template>
  <section v-if="section !== 's' && section !== 'o'" class="space-y-4 border-b border-slate-200 bg-white p-4">
    <div>
      <h3 class="text-sm font-black uppercase tracking-wide text-slate-800">
        {{ sectionTitle }}
      </h3>
      <p class="mt-1 text-xs text-slate-600">{{ sectionDescription }}</p>
    </div>

    <div v-if="section === 'a'" class="relative">
      <label for="buscar-nanda" class="sr-only">Buscar diagnóstico NANDA por código o texto</label>
      <!-- El campo actúa de interruptor: un clic sobre él abre o contrae la lista.
           El botón de la lupa repite la acción y da un objetivo de clic claro. -->
      <div class="flex items-stretch gap-2">
        <input
          id="buscar-nanda"
          ref="buscadorRef"
          v-model="texto"
          type="search"
          maxlength="100"
          autocomplete="off"
          :disabled="disabled"
          role="combobox"
          aria-autocomplete="list"
          aria-controls="nanda-resultados"
          :aria-expanded="mostrarResultados"
          placeholder="Buscar diagnóstico NANDA por código o texto"
          class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 disabled:bg-slate-100"
          @click="alternarResultados"
          @keydown.esc="mostrarResultados = false"
        />
        <button
          type="button"
          :disabled="disabled"
          class="flex shrink-0 items-center justify-center rounded-lg border border-slate-300 px-3 text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-700 disabled:opacity-50"
          :aria-label="mostrarResultados ? 'Contraer resultados' : 'Desplegar resultados'"
          :aria-expanded="mostrarResultados"
          aria-controls="nanda-resultados"
          @click="alternarResultados"
        >
          <Search class="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
      <!-- El desplegable se teleporta al body: dentro del modal queda atrapado por
           los contenedores con overflow (el área scrolleable y el propio modal) y
           se recortaba o abría hacia arriba. Con `fixed` y `z-[120]` flota sobre
           el modal y se coloca justo debajo del buscador. -->
      <Teleport to="body">
        <div v-if="mostrarResultados">
          <!-- Capa transparente que cubre la pantalla: un clic en cualquier lado
               (fuera del buscador y de la lista) contrae el desplegable. Esto es
               lo que evita que la lista se quede siempre abierta. -->
          <div class="fixed inset-0 z-[115]" @click="mostrarResultados = false"></div>
          <ul
            id="nanda-resultados"
            ref="listaRef"
            :style="estiloLista"
            class="fixed z-[120] max-h-60 overflow-y-auto rounded-lg border border-slate-200 bg-white p-1 shadow-xl"
            role="listbox"
            aria-label="Resultados de búsqueda NANDA"
            @mousedown.prevent
          >
            <li v-if="loading" class="px-3 py-2 text-sm text-slate-500" role="status">
              Buscando diagnósticos…
            </li>
            <li v-for="item in diagnosticos" :key="item.id">
              <button
                type="button"
                role="option"
                class="flex w-full items-start gap-3 rounded-md px-3 py-2 text-left hover:bg-sky-50"
                :class="isSelected(item.id) ? 'bg-sky-50' : ''"
                :aria-pressed="isSelected(item.id)"
                :aria-selected="isSelected(item.id)"
                :disabled="disabled"
                @click="toggleDiagnosis(item)"
              >
                <span
                  class="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border text-[10px] font-bold"
                  :class="isSelected(item.id) ? 'border-sky-700 bg-sky-700 text-white' : 'border-slate-300 text-transparent'"
                  aria-hidden="true"
                >✓</span>
                <span class="min-w-0 text-sm">
                  <strong class="mr-2 text-sky-800">{{ item.codigo }}</strong>
                  <span class="font-semibold text-slate-800">{{ item.diagnostico }}</span>
                  <span v-if="item.dominio" class="mt-1 block text-xs text-slate-500">
                    Dominio: {{ item.dominio }}<span v-if="item.clase"> · Clase: {{ item.clase }}</span>
                  </span>
                </span>
              </button>
            </li>
            <li v-if="!loading && diagnosticos.length === 0 && !error" class="px-3 py-2 text-sm text-slate-500">
              No se encontraron diagnósticos.
            </li>
          </ul>
        </div>
      </Teleport>
    </div>

    <p v-if="error" role="alert" class="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
      {{ error }}
    </p>

    <div v-if="selectedPlans.length" class="space-y-3">
      <h4 class="text-xs font-black uppercase tracking-wide text-slate-600">
        Diagnósticos seleccionados ({{ selectedPlans.length }})
      </h4>
      <article
        v-for="plan in selectedPlans"
        :key="plan.idNANDA"
        class="rounded-lg border border-sky-100 bg-sky-50/40 p-3"
      >
        <div class="flex items-start justify-between gap-3">
          <h5 class="text-sm font-bold text-slate-800">
            <span class="mr-2 text-sky-800">{{ plan.codigoNANDA }}</span>{{ plan.diagnostico }}
          </h5>
          <button
            v-if="section === 'a' && !disabled"
            type="button"
            class="shrink-0 text-xs font-semibold text-red-700 hover:underline"
            @click="quitarDiagnosis(plan.idNANDA)"
          >
            Quitar
          </button>
        </div>

        <textarea
          v-if="section === 'a'"
          :value="plan.comentario || ''"
          rows="2"
          maxlength="1000"
          :disabled="disabled"
          :aria-label="`Comentario para ${plan.codigoNANDA}: ${plan.diagnostico}`"
          placeholder="Comentario adicional sobre este diagnóstico (opcional)"
          class="mt-2 w-full rounded border border-slate-300 bg-white px-2 py-1.5 text-xs disabled:bg-slate-100"
          @input="setComentario(plan.idNANDA, ($event.target as HTMLTextAreaElement).value)"
        ></textarea>

        <div v-if="section === 'p'" class="mt-3 grid gap-4 md:grid-cols-2">
          <fieldset>
            <legend class="mb-2 text-xs font-black uppercase text-emerald-800">Resultados NOC esperados</legend>
            <div v-for="noc in plan.noc || []" :key="noc.id" class="mb-3 rounded-md border border-emerald-100 bg-white p-2">
              <label class="flex items-start gap-2 text-xs text-slate-700">
                <input
                  type="checkbox"
                  :checked="plan.nocIds.includes(noc.id)"
                  :disabled="disabled"
                  class="mt-0.5 rounded border-slate-300 text-emerald-700 focus:ring-emerald-600"
                  @change="toggleNoc(plan.idNANDA, noc.id)"
                />
                <span><strong class="mr-1 text-emerald-800">{{ noc.codigo }}</strong>{{ noc.resultado }}</span>
              </label>
              <p v-if="noc.escalaLikert" class="ml-6 mt-1 text-[11px] text-slate-500">
                Referencia del catálogo: {{ noc.escalaLikert }}
              </p>
              <input
                v-if="plan.nocIds.includes(noc.id)"
                :value="plan.nocMetas?.[noc.id] || ''"
                type="text"
                maxlength="250"
                :disabled="disabled"
                placeholder="Meta o criterio esperado, si aplica"
                class="ml-6 mt-2 w-[calc(100%-1.5rem)] rounded border border-slate-300 px-2 py-1.5 text-xs disabled:bg-slate-100"
                @input="setNocMeta(plan.idNANDA, noc.id, ($event.target as HTMLInputElement).value)"
              />
            </div>
            <p v-if="!plan.noc?.length" class="text-xs text-slate-500">Sin resultados relacionados.</p>
          </fieldset>

          <fieldset>
            <legend class="mb-2 text-xs font-black uppercase text-violet-800">Intervenciones NIC planificadas</legend>
            <label
              v-for="nic in plan.nic || []"
              :key="nic.id"
              class="mb-2 flex items-start gap-2 text-xs text-slate-700"
            >
              <input
                type="checkbox"
                :checked="plan.nicIds.includes(nic.id)"
                :disabled="disabled"
                class="mt-0.5 rounded border-slate-300 text-violet-700 focus:ring-violet-600"
                @change="toggleNic(plan.idNANDA, nic.id)"
              />
              <span><strong class="mr-1 text-violet-800">{{ nic.codigo }}</strong>{{ nic.intervencion }}</span>
            </label>
            <p v-if="!plan.nic?.length" class="text-xs text-slate-500">Sin intervenciones relacionadas.</p>
          </fieldset>
        </div>

        <fieldset v-if="section === 'i'" class="mt-3">
          <legend class="mb-2 text-xs font-black uppercase text-violet-800">Intervenciones planificadas</legend>
          <article
            v-for="nic in nicPlanificados(plan)"
            :key="nic.id"
            class="mb-3 rounded-lg border border-violet-100 bg-violet-50/30 p-2"
          >
            <p class="text-xs font-semibold text-slate-800">
              <strong class="mr-1 text-violet-800">{{ nic.codigo }}</strong>{{ nic.intervencion }}
            </p>
            <div
              class="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1"
              role="radiogroup"
              :aria-label="`Estado de ${nic.codigo}: ${nic.intervencion}`"
            >
              <label
                v-for="opcion in NIC_ESTADOS"
                :key="opcion.value"
                class="flex items-center gap-1.5 text-xs text-slate-700"
              >
                <input
                  type="radio"
                  :name="`nic-estado-${plan.idNANDA}-${nic.id}`"
                  :value="opcion.value"
                  :checked="estadoNic(plan, nic.id) === opcion.value"
                  :disabled="disabled"
                  class="h-3.5 w-3.5 border-slate-300 text-violet-700 focus:ring-violet-600"
                  @change="setNicEstado(plan.idNANDA, nic.id, opcion.value)"
                />
                {{ opcion.label }}
              </label>
            </div>
            <input
              v-if="estadoNic(plan, nic.id) === 'no_realizada'"
              :value="plan.nicNoRealizadas?.[nic.id] || ''"
              type="text"
              maxlength="250"
              :disabled="disabled"
              placeholder="Motivo por el que no se realizó"
              :aria-label="`Motivo de no realización de ${nic.codigo}`"
              class="mt-2 w-full rounded border border-slate-300 bg-white px-2 py-1.5 text-xs disabled:bg-slate-100"
              @input="setNicMotivo(plan.idNANDA, nic.id, ($event.target as HTMLInputElement).value)"
            />
          </article>
          <p v-if="!plan.nicIds.length" class="text-xs text-slate-500">
            Primero seleccione las intervenciones planificadas en P.
          </p>
        </fieldset>

        <fieldset v-if="section === 'e'" class="mt-3">
          <legend class="mb-2 text-xs font-black uppercase text-emerald-800">Evaluación de resultados NOC</legend>
          <div
            v-for="noc in plan.noc?.filter(item => plan.nocIds.includes(item.id)) || []"
            :key="noc.id"
            class="mb-3 rounded-md border border-emerald-100 bg-white p-2"
          >
            <p class="text-xs font-semibold text-slate-800">
              <strong class="mr-1 text-emerald-800">{{ noc.codigo }}</strong>{{ noc.resultado }}
            </p>
            <p v-if="noc.escalaLikert" class="mt-1 text-[11px] text-slate-500">
              Referencia del catálogo: {{ noc.escalaLikert }}
            </p>
            <textarea
              :value="plan.nocEvaluaciones?.[noc.id] || ''"
              rows="2"
              maxlength="500"
              :disabled="disabled"
              placeholder="Registrar el resultado observado y la comparación con la meta; use la escala institucional validada."
              class="mt-2 w-full rounded border border-slate-300 px-2 py-1.5 text-xs disabled:bg-slate-100"
              @input="setNocEvaluation(plan.idNANDA, noc.id, ($event.target as HTMLTextAreaElement).value)"
            ></textarea>
          </div>
          <p v-if="!plan.nocIds.length" class="text-xs text-slate-500">
            Primero seleccione resultados NOC esperados en P.
          </p>
        </fieldset>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { Search } from 'lucide-vue-next'
import type { PlanCuidadoNota } from '@/types'
import { catalogosService, type NandaConInterrelaciones } from '@/services/api'
import { NIC_ESTADOS, estadoNic, type NicEstado } from '../planCuidados'

const props = defineProps<{
  modelValue?: PlanCuidadoNota[]
  section: string
  disabled?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: PlanCuidadoNota[]]
}>()

const texto = ref('')
const diagnosticos = ref<NandaConInterrelaciones[]>([])
const loading = ref(false)
const error = ref('')
const mostrarResultados = ref(false)
const selectedPlans = computed(() => props.modelValue || [])

// Posicionamiento del desplegable. Se teleporta al body y se coloca con
// coordenadas fijas bajo el buscador, porque dentro del modal los contenedores
// con overflow lo recortaban al desplazarse.
const buscadorRef = ref<HTMLInputElement | null>(null)
const listaRef = ref<HTMLElement | null>(null)
const estiloLista = ref<Record<string, string>>({})
let solicitudActual = 0

const ALTO_LISTA = 240 // max-h-60
const ESPACIO_BAJO = 24 // margen respecto al borde inferior de la ventana

function actualizarPosicion() {
  const input = buscadorRef.value
  if (!input) return
  const rect = input.getBoundingClientRect()
  const espacioAbajo = window.innerHeight - rect.bottom - ESPACIO_BAJO
  const alto = Math.min(ALTO_LISTA, Math.max(120, espacioAbajo))
  const abreArriba = espacioAbajo < 160 && rect.top > espacioAbajo
  estiloLista.value = {
    left: `${rect.left}px`,
    width: `${rect.width}px`,
    maxHeight: `${alto}px`,
    ...(abreArriba
      ? { bottom: `${window.innerHeight - rect.top + 4}px` }
      : { top: `${rect.bottom + 4}px` }),
  }
}

// Abre si está contraída y viceversa. Es la acción del campo y del botón de la
// lupa: así siempre hay una forma explícita de desplegar y de contraer.
function alternarResultados() {
  mostrarResultados.value = !mostrarResultados.value
}

const sectionCopy: Record<string, { title: string; description: string }> = {
  a: {
    title: 'A · Análisis — Diagnósticos NANDA',
    description: 'Seleccione los diagnósticos de enfermería que sustentan el plan.',
  },
  p: {
    title: 'P · Plan — Resultados NOC y NIC planificadas',
    description: 'Marque los resultados esperados (NOC) y las intervenciones (NIC) que planea realizar.',
  },
  i: {
    title: 'I · Intervención — NIC ejecutadas',
    description: 'Marque cada intervención planificada como realizada o no realizada; si no se cumplió, indique el motivo.',
  },
  e: {
    title: 'E · Evaluación — Resultados NOC observados',
    description: 'Registre el resultado observado y compárelo con la meta usando la escala institucional validada.',
  },
}

const sectionTitle = computed(() => sectionCopy[props.section]?.title || '')
const sectionDescription = computed(() => sectionCopy[props.section]?.description || '')

async function cargarCatalogo(buscar: string, solicitud: number) {
  loading.value = true
  try {
    const resultados = await catalogosService.buscarNandaNocNic(buscar)
    if (solicitud !== solicitudActual) return
    diagnosticos.value = resultados
    mergeCatalogDetails()
  } catch (err) {
    if (solicitud !== solicitudActual) return
    diagnosticos.value = []
    error.value = err instanceof Error ? err.message : 'No se pudo consultar el catálogo NANDA/NOC/NIC.'
  } finally {
    if (solicitud === solicitudActual) loading.value = false
  }
}

function mergeCatalogDetails() {
  if (!selectedPlans.value.length || !diagnosticos.value.length) return
  const details = new Map(diagnosticos.value.map(item => [item.id, item]))
  emit('update:modelValue', selectedPlans.value.map(plan => {
    const item = details.get(plan.idNANDA)
    if (!item) return plan
    return {
      ...plan,
      codigoNANDA: item.codigo,
      diagnostico: item.diagnostico,
      noc: item.noc,
      nic: item.nic,
    }
  }))
}

function isSelected(idNANDA: number) {
  return selectedPlans.value.some(plan => plan.idNANDA === idNANDA)
}

function toggleDiagnosis(item: NandaConInterrelaciones) {
  if (isSelected(item.id)) {
    quitarDiagnosis(item.id)
    return
  }

  emit('update:modelValue', [...selectedPlans.value, {
    idNANDA: item.id,
    codigoNANDA: item.codigo,
    diagnostico: item.diagnostico,
    nocIds: [],
    nicIds: [],
    comentario: '',
    nicRealizadasIds: [],
    nicNoRealizadas: {},
    nocMetas: {},
    nocEvaluaciones: {},
    noc: item.noc,
    nic: item.nic,
  }])
}

function quitarDiagnosis(idNANDA: number) {
  emit('update:modelValue', selectedPlans.value.filter(plan => plan.idNANDA !== idNANDA))
}

function toggleNoc(idNANDA: number, idNOC: number) {
  emit('update:modelValue', selectedPlans.value.map(plan => {
    if (plan.idNANDA !== idNANDA) return plan
    const nocIds = plan.nocIds.includes(idNOC)
      ? plan.nocIds.filter(id => id !== idNOC)
      : [...plan.nocIds, idNOC]
    return {
      ...plan,
      nocIds,
      nicRealizadasIds: plan.nicRealizadasIds || [],
      nocMetas: plan.nocMetas || {},
      nocEvaluaciones: plan.nocEvaluaciones || {},
    }
  }))
}

function toggleNic(idNANDA: number, idNIC: number) {
  emit('update:modelValue', selectedPlans.value.map(plan => {
    if (plan.idNANDA !== idNANDA) return plan
    const nicIds = plan.nicIds.includes(idNIC)
      ? plan.nicIds.filter(id => id !== idNIC)
      : [...plan.nicIds, idNIC]
    // Al quitar una intervención del plan se descarta también su estado de
    // ejecución: no tiene sentido conservar "realizada" de algo que ya no se planifica.
    const nicNoRealizadas: Record<number, string> = {}
    for (const [id, motivo] of Object.entries(plan.nicNoRealizadas || {})) {
      if (nicIds.includes(Number(id))) nicNoRealizadas[Number(id)] = motivo
    }
    return {
      ...plan,
      nicIds,
      nicRealizadasIds: (plan.nicRealizadasIds || []).filter(id => nicIds.includes(id)),
      nicNoRealizadas: nicNoRealizadas,
    }
  }))
}

function nicPlanificados(plan: PlanCuidadoNota) {
  return (plan.nic || []).filter(item => plan.nicIds.includes(item.id))
}

function setNicEstado(idNANDA: number, idNIC: number, estado: NicEstado) {
  emit('update:modelValue', selectedPlans.value.map(plan => {
    if (plan.idNANDA !== idNANDA) return plan
    const realizadas = new Set(plan.nicRealizadasIds || [])
    const noRealizadas: Record<number, string> = { ...(plan.nicNoRealizadas || {}) }
    realizadas.delete(idNIC)
    delete noRealizadas[idNIC]
    if (estado === 'realizada') realizadas.add(idNIC)
    if (estado === 'no_realizada') noRealizadas[idNIC] = ''
    return { ...plan, nicRealizadasIds: Array.from(realizadas), nicNoRealizadas: noRealizadas }
  }))
}

function setNicMotivo(idNANDA: number, idNIC: number, motivo: string) {
  emit('update:modelValue', selectedPlans.value.map(plan => plan.idNANDA === idNANDA
    ? { ...plan, nicNoRealizadas: { ...(plan.nicNoRealizadas || {}), [idNIC]: motivo } }
    : plan))
}

function setNocMeta(idNANDA: number, idNOC: number, value: string) {
  emit('update:modelValue', selectedPlans.value.map(plan => plan.idNANDA === idNANDA
    ? { ...plan, nocMetas: { ...plan.nocMetas, [idNOC]: value } }
    : plan))
}

function setNocEvaluation(idNANDA: number, idNOC: number, value: string) {
  emit('update:modelValue', selectedPlans.value.map(plan => plan.idNANDA === idNANDA
    ? { ...plan, nocEvaluaciones: { ...plan.nocEvaluaciones, [idNOC]: value } }
    : plan))
}

function setComentario(idNANDA: number, value: string) {
  emit('update:modelValue', selectedPlans.value.map(plan => plan.idNANDA === idNANDA
    ? { ...plan, comentario: value }
    : plan))
}

watch(texto, (value, _previous, onCleanup) => {
  const solicitud = ++solicitudActual
  // Escribir reabre el desplegable; si está contraído y el texto no cambia por
  // el usuario, se mantiene contraído (el usuario decide cuándo mirar).
  if (document.activeElement === buscadorRef.value || mostrarResultados.value) {
    mostrarResultados.value = true
  }
  diagnosticos.value = []
  error.value = ''
  const timer = setTimeout(() => {
    void cargarCatalogo(value.trim(), solicitud)
  }, 250)
  onCleanup(() => clearTimeout(timer))
}, { immediate: true })

// El desplegable teleportado debe seguir pegado al buscador cuando cambia el
// layout (scroll del modal, redimensionado de la ventana o aparición de la
// lista de seleccionados). Se reposiciona, no se cierra: así no se pierde la
// búsqueda mientras el usuario se desplaza.
let observarScroll: ResizeObserver | null = null

onMounted(() => {
  window.addEventListener('scroll', actualizarPosicion, true)
  window.addEventListener('resize', actualizarPosicion)
  if (typeof ResizeObserver !== 'undefined' && buscadorRef.value) {
    observarScroll = new ResizeObserver(actualizarPosicion)
    observarScroll.observe(buscadorRef.value)
  }
})

onUnmounted(() => {
  window.removeEventListener('scroll', actualizarPosicion, true)
  window.removeEventListener('resize', actualizarPosicion)
  observarScroll?.disconnect()
})

watch(mostrarResultados, (abierto) => {
  // El input existe desde que se monta la sección A, así que medirlo es válido
  // incluso antes de que la lista teleportada se pinte.
  if (abierto) void nextTick(actualizarPosicion)
})

watch(diagnosticos, () => {
  if (mostrarResultados.value) void nextTick(actualizarPosicion)
})

onMounted(() => {
  if (mostrarResultados.value) void nextTick(actualizarPosicion)
})
</script>
