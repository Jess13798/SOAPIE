<template>
  <!-- Turno (automático) y Autoría -->
  <div class="flex items-center justify-between bg-slate-100 px-4 py-2 border-b border-slate-200">
    <div class="flex items-center gap-2">
      <span class="text-xs font-black uppercase text-slate-600">Turno:</span>
      <span
        :class="[
          'inline-flex items-center rounded-md border px-3 py-1 text-xs font-bold',
          turno === 'noche'
            ? 'bg-indigo-600 text-white border-indigo-600'
            : 'bg-blue-600 text-white border-blue-600'
        ]"
      >
        {{ turno === 'noche' ? 'Noche (19:00 - 07:00)' : 'Día (07:00 - 19:00)' }}
      </span>
    </div>

    <div class="text-xs font-bold text-slate-500">
      Enfermero/a: <span class="text-slate-800 font-extrabold uppercase">{{ enfermera }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
// Barra informativa: el turno ya no se elige, lo determina el servidor según
// la hora en que se registra la nota. Aquí solo se muestra.
defineProps<{
  turno: 'dia' | 'noche'
  enfermera: string
}>()
</script>
