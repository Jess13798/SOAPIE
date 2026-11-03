SET XACT_ABORT ON;

BEGIN TRY
    BEGIN TRANSACTION;

    IF OBJECT_ID(N'dbo.NotaEnfermeriaDiagnostico', N'U') IS NULL
    BEGIN
        CREATE TABLE dbo.NotaEnfermeriaDiagnostico (
            IdNotaEnfermeria INT NOT NULL,
            IdNANDA INT NOT NULL,
            Comentario NVARCHAR(1000) NULL,
            CONSTRAINT PK_NotaEnfermeriaDiagnostico
                PRIMARY KEY (IdNotaEnfermeria, IdNANDA),
            CONSTRAINT FK_NotaEnfermeriaDiagnostico_Nota
                FOREIGN KEY (IdNotaEnfermeria)
                REFERENCES dbo.NotaEnfermeria (IdNotaEnfermeria),
            CONSTRAINT FK_NotaEnfermeriaDiagnostico_NANDA
                FOREIGN KEY (IdNANDA)
                REFERENCES dbo.Catalogo_NANDA (IdNANDA)
        );
    END;

    IF EXISTS (
        SELECT 1
        FROM sys.columns
        WHERE object_id = OBJECT_ID(N'dbo.NotaEnfermeriaDiagnostico')
          AND name = N'Comentario'
          AND is_nullable = 0
    )
    BEGIN
        ALTER TABLE dbo.NotaEnfermeriaDiagnostico
            ALTER COLUMN Comentario NVARCHAR(1000) NULL;
    END;

    COMMIT TRANSACTION;
END TRY
BEGIN CATCH
    IF @@TRANCOUNT > 0
        ROLLBACK TRANSACTION;
    THROW;
END CATCH;
