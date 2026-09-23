<template>
  <div class="rounded-xl border border-border bg-card shadow-sm overflow-hidden mb-6">
    <!-- Header -->
    <div class="flex items-center justify-between px-6 py-4 border-b border-border/50 bg-slate-50/50">
      <div class="flex items-center gap-4">
        <span class="text-sm font-bold uppercase tracking-wider text-teal-600">
          {{ tipoLabels[nota.tipo] }}
        </span>
        <span class="text-xs font-medium text-slate-400 font-sans italic">
          {{ turnoLabels[nota.turno] }}
        </span>
      </div>
      <div class="text-xs text-slate-400 font-medium">
        {{ formatDate(nota.fecha) }} &nbsp; {{ nota.hora }} h
      </div>
    </div>

    <!-- Content -->
    <div class="p-6 space-y-6">
      <!-- Signos Vitales -->
      <div v-if="nota.signosVitales" class="pb-6 border-b border-border/50">
        <p class="mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Signos Vitales</p>
        <div class="flex flex-wrap items-end justify-between gap-6">
          <!-- Temp -->
          <div class="flex items-center gap-3">
            <Thermometer class="h-5 w-5 text-red-500" />
            <div>
              <p class="text-[10px] text-slate-400 font-bold uppercase">Temp.</p>
              <p class="text-sm font-bold text-slate-800">{{ nota.signosVitales.temperatura }} C</p>
            </div>
          </div>
          <!-- P.A. -->
          <div class="flex items-center gap-3">
            <Activity class="h-5 w-5 text-teal-600" />
            <div>
              <p class="text-[10px] text-slate-400 font-bold uppercase">P.A.</p>
              <p class="text-sm font-bold text-slate-800">{{ nota.signosVitales.presionArterial }} mmHg</p>
            </div>
          </div>
          <!-- F.C. -->
          <div class="flex items-center gap-3">
            <Heart class="h-5 w-5 text-red-500" />
            <div>
              <p class="text-[10px] text-slate-400 font-bold uppercase">F.C.</p>
              <p class="text-sm font-bold text-slate-800">{{ nota.signosVitales.frecuenciaCardiaca }} lpm</p>
            </div>
          </div>
          <!-- F.R. -->
          <div class="flex items-center gap-3">
            <Activity class="h-5 w-5 text-teal-500 transform rotate-90" />
            <div>
              <p class="text-[10px] text-slate-400 font-bold uppercase">F.R.</p>
              <p class="text-sm font-bold text-slate-800">{{ nota.signosVitales.frecuenciaRespiratoria }} rpm</p>
            </div>
          </div>
          <!-- SpO2 -->
          <div class="flex items-center gap-3">
            <Wind class="h-5 w-5 text-teal-600" />
            <div>
              <p class="text-[10px] text-slate-400 font-bold uppercase">SpO2</p>
              <p class="text-sm font-bold text-slate-800">{{ nota.signosVitales.saturacionOxigeno }}%</p>
            </div>
          </div>
        </div>
      </div>

      <!-- SOAPIE -->
      <div class="space-y-6">
        <div>
          <h4 class="text-[11px] font-bold uppercase tracking-wider text-teal-600 mb-1">S - Subjetivo</h4>
          <p class="text-sm leading-relaxed text-slate-600">{{ nota.subjetivo }}</p>
        </div>
        
        <div>
          <h4 class="text-[11px] font-bold uppercase tracking-wider text-teal-500 mb-1">O - Objetivo</h4>
          <p class="text-sm leading-relaxed text-slate-600">{{ nota.objetivo }}</p>
        </div>
        
        <div>
          <h4 class="text-[11px] font-bold uppercase tracking-wider text-teal-600 mb-1">A - Analisis</h4>
          <p class="text-sm leading-relaxed text-slate-600">{{ nota.analisis }}</p>
        </div>
        
        <div>
          <h4 class="text-[11px] font-bold uppercase tracking-wider text-teal-600 mb-1">P - Plan</h4>
          <p class="text-sm leading-relaxed text-slate-600">{{ nota.plan }}</p>
        </div>

         <div>
          <h4 class="text-[11px] font-bold uppercase tracking-wider text-teal-600 mb-1">I – Intervención</h4>
          <p class="text-sm leading-relaxed text-slate-600">{{ nota.intervencion }}</p>
        </div>

        <div>
          <h4 class="text-[11px] font-bold uppercase tracking-wider text-teal-600 mb-1">E – Evaluación</h4>
          <p class="text-sm leading-relaxed text-slate-600">{{ nota.evaluacion }}</p>
        </div>


      </div>
    </div>
    

    <!-- Optional Patient Info (for general lists) -->
    <div v-if="showPatientName && patient" class="px-6 pb-4 -mt-2">
      <div class="flex items-center gap-2 text-[10px] font-bold text-slate-400 bg-slate-100/50 w-fit px-2 py-1 rounded-md">
        <span>PACIENTE:</span>
        <span class="text-slate-600">{{ patient.nombre }} {{ patient.apellido }}</span>
        <span class="text-slate-300">|</span>
        <span>HAB: {{ patient.habitacion }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Thermometer, Heart, Wind, Activity } from 'lucide-vue-next'
import type { NotaEnfermeria, Patient } from '@/types'

const props = defineProps<{
  nota: NotaEnfermeria
  showPatientName?: boolean
  pacientes?: Patient[]
}>()

const patient = computed(() => props.pacientes?.find((p: Patient) => String(p.id) === String(props.nota.pacienteId)))

const tipoLabels: Record<string, string> = {
  valoracion: 'Valoracion',
  evolucion: 'Evolucion',
  medicacion: 'Medicacion',
  procedimiento: 'Procedimiento',
  incidencia: 'Incidencia',
}

const turnoLabels: Record<string, string> = {
  manana: 'Turno Manana',
  tarde: 'Turno Tarde',
  noche: 'Turno Noche',
}

function formatDate(fecha: string) {
  return new Date(fecha).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}
</script>
