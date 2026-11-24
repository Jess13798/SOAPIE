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
    ELSE IF COL_LENGTH(N'dbo.NotaEnfermeriaPlanServicio', N'IdOrden') IS NULL
    BEGIN
        ALTER TABLE dbo.NotaEnfermeriaPlanServicio
        ADD IdOrden INT NULL;
    END;

    COMMIT TRANSACTION;
END TRY
BEGIN CATCH
    IF @@TRANCOUNT > 0
        ROLLBACK TRANSACTION;
    THROW;
END CATCH;
