<template>
  <div v-if="isOpen" class="fixed inset-0 z-[110] flex items-center justify-center p-4">
    <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" @click="$emit('close')"></div>

    <div class="relative w-full max-w-6xl transform overflow-hidden rounded-xl bg-white shadow-2xl border border-slate-200 flex flex-col max-h-[90vh]">
      <!-- Header -->
      <div class="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
        <div class="flex items-center gap-3">
          <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 shadow-sm text-white">
            <Droplet class="h-5 w-5" />
          </div>
          <div>
            <h3 class="text-lg font-black text-slate-800 uppercase tracking-tight leading-none">Balance Hídrico</h3>
            <p class="text-[11px] font-bold text-slate-400 mt-1 uppercase">Ingresos y egresos por turno</p>
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
              <div>
                <span class="block text-[8px] font-bold uppercase text-slate-400">Fecha</span>
                <span class="font-bold text-slate-700">{{ fechaHoy }}</span>
              </div>
            </div>
          </div>

          <!-- Right panel: grid + form -->
          <div class="flex-1 min-w-0">
            <div v-if="loading" class="flex items-center justify-center py-20">
              <div class="animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent"></div>
            </div>

            <template v-else>
              <!-- Grid de balance -->
              <div class="overflow-x-auto border border-slate-200 rounded-lg shadow-sm">
                <table class="w-full text-center border-collapse text-[10px]">
                  <thead>
                    <tr class="bg-indigo-700 text-white">
                      <th class="px-2 py-2 border border-indigo-800 font-black text-left">Concepto</th>
                      <th class="px-2 py-2 border border-indigo-800 font-black">7-1</th>
                      <th class="px-2 py-2 border border-indigo-800 font-black">1-7</th>
                      <th class="px-2 py-2 border border-indigo-800 font-black">7-7</th>
                      <th class="px-2 py-2 border border-indigo-800 font-black">Total 24h</th>
                    </tr>
                  </thead>
                  <tbody>
                    <!-- Ingresos -->
                    <tr class="bg-indigo-50">
                      <td colspan="5" class="px-2 py-1.5 border border-slate-200 text-left text-[9px] font-black uppercase tracking-wider text-indigo-700">Ingresos</td>
                    </tr>
                    <tr v-for="c in conceptosIngreso" :key="'ing-'+c" class="border-b border-slate-100">
                      <td class="px-2 py-1.5 border border-slate-200 text-left font-bold text-slate-700">{{ c }}</td>
                      <td v-for="t in turnos" :key="t" class="px-2 py-1.5 border border-slate-200 font-bold text-indigo-700">
                        {{ valorCelda(c, t) || '·' }}
                      </td>
                      <td class="px-2 py-1.5 border border-slate-200 font-black text-indigo-800 bg-indigo-50">
                        {{ totalConcepto(c) || '·' }}
                      </td>
                    </tr>
                    <tr class="bg-indigo-100 font-black">
                      <td class="px-2 py-1.5 border border-slate-200 text-left text-indigo-800">TOTAL INGRESOS</td>
                      <td v-for="t in turnos" :key="'ti-'+t" class="px-2 py-1.5 border border-slate-200 text-indigo-800">
                        {{ totalTurnoIngreso(t) || '·' }}
                      </td>
                      <td class="px-2 py-1.5 border border-slate-200 text-indigo-900 bg-indigo-200">
                        {{ totalIngresos || '·' }}
                      </td>
                    </tr>

                    <!-- Egresos -->
                    <tr class="bg-rose-50">
                      <td colspan="5" class="px-2 py-1.5 border border-slate-200 text-left text-[9px] font-black uppercase tracking-wider text-rose-700">Egresos</td>
                    </tr>
                    <tr v-for="c in conceptosEgreso" :key="'egr-'+c" class="border-b border-slate-100">
                      <td class="px-2 py-1.5 border border-slate-200 text-left font-bold text-slate-700">{{ c }}</td>
                      <td v-for="t in turnos" :key="t" class="px-2 py-1.5 border border-slate-200 font-bold text-rose-700">
                        {{ valorCelda(c, t) || '·' }}
                      </td>
                      <td class="px-2 py-1.5 border border-slate-200 font-black text-rose-800 bg-rose-50">
                        {{ totalConcepto(c) || '·' }}
                      </td>
                    </tr>
                    <tr class="bg-rose-100 font-black">
                      <td class="px-2 py-1.5 border border-slate-200 text-left text-rose-800">TOTAL EGRESOS</td>
                      <td v-for="t in turnos" :key="'te-'+t" class="px-2 py-1.5 border border-slate-200 text-rose-800">
                        {{ totalTurnoEgreso(t) || '·' }}
                      </td>
                      <td class="px-2 py-1.5 border border-slate-200 text-rose-900 bg-rose-200">
                        {{ totalEgresos || '·' }}
                      </td>
                    </tr>

                    <!-- Balance -->
                    <tr class="bg-emerald-100 font-black">
                      <td class="px-2 py-1.5 border border-slate-200 text-left text-emerald-800">BALANCE</td>
                      <td v-for="t in turnos" :key="'b-'+t" class="px-2 py-1.5 border border-slate-200 text-emerald-800">
                        {{ balanceTurno(t) }}
                      </td>
                      <td class="px-2 py-1.5 border border-slate-200 text-emerald-900 bg-emerald-200">
                        {{ balanceTotal }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- Formulario para agregar registro -->
              <div class="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-3">
                <div class="mb-2 text-[9px] font-black uppercase tracking-wider text-slate-500">Agregar registro</div>
                <div class="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  <div>
                    <label class="block text-[8px] font-bold uppercase text-slate-400 mb-1">Tipo</label>
                    <select v-model="nuevoTipo" class="w-full rounded border border-slate-300 px-2 py-1 text-xs">
                      <option value="ingreso">Ingreso</option>
                      <option value="egreso">Egreso</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-[8px] font-bold uppercase text-slate-400 mb-1">Concepto</label>
                    <select v-model="nuevoConcepto" class="w-full rounded border border-slate-300 px-2 py-1 text-xs">
                      <option v-for="c in (nuevoTipo === 'ingreso' ? conceptosIngreso : conceptosEgreso)" :key="c" :value="c">{{ c }}</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-[8px] font-bold uppercase text-slate-400 mb-1">Cantidad (ml)</label>
                    <input v-model="nuevaCantidad" type="number" step="0.01" class="w-full rounded border border-slate-300 px-2 py-1 text-xs" placeholder="0" />
                  </div>
                  <div>
                    <label class="block text-[8px] font-bold uppercase text-slate-400 mb-1">Turno</label>
                    <select v-model="nuevoTurno" class="w-full rounded border border-slate-300 px-2 py-1 text-xs">
                      <option value="M">7-1 (Mañana)</option>
                      <option value="T">1-7 (Tarde)</option>
                      <option value="N">7-7 (Noche)</option>
                    </select>
                  </div>
                </div>
                <div class="mt-2 flex justify-end">
                  <button
                    type="button"
                    @click="agregarRegistro"
                    :disabled="guardando || !nuevaCantidad"
                    class="rounded-lg bg-indigo-600 px-4 py-1.5 text-xs font-black uppercase text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50"
                  >
                    {{ guardando ? 'Guardando...' : 'Agregar' }}
                  </button>
                </div>
                <p v-if="errorBH" class="mt-2 text-xs font-semibold text-red-600">{{ errorBH }}</p>
              </div>
            </template>
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
import { Droplet, X } from 'lucide-vue-next'
import { notasService } from '@/services/api'
import type { Patient, SignoVitalHistorial } from '@/types'

const props = defineProps<{
  isOpen: boolean
  idCuenta: string | number
  patient?: Patient
}>()

defineEmits<{ close: [] }>()

const loading = ref(false)
const guardando = ref(false)
const errorBH = ref('')
const registros = ref<any[]>([])
const historialVitals = ref<SignoVitalHistorial[]>([])

// Formulario de nuevo registro
const nuevoTipo = ref('ingreso')
const nuevoConcepto = ref('')
const nuevaCantidad = ref('')
const nuevoTurno = ref('M')

const conceptosIngreso = ['V.O / ENTERAL', 'SOLUCIÓN ENDOVENOSA', 'MEDICINAS', 'SANGRE Y/O HEMODERIVADOS', 'AGUA DE OXIDACIÓN']
const conceptosEgreso = ['DIURESIS', 'DEPOSICIÓN', 'VÓMITOS', 'OTROS EGRESOS', 'PÉRDIDAS INSENSIBLES']

const turnos = ['M', 'T', 'N']

// Datos fijos
const nombrePaciente = computed(() => props.patient?.nombreCompleto || `${props.patient?.nombre || ''} ${props.patient?.apellido || ''}`.trim() || '-')
const servicio = computed(() => (props.patient as any)?.servicio || '-')
const habitacion = computed(() => (props.patient as any)?.habitacion || (props.patient as any)?.cama || (props.patient as any)?.codigo || '-')
const enfermera = computed(() => sessionStorage.getItem('empleadoLogueado') || sessionStorage.getItem('usuarioLogueado') || '-')
// El peso sale del último signo vital registrado para la atención (el balance
// hídrico no guarda peso propio). Se usa el más reciente que sí tenga valor.
const pesoActual = computed(() => {
  const encontrado = historialVitals.value.find((r) => {
    const valor = (r as any).Peso ?? (r as any).peso
    return valor !== null && valor !== undefined && String(valor).trim() !== ''
  })
  if (!encontrado) return ''
  const valor = (encontrado as any).Peso ?? (encontrado as any).peso
  const numero = Number(valor)
  return Number.isFinite(numero) ? String(numero) : String(valor)
})
const fechaHoy = computed(() => new Date().toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }))

