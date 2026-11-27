<template>
  <section class="space-y-3 border-x border-b border-slate-200 bg-white px-4 py-3">
    <div>
      <h3 class="text-xs font-black uppercase tracking-wide text-slate-800">
        Servicios seleccionados para planificación
      </h3>
      <p class="mt-1 text-xs text-slate-600">
        Busque por código o nombre y agregue los servicios que desea planificar.
      </p>
    </div>

    <ul v-if="seleccionados.length" class="space-y-1">
      <li
        v-for="servicio in seleccionados"
        :key="servicio.id"
        class="flex items-start justify-between gap-3 rounded-md border border-sky-100 bg-sky-50 px-3 py-2 text-xs"
      >
        <span>
          <strong class="mr-2 text-sky-800">{{ servicio.codigo }}</strong>
          <span class="text-slate-800">{{ servicio.nombre }}</span>
          <span v-if="servicio.idOrden" class="ml-2 rounded bg-sky-200 px-1.5 py-0.5 text-[10px] font-bold text-sky-900" title="Orden registrada en GalenHos">
            Orden #{{ servicio.idOrden }}
          </span>
        </span>
        <button
          type="button"
          class="shrink-0 font-semibold text-red-700 hover:underline disabled:opacity-50"
          :disabled="disabled"
          :aria-label="`Quitar ${servicio.codigo} ${servicio.nombre}`"
          @click="quitar(servicio)"
        >
          Quitar
        </button>
      </li>
    </ul>
    <p v-else class="text-xs text-slate-500">Aún no se agregaron servicios al plan.</p>

    <label for="buscar-servicio" class="sr-only">Buscar servicios por código o nombre</label>
    <input
      id="buscar-servicio"
      v-model="buscar"
      type="search"
      maxlength="100"
      autocomplete="off"
      :disabled="disabled"
      placeholder="Escriba al menos 2 caracteres"
      class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 disabled:bg-slate-100"
    />

    <p v-if="error" role="alert" class="rounded-lg border border-red-200 bg-red-50 p-2 text-xs text-red-800">
      {{ error }}
    </p>

    <ul v-else-if="buscar.trim().length >= 2" class="max-h-48 divide-y divide-slate-100 overflow-y-auto rounded-lg border border-slate-200">
      <li v-if="loading" class="px-3 py-2 text-xs text-slate-500" role="status">
        Buscando servicios…
      </li>
      <li v-for="servicio in servicios" :key="servicio.id">
        <button
          type="button"
          class="flex w-full items-start justify-between gap-3 px-3 py-2 text-left text-xs hover:bg-sky-50 disabled:cursor-default disabled:opacity-70"
          :disabled="disabled || yaAgregado(servicio)"
          @click="agregar(servicio)"
        >
          <span>
            <strong class="mr-2 text-sky-800">{{ servicio.codigo }}</strong>
            <span class="text-slate-800">{{ servicio.nombre }}</span>
          </span>
          <span v-if="yaAgregado(servicio)" class="shrink-0 font-semibold text-emerald-700">Agregado</span>
          <span v-else class="shrink-0 font-semibold text-sky-700">Agregar</span>
        </button>
      </li>
      <li v-if="!loading && servicios.length === 0" class="px-3 py-2 text-xs text-slate-500">
        No se encontraron servicios activos.
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
import { onUnmounted, ref, watch } from 'vue'
import { catalogosService, facturacionService, type ServicioCatalogo } from '@/services/api'
import type { ServicioPlanificado } from '@/types'
import { agregarServicioPlanificado, quitarServicioPlanificado } from '../serviciosPlanificados'

const props = defineProps<{
  disabled?: boolean
  idEmpleado?: number | string
  idServicio?: number | string
  idTipoFinanciamiento?: number | string
}>()
const seleccionados = defineModel<ServicioPlanificado[]>({ required: true })

const buscar = ref('')
const servicios = ref<ServicioCatalogo[]>([])
const loading = ref(false)
const eliminandoId = ref<number | null>(null)
const error = ref('')
let timer: ReturnType<typeof setTimeout> | undefined
let solicitudActual = 0

function yaAgregado(servicio: ServicioCatalogo) {
  return seleccionados.value.some(actual => actual.id === servicio.id)
}

function agregar(servicio: ServicioCatalogo) {
  seleccionados.value = agregarServicioPlanificado(seleccionados.value, servicio)
}

function quitar(servicio: ServicioPlanificado) {
  error.value = ''
  // En pantalla solo se retira de la lista visual (en memoria).
  // La anulación en la base de datos de GalenHos ocurre cuando se GUARDA la nota
  // (o si se cancela/elimina la nota guardada), nunca mientras solo se está llenando el formulario.
  seleccionados.value = quitarServicioPlanificado(seleccionados.value, servicio.id)
}

watch(buscar, (value) => {
  if (timer) clearTimeout(timer)
  const term = value.trim()
  const solicitud = ++solicitudActual
  error.value = ''
  servicios.value = []

  if (term.length < 2) {
    loading.value = false
    return
  }

  loading.value = true
  timer = setTimeout(async () => {
    try {
      const resultado = await catalogosService.buscarServicios(term, {
        idServicio: props.idServicio,
        idTipoFinanciamiento: props.idTipoFinanciamiento,
      })
      if (solicitud === solicitudActual) servicios.value = resultado
    } catch (err) {
      if (solicitud === solicitudActual) {
        error.value = err instanceof Error ? err.message : 'No se pudo consultar el catálogo de servicios.'
      }
    } finally {
      if (solicitud === solicitudActual) loading.value = false
    }
  }, 250)
})

onUnmounted(() => {
  if (timer) clearTimeout(timer)
  solicitudActual += 1
})
</script>
