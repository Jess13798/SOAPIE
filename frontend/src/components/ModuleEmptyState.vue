<template>
  <div class="flex flex-1 items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white p-8">
    <div class="max-w-md text-center">
      <div class="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-sky-50 text-sky-800">
        <component :is="icon" class="h-6 w-6" />
      </div>
      <h3 class="text-sm font-black uppercase tracking-wide text-slate-700">{{ title }}</h3>
      <p class="mt-1 text-sm text-slate-500">{{ message }}</p>
      <button
        type="button"
        class="mt-4 rounded-md bg-sky-800 px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-sky-700"
        @click="$emit('go-pacientes')"
      >
        Ir a Pacientes
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Component } from 'vue'

defineProps<{
  title: string
  message: string
  icon: Component
}>()

defineEmits<{ 'go-pacientes': [] }>()
</script>
