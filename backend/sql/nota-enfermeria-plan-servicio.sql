-- Propósito: Implementación del archivo nota-enfermeria-plan-servicio.sql.
-- Convención: las instrucciones principales se agrupan por etapas.

SET XACT_ABORT ON;

BEGIN TRY
    BEGIN TRANSACTION;

    IF OBJECT_ID(N'dbo.NotaEnfermeriaPlanServicio', N'U') IS NULL
    BEGIN
        CREATE TABLE dbo.NotaEnfermeriaPlanServicio (
            IdNotaEnfermeria INT NOT NULL,
            IdProducto INT NOT NULL,
            CodigoServicio VARCHAR(20) NOT NULL,
            NombreServicio VARCHAR(255) NOT NULL,
            IdOrden INT NULL,
            Cantidad INT NOT NULL
                CONSTRAINT DF_NotaEnfermeriaPlanServicio_Cantidad DEFAULT (1),
            IdAtencionDiagnostico INT NULL,
            CodigoCIE10 VARCHAR(10) NULL,
            CONSTRAINT PK_NotaEnfermeriaPlanServicio
                PRIMARY KEY (IdNotaEnfermeria, IdProducto),
            CONSTRAINT FK_NotaEnfermeriaPlanServicio_Nota
                FOREIGN KEY (IdNotaEnfermeria)
                REFERENCES dbo.NotaEnfermeria (IdNotaEnfermeria),
            CONSTRAINT FK_NotaEnfermeriaPlanServicio_Catalogo
                FOREIGN KEY (IdProducto)
                REFERENCES dbo.FactCatalogoServicios (IdProducto)
        );
    END;
    ELSE
    BEGIN
        IF COL_LENGTH(N'dbo.NotaEnfermeriaPlanServicio', N'IdOrden') IS NULL
            ALTER TABLE dbo.NotaEnfermeriaPlanServicio ADD IdOrden INT NULL;

        IF COL_LENGTH(N'dbo.NotaEnfermeriaPlanServicio', N'Cantidad') IS NULL
            ALTER TABLE dbo.NotaEnfermeriaPlanServicio
            ADD Cantidad INT NOT NULL
                CONSTRAINT DF_NotaEnfermeriaPlanServicio_Cantidad DEFAULT (1);

        IF COL_LENGTH(N'dbo.NotaEnfermeriaPlanServicio', N'IdAtencionDiagnostico') IS NULL
            ALTER TABLE dbo.NotaEnfermeriaPlanServicio ADD IdAtencionDiagnostico INT NULL;

        IF COL_LENGTH(N'dbo.NotaEnfermeriaPlanServicio', N'CodigoCIE10') IS NULL
            ALTER TABLE dbo.NotaEnfermeriaPlanServicio ADD CodigoCIE10 VARCHAR(10) NULL;
    END;

    COMMIT TRANSACTION;
END TRY
BEGIN CATCH
    IF @@TRANCOUNT > 0
        ROLLBACK TRANSACTION;
    THROW;
END CATCH;
