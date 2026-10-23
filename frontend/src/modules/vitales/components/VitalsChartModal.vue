<template>
  <div v-if="isOpen" class="fixed inset-0 z-[110] flex items-center justify-center p-4">
    <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" @click="$emit('close')"></div>

    <div class="relative w-full max-w-6xl transform overflow-hidden rounded-xl bg-white shadow-2xl border border-slate-200 flex flex-col max-h-[90vh]">
      <!-- Header -->
      <div class="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
        <div class="flex items-center gap-3">
          <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-600 shadow-sm text-white">
            <Activity class="h-5 w-5" />
          </div>
          <div>
            <h3 class="text-lg font-black text-slate-800 uppercase tracking-tight leading-none">Gráfica de Vitales Básicos</h3>
            <p class="text-[11px] font-bold text-slate-400 mt-1 uppercase">SpO₂, P.A., Temp y Pulso — por fecha y hora</p>
          </div>
        </div>
        <button @click="$emit('close')" class="rounded-md p-1.5 bg-slate-200 text-slate-600 hover:bg-red-500 hover:text-white transition-all shadow-sm">
          <X class="h-4 w-4 stroke-[3px]" />
        </button>
      </div>

      <!-- Body -->
      <div class="flex-1 min-h-0 overflow-auto p-4">
        <div class="flex gap-4">
          <!-- Left panel: fixed data -->
          <div class="w-44 shrink-0 border border-slate-200 rounded-lg bg-slate-50 p-3 text-[11px]">
            <div class="mb-2 text-[9px] font-black uppercase tracking-wider text-slate-500">Datos fijos</div>
            <div class="space-y-1.5">
              <div>
                <span class="block text-[8px] font-bold uppercase text-slate-400">Paciente</span>
                <span class="font-black text-slate-700 uppercase">{{ nombrePaciente }}</span>
              </div>
              <div>
                <span class="block text-[8px] font-bold uppercase text-slate-400">Servicio</span>
                <span class="font-bold text-slate-700">{{ servicio }}</span>
              </div>
              <div>
                <span class="block text-[8px] font-bold uppercase text-slate-400">Habitación</span>
                <span class="font-bold text-slate-700">{{ habitacion }}</span>
              </div>
              <div>
                <span class="block text-[8px] font-bold uppercase text-slate-400">Enfermera</span>
                <span class="font-bold text-slate-700">{{ enfermera }}</span>
              </div>
              <div>
                <span class="block text-[8px] font-bold uppercase text-slate-400">Peso</span>
                <span class="font-bold text-slate-700">{{ pesoActual || '-' }} kg</span>
              </div>
            </div>
          </div>

          <!-- Right panel: chart grid -->
          <div class="flex-1 min-w-0 overflow-x-auto">
            <div v-if="loading" class="flex items-center justify-center py-20">
              <div class="animate-spin rounded-full h-8 w-8 border-4 border-teal-500 border-t-transparent"></div>
            </div>
            <div v-else-if="fechas.length === 0" class="flex items-center justify-center py-20 text-slate-400">
              <p class="text-sm font-bold uppercase">No se encontraron registros de signos vitales</p>
            </div>
            <table v-else class="w-full text-center border-collapse text-[10px]">
              <thead>
                <tr class="bg-teal-700 text-white">
                  <th class="px-2 py-2 border border-teal-800 font-black uppercase tracking-wider">Signo vital</th>
                  <th v-for="f in fechas" :key="f" :colspan="4" class="px-2 py-2 border border-teal-800 font-black">
                    {{ f }}
                  </th>
                </tr>
                <tr class="bg-teal-600 text-white">
                  <th class="px-2 py-1 border border-teal-700"></th>
                  <template v-for="f in fechas" :key="'slot-'+f">
                    <th class="px-1 py-1 border border-teal-700 font-bold">6</th>
                    <th class="px-1 py-1 border border-teal-700 font-bold">12</th>
                    <th class="px-1 py-1 border border-teal-700 font-bold">6</th>
                    <th class="px-1 py-1 border border-teal-700 font-bold">12</th>
                  </template>
                </tr>
              </thead>
              <tbody>
                <tr v-for="vital in vitales" :key="vital.key" class="border-b border-slate-200">
                  <td class="px-2 py-2 border border-slate-200 font-black text-slate-700 text-left bg-slate-50">
                    {{ vital.label }}
                  </td>
                  <template v-for="f in fechas" :key="'cells-'+f+'-'+vital.key">
                    <td v-for="slot in [0,1,2,3]" :key="slot" class="px-1 py-2 border border-slate-200 min-w-[44px]">
                      <span v-if="celda(f, slot, vital.key)" class="font-black text-teal-700">
                        {{ celda(f, slot, vital.key) }}
                      </span>
                      <span v-else class="text-slate-300">·</span>
                    </td>
                  </template>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div class="px-6 py-3 border-t border-slate-100 bg-slate-50 flex justify-end">
        <button @click="$emit('close')" class="px-5 py-2 rounded-lg bg-red-600 text-white text-xs font-black uppercase tracking-widest hover:bg-red-700 transition-all shadow-md active:scale-95">
          Cerrar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { Activity, X } from 'lucide-vue-next'
