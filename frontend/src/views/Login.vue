<template>
  <div class="min-h-screen w-full bg-slate-50 flex items-center justify-center p-4">
    <div class="w-full max-w-6xl bg-white rounded-3xl flex flex-col lg:flex-row shadow-2xl overflow-hidden min-h-[600px]">
      
    <div class="hidden lg:flex lg:w-1/2 bg-blue-700 relative items-start justify-center overflow-hidden">
  
  <img 
    src="/fonde_rezola.webp" 
    class="absolute inset-0 w-full h-full object-cover opacity-30 scale-110 transition-transform duration-1000 hover:scale-100"
    alt="Hospital Rezola"
  />
<div class="relative z-10 p-12 text-white h-full w-full flex flex-col justify-between pt-10">
  
  <div>
    <div class="flex items-center gap-4 mb-6">
      <div class="h-12 w-1.5 bg-blue-400 rounded-full"></div>
      <h1 class="text-5xl font-bold tracking-tight leading-tight">
        Notas de <span class="text-blue-300">Enfermeria</span><br>Hospitalaria
      </h1>
    </div>
  </div>

    <br><br><br><br><br><br><br><br><br><br><br><br><br><br>

    
    
    <div class="mt-12 text-blue-200/60 text-sm">
      <p class="text-blue-100/70 text-sm font-medium tracking-wide">
  Atencion Medica de Excelencia para Canete
</p>
      (c) {{ new Date().getFullYear() }} Hospital Rezola Canete
    </div>
  </div>
</div>

      <div class="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div class="w-full max-w-md space-y-8">
          
          <div class="flex items-center gap-4">
            <img src="/logo.webp" class="h-16 w-auto drop-shadow-sm" alt="Logo" />
            <div>
              <h2 class="text-2xl font-bold text-slate-800">Hospital Regional</h2>
              <p class="text-sm text-slate-500">Rezola - Canete</p>
            </div>
          </div>

          <div class="space-y-2">
            <h3 class="text-3xl font-extrabold text-slate-900">Bienvenido de nuevo</h3>
            <p class="text-slate-500">Inicia sesion para ingresar al sistema de enfermeria</p>
          </div>

          <form @submit.prevent="iniciarSesion" class="space-y-5">
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-1.5">Usuario</label>
              <input
                v-model="credentials.usuario"
                type="text"
                required
                class="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none text-slate-900"
                placeholder="Nombre de usuario"
              />
            </div>

         <div>
              <label class="block text-sm font-semibold text-slate-700 mb-1.5">Contrasena </label>
              <div class="relative">
                <input
                  v-model="credentials.contrasena"
                  :type="showPassword ? 'text' : 'password'"
                  required
                  class="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none text-slate-900 pr-12"
                  placeholder="Ingrese su contrasena"
                />
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors z-10"
                >
                  <EyeOff v-if="showPassword" class="h-5 w-5" />
                  <Eye v-else class="h-5 w-5" />
                </button>
              </div>
            </div>

            <button
              type="submit"
              :disabled="isLoading"
              class="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2 disabled:opacity-70"
            >
              <span>Iniciar sesion</span>
            </button>
          </form>

          <div v-if="error" class="p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl text-center font-medium animate-bounce">
            Error: {{ error }}
          </div>

          <div class="pt-6 border-t border-slate-100 text-center">
            <p class="text-xs text-slate-400">Sistema desarrollado por el Area de Informatica</p>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router"; // 1. Importamos el router
import { Eye, EyeOff } from "lucide-vue-next";

const router = useRouter(); // 2. Inicializamos la herramienta de navegación
const credentials = ref({ usuario: '', contrasena: '' });
const isLoading = ref(false);
const error = ref(null);
const showPassword = ref(false);

const iniciarSesion = async () => {
  isLoading.value = true;
  error.value = null;
  
  try {
    const response = await fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        usuario: credentials.value.usuario,
        // CAMBIO AQUÍ: Ahora enviamos 'Password' en lugar de 'dni'
        Password: credentials.value.contrasena 
      })
    });
    
    const data = await response.json();
    
    if (data.success) {
      sessionStorage.setItem('usuarioLogueado', data.usuario);
      sessionStorage.setItem('empleadoLogueado', data.empleado || '');
      if (data.idEmpleado) {
        sessionStorage.setItem('idEmpleado', String(data.idEmpleado));
      }
      router.push('/dashboard'); 
    } else {
      error.value = data.mensaje || "El sistema se esta actualizando, por favor espere unos minutos e intente nuevamente.";
    }
  } catch (e) {
    error.value = "El sistema se esta actualizando, por favor espere unos minutos e intente nuevamente.";
  } finally {
    isLoading.value = false;
  }
};

</script>


