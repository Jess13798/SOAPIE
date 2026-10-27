<template>
  <!-- Signos Vitales: cuadrícula pareja (máximo 5 por fila). El encabezado
       tiene altura fija para que ningún cuadro crezca si el nombre es largo.
       Los opcionales se indican con la leyenda y el título del cuadro, sin
       texto extra que rompa la alineación. -->
  <section class="triaje-row px-0 py-1 bg-blue-50/10 bg-blue-color-print">
    <div class="mb-1 flex flex-wrap items-center justify-between gap-x-3 gap-y-0.5 px-0.5">
      <h4 class="text-[9px] font-black uppercase tracking-[0.08em] text-slate-500">
        Signos vitales
      </h4>
      <p class="text-[8px] font-bold uppercase tracking-wide text-slate-400">
        <span class="text-amber-500">*</span> Obligatorio
        <span class="mx-1 text-slate-300">·</span>
        Sin <span class="text-amber-500">*</span> es opcional
      </p>
    </div>

    <div class="grid grid-cols-2 gap-1 sm:grid-cols-3 md:grid-cols-5 xl:grid-cols-10">
      <div
        v-for="(label, key) in etiquetasVitals"
        :key="key"
        class="input-vitals flex flex-col overflow-hidden rounded-md border border-slate-200 bg-white text-center shadow-sm transition-colors hover:border-blue-300"
        :title="esObligatorio(key) ? 'Obligatorio en este servicio' : 'Opcional en este servicio'"
      >
        <div class="flex h-[19px] items-center justify-center border-b border-blue-700 bg-blue-600 px-1">
          <label class="flex min-w-0 items-center justify-center gap-0.5 text-[9.5px] font-black uppercase leading-none text-white">
            <span class="truncate">{{ label }}</span>
            <span v-if="esObligatorio(key)" class="shrink-0 text-amber-300">*</span>
          </label>
        </div>
        <div class="flex flex-1 items-center justify-center gap-1 px-1.5 py-1">
          <template v-if="key === 'presionArterial'">
            <input
              type="text"
              inputmode="numeric"
              v-model="sis"
              @input="sis = String(sis).replace(/[^0-9]/g, '')"
              placeholder="-"
              :disabled="readOnly"
              class="w-full min-w-0 border-none bg-transparent p-0 text-center text-[13px] font-extrabold text-slate-800 focus:ring-0 disabled:text-slate-800 disabled:opacity-100"
            />
            <span class="text-[16px] font-black leading-none text-slate-400">/</span>
            <input
              type="text"
              inputmode="numeric"
              v-model="dia"
              @input="dia = String(dia).replace(/[^0-9]/g, '')"
              placeholder="-"
              :disabled="readOnly"
              class="w-full min-w-0 border-none bg-transparent p-0 text-center text-[13px] font-extrabold text-slate-800 focus:ring-0 disabled:text-slate-800 disabled:opacity-100"
            />
          </template>
          <template v-else>
            <input
              type="text"
              :inputmode="['frecuenciaCardiaca', 'frecuenciaRespiratoria', 'spo2'].includes(key) ? 'numeric' : 'decimal'"
              v-model="(form as any)[key]"
              @input="(form as any)[key] = String((form as any)[key] || '').replace(['frecuenciaCardiaca', 'frecuenciaRespiratoria', 'spo2'].includes(key) ? /[^0-9]/g : /[^0-9.]/g, '')"
              :placeholder="placeholderVitals[key]"
              :disabled="readOnly"
              class="w-full min-w-0 border-none bg-transparent p-0 text-center text-[13px] font-extrabold text-slate-800 focus:ring-0 disabled:text-slate-800 disabled:opacity-100"
            />
          </template>
          <span class="shrink-0 text-[8px] font-bold text-slate-400">{{ getVitalUnit(key) }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { NotaFormState } from '../notaForm'
import { CAMPOS_OBLIGATORIOS_POR_DEFECTO, claveConfiguracionVital } from '../vitalesConfig'

const props = withDefaults(defineProps<{
  form: NotaFormState
  readOnly?: boolean
  // Signos vitales obligatorios del servicio actual (configuración compartida).
  camposObligatorios?: string[]
}>(), {
  camposObligatorios: () => [...CAMPOS_OBLIGATORIOS_POR_DEFECTO],
})

function esObligatorio(key: string) {
  return props.camposObligatorios.includes(claveConfiguracionVital(key))
}

// Presión arterial dividida en SIS / DIA
const sis = computed({
  get: () => props.form.presionArterial.split('/')[0] || '',
  set: (val) => {
    const diaVal = props.form.presionArterial.split('/')[1] || ''
    if (!val && !diaVal) props.form.presionArterial = ''
    else props.form.presionArterial = `${val}/${diaVal}`
  },
})

const dia = computed({
  get: () => props.form.presionArterial.split('/')[1] || '',
  set: (val) => {
    const sisVal = props.form.presionArterial.split('/')[0] || ''
    if (!sisVal && !val) props.form.presionArterial = ''
    else props.form.presionArterial = `${sisVal}/${val}`
  },
})

const etiquetasVitals: Record<string, string> = {
  peso: 'PESO', talla: 'TALLA', pCefalico: 'P. CEFÁLICO', pAbdominal: 'P. ABDOMINAL',
  hemoglucotest: 'HEMOGLUCOTEST', presionArterial: 'PRESIÓN ART.', frecuenciaCardiaca: 'FREC. CARD.', frecuenciaRespiratoria: 'FREC. RESP.',
  temp: 'TEMPERATURA', spo2: 'SATURACIÓN'
}

const placeholderVitals: Record<string, string> = {
  peso: "-", talla: "-", pCefalico: "-", pAbdominal: "-", hemoglucotest: "-", presionArterial: "-", frecuenciaCardiaca: "-", frecuenciaRespiratoria: "-", temp: "36.6", spo2: "-"
}

function getVitalUnit(key: string) {
  const units: Record<string, string> = {
    peso: 'kg', talla: 'cm', pCefalico: 'cm', pAbdominal: 'cm', hemoglucotest: 'mg/dL', presionArterial: 'mmHg', frecuenciaCardiaca: 'lpm', frecuenciaRespiratoria: 'rpm', temp: '°C', spo2: '%'
  }
  return units[key] || ''
}
</script>
