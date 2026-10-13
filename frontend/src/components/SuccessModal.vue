<template>
  <Transition name="scale">
    <div v-if="show" class="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]"></div>

      <div class="relative w-full max-w-[320px] overflow-hidden rounded-[40px] border border-slate-100 bg-white p-8 text-center shadow-2xl">
        <div
          class="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full shadow-inner"
          :class="warning ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-500'"
        >
          <div
            class="flex h-14 w-14 items-center justify-center rounded-full text-white shadow-lg animate-bounce"
            :class="warning ? 'bg-amber-500 shadow-amber-200' : 'bg-emerald-500 shadow-emerald-200'"
          >
            <Check class="h-8 w-8 stroke-[3px]" />
          </div>
        </div>

        <h3 class="mb-6 text-xl font-black uppercase tracking-tight text-slate-800">{{ title }}</h3>
        <p v-if="warning" class="-mt-3 mb-5 text-sm leading-relaxed text-amber-900">{{ warningMessage }}</p>
        <p v-else-if="infoMessage" class="-mt-3 mb-5 text-sm leading-relaxed text-slate-600">{{ infoMessage }}</p>

        <button
          @click="$emit('confirm')"
          class="flex w-full items-center justify-center rounded-full py-3.5 text-sm font-bold text-white transition-all shadow-lg active:scale-95"
          :class="warning ? 'bg-amber-600 shadow-amber-200 hover:bg-amber-700' : 'bg-green-600 shadow-green-200 hover:bg-green-700'"
        >
          <Check v-if="checkOnlyButton" class="h-5 w-5 stroke-[3px]" />
          <span v-else>{{ buttonLabel }}</span>
        </button>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { Check } from 'lucide-vue-next'

withDefaults(defineProps<{
  show: boolean
  title?: string
  buttonLabel?: string
  checkOnlyButton?: boolean
  warning?: boolean
  warningMessage?: string
  infoMessage?: string
}>(), {
  title: 'SE REGISTRO',
  buttonLabel: 'ENTENDIDO',
  checkOnlyButton: false,
  warning: false,
  warningMessage: 'La nota y sus signos vitales solo están en la memoria de esta sesión. No se guardaron en SQL Server y se perderán al cerrar o recargar.',
})

defineEmits<{
  confirm: []
}>()
</script>

<style scoped>
.scale-enter-active,
.scale-leave-active {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.scale-enter-from,
.scale-leave-to {
  opacity: 0;
  transform: scale(0.8);
}
</style>
