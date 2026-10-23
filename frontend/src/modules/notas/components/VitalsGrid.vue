<template>
  <!-- Fila de Signos Vitales -->
  <section class="triaje-row grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 xl:grid-cols-10 gap-1 px-0 py-0.5 bg-blue-50/10 bg-blue-color-print">
    <div
      v-for="(label, key) in etiquetasVitals"
      :key="key"
      class="input-vitals bg-white border border-slate-200 rounded-md overflow-hidden hover:border-blue-300 transition-colors shadow-sm text-center flex flex-col"
      :title="esObligatorio(key) ? 'Obligatorio en este servicio' : 'Opcional en este servicio'"
    >
      <div class="bg-blue-600 py-0.5 px-1 border-b border-blue-700">
        <label class="block text-[9.5px] font-black text-white uppercase">
          {{ label }}<span v-if="esObligatorio(key)" class="text-amber-300"> *</span><span v-else class="ml-0.5 text-[7.5px] font-bold normal-case tracking-normal text-sky-100"> (opc.)</span>
        </label>
      </div>
      <div class="flex items-center justify-center gap-1 p-1 flex-1">
        <template v-if="key === 'presionArterial'">
          <input
            type="text"
            inputmode="numeric"
            v-model="sis"
            @input="sis = String(sis).replace(/[^0-9]/g, '')"
            placeholder="-"
            :disabled="readOnly"
            class="w-full border-none p-0 text-[13px] font-extrabold text-slate-800 focus:ring-0 bg-transparent text-center disabled:opacity-100 disabled:text-slate-800 min-w-0"
          />
          <span class="text-[16px] font-black text-slate-400 leading-none">/</span>
          <input
            type="text"
            inputmode="numeric"
            v-model="dia"
            @input="dia = String(dia).replace(/[^0-9]/g, '')"
            placeholder="-"
            :disabled="readOnly"
            class="w-full border-none p-0 text-[13px] font-extrabold text-slate-800 focus:ring-0 bg-transparent text-center disabled:opacity-100 disabled:text-slate-800 min-w-0"
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
            class="w-full border-none p-0 text-[13px] font-extrabold text-slate-800 focus:ring-0 bg-transparent text-center disabled:opacity-100 disabled:text-slate-800 min-w-0"
          />
        </template>
        <span class="text-[8px] font-bold text-slate-400 shrink-0">{{ getVitalUnit(key) }}</span>
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
  // Signos vitales obligatorios del servicio actual (los define el backend).
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
