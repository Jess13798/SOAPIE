# Scripts de base de datos

Estos scripts están pensados para la base de pruebas de SQL Server configurada en `backend/.env`. El catálogo incluye datos académicos de demostración; no es un catálogo clínico validado para decisiones de atención.

## Preparar las tablas

1. Comprueba que SQL Server esté accesible y que `backend/.env` tenga los valores correctos para `DB_SERVER`, `DB_NAME`, `DB_USER` y `DB_PASSWORD`.
2. Desde el explorador de archivos, abre `setup-database.bat` en la raíz del proyecto. También puedes abrir una terminal en la raíz y ejecutar `npm run db:setup`.
3. Lee el nombre de la base que muestra el programa. Escribe exactamente ese nombre para confirmar. Si no coincide con la base de pruebas que quieres usar, responde cualquier otra cosa o cierra la ventana.
4. Espera a que termine. El programa ejecuta los scripts en orden y luego verifica que existan las tablas esperadas.
5. Si aparece un error, corrige la conexión o el problema indicado y vuelve a ejecutar. Los scripts comprueban la existencia de las tablas y los códigos de catálogo para evitar crearlos de nuevo cuando ya existen.

El orden de ejecución respeta las claves foráneas:

1. `catalogo-nanda-noc-nic.sql`: crea los catálogos NANDA, NOC y NIC, y sus interrelaciones.
2. `001-crear-tablas-notas.sql`: crea las tablas base de notas, signos vitales y servicios planificados.
3. `002-ajustes-notas-enfermeria.sql`: agrega Wong-Baker si falta y crea índices para consultar signos vitales por nota o cuenta.
4. `nota-enfermeria-diagnostico-comentario.sql`: crea los diagnósticos asociados a una nota.
5. `nota-enfermeria-plan-cuidado.sql`: crea las tablas normalizadas de NOC y NIC (con el motivo de la NIC no realizada).
6. `nota-enfermeria-plan-servicio.sql`: agrega a los servicios planificados la cantidad y el diagnóstico CIE para bases existentes.

El flujo nuevo usa `NotaEnfermeriaDiagnostico` como relación entre una nota y sus diagnósticos, `NotaEnfermeriaPlanNOC` para resultado, meta y evaluación, y `NotaEnfermeriaPlanNIC` para intervención y si fue realizada. Las metas y evaluaciones históricas permanecen en los campos de texto SOAPIE y se pueden seguir consultando allí.

La puntuación opcional Wong-Baker se guarda como `dbo.NotaEnfermeria.WongBakerScore` (`TINYINT`, admite `NULL` o `0, 2, 4, 6, 8, 10`), separada del texto de planificación. `001-crear-tablas-notas.sql` la incluye en tablas nuevas y `002-ajustes-notas-enfermeria.sql` la agrega a tablas existentes si hace falta, junto con su restricción de validación.

La pestaña P del SOAPIE permite buscar servicios activos en `dbo.FactCatalogoServicios` (máximo 50 resultados por búsqueda) y muestra el código y la descripción. Cada CPT se asocia a un diagnóstico de la cuenta de atención (se sugiere el principal) y a una cantidad entera positiva, inicialmente 1. `dbo.NotaEnfermeriaPlanServicio` conserva estos datos junto con el `IdProducto` y el `IdOrden` de SISGalen. Al guardar cambios, la cantidad y el diagnóstico se sincronizan con `dbo.FacturacionServicioDespacho`; el precio unitario se conserva y el total se recalcula. La cantidad no se puede cambiar si la orden está pagada (estado 4). Los precios no se muestran en el selector.

`nota-enfermeria-plan-servicio.sql` agrega la relación y sus columnas como migración incremental para bases existentes; `001-crear-tablas-notas.sql` incluye la estructura completa para bases nuevas.

## Migración de datos de una base antigua (manual)

Antes de la normalización, el plan vivía en `dbo.NotaEnfermeriaPlanCuidado`. La copia de esos datos a las tablas nuevas y el renombrado de la tabla vieja a `NotaEnfermeriaPlanCuidadoLegacy` se hacen con `backend/sql-manual/nota-enfermeria-plan-cuidado-legacy.sql`, que **no** se ejecuta automáticamente.

Ese script referencia una tabla que puede no existir en la base; si se dejara en `backend/sql/`, SQL Server fallaría al compilar el lote (`Invalid object name 'dbo.NotaEnfermeriaPlanCuidado'`) y el arranque se detendría antes de crear `NotaEnfermeriaPlanNOC` y `NotaEnfermeriaPlanNIC`. Por eso vive aparte y se aplica a mano solo cuando la base todavía tiene la tabla antigua.

El ejecutor no elimina tablas ni datos. Sin embargo, sí crea estructura e inserta los datos de demostración definidos por los scripts, así que verifica el nombre de la base antes de confirmar. La tarea programada del entorno puede borrar estos cambios al final del día; en ese caso, vuelve a ejecutar el procedimiento (o simplemente reinicia el backend: las migraciones de `backend/sql/` se aplican solas al arrancar).
