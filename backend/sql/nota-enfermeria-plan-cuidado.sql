IF OBJECT_ID(N'dbo.NotaEnfermeriaPlanCuidado', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.NotaEnfermeriaPlanCuidado (
        IdNotaEnfermeriaPlanCuidado INT IDENTITY(1,1) NOT NULL,
        IdNotaEnfermeria INT NOT NULL,
        IdNANDA INT NOT NULL,
        IdNOC INT NULL,
        IdNIC INT NULL,
        CONSTRAINT PK_NotaEnfermeriaPlanCuidado
            PRIMARY KEY (IdNotaEnfermeriaPlanCuidado),
        CONSTRAINT FK_NotaEnfermeriaPlanCuidado_Nota
            FOREIGN KEY (IdNotaEnfermeria)
            REFERENCES dbo.NotaEnfermeria (IdNotaEnfermeria),
        CONSTRAINT FK_NotaEnfermeriaPlanCuidado_NANDA
            FOREIGN KEY (IdNANDA)
            REFERENCES dbo.Catalogo_NANDA (IdNANDA),
        CONSTRAINT FK_NotaEnfermeriaPlanCuidado_NOC
            FOREIGN KEY (IdNOC)
            REFERENCES dbo.Catalogo_NOC (IdNOC),
        CONSTRAINT FK_NotaEnfermeriaPlanCuidado_NIC
            FOREIGN KEY (IdNIC)
            REFERENCES dbo.Catalogo_NIC (IdNIC),
        CONSTRAINT CK_NotaEnfermeriaPlanCuidado_UnTipoSeleccion
            CHECK (IdNOC IS NULL OR IdNIC IS NULL)
    );

    CREATE UNIQUE INDEX UX_NotaEnfermeriaPlanCuidado_NANDA
        ON dbo.NotaEnfermeriaPlanCuidado (IdNotaEnfermeria, IdNANDA)
        WHERE IdNOC IS NULL AND IdNIC IS NULL;

    CREATE UNIQUE INDEX UX_NotaEnfermeriaPlanCuidado_NOC
        ON dbo.NotaEnfermeriaPlanCuidado (IdNotaEnfermeria, IdNANDA, IdNOC)
        WHERE IdNOC IS NOT NULL AND IdNIC IS NULL;

    CREATE UNIQUE INDEX UX_NotaEnfermeriaPlanCuidado_NIC
        ON dbo.NotaEnfermeriaPlanCuidado (IdNotaEnfermeria, IdNANDA, IdNIC)
        WHERE IdNIC IS NOT NULL AND IdNOC IS NULL;
END;
