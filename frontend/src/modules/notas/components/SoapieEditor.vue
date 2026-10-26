<template>
  <div>
    <!-- Pestañas Clínicas SOAPIE -->
    <div class="bg-blue-600 shadow-md">
      <div class="flex items-center gap-7 px-5">
        <button
          v-for="tab in clinicalTabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="[
            'py-3 text-[11px] font-black uppercase tracking-wider transition-all border-b-[3px]',
            activeTab === tab.id
              ? 'border-white text-white'
              : 'border-transparent text-blue-100/70 hover:text-white hover:bg-white/10 px-1'
          ]"
        >
          {{ tab.label }}
        </button>
      </div>
    </div>

    <!-- Área de Texto SOAPIE -->
    <div v-if="activeTab !== 'a' || permiteEditarAnalisis" class="pt-1 bg-slate-50/50">
      <div class="border-x border-b border-slate-200 overflow-hidden shadow-sm h-[320px] bg-white flex">
        <div class="w-16 bg-blue-50/50 flex items-center justify-center border-r border-slate-100">
          <span class="text-4xl font-black text-blue-700 uppercase">{{ activeTab }}</span>
        </div>
        <div class="flex-1">
          <textarea
            v-model="(form as any)[activeTab]"
            :placeholder="(soapiePlaceholders as any)[activeTab]"
            :disabled="readOnly"
            class="w-full h-full border-none p-6 text-[13px] font-semibold text-slate-800 bg-transparent focus:ring-0 resize-none leading-relaxed placeholder:italic placeholder:text-slate-300 disabled:opacity-100 disabled:text-slate-800"
          ></textarea>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { NotaFormState } from '../notaForm'

defineProps<{
  form: NotaFormState
  readOnly?: boolean
  // Cuando es false, el textarea de Análisis se oculta en notas nuevas sin
  // análisis previo: el Análisis se arma con los diagnósticos NANDA elegidos.
  permiteEditarAnalisis?: boolean
}>()

// Sección SOAPIE activa. Se sincroniza con el padre (v-model:section) para que
// el selector de plan de cuidados sepa a qué sección agregar el NANDA/NOC/NIC.
const activeTab = defineModel<'s' | 'o' | 'a' | 'p' | 'i' | 'e'>('section', { default: 's' })

const clinicalTabs = [
  { id: 's', label: 'Subjetivo' },
  { id: 'o', label: 'Objetivo' },
  { id: 'a', label: 'Análisis' },
  { id: 'p', label: 'Plan' },
  { id: 'i', label: 'Intervención' },
  { id: 'e', label: 'Evaluación' },
]

const soapiePlaceholders: Record<string, string> = {
  s: "Paciente refiere...",
  o: "Hallazgos observables...",
  a: "Diagnósticos o interpretación...",
  p: "Plan de acción...",
  i: "Intervenciones realizadas...",
  e: "Respuesta del paciente..."
}
</script>
