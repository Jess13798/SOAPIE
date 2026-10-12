# Refactor de backend – etapa 1

## Objetivo

Mejorar la mantenibilidad del backend sin cambiar la estructura actual de la base de datos de prueba. La idea es encapsular el acceso a SQL Server y dejar la lógica de negocio más clara, reutilizable y menos propensa a errores.

## Qué se cambió

### 1) Centralización del acceso a la base de datos
Se creó el archivo `backend/dbHelper.js`.

Esto permite:
- reutilizar una sola conexión compartida mediante un pool
- evitar `sql.connect()` repetido en cada módulo
- centralizar la ejecución de consultas y procedimientos
- manejar la lógica de acceso a datos de forma uniforme

### 2) Utilidades compartidas
Se creó `backend/utils.js`.

Incluye funciones como:
- `nullIfEmpty`: normaliza valores vacíos a `null`
- `parseJsonSafe`: evita errores si el valor recibido no es JSON válido
- `formatDate` y `formatTime`: estandarizan el formateo de fechas y horas

Esto evita duplicar lógica pequeña en distintos archivos.

### 3) Helper específico para SOAPIE
Se creó `backend/soapieHelper.js`.

Su función es construir el payload del SOAPIE de una forma única, evitando duplicación entre:
- creación de una nota nueva
- edición de una nota existente
- firma de la nota

### 4) Refactor de módulos ya existentes
Se actualizó el acceso a base de datos en:
- `backend/pacientes.js`
- `backend/notas.js`
- `backend/diagnosticos.js`
- `backend/medicos.js`

Con esto, el código ya no repite la lógica de conexión ni la construcción de consultas de forma dispersa.

## Por qué se hizo así

La base de datos actual es una base de prueba y no está diseñada todavía como modelo final del sistema clínico. Por eso no se realizó un rediseño de esquema completo.

En cambio, se aplicó una capa de abstracción que:
- mantiene la app funcionando con la base actual
- reduce el acoplamiento con nombres de columnas concretos
- prepara el proyecto para una futura normalización del modelo
- facilita el mantenimiento sin bloquear el desarrollo

## Qué no se cambió todavía

No se realizó un cambio estructural de la base de datos ni una migración del esquema. Esto se dejó intencionalmente para una etapa posterior, cuando el modelo clínico definitivo esté más claro.

## Cómo seguir desde aquí

### Siguiente etapa recomendada
1. Revisar módulos de camas y transferencias
2. Reutilizar el helper de acceso a datos en todos los módulos restantes
3. Definir una convención para mapeo de columnas entre SQL y la capa de negocio
4. Empezar a documentar el modelo de datos clínico real
5. Preparar pruebas unitarias para los helpers y lógica de negocio

### Recomendación de diseño
La app debe seguir una lógica de capas:
- capa HTTP / rutas
- capa de negocio
- capa de acceso a datos
- capa de utilidades

Con esto, la BD pasa a ser una dependencia técnica y no el centro del diseño del sistema.

## Validación

Se verificó que los módulos refactorizados cargan correctamente con:

```bash
node -e "require('./backend/dbHelper'); require('./backend/utils'); require('./backend/soapieHelper'); require('./backend/notas'); require('./backend/pacientes'); require('./backend/diagnosticos'); require('./backend/medicos'); console.log('backend helper refactor OK');"
```

Resultado verificado:

```text
backend helper refactor OK
```

## Estado actual

La etapa de refactor del backend queda cerrada como una base sólida para continuar con la siguiente fase del proyecto, sin bloquear el avance por la base de datos actual.

## Persistencia SOAPIE pendiente

La base SIGH revisada contiene estructuras antiguas de visitas y variables de enfermería, pero no se confirmó un esquema dedicado para notas SOAPIE. El módulo frontend y las rutas existen; la persistencia no está conectada a tablas aprobadas.

Hasta que enfermería e ingeniería validen los campos, estados y firma, el repositorio de notas responde con `NOTAS_SCHEMA_NOT_CONFIGURED` y las rutas SOAPIE devuelven HTTP 503. No se deben crear ni adaptar tablas de SIGH basándose solo en el formulario provisional.

Las pruebas de esta condición se ejecutan con `npm test`. Cuando se apruebe el modelo, se debe implementar el repositorio con el esquema confirmado y agregar pruebas de lectura, creación, edición, firma y trazabilidad.
