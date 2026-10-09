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
        <div class="w-full sm:w-72 xl:w-80">
          <ServiceCombobox
            :servicios="props.servicios"
            :model-value="props.servicioSeleccionado || ''"
            placeholder="Buscar servicio..."
            @update:model-value="$emit('cambio-servicio', $event)"
          />
        </div>

        <!-- Buscador global de Paciente (nombre, DNI, cuenta o historia) -->
        <div class="w-full sm:w-72 xl:w-80">
          <PatientSearchCombobox
            placeholder="Buscar paciente (nombre, DNI o cuenta)..."
            @select="$emit('buscar-paciente', $event)"
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
import {
  List, Hash, User, CalendarDays, Clock3, Timer, BriefcaseMedical, Settings2
} from 'lucide-vue-next'
import type { PacienteBusqueda, PacienteSinCama, Servicio } from '@/services/api'
import ServiceCombobox from '@/modules/pacientes/components/ServiceCombobox.vue'
import PatientSearchCombobox from '@/modules/pacientes/components/PatientSearchCombobox.vue'

const props = defineProps<{
  pacientesSinCama: PacienteSinCama[]
  loading: boolean
  servicios?: Servicio[]
  servicioSeleccionado?: string
}>()

const emit = defineEmits<{
  'assign-bed': [paciente: PacienteSinCama]
  'cambio-servicio': [servicioId: string]
  'buscar-paciente': [paciente: PacienteBusqueda]
}>()

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
