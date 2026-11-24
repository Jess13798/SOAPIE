<template>
  <div v-if="isOpen" class="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-5">
    <button class="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" aria-label="Cerrar Kardex" @click="$emit('close')"></button>

    <div class="relative flex h-[94vh] w-full max-w-6xl flex-col">
      <KardexSheet :id-cuenta="idCuenta" :patient="patient">
        <template #actions>
          <button type="button" class="rounded-md p-2 text-slate-500 hover:bg-red-50 hover:text-red-600" aria-label="Cerrar" @click="$emit('close')">
            <X class="h-5 w-5" />
          </button>
        </template>
      </KardexSheet>
    </div>
  </div>
</template>

<script setup lang="ts">
import { X } from 'lucide-vue-next'
import type { Patient } from '@/types'
import KardexSheet from './KardexSheet.vue'

defineProps<{
  isOpen: boolean
  idCuenta: string | number
  patient: Patient
}>()

defineEmits<{ close: [] }>()
</script>
