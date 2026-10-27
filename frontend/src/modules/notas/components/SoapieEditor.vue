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
        <div class="flex min-h-0 flex-1 flex-col">
          <fieldset v-if="activeTab === 'p'" class="border-b border-slate-100 bg-sky-50/60 px-4 py-2">
            <legend class="text-[10px] font-black uppercase tracking-wide text-slate-700">
              Escala de caras Wong-Baker (opcional)
            </legend>
            <div class="grid grid-cols-3 gap-1 sm:grid-cols-6">
              <button
                v-for="face in WONG_BAKER_FACES"
                :key="face.score"
                type="button"
                :disabled="readOnly"
                :aria-label="`${face.score} de 10: ${face.meaning}`"
                :aria-pressed="painScore === face.score"
                :title="`${face.score}/10 — ${face.meaning}`"
                :class="[
                  'flex min-w-0 flex-col items-center rounded-md border px-1 py-1 transition-colors disabled:cursor-default',
                  painScore === face.score
                    ? 'border-sky-700 bg-sky-100 text-sky-950 ring-1 ring-sky-600'
                    : 'border-transparent bg-white text-slate-700 hover:border-sky-300 hover:bg-sky-50'
                ]"
                @click="painScore = painScore === face.score ? null : face.score"
              >
                <span class="text-xl leading-none" aria-hidden="true">{{ face.face }}</span>
                <span class="mt-1 text-[9px] font-black">{{ face.score }}/10</span>
                <span class="w-full whitespace-normal text-[9px] leading-tight">{{ face.meaning }}</span>
              </button>
            </div>
          </fieldset>
          <textarea
            v-model="(form as any)[activeTab]"
            :placeholder="(soapiePlaceholders as any)[activeTab]"
            :disabled="readOnly"
            class="min-h-0 w-full flex-1 border-none p-6 text-[13px] font-semibold text-slate-800 bg-transparent focus:ring-0 resize-none leading-relaxed placeholder:italic placeholder:text-slate-300 disabled:opacity-100 disabled:text-slate-800"
          ></textarea>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { NotaFormState } from '../notaForm'
import { WONG_BAKER_FACES, type WongBakerScore } from '../wongBaker'

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
const painScore = defineModel<WongBakerScore | null>('painScore', { default: null })

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
