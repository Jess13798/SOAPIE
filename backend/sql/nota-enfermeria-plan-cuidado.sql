SET XACT_ABORT ON;

BEGIN TRY
    BEGIN TRANSACTION;

    -- Tablas del plan de cuidados normalizado (NOC = resultado/meta, NIC =
    -- intervención realizada). Solo DDL: la migración de los datos de la tabla
    -- antigua `NotaEnfermeriaPlanCuidado` vive en un script aparte
    -- (`nota-enfermeria-plan-cuidado-legacy.sql`) porque solo aplica una vez,
    -- a bases que todavía tienen esa tabla.
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
            Motivo NVARCHAR(500) NULL,
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

    -- Motivo por el que una intervención planificada NO se realizó. Se guarda
    -- aparte del bit Realizada para poder explicar por qué no se cumplió el
    -- plan (queda NULL/vacío cuando la NIC sí se realizó o está sin registrar).
    IF COL_LENGTH(N'dbo.NotaEnfermeriaPlanNIC', N'Motivo') IS NULL
    BEGIN
        ALTER TABLE dbo.NotaEnfermeriaPlanNIC
            ADD Motivo NVARCHAR(500) NULL;
    END;

    COMMIT TRANSACTION;
END TRY
BEGIN CATCH
    IF @@TRANCOUNT > 0
        ROLLBACK TRANSACTION;
    THROW;
END CATCH;
