<template>
  <div class="grid grid-cols-2 gap-3 lg:grid-cols-4">
    <div
      v-for="stat in stats"
      :key="stat.label"
      class="flex items-center gap-3 rounded-lg border border-border bg-card p-4"
    >
      <div :class="['flex h-10 w-10 items-center justify-center rounded-lg', stat.bg]">
        <component :is="stat.icon" :class="['h-5 w-5', stat.color]" />
      </div>
      <div>
        <p class="text-2xl font-bold text-card-foreground">{{ stat.value }}</p>
        <p class="text-xs text-muted-foreground">{{ stat.label }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Users, AlertTriangle, Eye, LogOut } from 'lucide-vue-next'
import type { Patient } from '@/types'

const props = defineProps<{
  pacientes: Patient[]
}>()

const stats = computed(() => [
  {
    label: 'Total Pacientes',
    value: props.pacientes.length,
    icon: Users,
    color: 'text-primary',
    bg: 'bg-primary/10',
  },
  {
    label: 'Criticos',
    value: props.pacientes.filter((p) => p.estado === 'critico').length,
    icon: AlertTriangle,
    color: 'text-destructive',
    bg: 'bg-destructive/10',
  },
  {
    label: 'En Observacion',
    value: props.pacientes.filter((p) => p.estado === 'observacion').length,
    icon: Eye,
    color: 'text-yellow-600',
    bg: 'bg-yellow-500/10',
  },
  {
    label: 'Alta Medica',
    value: props.pacientes.filter((p) => p.estado === 'alta').length,
    icon: LogOut,
    color: 'text-accent',
    bg: 'bg-accent/10',
  },
])
</script>
