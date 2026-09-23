<template>
  <div class="flex flex-col gap-6">
    <!-- Patient Info Card -->
    <div class="rounded-lg border border-border bg-card">
      <div class="flex items-start justify-between px-5 pt-5 pb-3">
        <div>
          <h3 class="text-xl font-semibold text-card-foreground">
            {{ patient.nombre }} {{ patient.apellido }}
          </h3>
          <p class="mt-1 text-sm text-muted-foreground">{{ patient.diagnostico }}</p>
        </div>
        <span :class="['inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium', estadoColors[patient.estado]]">
          {{ estadoLabels[patient.estado] }}
        </span>
      </div>
      <div class="grid grid-cols-2 gap-4 px-5 pb-5 sm:grid-cols-4">
        <div class="flex items-center gap-2">
          <Bed class="h-4 w-4 text-muted-foreground" />
          <div>
            <p class="text-xs text-muted-foreground">Ubicacion</p>
            <p class="text-sm font-medium text-card-foreground">Hab. {{ patient.habitacion }} - Cama {{ patient.cama }}</p>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <Calendar class="h-4 w-4 text-muted-foreground" />
          <div>
            <p class="text-xs text-muted-foreground">Ingreso</p>
            <p class="text-sm font-medium text-card-foreground">{{ formatDate(patient.fechaIngreso) }}</p>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <Stethoscope class="h-4 w-4 text-muted-foreground" />
          <div>
            <p class="text-xs text-muted-foreground">Edad</p>
            <p class="text-sm font-medium text-card-foreground">{{ patient.edad }} anios</p>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <Clock class="h-4 w-4 text-muted-foreground" />
          <div>
            <p class="text-xs text-muted-foreground">Dias internado</p>
            <p class="text-sm font-medium text-card-foreground">{{ diasInternado }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Notes History -->
    <div>
      <h3 class="mb-4 text-lg font-semibold text-foreground">
        Historial de Notas ({{ patientNotas.length }})
      </h3>
      <div v-if="patientNotas.length > 0" class="flex flex-col gap-4">
        <NoteCard v-for="nota in patientNotas" :key="nota.id" :nota="nota" :show-patient-name="false" />
      </div>
      <div v-else class="rounded-lg border border-border bg-card py-10 text-center">
        <p class="text-muted-foreground">No hay notas registradas para este paciente.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Bed, Calendar, Stethoscope, Clock } from 'lucide-vue-next'
import type { Patient, NotaEnfermeria } from '@/types'
import NoteCard from './NoteCard.vue'

const props = defineProps<{
  patient: Patient
  notas: NotaEnfermeria[]
}>()

const estadoColors: Record<string, string> = {
  estable: 'bg-accent/20 text-accent',
  observacion: 'bg-yellow-500/15 text-yellow-600',
  critico: 'bg-destructive/15 text-destructive',
  alta: 'bg-primary/15 text-primary',
}

const estadoLabels: Record<string, string> = {
  estable: 'Estable',
  observacion: 'Observacion',
  critico: 'Critico',
  alta: 'Alta',
}

const patientNotas = computed(() =>
  props.notas
    .filter((n) => String(n.pacienteId) === String(props.patient.id))
    .sort((a, b) => {
      const dateA = new Date(`${a.fecha}T${a.hora}`)
      const dateB = new Date(`${b.fecha}T${b.hora}`)
      return dateB.getTime() - dateA.getTime()
    })
)

const diasInternado = computed(() =>
  Math.ceil((new Date().getTime() - new Date(props.patient.fechaIngreso).getTime()) / (1000 * 60 * 60 * 24))
)

function formatDate(fecha: string) {
  return new Date(fecha).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}
</script>
