SET XACT_ABORT ON;

BEGIN TRY
    BEGIN TRANSACTION;

    IF OBJECT_ID(N'dbo.NotaEnfermeriaPlanNOC', N'U') IS NULL
    BEGIN
        CREATE TABLE dbo.NotaEnfermeriaPlanNOC (
            IdNotaEnfermeria INT NOT NULL,
            IdNANDA INT NOT NULL,
            IdNOC INT NOT NULL,
            Meta NVARCHAR(250) NULL,
            ResultadoObservado NVARCHAR(500) NULL,
            CONSTRAINT PK_NotaEnfermeriaPlanNOC
                PRIMARY KEY (IdNotaEnfermeria, IdNANDA, IdNOC),
            CONSTRAINT FK_NotaEnfermeriaPlanNOC_Diagnostico
                FOREIGN KEY (IdNotaEnfermeria, IdNANDA)
                REFERENCES dbo.NotaEnfermeriaDiagnostico (IdNotaEnfermeria, IdNANDA),
            CONSTRAINT FK_NotaEnfermeriaPlanNOC_Catalogo
                FOREIGN KEY (IdNOC)
                REFERENCES dbo.Catalogo_NOC (IdNOC)
        );
    END;

    IF OBJECT_ID(N'dbo.NotaEnfermeriaPlanNIC', N'U') IS NULL
    BEGIN
        CREATE TABLE dbo.NotaEnfermeriaPlanNIC (
            IdNotaEnfermeria INT NOT NULL,
            IdNANDA INT NOT NULL,
            IdNIC INT NOT NULL,
            Realizada BIT NOT NULL
                CONSTRAINT DF_NotaEnfermeriaPlanNIC_Realizada DEFAULT (0),
            CONSTRAINT PK_NotaEnfermeriaPlanNIC
                PRIMARY KEY (IdNotaEnfermeria, IdNANDA, IdNIC),
            CONSTRAINT FK_NotaEnfermeriaPlanNIC_Diagnostico
                FOREIGN KEY (IdNotaEnfermeria, IdNANDA)
                REFERENCES dbo.NotaEnfermeriaDiagnostico (IdNotaEnfermeria, IdNANDA),
            CONSTRAINT FK_NotaEnfermeriaPlanNIC_Catalogo
                FOREIGN KEY (IdNIC)
                REFERENCES dbo.Catalogo_NIC (IdNIC)
        );
    END;

    IF OBJECT_ID(N'dbo.NotaEnfermeriaDiagnostico', N'U') IS NOT NULL
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
