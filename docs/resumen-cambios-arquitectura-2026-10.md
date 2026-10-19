# Resumen de cambios de arquitectura – 2026-10

## Objetivo

Dejar el proyecto con una base modular y compatible para que pueda crecer hacia más áreas clínicas y tipos de documentos sin romper la app actual ni exigir un rediseño de base de datos inmediato.

## Qué se cambió

### 1) Backend: separación de capas
Se reorganizó la parte de persistencia y lógica de negocio para evitar que cada archivo repita la misma conexión y la misma lógica de consulta.

Cambios relevantes:
- `backend/dbHelper.js` sigue centralizando la conexión y la ejecución de SQL.
- `backend/utils.js` mantiene utilidades compartidas.
- `backend/soapieHelper.js` encapsula la construcción del payload SOAPIE.
- Se creó una estructura modular bajo `backend/src/modules`.

### 2) Compatibilidad con el código legado
Se mantuvieron los archivos originales del proyecto como wrappers de compatibilidad, de modo que el resto del sistema no se rompe mientras se migra a la nueva estructura.

Ejemplos:
- `backend/notas.js`
- `backend/pacientes.js`
- `backend/diagnosticos.js`
- `backend/medicos.js`
- `backend/pacienteSinCama.js`

Esto permite migrar módulo por módulo sin detener el desarrollo ni romper rutas existentes.

### 3) Módulos migrados a estructura modular
Se dejó la base de módulos con separación por capa:
- módulo de notas
- módulo de pacientes
- módulo de diagnósticos
- módulo de médicos
- módulo de pacientes sin cama

Cada módulo quedó con una estructura típica de:
- `index.js` para exportación central
- `services/` para lógica de negocio
- `repositories/` para acceso a SQL

### 4) Frontend: reducción de lógica en la vista principal
Se extrajo parte de la lógica del dashboard hacia un composable dedicado.

Archivo principal:
- `frontend/src/composables/useDashboard.ts`

Esto permite que `Dashboard.vue` se mantenga más claro y separe mejor:
- navegación
- estado visual
- cálculos de título y modal
- manejo de confirmación de acciones

### 5) Preparación de una estructura modular para el frontend
Se dejó el directorio base para continuar con la organización por dominio clínico:
- `frontend/src/modules/README.md`

La idea es crecer hacia áreas como:
- pacientes
- notas
- vitales
- kardex
- balance
- documentos

## Por qué se hizo así

La base de datos actual sigue siendo una base funcional de prueba y no está diseñada como modelo definitivo del sistema clínico. Por eso, en vez de hacer un rediseño completo de esquema, se aplicó una estrategia segura:

- no romper la app actual
- centralizar acceso a datos
- separar dominio de infraestructura
- preparar el proyecto para más módulos clínicos
- dejar base para documentos tipo SOAPIE, Kardex, balance hídrico, NANDA/NOC/NIC y otros

## Cómo seguir desde aquí

### Siguiente paso recomendado
1. Migrar el resto de módulos y servicios del backend a la misma estructura por dominio.
2. Consolidar los módulos del frontend por área clínica y no por vista única.
3. Definir el modelo de datos clínico real para cada documento.
4. Definir reglas de validación por módulo.
5. Añadir pruebas mínimas para servicios y repositorios.

### Regla de diseño sugerida
Cada nuevo módulo debería seguir esta capa lógica:
- rutas o comunicación con la UI
- servicio de negocio
- repositorio de acceso a datos
- tipos o modelos del dominio
- validación y errores consistentes

## Validación realizada

Se comprobó que los módulos migrados cargan correctamente con Node y que el frontend compila sin errores.

Comandos verificados:

```bash
node -e "require('./backend/notas'); require('./backend/src/modules/notas'); console.log('notas module migration OK');"
node -e "require('./backend/pacientes'); require('./backend/src/modules/pacientes'); console.log('pacientes module migration OK');"
node -e "require('./backend/pacienteSinCama'); require('./backend/src/modules/pacientes-sin-cama'); console.log('pacienteSinCama module migration OK');"
node -e "require('./backend/diagnosticos'); require('./backend/medicos'); require('./backend/src/modules/diagnosticos'); require('./backend/src/modules/medicos'); console.log('diagnosticos and medicos modules migration OK');"
```

Y para el frontend:

```bash
cd frontend
npm run build
```

Resultado verificado:
- todas las cargas de módulos devolvieron éxito
- la build de Vite terminó correctamente

## Estado actual

La base arquitectónica del proyecto ya quedó más estable, compatible y preparada para avanzar con más áreas clínicas sin bloquear el desarrollo ni desordenar el trabajo del equipo.
