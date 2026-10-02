<template>
  <div v-if="isOpen" class="fixed inset-0 z-[110] flex items-center justify-center p-4">
    <!-- Backdrop -->
    <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" @click="$emit('close')"></div>
    
    <!-- Modal Content -->
    <div class="relative w-full max-w-6xl transform overflow-hidden rounded-xl bg-white shadow-2xl transition-all border border-slate-200 flex flex-col max-h-[90vh]">
      <!-- Header -->
      <div class="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
        <div class="flex items-center gap-3">
          <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 shadow-sm text-white">
            <Book class="h-5 w-5" />
          </div>
          <div>
            <h3 class="text-lg font-black text-slate-800 uppercase tracking-tight leading-none">Historial de Signos Vitales</h3>
            <p class="text-[11px] font-bold text-slate-400 mt-1 uppercase">Registros capturados para esta nota</p>
          </div>
        </div>
        
        <button 
          @click="$emit('close')"
          class="rounded-md p-1.5 bg-slate-200 text-slate-600 hover:bg-red-500 hover:text-white transition-all shadow-sm"
        >
          <X class="h-4 w-4 stroke-[3px]" />
        </button>
      </div>

      <!-- Table Content Area -->
      <div class="flex-1 flex flex-col min-h-0 p-6 pt-2">
        <div 
          ref="scrollContainer"
          class="flex-1 overflow-auto custom-scrollbar border border-slate-200 rounded-lg shadow-sm" 
          @scroll="handleScroll"
        >
          <div v-if="loading && history.length === 0" class="flex flex-col items-center justify-center py-20 gap-4 bg-white">
          <div class="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent"></div>
          <span class="text-sm font-bold text-slate-500 uppercase tracking-widest animate-pulse">Cargando Historial...</span>
        </div>
        
          <div v-else-if="history.length === 0" class="flex flex-col items-center justify-center py-20 text-slate-400 gap-3 bg-white">
          <div class="bg-slate-100 p-4 rounded-full">
            <Database class="h-10 w-10 opacity-20" />
          </div>
          <p class="text-sm font-bold uppercase tracking-tight">No se encontraron registros de signos vitales</p>
        </div>

          <table v-else class="w-full text-left border-collapse bg-white">
            <thead class="sticky top-0 z-20">
              <tr class="bg-blue-900 text-white font-bold">
                <th v-for="col in headers" :key="col" class="px-4 py-3 text-[10px] font-black uppercase tracking-wider border-r border-blue-800 last:border-0 leading-tight">
                  {{ col }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, idx) in history" :key="row.IdSignoVital" 
                class="hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0"
                :class="idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'"
              >
                <td class="px-4 py-2.5 text-[11px] font-bold text-slate-700 border-r border-slate-100">{{ (row.TotalCount || history.length) - idx }}</td>
                <td class="px-4 py-2.5 text-[11px] font-black text-slate-700 border-r border-slate-100 tabular-nums">{{ formatFecha(row.Fecha_Hora) }}</td>
                <td class="px-4 py-2.5 text-[11px] font-bold text-blue-600 border-r border-slate-100">{{ row.Peso }}</td>
                <td class="px-4 py-2.5 text-[11px] font-bold text-slate-700 border-r border-slate-100">{{ row.Talla }}</td>
                <td class="px-4 py-2.5 text-[11px] font-bold text-slate-700 border-r border-slate-100">{{ row.P_Cefalico }}</td>
                <td class="px-4 py-2.5 text-[11px] font-bold text-slate-700 border-r border-slate-100">{{ row.P_Abdominal }}</td>
                <td class="px-4 py-2.5 text-[11px] font-bold text-slate-700 border-r border-slate-100">{{ row.Hemoglucotest }}</td>
                <td class="px-4 py-2.5 text-[11px] font-black text-rose-600 border-r border-slate-100 whitespace-nowrap">{{ row.Presion_Arterial }}</td>
                <td class="px-4 py-2.5 text-[11px] font-black text-slate-700 border-r border-slate-100">{{ row.Frec_Cardiaca }}</td>
                <td class="px-4 py-2.5 text-[11px] font-black text-slate-700 border-r border-slate-100">{{ row.Frec_Respiratoria }}</td>
                <td class="px-4 py-2.5 text-[11px] font-black text-orange-600 border-r border-slate-100">{{ row.Temperatura }}</td>
                <td class="px-4 py-2.5 text-[11px] font-black text-emerald-600 border-r border-slate-100">{{ row.Saturacion }}</td>
                <td class="px-4 py-2.5 text-[10px] font-bold text-slate-500 lowercase first-letter:uppercase">{{ row.NombreUsuario || 'Sin usuario' }}</td>
              </tr>
            </tbody>
          </table>
          
          <!-- Loading indicator -->
          <div v-if="loadingMore" class="sticky bottom-0 z-10 flex items-center justify-center p-3 border-t border-slate-100 bg-white/90 backdrop-blur-sm shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
            <div class="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent mr-2"></div>
            <span class="text-[9px] font-black uppercase text-slate-500 tracking-widest">Cargando más...</span>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end">
        <button 
          @click="$emit('close')"
          class="px-5 py-2 rounded-lg bg-red-600 text-white text-xs font-black uppercase tracking-widest hover:bg-red-700 transition-all shadow-md active:scale-95"
        >
          Cerrar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import { Book, X, Database } from 'lucide-vue-next'
