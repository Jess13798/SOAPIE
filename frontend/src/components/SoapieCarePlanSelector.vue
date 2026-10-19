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
      <input
        id="buscar-nanda"
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
        @focus="mostrarResultados = true"
        @blur="mostrarResultados = false"
      />
      <ul
        v-if="mostrarResultados"
        id="nanda-resultados"
        class="absolute z-20 mt-1 max-h-64 w-full overflow-y-auto rounded-lg border border-slate-200 bg-white p-1 shadow-lg"
        role="listbox"
        aria-label="Resultados de búsqueda NANDA"
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
            @mousedown.prevent
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
          <legend class="mb-2 text-xs font-black uppercase text-violet-800">Intervenciones realizadas</legend>
          <label
            v-for="nic in plan.nic?.filter(item => plan.nicIds.includes(item.id)) || []"
            :key="nic.id"
            class="mb-2 flex items-start gap-2 text-xs text-slate-700"
          >
            <input
              type="checkbox"
              :checked="(plan.nicRealizadasIds || []).includes(nic.id)"
              :disabled="disabled"
              class="mt-0.5 rounded border-slate-300 text-violet-700 focus:ring-violet-600"
              @change="toggleNicRealizada(plan.idNANDA, nic.id)"
            />
            <span><strong class="mr-1 text-violet-800">{{ nic.codigo }}</strong>{{ nic.intervencion }}</span>
          </label>
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
import { computed, ref, watch } from 'vue'
import type { PlanCuidadoNota } from '@/types'
import { catalogosService, type NandaConInterrelaciones } from '@/services/api'

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
let solicitudActual = 0

const sectionCopy: Record<string, { title: string; description: string }> = {
  a: {
    title: 'A · Análisis — Diagnósticos NANDA',
    description: 'Seleccione los diagnósticos',
  },
  p: {
    title: 'P · Plan — Resultados NOC y NIC planificadas',
    description: 'resultados esperados y las intervenciones que planea realizar.',
  },
  i: {
    title: 'I · Intervención — NIC realizadas',
    description: 'intervenciones del plan que se ejecutaron, describir el detalle la atención en el campo de texto? sugerenciaxd.',
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
    return {
      ...plan,
      nicIds,
      nicRealizadasIds: (plan.nicRealizadasIds || []).filter(id => nicIds.includes(id)),
    }
  }))
}

function toggleNicRealizada(idNANDA: number, idNIC: number) {
  emit('update:modelValue', selectedPlans.value.map(plan => {
    if (plan.idNANDA !== idNANDA) return plan
    const realizadas = plan.nicRealizadasIds || []
    return {
      ...plan,
      nicRealizadasIds: realizadas.includes(idNIC)
        ? realizadas.filter(id => id !== idNIC)
        : [...realizadas, idNIC],
    }
  }))
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
  mostrarResultados.value = true
  diagnosticos.value = []
  error.value = ''
  const timer = setTimeout(() => {
    void cargarCatalogo(value.trim(), solicitud)
  }, 250)
  onCleanup(() => clearTimeout(timer))
}, { immediate: true })
</script>
