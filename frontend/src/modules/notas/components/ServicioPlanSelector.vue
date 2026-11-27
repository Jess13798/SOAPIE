<!-- Propósito: Componente visual del módulo "notas". -->

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

    <div v-if="seleccionados.length" class="overflow-x-auto rounded-md border border-slate-200">
      <table class="w-full min-w-[700px] border-collapse text-left text-xs">
        <thead class="bg-slate-100 text-slate-700">
          <tr>
            <th class="px-3 py-2 font-semibold">Código</th>
            <th class="px-3 py-2 font-semibold">Descripción</th>
            <th class="px-3 py-2 font-semibold">Código CIE</th>
            <th class="w-24 px-3 py-2 font-semibold">Cantidad</th>
            <th class="w-20 px-3 py-2"></th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-200">
          <tr v-for="servicio in seleccionados" :key="servicio.id" class="bg-white">
            <td class="whitespace-nowrap px-3 py-2 font-semibold text-sky-800">{{ servicio.codigo }}</td>
            <td class="px-3 py-2 text-slate-800">{{ servicio.nombre }}</td>
            <td class="px-3 py-2">
              <select
                :value="servicio.idAtencionDiagnostico ?? ''"
                :disabled="disabled || loadingDiagnosticos || diagnosticos.length === 0"
                class="w-full min-w-40 rounded border border-slate-300 bg-white px-2 py-1.5 text-xs disabled:bg-slate-100"
                :aria-label="`Código CIE para ${servicio.codigo}`"
                @change="seleccionarDiagnostico(servicio.id, $event)"
              >
                <option value="">Seleccione CIE</option>
                <option
                  v-for="diagnostico in diagnosticos"
                  :key="diagnostico.IdAtencionDiagnostico"
                  :value="diagnostico.IdAtencionDiagnostico"
                >
                  {{ diagnostico.CodigoCIE10 }} — {{ diagnostico.Descripcion }}
                </option>
              </select>
            </td>
            <td class="px-3 py-2">
              <input
                type="number"
                min="1"
                max="2147483647"
                step="1"
                :value="servicio.cantidad || 1"
                :disabled="disabled || servicio.estadoFacturacion === 4"
                class="w-20 rounded border border-slate-300 px-2 py-1.5 text-center text-xs disabled:bg-slate-100"
                :aria-label="`Cantidad para ${servicio.codigo}`"
                @change="cambiarCantidad(servicio, $event)"
              />
              <span v-if="servicio.estadoFacturacion === 4" class="mt-1 block text-[10px] text-slate-500">
                Pagado: cantidad bloqueada
              </span>
            </td>
            <td class="px-3 py-2 text-right">
              <button
                type="button"
                class="font-semibold text-red-700 hover:underline disabled:opacity-50"
                :disabled="disabled"
                :aria-label="`Quitar ${servicio.codigo} ${servicio.nombre}`"
                @click="quitar(servicio)"
              >
                Quitar
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <p v-else class="text-xs text-slate-500">Aún no se agregaron servicios al plan.</p>

    <p v-if="loadingDiagnosticos" role="status" class="text-xs text-slate-500">
      Cargando diagnósticos de la cuenta…
    </p>
    <p v-else-if="diagnosticosError" role="alert" class="rounded-lg border border-red-200 bg-red-50 p-2 text-xs text-red-800">
      {{ diagnosticosError }}
    </p>
    <p v-else-if="seleccionados.length && diagnosticos.length === 0" class="text-xs text-amber-700">
      La cuenta no tiene diagnósticos disponibles para asociar a los CPT.
    </p>
    <p v-if="cantidadError" role="alert" class="rounded-lg border border-amber-200 bg-amber-50 p-2 text-xs text-amber-800">
      {{ cantidadError }}
    </p>

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
          :disabled="disabled || loadingDiagnosticos || diagnosticos.length === 0 || yaAgregado(servicio)"
          @click="agregar(servicio)"
        >
          <span>
            <strong class="mr-2 text-sky-800">{{ servicio.codigo }}</strong>
            <span class="text-slate-800">{{ servicio.nombre }}</span>
          </span>
          <span v-if="yaAgregado(servicio)" class="shrink-0 font-semibold text-emerald-700">Agregado</span>
          <span v-else-if="diagnosticos.length > 0" class="shrink-0 font-semibold text-sky-700">Agregar</span>
          <span v-else class="shrink-0 text-slate-500">Sin CIE disponible</span>
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
import { catalogosService, type Diagnostico, type ServicioCatalogo } from '@/services/api'
import type { ServicioPlanificado } from '@/types'
import { agregarServicioPlanificado, quitarServicioPlanificado } from '../serviciosPlanificados'

