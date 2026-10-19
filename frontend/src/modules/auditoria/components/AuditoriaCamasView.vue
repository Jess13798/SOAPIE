<template>
  <section class="grid grid-cols-1 gap-6">
    <!-- Cabecera + filtros -->
    <div class="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div class="flex flex-col gap-2 bg-sky-800 px-4 py-2.5 text-white sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div class="flex items-center gap-3">
          <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-white/15">
            <ShieldCheck class="h-5 w-5" />
          </div>
          <div>
            <h4 class="text-[13px] font-bold">Auditoría de Camas</h4>
            <p class="text-[11px] text-sky-100/80">Quién asignó, movió o transfirió cada cama</p>
          </div>
        </div>
        <button
          type="button"
          class="flex items-center justify-center gap-2 rounded-lg bg-white/15 px-3 py-1.5 text-xs font-bold text-white hover:bg-white/25 disabled:opacity-60"
          :disabled="cargando"
          @click="cargar"
        >
          <RefreshCw :class="['h-4 w-4', cargando ? 'animate-spin' : '']" />
          Actualizar
        </button>
      </div>

      <!-- Filtros -->
      <div class="grid grid-cols-1 gap-3 border-b border-slate-100 p-4 sm:grid-cols-2 lg:grid-cols-5">
        <label class="block">
          <span class="mb-1 block text-[11px] font-bold uppercase tracking-wide text-slate-500">Desde</span>
          <input
            v-model="filtros.fechaDesde"
            type="date"
            class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
          />
        </label>

        <label class="block">
          <span class="mb-1 block text-[11px] font-bold uppercase tracking-wide text-slate-500">Hasta</span>
          <input
            v-model="filtros.fechaHasta"
            type="date"
            class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
          />
        </label>

        <label class="block">
          <span class="mb-1 block text-[11px] font-bold uppercase tracking-wide text-slate-500">Servicio</span>
          <select
            v-model="filtros.servicioId"
            class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
          >
            <option value="">Todos</option>
            <option v-for="servicio in props.servicios" :key="servicio.IdServicio" :value="servicio.IdServicio">
              {{ servicio.Nombre }}
            </option>
          </select>
        </label>

        <label class="block">
          <span class="mb-1 block text-[11px] font-bold uppercase tracking-wide text-slate-500">Acción</span>
          <select
            v-model="filtros.accion"
            class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
          >
            <option value="">Todas</option>
            <option value="ASIGNAR">Asignación</option>
            <option value="MOVER">Cambio de cama</option>
            <option value="TRANSFERIR">Transferencia</option>
          </select>
        </label>

        <label class="block">
          <span class="mb-1 block text-[11px] font-bold uppercase tracking-wide text-slate-500">Usuario</span>
          <input
            v-model="filtros.usuario"
            type="search"
            maxlength="100"
            placeholder="usuario de login"
            class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
          />
        </label>

        <div class="flex items-end gap-2 lg:col-span-5">
          <button
            type="button"
            :disabled="cargando"
            class="rounded-lg bg-sky-700 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-800 disabled:cursor-not-allowed disabled:opacity-60"
            @click="cargar"
          >
            {{ cargando ? 'Filtrando…' : 'Aplicar filtros' }}
          </button>
          <button
            type="button"
            :disabled="cargando"
            class="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            @click="limpiarFiltros"
          >
            Limpiar
          </button>
        </div>
      </div>

      <!-- Resumen -->
      <div class="grid grid-cols-2 gap-3 p-4 sm:grid-cols-4">
        <div class="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
          <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-200/70">
            <ClipboardList class="h-4 w-4 text-slate-700" />
          </div>
          <div>
            <p class="text-xl font-bold text-slate-800">{{ registros.length }}</p>
            <p class="text-[11px] text-slate-500">Registros mostrados</p>
          </div>
        </div>
        <div class="flex items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3">
          <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100">
            <BedSingle class="h-4 w-4 text-emerald-700" />
          </div>
          <div>
            <p class="text-xl font-bold text-emerald-800">{{ conteo.asignar }}</p>
            <p class="text-[11px] text-emerald-700">Asignaciones</p>
          </div>
        </div>
        <div class="flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 p-3">
          <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-200/70">
            <ArrowLeftRight class="h-4 w-4 text-amber-700" />
          </div>
          <div>
            <p class="text-xl font-bold text-amber-800">{{ conteo.mover }}</p>
            <p class="text-[11px] text-amber-700">Cambios de cama</p>
          </div>
        </div>
        <div class="flex items-center gap-3 rounded-lg border border-sky-200 bg-sky-50 p-3">
          <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-200/70">
            <Shuffle class="h-4 w-4 text-sky-700" />
          </div>
          <div>
            <p class="text-xl font-bold text-sky-800">{{ conteo.transferir }}</p>
            <p class="text-[11px] text-sky-700">Transferencias</p>
          </div>
        </div>
      </div>
    </div>

    <p v-if="error" role="alert" class="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
      {{ error }}
    </p>

    <!-- Tabla -->
    <div class="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div v-if="cargando" class="py-12 text-center text-sm font-medium text-slate-500" role="status">
        Cargando auditoría…
      </div>

      <div
        v-else-if="registros.length === 0"
        class="p-10 text-center text-sm text-slate-500"
      >
        No hay registros de auditoría para los filtros seleccionados.
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full text-sm">
          <thead class="bg-slate-50 text-[11px] font-bold uppercase tracking-wide text-slate-500">
            <tr>
              <th class="px-4 py-3 text-left">Fecha / Hora</th>
              <th class="px-4 py-3 text-left">Acción</th>
              <th class="px-4 py-3 text-left">Cuenta</th>
              <th class="px-4 py-3 text-left">Paciente</th>
              <th class="px-4 py-3 text-left">Cama</th>
              <th class="px-4 py-3 text-left">Servicio</th>
              <th class="px-4 py-3 text-left">Usuario</th>
              <th class="px-4 py-3 text-left">Detalle</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="registro in registros" :key="registro.IdAuditoria" class="hover:bg-slate-50/70">
              <td class="whitespace-nowrap px-4 py-3 text-slate-700">{{ formatFechaHora(registro.FechaHora) }}</td>
              <td class="px-4 py-3">
                <span :class="['inline-flex rounded-md px-2 py-1 text-[11px] font-black', colorAccion(registro.Accion)]">
                  {{ etiquetaAccion(registro.Accion) }}
                </span>
              </td>
              <td class="px-4 py-3 text-slate-700">{{ registro.IdCuentaAtencion ?? '—' }}</td>
              <td class="px-4 py-3 font-medium text-slate-800">{{ registro.Paciente || '—' }}</td>
              <td class="px-4 py-3 text-slate-700">
                <span v-if="registro.CamaAnterior && registro.CamaAnterior !== registro.Cama" class="text-amber-700">
                  {{ registro.CamaAnterior }} →
                </span>
                {{ registro.Cama || '—' }}
              </td>
              <td class="px-4 py-3 text-slate-700">{{ registro.Servicio || '—' }}</td>
              <td class="px-4 py-3 text-slate-700">{{ registro.Usuario || '—' }}</td>
              <td class="px-4 py-3 text-slate-600">{{ registro.Detalle || '—' }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p class="border-t border-slate-100 px-4 py-2 text-[11px] text-slate-500">
        Mostrando hasta {{ LIMITE }} registros más recientes.
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { ShieldCheck, RefreshCw, ClipboardList, BedSingle, ArrowLeftRight, Shuffle } from 'lucide-vue-next'
import { auditoriaCamasService } from '@/services/api'
import type { RegistroAuditoriaCama, Servicio, FiltrosAuditoriaCamas } from '@/services/api'

const props = defineProps<{
  servicios: Servicio[]
}>()

const LIMITE = 200

const registros = ref<RegistroAuditoriaCama[]>([])
const cargando = ref(false)
const error = ref('')

const filtros = reactive({
  fechaDesde: '',
  fechaHasta: '',
  servicioId: '' as string | number,
  accion: '',
  usuario: '',
})

const conteo = computed(() => ({
  asignar: registros.value.filter((r) => r.Accion === 'ASIGNAR').length,
  mover: registros.value.filter((r) => r.Accion === 'MOVER').length,
  transferir: registros.value.filter((r) => r.Accion === 'TRANSFERIR').length,
}))

async function cargar() {
  cargando.value = true
  error.value = ''
  try {
    const payload: FiltrosAuditoriaCamas = { limit: LIMITE }
    if (filtros.fechaDesde) payload.fechaDesde = filtros.fechaDesde
    if (filtros.fechaHasta) payload.fechaHasta = filtros.fechaHasta
    if (filtros.servicioId) payload.servicioId = filtros.servicioId
    if (filtros.accion) payload.accion = filtros.accion
    if (filtros.usuario.trim()) payload.usuario = filtros.usuario.trim()

    registros.value = await auditoriaCamasService.getRegistros(payload)
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'No se pudo cargar la auditoría.'
    registros.value = []
  } finally {
    cargando.value = false
  }
}

function limpiarFiltros() {
  filtros.fechaDesde = ''
  filtros.fechaHasta = ''
  filtros.servicioId = ''
  filtros.accion = ''
  filtros.usuario = ''
  cargar()
}

function formatFechaHora(valor: string | null | undefined): string {
  if (!valor) return '—'
  const fecha = new Date(valor)
  if (Number.isNaN(fecha.getTime())) return valor
  const dd = String(fecha.getDate()).padStart(2, '0')
  const mm = String(fecha.getMonth() + 1).padStart(2, '0')
  const yyyy = fecha.getFullYear()
  const hh = String(fecha.getHours()).padStart(2, '0')
  const min = String(fecha.getMinutes()).padStart(2, '0')
  return `${dd}/${mm}/${yyyy} ${hh}:${min}`
}

function etiquetaAccion(accion: string): string {
  if (accion === 'ASIGNAR') return 'ASIGNACIÓN'
  if (accion === 'MOVER') return 'CAMBIO'
  if (accion === 'TRANSFERIR') return 'TRANSFERENCIA'
  return accion
}

function colorAccion(accion: string): string {
  if (accion === 'ASIGNAR') return 'bg-emerald-100 text-emerald-800'
  if (accion === 'MOVER') return 'bg-amber-100 text-amber-800'
  if (accion === 'TRANSFERIR') return 'bg-sky-100 text-sky-800'
  return 'bg-slate-100 text-slate-700'
}

onMounted(cargar)
</script>
