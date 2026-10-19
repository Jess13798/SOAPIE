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
2. `nota-enfermeria-core.sql`: crea las notas de enfermería y sus signos vitales.
3. `nota-enfermeria-diagnostico-comentario.sql`: crea los diagnósticos asociados a una nota.
4. `nota-enfermeria-plan-cuidado.sql`: crea las tablas normalizadas de NOC y NIC, y copia a ellas las selecciones existentes del plan anterior.

El flujo nuevo usa `NotaEnfermeriaDiagnostico` como relación entre una nota y sus diagnósticos, `NotaEnfermeriaPlanNOC` para resultado, meta y evaluación, y `NotaEnfermeriaPlanNIC` para intervención y si fue realizada. Al migrar una base existente, la tabla anterior se renombra a `NotaEnfermeriaPlanCuidadoLegacy` después de copiar sus selecciones; así queda preservada, pero no se vuelve a importar en ejecuciones futuras. Las metas y evaluaciones históricas permanecen en los campos de texto SOAPIE y se pueden seguir consultando allí.

El ejecutor no elimina tablas ni datos. Sin embargo, sí crea estructura e inserta los datos de demostración definidos por los scripts, así que verifica el nombre de la base antes de confirmar. La tarea programada del entorno puede borrar estos cambios al final del día; en ese caso, vuelve a ejecutar el procedimiento.
