<template>
  <div class="flex items-center justify-between border-b border-sky-700 bg-sky-800 px-6 py-2.5">
    <div class="flex items-center gap-3">
      <div class="flex h-7 w-7 items-center justify-center rounded-lg bg-white/15 text-white">
        <List class="h-4 w-4" />
      </div>
      <div>
        <h3 class="text-[13px] font-bold text-white uppercase tracking-wide">{{ title || 'Lista de Pacientes' }}</h3>
      </div>
    </div>

    <div class="flex items-center gap-2">
      <div class="min-w-[78px] rounded-md bg-sky-700 px-2 pt-1 pb-0 text-center">
        <p class="text-[8px] font-bold uppercase tracking-wide leading-none text-sky-100">Disponibles</p>
        <p class="text-sm font-bold leading-none text-white">{{ disponibles }}</p>
      </div>
      <div class="min-w-[78px] rounded-md bg-sky-700 px-2 pt-1 pb-0 text-center">
        <p class="text-[8px] font-bold uppercase tracking-wide leading-none text-sky-100">Ocupadas</p>
        <p class="text-sm font-bold leading-none text-white">{{ ocupadas }}</p>
      </div>
      <button
        @click="$emit('view-total')"
        class="min-w-[78px] rounded-md bg-sky-700 px-2 pt-1 pb-0 text-center hover:bg-sky-600 transition-colors"
        title="Ver resumen total de camas"
      >
        <p class="text-[8px] font-bold uppercase tracking-wide leading-none text-sky-100">Total</p>
        <p class="text-sm font-bold leading-none text-white">{{ total }}</p>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { List } from 'lucide-vue-next'

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