// Agregar concepto por defecto cuando cambia el tipo
watch(nuevoTipo, (t) => {
  nuevoConcepto.value = t === 'ingreso' ? conceptosIngreso[0] : conceptosEgreso[0]
}, { immediate: true })

// Cargar registros
const fetchRegistros = async () => {
  if (!props.idCuenta || isNaN(Number(props.idCuenta))) {
    registros.value = []
    return
  }
  loading.value = true
  try {
    registros.value = await notasService.getBalanceHidrico(props.idCuenta)
  } catch (e) {
    console.error(e)
    registros.value = []
  } finally {
    loading.value = false
  }
}

// Peso actual: último vital registrado de la atención.
const fetchHistorialVitals = async () => {
  if (!props.idCuenta || isNaN(Number(props.idCuenta))) {
    historialVitals.value = []
    return
  }
  try {
    historialVitals.value = await notasService.getHistorialVitalsPorAtencion(props.idCuenta, 100, 1)
  } catch (e) {
    console.error(e)
    historialVitals.value = []
  }
}

// Agregar un registro
const agregarRegistro = async () => {
  if (!nuevaCantidad.value) return
  guardando.value = true
  errorBH.value = ''
  try {
    await notasService.guardarBalanceHidrico({
      pacienteId: props.patient?.id,
      idCuenta: props.idCuenta,
      servicioId: (props.patient as any)?.servicioId,
      idEmpleado: sessionStorage.getItem('idEmpleado'),
      fecha: new Date().toISOString().slice(0, 10),
      turno: nuevoTurno.value,
      tipo: nuevoTipo.value,
      concepto: nuevoConcepto.value,
      cantidad: Number(nuevaCantidad.value),
    })
    nuevaCantidad.value = ''
    await fetchRegistros()
  } catch (e: any) {
    errorBH.value = e?.message || 'Error al guardar'
  } finally {
    guardando.value = false
  }
}

