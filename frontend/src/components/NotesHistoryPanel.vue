<template>
  <div class="flex h-full min-h-0 flex-col rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden xl:max-h-[560px]">
    <div class="flex items-center justify-between bg-sky-700 px-5 py-1.5 text-white">
      <div class="flex items-center gap-1.5">
        <h6 class="m-0 text-[10px] font-bold uppercase tracking-wider leading-none">Historial de Notas</h6>
      </div>
    </div>

    <div class="border-b border-slate-100 px-3 py-2">
      <div class="relative">
        <Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          v-model="search"
          type="text"
          placeholder="Buscar enfermero..."
          class="w-full rounded-md border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs text-slate-700 outline-none focus:ring-1 focus:ring-sky-300"
        />
      </div>
    </div>

    <div class="min-h-0 flex-1 overflow-y-auto px-0.5 py-0.5 custom-scrollbar">
      <div v-if="selectedPatientNotas.length > 0" class="flex flex-col gap-0.5">
        <div
          v-for="nota in selectedPatientNotas"
          :key="nota.id"
          @click="$emit('view-note', nota)"
          class="group relative min-h-[76px] cursor-pointer rounded-md border border-slate-200 bg-slate-50 px-0.5 py-0.5 transition-all hover:border-sky-300 hover:bg-sky-50"
        >
          <div class="flex h-full w-full items-center gap-0.5">
            <div class="self-center flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-slate-700 text-[10px] leading-none font-bold tabular-nums text-white">
              {{ (nota as any).absoluteIndex }}
            </div>
            <div class="min-w-0 flex-1 self-center flex flex-col justify-center gap-0.5">
              <p class="truncate text-[11px] font-bold uppercase tracking-tight leading-[1.05] text-slate-800">{{ nota.enfermera }}</p>
              <div class="flex flex-col gap-0.5 leading-none">
                <p class="flex items-center gap-1 text-[10px] tracking-tight leading-[1.05] font-bold text-slate-600">
                                    <span class="w-7 shrink-0 font-semibold uppercase text-sky-700">Inicio</span>
                  <span class="tabular-nums">{{ nota.fecha }}</span>
                  <span class="tabular-nums">{{ formatHoraAmPm(nota.hora) }}</span>
                </p>
                <p
                  class="flex items-center gap-1 text-[10px] tracking-tight leading-[1.05] font-bold"
                  :class="(nota.isFirmada || nota.fechaFirmada) ? 'text-emerald-600' : 'text-slate-400 italic'"
                >
                  <span class="w-7 shrink-0 font-bold uppercase" :class="(nota.isFirmada || nota.fechaFirmada) ? 'text-emerald-700' : 'text-slate-400'">Fin</span>
                  <template v-if="nota.isFirmada || nota.fechaFirmada">
                    <span class="tabular-nums">{{ nota.fechaFirmada || nota.fecha }}</span>
                    <span class="tabular-nums">{{ formatHoraAmPm(nota.horaFirmada || nota.hora) }}</span>
                  </template>
                  <template v-else>
                    <span>--</span>
                  </template>
                </p>
              </div>
            </div>
            <div class="self-center h-1.5 w-1.5 rounded-full shrink-0" :class="getNotaTypeColor(nota.tipo)" :title="nota.tipo"></div>
          </div>
        </div>
      </div>

      <div v-else class="flex flex-col items-center justify-center py-12 text-center">
        <div class="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-500">
          <ClipboardList class="h-5 w-5" />
        </div>
        <p class="text-xs font-medium text-slate-500">No hay notas para este paciente</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ClipboardList, Search } from 'lucide-vue-next'
import type { Patient, NotaEnfermeria } from '@/types'

const props = defineProps<{
  notas: NotaEnfermeria[]
  selectedPatient: Patient | null
}>()

defineEmits<{
  'view-note': [nota: NotaEnfermeria]
}>()

const search = ref('')

function formatHoraAmPm(hora?: string | null) {
  if (!hora) return '--'

  const clean = String(hora).trim()
  const match = clean.match(/^(\d{1,2}):(\d{2})/)
  if (!match) return clean

  const h24 = Number(match[1])
  const mm = match[2]
  if (Number.isNaN(h24) || h24 < 0 || h24 > 23) return clean

  const period = h24 >= 12 ? 'PM' : 'AM'
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12
  return `${String(h12).padStart(2, '0')}:${mm} ${period}`
}

const getNotaTypeColor = (tipo: string) => {
  const colors: Record<string, string> = {
    valoracion: 'bg-blue-400',
    evolucion: 'bg-emerald-400',
    medicacion: 'bg-purple-400',
    procedimiento: 'bg-orange-400',
    incidencia: 'bg-red-400'
  }
  return colors[tipo] || 'bg-slate-400'
}

const selectedPatientNotas = computed(() => {
  if (!props.selectedPatient) return []

  const allPatientNotas = props.notas
    .filter(n => String(n.pacienteId) === String(props.selectedPatient?.id))
    .sort((a, b) => {
      const dateA = new Date(`${a.fecha}T${a.hora}`)
      const dateB = new Date(`${b.fecha}T${b.hora}`)
      return dateA.getTime() - dateB.getTime()
    })
    .map((n, idx) => ({
      ...n,
      absoluteIndex: idx + 1
    }))

  if (!search.value.trim()) {
    return allPatientNotas.sort((a, b) => (b as any).absoluteIndex - (a as any).absoluteIndex)
  }

  const query = search.value.toLowerCase().trim()
  return allPatientNotas
    .filter(n => n.enfermera.toLowerCase().includes(query))
    .sort((a, b) => (b as any).absoluteIndex - (a as any).absoluteIndex)
})
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(148, 163, 184, 0.5);
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(100, 116, 139, 0.7);
}
</style>
