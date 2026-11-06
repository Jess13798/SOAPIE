<template>
  <div v-if="isOpen" class="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-5">
    <button class="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" aria-label="Cerrar Kardex" @click="$emit('close')"></button>

    <section class="relative flex max-h-[94vh] w-full max-w-6xl flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl">
      <header class="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-5 py-3">
        <div class="flex items-center gap-3">
          <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-700 text-white">
            <ClipboardList class="h-5 w-5" />
          </div>
          <div>
            <h2 class="text-sm font-black uppercase tracking-wide text-slate-800">Kardex de enfermería</h2>
            <p class="text-xs font-semibold text-slate-500">Cuidados y administración de medicamentos</p>
          </div>
        </div>
        <button type="button" class="rounded-md p-2 text-slate-500 hover:bg-red-50 hover:text-red-600" aria-label="Cerrar" @click="$emit('close')">
          <X class="h-5 w-5" />
        </button>
      </header>

      <div class="min-h-0 flex-1 overflow-y-auto p-4 sm:p-5">
        <div class="mb-4 grid gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs sm:grid-cols-4">
          <div><span class="block text-[10px] font-bold uppercase text-slate-400">Paciente</span><strong class="text-slate-800">{{ nombrePaciente }}</strong></div>
          <div><span class="block text-[10px] font-bold uppercase text-slate-400">Atención</span><strong class="text-slate-800">{{ idCuenta || '-' }}</strong></div>
          <div><span class="block text-[10px] font-bold uppercase text-slate-400">Servicio / cama</span><strong class="text-slate-800">{{ servicioCama }}</strong></div>
          <div><span class="block text-[10px] font-bold uppercase text-slate-400">Responsable</span><strong class="text-slate-800">{{ responsable || 'Sin usuario' }}</strong></div>
        </div>

        <div class="grid gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
          <section class="rounded-lg border border-slate-200 p-4">
            <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h3 class="text-xs font-black uppercase tracking-wide text-slate-700">Agregar registro</h3>
              <div class="inline-flex rounded-lg bg-slate-100 p-1">
                <button
                  type="button"
                  class="rounded-md px-3 py-1.5 text-xs font-bold"
                  :class="categoria === 'cuidado' ? 'bg-white text-emerald-800 shadow-sm' : 'text-slate-500'"
                  @click="categoria = 'cuidado'; error = ''"
                >Cuidado</button>
                <button
                  type="button"
                  class="rounded-md px-3 py-1.5 text-xs font-bold"
                  :class="categoria === 'medicamento' ? 'bg-white text-emerald-800 shadow-sm' : 'text-slate-500'"
                  @click="categoria = 'medicamento'; error = ''"
                >Medicamento</button>
              </div>
            </div>

            <form class="space-y-3" @submit.prevent="guardar">
              <div class="grid grid-cols-2 gap-3">
                <label class="text-[11px] font-bold text-slate-600">
                  Fecha
                  <input v-model="fecha" type="date" required class="mt-1 w-full rounded-md border border-slate-300 px-2.5 py-2 text-sm text-slate-800">
                </label>
                <label class="text-[11px] font-bold text-slate-600">
                  Turno
                  <select v-model="turno" class="mt-1 w-full rounded-md border border-slate-300 bg-white px-2.5 py-2 text-sm text-slate-800">
                    <option value="M">Mañana (M)</option>
                    <option value="T">Tarde (T)</option>
                    <option value="N">Noche (N)</option>
                  </select>
                </label>
              </div>

              <template v-if="categoria === 'cuidado'">
                <label class="block text-[11px] font-bold text-slate-600">
                  Cuidado o acción realizada
                  <textarea v-model="detalle" required maxlength="2000" rows="4" placeholder="Registra la actividad de enfermería realizada..." class="mt-1 w-full resize-y rounded-md border border-slate-300 px-3 py-2 text-sm font-normal text-slate-800 focus:border-emerald-600 focus:outline-none"></textarea>
                </label>
              </template>

              <template v-else>
                <label class="block text-[11px] font-bold text-slate-600">
                  Medicamento según indicación vigente
                  <input v-model.trim="medicamento" required maxlength="200" class="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm font-normal text-slate-800" placeholder="Nombre del medicamento">
                </label>
                <div class="grid gap-3 sm:grid-cols-2">
                  <label class="text-[11px] font-bold text-slate-600">Dosis
                    <input v-model.trim="dosis" required maxlength="100" class="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm font-normal text-slate-800" placeholder="Según indicación">
                  </label>
                  <label class="text-[11px] font-bold text-slate-600">Vía
                    <input v-model.trim="via" required maxlength="100" class="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm font-normal text-slate-800" placeholder="Según indicación">
                  </label>
                  <label class="text-[11px] font-bold text-slate-600">Frecuencia
                    <input v-model.trim="frecuencia" required maxlength="100" class="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm font-normal text-slate-800" placeholder="Según indicación">
                  </label>
                  <label class="text-[11px] font-bold text-slate-600">Hora programada
                    <input v-model="horaProgramada" type="time" required class="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-800">
                  </label>
                </div>
                <label class="block text-[11px] font-bold text-slate-600">
                  Estado de administración
                  <select v-model="estado" class="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800">
                    <option value="pendiente">Pendiente</option>
                    <option value="administrado">Administrado</option>
                    <option value="no_administrado">No administrado</option>
                  </select>
                </label>
              </template>

              <label class="block text-[11px] font-bold text-slate-600">
                {{ categoria === 'medicamento' && estado === 'no_administrado' ? 'Motivo (obligatorio)' : 'Observación (opcional)' }}
                <textarea v-model.trim="observacion" maxlength="1000" rows="2" :required="categoria === 'medicamento' && estado === 'no_administrado'" class="mt-1 w-full resize-y rounded-md border border-slate-300 px-3 py-2 text-sm font-normal text-slate-800"></textarea>
              </label>

              <p v-if="categoria === 'medicamento'" class="rounded-md bg-amber-50 px-3 py-2 text-[11px] text-amber-800">
                Registra los datos tal como aparecen en la indicación vigente. Este Kardex no prescribe ni modifica tratamientos.
              </p>
              <p v-if="error" role="alert" class="rounded-md bg-red-50 px-3 py-2 text-xs font-semibold text-red-700">{{ error }}</p>

              <button type="submit" :disabled="guardando || !idCuenta || !responsable" class="flex w-full items-center justify-center gap-2 rounded-md bg-emerald-700 px-4 py-2.5 text-xs font-black uppercase text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50">
                <LoaderCircle v-if="guardando" class="h-4 w-4 animate-spin" />
                <Save v-else class="h-4 w-4" />
                {{ guardando ? 'Guardando...' : 'Guardar registro' }}
              </button>
            </form>
          </section>

          <section class="min-h-64 rounded-lg border border-slate-200 p-4">
            <div class="mb-3 flex items-center justify-between gap-3">
              <h3 class="text-xs font-black uppercase tracking-wide text-slate-700">Registros del día</h3>
              <span class="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-800">{{ registros.length }} registro(s)</span>
            </div>

            <div v-if="cargando" class="flex justify-center py-10"><LoaderCircle class="h-6 w-6 animate-spin text-emerald-700" /></div>
            <p v-else-if="errorCarga" role="alert" class="rounded-md bg-red-50 px-3 py-2 text-xs font-semibold text-red-700">{{ errorCarga }}</p>
            <p v-else-if="!registros.length" class="rounded-md bg-slate-50 px-3 py-8 text-center text-xs text-slate-500">No hay registros para esta fecha.</p>
            <ol v-else class="max-h-[28rem] space-y-3 overflow-y-auto pr-1">
              <li v-for="registro in registros" :key="registro.IdKardex" class="rounded-lg border border-slate-200 p-3">
                <div class="mb-2 flex flex-wrap items-center justify-between gap-2">
                  <span class="inline-flex items-center gap-1.5 text-[10px] font-black uppercase text-slate-500">
                    <span class="h-2 w-2 rounded-full" :class="registro.Categoria === 'MEDICAMENTO' ? 'bg-indigo-500' : 'bg-emerald-500'"></span>
                    {{ registro.Categoria === 'MEDICAMENTO' ? 'Medicamento' : 'Cuidado' }} · Turno {{ registro.Turno }}
                  </span>
                  <span v-if="registro.Estado" class="rounded-full px-2 py-1 text-[9px] font-black uppercase" :class="claseEstado(registro.Estado)">{{ etiquetaEstado(registro.Estado) }}</span>
                </div>
                <p v-if="registro.Categoria === 'CUIDADO'" class="whitespace-pre-wrap text-sm font-semibold text-slate-800">{{ registro.Detalle }}</p>
                <template v-else>
                  <p class="text-sm font-bold text-slate-800">{{ registro.Medicamento }} <span class="font-normal text-slate-500">· {{ registro.Dosis }}</span></p>
                  <p class="mt-1 text-xs text-slate-600">{{ registro.Via }} · {{ registro.Frecuencia }} · {{ registro.HoraProgramada }}</p>
                </template>
                <p v-if="registro.Observacion" class="mt-2 whitespace-pre-wrap border-l-2 border-amber-300 pl-2 text-xs text-slate-600">{{ registro.Observacion }}</p>
                <p class="mt-2 text-[10px] text-slate-400">{{ formatoFechaHora(registro.FechaHora) }} · {{ registro.Responsable }}</p>
              </li>
            </ol>
          </section>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { ClipboardList, LoaderCircle, Save, X } from 'lucide-vue-next'