const props = defineProps<{
  disabled?: boolean
  idCuentaAtencion?: string | number
}>()
const seleccionados = defineModel<ServicioPlanificado[]>({ required: true })

const buscar = ref('')
const servicios = ref<ServicioCatalogo[]>([])
const diagnosticos = ref<Diagnostico[]>([])
const loading = ref(false)
const error = ref('')
const diagnosticosError = ref('')
const loadingDiagnosticos = ref(false)
const cantidadError = ref('')
let timer: ReturnType<typeof setTimeout> | undefined
let solicitudActual = 0
let solicitudDiagnosticos = 0

function diagnosticoPrincipal() {
  return diagnosticos.value.find(diagnostico => diagnostico.Codigo.trim() === 'D') || diagnosticos.value[0]
}

function actualizarServicio(id: number, cambios: Partial<ServicioPlanificado>) {
  seleccionados.value = seleccionados.value.map(servicio =>
    servicio.id === id ? { ...servicio, ...cambios } : servicio,
  )
}

function yaAgregado(servicio: ServicioCatalogo) {
  return seleccionados.value.some(actual => actual.id === servicio.id)
}

function agregar(servicio: ServicioCatalogo) {
  const principal = diagnosticoPrincipal()
  seleccionados.value = agregarServicioPlanificado(seleccionados.value, servicio, principal)
}

function quitar(servicio: ServicioPlanificado) {
  error.value = ''
  cantidadError.value = ''
  // En pantalla solo se retira de la lista visual (en memoria).
  // La anulación en la base de datos de GalenHos ocurre cuando se GUARDA la nota
  // (o si se cancela/elimina la nota guardada), nunca mientras solo se está llenando el formulario.
  seleccionados.value = quitarServicioPlanificado(seleccionados.value, servicio.id)
}

function seleccionarDiagnostico(idServicio: number, event: Event) {
  const id = Number((event.target as HTMLSelectElement).value)
  const diagnostico = diagnosticos.value.find(item => item.IdAtencionDiagnostico === id)
  actualizarServicio(idServicio, {
    idAtencionDiagnostico: diagnostico?.IdAtencionDiagnostico ?? null,
    codigoCIE10: diagnostico?.CodigoCIE10 ?? null,
  })
}

function cambiarCantidad(servicio: ServicioPlanificado, event: Event) {
  const input = event.target as HTMLInputElement
  const cantidad = Number(input.value)
  if (!Number.isInteger(cantidad) || cantidad < 1 || cantidad > 2147483647) {
    cantidadError.value = 'La cantidad debe ser un entero entre 1 y 2,147,483,647.'
    input.value = String(servicio.cantidad || 1)
    return
  }
  cantidadError.value = ''
  actualizarServicio(servicio.id, { cantidad })
}

watch(() => props.idCuentaAtencion, async (idCuentaAtencion) => {
  const solicitud = ++solicitudDiagnosticos
  diagnosticos.value = []
  diagnosticosError.value = ''
  if (!idCuentaAtencion) {
    loadingDiagnosticos.value = false
    diagnosticosError.value = 'La nota no tiene una cuenta de atención para cargar diagnósticos.'
    return
  }

  loadingDiagnosticos.value = true
  try {
    const resultado = await catalogosService.getDiagnosticosPorCuenta(idCuentaAtencion)
    if (solicitud !== solicitudDiagnosticos) return
    diagnosticos.value = resultado
    const principal = diagnosticoPrincipal()
    if (principal) {
      seleccionados.value = seleccionados.value.map(servicio =>
        servicio.idAtencionDiagnostico == null
          || !diagnosticos.value.some(
            diagnostico => diagnostico.IdAtencionDiagnostico === servicio.idAtencionDiagnostico,
          )
          ? {
              ...servicio,
              idAtencionDiagnostico: principal.IdAtencionDiagnostico,
              codigoCIE10: principal.CodigoCIE10,
            }
          : servicio,
      )
    }
  } catch (err) {
    if (solicitud === solicitudDiagnosticos) {
      diagnosticosError.value = err instanceof Error
        ? err.message
        : 'No se pudieron cargar los diagnósticos de la cuenta.'
    }
  } finally {
    if (solicitud === solicitudDiagnosticos) loadingDiagnosticos.value = false
  }
}, { immediate: true })

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
      const resultado = await catalogosService.buscarServicios(term)
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
  solicitudDiagnosticos += 1
})
</script>
