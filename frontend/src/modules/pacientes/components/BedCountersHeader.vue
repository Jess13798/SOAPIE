<template>
  <div class="flex items-center justify-between border-b border-sky-700 bg-sky-800 px-6 py-2.5">
    <div class="flex items-center gap-3">
      <h3 class="text-[13px] font-bold text-white uppercase tracking-wide">{{ title || 'Lista de Pacientes' }}</h3>
    </div>

    <!-- Un solo rectángulo con Total / Ocupadas / Disponibles: al dar clic abre el resumen de camas -->
    <button
      type="button"
      @click="$emit('view-total')"
      class="group flex items-center gap-3 rounded-lg bg-sky-700 px-3 py-1.5 text-left transition-colors hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-300"
      title="Ver resumen total de camas"
    >
      <span class="flex items-center gap-1.5">
        <BedDouble class="h-4 w-4 text-sky-100" />
        <span class="text-[8px] font-bold uppercase tracking-wide text-sky-100">Total</span>
        <span class="text-sm font-black text-white">{{ total }}</span>
      </span>

      <span class="h-4 w-px bg-white/20"></span>

      <span class="flex items-center gap-1.5">
        <span class="h-2 w-2 rounded-full bg-red-400"></span>
        <span class="text-[8px] font-bold uppercase tracking-wide text-sky-100">Ocupadas</span>
        <span class="text-sm font-black text-white">{{ ocupadas }}</span>
      </span>

      <span class="h-4 w-px bg-white/20"></span>

      <span class="flex items-center gap-1.5">
        <span class="h-2 w-2 rounded-full bg-emerald-400"></span>
        <span class="text-[8px] font-bold uppercase tracking-wide text-sky-100">Disponibles</span>
        <span class="text-sm font-black text-white">{{ disponibles }}</span>
      </span>

      <ChevronRight class="h-4 w-4 text-sky-200 transition-transform group-hover:translate-x-0.5" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { BedDouble, ChevronRight } from 'lucide-vue-next'

defineProps<{
  title?: string
  total: number
  ocupadas: number
  disponibles: number
}>()

defineEmits<{
  'view-total': []
}>()
</script>