import type { Patient } from '@/types'
import { kardexService, type RegistroKardex } from '@/services/api'

const props = defineProps<{
  isOpen: boolean
  idCuenta: string
  patient: Patient
}>()

defineEmits<{ close: [] }>()

function fechaLocal() {
  const ahora = new Date()
  return `${ahora.getFullYear()}-${String(ahora.getMonth() + 1).padStart(2, '0')}-${String(ahora.getDate()).padStart(2, '0')}`
}

function turnoActual(): 'M' | 'T' | 'N' {
  const hora = new Date().getHours()
  return hora < 13 ? 'M' : hora < 19 ? 'T' : 'N'
}

const fecha = ref(fechaLocal())
const turno = ref<'M' | 'T' | 'N'>(turnoActual())
const categoria = ref<'cuidado' | 'medicamento'>('cuidado')
const detalle = ref('')
const medicamento = ref('')
const dosis = ref('')
const via = ref('')
const frecuencia = ref('')
const horaProgramada = ref('')
const estado = ref<'pendiente' | 'administrado' | 'no_administrado'>('pendiente')
const observacion = ref('')
const registros = ref<RegistroKardex[]>([])
const cargando = ref(false)
const guardando = ref(false)
const error = ref('')
const errorCarga = ref('')

const nombrePaciente = computed(() => props.patient.nombreCompleto || `${props.patient.nombre} ${props.patient.apellido}`.trim())
const servicioCama = computed(() => [props.patient.servicio, props.patient.habitacion || props.patient.cama].filter(Boolean).join(' · ') || '-')
const responsable = computed(() => sessionStorage.getItem('empleadoLogueado') || sessionStorage.getItem('usuarioLogueado') || '')

