-- Migración: tabla BalanceHidrico para el módulo de balance hídrico.
-- Se aplica automáticamente al arrancar (migraciones.js).

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'BalanceHidrico')
BEGIN
    CREATE TABLE dbo.BalanceHidrico (
        IdBalance INT IDENTITY(1,1) PRIMARY KEY,
        IdPaciente INT NOT NULL,
        IdCuenta INT NULL,
        IdServicio INT NULL,
        Fecha DATE NOT NULL,
        Turno VARCHAR(10) NOT NULL,
        Tipo VARCHAR(10) NOT NULL,
        Concepto VARCHAR(50) NOT NULL,
        Cantidad DECIMAL(8,2) NOT NULL,
        IdEmpleado INT NULL,
        FechaHora DATETIME NOT NULL DEFAULT GETDATE(),
        IdNota INT NULL
    );

    CREATE INDEX IX_BalanceHidrico_Cuenta_Fecha
        ON dbo.BalanceHidrico (IdCuenta, Fecha);
END
GO
