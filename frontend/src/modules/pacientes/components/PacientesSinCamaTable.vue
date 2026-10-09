<template>
  <div class="rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden w-full">
    <!-- Header bar -->
    <div class="flex flex-col gap-2 bg-sky-800 px-4 py-2.5 text-white sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <div class="flex items-center gap-3">
        <div class="flex h-7 w-7 items-center justify-center rounded-lg bg-white/15 text-white">
          <List class="h-4 w-4" />
        </div>
        <h4 class="text-[13px] font-bold">Pacientes Sin Cama</h4>
      </div>
      <div class="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
        <!-- Selector/Buscador de Servicio -->
        <div class="relative w-full sm:w-72 xl:w-80">
          <input
            ref="servicioInputRef"
            v-model="servicioSearchQuery"
            :list="servicioInputFocused ? 'servicios-list' : undefined"
            autocomplete="off"
            placeholder="Buscar servicio..."
            class="w-full px-3 py-1.5 border border-sky-200 bg-white text-slate-700 placeholder:text-slate-400 rounded-lg text-xs focus:ring-2 focus:ring-sky-300 focus:border-sky-300"
            @focus="handleServicioInputFocus"
            @change="handleServicioChange"
            @blur="servicioInputFocused = false"
          />
          <datalist id="servicios-list">
            <option v-for="servicio in props.servicios" :key="servicio.IdServicio" :value="servicio.Nombre">
              {{ servicio.Nombre }}
            </option>
          </datalist>
        </div>

        <!-- Buscador de Paciente -->
        <div class="relative w-full sm:w-64">
          <Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            :value="searchQuery"
            type="text"
            placeholder="Buscar por apellido, cuenta, historia..."
            class="w-full rounded-md border border-slate-200 bg-white py-1 pl-9 pr-3 text-xs text-slate-700 outline-none focus:ring-1 focus:ring-sky-300"
            @input="$emit('update:searchQuery', ($event.target as HTMLInputElement).value)"
          />
        </div>
      </div>
    </div>

    <!-- Tabla -->
    <div class="overflow-x-auto">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="bg-sky-700 text-white">
            <th class="px-4 py-2 text-xs font-bold">
              <div class="flex items-center gap-1">
                <Hash class="h-3.5 w-3.5" />
                <span>Cuenta</span>
              </div>
            </th>
            <th class="px-4 py-2 text-xs font-bold">
              <div class="flex items-center gap-1">
                <User class="h-3.5 w-3.5" />
                <span>Paciente</span>
              </div>
            </th>
            <th class="px-4 py-2 text-xs font-bold">
              <div class="flex items-center gap-1">
                <CalendarDays class="h-3.5 w-3.5" />
                <span>Fecha</span>
              </div>
            </th>
            <th class="px-4 py-2 text-xs font-bold">
              <div class="flex items-center gap-1">
                <Clock3 class="h-3.5 w-3.5" />
                <span>Hora</span>
              </div>
            </th>
            <th class="px-4 py-2 text-xs font-bold">
              <div class="flex items-center gap-1">
                <Timer class="h-3.5 w-3.5" />
                <span>Tiempo</span>
              </div>
            </th>
            <th class="px-4 py-2 text-xs font-bold">
              <div class="flex items-center gap-1">
                <BriefcaseMedical class="h-3.5 w-3.5" />
                <span>Servicio</span>
              </div>
            </th>
            <th class="px-4 py-2 text-xs font-bold text-center">
              <div class="flex items-center justify-center gap-1">
                <Settings2 class="h-3.5 w-3.5" />
                <span>Acciones</span>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading">
            <td colspan="7" class="px-4 py-6 text-center text-sm text-slate-500">
              Cargando pacientes sin cama...
            </td>
          </tr>
          <tr v-else-if="pacientesSinCama.length === 0">
            <td colspan="7" class="px-4 py-6 text-center text-sm text-slate-500">
              No hay pacientes sin cama.
            </td>
          </tr>
          <tr
            v-for="pacienteSinCama in pacientesSinCama"
            :key="pacienteSinCama.IdCuentaAtencion || ''"
            class="border-t border-slate-100"
          >
            <td class="px-4 py-1 text-xs font-bold text-slate-800">
              {{ pacienteSinCama.IdCuentaAtencion || '-' }}
            </td>
            <td class="px-4 py-1 text-xs font-bold text-slate-800">
              {{ pacienteSinCama.PACIENTE || '-' }}
            </td>
            <td class="px-4 py-1 text-xs font-bold text-slate-800">
              {{ formatFecha(pacienteSinCama.FECHA_ENVIO) }}
            </td>
            <td class="px-4 py-1 text-xs font-bold text-slate-800">
              {{ pacienteSinCama.HORA_ENVIO || '-' }}
            </td>
            <td class="px-4 py-1 text-xs font-bold text-slate-800">
              {{ pacienteSinCama.INTERVALO_TIEMPO || '-' }}
            </td>
            <td class="px-4 py-1 text-xs font-bold text-slate-800 uppercase">
              {{ pacienteSinCama.SERVICIOFINAL || '-' }}
            </td>
            <td class="px-4 py-1 text-center">
              <button
                @click="$emit('assign-bed', pacienteSinCama)"
                class="rounded-md bg-sky-600 px-2 py-0 text-[9px] font-bold text-white hover:bg-sky-700 transition-colors"
              >
                Asignar Cama
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import {
  List, Search, Hash, User, CalendarDays, Clock3, Timer, BriefcaseMedical, Settings2
} from 'lucide-vue-next'
import type { PacienteSinCama, Servicio } from '@/services/api'

const props = defineProps<{
  pacientesSinCama: PacienteSinCama[]
  loading: boolean
  servicios?: Servicio[]
  servicioSeleccionado?: string
  searchQuery: string
}>()

const emit = defineEmits<{
  'assign-bed': [paciente: PacienteSinCama]
  'cambio-servicio': [servicioId: string]
  'update:searchQuery': [value: string]
}>()

const servicioSearchQuery = ref('')
const servicioInputRef = ref<HTMLInputElement | null>(null)
const servicioInputFocused = ref(false)

watch(
  () => [props.servicioSeleccionado, props.servicios?.length],
  () => {
    if (!props.servicioSeleccionado || props.servicioSeleccionado === 'todos') {
      servicioSearchQuery.value = ''
      return
    }
    const servicio = props.servicios?.find(s => String(s.IdServicio) === String(props.servicioSeleccionado))
    servicioSearchQuery.value = servicio?.Nombre || ''
  },
  { immediate: true }
)

function handleServicioChange(e: Event) {
  const val = (e.target as HTMLInputElement).value.trim()
  const servicio = props.servicios?.find(s => s.Nombre.toLowerCase() === val.toLowerCase())

  if (servicio) {
    emit('cambio-servicio', String(servicio.IdServicio))
    servicioSearchQuery.value = servicio.Nombre
    servicioInputFocused.value = false
    setTimeout(() => servicioInputRef.value?.blur(), 0)
    return
  }

  emit('cambio-servicio', 'todos')
  servicioSearchQuery.value = ''
  servicioInputFocused.value = false
  setTimeout(() => servicioInputRef.value?.blur(), 0)
}

function handleServicioInputFocus() {
  servicioInputFocused.value = true
  if (props.servicioSeleccionado && props.servicioSeleccionado !== 'todos') {
    servicioSearchQuery.value = ''
  }
}

function formatFecha(fecha?: string | null) {
  if (!fecha) return '-'
  const date = new Date(fecha)
  if (Number.isNaN(date.getTime())) return '-'

  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  return `${day}-${month}-${year}`
}
</script>