// Helpers para la grilla
function valorCelda(concepto: string, turno: string): number | null {
  const regs = registros.value.filter(r => r.Concepto === concepto && r.Turno === turno)
  if (!regs.length) return null
  return regs.reduce((sum, r) => sum + Number(r.Cantidad || 0), 0)
}

function totalConcepto(concepto: string): number | null {
  const regs = registros.value.filter(r => r.Concepto === concepto)
  if (!regs.length) return null
  return regs.reduce((sum, r) => sum + Number(r.Cantidad || 0), 0)
}

function totalTurnoIngreso(turno: string): number | null {
  const regs = registros.value.filter(r => r.Tipo === 'ingreso' && r.Turno === turno)
  if (!regs.length) return null
  return regs.reduce((sum, r) => sum + Number(r.Cantidad || 0), 0)
}

function totalTurnoEgreso(turno: string): number | null {
  const regs = registros.value.filter(r => r.Tipo === 'egreso' && r.Turno === turno)
  if (!regs.length) return null
  return regs.reduce((sum, r) => sum + Number(r.Cantidad || 0), 0)
}

const totalIngresos = computed(() => {
  const regs = registros.value.filter(r => r.Tipo === 'ingreso')
  if (!regs.length) return null
  return regs.reduce((sum, r) => sum + Number(r.Cantidad || 0), 0)
})

const totalEgresos = computed(() => {
  const regs = registros.value.filter(r => r.Tipo === 'egreso')
  if (!regs.length) return null
  return regs.reduce((sum, r) => sum + Number(r.Cantidad || 0), 0)
})

const balanceTotal = computed(() => {
  const ing = totalIngresos.value || 0
  const egr = totalEgresos.value || 0
  return (ing - egr).toFixed(2)
})

function balanceTurno(turno: string): string {
  const ing = totalTurnoIngreso(turno) || 0
  const egr = totalTurnoEgreso(turno) || 0
  return (ing - egr).toFixed(2)
}

watch(() => props.isOpen, (v) => {
  if (v) {
    fetchRegistros()
    fetchHistorialVitals()
  }
}, { immediate: true })
</script>
