<template>
  <div class="relative">
    <button
      @click.stop="toggleMenu"
      class="flex items-center gap-1.5 rounded-full bg-blue-500 p-1.5 text-white hover:bg-blue-600 focus:ring-2 focus:ring-blue-500/50 transition-all shadow-sm shadow-blue-200/50"
      title="Acciones de cama"
    >
      <Bed class="h-4 w-4" />
    </button>
    <Transition name="fade">
      <div
        v-if="isOpen"
        class="fixed w-40 rounded-lg border border-slate-200 bg-white shadow-xl ring-1 ring-slate-100 z-[200]"
        :style="{
          top: `${position.top}px`,
          left: `${position.left}px`
        }"
      >
        <button
          class="flex w-full items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-blue-50"
          @click.stop="handleOption('cama')"
        >
          <Bed class="h-4 w-4 text-blue-600" />
          Cama
        </button>
        <button
          class="flex w-full items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-emerald-50"
          @click.stop="handleOption('transferencia')"
        >
          <ArrowLeftRight class="h-4 w-4 text-emerald-600" />
          Transferencia
        </button>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { Bed, ArrowLeftRight } from 'lucide-vue-next'
import type { Patient } from '@/types'

const props = defineProps<{
  patient: Patient
}>()

const emit = defineEmits<{
  'view-bed': [patient: Patient]
  'view-transfer': [patient: Patient]
}>()

const isOpen = ref(false)
const position = ref({ top: 0, left: 0 })

function toggleMenu(event: MouseEvent) {
  isOpen.value = !isOpen.value
  if (!isOpen.value) return

  nextTick(() => {
    const btn = event.currentTarget as HTMLElement | null
    if (!btn) return
    const rect = btn.getBoundingClientRect()
    const menuHeight = 110
    const menuWidth = 160
    const margin = 8
    const dropUp = rect.bottom + menuHeight + margin > window.innerHeight && rect.top > menuHeight
    const top = dropUp ? rect.top - menuHeight - margin : rect.bottom + margin
    let left = rect.right - menuWidth
    left = Math.min(Math.max(left, 8), window.innerWidth - menuWidth - 8)
    position.value = { top, left }
  })
}

function handleOption(option: 'cama' | 'transferencia') {
  isOpen.value = false
  if (option === 'cama') {
    emit('view-bed', props.patient)
  } else {
    emit('view-transfer', props.patient)
  }
}

function handleClickOutside() {
  if (isOpen.value) isOpen.value = false
}

onMounted(() => {
  window.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  window.removeEventListener('click', handleClickOutside)
})
</script>
