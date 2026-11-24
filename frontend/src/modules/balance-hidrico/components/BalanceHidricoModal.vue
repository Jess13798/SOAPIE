<template>
  <div v-if="isOpen" class="fixed inset-0 z-[110] flex items-center justify-center p-4">
    <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" @click="$emit('close')"></div>

    <div class="relative flex h-[90vh] w-full max-w-6xl flex-col">
      <BalanceHidricoSheet :id-cuenta="idCuenta" :patient="patient" :id-nota="idNota">
        <template #actions>
          <button @click="$emit('close')" class="rounded-md p-1.5 bg-slate-200 text-slate-600 hover:bg-red-500 hover:text-white transition-all shadow-sm">
            <X class="h-4 w-4 stroke-[3px]" />
          </button>
        </template>
      </BalanceHidricoSheet>
    </div>
  </div>
</template>

<script setup lang="ts">
import { X } from 'lucide-vue-next'
import type { Patient } from '@/types'
import BalanceHidricoSheet from './BalanceHidricoSheet.vue'

defineProps<{
  isOpen: boolean
  idCuenta: string | number
  patient?: Patient
  idNota?: string | number | null
}>()

defineEmits<{ close: [] }>()
</script>
