-- Propósito: Implementación del archivo 002-ajustes-notas-enfermeria.sql.
-- Convención: las instrucciones principales se agrupan por etapas.

SET XACT_ABORT ON;

BEGIN TRY
    BEGIN TRANSACTION;

    IF COL_LENGTH(N'dbo.NotaEnfermeria', N'WongBakerScore') IS NULL
    BEGIN
        ALTER TABLE dbo.NotaEnfermeria
            ADD WongBakerScore TINYINT NULL;
    END;

    IF NOT EXISTS (
        SELECT 1
        FROM sys.check_constraints
        WHERE name = N'CK_NotaEnfermeria_WongBakerScore'
          AND parent_object_id = OBJECT_ID(N'dbo.NotaEnfermeria')
    )
    BEGIN
        ALTER TABLE dbo.NotaEnfermeria
            ADD CONSTRAINT CK_NotaEnfermeria_WongBakerScore
            CHECK (WongBakerScore IS NULL OR WongBakerScore IN (0, 2, 4, 6, 8, 10));
    END;

    IF NOT EXISTS (
        SELECT 1
        FROM sys.indexes
        WHERE name = N'IX_NotaEnfermeriaSignosVitales_Nota_Fecha'
          AND object_id = OBJECT_ID(N'dbo.NotaEnfermeriaSignosVitales')
    )
    BEGIN
        CREATE INDEX IX_NotaEnfermeriaSignosVitales_Nota_Fecha
            ON dbo.NotaEnfermeriaSignosVitales
                (IdNotaEnfermeria, Fecha_Hora DESC, IdSignoVital DESC);
    END;

    IF NOT EXISTS (
        SELECT 1
        FROM sys.indexes
        WHERE name = N'IX_NotaEnfermeriaSignosVitales_Cuenta_Fecha'
          AND object_id = OBJECT_ID(N'dbo.NotaEnfermeriaSignosVitales')
    )
    BEGIN
        CREATE INDEX IX_NotaEnfermeriaSignosVitales_Cuenta_Fecha
            ON dbo.NotaEnfermeriaSignosVitales
                (IdCuentaatencion, Fecha_Hora DESC, IdSignoVital DESC);
    END;

    COMMIT TRANSACTION;
END TRY
BEGIN CATCH
    IF @@TRANCOUNT > 0
        ROLLBACK TRANSACTION;
    THROW;
END CATCH;
