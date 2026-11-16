-- ============================================================
-- Migración: tablas del módulo de Notas de Enfermería
-- Fecha: 2026-10-09
-- Base: sigh (SQL Server)
--
-- Reconstruidas a partir del código de la aplicación:
--   - backend/src/modules/notas/repositories/notasRepository.js
--   - backend/out2.json (esquema histórico de NotaEnfermeriaSignosVitales)
--
-- Es idempotente: no falla si las tablas ya existen.
-- ============================================================

IF OBJECT_ID('dbo.NotaEnfermeria', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.NotaEnfermeria (
        IdNotaEnfermeria INT IDENTITY(1,1) NOT NULL
            CONSTRAINT PK_NotaEnfermeria PRIMARY KEY,
        IdCuenta          INT            NULL,
        IdPaciente        INT            NULL,
        IdEmpleado        INT            NULL,
        Turno             VARCHAR(10)    NULL,
        Fecha_Hora_Inicio DATETIME       NULL,
        Fecha_Hora_Fin    DATETIME       NULL,
        Subjetivo         NVARCHAR(MAX)  NULL,
        Objetivo          NVARCHAR(MAX)  NULL,
        Analisis          NVARCHAR(MAX)  NULL,
        Plan_             NVARCHAR(MAX)  NULL,
        WongBakerScore    TINYINT        NULL,
        -------------------------------------

        Intervencion      NVARCHAR(MAX)  NULL,
        Evaluacion        NVARCHAR(MAX)  NULL,
        CONSTRAINT CK_NotaEnfermeria_WongBakerScore
            CHECK (WongBakerScore IS NULL OR WongBakerScore IN (0, 2, 4, 6, 8, 10))
    );
    PRINT 'Tabla NotaEnfermeria creada.';
END
ELSE
    PRINT 'Tabla NotaEnfermeria ya existía (no se modificó).';

IF COL_LENGTH('dbo.NotaEnfermeria', 'WongBakerScore') IS NULL
BEGIN
    ALTER TABLE dbo.NotaEnfermeria
        ADD WongBakerScore TINYINT NULL;
END;

IF NOT EXISTS (
    SELECT 1
    FROM sys.check_constraints
    WHERE name = 'CK_NotaEnfermeria_WongBakerScore'
      AND parent_object_id = OBJECT_ID('dbo.NotaEnfermeria')
)
BEGIN
    ALTER TABLE dbo.NotaEnfermeria
        ADD CONSTRAINT CK_NotaEnfermeria_WongBakerScore
        CHECK (WongBakerScore IS NULL OR WongBakerScore IN (0, 2, 4, 6, 8, 10));
END;
GO

IF OBJECT_ID('dbo.NotaEnfermeriaPlanServicio', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.NotaEnfermeriaPlanServicio (
        IdNotaEnfermeria INT NOT NULL,
        IdProducto INT NOT NULL,
        CodigoServicio VARCHAR(20) NOT NULL,
        NombreServicio VARCHAR(255) NOT NULL,
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
GO

IF OBJECT_ID('dbo.NotaEnfermeriaSignosVitales', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.NotaEnfermeriaSignosVitales (
        IdSignoVital      INT IDENTITY(1,1) NOT NULL
            CONSTRAINT PK_NotaEnfermeriaSignosVitales PRIMARY KEY,
        IdNotaEnfermeria  INT            NULL,
        IdPaciente        INT            NULL,
        IdCuentaatencion  INT            NULL,
        Fecha_Hora        DATETIME       NULL,
        IdEmpleado        INT            NULL,
        Peso              DECIMAL(5,2)   NULL,
        Talla             DECIMAL(5,2)   NULL,
        P_Cefalico        DECIMAL(5,2)   NULL,
        P_Abdominal       DECIMAL(5,2)   NULL,
        Hemoglucotest     DECIMAL(5,2)   NULL,
        Presion_Arterial  VARCHAR(10)    NULL,
        Frec_Cardiaca     INT            NULL,
        Frec_Respiratoria INT            NULL,
        Temperatura       DECIMAL(4,2)   NULL,
        Saturacion        INT            NULL,
        CONSTRAINT FK_NotaEnfermeriaSignosVitales_Nota
            FOREIGN KEY (IdNotaEnfermeria)
            REFERENCES dbo.NotaEnfermeria (IdNotaEnfermeria)
    );
    PRINT 'Tabla NotaEnfermeriaSignosVitales creada.';
END
ELSE
    PRINT 'Tabla NotaEnfermeriaSignosVitales ya existía (no se modificó).';
GO
