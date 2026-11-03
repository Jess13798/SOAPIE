-- MIGRACIÓN MANUAL / DE UN SOLO USO (NO la ejecuta el arranque automático).
--
-- Solo sirve para bases que todavía tienen la tabla antigua
-- `dbo.NotaEnfermeriaPlanCuidado` con el plan sin normalizar. Copia sus
-- selecciones a `NotaEnfermeriaDiagnostico` / `NotaEnfermeriaPlanNOC` /
-- `NotaEnfermeriaPlanNIC` y luego renombra la tabla vieja a
-- `NotaEnfermeriaPlanCuidadoLegacy`.
--
-- Vive FUERA de `backend/sql/` a propósito: aquella carpeta se ejecuta
-- automáticamente al arrancar y este script referencia una tabla que puede no
-- existir, lo que haría fallar la compilación del lote en SQL Server
-- (`Invalid object name 'dbo.NotaEnfermeriaPlanCuidado'`). Para aplicarlo:
--
--     sqlcmd -S 192.168.80.11 -U <usuario> -P <clave> -d sigh ^
--         -i backend/sql-manual/nota-enfermeria-plan-cuidado-legacy.sql
--
-- Si la base ya no tiene `NotaEnfermeriaPlanCuidado`, el script no hace nada.

SET XACT_ABORT ON;

BEGIN TRY
    BEGIN TRANSACTION;

    IF OBJECT_ID(N'dbo.NotaEnfermeriaPlanCuidado', N'U') IS NOT NULL
       AND OBJECT_ID(N'dbo.NotaEnfermeriaDiagnostico', N'U') IS NOT NULL
    BEGIN
        INSERT INTO dbo.NotaEnfermeriaDiagnostico (
            IdNotaEnfermeria, IdNANDA, Comentario
        )
        SELECT DISTINCT legado.IdNotaEnfermeria, legado.IdNANDA, NULL
        FROM dbo.NotaEnfermeriaPlanCuidado AS legado
        WHERE NOT EXISTS (
            SELECT 1
            FROM dbo.NotaEnfermeriaDiagnostico AS diagnostico
            WHERE diagnostico.IdNotaEnfermeria = legado.IdNotaEnfermeria
              AND diagnostico.IdNANDA = legado.IdNANDA
        );

        INSERT INTO dbo.NotaEnfermeriaPlanNOC (
            IdNotaEnfermeria, IdNANDA, IdNOC
        )
        SELECT DISTINCT legado.IdNotaEnfermeria, legado.IdNANDA, legado.IdNOC
        FROM dbo.NotaEnfermeriaPlanCuidado AS legado
        WHERE legado.IdNOC IS NOT NULL
          AND NOT EXISTS (
              SELECT 1
              FROM dbo.NotaEnfermeriaPlanNOC AS noc
              WHERE noc.IdNotaEnfermeria = legado.IdNotaEnfermeria
                AND noc.IdNANDA = legado.IdNANDA
                AND noc.IdNOC = legado.IdNOC
          );

        INSERT INTO dbo.NotaEnfermeriaPlanNIC (
            IdNotaEnfermeria, IdNANDA, IdNIC
        )
        SELECT DISTINCT legado.IdNotaEnfermeria, legado.IdNANDA, legado.IdNIC
        FROM dbo.NotaEnfermeriaPlanCuidado AS legado
        WHERE legado.IdNIC IS NOT NULL
          AND NOT EXISTS (
              SELECT 1
              FROM dbo.NotaEnfermeriaPlanNIC AS nic
              WHERE nic.IdNotaEnfermeria = legado.IdNotaEnfermeria
                AND nic.IdNANDA = legado.IdNANDA
                AND nic.IdNIC = legado.IdNIC
          );

        UPDATE planNIC
        SET Realizada = CASE
            WHEN nota.Intervencion LIKE N'%NIC ' + catalogo.Codigo + N':%' THEN 1
            ELSE 0
        END
        FROM dbo.NotaEnfermeriaPlanNIC AS planNIC
        INNER JOIN dbo.NotaEnfermeriaPlanCuidado AS legado
            ON legado.IdNotaEnfermeria = planNIC.IdNotaEnfermeria
           AND legado.IdNANDA = planNIC.IdNANDA
           AND legado.IdNIC = planNIC.IdNIC
        INNER JOIN dbo.NotaEnfermeria AS nota
            ON nota.IdNotaEnfermeria = planNIC.IdNotaEnfermeria
        INNER JOIN dbo.Catalogo_NIC AS catalogo
            ON catalogo.IdNIC = planNIC.IdNIC;

        IF OBJECT_ID(N'dbo.NotaEnfermeriaPlanCuidadoLegacy', N'U') IS NULL
        BEGIN
            EXEC sys.sp_rename
                N'dbo.NotaEnfermeriaPlanCuidado',
                N'NotaEnfermeriaPlanCuidadoLegacy';
        END;
    END;

    COMMIT TRANSACTION;
END TRY
BEGIN CATCH
    IF @@TRANCOUNT > 0
        ROLLBACK TRANSACTION;
    THROW;
END CATCH;
