-- Migración: procedimiento almacenado para guardar Balance Hídrico con IdNota.
-- Se aplica automáticamente al arrancar (migraciones.js).
-- Soporta actualización si ya existe un registro con el mismo concepto/turno
-- para evitar duplicados.

IF OBJECT_ID(N'dbo.usp_GuardarBalanceHidrico', N'P') IS NOT NULL
    DROP PROCEDURE dbo.usp_GuardarBalanceHidrico;
GO

CREATE PROCEDURE dbo.usp_GuardarBalanceHidrico
    @IdNota INT = NULL,
    @IdPaciente INT = NULL,
    @IdCuenta INT = NULL,
    @IdServicio INT = NULL,
    @Fecha DATE = NULL,
    @Turno VARCHAR(10) = NULL,
    @Tipo VARCHAR(10) = NULL,
    @Concepto VARCHAR(50) = NULL,
    @Cantidad DECIMAL(8,2) = NULL,
    @IdEmpleado INT = NULL
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;

    IF @Fecha IS NULL
        THROW 51000, 'La fecha es obligatoria.', 1;
    IF @Turno IS NULL OR @Turno NOT IN ('M', 'T', 'N')
        THROW 51001, 'El turno debe ser M, T o N.', 1;
    IF @Tipo IS NULL OR @Tipo NOT IN ('ingreso', 'egreso')
        THROW 51002, 'El tipo debe ser ingreso o egreso.', 1;
    IF @Concepto IS NULL OR LTRIM(RTRIM(@Concepto)) = ''
        THROW 51003, 'El concepto es obligatorio.', 1;
    IF @Cantidad IS NULL OR @Cantidad < 0
        THROW 51004, 'La cantidad debe ser mayor o igual a 0.', 1;

    IF @IdNota IS NOT NULL
    BEGIN
        IF NOT EXISTS (
            SELECT 1
            FROM dbo.NotaEnfermeria
            WHERE IdNotaEnfermeria = @IdNota
        )
            THROW 51005, 'La nota de enfermería no existe.', 1;

        SELECT
            @IdPaciente = n.IdPaciente,
            @IdCuenta = COALESCE(n.IdCuenta, @IdCuenta),
            @IdServicio = COALESCE(n.IdServicio, @IdServicio)
        FROM dbo.NotaEnfermeria n
        WHERE n.IdNotaEnfermeria = @IdNota;
    END

    IF @IdPaciente IS NULL
        THROW 51006, 'El paciente es obligatorio.', 1;

    DECLARE @IdExistente INT = NULL;

    SELECT TOP (1) @IdExistente = IdBalance
    FROM dbo.BalanceHidrico
    WHERE IdPaciente = @IdPaciente
      AND ISNULL(IdCuenta, 0) = ISNULL(@IdCuenta, 0)
      AND Fecha = @Fecha
      AND Turno = @Turno
      AND Tipo = @Tipo
      AND Concepto = @Concepto
      AND (
          (@IdNota IS NOT NULL AND IdNota = @IdNota)
          OR (@IdNota IS NOT NULL AND IdNota IS NULL)
          OR (@IdNota IS NULL AND IdNota IS NULL)
      )
    ORDER BY CASE WHEN IdNota IS NOT NULL THEN 1 ELSE 2 END, IdBalance DESC;

    IF @IdExistente IS NOT NULL
    BEGIN
        UPDATE dbo.BalanceHidrico
        SET Cantidad = @Cantidad,
            IdEmpleado = COALESCE(@IdEmpleado, IdEmpleado),
            IdServicio = COALESCE(@IdServicio, IdServicio),
            IdNota = COALESCE(@IdNota, IdNota),
            FechaHora = GETDATE()
        OUTPUT INSERTED.IdBalance
        WHERE IdBalance = @IdExistente;
    END
    ELSE
    BEGIN
        INSERT INTO dbo.BalanceHidrico
            (IdPaciente, IdCuenta, IdServicio, Fecha, Turno, Tipo,
             Concepto, Cantidad, IdEmpleado, FechaHora, IdNota)
        OUTPUT INSERTED.IdBalance
        VALUES
            (@IdPaciente, @IdCuenta, @IdServicio, @Fecha, @Turno, @Tipo,
             @Concepto, @Cantidad, @IdEmpleado, GETDATE(), @IdNota);
    END
END
GO