import { notasService } from '@/services/api'

const props = defineProps<{
  isOpen: boolean
  idNota: string | number
}>()

const scrollContainer = ref<HTMLElement | null>(null)

defineEmits<{
  close: []
}>()

const history = ref<any[]>([])
const loading = ref(false)
const loadingMore = ref(false)
const page = ref(1)
const hasMore = ref(true)
const LIMIT = 10

const headers = [
  'ID', 'FECHA / HORA', 'PESO', 'TALLA', 'P.CEF', 'P.ABD', 
  'HEMOG', 'P. ART', 'F.CARD', 'F.RESP', 'TEMP', 'SAT', 'USUARIO'
]

const fetchHistory = async (isLoadMore = false) => {
  if (!props.idNota || isNaN(Number(props.idNota))) {
    history.value = []
    hasMore.value = false
    return
  }
  
  if (isLoadMore) {
    loadingMore.value = true
  } else {
    loading.value = true
    page.value = 1
    history.value = []
    hasMore.value = true
  }

  try {
    const data = await notasService.getHistorialVitals(props.idNota, LIMIT, page.value)
    
    if (data.length > 0) {
      if (isLoadMore) {
        history.value = [...history.value, ...data]
      } else {
        history.value = data
      }

      const totalCount = data[0].TotalCount || 0
      if (history.value.length >= totalCount) {
        hasMore.value = false
      }

      // Si el contenido aún no llena el contenedor y hay más registros, pedir la siguiente página
      await nextTick()
      if (hasMore.value && scrollContainer.value && scrollContainer.value.scrollHeight <= scrollContainer.value.clientHeight) {
        page.value++
        fetchHistory(true)
      }
    } else {
      hasMore.value = false
    }
  } catch (err) {
    console.error('Error fetching vitals history:', err)
  } finally {
    loading.value = false
    loadingMore.value = false
  }
}

const handleScroll = (e: Event) => {
  const target = e.target as HTMLElement
  if (!hasMore.value || loadingMore.value) return

  if (target.scrollHeight - target.scrollTop <= target.clientHeight + 20) {
    page.value++
    fetchHistory(true)
  }
}

const formatFecha = (dateStr: string) => {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  return date.toLocaleString('es-ES', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit'
  })
}

watch(() => props.isOpen, (newVal) => {
  if (newVal) fetchHistory()
})
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
