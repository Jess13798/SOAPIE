<template>
  <!-- Fila de Signos Vitales -->
  <section class="triaje-row grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 xl:grid-cols-10 gap-1 px-0 py-0.5 bg-blue-50/10 bg-blue-color-print">
    <div v-for="(label, key) in etiquetasVitals" :key="key" class="input-vitals bg-white border border-slate-200 rounded-md overflow-hidden hover:border-blue-300 transition-colors shadow-sm text-center flex flex-col">
      <div class="bg-blue-600 py-0.5 px-1 border-b border-blue-700">
        <label class="block text-[9.5px] font-black text-white uppercase">{{ label }}</label>
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

const props = defineProps<{
  form: NotaFormState
  readOnly?: boolean
}>()

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
