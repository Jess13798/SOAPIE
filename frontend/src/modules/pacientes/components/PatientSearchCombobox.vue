<template>
  <div ref="contenedor" class="relative w-full">
    <div class="relative">
      <Search class="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <input
        ref="inputRef"
        v-model="query"
        type="text"
        autocomplete="off"
        :placeholder="placeholder || 'Buscar paciente (nombre, DNI o cuenta)...'"
        class="w-full rounded-lg border border-sky-200 bg-white py-1.5 pl-8 pr-8 text-xs text-slate-700 placeholder:text-slate-400 focus:border-sky-300 focus:ring-2 focus:ring-sky-300"
        @focus="abrir"
        @click="abrir"
        @input="onInput"
        @keydown="onKeydown"
      />
      <Loader2
        v-if="cargando"
        class="absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-sky-500"
      />
      <button
        v-else-if="query"
        type="button"
        class="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600"
        aria-label="Limpiar búsqueda"
        @mousedown.prevent
        @click="limpiar"
      >
        <X class="h-4 w-4" />
      </button>
    </div>

    <!-- Resultados: teleportados al body para que ninguna tarjeta con overflow los recorte -->
    <Teleport to="body">
      <ul
        v-if="abierto"
        ref="dropdownRef"
        :style="estiloDropdown"
        class="fixed z-50 max-h-72 overflow-auto rounded-lg border border-slate-200 bg-white py-1 text-xs shadow-lg"
      >
        <li v-if="query.trim().length < MINIMO" class="px-3 py-2 italic text-slate-400">
          Escribe al menos {{ MINIMO }} letras...
        </li>
        <li v-else-if="cargando && resultados.length === 0" class="px-3 py-2 italic text-slate-400">
          Buscando...
        </li>
        <li v-else-if="resultados.length === 0" class="px-3 py-2 italic text-slate-400">
          Sin resultados
        </li>

        <li
          v-for="(paciente, i) in resultados"
          :key="paciente.IdPaciente"
          :class="[
            'cursor-pointer border-b border-slate-50 px-3 py-1.5 last:border-b-0',
            i === indiceResaltado ? 'bg-sky-100' : 'hover:bg-sky-50'
          ]"
          @mousedown.prevent
          @click="seleccionar(paciente)"
          @mousemove="indiceResaltado = i"
        >
          <div class="flex items-center justify-between gap-2">
            <span class="font-semibold text-slate-800">{{ paciente.Paciente }}</span>
            <span
              v-if="paciente.Cama"
              class="shrink-0 rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-600"
            >
              {{ paciente.Cama }}
            </span>
          </div>
          <div class="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[10px] text-slate-500">
            <span v-if="paciente.Dni">DNI {{ paciente.Dni }}</span>
            <span v-if="paciente.Historia">HC {{ paciente.Historia }}</span>
            <span v-if="paciente.IdCuentaAtencion">Cuenta {{ paciente.IdCuentaAtencion }}</span>
          </div>
          <div
            v-if="paciente.Servicio"
            class="mt-0.5 text-[10px] font-bold uppercase tracking-tight text-sky-700"
          >
            {{ paciente.Servicio }}
          </div>
          <div v-else class="mt-0.5 text-[10px] italic text-slate-400">Sin servicio activo</div>
        </li>
      </ul>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
// Buscador global de pacientes: al escribir 2 o más letras consulta al backend
// y muestra coincidencias por nombre, DNI, historia clínica o número de cuenta.
// El resultado incluye el servicio actual del paciente.
import { nextTick, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { Loader2, Search, X } from 'lucide-vue-next'
import { pacientesService, type PacienteBusqueda } from '@/services/api'

defineProps<{
  placeholder?: string
}>()

const emit = defineEmits<{
  select: [paciente: PacienteBusqueda]
}>()

const MINIMO = 2
const RETARDO_MS = 250

const contenedor = ref<HTMLElement | null>(null)
const inputRef = ref<HTMLInputElement | null>(null)
const dropdownRef = ref<HTMLElement | null>(null)
const estiloDropdown = reactive({ left: '0px', top: '0px', width: '0px' })

const query = ref('')
const abierto = ref(false)
const cargando = ref(false)
const resultados = ref<PacienteBusqueda[]>([])
const indiceResaltado = ref(-1)

let temporizador: ReturnType<typeof setTimeout> | null = null
let peticionActual = 0

function actualizarPosicion() {
  const rect = contenedor.value?.getBoundingClientRect()
  if (!rect) return
  estiloDropdown.left = `${rect.left}px`
  estiloDropdown.top = `${rect.bottom + 4}px`
  estiloDropdown.width = `${rect.width}px`
}

function abrir() {
  abierto.value = true
  nextTick(actualizarPosicion)
}

function cerrar() {
  abierto.value = false
  indiceResaltado.value = -1
}

function limpiar() {
  query.value = ''
  resultados.value = []
  indiceResaltado.value = -1
  inputRef.value?.focus()
}

async function buscar() {
  const texto = query.value.trim()
  if (texto.length < MINIMO) {
    resultados.value = []
    cargando.value = false
    return
  }

  const id = ++peticionActual
  cargando.value = true
  try {
    const data = await pacientesService.buscarPacientes(texto)
    // Ignora respuestas viejas si el usuario siguió escribiendo.
    if (id !== peticionActual) return
    resultados.value = Array.isArray(data) ? data : []
    indiceResaltado.value = -1
  } catch (error) {
    if (id === peticionActual) {
      console.error('Error buscando pacientes:', error)
      resultados.value = []
    }
  } finally {
    if (id === peticionActual) cargando.value = false
  }
}

function onInput() {
  abierto.value = true
  nextTick(actualizarPosicion)
  if (temporizador) clearTimeout(temporizador)
  temporizador = setTimeout(buscar, RETARDO_MS)
}

function seleccionar(paciente: PacienteBusqueda) {
  emit('select', paciente)
  query.value = paciente.Paciente
  cerrar()
}

function mover(delta: number) {
  const total = resultados.value.length
  if (total === 0) return
  let idx = indiceResaltado.value + delta
  if (idx < 0) idx = total - 1
  if (idx >= total) idx = 0
  indiceResaltado.value = idx
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    cerrar()
    inputRef.value?.blur()
    return
  }
  if (!abierto.value) {
    if (e.key === 'ArrowDown' || e.key === 'Enter') abrir()
    return
  }
  if (e.key === 'ArrowDown') {
    e.preventDefault()
    mover(1)
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    mover(-1)
  } else if (e.key === 'Enter') {
    e.preventDefault()
    const paciente = resultados.value[indiceResaltado.value]
    if (paciente) seleccionar(paciente)
  }
}

function alClicFuera(e: MouseEvent) {
  if (!abierto.value) return
  const objetivo = e.target as Node
  if (contenedor.value?.contains(objetivo)) return
  if (dropdownRef.value?.contains(objetivo)) return
  cerrar()
}

function alDesplazar() {
  if (abierto.value) actualizarPosicion()
}

onMounted(() => {
  document.addEventListener('mousedown', alClicFuera)
  document.addEventListener('click', alClicFuera)
  window.addEventListener('resize', alDesplazar)
  document.addEventListener('scroll', alDesplazar, true)
})

onBeforeUnmount(() => {
  if (temporizador) clearTimeout(temporizador)
  document.removeEventListener('mousedown', alClicFuera)
  document.removeEventListener('click', alClicFuera)
  window.removeEventListener('resize', alDesplazar)
  document.removeEventListener('scroll', alDesplazar, true)
})
</script>
