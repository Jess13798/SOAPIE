<template>
  <Teleport to="body">
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="absolute inset-0 bg-black/50" @click="$emit('close')"></div>

      <div class="relative z-10 w-[98vw] max-w-7xl max-h-[90vh] overflow-hidden rounded-xl bg-white shadow-2xl">
        <div class="flex items-center justify-between border-b border-sky-700 bg-sky-800 px-4 py-2.5">
          <div>
            <h3 class="text-lg font-bold text-white">Resumen de Camas</h3>
            <p class="text-xs font-medium text-sky-100">
              {{ servicioActual }} | Total: {{ total }} | Ocupadas: {{ ocupadas.length }} | Disponibles: {{ disponibles.length }}
            </p>
          </div>
          <button
            @click="$emit('close')"
            class="rounded-lg p-2 text-sky-100 hover:bg-sky-700 hover:text-white"
            aria-label="Cerrar"
          >
            ×
          </button>
        </div>

        <div class="grid grid-cols-1 gap-3 p-4 lg:grid-cols-2">
          <div class="overflow-hidden rounded-lg border border-slate-200">
            <div class="max-h-[72vh] overflow-y-auto">
              <table class="w-full border-collapse text-left">
                <thead>
                  <tr class="bg-cyan-600 text-white">
                    <th class="px-2 py-2 text-[11px] font-bold uppercase whitespace-nowrap">Cama</th>
                    <th class="px-2 py-2 text-[11px] font-bold uppercase whitespace-nowrap">Cuenta</th>
                    <th class="px-2 py-2 text-[11px] font-bold uppercase whitespace-nowrap">Historia</th>
                    <th class="px-2 py-2 text-[11px] font-bold uppercase whitespace-nowrap">Paciente</th>
                    <th class="px-2 py-2 text-[10px] font-bold uppercase whitespace-nowrap">Estado</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                  <tr
                    v-for="row in camasIzquierda"
                    :key="`left-${row.cama}-${row.nroCuenta}-${row.historia}`"
                    class="odd:bg-slate-50 even:bg-white"
                  >
                    <td class="px-2 py-1.5 text-xs font-bold text-slate-700 whitespace-nowrap">{{ row.cama || '-' }}</td>
                    <td class="px-2 py-1.5 text-xs text-slate-700 whitespace-nowrap">{{ row.nroCuenta || '' }}</td>
                    <td class="px-2 py-1.5 text-xs text-slate-700 whitespace-nowrap">{{ row.historia || '' }}</td>
                    <td class="px-2 py-1.5 text-xs font-semibold whitespace-nowrap" :class="row.paciente ? 'text-slate-800' : 'text-slate-400'">
                      {{ row.paciente || '' }}
                    </td>
                    <td class="px-2 py-1.5 text-[10px] font-bold uppercase whitespace-nowrap" :class="row.ocupada ? 'text-red-600' : 'text-emerald-600'">
                      {{ row.ocupada ? 'Ocupada' : 'Disponible' }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div class="overflow-hidden rounded-lg border border-slate-200">
            <div class="max-h-[72vh] overflow-y-auto">
              <table class="w-full border-collapse text-left">
                <thead>
                  <tr class="bg-cyan-600 text-white">
                    <th class="px-2 py-2 text-[11px] font-bold uppercase whitespace-nowrap">Cama</th>
                    <th class="px-2 py-2 text-[11px] font-bold uppercase whitespace-nowrap">Cuenta</th>
                    <th class="px-2 py-2 text-[11px] font-bold uppercase whitespace-nowrap">Historia</th>
                    <th class="px-2 py-2 text-[11px] font-bold uppercase whitespace-nowrap">Paciente</th>
                    <th class="px-2 py-2 text-[10px] font-bold uppercase whitespace-nowrap">Estado</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                  <tr
                    v-for="row in camasDerecha"
                    :key="`right-${row.cama}-${row.nroCuenta}-${row.historia}`"
                    class="odd:bg-slate-50 even:bg-white"
                  >
                    <td class="px-2 py-1.5 text-xs font-bold text-slate-700 whitespace-nowrap">{{ row.cama || '-' }}</td>
                    <td class="px-2 py-1.5 text-xs text-slate-700 whitespace-nowrap">{{ row.nroCuenta || '' }}</td>
                    <td class="px-2 py-1.5 text-xs text-slate-700 whitespace-nowrap">{{ row.historia || '' }}</td>
                    <td class="px-2 py-1.5 text-xs font-semibold whitespace-nowrap" :class="row.paciente ? 'text-slate-800' : 'text-slate-400'">
                      {{ row.paciente || '' }}
                    </td>
                    <td class="px-2 py-1.5 text-[10px] font-bold uppercase whitespace-nowrap" :class="row.ocupada ? 'text-red-600' : 'text-emerald-600'">
                      {{ row.ocupada ? 'Ocupada' : 'Disponible' }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Patient } from '@/types'

const props = defineProps<{
  isOpen: boolean
  pacientes: Patient[]
}>()

defineEmits<{
  close: []
}>()

const ocupadas = computed(() => props.pacientes.filter(p => !!p.numCuenta))
const disponibles = computed(() => props.pacientes.filter(p => !p.numCuenta))
const total = computed(() => props.pacientes.length)
const servicioActual = computed(() => props.pacientes[0]?.servicio || 'Servicio seleccionado')

function compareCama(a: string, b: string) {
  const rx = /^(\d+)([A-Za-z]*)$/
  const ma = (a || '').trim().toUpperCase().match(rx)
  const mb = (b || '').trim().toUpperCase().match(rx)
  if (!ma || !mb) return (a || '').localeCompare(b || '')

  const na = Number(ma[1])
  const nb = Number(mb[1])
  if (na !== nb) return na - nb

  return ma[2].localeCompare(mb[2])
}

const camasOrdenadas = computed(() => {
  return props.pacientes
    .map(p => ({
      cama: p.habitacion || p.cama || '',
      nroCuenta: p.numCuenta || '',
      historia: p.historiaClinica || '',
      paciente: p.apellido || '',
      ocupada: !!p.numCuenta,
    }))
    .sort((a, b) => compareCama(a.cama, b.cama))
})

const mitad = computed(() => Math.ceil(camasOrdenadas.value.length / 2))
const camasIzquierda = computed(() => camasOrdenadas.value.slice(0, mitad.value))
const camasDerecha = computed(() => camasOrdenadas.value.slice(mitad.value))
</script>
