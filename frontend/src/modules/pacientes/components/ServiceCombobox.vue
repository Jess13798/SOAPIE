<template>
  <div ref="contenedor" class="relative w-full">
    <div class="relative">
      <Search class="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
      <input
        ref="inputRef"
        v-model="query"
        type="text"
        autocomplete="off"
        :placeholder="placeholder || 'Buscar servicio...'"
        class="w-full rounded-lg border border-sky-200 bg-white py-1.5 pl-8 pr-8 text-xs text-slate-700 placeholder:text-slate-400 focus:border-sky-300 focus:ring-2 focus:ring-sky-300"
        @focus="abrir"
        @click="abrir"
        @input="onInput"
        @keydown="onKeydown"
      />
      <button
        type="button"
        class="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600"
        aria-label="Mostrar servicios"
        @mousedown.prevent
        @click="toggle"
      >
        <ChevronDown class="h-4 w-4" />
      </button>
    </div>

    <!-- Lista desplegable: se teleporta al body para que ninguna tarjeta con
         overflow la recorte (antes quedaba oculta bajo la tabla). -->
    <Teleport to="body">
      <ul
        v-if="abierto"
        ref="dropdownRef"
        :style="estiloDropdown"
        class="fixed z-50 max-h-64 overflow-auto rounded-lg border border-slate-200 bg-white py-1 text-xs shadow-lg"
      >
        <li
          class="cursor-pointer px-3 py-1.5 font-semibold text-slate-500 hover:bg-sky-50"
          @mousedown.prevent
          @click="seleccionar(null)"
        >
          Todos los servicios
        </li>

        <li v-if="filtrados.length === 0" class="px-3 py-2 italic text-slate-400">
          Sin resultados
        </li>

        <li
          v-for="(servicio, i) in filtrados"
          :key="servicio.IdServicio"
          :class="[
            'cursor-pointer px-3 py-1.5',
            i === indiceResaltado ? 'bg-sky-100 text-sky-900' : 'text-slate-700 hover:bg-sky-50'
          ]"
          @mousedown.prevent
          @click="seleccionar(servicio)"
          @mousemove="indiceResaltado = i"
        >
          {{ servicio.Nombre }}
        </li>
      </ul>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
// Combobox de servicios: funciona como barra de búsqueda y menú desplegable a la vez.
// No preselecciona nada: si no hay valor, muestra el placeholder.
// El desplegable se cierra al hacer clic fuera, no al primer clic interno.
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import { ChevronDown, Search } from 'lucide-vue-next'
import type { Servicio } from '@/services/api'

const props = defineProps<{
  servicios?: Servicio[]
  modelValue: string
  placeholder?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const contenedor = ref<HTMLElement | null>(null)
const inputRef = ref<HTMLInputElement | null>(null)
const dropdownRef = ref<HTMLElement | null>(null)
const abierto = ref(false)
const query = ref('')
const indiceResaltado = ref(-1)
const estiloDropdown = reactive({
  left: '0px',
  top: '0px',
  width: '0px',
})

const servicioSeleccionado = computed(() =>
  props.servicios?.find((s) => String(s.IdServicio) === String(props.modelValue))
)

const filtrados = computed(() => {
  const lista = props.servicios || []
  const q = query.value.trim().toLowerCase()
  const nombreSel = (servicioSeleccionado.value?.Nombre || '').trim().toLowerCase()
  // Si no se escribe nada (o el texto es el nombre ya seleccionado), se muestra toda la lista.
  if (!q || q === nombreSel) return lista
  return lista.filter((s) => s.Nombre.toLowerCase().includes(q))
})

watch(
  () => props.modelValue,
  () => {
    query.value = servicioSeleccionado.value?.Nombre || ''
  },
  { immediate: true }
)

function actualizarPosicion() {
  const rect = contenedor.value?.getBoundingClientRect()
  if (!rect) return
  estiloDropdown.left = `${rect.left}px`
  estiloDropdown.top = `${rect.bottom + 4}px`
  estiloDropdown.width = `${rect.width}px`
}

function abrir() {
  abierto.value = true
  indiceResaltado.value = -1
  nextTick(() => {
    actualizarPosicion()
    inputRef.value?.focus()
  })
}

function cerrar() {
  abierto.value = false
  indiceResaltado.value = -1
  query.value = servicioSeleccionado.value?.Nombre || ''
}

function toggle() {
  if (abierto.value) cerrar()
  else abrir()
}

function onInput() {
  abierto.value = true
  indiceResaltado.value = -1
  nextTick(actualizarPosicion)
}

function seleccionar(servicio: Servicio | null) {
  if (servicio) {
    emit('update:modelValue', String(servicio.IdServicio))
    query.value = servicio.Nombre
  } else {
    emit('update:modelValue', '')
    query.value = ''
  }
  abierto.value = false
  indiceResaltado.value = -1
}

function mover(delta: number) {
  const total = filtrados.value.length
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
    const servicio = filtrados.value[indiceResaltado.value]
    if (servicio) seleccionar(servicio)
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
  document.removeEventListener('mousedown', alClicFuera)
  document.removeEventListener('click', alClicFuera)
  window.removeEventListener('resize', alDesplazar)
  document.removeEventListener('scroll', alDesplazar, true)
})
</script>
