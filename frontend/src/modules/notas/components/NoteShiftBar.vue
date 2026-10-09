<template>
  <!-- Selector de 2 Turnos (12 Horas) y Autoría -->
  <div class="flex items-center justify-between bg-slate-100 px-4 py-2 border-b border-slate-200">
    <div class="flex items-center gap-2">
      <span class="text-xs font-black uppercase text-slate-600">Turno:</span>
      <div class="inline-flex rounded-md shadow-sm" role="group">
        <button
          type="button"
          @click="emit('update:turno', 'dia')"
          :disabled="readOnly"
          :class="[
            'px-4 py-1 text-xs font-bold rounded-l-lg border transition-colors',
            turno === 'dia'
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
          ]"
        >
          Día (07:00 - 19:00)
        </button>
        <button
          type="button"
          @click="emit('update:turno', 'noche')"
          :disabled="readOnly"
          :class="[
            'px-4 py-1 text-xs font-bold rounded-r-lg border transition-colors',
            turno === 'noche'
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
          ]"
        >
          Noche (19:00 - 07:00)
        </button>
      </div>
    </div>

    <div class="text-xs font-bold text-slate-500">
      Enfermero/a: <span class="text-slate-800 font-extrabold uppercase">{{ enfermera }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  turno: 'dia' | 'noche'
  enfermera: string
  readOnly?: boolean
}>()

const emit = defineEmits<{
  'update:turno': [turno: 'dia' | 'noche']
}>()
</script>
