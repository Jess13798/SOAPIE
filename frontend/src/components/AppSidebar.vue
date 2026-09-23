<template>
  <div class="flex h-screen bg-slate-50">
    <aside 
      :class="[
        'flex h-full flex-col border-r border-sky-900 bg-sky-800 text-white transition-all duration-300 ease-in-out z-40',
        isCollapsed ? 'w-20' : 'w-64 sm:w-72'
      ]"
    >
      <div class="flex items-center justify-between border-b border-sky-700/60 px-4 py-5 bg-sky-900/70">
        <div v-if="!isCollapsed" class="flex items-center gap-3 overflow-hidden">
          <div class="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg overflow-hidden">
            <img src="/enfermera2.gif" alt="Logo animado" class="h-full w-full object-cover" />
          </div>
           <div>
        
        <span class="text-xs font-bold text-white">Hospital Regional de Cañete</span>
      </div>
        </div>
        
        <button 
          @click="toggleSidebar" 
          :class="['rounded-md p-1.5 hover:bg-sky-700/60 text-sky-200/70 hover:text-white transition-colors', isCollapsed ? 'mx-auto' : '']"
          title="Alternar Sidebar"
        >
          <Menu v-if="isCollapsed" class="h-5 w-5" />
          <ChevronLeft v-else class="h-5 w-5" />
        </button>
      </div>

      <nav class="flex flex-col gap-2 px-3 py-4">
        <button
          v-for="item in navItems"
          :key="item.view"
          @click="handleNavClick(item.view)"
          :class="[
            'flex items-center rounded-md transition-all duration-200',
            isCollapsed ? 'justify-center h-12 w-12 mx-auto' : 'gap-3 px-3 py-2.5 text-sm font-medium',
            activeView === item.view ? 'bg-sky-700/70 text-white shadow-sm' : 'text-sky-100/85 hover:bg-sky-700/40'
          ]"
          :title="isCollapsed ? item.label : ''"
        >
          <component 
            :is="item.icon" 
            :class="['flex-shrink-0', isCollapsed ? 'h-6 w-6' : 'h-4 w-4', activeView === item.view ? 'text-sky-200' : 'text-sky-100/70']" 
          />
          <span v-if="!isCollapsed" class="whitespace-nowrap overflow-hidden">
            {{ item.label }}
          </span>
        </button>
      </nav>

      <div class="flex-1 overflow-hidden border-t border-sky-700/50 flex flex-col">
        <div class="flex-1"></div>
      </div>

      <div class="border-t border-sky-700/50 p-3 bg-sky-900/70">
        <button
          @click="logout"
          :class="[
            'flex items-center rounded-md transition-colors text-red-400 hover:bg-red-400/10',
            isCollapsed ? 'justify-center h-12 w-12 mx-auto' : 'w-full gap-3 px-3 py-2 text-sm font-medium'
          ]"
          title="Cerrar Sesión"
        >
          <LogOut :class="isCollapsed ? 'h-6 w-6' : 'h-4 w-4'" />
          <span v-if="!isCollapsed" class="whitespace-nowrap">Cerrar Sesión</span>
        </button>
      </div>
    </aside>

    <main class="flex-1 overflow-auto bg-slate-50">
      <slot></slot>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { 
  Users,
  Activity, LogOut, Menu, ChevronLeft 
} from 'lucide-vue-next'

// --- LÃGICA DE COLAPSO ---
const isCollapsed = ref(false)
function toggleSidebar() {
  isCollapsed.value = !isCollapsed.value
}

// --- LÃGICA DE NEGOCIO ---
const router = useRouter()
const props = defineProps<{
  activeView: string
}>()

const emit = defineEmits<{
  changeView: [view: string]
}>()

const navItems = [
  { view: 'pacientes', label: 'Pacientes', icon: Users },
  { view: 'vitales', label: 'Signos Vitales', icon: Activity },
]

function handleNavClick(view: string) {
  emit('changeView', view)
}

function logout() {
  sessionStorage.removeItem('usuarioLogueado')
  sessionStorage.removeItem('empleadoLogueado')
  router.push('/')
}
</script>