import { notasService } from '@/services/api'
import type { Patient, SignoVitalHistorial } from '@/types'

const props = defineProps<{
  isOpen: boolean
  idCuenta: string | number
  patient?: Patient
  registrosTemporales?: SignoVitalHistorial[]
}>()

defineEmits<{ close: [] }>()

const history = ref<SignoVitalHistorial[]>([])
const loading = ref(false)

// Left panel
const nombrePaciente = computed(() => props.patient?.nombreCompleto || `${props.patient?.nombre || ''} ${props.patient?.apellido || ''}`.trim() || '-')
const servicio = computed(() => (props.patient as any)?.servicio || '-')
const habitacion = computed(() => (props.patient as any)?.cama || (props.patient as any)?.codigo || '-')
const enfermera = computed(() => sessionStorage.getItem('empleadoLogueado') || sessionStorage.getItem('usuarioLogueado') || '-')

const pesoActual = computed(() => {
  const r = [...(props.registrosTemporales || []), ...history.value]
  if (!r.length) return ''
  const last = r[r.length - 1]
  return (last as any).Peso ?? (last as any).peso ?? ''
})

// Time slot mapping: 0-5 -> 24 (prev day), 6-11 -> 6, 12-17 -> 12, 18-23 -> 18
function slotDeHora(h: number): number {
  if (h < 6) return 24
  if (h < 12) return 6
  if (h < 18) return 12
  return 18
}

function fechaKey(d: Date): string {
  return d.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

// Group readings into (date, slot) -> reading
const celdas = computed(() => {
  const map = new Map<string, SignoVitalHistorial>()
  const all = [...(props.registrosTemporales || []), ...history.value]
  for (const r of all) {
    const d = new Date((r as any).Fecha_Hora || (r as any).fechaHora)
    if (isNaN(d.getTime())) continue
    const slot = slotDeHora(d.getHours())
    // readings in 0-5 belong to previous day's 24 slot
    const fecha = slot === 24
      ? new Date(d.getTime() - 24 * 3600 * 1000)
      : d
    const key = `${fechaKey(fecha)}|${slot}`
    // keep latest
    map.set(key, r)
  }
  return map
})

const fechas = computed(() => {
  const set = new Set<string>()
  for (const r of [...(props.registrosTemporales || []), ...history.value]) {
    const d = new Date((r as any).Fecha_Hora || (r as any).fechaHora)
    if (isNaN(d.getTime())) continue
    const slot = slotDeHora(d.getHours())
    const fecha = slot === 24 ? new Date(d.getTime() - 24 * 3600 * 1000) : d
    set.add(fechaKey(fecha))
  }
  return [...set].sort()
})

const vitales = [
  { key: 'pa', label: 'P.A.' },
  { key: 'pulso', label: 'PULSO' },
  { key: 'temp', label: 'TEMP' },
  { key: 'sat', label: 'SAT' },
]

function celda(fecha: string, slotIdx: number, vitalKey: string): string {
  const slots = [6, 12, 18, 24]
  const slot = slots[slotIdx]
  const r = celdas.value.get(`${fecha}|${slot}`)
  if (!r) return ''
  if (vitalKey === 'pa') return (r as any).Presion_Arterial || (r as any).presionArterial || ''
  if (vitalKey === 'pulso') return String((r as any).Frec_Cardiaca ?? (r as any).frecuenciaCardiaca ?? '')
  if (vitalKey === 'temp') return String((r as any).Temperatura ?? (r as any).temperatura ?? '')
  if (vitalKey === 'sat') return String((r as any).Saturacion ?? (r as any).saturacionOxigeno ?? '')
  return ''
}

const fetchHistory = async () => {
  if (!props.idCuenta || isNaN(Number(props.idCuenta))) {
    history.value = [...(props.registrosTemporales || [])]
    return
  }
  loading.value = true
  try {
    const data = await notasService.getHistorialVitalsPorAtencion(props.idCuenta, 100, 1)
    history.value = data || []
  } catch (e) {
    console.error(e)
    history.value = [...(props.registrosTemporales || [])]
  } finally {
    loading.value = false
  }
}

watch(() => props.isOpen, (v) => { if (v) fetchHistory() }, { immediate: true })
</script>