async function cargarRegistros() {
  if (!props.idCuenta || !Number.isSafeInteger(Number(props.idCuenta)) || Number(props.idCuenta) <= 0) {
    registros.value = []
    errorCarga.value = 'No se encontró una atención válida para cargar el Kardex.'
    return
  }
  cargando.value = true
  errorCarga.value = ''
  try {
    registros.value = await kardexService.getRegistros(props.idCuenta, fecha.value)
  } catch (e) {
    registros.value = []
    errorCarga.value = e instanceof Error ? e.message : 'No se pudo cargar el Kardex.'
  } finally {
    cargando.value = false
  }
}

async function guardar() {
  error.value = ''
  if (!responsable.value) {
    error.value = 'No hay un usuario de enfermería identificado en la sesión.'
    return
  }
  guardando.value = true
  try {
    await kardexService.guardarRegistro({
      idPaciente: props.patient.id,
      idCuenta: props.idCuenta,
      idServicio: props.patient.servicioId,
      idEmpleado: sessionStorage.getItem('idEmpleado'),
      responsable: responsable.value,
      fecha: fecha.value,
      turno: turno.value,
      categoria: categoria.value,
      ...(categoria.value === 'cuidado'
        ? { detalle: detalle.value }
        : {
            medicamento: medicamento.value,
            dosis: dosis.value,
            via: via.value,
            frecuencia: frecuencia.value,
            horaProgramada: horaProgramada.value,
            estado: estado.value,
          }),
      observacion: observacion.value,
    })
    detalle.value = ''
    medicamento.value = ''
    dosis.value = ''
    via.value = ''
    frecuencia.value = ''
    horaProgramada.value = ''
    estado.value = 'pendiente'
    observacion.value = ''
    await cargarRegistros()
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'No se pudo guardar el registro.'
  } finally {
    guardando.value = false
  }
}

function etiquetaEstado(value: NonNullable<RegistroKardex['Estado']>) {
  return value === 'NO_ADMINISTRADO' ? 'No administrado' : value === 'ADMINISTRADO' ? 'Administrado' : 'Pendiente'
}

function claseEstado(value: NonNullable<RegistroKardex['Estado']>) {
  return value === 'NO_ADMINISTRADO'
    ? 'bg-red-50 text-red-700'
    : value === 'ADMINISTRADO'
      ? 'bg-emerald-50 text-emerald-700'
      : 'bg-amber-50 text-amber-700'
}

function formatoFechaHora(value: string) {
  const partes = /^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})/.exec(value)
  if (!partes) return value

  const fechaLocalBD = new Date(Date.UTC(
    Number(partes[1]),
    Number(partes[2]) - 1,
    Number(partes[3]),
    Number(partes[4]),
    Number(partes[5]),
  ))
  return fechaLocalBD.toLocaleString('es-PE', {
    day: 'numeric',
    month: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'UTC',
  })
}

watch(() => props.isOpen, (abierto) => {
  if (abierto) {
    fecha.value = fechaLocal()
    turno.value = turnoActual()
    void cargarRegistros()
  }
})

watch(fecha, () => {
  if (props.isOpen) void cargarRegistros()
})
</script>
