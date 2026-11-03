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
        Intervencion      NVARCHAR(MAX)  NULL,
        Evaluacion        NVARCHAR(MAX)  NULL
    );
    PRINT 'Tabla NotaEnfermeria creada.';
END
ELSE
    PRINT 'Tabla NotaEnfermeria ya existía (no se modificó).';
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
