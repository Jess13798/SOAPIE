<!-- Propósito: Componente visual del módulo "notas". -->

<template>
  <svg
    viewBox="0 0 24 24"
    fill="none"
    class="shrink-0"
    :class="[colorClass, sizeClass || 'h-6 w-6']"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="9.25" stroke="currentColor" stroke-width="1.5" />
    <circle cx="9" cy="9.75" r="0.9" fill="currentColor" />
    <circle cx="15" cy="9.75" r="0.9" fill="currentColor" />
    <path
      :d="mouthPath"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <template v-if="showTears">
      <path d="M7.6 12.1l-0.8 1.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
      <path d="M16.4 12.1l0.8 1.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
    </template>
  </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  score: number
  sizeClass?: string
}>()

const colorClass = computed(() => {
  if (props.score <= 0) return 'text-emerald-500'
  if (props.score <= 2) return 'text-lime-500'
  if (props.score <= 4) return 'text-yellow-500'
  if (props.score <= 6) return 'text-orange-400'
  if (props.score <= 8) return 'text-orange-600'
  return 'text-red-600'
})

const mouthPath = computed(() => {
  if (props.score <= 0) return 'M7.5 14.25c1.1 1.9 3 2.9 4.5 2.9s3.4-1 4.5-2.9'
  if (props.score <= 2) return 'M8.25 14.5c1 1.4 2.3 2.1 3.75 2.1s2.75-.7 3.75-2.1'
  if (props.score <= 4) return 'M8.5 15.5h7'
  if (props.score <= 6) return 'M8.25 16c1-1.4 2.3-2.1 3.75-2.1s2.75.7 3.75 2.1'
  if (props.score <= 8) return 'M7.75 16.5c1.1-1.8 2.8-2.7 4.25-2.7s3.15.9 4.25 2.7'
  return 'M7.5 16.75c1.2-2 3-3 4.5-3s3.3 1 4.5 3'
})

const showTears = computed(() => props.score >= 10)
</script>
