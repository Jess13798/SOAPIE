<template>
  <section class="mx-auto max-w-6xl space-y-5">
    <div class="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
      <p class="font-bold">Prototipo de busqueda</p>
      <p class="mt-1">
        Catálogo de demostración para probar búsqueda y relaciones.
      </p>
    </div>

    <div class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <form class="flex flex-col gap-3 sm:flex-row" @submit.prevent="buscar">
        <label class="flex-1">
          <span class="mb-1 block text-sm font-semibold text-slate-700">Buscar diagnóstico NANDA</span>
          <input
            v-model="texto"
            type="search"
            maxlength="100"
            placeholder="Buscar por código, diagnóstico o dominio"
            class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
          />
        </label>
        <div class="flex items-end gap-2">
          <button
            type="submit"
            :disabled="loading"
            class="rounded-lg bg-sky-700 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {{ loading ? 'Buscando…' : 'Buscar' }}
          </button>
          <button
            type="button"
            :disabled="loading || !texto"
            class="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            @click="limpiar"
          >
            Limpiar
          </button>
        </div>
      </form>
    </div>

    <p v-if="error" role="alert" class="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
      {{ error }}
    </p>

    <div v-if="loading" class="py-12 text-center text-sm font-medium text-slate-500" role="status">
      Cargando catálogo…
    </div>

    <div v-else-if="!error && diagnosticos.length === 0" class="rounded-xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
      No se encontraron diagnósticos. Prueba con otro término.
    </div>

    <div v-else class="space-y-4">
      <article
        v-for="item in diagnosticos"
        :key="item.id"
        class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
      >
        <header class="border-b border-slate-100 bg-slate-50 px-5 py-4">
          <div class="flex flex-wrap items-center gap-2">
            <span class="rounded-md bg-sky-100 px-2 py-1 text-xs font-black text-sky-800">{{ item.codigo }}</span>
            <h3 class="text-base font-bold text-slate-900">{{ item.diagnostico }}</h3>
          </div>
          <p class="mt-2 text-xs text-slate-500">
            <span v-if="item.dominio">Dominio: {{ item.dominio }}</span>
            <span v-if="item.dominio && item.clase"> · </span>
            <span v-if="item.clase">Clase: {{ item.clase }}</span>
          </p>
          <p v-if="item.definicion" class="mt-2 text-sm text-slate-600">{{ item.definicion }}</p>
        </header>

        <div class="grid gap-4 p-5 lg:grid-cols-2">
          <section>
            <h4 class="mb-3 text-xs font-black uppercase tracking-wide text-emerald-800">Resultados NOC</h4>
            <ul v-if="item.noc.length" class="space-y-2">
              <li v-for="noc in item.noc" :key="noc.id" class="rounded-lg border border-emerald-100 bg-emerald-50/50 p-3">
                <p class="text-sm font-semibold text-slate-800">
                  <span class="mr-2 text-xs font-black text-emerald-800">{{ noc.codigo }}</span>{{ noc.resultado }}
                </p>
                <p v-if="noc.escalaLikert" class="mt-1 text-xs text-slate-600">Escala: {{ noc.escalaLikert }}</p>
                <p v-if="noc.definicion" class="mt-1 text-xs text-slate-600">{{ noc.definicion }}</p>
              </li>
            </ul>
            <p v-else class="text-sm text-slate-500">Sin resultados vinculados.</p>
          </section>

          <section>
            <h4 class="mb-3 text-xs font-black uppercase tracking-wide text-violet-800">Intervenciones NIC</h4>
            <ul v-if="item.nic.length" class="space-y-2">
              <li v-for="nic in item.nic" :key="nic.id" class="rounded-lg border border-violet-100 bg-violet-50/50 p-3">
                <p class="text-sm font-semibold text-slate-800">
                  <span class="mr-2 text-xs font-black text-violet-800">{{ nic.codigo }}</span>{{ nic.intervencion }}
                </p>
                <p v-if="nic.definicion" class="mt-1 text-xs text-slate-600">{{ nic.definicion }}</p>
              </li>
            </ul>
            <p v-else class="text-sm text-slate-500">Sin intervenciones vinculadas.</p>
          </section>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { catalogosService, type NandaConInterrelaciones } from '@/services/api'

const texto = ref('')
const diagnosticos = ref<NandaConInterrelaciones[]>([])
const loading = ref(false)
const error = ref('')

async function cargarCatalogo(buscar: string) {
  loading.value = true
  error.value = ''
  try {
    diagnosticos.value = await catalogosService.buscarNandaNocNic(buscar)
  } catch (err) {
    diagnosticos.value = []
    error.value = err instanceof Error ? err.message : 'Ocurrió un error al consultar el catálogo.'
  } finally {
    loading.value = false
  }
}

function buscar() {
  void cargarCatalogo(texto.value.trim())
}

function limpiar() {
  texto.value = ''
  void cargarCatalogo('')
}

onMounted(() => {
  void cargarCatalogo('')
})
</script>
