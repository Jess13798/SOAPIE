-- ============================================================
-- Migración: tablas del módulo de Notas de Enfermería
-- Archivo: 001-crear-tablas-notas.sql
-- Base: sigh (SQL Server)
--
-- Es idempotente: no falla si las tablas o columnas ya existen.
-- ============================================================

SET XACT_ABORT ON;
GO

BEGIN TRY
    BEGIN TRANSACTION;

    IF OBJECT_ID(N'dbo.NotaEnfermeria', N'U') IS NULL
    BEGIN
        CREATE TABLE dbo.NotaEnfermeria (
            IdNotaEnfermeria INT IDENTITY(1,1) NOT NULL,
            IdCuenta INT NULL,
            IdPaciente INT NOT NULL,
            IdEmpleado INT NULL,
            Turno VARCHAR(10) NOT NULL,
            Fecha_Hora_Inicio DATETIME NOT NULL,
            Fecha_Hora_Fin DATETIME NULL,
            Subjetivo NVARCHAR(MAX) NOT NULL,
            Objetivo NVARCHAR(MAX) NOT NULL,
            Analisis NVARCHAR(MAX) NOT NULL,
            Plan_ NVARCHAR(MAX) NOT NULL,
            WongBakerScore TINYINT NULL,
            Intervencion NVARCHAR(MAX) NOT NULL,
            Evaluacion NVARCHAR(MAX) NOT NULL,
            CONSTRAINT PK_NotaEnfermeria
                PRIMARY KEY (IdNotaEnfermeria),
            CONSTRAINT CK_NotaEnfermeria_WongBakerScore
                CHECK (WongBakerScore IS NULL OR WongBakerScore IN (0, 2, 4, 6, 8, 10))
        );
    END;

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
        EXEC(N'ALTER TABLE dbo.NotaEnfermeria
            ADD CONSTRAINT CK_NotaEnfermeria_WongBakerScore
            CHECK (WongBakerScore IS NULL OR WongBakerScore IN (0, 2, 4, 6, 8, 10));');
    END;

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

    IF OBJECT_ID(N'dbo.NotaEnfermeriaSignosVitales', N'U') IS NULL
    BEGIN
        CREATE TABLE dbo.NotaEnfermeriaSignosVitales (
            IdSignoVital INT IDENTITY(1,1) NOT NULL,
            IdNotaEnfermeria INT NOT NULL,
            IdPaciente INT NOT NULL,
            IdCuentaatencion INT NULL,
            Fecha_Hora DATETIME NOT NULL,
            IdEmpleado INT NULL,
            Peso DECIMAL(5,2) NULL,
            Talla DECIMAL(5,2) NULL,
            P_Cefalico DECIMAL(5,2) NULL,
            P_Abdominal DECIMAL(5,2) NULL,
            Hemoglucotest DECIMAL(5,2) NULL,
            Presion_Arterial VARCHAR(10) NULL,
            Frec_Cardiaca INT NULL,
            Frec_Respiratoria INT NULL,
            Temperatura DECIMAL(4,2) NULL,
            Saturacion INT NULL,
            CONSTRAINT PK_NotaEnfermeriaSignosVitales
                PRIMARY KEY (IdSignoVital),
            CONSTRAINT FK_NotaEnfermeriaSignosVitales_Nota
                FOREIGN KEY (IdNotaEnfermeria)
                REFERENCES dbo.NotaEnfermeria (IdNotaEnfermeria)
        );
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
GO
