<template>
  <div class="flex flex-col gap-4">
    <div>
      <h2 class="text-xl font-semibold text-foreground">Signos Vitales</h2>
      <p class="text-sm text-muted-foreground">Ultimo registro de signos vitales por paciente</p>
    </div>

    <div class="grid gap-4 md:grid-cols-2">
      <div
        v-for="patient in activePacientes"
        :key="patient.id"
        class="rounded-lg border border-border bg-card"
      >
        <div class="flex items-center justify-between px-5 pt-5 pb-1">
          <h4 class="text-base font-semibold text-card-foreground">
            {{ patient.nombre }} {{ patient.apellido }}
          </h4>
          <span :class="['inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium', estadoColors[patient.estado]]">
            {{ estadoLabels[patient.estado] }}
          </span>
        </div>
        <p class="px-5 pb-3 text-xs text-muted-foreground">Hab. {{ patient.habitacion }}-{{ patient.cama }}</p>
        <div class="px-5 pb-5">
          <div v-if="getLatestVitals(patient.id)" class="grid grid-cols-3 gap-3">
            <div class="flex flex-col items-center gap-1 rounded-lg bg-muted/50 p-2">
              <Thermometer class="h-4 w-4 text-destructive" />
              <span class="text-xs text-muted-foreground">Temp</span>
              <span class="text-sm font-bold text-card-foreground">{{ getLatestVitals(patient.id)!.temperatura }}C</span>
            </div>
            <div class="flex flex-col items-center gap-1 rounded-lg bg-muted/50 p-2">
              <Activity class="h-4 w-4 text-primary" />
              <span class="text-xs text-muted-foreground">P.A.</span>
              <span class="text-sm font-bold text-card-foreground">{{ getLatestVitals(patient.id)!.presionArterial }}</span>
            </div>
            <div class="flex flex-col items-center gap-1 rounded-lg bg-muted/50 p-2">
              <Heart class="h-4 w-4 text-destructive" />
              <span class="text-xs text-muted-foreground">F.C.</span>
              <span class="text-sm font-bold text-card-foreground">{{ getLatestVitals(patient.id)!.frecuenciaCardiaca }}</span>
            </div>
            <div class="flex flex-col items-center gap-1 rounded-lg bg-muted/50 p-2">
              <Wind class="h-4 w-4 text-accent" />
              <span class="text-xs text-muted-foreground">F.R.</span>
              <span class="text-sm font-bold text-card-foreground">{{ getLatestVitals(patient.id)!.frecuenciaRespiratoria }}</span>
            </div>
            <div class="flex flex-col items-center gap-1 rounded-lg bg-muted/50 p-2">
              <Droplets class="h-4 w-4 text-primary" />
              <span class="text-xs text-muted-foreground">SpO2</span>
              <span class="text-sm font-bold text-card-foreground">{{ getLatestVitals(patient.id)!.saturacionOxigeno }}%</span>
            </div>
            <div v-if="getLatestVitals(patient.id)!.glucosa" class="flex flex-col items-center gap-1 rounded-lg bg-muted/50 p-2">
              <Candy class="h-4 w-4 text-yellow-600" />
              <span class="text-xs text-muted-foreground">Gluc.</span>
              <span class="text-sm font-bold text-card-foreground">{{ getLatestVitals(patient.id)!.glucosa }}</span>
            </div>
          </div>
          <p v-else class="py-4 text-center text-sm text-muted-foreground">
            Sin registros de signos vitales
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Thermometer, Heart, Wind, Droplets, Activity, Candy } from 'lucide-vue-next'
import type { Patient, NotaEnfermeria, SignosVitales } from '@/types'

const props = defineProps<{
  pacientes: Patient[]
  notas: NotaEnfermeria[]
}>()

const estadoLabels: Record<string, string> = {
  estable: 'Estable',
  observacion: 'Observacion',
  critico: 'Critico',
  alta: 'Alta',
}

const estadoColors: Record<string, string> = {
  estable: 'bg-accent/20 text-accent',
  observacion: 'bg-yellow-500/15 text-yellow-600',
  critico: 'bg-destructive/15 text-destructive',
  alta: 'bg-primary/15 text-primary',
}

const activePacientes = computed(() => props.pacientes.filter((p) => p.estado !== 'alta'))

function getLatestVitals(pacienteId: string): SignosVitales | undefined {
  const patientNotas = props.notas
    .filter((n) => String(n.pacienteId) === String(pacienteId) && n.signosVitales)
    .sort((a, b) => {
      const dateA = new Date(`${a.fecha}T${a.hora}`)
      const dateB = new Date(`${b.fecha}T${b.hora}`)
      return dateB.getTime() - dateA.getTime()
    })
  return patientNotas[0]?.signosVitales
}
</script>
