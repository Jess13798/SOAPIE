-- Migración: registros de cuidados y administración de medicamentos del Kardex.
-- Los registros son históricos: no se exponen operaciones de edición o borrado.

IF OBJECT_ID(N'dbo.KardexEnfermeria', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.KardexEnfermeria (
        IdKardex INT IDENTITY(1,1) PRIMARY KEY,
        IdPaciente INT NOT NULL,
        IdCuenta INT NOT NULL,
        IdServicio INT NULL,
        Fecha DATE NOT NULL,
        Turno VARCHAR(1) NOT NULL,
        Categoria VARCHAR(12) NOT NULL,
        Detalle NVARCHAR(2000) NULL,
        Medicamento NVARCHAR(200) NULL,
        Dosis NVARCHAR(100) NULL,
        Via NVARCHAR(100) NULL,
        Frecuencia NVARCHAR(100) NULL,
        HoraProgramada TIME(0) NULL,
        Estado VARCHAR(20) NULL,
        Observacion NVARCHAR(1000) NULL,
        IdEmpleado INT NULL,
        Responsable NVARCHAR(120) NOT NULL,
        FechaHora DATETIME2 NOT NULL
            CONSTRAINT DF_KardexEnfermeria_FechaHora DEFAULT SYSDATETIME(),
        CONSTRAINT CK_KardexEnfermeria_Turno
            CHECK (Turno IN ('M', 'T', 'N')),
        CONSTRAINT CK_KardexEnfermeria_Categoria
            CHECK (Categoria IN ('CUIDADO', 'MEDICAMENTO')),
        CONSTRAINT CK_KardexEnfermeria_DatosCategoria
            CHECK (
                (Categoria = 'CUIDADO' AND Detalle IS NOT NULL AND Medicamento IS NULL)
                OR
                (Categoria = 'MEDICAMENTO' AND Detalle IS NULL
                    AND Medicamento IS NOT NULL AND Dosis IS NOT NULL
                    AND Via IS NOT NULL AND Frecuencia IS NOT NULL
                    AND HoraProgramada IS NOT NULL
                    AND Estado IN ('PENDIENTE', 'ADMINISTRADO', 'NO_ADMINISTRADO'))
            ),
        CONSTRAINT CK_KardexEnfermeria_MotivoNoAdministrado
            CHECK (Estado <> 'NO_ADMINISTRADO' OR NULLIF(LTRIM(RTRIM(Observacion)), '') IS NOT NULL)
    );

    CREATE INDEX IX_KardexEnfermeria_Cuenta_Fecha
        ON dbo.KardexEnfermeria (IdCuenta, Fecha, FechaHora);
END
GO
