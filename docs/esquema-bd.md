# Esquema de la base de datos

> Generado automáticamente desde `192.168.80.11/sigh`
> el 9/10/2026, 11:41:24 a. m..
>
> Regenerar con: `node backend/verEsquemaBD.js`

**Totales:** 704 tablas y 13 vistas.

## Tablas que usa la aplicación

Estas son las tablas y vistas que el código del proyecto consulta directamente:

| Objeto | Tipo | Para qué se usa |
|---|---|---|
| [`Empleados`](#empleados) | tabla | Usuarios del sistema (login). La contraseña se valida con bcrypt. |
| [`Servicios`](#servicios) | tabla | Servicios/áreas del hospital. El listado se filtra con IdTipoServicio = 3 (hospitalización). |
| [`Camas`](#camas) | tabla | Camas por servicio y estado. De aquí se derivan los servicios y la ocupación. |
| [`EstadosCama`](#estadoscama) | tabla | Estados posibles de una cama (disponible, ocupada, etc.). |
| [`TiposCama`](#tiposcama) | tabla | Tipos de cama. |
| [`Pacientes`](#pacientes) | tabla | Datos personales de los pacientes. |
| [`Atenciones`](#atenciones) | tabla | Cuentas de atención (cada internamiento/consulta). |
| [`AtencionesEstanciaHospitalaria`](#atencionesestanciahospitalaria) | tabla | Estancias hospitalarias: servicio y cama por atención. Base de "Pacientes Sin Cama". |
| [`FacturacionCuentasAtencion`](#facturacioncuentasatencion) | tabla | Estado de facturación de la cuenta de atención. |
| [`Especialidades`](#especialidades) | tabla | Especialidades médicas; se relacionan con Servicios. |
| [`Medicos`](#medicos) | tabla | Médicos; se relacionan con Empleados. |
| [`MedicosEspecialidad`](#medicosespecialidad) | tabla | Relación médico ↔ especialidad/servicio. |
| [`Diagnosticos`](#diagnosticos) | tabla | Catálogo de diagnósticos. |
| [`SubclasificacionDiagnosticos`](#subclasificaciondiagnosticos) | tabla | Subclasificación de diagnósticos. |
| [`AtencionesDiagnosticos`](#atencionesdiagnosticos) | tabla | Diagnósticos asociados a una atención. |
| [`NotaEnfermeria`](#notaenfermeria) | tabla | Notas de enfermería (tabla creada por este proyecto). |
| [`NotaEnfermeriaSignosVitales`](#notaenfermeriasignosvitales) | tabla | Signos vitales por nota (tabla creada por este proyecto). |

> Nota: `PacientesSinCama` y `UltimaEstancia` **no son tablas ni vistas**, sino **CTE** (`WITH ...`) definidas dentro de las consultas de `backend/src/modules/pacientes-sin-cama/repositories/pacientesSinCamaRepository.js`.

## Índice de tablas

- [`dbo._tmp`](#_tmp) (44 columnas)
- [`dbo._verificaWeb`](#_verificaweb) (5 columnas)
- [`dbo.aa`](#aa) (26 columnas)
- [`dbo.ACCESO_MENU`](#acceso_menu) (8 columnas)
- [`dbo.ACCESO_MODULO`](#acceso_modulo) (7 columnas)
- [`dbo.ACCESO_SUBMENU`](#acceso_submenu) (9 columnas)
- [`dbo.Actividad`](#actividad) (2 columnas)
- [`dbo.actualizarCPT`](#actualizarcpt) (4 columnas)
- [`dbo.actualizarlaboratorio`](#actualizarlaboratorio) (1 columnas)
- [`dbo.actualizarLiquidacion`](#actualizarliquidacion) (1 columnas)
- [`dbo.actualizarnroreferencia`](#actualizarnroreferencia) (3 columnas)
- [`dbo.actualizarpacientes`](#actualizarpacientes) (2 columnas)
- [`dbo.Anotacion`](#anotacion) (7 columnas)
- [`dbo.AntecedentesFamiliares`](#antecedentesfamiliares) (13 columnas)
- [`dbo.AntecedentesObstetricos`](#antecedentesobstetricos) (28 columnas)
- [`dbo.AntecedentesPersonales`](#antecedentespersonales) (23 columnas)
- [`dbo.AntecedentesTratamientoBaciloscopia`](#antecedentestratamientobaciloscopia) (2 columnas)
- [`dbo.AparatoFijo`](#aparatofijo) (7 columnas)
- [`dbo.AparatoFijoDiente`](#aparatofijodiente) (5 columnas)
- [`dbo.AparatoRemovible`](#aparatoremovible) (10 columnas)
- [`dbo.ArchiveroServicio`](#archiveroservicio) (3 columnas)
- [`dbo.ArchivosCab`](#archivoscab) (10 columnas)
- [`dbo.ArchivosConfiguracion`](#archivosconfiguracion) (13 columnas)
- [`dbo.ArchivosDet`](#archivosdet) (15 columnas)
- [`dbo.ArchivosExtension`](#archivosextension) (2 columnas)
- [`dbo.ArcoOrtodoncia`](#arcoortodoncia) (8 columnas)
- [`dbo.AreaTramitaSeguros`](#areatramitaseguros) (2 columnas)
- [`dbo.Aseguradora`](#aseguradora) (10 columnas)
- [`dbo.AsignacionesCama`](#asignacionescama) (6 columnas)
- [`dbo.Atenciones`](#atenciones) (42 columnas)
- [`dbo.AtencionesCondicionMaterna`](#atencionescondicionmaterna) (12 columnas)
- [`dbo.AtencionesConvenio`](#atencionesconvenio) (7 columnas)
- [`dbo.AtencionesDatosAdicionales`](#atencionesdatosadicionales) (33 columnas)
- [`dbo.AtencionesDatosAdicionalesAlta`](#atencionesdatosadicionalesalta) (5 columnas)
- [`dbo.AtencionesDiagnosticoProcedimiento`](#atencionesdiagnosticoprocedimiento) (6 columnas)
- [`dbo.AtencionesDiagnosticos`](#atencionesdiagnosticos) (13 columnas)
- [`dbo.AtencionesDiagnosticos2`](#atencionesdiagnosticos2) (12 columnas)
- [`dbo.AtencionesDiagnosticosReferencias`](#atencionesdiagnosticosreferencias) (7 columnas)
- [`dbo.AtencionesEmergencia`](#atencionesemergencia) (27 columnas)
- [`dbo.AtencionesEmerHosp`](#atencionesemerhosp) (2 columnas)
- [`dbo.AtencionesEpisodiosCabecera`](#atencionesepisodioscabecera) (4 columnas)
- [`dbo.AtencionesEpisodiosDetalle`](#atencionesepisodiosdetalle) (3 columnas)
- [`dbo.AtencionesEstanciaHospitalaria`](#atencionesestanciahospitalaria) (19 columnas)
- [`dbo.AtencionesHijoMadre`](#atencioneshijomadre) (2 columnas)
- [`dbo.AtencionesMotivoEliminarAlta`](#atencionesmotivoeliminaralta) (4 columnas)
- [`dbo.AtencionesNacimientos`](#atencionesnacimientos) (17 columnas)
- [`dbo.AtencionesSolicitudEspecialidades`](#atencionessolicitudespecialidades) (7 columnas)
- [`dbo.AtencionesSolicitudTransfusion`](#atencionessolicitudtransfusion) (31 columnas)
- [`dbo.AtencionLLamadas`](#atencionllamadas) (7 columnas)
- [`dbo.AtenHospCenso`](#atenhospcenso) (6 columnas)
- [`dbo.AtenInteGrupo`](#atenintegrupo) (8 columnas)
- [`dbo.AtenInteGrupoHCPaciente`](#atenintegrupohcpaciente) (4 columnas)
- [`dbo.AtenInteGrupoHCRespuestaPaciente`](#atenintegrupohcrespuestapaciente) (10 columnas)
- [`dbo.AtenInteItemDesarrollo`](#ateninteitemdesarrollo) (2 columnas)
- [`dbo.AtenInteItemPlan`](#ateninteitemplan) (2 columnas)
- [`dbo.AtenInteItemPlanCrecimiento`](#ateninteitemplancrecimiento) (3 columnas)
- [`dbo.AtenInteItemPlanDesarrollo`](#ateninteitemplandesarrollo) (3 columnas)
- [`dbo.AtenInteItemPlanProcedimiento`](#ateninteitemplanprocedimiento) (6 columnas)
- [`dbo.AtenInteItemPlanSuplemento`](#ateninteitemplansuplemento) (5 columnas)
- [`dbo.AtenIntePlanAtencion`](#ateninteplanatencion) (7 columnas)
- [`dbo.AtenIntePlanCrecDetalle`](#ateninteplancrecdetalle) (3 columnas)
- [`dbo.AtenIntePlanCrecimientoPaciente`](#ateninteplancrecimientopaciente) (9 columnas)
- [`dbo.AtenIntePlanCrecPacienteDet`](#ateninteplancrecpacientedet) (5 columnas)
- [`dbo.AtenIntePlanDesarrolloPaciente`](#ateninteplandesarrollopaciente) (10 columnas)
- [`dbo.AtenIntePlanDesDetalle`](#ateninteplandesdetalle) (3 columnas)
- [`dbo.AtenIntePlanDesPacienteDet`](#ateninteplandespacientedet) (5 columnas)
- [`dbo.AtenIntePlanIntegralPaciente`](#ateninteplanintegralpaciente) (4 columnas)
- [`dbo.AtenIntePlanItemElaborado`](#ateninteplanitemelaborado) (3 columnas)
- [`dbo.AtenIntePlanProcedimientoPaciente`](#ateninteplanprocedimientopaciente) (12 columnas)
- [`dbo.AtenIntePlanSuplementoPaciente`](#ateninteplansuplementopaciente) (11 columnas)
- [`dbo.AtenIntePlantillaItemPlan`](#ateninteplantillaitemplan) (3 columnas)
- [`dbo.AtenIntePregunta`](#atenintepregunta) (4 columnas)
- [`dbo.AtenInteValorPeso`](#atenintevalorpeso) (5 columnas)
- [`dbo.AtenInteValorTalla`](#atenintevalortalla) (5 columnas)
- [`dbo.Auditoria`](#auditoria) (9 columnas)
- [`dbo.BackupClaveEmpleado`](#backupclaveempleado) (4 columnas)
- [`dbo.borrardespues`](#borrardespues) (4 columnas)
- [`dbo.CA5RGA 2`](#ca5rga 2) (19 columnas)
- [`dbo.CajaCaja`](#cajacaja) (10 columnas)
- [`dbo.CajaCajeroSupervisor`](#cajacajerosupervisor) (2 columnas)
- [`dbo.CajaComprobantesPago`](#cajacomprobantespago) (28 columnas)
- [`dbo.CajaDevoluciones`](#cajadevoluciones) (7 columnas)
- [`dbo.CajaEstadosComprobante`](#cajaestadoscomprobante) (2 columnas)
- [`dbo.CajaGestion`](#cajagestion) (8 columnas)
- [`dbo.CajaNroDocumento`](#cajanrodocumento) (7 columnas)
- [`dbo.CajasTiposOrden`](#cajastiposorden) (2 columnas)
- [`dbo.CajaTiposComprobante`](#cajatiposcomprobante) (2 columnas)
- [`dbo.CajaTiposMoneda`](#cajatiposmoneda) (2 columnas)
- [`dbo.CajaTurno`](#cajaturno) (2 columnas)
- [`dbo.CalificacionContraReferencia`](#calificacioncontrareferencia) (3 columnas)
- [`dbo.Camas`](#camas) (10 columnas)
- [`dbo.camasMovimientos`](#camasmovimientos) (5 columnas)
- [`dbo.Carga`](#carga) (19 columnas)
- [`dbo.CARGA3`](#carga3) (19 columnas)
- [`dbo.CARGA4`](#carga4) (19 columnas)
- [`dbo.CartaGarantia`](#cartagarantia) (21 columnas)
- [`dbo.CartaGarantiaDiagnostico`](#cartagarantiadiagnostico) (11 columnas)
- [`dbo.CartaGarantiaPtos`](#cartagarantiaptos) (5 columnas)
- [`dbo.Catalogo_NANDA`](#catalogo_nanda) (7 columnas)
- [`dbo.Catalogo_NIC`](#catalogo_nic) (5 columnas)
- [`dbo.Catalogo_NOC`](#catalogo_noc) (6 columnas)
- [`dbo.CatalogoEstadoDiente`](#catalogoestadodiente) (3 columnas)
- [`dbo.CategoriaEstablecimiento`](#categoriaestablecimiento) (3 columnas)
- [`dbo.CentrosCosto`](#centroscosto) (14 columnas)
- [`dbo.CentrosPoblados`](#centrospoblados) (3 columnas)
- [`dbo.CentrosSubCosto`](#centrossubcosto) (4 columnas)
- [`dbo.CentrosSubtrasCosto`](#centrossubtrascosto) (4 columnas)
- [`dbo.Citas`](#citas) (17 columnas)
- [`dbo.CitasBloqueadas`](#citasbloqueadas) (8 columnas)
- [`dbo.ClasificacionDiagnosticos`](#clasificaciondiagnosticos) (2 columnas)
- [`dbo.ClasificacionEstablecimiento`](#clasificacionestablecimiento) (3 columnas)
- [`dbo.Clavija`](#clavija) (8 columnas)
- [`dbo.CoberturaPorFuenteFinanciamiento`](#coberturaporfuentefinanciamiento) (3 columnas)
- [`dbo.ComponentesRecPostAnestesica`](#componentesrecpostanestesica) (6 columnas)
- [`dbo.ComponentesTestAldrette`](#componentestestaldrette) (6 columnas)
- [`dbo.ComponentesVentilacionMecanica`](#componentesventilacionmecanica) (6 columnas)
- [`dbo.CondicionContraReferencia`](#condicioncontrareferencia) (3 columnas)
- [`dbo.CondicionReferencia`](#condicionreferencia) (3 columnas)
- [`dbo.constancias`](#constancias) (12 columnas)
- [`dbo.ConstanciasEstado`](#constanciasestado) (2 columnas)
- [`dbo.ConstanciasTipo`](#constanciastipo) (2 columnas)
- [`dbo.Consulta`](#consulta) (7 columnas)
- [`dbo.ConsultaAfiliadoSis`](#consultaafiliadosis) (34 columnas)
- [`dbo.consultas_api`](#consultas_api) (6 columnas)
- [`dbo.ControlTratamientoBaciloscopia`](#controltratamientobaciloscopia) (2 columnas)
- [`dbo.CoronaTemporal`](#coronatemporal) (8 columnas)
- [`dbo.CoronaV`](#coronav) (9 columnas)
- [`dbo.CPT`](#cpt) (2 columnas)
- [`dbo.CptExcepcionesRecetasHIS`](#cptexcepcionesrecetashis) (1 columnas)
- [`dbo.CPTResultados`](#cptresultados) (9 columnas)
- [`dbo.CPTSis`](#cptsis) (3 columnas)
- [`dbo.CPTSis2017`](#cptsis2017) (2 columnas)
- [`dbo.CPTSOAT`](#cptsoat) (2 columnas)
- [`dbo.CQxAccionesEnfermeriaURPADet`](#cqxaccionesenfermeriaurpadet) (8 columnas)
- [`dbo.CQxAnestesiaDet`](#cqxanestesiadet) (7 columnas)
- [`dbo.CQxAnestesiaGeneralDet`](#cqxanestesiageneraldet) (7 columnas)
- [`dbo.CQxAnestesiaRegionalDet`](#cqxanestesiaregionaldet) (8 columnas)
- [`dbo.CQxAntecedenteEnfermedades`](#cqxantecedenteenfermedades) (7 columnas)
- [`dbo.CQxAntecedenteEnfermedadesDet`](#cqxantecedenteenfermedadesdet) (7 columnas)
- [`dbo.CQxAntecedenteHabitos`](#cqxantecedentehabitos) (6 columnas)
- [`dbo.CQxAntecedenteHabitosDet`](#cqxantecedentehabitosdet) (7 columnas)
- [`dbo.CQxAntecedentesDatosAdicionales`](#cqxantecedentesdatosadicionales) (9 columnas)
- [`dbo.CQxChequeoCirujanoCab`](#cqxchequeocirujanocab) (12 columnas)
- [`dbo.CQxChequeoCirujanoDet`](#cqxchequeocirujanodet) (10 columnas)
- [`dbo.CQxChequeoEnfermeriaPreOperatoriaCab`](#cqxchequeoenfermeriapreoperatoriacab) (14 columnas)
- [`dbo.CQxChequeoEnfermeriaPreOperatoriaDet`](#cqxchequeoenfermeriapreoperatoriadet) (11 columnas)
- [`dbo.CQxComponentesRecPostAnestesicaDet`](#cqxcomponentesrecpostanestesicadet) (9 columnas)
- [`dbo.CQxCondicionIngresoURPADet`](#cqxcondicioningresourpadet) (8 columnas)
- [`dbo.CQxConsentimientoInformadoCab`](#cqxconsentimientoinformadocab) (7 columnas)
- [`dbo.CQxConsentimientoInformadoDet`](#cqxconsentimientoinformadodet) (14 columnas)
- [`dbo.CQxCorrelativo`](#cqxcorrelativo) (9 columnas)
- [`dbo.CQxDiagnosticoMedico`](#cqxdiagnosticomedico) (7 columnas)
- [`dbo.CQxDiagnosticoServicio`](#cqxdiagnosticoservicio) (7 columnas)
- [`dbo.CQxEpicrisis`](#cqxepicrisis) (11 columnas)
- [`dbo.CQxEtapas`](#cqxetapas) (2 columnas)
- [`dbo.CQxEvaluacionPreAnestesicaCab`](#cqxevaluacionpreanestesicacab) (20 columnas)
- [`dbo.CQxExamenFisicoDet`](#cqxexamenfisicodet) (8 columnas)
- [`dbo.CQxIndicacionAltaCab`](#cqxindicacionaltacab) (11 columnas)
- [`dbo.CQxIndicacionAltaDet`](#cqxindicacionaltadet) (8 columnas)
- [`dbo.CQxInduccionAnestesiaDet`](#cqxinduccionanestesiadet) (7 columnas)
- [`dbo.CQxMantenimientoAnestesia`](#cqxmantenimientoanestesia) (8 columnas)
- [`dbo.CQxMonitoreoInvasivoDet`](#cqxmonitoreoinvasivodet) (8 columnas)
- [`dbo.CQxOperacionSuspendidasCab`](#cqxoperacionsuspendidascab) (14 columnas)
- [`dbo.CQxOperacionSuspendidasDet`](#cqxoperacionsuspendidasdet) (9 columnas)
- [`dbo.CQxOrdenOperatoria`](#cqxordenoperatoria) (15 columnas)
- [`dbo.CQxOrdenOperatoriaCIE`](#cqxordenoperatoriacie) (7 columnas)
- [`dbo.CQxOrdenOperatoriaCIEMQ`](#cqxordenoperatoriaciemq) (7 columnas)
- [`dbo.CQxOrdenOperatoriaCPT`](#cqxordenoperatoriacpt) (7 columnas)
- [`dbo.CQxOrdenOperatoriaCPTMQ`](#cqxordenoperatoriacptmq) (7 columnas)
- [`dbo.CQxOrdenOperatoriaCPTMQPO`](#cqxordenoperatoriacptmqpo) (7 columnas)
- [`dbo.CQxOrdenOperatoriaMQ`](#cqxordenoperatoriamq) (17 columnas)
- [`dbo.CQxPosicionAnestesiaDet`](#cqxposicionanestesiadet) (7 columnas)
- [`dbo.CQxProductoMedico`](#cqxproductomedico) (7 columnas)
- [`dbo.CQxProductoServicio`](#cqxproductoservicio) (7 columnas)
- [`dbo.CQxProgramacionFormatos`](#cqxprogramacionformatos) (6 columnas)
- [`dbo.CQxProgramacionRoles`](#cqxprogramacionroles) (9 columnas)
- [`dbo.CQxProgramacionSala`](#cqxprogramacionsala) (13 columnas)
- [`dbo.CQxRecuperacionPostAnestesicaCab`](#cqxrecuperacionpostanestesicacab) (19 columnas)
- [`dbo.CQxRegistroAnestesiologiaCab`](#cqxregistroanestesiologiacab) (14 columnas)
- [`dbo.CQxRegistroEnfermeriaURPACab`](#cqxregistroenfermeriaurpacab) (19 columnas)
- [`dbo.CQxRuta`](#cqxruta) (6 columnas)
- [`dbo.CQxRutaDet`](#cqxrutadet) (10 columnas)
- [`dbo.CQxSignosVitalesAltaRecuperacion`](#cqxsignosvitalesaltarecuperacion) (8 columnas)
- [`dbo.CQxSignosVitalesRecuperacion`](#cqxsignosvitalesrecuperacion) (8 columnas)
- [`dbo.CQxTestAldretteRecuperacionDet`](#cqxtestaldretterecuperaciondet) (9 columnas)
- [`dbo.CQxTestAldretteRecuperacionPostAnestesicaDet`](#cqxtestaldretterecuperacionpostanestesicadet) (9 columnas)
- [`dbo.CQxTipoAnestesiaDet`](#cqxtipoanestesiadet) (8 columnas)
- [`dbo.CQxTipoPrioridad`](#cqxtipoprioridad) (6 columnas)
- [`dbo.CQxVentilacionMecanicaDet`](#cqxventilacionmecanicadet) (9 columnas)
- [`dbo.CQxVerificacionCirugiaDet`](#cqxverificacioncirugiadet) (9 columnas)
- [`dbo.CQxVisitaEnfermera`](#cqxvisitaenfermera) (11 columnas)
- [`dbo.CQxVisitaEnfermeraVariable`](#cqxvisitaenfermeravariable) (8 columnas)
- [`dbo.Departamentos`](#departamentos) (5 columnas)
- [`dbo.DepartamentosHospital`](#departamentoshospital) (2 columnas)
- [`dbo.DesarrolloVisitaMedicoReceta`](#desarrollovisitamedicoreceta) (6 columnas)
- [`dbo.DetalleFuncionBiologica`](#detallefuncionbiologica) (5 columnas)
- [`dbo.DetalleReferencia`](#detallereferencia) (15 columnas)
- [`dbo.DiagnosticoAlertasEpidemiologicas`](#diagnosticoalertasepidemiologicas) (4 columnas)
- [`dbo.Diagnosticos`](#diagnosticos) (21 columnas)
- [`dbo.DiagnosticosCapitulos`](#diagnosticoscapitulos) (3 columnas)
- [`dbo.DiagnosticosCategorias`](#diagnosticoscategorias) (4 columnas)
- [`dbo.DiagnosticosGrupos`](#diagnosticosgrupos) (3 columnas)
- [`dbo.DiagnosticosSoloPartos`](#diagnosticossolopartos) (1 columnas)
- [`dbo.diascama`](#diascama) (4 columnas)
- [`dbo.Diastema`](#diastema) (10 columnas)
- [`dbo.Diente`](#diente) (15 columnas)
- [`dbo.DienteArea`](#dientearea) (14 columnas)
- [`dbo.DienteCodigo`](#dientecodigo) (11 columnas)
- [`dbo.DisaEstablecimientos`](#disaestablecimientos) (3 columnas)
- [`dbo.Distritos`](#distritos) (4 columnas)
- [`dbo.dtproperties`](#dtproperties) (7 columnas)
- [`dbo.Duenio`](#duenio) (5 columnas)
- [`dbo.Edentulo`](#edentulo) (9 columnas)
- [`dbo.EmergenciaCausaExternaMorbilidad`](#emergenciacausaexternamorbilidad) (4 columnas)
- [`dbo.EmergenciaClaseAccidente`](#emergenciaclaseaccidente) (2 columnas)
- [`dbo.EmergenciaGrupoOcupacionalALAB`](#emergenciagrupoocupacionalalab) (2 columnas)
- [`dbo.EmergenciaLugarEvento`](#emergencialugarevento) (2 columnas)
- [`dbo.EmergenciaPosicionLesionadoALAB`](#emergenciaposicionlesionadoalab) (2 columnas)
- [`dbo.EmergenciaRelacionAgresorVictima`](#emergenciarelacionagresorvictima) (2 columnas)
- [`dbo.EmergenciaSeguridad`](#emergenciaseguridad) (2 columnas)
- [`dbo.EmergenciaTipoAgenteAGAN`](#emergenciatipoagenteagan) (2 columnas)
- [`dbo.EmergenciaTipoEvento`](#emergenciatipoevento) (2 columnas)
- [`dbo.EmergenciaTipoTransporte`](#emergenciatipotransporte) (2 columnas)
- [`dbo.EmergenciaTipoVehiculo`](#emergenciatipovehiculo) (2 columnas)
- [`dbo.EmergenciaUbicacionLesionado`](#emergenciaubicacionlesionado) (2 columnas)
- [`dbo.Empleados`](#empleados) (37 columnas)
- [`dbo.Empleados2`](#empleados2) (34 columnas)
- [`dbo.EmpleadosAccesos`](#empleadosaccesos) (5 columnas)
- [`dbo.EmpleadosCargos`](#empleadoscargos) (2 columnas)
- [`dbo.EmpleadosLugarDeTrabajo`](#empleadoslugardetrabajo) (3 columnas)
- [`dbo.Endodoncia`](#endodoncia) (9 columnas)
- [`dbo.Enfermeria_CatalogoDominios`](#enfermeria_catalogodominios) (3 columnas)
- [`dbo.Enfermeria_CatalogoValoresCombo`](#enfermeria_catalogovalorescombo) (3 columnas)
- [`dbo.Enfermeria_CatalogoVariables`](#enfermeria_catalogovariables) (16 columnas)
- [`dbo.Enfermeria_TratamientoDosis`](#enfermeria_tratamientodosis) (7 columnas)
- [`dbo.Enfermeria_ValoresCombo`](#enfermeria_valorescombo) (4 columnas)
- [`dbo.Enfermeria_Variables`](#enfermeria_variables) (4 columnas)
- [`dbo.Enfermeria_Visitas`](#enfermeria_visitas) (8 columnas)
- [`dbo.EntrevistaPacienteCE`](#entrevistapacientece) (10 columnas)
- [`dbo.EquivalenciaCPT_SMI`](#equivalenciacpt_smi) (2 columnas)
- [`dbo.Erupcion`](#erupcion) (8 columnas)
- [`dbo.EspecialidadCE`](#especialidadce) (5 columnas)
- [`dbo.Especialidades`](#especialidades) (5 columnas)
- [`dbo.especialidades_interconsulta`](#especialidades_interconsulta) (4 columnas)
- [`dbo.EspecialidadReferencia`](#especialidadreferencia) (3 columnas)
- [`dbo.EspecialidadTipoEmpleado`](#especialidadtipoempleado) (2 columnas)
- [`dbo.Especie`](#especie) (2 columnas)
- [`dbo.Espigo`](#espigo) (8 columnas)
- [`dbo.Establecimientos`](#establecimientos) (20 columnas)
- [`dbo.EstablecimientosNoMinsa`](#establecimientosnominsa) (19 columnas)
- [`dbo.EstadosAtencion`](#estadosatencion) (2 columnas)
- [`dbo.EstadosCama`](#estadoscama) (2 columnas)
- [`dbo.EstadosCuenta`](#estadoscuenta) (2 columnas)
- [`dbo.EstadosDevoluciones`](#estadosdevoluciones) (2 columnas)
- [`dbo.EstadosFacturacion`](#estadosfacturacion) (2 columnas)
- [`dbo.EstadosHistoriaClinica`](#estadoshistoriaclinica) (2 columnas)
- [`dbo.EstadosMovimientoHistoria`](#estadosmovimientohistoria) (2 columnas)
- [`dbo.EstadosOrden`](#estadosorden) (2 columnas)
- [`dbo.EstadosReembolso`](#estadosreembolso) (2 columnas)
- [`dbo.EtapasCirugiaCQx`](#etapascirugiacqx) (6 columnas)
- [`dbo.EvaluacionEmergencia`](#evaluacionemergencia) (72 columnas)
- [`dbo.EvaluacionEmergenciaDetalle`](#evaluacionemergenciadetalle) (15 columnas)
- [`dbo.ExamenGinecoObstetra`](#examenginecoobstetra) (87 columnas)
- [`dbo.ExamenSolicitadoBaciloscopia`](#examensolicitadobaciloscopia) (2 columnas)
- [`dbo.Extruida`](#extruida) (8 columnas)
- [`dbo.FactCatalogoBienesInsumos`](#factcatalogobienesinsumos) (30 columnas)
- [`dbo.FactCatalogoBienesInsumosHosp`](#factcatalogobienesinsumoshosp) (5 columnas)
- [`dbo.FactCatalogoPaquete`](#factcatalogopaquete) (9 columnas)
- [`dbo.FactCatalogoServicios`](#factcatalogoservicios) (17 columnas)
- [`dbo.FactCatalogoServiciosGrupo`](#factcatalogoserviciosgrupo) (3 columnas)
- [`dbo.FactCatalogoServiciosHosp`](#factcatalogoservicioshosp) (6 columnas)
- [`dbo.FactCatalogoServiciosHospTIPO1`](#factcatalogoservicioshosptipo1) (6 columnas)
- [`dbo.FactCatalogoServiciosPtos`](#factcatalogoserviciosptos) (3 columnas)
- [`dbo.FactCatalogoServiciosSeccion`](#factcatalogoserviciosseccion) (4 columnas)
- [`dbo.FactCatalogoServiciosSubGrupo`](#factcatalogoserviciossubgrupo) (4 columnas)
- [`dbo.FactCatalogoServiciosSubSeccion`](#factcatalogoserviciossubseccion) (4 columnas)
- [`dbo.FactInsumosGrupoFarmacologico`](#factinsumosgrupofarmacologico) (2 columnas)
- [`dbo.FactInsumosSubGrupoFarmacologico`](#factinsumossubgrupofarmacologico) (3 columnas)
- [`dbo.FactOrdenesBienes`](#factordenesbienes) (17 columnas)
- [`dbo.FactOrdenServicio`](#factordenservicio) (15 columnas)
- [`dbo.FactOrdenServicioPagos`](#factordenserviciopagos) (8 columnas)
- [`dbo.FactPartidasPresupuestales`](#factpartidaspresupuestales) (4 columnas)
- [`dbo.FactPartidasPresupuestalesXMes`](#factpartidaspresupuestalesxmes) (7 columnas)
- [`dbo.FactPartidasSeccion`](#factpartidasseccion) (3 columnas)
- [`dbo.FactPreventa`](#factpreventa) (9 columnas)
- [`dbo.FactPuntosCarga`](#factpuntoscarga) (5 columnas)
- [`dbo.FactPuntosCargaBienesInsumos`](#factpuntoscargabienesinsumos) (3 columnas)
- [`dbo.FactPuntosCargaServicio`](#factpuntoscargaservicio) (3 columnas)
- [`dbo.FactReembolsos`](#factreembolsos) (17 columnas)
- [`dbo.FactReembolsosDocumentos`](#factreembolsosdocumentos) (5 columnas)
- [`dbo.FactTrasladoReferidos`](#facttrasladoreferidos) (2 columnas)
- [`dbo.FacturacionAlertasAceptadas`](#facturacionalertasaceptadas) (9 columnas)
- [`dbo.FacturacionBienesDevoluciones`](#facturacionbienesdevoluciones) (10 columnas)
- [`dbo.FacturacionBienesFinanciamientos`](#facturacionbienesfinanciamientos) (11 columnas)
- [`dbo.FacturacionBienesPagos`](#facturacionbienespagos) (8 columnas)
- [`dbo.FacturacionCatalogoPaquetes`](#facturacioncatalogopaquetes) (6 columnas)
- [`dbo.FacturacionCuentasAtencion`](#facturacioncuentasatencion) (17 columnas)
- [`dbo.FacturacionCuentasAtencionExon`](#facturacioncuentasatencionexon) (2 columnas)
- [`dbo.FacturacionCuentasAtencionPtos`](#facturacioncuentasatencionptos) (5 columnas)
- [`dbo.FacturacionPaquetes`](#facturacionpaquetes) (7 columnas)
- [`dbo.FacturacionPreventa`](#facturacionpreventa) (5 columnas)
- [`dbo.FacturacionReembolsos`](#facturacionreembolsos) (10 columnas)
- [`dbo.FacturacionServicioDespacho`](#facturacionserviciodespacho) (13 columnas)
- [`dbo.FacturacionServicioDevoluciones`](#facturacionserviciodevoluciones) (7 columnas)
- [`dbo.FacturacionServicioFinanciamientos`](#facturacionserviciofinanciamientos) (10 columnas)
- [`dbo.FacturacionServicioPagos`](#facturacionserviciopagos) (8 columnas)
- [`dbo.FacturacionTrasladoReferidos`](#facturaciontrasladoreferidos) (10 columnas)
- [`dbo.FacturacionTrasladoReferidosServicios`](#facturaciontrasladoreferidosservicios) (6 columnas)
- [`dbo.FAR`](#far) (2 columnas)
- [`dbo.FarmaciaSaldo`](#farmaciasaldo) (11 columnas)
- [`dbo.FarmaciaSaldoXFarmacia`](#farmaciasaldoxfarmacia) (11 columnas)
- [`dbo.farmaciaServicio`](#farmaciaservicio) (3 columnas)
- [`dbo.farmAlmacen`](#farmalmacen) (9 columnas)
- [`dbo.farmAlmacenWS`](#farmalmacenws) (2 columnas)
- [`dbo.farmComponente`](#farmcomponente) (3 columnas)
- [`dbo.farmComponenteSub`](#farmcomponentesub) (7 columnas)
- [`dbo.FarmDespachoRecepcion`](#farmdespachorecepcion) (8 columnas)
- [`dbo.farmEstadosInventario`](#farmestadosinventario) (2 columnas)
- [`dbo.farmEstadosMovimientos`](#farmestadosmovimientos) (2 columnas)
- [`dbo.farmEstadosPreventa`](#farmestadospreventa) (2 columnas)
- [`dbo.farmHistPrecio`](#farmhistprecio) (8 columnas)
- [`dbo.farmInventario`](#farminventario) (9 columnas)
- [`dbo.farmInventarioCabecera`](#farminventariocabecera) (8 columnas)
- [`dbo.farmInventarioDetalle`](#farminventariodetalle) (12 columnas)
- [`dbo.farmMotivoAnulacion`](#farmmotivoanulacion) (3 columnas)
- [`dbo.farmMovimiento`](#farmmovimiento) (15 columnas)
- [`dbo.farmMovimientoDetalle`](#farmmovimientodetalle) (12 columnas)
- [`dbo.FarmMovimientoDonaciones`](#farmmovimientodonaciones) (6 columnas)
- [`dbo.farmMovimientoNotaIngreso`](#farmmovimientonotaingreso) (16 columnas)
- [`dbo.farmMovimientoProgramas`](#farmmovimientoprogramas) (9 columnas)
- [`dbo.farmMovimientoVentas`](#farmmovimientoventas) (15 columnas)
- [`dbo.farmMovimientoVentasDetalle`](#farmmovimientoventasdetalle) (6 columnas)
- [`dbo.farmPreVenta`](#farmpreventa) (17 columnas)
- [`dbo.farmPreVentaDetalle`](#farmpreventadetalle) (6 columnas)
- [`dbo.farmRelMod`](#farmrelmod) (20 columnas)
- [`dbo.farmSaldo`](#farmsaldo) (5 columnas)
- [`dbo.farmSaldoDetallado`](#farmsaldodetallado) (10 columnas)
- [`dbo.farmSaldoMensual`](#farmsaldomensual) (5 columnas)
- [`dbo.FarmSaldoMensualDetallado`](#farmsaldomensualdetallado) (8 columnas)
- [`dbo.farmTipoCompra`](#farmtipocompra) (3 columnas)
- [`dbo.farmTipoConceptos`](#farmtipoconceptos) (3 columnas)
- [`dbo.farmTipoDocumentos`](#farmtipodocumentos) (5 columnas)
- [`dbo.farmTipoInventario`](#farmtipoinventario) (3 columnas)
- [`dbo.farmTipoLocal`](#farmtipolocal) (2 columnas)
- [`dbo.farmTipoProceso`](#farmtipoproceso) (3 columnas)
- [`dbo.farmTipoProductosSismed`](#farmtipoproductossismed) (2 columnas)
- [`dbo.farmTipoReceta`](#farmtiporeceta) (2 columnas)
- [`dbo.farmTipoSalidaBienInsumo`](#farmtiposalidabieninsumo) (2 columnas)
- [`dbo.farmTipoSuministro`](#farmtiposuministro) (2 columnas)
- [`dbo.Firmas`](#firmas) (9 columnas)
- [`dbo.Flecha`](#flecha) (11 columnas)
- [`dbo.FormaIngresoEmer`](#formaingresoemer) (2 columnas)
- [`dbo.Fractura`](#fractura) (9 columnas)
- [`dbo.FUA`](#fua) (2 columnas)
- [`dbo.FuentesFinanciamiento`](#fuentesfinanciamiento) (12 columnas)
- [`dbo.FuentesFinanciamientoTarifas`](#fuentesfinanciamientotarifas) (2 columnas)
- [`dbo.Fusion`](#fusion) (9 columnas)
- [`dbo.Geminacion`](#geminacion) (8 columnas)
- [`dbo.GeneradorNroHistoriaClinica`](#generadornrohistoriaclinica) (4 columnas)
- [`dbo.Gestantes`](#gestantes) (5 columnas)
- [`dbo.Giroversion`](#giroversion) (9 columnas)
- [`dbo.GrupoCausaSuspensionOperacion`](#grupocausasuspensionoperacion) (2 columnas)
- [`dbo.GrupoChequeoEnfermeriaPreOperatoria`](#grupochequeoenfermeriapreoperatoria) (7 columnas)
- [`dbo.GrupoCondicionIngresoURPA`](#grupocondicioningresourpa) (6 columnas)
- [`dbo.GruposIndicacionAlta`](#gruposindicacionalta) (6 columnas)
- [`dbo.HIS_Cabecera`](#his_cabecera) (12 columnas)
- [`dbo.HIS_CodigosActividades`](#his_codigosactividades) (4 columnas)
- [`dbo.HIS_colegios`](#his_colegios) (3 columnas)
- [`dbo.HIS_DatosEstablecimiento`](#his_datosestablecimiento) (5 columnas)
- [`dbo.HIS_Detalle`](#his_detalle) (16 columnas)
- [`dbo.HIS_Detalle_Verifica`](#his_detalle_verifica) (24 columnas)
- [`dbo.HIS_DetalleDiagnostico`](#his_detallediagnostico) (5 columnas)
- [`dbo.HIS_DetalleDx_Verifica`](#his_detalledx_verifica) (4 columnas)
- [`dbo.HIS_DxOmitidos`](#his_dxomitidos) (29 columnas)
- [`dbo.HIS_ESTAB`](#his_estab) (10 columnas)
- [`dbo.His_Establecimientos`](#his_establecimientos) (1 columnas)
- [`dbo.HIS_EstablecPacienteHIS`](#his_establecpacientehis) (4 columnas)
- [`dbo.His_EstadosCalidad`](#his_estadoscalidad) (2 columnas)
- [`dbo.His_EstadosLote`](#his_estadoslote) (2 columnas)
- [`dbo.HIS_FACTCATALOGOSERVICIOS`](#his_factcatalogoservicios) (8 columnas)
- [`dbo.HIS_Financiador`](#his_financiador) (3 columnas)
- [`dbo.his_historicoAtenciones`](#his_historicoatenciones) (5 columnas)
- [`dbo.HIS_Lotes`](#his_lotes) (9 columnas)
- [`dbo.HIS_Meses`](#his_meses) (2 columnas)
- [`dbo.HIS_Paciente`](#his_paciente) (8 columnas)
- [`dbo.HIS_ProgMedEstMR`](#his_progmedestmr) (6 columnas)
- [`dbo.HIS_ServEstablecimiento`](#his_servestablecimiento) (2 columnas)
- [`dbo.HIS_situacio`](#his_situacio) (5 columnas)
- [`dbo.HIS_tabetnia`](#his_tabetnia) (4 columnas)
- [`dbo.HIS_TEMPORAL`](#his_temporal) (25 columnas)
- [`dbo.HIS_TemporalSexo`](#his_temporalsexo) (3 columnas)
- [`dbo.HIS_TipoAtencion`](#his_tipoatencion) (3 columnas)
- [`dbo.HIS_TipoEdad`](#his_tipoedad) (3 columnas)
- [`dbo.HIS_Turnos`](#his_turnos) (2 columnas)
- [`dbo.HIS_VALIDACIONES`](#his_validaciones) (9 columnas)
- [`dbo.HistoriasClinicas`](#historiasclinicas) (10 columnas)
- [`dbo.HistoriasMovimientosxServicio`](#historiasmovimientosxservicio) (6 columnas)
- [`dbo.HistoriasSolicitadas`](#historiassolicitadas) (13 columnas)
- [`dbo.Hoja1$`](#hoja1$) (3 columnas)
- [`dbo.ICI_MINSA`](#ici_minsa) (48 columnas)
- [`dbo.ICI_SISMED`](#ici_sismed) (44 columnas)
- [`dbo.ImagCatalgoServicioDuracion`](#imagcatalgoservicioduracion) (5 columnas)
- [`dbo.ImagCitaOrden`](#imagcitaorden) (5 columnas)
- [`dbo.ImagEstados`](#imagestados) (2 columnas)
- [`dbo.ImagMotivoSalidas`](#imagmotivosalidas) (2 columnas)
- [`dbo.ImagMovimiento`](#imagmovimiento) (8 columnas)
- [`dbo.ImagMovimientoArchivos`](#imagmovimientoarchivos) (9 columnas)
- [`dbo.ImagMovimientoCPT`](#imagmovimientocpt) (5 columnas)
- [`dbo.ImagMovimientoDetalle`](#imagmovimientodetalle) (5 columnas)
- [`dbo.ImagMovimientoImagenes`](#imagmovimientoimagenes) (21 columnas)
- [`dbo.ImagMovimientoIngresos`](#imagmovimientoingresos) (3 columnas)
- [`dbo.ImagMovimientoResultados`](#imagmovimientoresultados) (9 columnas)
- [`dbo.ImagMovimientoSalidas`](#imagmovimientosalidas) (3 columnas)
- [`dbo.ImagRecojeExamen`](#imagrecojeexamen) (2 columnas)
- [`dbo.ImagSala`](#imagsala) (7 columnas)
- [`dbo.ImagSalaPuntoCarga`](#imagsalapuntocarga) (5 columnas)
- [`dbo.ImagTipoConceptos`](#imagtipoconceptos) (2 columnas)
- [`dbo.ImagTipoModalidadSala`](#imagtipomodalidadsala) (6 columnas)
- [`dbo.ImgItems`](#imgitems) (3 columnas)
- [`dbo.ImgItemsCpt`](#imgitemscpt) (12 columnas)
- [`dbo.ImgItemsGrupos`](#imgitemsgrupos) (2 columnas)
- [`dbo.ImgLabObservaciones`](#imglabobservaciones) (6 columnas)
- [`dbo.ImgResultadoPorItems`](#imgresultadoporitems) (10 columnas)
- [`dbo.Impactacion`](#impactacion) (8 columnas)
- [`dbo.Implante`](#implante) (11 columnas)
- [`dbo.Institucion`](#institucion) (3 columnas)
- [`dbo.InteoIntegracionSistema`](#inteointegracionsistema) (9 columnas)
- [`dbo.InteoProveedorSistema`](#inteoproveedorsistema) (5 columnas)
- [`dbo.InteoTipoSistema`](#inteotiposistema) (5 columnas)
- [`dbo.InterconsultaCab`](#interconsultacab) (12 columnas)
- [`dbo.InterconsultaDiagnosticos`](#interconsultadiagnosticos) (10 columnas)
- [`dbo.InterconsultaRespuesta`](#interconsultarespuesta) (10 columnas)
- [`dbo.InterconsultaSolicitud`](#interconsultasolicitud) (10 columnas)
- [`dbo.interlabCabecera`](#interlabcabecera) (20 columnas)
- [`dbo.interlabDetalle`](#interlabdetalle) (15 columnas)
- [`dbo.Intrusion`](#intrusion) (8 columnas)
- [`dbo.LabEstados`](#labestados) (2 columnas)
- [`dbo.labGrupos`](#labgrupos) (4 columnas)
- [`dbo.LabItems`](#labitems) (3 columnas)
- [`dbo.LabItemsCpt`](#labitemscpt) (12 columnas)
- [`dbo.LabItemsGrupos`](#labitemsgrupos) (2 columnas)
- [`dbo.LabMotivoSalidas`](#labmotivosalidas) (2 columnas)
- [`dbo.LabMovimiento`](#labmovimiento) (7 columnas)
- [`dbo.LabMovimientoCPT`](#labmovimientocpt) (6 columnas)
- [`dbo.LabMovimientoDetalle`](#labmovimientodetalle) (5 columnas)
- [`dbo.LabMovimientoIngresos`](#labmovimientoingresos) (3 columnas)
- [`dbo.LabMovimientoLaboratorio`](#labmovimientolaboratorio) (13 columnas)
- [`dbo.LabMovimientoSalidas`](#labmovimientosalidas) (3 columnas)
- [`dbo.labPruebas`](#labpruebas) (3 columnas)
- [`dbo.LabRecojeExamen`](#labrecojeexamen) (2 columnas)
- [`dbo.LabResultado`](#labresultado) (7 columnas)
- [`dbo.LabResultadoPorItems`](#labresultadoporitems) (12 columnas)
- [`dbo.LabTipoConceptos`](#labtipoconceptos) (2 columnas)
- [`dbo.Linea`](#linea) (9 columnas)
- [`dbo.Listado de Establecimientos`](#listado de establecimientos) (4 columnas)
- [`dbo.ListBarGrupos`](#listbargrupos) (6 columnas)
- [`dbo.ListBarItems`](#listbaritems) (11 columnas)
- [`dbo.ListBarReporte`](#listbarreporte) (4 columnas)
- [`dbo.LogRefCon`](#logrefcon) (3 columnas)
- [`dbo.lolcliProblemasHC`](#lolcliproblemashc) (7 columnas)
- [`dbo.lolcliUbigeo`](#lolcliubigeo) (10 columnas)
- [`dbo.MAESTRO_HIS_CIE_CPMS`](#maestro_his_cie_cpms) (5 columnas)
- [`dbo.MAESTRO_HIS_FINANCIADOR`](#maestro_his_financiador) (2 columnas)
- [`dbo.MAESTRO_HIS_LAB`](#maestro_his_lab) (3 columnas)
- [`dbo.MAESTRO_HIS_OTRA_CONDICION`](#maestro_his_otra_condicion) (2 columnas)
- [`dbo.MAESTRO_HIS_UPS`](#maestro_his_ups) (2 columnas)
- [`dbo.Mascota`](#mascota) (7 columnas)
- [`dbo.Medicos`](#medicos) (7 columnas)
- [`dbo.MedicosEspecialidad`](#medicosespecialidad) (3 columnas)
- [`dbo.MedicosExtranjeros`](#medicosextranjeros) (4 columnas)
- [`dbo.MensajesEnVentana`](#mensajesenventana) (3 columnas)
- [`dbo.MicroRed`](#microred) (2 columnas)
- [`dbo.MicroRedEstablecimiento`](#microredestablecimiento) (5 columnas)
- [`dbo.modulos_estadistica`](#modulos_estadistica) (7 columnas)
- [`dbo.ModuloSis`](#modulosis) (2 columnas)
- [`dbo.ModulosRolesSis`](#modulosrolessis) (4 columnas)
- [`dbo.MotivoIngresoEmer`](#motivoingresoemer) (2 columnas)
- [`dbo.MotivoReferencia`](#motivoreferencia) (2 columnas)
- [`dbo.MotivosMovimientoHistoria`](#motivosmovimientohistoria) (2 columnas)
- [`dbo.MovimientosFormatosHistoriaClinica`](#movimientosformatoshistoriaclinica) (13 columnas)
- [`dbo.MovimientosHistoriaClinica`](#movimientoshistoriaclinica) (13 columnas)
- [`dbo.NANDA_Interrelacion`](#nanda_interrelacion) (4 columnas)
- [`dbo.NotaCreditoDebito`](#notacreditodebito) (26 columnas)
- [`dbo.NotaCreditoDebitoEstadoNota`](#notacreditodebitoestadonota) (2 columnas)
- [`dbo.NotaCreditoDebitoMotivo`](#notacreditodebitomotivo) (2 columnas)
- [`dbo.NotaCreditoDebitoTipoNota`](#notacreditodebitotiponota) (6 columnas)
- [`dbo.NotaEnfermeria`](#notaenfermeria) (13 columnas)
- [`dbo.NotaEnfermeriaSignosVitales`](#notaenfermeriasignosvitales) (16 columnas)
- [`dbo.Odontograma`](#odontograma) (13 columnas)
- [`dbo.OdontogramaAudit`](#odontogramaaudit) (8 columnas)
- [`dbo.OdontogramaVersion`](#odontogramaversion) (8 columnas)
- [`dbo.OdontogramaVersionAudit`](#odontogramaversionaudit) (8 columnas)
- [`dbo.OdontogramaVersionSnapshot`](#odontogramaversionsnapshot) (9 columnas)
- [`dbo.OPCS`](#opcs) (3 columnas)
- [`dbo.OrdenDiagnosticos`](#ordendiagnosticos) (3 columnas)
- [`dbo.Pacientes`](#pacientes) (54 columnas)
- [`dbo.PacientesDatosAdicionales`](#pacientesdatosadicionales) (14 columnas)
- [`dbo.PacientesMovimientos`](#pacientesmovimientos) (13 columnas)
- [`dbo.PacientesMovimientosDx`](#pacientesmovimientosdx) (2 columnas)
- [`dbo.PadronNominal_Detalle`](#padronnominal_detalle) (22 columnas)
- [`dbo.padronnominal_dxnutricional`](#padronnominal_dxnutricional) (4 columnas)
- [`dbo.PadronNominal_DxNutriTemp`](#padronnominal_dxnutritemp) (2 columnas)
- [`dbo.Paises`](#paises) (3 columnas)
- [`dbo.papeletaAmbulancia`](#papeletaambulancia) (18 columnas)
- [`dbo.Parametros`](#parametros) (8 columnas)
- [`dbo.PerinatalAtencion`](#perinatalatencion) (9 columnas)
- [`dbo.PerinatalAtencionCred`](#perinatalatencioncred) (5 columnas)
- [`dbo.PerinatalAtencionCred1`](#perinatalatencioncred1) (10 columnas)
- [`dbo.PerinatalAtencionDiagnosticos`](#perinatalatenciondiagnosticos) (10 columnas)
- [`dbo.PerinatalAtencionDiaria`](#perinatalatenciondiaria) (2 columnas)
- [`dbo.PerinatalAtencionMedicamentos`](#perinatalatencionmedicamentos) (4 columnas)
- [`dbo.PerinatalAtencionProcedimientos`](#perinatalatencionprocedimientos) (10 columnas)
- [`dbo.PerinatalCatalogoCie10`](#perinatalcatalogocie10) (8 columnas)
- [`dbo.PerinatalCatalogoCpt`](#perinatalcatalogocpt) (4 columnas)
- [`dbo.PerinatalCatalogoCptAutomaticos`](#perinatalcatalogocptautomaticos) (4 columnas)
- [`dbo.PerinatalCatalogoCptMaximaDosis`](#perinatalcatalogocptmaximadosis) (6 columnas)
- [`dbo.PerinatalCatalogoMedicamentos`](#perinatalcatalogomedicamentos) (3 columnas)
- [`dbo.PerinatalListas`](#perinatallistas) (2 columnas)
- [`dbo.PerinatalModulos`](#perinatalmodulos) (4 columnas)
- [`dbo.PeriodoTiempo`](#periodotiempo) (2 columnas)
- [`dbo.Permisos`](#permisos) (3 columnas)
- [`dbo.PNUME`](#pnume) (5 columnas)
- [`dbo.PreguntasVerificacionCirugiaCQx`](#preguntasverificacioncirugiacqx) (7 columnas)
- [`dbo.ProCabecera`](#procabecera) (3 columnas)
- [`dbo.ProCabeceraConfigDatos`](#procabeceraconfigdatos) (14 columnas)
- [`dbo.ProCabeceraDato`](#procabeceradato) (4 columnas)
- [`dbo.ProCatalogoControles`](#procatalogocontroles) (3 columnas)
- [`dbo.ProCatalogoDiagnosticos`](#procatalogodiagnosticos) (2 columnas)
- [`dbo.ProCatalogoProcedimientos`](#procatalogoprocedimientos) (3 columnas)
- [`dbo.ProCatalogoTratamientos`](#procatalogotratamientos) (2 columnas)
- [`dbo.ProcesosDetalleDiagnostico`](#procesosdetallediagnostico) (7 columnas)
- [`dbo.ProcesosRegistro`](#procesosregistro) (11 columnas)
- [`dbo.ProcesosRespuesta`](#procesosrespuesta) (6 columnas)
- [`dbo.ProControlConfigDatos`](#procontrolconfigdatos) (16 columnas)
- [`dbo.ProControlDato`](#procontroldato) (5 columnas)
- [`dbo.ProControles`](#procontroles) (7 columnas)
- [`dbo.ProDiagnosticos`](#prodiagnosticos) (7 columnas)
- [`dbo.ProductoRecetado`](#productorecetado) (5 columnas)
- [`dbo.ProductoServicio`](#productoservicio) (2 columnas)
- [`dbo.ProductosHis`](#productoshis) (3 columnas)
- [`dbo.ProgramacionMedica`](#programacionmedica) (16 columnas)
- [`dbo.Programas`](#programas) (2 columnas)
- [`dbo.ProProcedimientos`](#proprocedimientos) (7 columnas)
- [`dbo.Protesis`](#protesis) (12 columnas)
- [`dbo.ProtesisTeeth`](#protesisteeth) (4 columnas)
- [`dbo.ProtesisV`](#protesisv) (10 columnas)
- [`dbo.ProtesisVTeeth`](#protesisvteeth) (5 columnas)
- [`dbo.ProTratamientos`](#protratamientos) (4 columnas)
- [`dbo.Proveedores`](#proveedores) (3 columnas)
- [`dbo.Provincias`](#provincias) (4 columnas)
- [`dbo.Raiz`](#raiz) (13 columnas)
- [`dbo.Raza`](#raza) (3 columnas)
- [`dbo.RecetaCabecera`](#recetacabecera) (12 columnas)
- [`dbo.RecetaClasificacionViasAdmin`](#recetaclasificacionviasadmin) (2 columnas)
- [`dbo.RecetaDetalle`](#recetadetalle) (14 columnas)
- [`dbo.RecetaDetalleItem`](#recetadetalleitem) (4 columnas)
- [`dbo.RecetaDiagnosticos`](#recetadiagnosticos) (11 columnas)
- [`dbo.RecetaDosis`](#recetadosis) (2 columnas)
- [`dbo.RecetaEstados`](#recetaestados) (2 columnas)
- [`dbo.RecetaEstadosDetalle`](#recetaestadosdetalle) (2 columnas)
- [`dbo.RecetaViaAdministracion`](#recetaviaadministracion) (3 columnas)
- [`dbo.RedEstablecimiento`](#redestablecimiento) (4 columnas)
- [`dbo.RefConTurnosUPS`](#refconturnosups) (3 columnas)
- [`dbo.Referencias`](#referencias) (7 columnas)
- [`dbo.ReferenciasRefcon`](#referenciasrefcon) (51 columnas)
- [`dbo.RegistroEmergencia`](#registroemergencia) (19 columnas)
- [`dbo.RegistroInterconsulta`](#registrointerconsulta) (7 columnas)
- [`dbo.religion`](#religion) (2 columnas)
- [`dbo.Reporte`](#reporte) (20 columnas)
- [`dbo.reporte_cabecera`](#reporte_cabecera) (15 columnas)
- [`dbo.reporte_detalle`](#reporte_detalle) (37 columnas)
- [`dbo.RequerimientoBiologico`](#requerimientobiologico) (14 columnas)
- [`dbo.Restauracion`](#restauracion) (10 columnas)
- [`dbo.rol_estadistica`](#rol_estadistica) (6 columnas)
- [`dbo.rol_items_estadistica`](#rol_items_estadistica) (6 columnas)
- [`dbo.rol_modulos_estadistica`](#rol_modulos_estadistica) (12 columnas)
- [`dbo.Roles`](#roles) (2 columnas)
- [`dbo.RolesItems`](#rolesitems) (7 columnas)
- [`dbo.RolesPermisos`](#rolespermisos) (3 columnas)
- [`dbo.RolesReportes`](#rolesreportes) (3 columnas)
- [`dbo.rolessis`](#rolessis) (2 columnas)
- [`dbo.SeccionChequeoEnfermeria`](#seccionchequeoenfermeria) (6 columnas)
- [`dbo.SeguroSis`](#segurosis) (33 columnas)
- [`dbo.Servicios`](#servicios) (28 columnas)
- [`dbo.ServiciosAtenSimultanea`](#serviciosatensimultanea) (2 columnas)
- [`dbo.ServiciosAtenSimultaneaFua`](#serviciosatensimultaneafua) (7 columnas)
- [`dbo.ServiciosAtenSimultaneaFuaEquiv`](#serviciosatensimultaneafuaequiv) (10 columnas)
- [`dbo.ServiciosAtenSimultaneaImpHIS`](#serviciosatensimultaneaimphis) (12 columnas)
- [`dbo.ServiciosAtenSimultaneaMov`](#serviciosatensimultaneamov) (3 columnas)
- [`dbo.ServiciosBkp`](#serviciosbkp) (26 columnas)
- [`dbo.ServiciosCodPrestacional`](#servicioscodprestacional) (3 columnas)
- [`dbo.ServiciosEspecialidades`](#serviciosespecialidades) (3 columnas)
- [`dbo.ServiciosINMP`](#serviciosinmp) (4 columnas)
- [`dbo.ServicioSocialEstadoOperacion`](#serviciosocialestadooperacion) (2 columnas)
- [`dbo.ServicioSocialOperacion`](#serviciosocialoperacion) (10 columnas)
- [`dbo.ServicioSocialOperacionOrden`](#serviciosocialoperacionorden) (5 columnas)
- [`dbo.ServicioSocialTipoOperacion`](#serviciosocialtipooperacion) (2 columnas)
- [`dbo.SesionesActivas`](#sesionesactivas) (5 columnas)
- [`dbo.SimboloClinico`](#simboloclinico) (7 columnas)
- [`dbo.SolicitudCitasWeb`](#solicitudcitasweb) (16 columnas)
- [`dbo.SolicitudExamenBaciloscopia`](#solicitudexamenbaciloscopia) (20 columnas)
- [`dbo.SolicitudProcedimientos`](#solicitudprocedimientos) (8 columnas)
- [`dbo.SubclasificacionDiagnosticos`](#subclasificaciondiagnosticos) (5 columnas)
- [`dbo.subir`](#subir) (2 columnas)
- [`dbo.SunasaPacientesHistoricos`](#sunasapacienteshistoricos) (30 columnas)
- [`dbo.SunasaTiposAfiliacion`](#sunasatiposafiliacion) (2 columnas)
- [`dbo.SunasaTiposOperacion`](#sunasatiposoperacion) (2 columnas)
- [`dbo.SunasaTiposParentesco`](#sunasatiposparentesco) (2 columnas)
- [`dbo.SunasaTiposRegimen`](#sunasatiposregimen) (2 columnas)
- [`dbo.Supernumerario`](#supernumerario) (8 columnas)
- [`dbo.SuSalud_ups`](#susalud_ups) (2 columnas)
- [`dbo.SVGEstructura`](#svgestructura) (4 columnas)
- [`dbo.sysdiagrams`](#sysdiagrams) (5 columnas)
- [`dbo.TecnicaAnestesiaRegional`](#tecnicaanestesiaregional) (6 columnas)
- [`dbo.tempMovimientos`](#tempmovimientos) (2 columnas)
- [`dbo.test`](#test) (4 columnas)
- [`dbo.TipoEstablecimiento`](#tipoestablecimiento) (2 columnas)
- [`dbo.TipoFinanciador`](#tipofinanciador) (4 columnas)
- [`dbo.TipoMuestraBaciloscopia`](#tipomuestrabaciloscopia) (2 columnas)
- [`dbo.TipoNotificacion`](#tiponotificacion) (2 columnas)
- [`dbo.TiposAccionesEnfermeria`](#tiposaccionesenfermeria) (6 columnas)
- [`dbo.TiposAlta`](#tiposalta) (2 columnas)
- [`dbo.TiposAnestesia`](#tiposanestesia) (6 columnas)
- [`dbo.TiposAnestesiaGeneral`](#tiposanestesiageneral) (6 columnas)
- [`dbo.TiposCama`](#tiposcama) (2 columnas)
- [`dbo.TiposCargo`](#tiposcargo) (2 columnas)
- [`dbo.TiposCausaSuspensionOperacion`](#tiposcausasuspensionoperacion) (8 columnas)
- [`dbo.TiposChequeoCirujano`](#tiposchequeocirujano) (7 columnas)
- [`dbo.TiposChequeoEnfermeriaPreOperatoria`](#tiposchequeoenfermeriapreoperatoria) (8 columnas)
- [`dbo.TiposCondicionAlta`](#tiposcondicionalta) (3 columnas)
- [`dbo.TiposCondicionIngresoURPA`](#tiposcondicioningresourpa) (7 columnas)
- [`dbo.TiposCondicionOcupacion`](#tiposcondicionocupacion) (2 columnas)
- [`dbo.TiposCondicionPaciente`](#tiposcondicionpaciente) (3 columnas)
- [`dbo.TiposCondicionRecienNacido`](#tiposcondicionreciennacido) (2 columnas)
- [`dbo.TiposCondicionTrabajo`](#tiposcondiciontrabajo) (2 columnas)
- [`dbo.TiposConsentimientoInformado`](#tiposconsentimientoinformado) (8 columnas)
- [`dbo.TiposConsumos`](#tiposconsumos) (2 columnas)
- [`dbo.TiposDestacados`](#tiposdestacados) (2 columnas)
- [`dbo.TiposDestinoAtencion`](#tiposdestinoatencion) (7 columnas)
- [`dbo.TiposDestinoOperacion`](#tiposdestinooperacion) (2 columnas)
- [`dbo.TiposDocIdentidad`](#tiposdocidentidad) (5 columnas)
- [`dbo.TiposEdad`](#tiposedad) (4 columnas)
- [`dbo.TiposEmbarazo`](#tiposembarazo) (3 columnas)
- [`dbo.TiposEmpleado`](#tiposempleado) (6 columnas)
- [`dbo.TiposEmpleadosRolesCQx`](#tiposempleadosrolescqx) (4 columnas)
- [`dbo.TiposEstablecimientos`](#tiposestablecimientos) (2 columnas)
- [`dbo.TiposEstadoCivil`](#tiposestadocivil) (4 columnas)
- [`dbo.TiposEstadoSalaOperacion`](#tiposestadosalaoperacion) (6 columnas)
- [`dbo.TiposEstadosCita`](#tiposestadoscita) (2 columnas)
- [`dbo.TiposExamenFisico`](#tiposexamenfisico) (9 columnas)
- [`dbo.TiposFinanciamiento`](#tiposfinanciamiento) (12 columnas)
- [`dbo.TiposFormatosCQx`](#tiposformatoscqx) (8 columnas)
- [`dbo.TiposGradoInstruccion`](#tiposgradoinstruccion) (3 columnas)
- [`dbo.TiposGravedadAtencion`](#tiposgravedadatencion) (2 columnas)
- [`dbo.TiposHistoriaClinica`](#tiposhistoriaclinica) (2 columnas)
- [`dbo.TiposIdiomas`](#tiposidiomas) (3 columnas)
- [`dbo.TiposInasistencia`](#tiposinasistencia) (2 columnas)
- [`dbo.TiposInduccionAnestesia`](#tiposinduccionanestesia) (6 columnas)
- [`dbo.TiposMonitoreoInvasivo`](#tiposmonitoreoinvasivo) (6 columnas)
- [`dbo.TiposMotivoAtencionEmergencia`](#tiposmotivoatencionemergencia) (7 columnas)
- [`dbo.TiposNumeracionHistoria`](#tiposnumeracionhistoria) (2 columnas)
- [`dbo.TiposOcupacion`](#tiposocupacion) (3 columnas)
- [`dbo.TiposOrigenAtencion`](#tiposorigenatencion) (6 columnas)
- [`dbo.TiposPosicionAnestesia`](#tiposposicionanestesia) (6 columnas)
- [`dbo.TiposPrioridadEmergencia`](#tiposprioridademergencia) (6 columnas)
- [`dbo.TiposProcedencia`](#tiposprocedencia) (2 columnas)
- [`dbo.TiposProgramacion`](#tiposprogramacion) (2 columnas)
- [`dbo.TiposReferencia`](#tiposreferencia) (2 columnas)
- [`dbo.TiposResultadosServInterm`](#tiposresultadosservinterm) (2 columnas)
- [`dbo.TiposRolesCQx`](#tiposrolescqx) (8 columnas)
- [`dbo.TiposServicio`](#tiposservicio) (2 columnas)
- [`dbo.TiposServiciosIntermedios`](#tiposserviciosintermedios) (2 columnas)
- [`dbo.TiposSexo`](#tipossexo) (2 columnas)
- [`dbo.TiposSignosVitales`](#tipossignosvitales) (9 columnas)
- [`dbo.TiposSoporteHosp`](#tipossoportehosp) (2 columnas)
- [`dbo.TiposSubsector`](#tipossubsector) (2 columnas)
- [`dbo.TiposTarifa`](#tipostarifa) (4 columnas)
- [`dbo.TiposTarifaCpt`](#tipostarifacpt) (2 columnas)
- [`dbo.TiposTransporte`](#tipostransporte) (2 columnas)
- [`dbo.TiposViaje`](#tiposviaje) (2 columnas)
- [`dbo.TransporteReferencia`](#transportereferencia) (3 columnas)
- [`dbo.Transposicion`](#transposicion) (11 columnas)
- [`dbo.TriajeEmergencia`](#triajeemergencia) (11 columnas)
- [`dbo.TriajeEmergenciaVariable`](#triajeemergenciavariable) (8 columnas)
- [`dbo.TurnoE`](#turnoe) (3 columnas)
- [`dbo.Turnos`](#turnos) (8 columnas)
- [`dbo.UPServicios`](#upservicios) (4 columnas)
- [`dbo.UPSRenaes`](#upsrenaes) (4 columnas)
- [`dbo.UPSTRAMA`](#upstrama) (3 columnas)
- [`dbo.Usuario`](#usuario) (8 columnas)
- [`dbo.usuario_estadistica`](#usuario_estadistica) (8 columnas)
- [`dbo.USUARIO_WEB`](#usuario_web) (15 columnas)
- [`dbo.UsuariosDev`](#usuariosdev) (3 columnas)
- [`dbo.UsuariosRoles`](#usuariosroles) (3 columnas)
- [`dbo.Vacuna`](#vacuna) (6 columnas)
- [`dbo.ValorUIT`](#valoruit) (3 columnas)
- [`dbo.visitas`](#visitas) (8 columnas)
- [`dbo.WebegresosNew`](#webegresosnew) (59 columnas)
- [`dbo.WebEmergenciaNew`](#webemergencianew) (56 columnas)
- [`dbo.WebHisminsa`](#webhisminsa) (66 columnas)
- [`dbo.WebHisminsaNew`](#webhisminsanew) (81 columnas)
- [`dbo.WebHisminsaNew_backup_20260828_134848`](#webhisminsanew_backup_20260828_134848) (81 columnas)
- [`dbo.WebHisminsaNew_Duplicates_Audit`](#webhisminsanew_duplicates_audit) (82 columnas)
- [`dbo.x_total`](#x_total) (5 columnas)
- [`dbo.Atencioness`](#atencioness) (35 columnas)
- [`dbo.citas_dia`](#citas_dia) (11 columnas)
- [`dbo.Empleadoss`](#empleadoss) (34 columnas)
- [`dbo.MINSA_VCITAPROGRAMADA`](#minsa_vcitaprogramada) (20 columnas)
- [`dbo.MINSA_vPaciente`](#minsa_vpaciente) (13 columnas)
- [`dbo.MINSA_VPROGRAMACION`](#minsa_vprogramacion) (19 columnas)
- [`dbo.minsa_vTipoDocumento`](#minsa_vtipodocumento) (2 columnas)
- [`dbo.pac`](#pac) (2 columnas)
- [`dbo.Paciente_atendidos`](#paciente_atendidos) (12 columnas)
- [`dbo.paciente_cita`](#paciente_cita) (12 columnas)
- [`dbo.po`](#po) (18 columnas)
- [`dbo.vw_Exoneraciones`](#vw_exoneraciones) (10 columnas)
- [`dbo.vw_Farmacia_Alerta200`](#vw_farmacia_alerta200) (14 columnas)

## Detalle de tablas y vistas

### _tmp

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdAtencion | int | no | sí |  | PK |
| IdPaciente | int | no |  |  |  |
| Edad | int | no |  |  |  |
| FechaIngreso | datetime | no |  |  |  |
| HoraIngreso | char(5) | no |  |  |  |
| IdTipoReferenciaOrigen | int | sí |  |  |  |
| IdTipoReferenciaDestino | int | sí |  |  |  |
| IdDestinoAtencion | int | sí |  |  |  |
| IdTipoCondicionAlServicio | int | sí |  |  |  |
| IdTipoCondicionALEstab | int | sí |  |  |  |
| IdServicioIngreso | int | no |  |  |  |
| IdMedicoIngreso | int | no |  |  |  |
| IdEspecialidadMedico | int | sí |  |  |  |
| IdEstablecimientoOrigen | int | sí |  |  |  |
| IdEstablecimientoDestino | int | sí |  |  |  |
| IdEstablecimientoNoMinsaOrigen | int | sí |  |  |  |
| IdEstablecimientoNoMinsaDestino | int | sí |  |  |  |
| IdMedicoEgreso | int | sí |  |  |  |
| FechaEgreso | datetime | sí |  |  |  |
| HoraEgreso | char(5) | sí |  |  |  |
| Observacion | varchar(200) | sí |  |  |  |
| IdOrigenAtencion | int | sí |  |  |  |
| FechaEgresoAdministrativo | datetime | sí |  |  |  |
| HoraEgresoAdministrativo | char(5) | sí |  |  |  |
| HuboInfeccionIntraHospitalaria | bit | sí |  |  |  |
| TieneNecropsia | bit | sí |  |  |  |
| IdCondicionAlta | int | sí |  |  |  |
| IdTipoAlta | int | sí |  |  |  |
| IdServicioEgreso | int | sí |  |  |  |
| IdCamaIngreso | int | sí |  |  |  |
| IdCamaEgreso | int | sí |  |  |  |
| IdMedicoRespNacimiento | int | sí |  |  |  |
| IdTipoGravedad | int | sí |  |  |  |
| DireccionDomicilio | varchar(50) | sí |  |  |  |
| NombreAcompaniante | varchar(30) | sí |  |  |  |
| RecienNacido | bit | sí |  |  |  |
| IdTipoEdad | int | sí |  |  |  |
| IdCuentaAtencion | int | no |  |  |  |
| IdTipoServicio | int | sí |  |  |  |
| IdFormaPago | int | sí |  |  |  |
| idFuenteFinanciamiento | int | sí |  |  |  |
| idEstadoAtencion | int | sí |  |  |  |
| NroReferenciaOrigen | varchar(20) | sí |  |  |  |
| NroReferenciaDestino | varchar(20) | sí |  |  |  |

### _verificaWeb

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| ide | int | no | sí |  |  |
| idusuario | int | sí |  |  |  |
| opcion | int | sí |  |  |  |
| fecha | date | sí |  |  |  |
| estado | int | sí |  |  |  |

### aa

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| CODIGO | varchar(7) | no |  |  |  |
| DESCRIPCION | varchar(300) | no |  |  |  |
| UNID.  DE CONSUMO | varchar(10) | sí |  |  |  |
| PRECIO OPE | money | sí |  |  |  |
| SALDO DEL MES ANTERIOR | int | no |  |  |  |
| INGRESO | int | sí |  |  |  |
| VENTAS | int | sí |  |  |  |
| SIS | int | sí |  |  |  |
| INTERV_SANIT | int | sí |  |  |  |
| FACTOR PERD | int | no |  |  |  |
| DEFENSA NACIONAL | int | sí |  |  |  |
| EXONER | int | sí |  |  |  |
| SOAT | int | sí |  |  |  |
| OTROS  CONVEN | int | sí |  |  |  |
| DEVOL | int | sí |  |  |  |
| VENC | int | sí |  |  |  |
| MERMA | int | no |  |  |  |
| OTRAS SALIDAS | int | sí |  |  |  |
| TOTAL SALIDAS | decimal(11,0) | sí |  |  |  |
| SALDO  FINAL DISPONIBLE | int | sí |  |  |  |
| FECHA DE EXP MAS PROXIMA | datetime | sí |  |  |  |
| DevolSis | int | sí |  |  |  |
| DevolPart | int | sí |  |  |  |
| DevolsOAT | int | sí |  |  |  |
| DevolcONV | int | sí |  |  |  |
| DevolEstr | int | sí |  |  |  |

### ACCESO_MENU

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| ID_MENU | varchar(20) | no |  |  |  |
| NOMBRE | varchar(60) | sí |  |  |  |
| ICONO | varchar(60) | sí |  |  |  |
| URL | varchar(150) | sí |  |  |  |
| ORDEN | int | sí |  |  |  |
| ESTADO | int | sí |  |  |  |
| ID_AM | varchar(20) | no |  |  |  |
| DNI | char(8) | no |  |  |  |

### ACCESO_MODULO

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| ID_AM | varchar(20) | no |  |  |  |
| NOMBRE | varchar(60) | sí |  |  |  |
| URL | varchar(150) | sí |  |  |  |
| IMAGEN | varchar(60) | sí |  |  |  |
| ESTADO | int | sí |  |  |  |
| DNI | char(8) | no |  |  |  |
| PLANTILLA | varchar(100) | sí |  |  |  |

### ACCESO_SUBMENU

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| ID_SUBMENU | varchar(20) | no |  |  |  |
| NOMBRE | varchar(60) | sí |  |  |  |
| ICONO | varchar(60) | sí |  |  |  |
| URL | varchar(150) | sí |  |  |  |
| ORDEN | int | sí |  |  |  |
| ESTADO | int | sí |  |  |  |
| ID_MENU | varchar(20) | no |  |  |  |
| ID_AM | varchar(20) | no |  |  |  |
| DNI | char(8) | no |  |  |  |

### Actividad

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| idactividad | int | sí |  |  |  |
| descripcion | varchar(50) | sí |  |  |  |

### actualizarCPT

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| Idproducto | int | sí |  |  |  |
| PrecioUnitario | money | sí |  |  |  |
| codigoSIS | varchar(20) | sí |  |  |  |
| NOCUBRESIS | bit | sí |  |  |  |

### actualizarlaboratorio

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| cpt | varchar(20) | sí |  |  |  |

### actualizarLiquidacion

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| idcuentaatencion | int | sí |  |  |  |

### actualizarnroreferencia

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| Idatencion | int | sí |  |  |  |
| idpaciente | int | sí |  |  |  |
| nrodocumento | varchar(12) | sí |  |  |  |

### actualizarpacientes

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| nrodocumento | varchar(12) | sí |  |  |  |
| apellidoMaterno | varchar(40) | sí |  |  |  |

### Anotacion

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| Id | int | no | sí |  | PK |
| OdontogramaVersionId | int | no |  |  |  |
| Categoria | nvarchar(50) | sí |  |  |  |
| Texto | nvarchar(1000) | sí |  |  |  |
| Metadata | nvarchar(max) | sí |  |  |  |
| Fecha_Creacion | datetime2 | no |  | getdate() |  |
| Usuario_Creacion | nvarchar(100) | sí |  |  |  |

Claves foráneas:

- `OdontogramaVersionId` → `dbo.OdontogramaVersion.Id` (FK_Anotacion_Version)

### AntecedentesFamiliares

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| idAntecFamiliares | int | no | sí |  | PK |
| idPrograma | int | sí |  |  |  |
| idProCabecera | int | no |  |  |  |
| Tbc | bit | sí |  |  |  |
| TbcDescripcion | text | sí |  |  |  |
| Diabetes | bit | sí |  |  |  |
| DiabetesDescripcion | text | sí |  |  |  |
| PreeclampsiaEclampsia | bit | sí |  |  |  |
| PreeclampsiaEclampsiaDescripcion | text | sí |  |  |  |
| OtraCondMedGraveDescripcion | text | sí |  |  |  |
| OtraCondMedGrave | bit | sí |  |  |  |
| Hipertencion | bit | sí |  |  |  |
| HipertencionDescripcion | text | sí |  |  |  |

Claves foráneas:

- `idProCabecera` → `dbo.ProCabecera.IdProcabecera` (FK_AntecedentesFamiliares_ProCabecera)
- `idPrograma` → `dbo.ProCabecera.IdPrograma` (FK_AntecedentesFamiliares_ProCabecera)

### AntecedentesObstetricos

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| idAntecObstetricos | int | no | sí |  | PK |
| idPrograma | int | sí |  |  |  |
| idProCabecera | int | sí |  |  |  |
| Gestas | int | sí |  |  |  |
| abortos | int | sí |  |  |  |
| Vaginales | int | sí |  |  |  |
| NacidosVivos | int | sí |  |  |  |
| Viven | int | sí |  |  |  |
| Partos | int | sí |  |  |  |
| Cesareas | int | sí |  |  |  |
| NacidosMuertos | int | sí |  |  |  |
| Muerto1Seman | int | sí |  |  |  |
| Despues1Seman | int | sí |  |  |  |
| menor2500gr | bit | sí |  |  |  |
| Multiple | bit | sí |  |  |  |
| memor37sm | bit | sí |  |  |  |
| PesoPregestacional | decimal(18,2) | sí |  |  |  |
| FechaFinEmbarazoAnt | date | sí |  |  |  |
| idTerminacion | int | sí |  |  |  |
| idAborto | int | sí |  |  |  |
| FracasoMetodo | int | sí |  |  |  |
| EmbarazoPlaneado | int | sí |  |  |  |
| EmbarazoEctopico | bit | sí |  |  |  |
| mayor4000g | bit | sí |  |  |  |
| P1 | int | sí |  |  |  |
| P2 | int | sí |  |  |  |
| P3 | int | sí |  |  |  |
| P4 | int | sí |  |  |  |

Claves foráneas:

- `idPrograma` → `dbo.ProCabecera.IdPrograma` (FK_AntecedentesObstetricos_ProCabecera)
- `idProCabecera` → `dbo.ProCabecera.IdProcabecera` (FK_AntecedentesObstetricos_ProCabecera)

### AntecedentesPersonales

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| idAntecPersonales | int | no | sí |  | PK |
| idPrograma | int | sí |  |  |  |
| idProCabecera | int | sí |  |  |  |
| Tbc | bit | sí |  |  |  |
| TbcDescripcion | text | sí |  |  |  |
| Diabetes | bit | sí |  |  |  |
| DiabetesDescripcion | text | sí |  |  |  |
| PreeclampsiaEclampsia | bit | sí |  |  |  |
| PreeclampsiaEclampsiaDescripcion | text | sí |  |  |  |
| Vih | bit | sí |  |  |  |
| vihDescripcion | text | sí |  |  |  |
| Alergia | bit | sí |  |  |  |
| AlergiaDescripcion | text | sí |  |  |  |
| Otros | bit | sí |  |  |  |
| OtrosDescripcion | text | sí |  |  |  |
| CirugiaMayor | bit | sí |  |  |  |
| CirugiaMayorDescripcion | text | sí |  |  |  |
| Violencia | bit | sí |  |  |  |
| ViolenciaDescripcion | text | sí |  |  |  |
| Hipertencion | bit | sí |  |  |  |
| HipertencionDescripcion | text | sí |  |  |  |
| VacunaPrevia | bit | sí |  |  |  |
| VacunaPreviaDescripcion | text | sí |  |  |  |

Claves foráneas:

- `idProCabecera` → `dbo.ProCabecera.IdProcabecera` (FK_AntecedentesPersonales_ProCabecera)
- `idPrograma` → `dbo.ProCabecera.IdPrograma` (FK_AntecedentesPersonales_ProCabecera)

### AntecedentesTratamientoBaciloscopia

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdAntecedentesTratamiento | int | no | sí |  |  |
| Descripcion | varchar(50) | sí |  |  |  |

### AparatoFijo

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| Id | int | no | sí |  | PK |
| OdontogramaVersionId | int | no |  |  |  |
| Tipo | nvarchar(50) | no |  |  |  |
| Color | nvarchar(30) | sí |  |  |  |
| Metadata | nvarchar(max) | sí |  |  |  |
| Fecha_Creacion | datetime2 | no |  | getdate() |  |
| Usuario_Creacion | nvarchar(100) | sí |  |  |  |

Claves foráneas:

- `OdontogramaVersionId` → `dbo.OdontogramaVersion.Id` (FK_AparatoFijo_Version)

### AparatoFijoDiente

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| Id | int | no | sí |  | PK |
| AparatoFijoId | int | no |  |  |  |
| NumeroDiente | tinyint | no |  |  |  |
| Elemento | nvarchar(30) | no |  |  |  |
| Metadata | nvarchar(max) | sí |  |  |  |

Claves foráneas:

- `AparatoFijoId` → `dbo.AparatoFijo.Id` (FK_AparatoFijoDiente_Aparato)

### AparatoRemovible

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| Id | int | no | sí |  | PK |
| OdontogramaVersionId | int | no |  |  |  |
| Tipo | nvarchar(50) | no |  |  |  |
| Posicion | nvarchar(20) | sí |  |  |  |
| DienteInicio | tinyint | sí |  |  |  |
| DienteFin | tinyint | sí |  |  |  |
| Color | nvarchar(30) | sí |  |  |  |
| Metadata | nvarchar(max) | sí |  |  |  |
| Fecha_Creacion | datetime2 | no |  | getdate() |  |
| Usuario_Creacion | nvarchar(100) | sí |  |  |  |

Claves foráneas:

- `OdontogramaVersionId` → `dbo.OdontogramaVersion.Id` (FK_AparatoRemovible_Version)

### ArchiveroServicio

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdArchivero | int | no | sí |  | PK |
| IdEmpleado | int | sí |  |  |  |
| IdServicio | int | sí |  |  |  |

Claves foráneas:

- `IdEmpleado` → `dbo.Empleados.IdEmpleado` (Empleados_ResponsableHistoriaServicio_FK1)
- `IdServicio` → `dbo.Servicios.IdServicio` (Servicios_ResponsableHistoriaServicio_FK1)

### ArchivosCab

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| idArchivo | int | no | sí |  | PK |
| idConfiguracion | int | sí |  |  |  |
| idCampo1 | varchar(20) | sí |  |  |  |
| idCampo2 | varchar(20) | sí |  |  |  |
| sg_Log_Cre_feh | datetime | sí |  | getdate() |  |
| sg_log_Cre_Usuario | varchar(20) | sí |  | suser_sname() |  |
| sg_log_Cre_Equipo | varchar(20) | sí |  | host_name() |  |
| sg_Log_Mod_feh | datetime | sí |  |  |  |
| sg_log_Mod_Usuario | varchar(20) | sí |  |  |  |
| sg_log_Mod_Equipo | varchar(20) | sí |  |  |  |

### ArchivosConfiguracion

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| idConfiguracion | int | no |  |  | PK |
| NombreTabla | varchar(50) | sí |  |  |  |
| Campo1 | varchar(30) | sí |  |  |  |
| Campo2 | varchar(30) | sí |  |  |  |
| idEstado | int | sí |  |  |  |
| sg_Log_Cre_feh | datetime | sí |  | getdate() |  |
| sg_Log_Cre_idEmpleado | int | sí |  |  |  |
| sg_log_Cre_Usuario | varchar(20) | sí |  |  |  |
| sg_log_Cre_Equipo | varchar(20) | sí |  | host_name() |  |
| sg_Log_Mod_feh | datetime | sí |  |  |  |
| sg_Log_Mod_idEmpleado | int | sí |  |  |  |
| sg_log_Mod_Usuario | varchar(20) | sí |  |  |  |
| sg_log_Mod_Equipo | varchar(20) | sí |  |  |  |

### ArchivosDet

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| idArchivoDetalle | int | no | sí |  | PK |
| idArchivo | int | sí |  |  |  |
| Nombre | varchar(50) | sí |  |  |  |
| Extension | int | sí |  |  |  |
| Archivo | varchar(max) | sí |  |  |  |
| idEstado | bit | sí |  |  |  |
| sg_Log_Cre_feh | datetime | sí |  | getdate() |  |
| sg_Log_Cre_idEmpleado | int | sí |  |  |  |
| sg_log_Cre_Usuario | varchar(20) | sí |  |  |  |
| sg_log_Cre_Equipo | varchar(20) | sí |  | host_name() |  |
| sg_Log_Mod_feh | datetime | sí |  |  |  |
| sg_Log_Mod_idEmpleado | int | sí |  |  |  |
| sg_log_Mod_Usuario | varchar(20) | sí |  |  |  |
| sg_log_Mod_Equipo | varchar(20) | sí |  |  |  |
| verMedico | bit | sí |  |  |  |

### ArchivosExtension

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| idExtension | int | no |  |  | PK |
| Extension | varchar(10) | sí |  |  |  |

### ArcoOrtodoncia

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| Id | int | no | sí |  | PK |
| OdontogramaVersionId | int | no |  |  |  |
| Tipo | nvarchar(50) | sí |  |  |  |
| Color | nvarchar(30) | sí |  |  |  |
| Puntos | nvarchar(max) | no |  |  |  |
| Fecha_Creacion | datetime2 | no |  | getdate() |  |
| Usuario_Creacion | nvarchar(100) | sí |  |  |  |
| Metadata | nvarchar(max) | sí |  |  |  |

Claves foráneas:

- `OdontogramaVersionId` → `dbo.OdontogramaVersion.Id` (FK_ArcoOrtodoncia_Version)

### AreaTramitaSeguros

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| idAreaTramitaSeguros | int | no |  |  | PK |
| Descripcion | varchar(50) | no |  |  |  |

### Aseguradora

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| idAseguradora | int | no | sí |  | PK |
| Des_Larga | varchar(20) | sí |  |  |  |
| Des_Breve | varchar(10) | sí |  |  |  |
| sg_Est_Registro | char(2) | sí |  |  |  |
| sg_Log_Cre_feh | datetime | sí |  | getdate() |  |
| sg_log_Cre_Usuario | varchar(20) | sí |  | suser_sname() |  |
| sg_log_Cre_Equipo | varchar(20) | sí |  | host_name() |  |
| sg_Log_Mod_feh | datetime | sí |  |  |  |
| sg_log_Mod_Usuario | varchar(20) | sí |  |  |  |
| sg_log_Mod_Equipo | varchar(20) | sí |  |  |  |

### AsignacionesCama

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdAsignacionCama | int | no | sí |  | PK |
| IdEstanciaHospitalaria | int | no |  |  |  |
| IdCama | int | no |  |  |  |
| IdServicio | int | no |  |  |  |
| IdAtencion | int | no |  |  |  |
| FechaAsignacion | datetime | no |  |  |  |

### Atenciones

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdAtencion | int | no | sí |  | PK |
| IdPaciente | int | no |  |  |  |
| Edad | int | no |  |  |  |
| FechaIngreso | datetime | no |  |  |  |
| HoraIngreso | char(5) | no |  |  |  |
| IdDestinoAtencion | int | sí |  |  |  |
| IdTipoCondicionAlServicio | int | sí |  |  |  |
| IdTipoCondicionALEstab | int | sí |  |  |  |
| IdServicioIngreso | int | no |  |  |  |
| IdMedicoIngreso | int | no |  |  |  |
| IdEspecialidadMedico | int | sí |  |  |  |
| IdMedicoEgreso | int | sí |  |  |  |
| FechaEgreso | datetime | sí |  |  |  |
| HoraEgreso | char(5) | sí |  |  |  |
| IdOrigenAtencion | int | sí |  |  |  |
| FechaEgresoAdministrativo | datetime | sí |  |  |  |
| HoraEgresoAdministrativo | char(5) | sí |  |  |  |
| IdCondicionAlta | int | sí |  |  |  |
| IdTipoAlta | int | sí |  |  |  |
| IdServicioEgreso | int | sí |  |  |  |
| IdCamaIngreso | int | sí |  |  |  |
| IdCamaEgreso | int | sí |  |  |  |
| IdTipoGravedad | int | sí |  |  |  |
| IdTipoEdad | int | sí |  |  |  |
| IdCuentaAtencion | int | no |  |  |  |
| IdTipoServicio | int | sí |  |  |  |
| IdFormaPago | int | sí |  |  |  |
| idFuenteFinanciamiento | int | sí |  |  |  |
| idEstadoAtencion | int | sí |  |  |  |
| EsPacienteExterno | bit | sí |  | (0) |  |
| idSunasaPacienteHistorico | int | sí |  |  |  |
| FyHInicioI | datetime | sí |  |  |  |
| FyHFinal | datetime | sí |  |  |  |
| idCondicionMaterna | int | sí |  |  |  |
| idCartaGarantia | int | sí |  |  |  |
| EsHistoriaRecogida | bit | sí |  | (0) |  |
| FechaHoraHistoriaRecogida | datetime | sí |  |  |  |
| AltaEfectiva | bit | no |  | (0) |  |
| FechaHoraAltaEfectiva | datetime | sí |  |  |  |
| Pago | varchar(500) | no |  | '' |  |
| IdTipoInasistencia | int | sí |  |  |  |
| FechaModificacion | datetime | sí |  |  |  |

Claves foráneas:

- `idSunasaPacienteHistorico` → `dbo.SunasaPacientesHistoricos.idSunasaPacienteHistorico` (FK_Atenciones_SunasaPacientesHistoricos)
- `IdTipoInasistencia` → `dbo.TiposInasistencia.IdTipoInasistencia` (FK_Atenciones_TiposInasistencia)

### AtencionesCondicionMaterna

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdAtencionCondicionMaterna | int | no | sí |  | PK |
| IdAtencion | int | no |  |  |  |
| IdCondicionTipo | int | no |  |  |  |
| EdadGestacional | varchar(50) | sí |  |  |  |
| CPN | varchar(50) | sí |  |  |  |
| FechaProbableParto | varchar(255) | sí |  |  |  |
| AlturaUterina | varchar(50) | sí |  |  |  |
| IdUsuario | int | sí |  |  |  |
| FechaRegistro | datetime | sí |  | getdate() |  |
| PesoPregestacional | decimal(10,4) | sí |  |  |  |
| FUR | datetime | sí |  |  |  |
| FechaPartoReal | varchar(255) | sí |  |  |  |

### AtencionesConvenio

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| idAtencionesConvenio | int | no | sí |  |  |
| idPaciente | int | no |  |  |  |
| nroOficio | varchar(20) | no |  |  |  |
| FechaSesion | datetime | no |  |  |  |
| ImporteSesion | money | sí |  |  |  |
| idUsuario | int | no |  |  |  |
| idProducto | int | no |  |  |  |

### AtencionesDatosAdicionales

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| idAtencion | int | no |  |  | PK |
| DireccionDomicilio | varchar(100) | sí |  |  |  |
| NombreAcompaniante | varchar(100) | sí |  |  |  |
| Observacion | varchar(200) | sí |  |  |  |
| ProximaCita | datetime | sí |  |  |  |
| NumeroDeHijos | int | sí |  |  |  |
| IdSiaSis | int | sí |  |  |  |
| FuaCodigoPrestacion | varchar(3) | sí |  |  |  |
| SisCodigo | varchar(2) | sí |  |  |  |
| IdTipoReferenciaOrigen | int | sí |  |  |  |
| IdTipoReferenciaDestino | int | sí |  |  |  |
| IdEstablecimientoOrigen | int | sí |  |  |  |
| IdEstablecimientoDestino | int | sí |  |  |  |
| IdEstablecimientoNoMinsaOrigen | int | sí |  |  |  |
| IdEstablecimientoNoMinsaDestino | int | sí |  |  |  |
| HuboInfeccionIntraHospitalaria | int | sí |  |  |  |
| TieneNecropsia | bit | sí |  |  |  |
| IdMedicoRespNacimiento | int | sí |  |  |  |
| RecienNacido | bit | sí |  |  |  |
| NroReferenciaOrigen | varchar(20) | sí |  |  |  |
| NroReferenciaDestino | varchar(20) | sí |  |  |  |
| SeImprimioFicha | bit | sí |  |  |  |
| NroExpediente | varchar(50) | sí |  |  |  |
| id_condicion_ref | int | sí |  |  |  |
| id_motivo_ref | int | sí |  |  |  |
| id_transporte_ref | int | sí |  |  |  |
| id_especialidad_ref | int | sí |  |  |  |
| id_upsdestino_ref | varchar(10) | sí |  |  |  |
| id_estado_ref | int | sí |  |  |  |
| id_Calificacion_ContRef | int | sí |  |  |  |
| Tratamiento | text | sí |  |  |  |
| PlanTrabajo | text | sí |  |  |  |
| idReferencia | int | sí |  |  |  |

### AtencionesDatosAdicionalesAlta

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdAtencion | int | no |  |  | PK |
| Pronostico | varchar(1000) | sí |  |  |  |
| RecomendacionesyTratamiento | varchar(1000) | sí |  |  |  |
| EnfermedadActual | varchar(3000) | sí |  |  |  |
| NroActaDef | varchar(15) | sí |  |  |  |

### AtencionesDiagnosticoProcedimiento

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| idProcedimientoDiagnostico | int | no | sí |  |  |
| idCuenta | int | sí |  |  |  |
| idAtencionDiagnostico2 | int | sí |  |  |  |
| ideOrden | int | sí |  |  |  |
| ideProducto | int | sí |  |  |  |
| estado | int | sí |  |  |  |

### AtencionesDiagnosticos

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdAtencionDiagnostico | int | no | sí |  | PK |
| IdAtencion | int | no |  |  |  |
| IdClasificacionDx | int | no |  |  |  |
| IdDiagnostico | int | sí |  |  |  |
| IdSubclasificacionDx | int | sí |  |  |  |
| labConfHIS | varchar(3) | sí |  |  |  |
| GrupoHIS | int | sí |  |  |  |
| SubGrupoHIS | int | sí |  |  |  |
| idordenDx | int | sí |  |  |  |
| NroEvaluacion | int | sí |  |  |  |
| LabConfHIS2 | char(3) | sí |  |  |  |
| LabConfHIS3 | char(3) | sí |  |  |  |
| NumeroOrden | int | sí |  |  |  |

Claves foráneas:

- `IdClasificacionDx` → `dbo.ClasificacionDiagnosticos.IdClasificacionDx` (ClasificacionDiagnosticos_AtencionesDiagnosticos_FK1)
- `IdDiagnostico` → `dbo.Diagnosticos.IdDiagnostico` (Diagnosticos_AtencionesDiagnosticos_FK1)
- `IdAtencion` → `dbo.Atenciones.IdAtencion` (FK_AtencionesDiagnosticos_Atenciones)
- `IdSubclasificacionDx` → `dbo.SubclasificacionDiagnosticos.IdSubclasificacionDx` (SubclasificaciónDiagnosticos_AtencionesDiagnosticos_FK1)

### AtencionesDiagnosticos2

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdAtencionDiagnostico2 | int | no | sí |  | PK |
| IdAtencion | int | no |  |  |  |
| IdClasificacionDx | int | no |  |  |  |
| IdDiagnostico | int | sí |  |  |  |
| IdSubclasificacionDx | int | sí |  |  |  |
| labConfHIS | varchar(3) | sí |  |  |  |
| GrupoHIS | int | sí |  |  |  |
| SubGrupoHIS | int | sí |  |  |  |
| IdUsuario | int | sí |  |  |  |
| Estado | bit | sí |  |  |  |
| idorden | int | sí |  |  |  |
| idproducto | int | sí |  |  |  |

### AtencionesDiagnosticosReferencias

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdAtencion | int | sí |  |  |  |
| IdDiagnostico | int | sí |  |  |  |
| IdsubClasificacion | int | sí |  |  |  |
| IdUsuario | int | sí |  |  |  |
| IdEstado | int | sí |  |  |  |
| FechaRegistro | datetime | sí |  |  |  |
| Justifica | int | sí |  |  |  |

### AtencionesEmergencia

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdAtencionEmergencia | int | no | sí |  | PK |
| IdAtencion | int | sí |  |  |  |
| IdCausaExternaMorbilidad | int | sí |  |  |  |
| IdLugarEvento | int | sí |  |  |  |
| IdTipoEvento | int | sí |  |  |  |
| IdSeguridad | int | sí |  |  |  |
| IdRelacionAgresorVictima | int | sí |  |  |  |
| IdClaseAccidente | int | sí |  |  |  |
| IdTipoVehiculo | int | sí |  |  |  |
| IdTipoTransporte | int | sí |  |  |  |
| IdUbicacionLesionado | int | sí |  |  |  |
| IdPosicionLesionadoALAB | int | sí |  |  |  |
| IdGrupoOcupacionalALAB | int | sí |  |  |  |
| IdTipoAgenteAGAN | int | sí |  |  |  |
| Motivo | varchar(1000) | sí |  |  |  |
| TE | varchar(1000) | sí |  |  |  |
| Relato | varchar(1000) | sí |  |  |  |
| Antecedentes | varchar(1000) | sí |  |  |  |
| EFGeneral | varchar(1000) | sí |  |  |  |
| EFRespiratorio | varchar(1000) | sí |  |  |  |
| EFCardiovascular | varchar(1000) | sí |  |  |  |
| EFAbdomen | varchar(1000) | sí |  |  |  |
| EFNeurologico | varchar(1000) | sí |  |  |  |
| EFGentouriano | varchar(1000) | sí |  |  |  |
| EFLocomotor | varchar(1000) | sí |  |  |  |
| Otros | varchar(1000) | sí |  |  |  |
| Evolucion | varchar(2000) | sí |  |  |  |

Claves foráneas:

- `IdCausaExternaMorbilidad` → `dbo.EmergenciaCausaExternaMorbilidad.IdCausaExternaMorbilidad` (EmergenciaCausaExternaMorbilidad_AtencionesEmergencia_FK1)
- `IdClaseAccidente` → `dbo.EmergenciaClaseAccidente.IdClaseAccidente` (EmergenciaClaseAccidente_AtencionesEmergencia_FK1)
- `IdGrupoOcupacionalALAB` → `dbo.EmergenciaGrupoOcupacionalALAB.IdGrupoOcupacionalALAB` (EmergenciaGrupoOcupacionalALAB_AtencionesEmergencia_FK1)
- `IdLugarEvento` → `dbo.EmergenciaLugarEvento.IdLugarEvento` (EmergenciaLugarEvento_AtencionesEmergencia_FK1)
- `IdPosicionLesionadoALAB` → `dbo.EmergenciaPosicionLesionadoALAB.IdPosicionLesionadoALAB` (EmergenciaPosicionLesionadoALAB_AtencionesEmergencia_FK1)
- `IdRelacionAgresorVictima` → `dbo.EmergenciaRelacionAgresorVictima.IdRelacionAgresorVictima` (EmergenciaRelacionAgresorVictima_AtencionesEmergencia_FK1)
- `IdSeguridad` → `dbo.EmergenciaSeguridad.IdSeguridad` (EmergenciaSeguridad_AtencionesEmergencia_FK1)
- `IdTipoAgenteAGAN` → `dbo.EmergenciaTipoAgenteAGAN.IdTipoAgenteAGAN` (EmergenciaTipoAgenteAGAN_AtencionesEmergencia_FK1)
- `IdTipoEvento` → `dbo.EmergenciaTipoEvento.IdTipoEvento` (EmergenciaTipoEvento_AtencionesEmergencia_FK1)
- `IdTipoTransporte` → `dbo.EmergenciaTipoTransporte.IdTipoTransporte` (EmergenciaTipoTransporte_AtencionesEmergencia_FK1)
- `IdTipoVehiculo` → `dbo.EmergenciaTipoVehiculo.IdTipoVehiculo` (EmergenciaTipoVehiculo_AtencionesEmergencia_FK1)
- `IdUbicacionLesionado` → `dbo.EmergenciaUbicacionLesionado.IdUbicacionLesionado` (EmergenciaUbicacionLesionado_AtencionesEmergencia_FK1)
- `IdAtencion` → `dbo.Atenciones.IdAtencion` (FK_AtencionesEmergencia_Atenciones)

### AtencionesEmerHosp

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdcuentaatencionE | int | sí |  |  |  |
| IdcuentaatencionH | int | sí |  |  |  |

### AtencionesEpisodiosCabecera

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| idPaciente | int | no |  |  | PK |
| idEpisodio | int | no |  |  | PK |
| FechaApertura | datetime | no |  |  |  |
| FechaCierre | datetime | sí |  |  |  |

### AtencionesEpisodiosDetalle

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| idPaciente | int | no |  |  | PK |
| idEpisodio | int | no |  |  | PK |
| idAtencion | int | no |  |  | PK |

Claves foráneas:

- `idAtencion` → `dbo.Atenciones.IdAtencion` (FK_AtencionesEpisodiosDetalle_Atenciones)
- `idEpisodio` → `dbo.AtencionesEpisodiosCabecera.idEpisodio` (FK_AtencionesEpisodiosDetalle_AtencionesEpisodiosCabecera)
- `idPaciente` → `dbo.AtencionesEpisodiosCabecera.idPaciente` (FK_AtencionesEpisodiosDetalle_AtencionesEpisodiosCabecera)

### AtencionesEstanciaHospitalaria

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdEstanciaHospitalaria | int | no | sí |  | PK |
| Secuencia | int | no |  |  |  |
| FechaOcupacion | datetime | no |  |  |  |
| HoraOcupacion | char(5) | no |  |  |  |
| FechaDesocupacion | datetime | sí |  |  |  |
| HoraDesocupacion | char(5) | sí |  |  |  |
| IdServicio | int | no |  |  |  |
| IdCama | int | sí |  |  |  |
| DiasEstancia | decimal(8,2) | sí |  |  |  |
| IdMedicoOrdena | int | sí |  |  |  |
| IdFacturacionServicio | int | sí |  |  |  |
| IdAtencion | int | sí |  |  |  |
| LlegoAlServicio | int | sí |  |  |  |
| idProducto | int | sí |  |  |  |
| IdMedicoOrdenaOrigen | int | sí |  |  |  |
| IdDiagnostico | int | sí |  |  |  |
| IdUsuarioAuditoria | int | sí |  |  |  |
| idSoporte | int | sí |  |  |  |
| FechaAsignacion | datetime | sí |  |  |  |

Claves foráneas:

- `idSoporte` → `dbo.TiposSoporteHosp.idSoporte` (FK_Atenciones_Soporte)
- `IdAtencion` → `dbo.Atenciones.IdAtencion` (FK_AtencionesEstanciaHospitalaria_Atenciones)
- `IdMedicoOrdenaOrigen` → `dbo.Medicos.IdMedico` (IdMedicoOrdenaOrigen_FK1)
- `IdMedicoOrdena` → `dbo.Medicos.IdMedico` (Medicos_OcupacionCamas_FK1)
- `IdServicio` → `dbo.Servicios.IdServicio` (Servicios_OcupacionCamas_FK1)

### AtencionesHijoMadre

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| idAtencion | int | no |  |  | PK |
| idAtencionMadre | int | sí |  |  |  |

### AtencionesMotivoEliminarAlta

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdAtencion | int | no |  |  | PK |
| motivo | varchar(1000) | sí |  |  |  |
| idusuario | int | sí |  |  |  |
| fecha | date | sí |  |  |  |

### AtencionesNacimientos

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdNacimiento | int | no | sí |  | PK |
| FechaNacimiento | datetime | no |  |  |  |
| EdadSemanas | int | no |  |  |  |
| Talla | float | no |  |  |  |
| Peso | float | no |  |  |  |
| IdTipoSexo | int | no |  |  |  |
| IdCondicionRN | int | no |  |  |  |
| IdAtencion | int | no |  |  |  |
| IdPacienteNacido | int | sí |  |  |  |
| apgar_1 | int | sí |  |  |  |
| apgar_5 | int | sí |  |  |  |
| Clamplaje | bit | sí |  |  |  |
| ClamplajeFecha | datetime | sí |  |  |  |
| NroOrdenHijoEnParto | int | sí |  |  |  |
| NroOrdenHijo | int | sí |  |  |  |
| docIdentidad | varchar(20) | sí |  |  |  |
| IdDocIdentidad | int | sí |  |  |  |

Claves foráneas:

- `IdAtencion` → `dbo.Atenciones.IdAtencion` (FK_AtencionesNacimientos_Atenciones)
- `IdCondicionRN` → `dbo.TiposCondicionRecienNacido.IdCondicionRN` (TiposCondicionRecienNacido_AtencionesNacimientos_FK1)
- `IdTipoSexo` → `dbo.TiposSexo.IdTipoSexo` (TiposSexo_Nacimientos_FK1)

### AtencionesSolicitudEspecialidades

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdSolicitudEspecialidad | int | no | sí |  | PK |
| IdAtencion | int | no |  |  |  |
| IdEspecialidad | int | no |  |  |  |
| IdUsuario | int | sí |  |  |  |
| IdEstado | bit | sí |  |  |  |
| motivo | varchar(500) | sí |  |  |  |
| IdDiagnostico | int | sí |  |  |  |

### AtencionesSolicitudTransfusion

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| idSolicitudTransfusion | int | no | sí |  | PK |
| idAtencion | int | no |  |  |  |
| idCuentaAtencion | int | no |  |  |  |
| idPaciente | int | no |  |  |  |
| servicioReceptor | varchar(200) | sí |  |  |  |
| salaReceptor | varchar(100) | sí |  |  |  |
| camaReceptor | varchar(50) | sí |  |  |  |
| transfusionesPrevias | bit | sí |  |  |  |
| reaccionesTransfusionesPrevias | varchar(500) | sí |  |  |  |
| embarazosPrevios | int | sí |  |  |  |
| abortosPrevios | int | sí |  |  |  |
| incompatibilidadMaternoFetal | bit | sí |  |  |  |
| diagnosticoEnfermedad | varchar(500) | sí |  |  |  |
| hb | decimal(5,2) | sí |  |  |  |
| hto | decimal(5,2) | sí |  |  |  |
| plaquetas | int | sí |  |  |  |
| sangreTotalUnidades | int | sí |  |  |  |
| paqueteGlobularUnidades | int | sí |  |  |  |
| plasmaFrescoCongeladoUnidades | int | sí |  |  |  |
| crioprecipitadoUnidades | int | sí |  |  |  |
| plasmaUnidades | int | sí |  |  |  |
| plaquetasUnidades | int | sí |  |  |  |
| pediatricasUnidades | int | sí |  |  |  |
| otroEspecifique | varchar(200) | sí |  |  |  |
| otroUnidades | int | sí |  |  |  |
| requisito | varchar(500) | sí |  |  |  |
| idMedico | int | sí |  |  |  |
| idUsuarioAuditoria | int | sí |  |  |  |
| grupoSanguineo | varchar(5) | sí |  |  |  |
| factorRh | varchar(5) | sí |  |  |  |
| fechaSolicitud | datetime | no |  | getdate() |  |

### AtencionLLamadas

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| id | int | no | sí |  | PK |
| idPaciente | int | sí |  |  |  |
| IdServicioIngreso | int | sí |  |  |  |
| idCuentaAtencion | int | sí |  |  |  |
| fechaLlamada | datetime | sí |  |  |  |
| FechaAtencion | datetime | sí |  |  |  |
| EstadoLLamada | int | sí |  |  |  |

### AtenHospCenso

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdRangoCensoHosp | int | no |  |  |  |
| RangoInicial | money | no |  |  |  |
| RangoFinal | money | no |  |  |  |
| RGBRojo | int | sí |  |  |  |
| RGBVerde | int | sí |  |  |  |
| RGBAzul | int | sí |  |  |  |

### AtenInteGrupo

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdAtenInteGrupo | int | no | sí |  | PK |
| AtencionIntegralGrupo | varchar(50) | no |  |  |  |
| DesdeAnio | int | no |  |  |  |
| DesdeMes | int | no |  |  |  |
| DesdeDia | int | no |  |  |  |
| HastaAnio | int | no |  |  |  |
| HastaMes | int | no |  |  |  |
| HastaDia | int | no |  |  |  |

### AtenInteGrupoHCPaciente

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdPaciente | int | no |  |  | PK |
| IdGrupoHCPaciente | int | no |  |  | PK |
| IdAtenInteGrupo | int | no |  |  |  |
| IdPregunta | int | no |  |  |  |

Claves foráneas:

- `IdAtenInteGrupo` → `dbo.AtenInteGrupo.IdAtenInteGrupo` (FK_AtenInteGrupoHCPaciente_AtenInteGrupo)
- `IdPregunta` → `dbo.AtenIntePregunta.IdPregunta` (FK_AtenInteGrupoHCPaciente_AtenIntePregunta)
- `IdPaciente` → `dbo.Pacientes.IdPaciente` (FK_AtenInteGrupoHCPaciente_Pacientes)

### AtenInteGrupoHCRespuestaPaciente

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdGrupoHCPaciente | int | no |  |  | PK |
| IdPaciente | int | no |  |  | PK |
| ItemRespuesta | int | no |  |  | PK |
| ValorTexto | varchar(255) | sí |  |  |  |
| ValorNumero | money | sí |  |  |  |
| ValorFecha | datetime | sí |  |  |  |
| ValorNumeroFin | money | sí |  |  |  |
| ValorFechaFin | datetime | sí |  |  |  |
| ValorEspecificacion | varchar(1500) | sí |  |  |  |
| EsActivo | bit | no |  | (1) |  |

Claves foráneas:

- `IdGrupoHCPaciente` → `dbo.AtenInteGrupoHCPaciente.IdGrupoHCPaciente` (FK_AtenInteGrupoHCRespuestaPaciente_AtenInteGrupoHCPaciente)
- `IdPaciente` → `dbo.AtenInteGrupoHCPaciente.IdPaciente` (FK_AtenInteGrupoHCRespuestaPaciente_AtenInteGrupoHCPaciente)

### AtenInteItemDesarrollo

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdItemDesarrollo | int | no | sí |  | PK |
| ItemDesarrollo | varchar(200) | no |  |  |  |

### AtenInteItemPlan

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdAtenInteItemPlan | int | no | sí |  | PK |
| ItemPlan | varchar(50) | no |  |  |  |

### AtenInteItemPlanCrecimiento

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdItemPlanCrecimiento | bigint | no | sí |  | PK |
| IdPlanAtencion | int | no |  |  |  |
| NumeroSesion | int | no |  |  |  |

Claves foráneas:

- `IdPlanAtencion` → `dbo.AtenIntePlanAtencion.IdPlanAtencion` (FK_AtenInteItemPlanCrecimiento_AtenIntePlanAtencion)

### AtenInteItemPlanDesarrollo

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdItemPlanDesarrollo | bigint | no | sí |  | PK |
| IdPlanAtencion | int | no |  |  |  |
| NumeroSesion | int | no |  |  |  |

Claves foráneas:

- `IdPlanAtencion` → `dbo.AtenIntePlanAtencion.IdPlanAtencion` (FK_AtenItemPlanDesarrollo_AtenIntePlanAtencion)

### AtenInteItemPlanProcedimiento

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdItemPlanProcedimiento | bigint | no | sí |  | PK |
| IdPlanAtencion | int | no |  |  |  |
| IdProducto | int | no |  |  |  |
| NumeroDosis | tinyint | no |  |  |  |
| IdAtenInteItemPlan | int | no |  |  |  |
| IdDiagnostico | int | sí |  |  |  |

Claves foráneas:

- `IdAtenInteItemPlan` → `dbo.AtenInteItemPlan.IdAtenInteItemPlan` (FK_AtenInteItemPlanInmunizacion_AtenInteItemPlan)
- `IdPlanAtencion` → `dbo.AtenIntePlanAtencion.IdPlanAtencion` (FK_AtenInteItemPlanInmunizacion_AtenIntePlanAtencion)
- `IdProducto` → `dbo.FactCatalogoServicios.IdProducto` (FK_AtenInteItemPlanInmunizacion_FactCatalogoServicios)

### AtenInteItemPlanSuplemento

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| ItemPlanSuplemento | bigint | no | sí |  | PK |
| IdPlanAtencion | int | no |  |  |  |
| IdProducto | int | no |  |  |  |
| NumeroDosis | int | sí |  |  |  |
| IdDiagnostico | int | sí |  |  |  |

Claves foráneas:

- `IdPlanAtencion` → `dbo.AtenIntePlanAtencion.IdPlanAtencion` (FK_AtenInteItemPlanSuplemento_AtenIntePlanAtencion)
- `IdProducto` → `dbo.FactCatalogoBienesInsumos.IdProducto` (FK_AtenInteItemPlanSuplemento_FactCatalogoBienesInsumos)

### AtenIntePlanAtencion

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdPlanAtencion | int | no | sí |  | PK |
| IdAtenInteGrupo | int | no |  |  |  |
| IdPeriodoTiempo | int | no |  |  |  |
| EdadAnio | int | no |  |  |  |
| EdadMes | int | no |  |  |  |
| EdadDia | int | no |  |  |  |
| Descripcion | varchar(30) | no |  |  |  |

Claves foráneas:

- `IdAtenInteGrupo` → `dbo.AtenInteGrupo.IdAtenInteGrupo` (FK_AtenIntePlanAtencion_AtenInteGrupo)
- `IdPeriodoTiempo` → `dbo.PeriodoTiempo.IdPeriodoTiempo` (FK_AtenIntePlanAtencion_PeriodoTiempo)

### AtenIntePlanCrecDetalle

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdItemPlanCrecimiento | bigint | no |  |  | PK |
| IdTriajeVariable | int | no |  |  | PK |
| OrdenItem | int | no |  |  |  |

Claves foráneas:

- `IdItemPlanCrecimiento` → `dbo.AtenInteItemPlanCrecimiento.IdItemPlanCrecimiento` (FK_AtenIntePlanCrecDetalle_AtenInteItemPlanCrecimiento)

### AtenIntePlanCrecimientoPaciente

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdPlanCrecimientoPaciente | int | no |  |  | PK |
| IdPlanIntegralPaciente | bigint | no |  |  | PK |
| IdPlanAtencion | int | no |  |  |  |
| IdAtenInteItemPlan | int | no |  |  |  |
| FechaProgramada | datetime | no |  |  |  |
| FechaEjecucion | datetime | sí |  |  |  |
| NumeroSesion | int | no |  |  |  |
| IdAtencion | int | sí |  |  |  |
| IdEstablecimiento | int | sí |  |  |  |

Claves foráneas:

- `IdAtencion` → `dbo.Atenciones.IdAtencion` (FK_AtenIntePlanCrecimientoPaciente_Atenciones)
- `IdAtenInteItemPlan` → `dbo.AtenInteItemPlan.IdAtenInteItemPlan` (FK_AtenIntePlanCrecimientoPaciente_AtenInteItemPlan)
- `IdPlanAtencion` → `dbo.AtenIntePlanAtencion.IdPlanAtencion` (FK_AtenIntePlanCrecimientoPaciente_AtenIntePlanAtencion)
- `IdEstablecimiento` → `dbo.Establecimientos.IdEstablecimiento` (FK_AtenIntePlanCrecimientoPaciente_Establecimientos)

### AtenIntePlanCrecPacienteDet

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdPlanCrecimientoPaciente | int | no |  |  | PK |
| IdPlanIntegralPaciente | bigint | no |  |  | PK |
| IdTriajeVariable | int | no |  |  | PK |
| VariableValor | money | no |  |  |  |
| OrdenItem | int | no |  |  |  |

Claves foráneas:

- `IdPlanCrecimientoPaciente` → `dbo.AtenIntePlanCrecimientoPaciente.IdPlanCrecimientoPaciente` (FK_AtenIntePlanCrecPacienteDet_AtenIntePlanCrecimientoPaciente)
- `IdPlanIntegralPaciente` → `dbo.AtenIntePlanCrecimientoPaciente.IdPlanIntegralPaciente` (FK_AtenIntePlanCrecPacienteDet_AtenIntePlanCrecimientoPaciente)

### AtenIntePlanDesarrolloPaciente

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdPlanDesarrolloPaciente | int | no |  |  | PK |
| IdPlanIntegralPaciente | bigint | no |  |  | PK |
| Evaluacion | int | sí |  |  |  |
| IdPlanAtencion | int | no |  |  |  |
| IdAtenInteItemPlan | int | no |  |  |  |
| FechaProgramada | datetime | no |  |  |  |
| FechaEjecucion | datetime | sí |  |  |  |
| NumeroSesion | int | no |  |  |  |
| IdAtencion | int | sí |  |  |  |
| IdEstablecimiento | int | sí |  |  |  |

Claves foráneas:

- `IdAtencion` → `dbo.Atenciones.IdAtencion` (FK_AtenIntePlanDesarrolloPaciente_Atenciones)
- `IdAtenInteItemPlan` → `dbo.AtenInteItemPlan.IdAtenInteItemPlan` (FK_AtenIntePlanDesarrolloPaciente_AtenInteItemPlan)
- `IdPlanAtencion` → `dbo.AtenIntePlanAtencion.IdPlanAtencion` (FK_AtenIntePlanDesarrolloPaciente_AtenIntePlanAtencion)
- `IdPlanIntegralPaciente` → `dbo.AtenIntePlanIntegralPaciente.IdPlanIntegralPaciente` (FK_AtenIntePlanDesarrolloPaciente_AtenIntePlanIntegralPaciente)
- `IdEstablecimiento` → `dbo.Establecimientos.IdEstablecimiento` (FK_AtenIntePlanDesarrolloPaciente_Establecimientos)

### AtenIntePlanDesDetalle

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdItemPlanDesarrollo | bigint | no |  |  | PK |
| IdItemDesarrollo | int | no |  |  | PK |
| OrdenItem | int | no |  |  |  |

Claves foráneas:

- `IdItemDesarrollo` → `dbo.AtenInteItemDesarrollo.IdItemDesarrollo` (FK_AtenIntePlanDesDetalle_AtenInteItemDesarrollo)
- `IdItemPlanDesarrollo` → `dbo.AtenInteItemPlanDesarrollo.IdItemPlanDesarrollo` (FK_AtenIntePlanDesDetalle_AtenInteItemPlanDesarrollo)

### AtenIntePlanDesPacienteDet

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdPlanDesarrolloPaciente | int | no |  |  | PK |
| IdPlanIntegralPaciente | bigint | no |  |  | PK |
| IdItemDesarrollo | int | no |  |  | PK |
| OrdenItem | int | no |  |  |  |
| EjecutaAccion | bit | sí |  |  |  |

Claves foráneas:

- `IdItemDesarrollo` → `dbo.AtenInteItemDesarrollo.IdItemDesarrollo` (FK_AtenIntePlanDesPacienteDet_AtenInteItemDesarrollo)
- `IdPlanDesarrolloPaciente` → `dbo.AtenIntePlanDesarrolloPaciente.IdPlanDesarrolloPaciente` (FK_AtenIntePlanDesPacienteDet_AtenIntePlanDesarrolloPaciente)
- `IdPlanIntegralPaciente` → `dbo.AtenIntePlanDesarrolloPaciente.IdPlanIntegralPaciente` (FK_AtenIntePlanDesPacienteDet_AtenIntePlanDesarrolloPaciente)

### AtenIntePlanIntegralPaciente

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdPlanIntegralPaciente | bigint | no | sí |  | PK |
| IdAtenInteGrupo | int | no |  |  |  |
| IdPaciente | int | no |  |  |  |
| FechaElaboracion | datetime | no |  |  |  |

Claves foráneas:

- `IdAtenInteGrupo` → `dbo.AtenInteGrupo.IdAtenInteGrupo` (FK_AtenIntePlanIntegralPaciente_AtenInteGrupo)
- `IdPaciente` → `dbo.Pacientes.IdPaciente` (FK_AtenIntePlanIntegralPaciente_Pacientes)

### AtenIntePlanItemElaborado

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdAtenInteItemPlan | int | no |  |  | PK |
| IdPlanIntegralPaciente | bigint | no |  |  | PK |
| EsElaborado | bit | no |  |  |  |

Claves foráneas:

- `IdAtenInteItemPlan` → `dbo.AtenInteItemPlan.IdAtenInteItemPlan` (FK_AtenIntePlanItemElaborado_AtenInteItemPlan)
- `IdPlanIntegralPaciente` → `dbo.AtenIntePlanIntegralPaciente.IdPlanIntegralPaciente` (FK_AtenIntePlanItemElaborado_AtenIntePlanIntegralPaciente)

### AtenIntePlanProcedimientoPaciente

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdPlanProcedimientoPaciente | int | no |  |  | PK |
| IdPlanIntegralPaciente | bigint | no |  |  | PK |
| IdProducto | int | no |  |  |  |
| IdPlanAtencion | int | sí |  |  |  |
| IdAtenInteItemPlan | int | no |  |  |  |
| FechaProgramada | datetime | no |  |  |  |
| FechaEjecucion | datetime | sí |  |  |  |
| NumeroDosis | tinyint | no |  |  |  |
| CodigoHIS | varchar(7) | sí |  |  |  |
| IdAtencion | int | sí |  |  |  |
| IdEstablecimiento | int | sí |  |  |  |
| IdDiagnostico | int | sí |  |  |  |

Claves foráneas:

- `IdAtencion` → `dbo.Atenciones.IdAtencion` (FK_AtenIntePlanInmunizacionPaciente_Atenciones)
- `IdAtenInteItemPlan` → `dbo.AtenInteItemPlan.IdAtenInteItemPlan` (FK_AtenIntePlanInmunizacionPaciente_AtenInteItemPlan)
- `IdPlanAtencion` → `dbo.AtenIntePlanAtencion.IdPlanAtencion` (FK_AtenIntePlanInmunizacionPaciente_AtenIntePlanAtencion)
- `IdPlanIntegralPaciente` → `dbo.AtenIntePlanIntegralPaciente.IdPlanIntegralPaciente` (FK_AtenIntePlanInmunizacionPaciente_AtenIntePlanIntegralPaciente)
- `IdProducto` → `dbo.FactCatalogoServicios.IdProducto` (FK_AtenIntePlanInmunizacionPaciente_FactCatalogoServicios)
- `IdEstablecimiento` → `dbo.Establecimientos.IdEstablecimiento` (FK_AtenIntePlanProcedimientoPaciente_Establecimientos)

### AtenIntePlanSuplementoPaciente

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdPlanSuplementoPaciente | int | no |  |  | PK |
| IdPlanIntegralPaciente | bigint | no |  |  | PK |
| IdPlanAtencion | int | no |  |  |  |
| IdProducto | int | no |  |  |  |
| IdAtenInteItemPlan | int | no |  |  |  |
| FechaProgramada | datetime | no |  |  |  |
| FechaEjecucion | datetime | sí |  |  |  |
| NumeroDosis | int | no |  |  |  |
| IdAtencion | int | sí |  |  |  |
| IdEstablecimiento | int | sí |  |  |  |
| IdDiagnostico | int | sí |  |  |  |

Claves foráneas:

- `IdAtencion` → `dbo.Atenciones.IdAtencion` (FK_AtenIntePlanSuplementoPaciente_Atenciones)
- `IdAtenInteItemPlan` → `dbo.AtenInteItemPlan.IdAtenInteItemPlan` (FK_AtenIntePlanSuplementoPaciente_AtenInteItemPlan)
- `IdPlanAtencion` → `dbo.AtenIntePlanAtencion.IdPlanAtencion` (FK_AtenIntePlanSuplementoPaciente_AtenIntePlanAtencion)
- `IdPlanIntegralPaciente` → `dbo.AtenIntePlanIntegralPaciente.IdPlanIntegralPaciente` (FK_AtenIntePlanSuplementoPaciente_AtenIntePlanIntegralPaciente1)
- `IdEstablecimiento` → `dbo.Establecimientos.IdEstablecimiento` (FK_AtenIntePlanSuplementoPaciente_Establecimientos)
- `IdProducto` → `dbo.FactCatalogoBienesInsumos.IdProducto` (FK_AtenIntePlanSuplementoPaciente_FactCatalogoBienesInsumos)

### AtenIntePlantillaItemPlan

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdPlantillaItemPlan | int | no | sí |  | PK |
| IdAtenInteGrupo | int | no |  |  |  |
| IdAtenInteItemPlan | int | no |  |  |  |

Claves foráneas:

- `IdAtenInteGrupo` → `dbo.AtenInteGrupo.IdAtenInteGrupo` (FK_AtenIntePlantillaItemPlan_AtenInteGrupo)
- `IdAtenInteItemPlan` → `dbo.AtenInteItemPlan.IdAtenInteItemPlan` (FK_AtenIntePlantillaItemPlan_AtenInteItemPlan)

### AtenIntePregunta

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdPregunta | int | no | sí |  | PK |
| Pregunta | varchar(70) | no |  |  |  |
| TipoRespuesta | int | no |  |  |  |
| TipoValorRespuesta | int | no |  |  |  |

### AtenInteValorPeso

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdValorPeso | int | no | sí |  | PK |
| IdTipoSexo | int | no |  |  |  |
| EdadMeses | int | no |  |  |  |
| NroDesviacion | int | no |  |  |  |
| ValorPeso | money | no |  |  |  |

### AtenInteValorTalla

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdValorTalla | int | no | sí |  | PK |
| IdTipoSexo | int | no |  |  |  |
| EdadMeses | int | no |  |  |  |
| NroDesviacion | int | no |  |  |  |
| ValorTalla | money | no |  |  |  |

### Auditoria

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdAuditoria | int | no | sí |  | PK |
| FechaHora | datetime | no |  |  |  |
| Tabla | varchar(50) | no |  |  |  |
| IdRegistro | int | no |  |  |  |
| Accion | char(1) | no |  |  |  |
| IdEmpleado | int | sí |  |  |  |
| idListItem | int | sí |  |  |  |
| nombrePc | varchar(30) | sí |  |  |  |
| observaciones | varchar(100) | sí |  |  |  |

Claves foráneas:

- `IdEmpleado` → `dbo.Empleados.IdEmpleado` (Empleados_Auditoria_FK1)

### BackupClaveEmpleado

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdEmpleado | int | no |  |  | PK |
| ClaveAnterior | varchar(255) | sí |  |  |  |
| FechaBackup | datetime | sí |  | getdate() |  |
| Password_anterior | varchar(255) | sí |  |  |  |

### borrardespues

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| Idclasificacion | int | sí |  |  |  |
| Codigo | varchar(10) | sí |  |  |  |
| Nombre | int | sí |  |  |  |
| idtipo | int | sí |  |  |  |

### CA5RGA 2

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| N° | nvarchar(255) | sí |  |  |  |
| CodigoInterfaz | nvarchar(255) | sí |  |  |  |
| IdlTem | nvarchar(255) | sí |  |  |  |
| idProductoCpt | nvarchar(255) | sí |  |  |  |
| Código HEVES | nvarchar(255) | sí |  |  |  |
| Descripción  | nvarchar(255) | sí |  |  |  |
| Lo realiza Auna (SI/NO) | nvarchar(255) | sí |  |  |  |
| Cargar a Sistema | nvarchar(255) | sí |  |  |  |
| Código Infinity AUNA | nvarchar(255) | sí |  |  |  |
| Código Mic | nvarchar(255) | sí |  |  |  |
| LabGeneral
Microbiología | nvarchar(255) | sí |  |  |  |
| OrdenXresultado | nvarchar(255) | sí |  |  |  |
| Descripción Infiniry AUNA | nvarchar(255) | sí |  |  |  |
| idGrupo | nvarchar(255) | sí |  |  |  |
| TipoFila | nvarchar(255) | sí |  |  |  |
| Caracteres | nvarchar(255) | sí |  |  |  |
| idtemGrupo | nvarchar(255) | sí |  |  |  |
| SoloTexto | nvarchar(255) | sí |  |  |  |
| S | nvarchar(255) | sí |  |  |  |

### CajaCaja

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdCaja | int | no | sí |  | PK |
| Codigo | varchar(10) | no |  |  |  |
| Descripcion | varchar(250) | no |  |  |  |
| loginPC | varchar(50) | sí |  |  |  |
| ImpresoraDefault | varchar(50) | sí |  |  |  |
| Impresora2 | varchar(50) | sí |  |  |  |
| idTipoComprobante | int | sí |  |  |  |
| SerieImpresoraDefault | varchar(20) | sí |  |  |  |
| SerieImpresora2 | varchar(20) | sí |  |  |  |
| estadoCaja | int | sí |  |  |  |

### CajaCajeroSupervisor

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdCajeroSupervisor | int | no | sí |  | PK |
| IdTurno | int | no |  |  |  |

Claves foráneas:

- `IdTurno` → `dbo.CajaTurno.IdTurno` (FK_CajaCajeroSupervisor_CajaTurno)

### CajaComprobantesPago

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdComprobantePago | int | no | sí |  | PK |
| NroSerie | char(3) | sí |  |  |  |
| NroDocumento | char(7) | sí |  |  |  |
| RazonSocial | varchar(50) | sí |  |  |  |
| RUC | char(11) | sí |  |  |  |
| SubTotal | money | sí |  |  |  |
| IGV | money | sí |  |  |  |
| Total | money | no |  | (0) |  |
| FechaCobranza | datetime | sí |  |  |  |
| TipoCambio | money | sí |  |  |  |
| Observaciones | varchar(100) | sí |  |  |  |
| IdTipoComprobante | int | sí |  |  |  |
| IdCuentaAtencion | int | sí |  |  |  |
| IdEstadoComprobante | int | sí |  |  |  |
| IdGestionCaja | int | sí |  |  |  |
| IdTipoPago | int | sí |  |  |  |
| IdTipoOrden | int | sí |  |  |  |
| Dctos | money | sí |  |  |  |
| IdPaciente | int | sí |  |  |  |
| IdCajero | int | sí |  |  |  |
| idTurno | int | sí |  |  |  |
| idCaja | int | sí |  |  |  |
| idFormaPago | int | sí |  |  |  |
| idFarmacia | int | sí |  |  |  |
| Exoneraciones | money | sí |  |  |  |
| Adelantos | money | sí |  |  |  |
| idTipoFinanciamiento | int | sí |  | (1) |  |
| estadofacturador | int | sí |  |  |  |

Claves foráneas:

- `IdGestionCaja` → `dbo.CajaGestion.IdGestionCaja` (CajaLote_CajaDocumento_FK1)
- `IdTipoOrden` → `dbo.CajasTiposOrden.IdTipoOrden` (CajasTiposOrden_CajaComprobantesPago_FK1)
- `IdTipoComprobante` → `dbo.CajaTiposComprobante.IdTipoComprobante` (CajaTiposDocumento_CajaDocumento_FK1)
- `IdCuentaAtencion` → `dbo.FacturacionCuentasAtencion.IdCuentaAtencion` (CuentasAtencion_CajaDocumento_FK1)

### CajaDevoluciones

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| idDevolucion | int | no | sí |  | PK |
| idComprobantePago | int | no |  |  |  |
| montoDevuelto | money | no |  |  |  |
| montoTotal | money | no |  |  |  |
| fechaDevolucion | datetime | no |  |  |  |
| idUsuario | int | no |  |  |  |
| motivo | varchar(2000) | no |  |  |  |

Claves foráneas:

- `idComprobantePago` → `dbo.CajaComprobantesPago.IdComprobantePago` (FK__CajaDevol__idCom__058D6317)
- `idComprobantePago` → `dbo.CajaComprobantesPago.IdComprobantePago` (FK__CajaDevol__idCom__369320F4)

### CajaEstadosComprobante

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdEstadoComprobante | int | no |  |  | PK |
| Descripcion | varchar(20) | no |  |  |  |

### CajaGestion

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdGestionCaja | int | no | sí |  | PK |
| FechaApertura | datetime | sí |  |  |  |
| EstadoLote | char(1) | sí |  |  |  |
| IdCaja | int | sí |  |  |  |
| IdTurno | int | sí |  |  |  |
| FechaCierre | datetime | sí |  |  |  |
| TotalCobrado | char(10) | sí |  |  |  |
| IdCajero | int | sí |  |  |  |

Claves foráneas:

- `IdCaja` → `dbo.CajaCaja.IdCaja` (CajaCaja_CajaLote_FK1)
- `IdCajero` → `dbo.Empleados.IdEmpleado` (Empleados_CajaCajero_FK1)
- `IdTurno` → `dbo.CajaTurno.IdTurno` (FK_CajaGestion_CajaTurno)

### CajaNroDocumento

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdCaja | int | no |  |  | PK |
| IdTipoComprobante | int | no |  |  | PK |
| NroSerie | char(3) | no |  |  |  |
| NroDocumento | char(12) | no |  |  |  |
| NroDocumentoInicial | char(12) | sí |  |  |  |
| NroDocumentoFinal | char(12) | sí |  |  |  |
| SeImprime | bit | sí |  |  |  |

Claves foráneas:

- `IdCaja` → `dbo.CajaCaja.IdCaja` (CajaNroDocumento_CajaCaja_FK1)
- `IdTipoComprobante` → `dbo.CajaTiposComprobante.IdTipoComprobante` (CajaNroDocumento_CajaDocumento_FK2)

### CajasTiposOrden

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdTipoOrden | int | no |  |  | PK |
| Descripcion | varchar(20) | no |  |  |  |

### CajaTiposComprobante

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdTipoComprobante | int | no |  |  | PK |
| Descripcion | char(20) | sí |  |  |  |

### CajaTiposMoneda

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdTipoMoneda | int | no |  |  | PK |
| Descripcion | varchar(100) | sí |  |  |  |

### CajaTurno

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdTurno | int | no |  |  | PK |
| Descripcion | varchar(20) | no |  |  |  |

### CalificacionContraReferencia

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| id_Calificacion_ContRef | int | sí |  |  |  |
| desc_Calificacion_ContRef | varchar(100) | sí |  |  |  |
| desc_abrevia_ContRef | varchar(2) | sí |  |  |  |

### Camas

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdCama | int | no | sí |  | PK |
| Codigo | char(5) | no |  |  |  |
| IdServicioPropietario | int | sí |  |  |  |
| IdServicioUbicacionActual | int | sí |  |  |  |
| IdTiposCama | int | sí |  |  |  |
| IdCondicionOcupacion | int | sí |  |  |  |
| IdEstadoCama | int | sí |  |  |  |
| IdPaciente | int | sí |  |  |  |
| X | int | sí |  |  |  |
| Y | int | sí |  |  |  |

Claves foráneas:

- `IdEstadoCama` → `dbo.EstadosCama.IdEstadoCama` (EstadosCama_Camas_FK1)
- `IdPaciente` → `dbo.Pacientes.IdPaciente` (Pacientes_Camas_FK1)
- `IdTiposCama` → `dbo.TiposCama.IdTipoCama` (TiposCama_Camas_FK1)
- `IdCondicionOcupacion` → `dbo.TiposCondicionOcupacion.IdCondicionOcupacion` (TiposCondicionOcupacion_Camas_FK1)

### camasMovimientos

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| idMovimiento | int | no | sí |  | PK |
| idCama | int | sí |  |  |  |
| idServicio | int | sí |  |  |  |
| FechaIngreso | datetime | sí |  |  |  |
| FechaSalida | datetime | sí |  |  |  |

Claves foráneas:

- `idCama` → `dbo.Camas.IdCama` (FK_camasMovimientos_Camas)

### Carga

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| N° | nvarchar(255) | sí |  |  |  |
| CodigoInterfaz | nvarchar(255) | sí |  |  |  |
| IdlTem | nvarchar(255) | sí |  |  |  |
| idProductoCpt | nvarchar(255) | sí |  |  |  |
| Código HEVES | nvarchar(255) | sí |  |  |  |
| Descripción  | nvarchar(255) | sí |  |  |  |
| Lo realiza Auna (SI/NO) | nvarchar(255) | sí |  |  |  |
| Cargar a Sistema | nvarchar(255) | sí |  |  |  |
| Código Infinity AUNA | nvarchar(255) | sí |  |  |  |
| Código Mic | nvarchar(255) | sí |  |  |  |
| LabGeneral
Microbiología | nvarchar(255) | sí |  |  |  |
| OrdenXresultado | nvarchar(255) | sí |  |  |  |
| Descripción Infiniry AUNA | nvarchar(255) | sí |  |  |  |
| idGrupo | nvarchar(255) | sí |  |  |  |
| TipoFila | nvarchar(255) | sí |  |  |  |
| Caracteres | nvarchar(255) | sí |  |  |  |
| idtemGrupo | nvarchar(255) | sí |  |  |  |
| SoloTexto | nvarchar(255) | sí |  |  |  |
| S | nvarchar(255) | sí |  |  |  |

### CARGA3

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| N° | nvarchar(255) | sí |  |  |  |
| CodigoInterfaz | nvarchar(255) | sí |  |  |  |
| IdlTem | nvarchar(255) | sí |  |  |  |
| idProductoCpt | nvarchar(255) | sí |  |  |  |
| Código HEVES | nvarchar(255) | sí |  |  |  |
| Descripción  | nvarchar(255) | sí |  |  |  |
| Lo realiza Auna (SI/NO) | nvarchar(255) | sí |  |  |  |
| Cargar a Sistema | nvarchar(255) | sí |  |  |  |
| Código Infinity AUNA | nvarchar(255) | sí |  |  |  |
| Código Mic | nvarchar(255) | sí |  |  |  |
| LabGeneral
Microbiología | nvarchar(255) | sí |  |  |  |
| OrdenXresultado | nvarchar(255) | sí |  |  |  |
| Descripción Infiniry AUNA | nvarchar(255) | sí |  |  |  |
| idGrupo | nvarchar(255) | sí |  |  |  |
| TipoFila | nvarchar(255) | sí |  |  |  |
| Caracteres | nvarchar(255) | sí |  |  |  |
| idtemGrupo | nvarchar(255) | sí |  |  |  |
| SoloTexto | nvarchar(255) | sí |  |  |  |
| S | nvarchar(255) | sí |  |  |  |

### CARGA4

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| N° | nvarchar(255) | sí |  |  |  |
| CodigoInterfaz | nvarchar(255) | sí |  |  |  |
| IdlTem | nvarchar(255) | sí |  |  |  |
| idProductoCpt | nvarchar(255) | sí |  |  |  |
| Código HEVES | nvarchar(255) | sí |  |  |  |
| Descripción  | nvarchar(255) | sí |  |  |  |
| Lo realiza Auna (SI/NO) | nvarchar(255) | sí |  |  |  |
| Cargar a Sistema | nvarchar(255) | sí |  |  |  |
| Código Infinity AUNA | nvarchar(255) | sí |  |  |  |
| Código Mic | nvarchar(255) | sí |  |  |  |
| LabGeneral
Microbiología | nvarchar(255) | sí |  |  |  |
| OrdenXresultado | nvarchar(255) | sí |  |  |  |
| Descripción Infiniry AUNA | nvarchar(255) | sí |  |  |  |
| idGrupo | nvarchar(255) | sí |  |  |  |
| TipoFila | nvarchar(255) | sí |  |  |  |
| Caracteres | nvarchar(255) | sí |  |  |  |
| idtemGrupo | nvarchar(255) | sí |  |  |  |
| SoloTexto | nvarchar(255) | sí |  |  |  |
| S | nvarchar(255) | sí |  |  |  |

### CartaGarantia

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| idCartaGarantia | int | no | sí |  | PK |
| NroCarta | varchar(30) | sí |  |  |  |
| NroAmpliacion | varchar(5) | sí |  |  |  |
| idPaciente | int | sí |  |  |  |
| idSubtipoFinanciamiento | int | sí |  |  |  |
| idFuenteFinanciamiento | int | sí |  |  |  |
| IdTipoFinanciamiento | int | sí |  |  |  |
| idAseguradora | int | sí |  |  |  |
| FechaCarta | date | sí |  |  |  |
| FechaInicioVigencia | date | sí |  |  |  |
| FechaFinVigencia | date | sí |  |  |  |
| NroSiniestro | varchar(10) | sí |  |  |  |
| NroPlaca | varchar(10) | sí |  |  |  |
| Referencia | varchar(100) | sí |  |  |  |
| Asegurado | varchar(50) | sí |  |  |  |
| Poliza | varchar(20) | sí |  |  |  |
| MontoCarta | decimal(10,2) | sí |  |  |  |
| PorcentajeCopago | decimal(10,2) | sí |  |  |  |
| MontoCopago | decimal(10,2) | sí |  |  |  |
| Observacion | varchar(200) | sí |  |  |  |
| idEstado | int | sí |  |  |  |

Claves foráneas:

- `idAseguradora` → `dbo.Aseguradora.idAseguradora` (FK_CartaGarantia_Aseguradora)

### CartaGarantiaDiagnostico

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdCartaGarantiaDiagnostico | int | no | sí |  | PK |
| IdAtencion | int | no |  |  |  |
| idCartaGarantia | int | no |  |  |  |
| IdClasificacionDx | int | no |  |  |  |
| IdDiagnostico | int | sí |  |  |  |
| IdSubclasificacionDx | int | sí |  |  |  |
| labConfHIS | varchar(3) | sí |  |  |  |
| GrupoHIS | int | sí |  |  |  |
| SubGrupoHIS | int | sí |  |  |  |
| sg_Log_Cre_feh | datetime | sí |  |  |  |
| sg_log_Cre_Usuario | int | sí |  |  |  |

Claves foráneas:

- `idCartaGarantia` → `dbo.CartaGarantia.idCartaGarantia` (FK_CartaGarantiaDiagnostico_CartaGarantia)

### CartaGarantiaPtos

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| idPuntoCarga | int | no |  |  | PK |
| idCartaGarantia | int | no |  |  | PK |
| EsPreVenta | bit | sí |  |  |  |
| sg_Log_Cre_feh | datetime | sí |  |  |  |
| sg_log_Cre_Usuario | int | sí |  |  |  |

Claves foráneas:

- `idCartaGarantia` → `dbo.CartaGarantia.idCartaGarantia` (FK_CartaGarantiaPtos_CartaGarantia)

### Catalogo_NANDA

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdNANDA | int | no | sí |  | PK |
| Codigo | varchar(10) | no |  |  |  |
| Dominio | nvarchar(100) | sí |  |  |  |
| Clase | nvarchar(100) | sí |  |  |  |
| Diagnostico | nvarchar(250) | no |  |  |  |
| Definicion | nvarchar(max) | sí |  |  |  |
| EsActivo | bit | no |  | (1) |  |

### Catalogo_NIC

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdNIC | int | no | sí |  | PK |
| Codigo | varchar(10) | no |  |  |  |
| Intervencion | nvarchar(250) | no |  |  |  |
| Definicion | nvarchar(max) | sí |  |  |  |
| EsActivo | bit | no |  | (1) |  |

### Catalogo_NOC

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdNOC | int | no | sí |  | PK |
| Codigo | varchar(10) | no |  |  |  |
| Resultado | nvarchar(250) | no |  |  |  |
| Definicion | nvarchar(max) | sí |  |  |  |
| EscalaLikert | nvarchar(200) | sí |  |  |  |
| EsActivo | bit | no |  | (1) |  |

### CatalogoEstadoDiente

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| Codigo | nvarchar(50) | no |  |  | PK |
| Nombre | nvarchar(100) | no |  |  |  |
| Descripcion | nvarchar(250) | sí |  |  |  |

### CategoriaEstablecimiento

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| Idcategoria | int | sí |  |  |  |
| Codigo | int | sí |  |  |  |
| Nombre | varchar(150) | sí |  |  |  |

### CentrosCosto

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdCentroCosto | int | no | sí |  | PK |
| Codigo | varchar(20) | no |  |  |  |
| Descripcion | varchar(255) | no |  |  |  |
| sec_ejec | int | sí |  |  |  |
| abreviado_depend | varchar(255) | sí |  |  |  |
| sede | int | sí |  |  |  |
| pliego | varchar(5) | sí |  |  |  |
| tipo_depend | int | sí |  |  |  |
| estado | varchar(1) | sí |  |  |  |
| nro_personal | varchar(11) | sí |  |  |  |
| centro_padre | varchar(20) | sí |  |  |  |
| fecha_flag | datetime | sí |  |  |  |
| flag_gf | varchar(10) | sí |  |  |  |
| fecha_alta | datetime | sí |  |  |  |

### CentrosPoblados

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdCentroPoblado | int | no |  |  | PK |
| Nombre | varchar(50) | no |  |  |  |
| IdDistrito | int | no |  |  |  |

Claves foráneas:

- `IdDistrito` → `dbo.Distritos.IdDistrito` (Distritos_CentrosPoblados_FK1)

### CentrosSubCosto

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdCentrosubCosto | int | no | sí |  | PK |
| Codigo | varchar(20) | no |  |  |  |
| CodigoCentroCosto | varchar(20) | no |  |  |  |
| Descripcion | varchar(255) | no |  |  |  |

### CentrosSubtrasCosto

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdCentrosSubtrasCosto | int | no | sí |  | PK |
| Codigo | varchar(20) | no |  |  |  |
| IdCentrosubCosto | varchar(20) | no |  |  |  |
| Descripcion | varchar(255) | no |  |  |  |

### Citas

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdCita | int | no | sí |  | PK |
| Fecha | datetime | no |  |  |  |
| HoraInicio | char(5) | no |  |  |  |
| HoraFin | char(5) | no |  |  |  |
| IdPaciente | int | no |  |  |  |
| IdEstadoCita | int | no |  |  |  |
| IdAtencion | int | no |  |  |  |
| IdMedico | int | no |  |  |  |
| IdEspecialidad | int | no |  |  |  |
| IdServicio | int | no |  |  |  |
| IdProgramacion | int | no |  |  |  |
| IdProducto | int | sí |  |  |  |
| FechaSolicitud | datetime | no |  | getdate() |  |
| HoraSolicitud | char(5) | no |  | '1' |  |
| EsCitaAdicional | bit | sí |  |  |  |
| FechaReferencia | varchar(12) | sí |  |  |  |
| TipoCita | int | sí |  |  |  |

Claves foráneas:

- `IdEspecialidad` → `dbo.Especialidades.IdEspecialidad` (Especialidades_Citas_FK1)
- `IdAtencion` → `dbo.Atenciones.IdAtencion` (FK_Citas_Atenciones)
- `IdMedico` → `dbo.Medicos.IdMedico` (Medicos_Citas_FK1)
- `IdPaciente` → `dbo.Pacientes.IdPaciente` (Pacientes_Citas_FK1)
- `IdProgramacion` → `dbo.ProgramacionMedica.IdProgramacion` (ProgramacionMedica_Citas_FK1)
- `IdServicio` → `dbo.Servicios.IdServicio` (Servicios_Citas_FK1)
- `IdEstadoCita` → `dbo.TiposEstadosCita.IdEstadoCita` (TiposEstadosCita_Citas_FK1)

### CitasBloqueadas

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdCitaBloqueada | int | no | sí |  | PK |
| IdUsuario | int | sí |  |  |  |
| Fecha | datetime | sí |  |  |  |
| HoraInicio | char(5) | sí |  |  |  |
| HoraFin | char(5) | sí |  |  |  |
| FechaBloqueo | datetime | sí |  |  |  |
| HoraBloqueo | char(5) | sí |  |  |  |
| IdMedico | int | sí |  |  |  |

### ClasificacionDiagnosticos

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdClasificacionDx | int | no |  |  | PK |
| Descripcion | varchar(50) | no |  |  |  |

### ClasificacionEstablecimiento

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| Idclasificacion | int | sí |  |  |  |
| Codigo | int | sí |  |  |  |
| Nombre | varchar(250) | sí |  |  |  |

### Clavija

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| Id | int | no | sí |  | PK |
| OdontogramaVersionId | int | no |  |  |  |
| NumeroDiente | tinyint | no |  |  |  |
| Posicion | nvarchar(10) | no |  |  |  |
| Color | nvarchar(30) | sí |  |  |  |
| Metadata | nvarchar(max) | sí |  |  |  |
| Fecha_Creacion | datetime2 | no |  | getdate() |  |
| Usuario_Creacion | nvarchar(100) | sí |  |  |  |

Claves foráneas:

- `OdontogramaVersionId` → `dbo.OdontogramaVersion.Id` (FK_Clavija_Version)

### CoberturaPorFuenteFinanciamiento

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdFuenteFinanciamiento | int | no |  |  | PK |
| Cobertura | money | sí |  |  |  |
| Unidad | varchar(3) | sí |  |  |  |

Claves foráneas:

- `IdFuenteFinanciamiento` → `dbo.FuentesFinanciamiento.IdFuenteFinanciamiento` (FK__Cobertura__IdFue__5B228B93)

### ComponentesRecPostAnestesica

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdComponentesRecPostAnestesica | int | no |  |  | PK |
| Descripcion | nchar(100) | sí |  |  |  |
| EstadoReg | bit | sí |  |  |  |
| IdUsuario | int | sí |  |  |  |
| Estacion | nchar(50) | sí |  |  |  |
| FechaReg | datetime | sí |  |  |  |

### ComponentesTestAldrette

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdComponentesTestAldrette | int | no |  |  | PK |
| Descripcion | nchar(50) | sí |  |  |  |
| EstadoReg | bit | sí |  |  |  |
| IdUsuario | int | sí |  |  |  |
| Estacion | nchar(50) | sí |  |  |  |
| FechaReg | datetime | sí |  |  |  |

### ComponentesVentilacionMecanica

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdComponentesVentilacionMecanica | int | no |  |  | PK |
| Descripcion | nchar(200) | sí |  |  |  |
| EstadoReg | bit | sí |  |  |  |
| IdUsuario | int | sí |  |  |  |
| Estacion | nchar(50) | sí |  |  |  |
| FechaReg | datetime | sí |  |  |  |

### CondicionContraReferencia

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| id_condicion_ContRef | int | sí |  |  |  |
| desc_condicion_ContRef | varchar(100) | sí |  |  |  |
| desc_abrevia_ContRef | varchar(2) | sí |  |  |  |

### CondicionReferencia

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| id_condicion_ref | int | sí |  |  |  |
| desc_condicion_ref | varchar(100) | sí |  |  |  |
| desc_abrevia_ref | varchar(2) | sí |  |  |  |

### constancias

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| idConstancia | int | no | sí |  | PK |
| idAtencion | int | no |  |  |  |
| idPaciente | int | no |  |  |  |
| idResponsable | int | no |  |  |  |
| idServicio | int | no |  |  |  |
| idMedico | int | no |  |  |  |
| idTipoConstancia | int | no |  |  |  |
| fecha | datetime | no |  |  |  |
| pc | varchar(32) | no |  |  |  |
| recibo | varchar(20) | no |  |  |  |
| observaciones | text | sí |  |  |  |
| estadoConstancia | varchar(1) | no |  | (1) |  |

### ConstanciasEstado

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| idConstanciaEstado | int | no | sí |  | PK |
| Estado | char(20) | sí |  |  |  |

### ConstanciasTipo

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| idTipoConstancia | int | no |  |  |  |
| NombreConstancia | char(15) | no |  |  |  |

### Consulta

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| id_consulta | int | no | sí |  | PK |
| fecha_consulta | date | no |  |  |  |
| motivo | varchar(max) | no |  |  |  |
| diagnostico | varchar(max) | no |  |  |  |
| tratamiento | varchar(max) | no |  |  |  |
| observaciones | varchar(max) | sí |  |  |  |
| id_mascota | int | no |  |  |  |

Claves foráneas:

- `id_mascota` → `dbo.Mascota.id_mascota` (FK__Consulta__id_mas__73AF0D92)

### ConsultaAfiliadoSis

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdConsulta | int | no | sí |  | PK |
| FechaConsulta | datetime | no |  | getdate() |  |
| UsuarioConsulta | varchar(50) | sí |  |  |  |
| NroAutorizacion | varchar(50) | sí |  |  |  |
| IdError | varchar(10) | sí |  |  |  |
| Resultado | varchar(255) | sí |  |  |  |
| TipoDocumento | varchar(10) | sí |  |  |  |
| NroDocumento | varchar(20) | sí |  |  |  |
| ApePaterno | varchar(100) | sí |  |  |  |
| ApeMaterno | varchar(100) | sí |  |  |  |
| Nombres | varchar(150) | sí |  |  |  |
| FecAfiliacion | varchar(20) | sí |  |  |  |
| EESS | varchar(20) | sí |  |  |  |
| DescEESS | varchar(255) | sí |  |  |  |
| EESSUbigeo | varchar(20) | sí |  |  |  |
| DescEESSUbigeo | varchar(255) | sí |  |  |  |
| Regimen | varchar(10) | sí |  |  |  |
| TipoSeguro | varchar(10) | sí |  |  |  |
| DescTipoSeguro | varchar(100) | sí |  |  |  |
| Contrato | varchar(50) | sí |  |  |  |
| FecCaducidad | varchar(20) | sí |  |  |  |
| Estado | varchar(50) | sí |  |  |  |
| Tabla | varchar(20) | sí |  |  |  |
| Idnumreg | varchar(20) | sí |  |  |  |
| Genero | varchar(10) | sí |  |  |  |
| FecNacimiento | varchar(20) | sí |  |  |  |
| IdUbigeo | varchar(20) | sí |  |  |  |
| Disa | varchar(20) | sí |  |  |  |
| TipoFormato | varchar(20) | sí |  |  |  |
| NroContrato | varchar(50) | sí |  |  |  |
| Correlativo | varchar(20) | sí |  |  |  |
| IdPlan | varchar(20) | sí |  |  |  |
| IdGrupoPoblacional | varchar(20) | sí |  |  |  |
| MsgConfidencial | nvarchar(1000) | sí |  |  |  |

### consultas_api

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| id | int | no | sí |  | PK |
| usuario | varchar(100) | no |  |  |  |
| dni_consultado | varchar(8) | no |  |  |  |
| estado | varchar(50) | no |  |  |  |
| mensaje | text | sí |  |  |  |
| fecha | datetime | sí |  | getdate() |  |

### ControlTratamientoBaciloscopia

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdControlTratamiento | int | no | sí |  |  |
| Descripcion | varchar(50) | sí |  |  |  |

### CoronaTemporal

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| Id | int | no | sí |  | PK |
| OdontogramaVersionId | int | no |  |  |  |
| NumeroDiente | tinyint | no |  |  |  |
| Material | nvarchar(50) | sí |  |  |  |
| Color | nvarchar(30) | sí |  |  |  |
| Metadata | nvarchar(max) | sí |  |  |  |
| Fecha_Creacion | datetime2 | no |  | getdate() |  |
| Usuario_Creacion | nvarchar(100) | sí |  |  |  |

Claves foráneas:

- `OdontogramaVersionId` → `dbo.OdontogramaVersion.Id` (FK_CoronaTemporal_Version)

### CoronaV

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| Id | int | no | sí |  | PK |
| OdontogramaVersionId | int | no |  |  |  |
| NumeroDiente | tinyint | no |  |  |  |
| TipoCodigo | nvarchar(50) | sí |  |  |  |
| Material | nvarchar(50) | sí |  |  |  |
| Color | nvarchar(30) | sí |  |  |  |
| Metadata | nvarchar(max) | sí |  |  |  |
| Fecha_Creacion | datetime2 | no |  | getdate() |  |
| Usuario_Creacion | nvarchar(100) | sí |  |  |  |

Claves foráneas:

- `OdontogramaVersionId` → `dbo.OdontogramaVersion.Id` (FK_CoronaV_Version)

### CPT

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| codigoCPT | varchar(20) | sí |  |  |  |
| PrecioUnitario | money | sí |  |  |  |

### CptExcepcionesRecetasHIS

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdProducto | int | no |  |  | PK |

### CPTResultados

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdCPTdResultado | int | no | sí |  | PK |
| IdOrden | int | sí |  |  |  |
| IdProducto | int | sí |  |  |  |
| IdCuentaAtencion | int | sí |  |  |  |
| Resultados | varchar(1000) | sí |  |  |  |
| Observaciones | varchar(1000) | sí |  |  |  |
| IdUsuario | int | sí |  |  |  |
| Estacion | varchar(50) | sí |  |  |  |
| FechaReg | datetime | sí |  |  |  |

### CPTSis

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| codigo | varchar(20) | sí |  |  |  |
| nombre | varchar(255) | sí |  |  |  |
| PrecioUnitario | money | sí |  |  |  |

### CPTSis2017

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| codigo | varchar(20) | sí |  |  |  |
| PrecioUnitario | money | sí |  |  |  |

### CPTSOAT

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| codigo | varchar(20) | sí |  |  |  |
| PrecioUnitario | money | sí |  |  |  |

### CQxAccionesEnfermeriaURPADet

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdAccionesEnfermeriaURPADet | int | no | sí |  | PK |
| IdAccionesEnfermeria | int | no |  |  |  |
| IdRegistroEnfermeriaURPACab | int | no |  |  |  |
| Valor | bit | sí |  |  |  |
| EstadoReg | bit | sí |  |  |  |
| IdUsuario | int | sí |  |  |  |
| Estacion | nchar(50) | sí |  |  |  |
| FechaReg | datetime | sí |  |  |  |

Claves foráneas:

- `IdAccionesEnfermeria` → `dbo.TiposAccionesEnfermeria.IdAccionesEnfermeria` (FK__CQxAccion__IdAcc__21F03725)
- `IdAccionesEnfermeria` → `dbo.TiposAccionesEnfermeria.IdAccionesEnfermeria` (FK__CQxAccion__IdAcc__64F477E2)
- `IdRegistroEnfermeriaURPACab` → `dbo.CQxRegistroEnfermeriaURPACab.IdRegistroEnfermeriaURPACab` (FK__CQxAccion__IdReg__22E45B5E)
- `IdRegistroEnfermeriaURPACab` → `dbo.CQxRegistroEnfermeriaURPACab.IdRegistroEnfermeriaURPACab` (FK__CQxAccion__IdReg__65E89C1B)

### CQxAnestesiaDet

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdAnestesiaDet | int | no | sí |  | PK |
| IdRegistroAnestesiologiaCab | int | no |  |  |  |
| IdAnestesia | int | no |  |  |  |
| EstadoReg | bit | sí |  |  |  |
| IdUsuario | int | sí |  |  |  |
| Estacion | nchar(50) | sí |  |  |  |
| FechaReg | datetime | sí |  |  |  |

Claves foráneas:

- `IdAnestesia` → `dbo.TiposAnestesia.IdAnestesia` (FK__CQxAneste__IdAne__23D87F97)
- `IdAnestesia` → `dbo.TiposAnestesia.IdAnestesia` (FK__CQxAneste__IdAne__66DCC054)
- `IdRegistroAnestesiologiaCab` → `dbo.CQxRegistroAnestesiologiaCab.IdRegistroAnestesiologiaCab` (FK__CQxAneste__IdReg__75A609E5)

### CQxAnestesiaGeneralDet

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdAnestesiaGeneralDet | int | no | sí |  | PK |
| IdRegistroAnestesiologiaCab | int | no |  |  |  |
| IdAnestesiaGeneral | int | no |  |  |  |
| EstadoReg | bit | sí |  |  |  |
| IdUsuario | int | sí |  |  |  |
| Estacion | nchar(50) | sí |  |  |  |
| FechaReg | datetime | sí |  |  |  |

Claves foráneas:

- `IdAnestesiaGeneral` → `dbo.TiposAnestesiaGeneral.IdAnestesiaGeneral` (FK__CQxAneste__IdAne__25C0C809)
- `IdAnestesiaGeneral` → `dbo.TiposAnestesiaGeneral.IdAnestesiaGeneral` (FK__CQxAneste__IdAne__68C508C6)
- `IdRegistroAnestesiologiaCab` → `dbo.CQxRegistroAnestesiologiaCab.IdRegistroAnestesiologiaCab` (FK__CQxAneste__IdReg__79769AC9)

### CQxAnestesiaRegionalDet

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdAnestesiaRegionalDet | int | no | sí |  | PK |
| IdRegistroAnestesiologiaCab | int | no |  |  |  |
| IdTecnicaAnestesiaRegional | int | no |  |  |  |
| Valor | varchar(200) | sí |  |  |  |
| EstadoReg | bit | sí |  |  |  |
| IdUsuario | int | sí |  |  |  |
| Estacion | nchar(50) | sí |  |  |  |
| FechaReg | datetime | sí |  |  |  |

Claves foráneas:

- `IdRegistroAnestesiologiaCab` → `dbo.CQxRegistroAnestesiologiaCab.IdRegistroAnestesiologiaCab` (FK__CQxAneste__IdReg__16D1F386)
- `IdTecnicaAnestesiaRegional` → `dbo.TecnicaAnestesiaRegional.IdTecnicaAnestesiaRegional` (FK__CQxAneste__IdTec__299158ED)
- `IdTecnicaAnestesiaRegional` → `dbo.TecnicaAnestesiaRegional.IdTecnicaAnestesiaRegional` (FK__CQxAneste__IdTec__6C9599AA)

### CQxAntecedenteEnfermedades

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdAntecedenteEnfermedades | int | no |  |  | PK |
| Descripcion | nchar(60) | sí |  |  |  |
| Abreviatura | nchar(40) | sí |  |  |  |
| EstadoReg | bit | sí |  |  |  |
| IdUsuario | int | sí |  |  |  |
| Estacion | nchar(50) | sí |  |  |  |
| FechaReg | datetime | sí |  |  |  |

### CQxAntecedenteEnfermedadesDet

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdAntecedenteEnfermedadDet | int | no | sí |  | PK |
| IdAntecedenteEnfermedades | int | sí |  |  |  |
| IdPaciente | int | sí |  |  |  |
| EstadoReg | bit | sí |  |  |  |
| IdUsuario | int | sí |  |  |  |
| Estacion | nchar(50) | sí |  |  |  |
| FechaReg | datetime | sí |  |  |  |

Claves foráneas:

- `IdAntecedenteEnfermedades` → `dbo.CQxAntecedenteEnfermedades.IdAntecedenteEnfermedades` (FK__CQxAntece__IdAnt__2A857D26)
- `IdAntecedenteEnfermedades` → `dbo.CQxAntecedenteEnfermedades.IdAntecedenteEnfermedades` (FK__CQxAntece__IdAnt__6D89BDE3)
- `IdPaciente` → `dbo.Pacientes.IdPaciente` (FK__CQxAntece__IdPac__2B79A15F)
- `IdPaciente` → `dbo.Pacientes.IdPaciente` (FK__CQxAntece__IdPac__6E7DE21C)

### CQxAntecedenteHabitos

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdAntecedenteHabitos | int | no |  |  | PK |
| Descripcion | nchar(50) | sí |  |  |  |
| EstadoReg | bit | sí |  |  |  |
| IdUsuario | int | sí |  |  |  |
| Estacion | nchar(50) | sí |  |  |  |
| FechaReg | datetime | sí |  |  |  |

### CQxAntecedenteHabitosDet

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdAntecedenteHabitosDet | int | no | sí |  | PK |
| IdAntecedenteHabitos | int | sí |  |  |  |
| IdPaciente | int | sí |  |  |  |
| EstadoReg | bit | sí |  |  |  |
| IdUsuario | int | sí |  |  |  |
| Estacion | nchar(50) | sí |  |  |  |
| FechaReg | datetime | sí |  |  |  |

Claves foráneas:

- `IdAntecedenteHabitos` → `dbo.CQxAntecedenteHabitos.IdAntecedenteHabitos` (FK__CQxAntece__IdAnt__2C6DC598)
- `IdAntecedenteHabitos` → `dbo.CQxAntecedenteHabitos.IdAntecedenteHabitos` (FK__CQxAntece__IdAnt__6F720655)
- `IdPaciente` → `dbo.Pacientes.IdPaciente` (FK__CQxAntece__IdPac__2D61E9D1)
- `IdPaciente` → `dbo.Pacientes.IdPaciente` (FK__CQxAntece__IdPac__70662A8E)

### CQxAntecedentesDatosAdicionales

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdPaciente | int | no |  |  | PK |
| Alergias | varchar(1000) | sí |  |  |  |
| ENFERMEDADACTUAL | varchar(100) | sí |  |  |  |
| AntecedenteFamiliares | varchar(1000) | sí |  |  |  |
| Otros | varchar(1000) | sí |  |  |  |
| EstadoReg | bit | sí |  |  |  |
| IdUsuario | int | sí |  |  |  |
| Estacion | nchar(50) | sí |  |  |  |
| FechaReg | datetime | sí |  |  |  |

Claves foráneas:

- `IdPaciente` → `dbo.Pacientes.IdPaciente` (FK__CQxAntece__IdPac__59A8E9B5)

### CQxChequeoCirujanoCab

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdChequeoCirujanoCab | int | no | sí |  | PK |
| IdProgramacionSala | int | no |  |  |  |
| IdOrdenOperatoriaMQ | int | sí |  |  |  |
| IdMedico | int | sí |  |  |  |
| Edad | int | no |  |  |  |
| Fecha | datetime | no |  |  |  |
| IdDiagnostico | int | sí |  |  |  |
| NroChequeoCirujano | nchar(20) | sí |  |  |  |
| EstadoReg | bit | sí |  |  |  |
| IdUsuario | int | sí |  |  |  |
| Estacion | nchar(50) | sí |  |  |  |
| FechaReg | datetime | sí |  |  |  |

Claves foráneas:

- `IdMedico` → `dbo.Medicos.IdMedico` (FK__CQxCheque__IdMed__2F4A3243)
- `IdMedico` → `dbo.Medicos.IdMedico` (FK__CQxCheque__IdMed__724E7300)
- `IdProgramacionSala` → `dbo.CQxProgramacionSala.IdProgramacionSala` (FK__CQxCheque__IdPro__303E567C)
- `IdProgramacionSala` → `dbo.CQxProgramacionSala.IdProgramacionSala` (FK__CQxCheque__IdPro__73429739)

### CQxChequeoCirujanoDet

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdChequeoCirujanoDet | int | no | sí |  | PK |
| IdChequeoCirujano | int | no |  |  |  |
| IdChequeoCirujanoCab | int | no |  |  |  |
| SI | bit | sí |  |  |  |
| NO | bit | sí |  |  |  |
| No_Aplica | bit | sí |  |  |  |
| EstadoReg | bit | sí |  |  |  |
| IdUsuario | int | sí |  |  |  |
| Estacion | nchar(50) | sí |  |  |  |
| FechaReg | datetime | sí |  |  |  |

Claves foráneas:

- `IdChequeoCirujanoCab` → `dbo.CQxChequeoCirujanoCab.IdChequeoCirujanoCab` (FK__CQxCheque__IdChe__31327AB5)
- `IdChequeoCirujanoCab` → `dbo.CQxChequeoCirujanoCab.IdChequeoCirujanoCab` (FK__CQxCheque__IdChe__7436BB72)

### CQxChequeoEnfermeriaPreOperatoriaCab

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdChequeoEnfermeriaPreOperatoriaCab | int | no | sí |  | PK |
| IdProgramacionSala | int | no |  |  |  |
| IdOrdenOperatoriaMQ | int | sí |  |  |  |
| Fecha | datetime | sí |  |  |  |
| Hora | nchar(5) | sí |  |  |  |
| Peso | float | sí |  |  |  |
| Talla | float | sí |  |  |  |
| ICM | float | sí |  |  |  |
| Glucosa | nchar(15) | sí |  |  |  |
| NroChequeoEnfermeriaPreOperatoria | nchar(20) | sí |  |  |  |
| EstadoReg | bit | sí |  |  |  |
| IdUsuario | int | sí |  |  |  |
| Estacion | nchar(50) | sí |  |  |  |
| FechaReg | datetime | sí |  |  |  |

Claves foráneas:

- `IdProgramacionSala` → `dbo.CQxProgramacionSala.IdProgramacionSala` (FK__CQxCheque__IdPro__32269EEE)
- `IdProgramacionSala` → `dbo.CQxProgramacionSala.IdProgramacionSala` (FK__CQxCheque__IdPro__752ADFAB)

### CQxChequeoEnfermeriaPreOperatoriaDet

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdChequeoEnfermeriaPreOperatoriaDet | int | no | sí |  | PK |
| IdChequeoEnfermeriaPreOperatoria | int | no |  |  |  |
| IdChequeoEnfermeriaPreOperatoriaCab | int | no |  |  |  |
| SI | bit | sí |  |  |  |
| NO | bit | sí |  |  |  |
| NO_APLICA | bit | sí |  |  |  |
| Observacion | varchar(1000) | sí |  |  |  |
| EstadoReg | bit | sí |  |  |  |
| IdUsuario | int | sí |  |  |  |
| Estacion | nchar(50) | sí |  |  |  |
| FechaReg | datetime | sí |  |  |  |

Claves foráneas:

- `IdChequeoEnfermeriaPreOperatoria` → `dbo.TiposChequeoEnfermeriaPreOperatoria.IdChequeoEnfermeriaPreOperatoria` (FK__CQxCheque__IdChe__331AC327)
- `IdChequeoEnfermeriaPreOperatoria` → `dbo.TiposChequeoEnfermeriaPreOperatoria.IdChequeoEnfermeriaPreOperatoria` (FK__CQxCheque__IdChe__340EE760)
- `IdChequeoEnfermeriaPreOperatoria` → `dbo.CQxChequeoEnfermeriaPreOperatoriaCab.IdChequeoEnfermeriaPreOperatoriaCab` (FK__CQxCheque__IdChe__35030B99)
- `IdChequeoEnfermeriaPreOperatoria` → `dbo.TiposChequeoEnfermeriaPreOperatoria.IdChequeoEnfermeriaPreOperatoria` (FK__CQxCheque__IdChe__761F03E4)
- `IdChequeoEnfermeriaPreOperatoria` → `dbo.TiposChequeoEnfermeriaPreOperatoria.IdChequeoEnfermeriaPreOperatoria` (FK__CQxCheque__IdChe__7713281D)
- `IdChequeoEnfermeriaPreOperatoria` → `dbo.CQxChequeoEnfermeriaPreOperatoriaCab.IdChequeoEnfermeriaPreOperatoriaCab` (FK__CQxCheque__IdChe__78074C56)

### CQxComponentesRecPostAnestesicaDet

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdRecPostAnestesicaDet | int | no | sí |  | PK |
| IdComponentesRecPostAnestesica | int | no |  |  |  |
| IdRecuperacionPostAnestesicaCab | int | no |  |  |  |
| ValorIngreso | char(5) | sí |  |  |  |
| ValorEgreso | char(5) | sí |  |  |  |
| EstadoReg | bit | sí |  |  |  |
| IdUsuario | int | sí |  |  |  |
| Estacion | nchar(50) | sí |  |  |  |
| FechaReg | datetime | sí |  |  |  |

Claves foráneas:

- `IdComponentesRecPostAnestesica` → `dbo.ComponentesRecPostAnestesica.IdComponentesRecPostAnestesica` (FK__CQxCompon__IdCom__35F72FD2)
- `IdComponentesRecPostAnestesica` → `dbo.ComponentesRecPostAnestesica.IdComponentesRecPostAnestesica` (FK__CQxCompon__IdCom__78FB708F)
- `IdRecuperacionPostAnestesicaCab` → `dbo.CQxRecuperacionPostAnestesicaCab.IdRecuperacionPostAnestesicaCab` (FK__CQxCompon__IdRec__36EB540B)
- `IdRecuperacionPostAnestesicaCab` → `dbo.CQxRecuperacionPostAnestesicaCab.IdRecuperacionPostAnestesicaCab` (FK__CQxCompon__IdRec__79EF94C8)

### CQxCondicionIngresoURPADet

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdCondicionIngresoURPADet | int | no | sí |  | PK |
| IdCondicionIngresoURPA | int | no |  |  |  |
| IdRegistroEnfermeriaURPACab | int | no |  |  |  |
| Valor | nchar(10) | sí |  |  |  |
| EstadoReg | bit | sí |  |  |  |
| IdUsuario | int | sí |  |  |  |
| Estacion | nchar(50) | sí |  |  |  |
| FechaReg | datetime | sí |  |  |  |

Claves foráneas:

- `IdCondicionIngresoURPA` → `dbo.TiposCondicionIngresoURPA.IdCondicionIngresoURPA` (FK__CQxCondic__IdCon__37DF7844)
- `IdCondicionIngresoURPA` → `dbo.TiposCondicionIngresoURPA.IdCondicionIngresoURPA` (FK__CQxCondic__IdCon__7AE3B901)
- `IdRegistroEnfermeriaURPACab` → `dbo.CQxRegistroEnfermeriaURPACab.IdRegistroEnfermeriaURPACab` (FK__CQxCondic__IdReg__38D39C7D)
- `IdRegistroEnfermeriaURPACab` → `dbo.CQxRegistroEnfermeriaURPACab.IdRegistroEnfermeriaURPACab` (FK__CQxCondic__IdReg__7BD7DD3A)

### CQxConsentimientoInformadoCab

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdConsentimientoInformadoCab | int | no | sí |  | PK |
| IdPaciente | int | sí |  |  |  |
| Fecha | datetime | sí |  |  |  |
| EstadoReg | bit | sí |  |  |  |
| IdUsuario | int | sí |  |  |  |
| Estacion | nchar(50) | sí |  |  |  |
| FechaReg | datetime | sí |  |  |  |

### CQxConsentimientoInformadoDet

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdConsentimientoInformadoDet | int | no | sí |  | PK |
| IdConsentimientoInformadoCab | int | no |  |  |  |
| IdTiposConsentimientoInformado | int | no |  |  |  |
| Observacion | varchar(1000) | sí |  |  |  |
| IdOrdenOperatoria | int | sí |  |  |  |
| IdOrdenOperatoriaMQ | int | sí |  |  |  |
| IdMedico | int | sí |  |  |  |
| Fecha | datetime | sí |  |  |  |
| Hora | char(5) | sí |  |  |  |
| NroConsentimientoInformadoDet | nchar(15) | sí |  |  |  |
| EstadoReg | bit | sí |  |  |  |
| IdUsuario | int | sí |  |  |  |
| Estacion | nchar(50) | sí |  |  |  |
| FechaReg | datetime | sí |  |  |  |

Claves foráneas:

- `IdConsentimientoInformadoCab` → `dbo.CQxConsentimientoInformadoCab.IdConsentimientoInformadoCab` (FK__CQxConsen__IdCon__39C7C0B6)
- `IdConsentimientoInformadoCab` → `dbo.CQxConsentimientoInformadoCab.IdConsentimientoInformadoCab` (FK__CQxConsen__IdCon__7CCC0173)
- `IdMedico` → `dbo.Medicos.IdMedico` (FK__CQxConsen__IdMed__3ABBE4EF)
- `IdMedico` → `dbo.Medicos.IdMedico` (FK__CQxConsen__IdMed__7DC025AC)
- `IdOrdenOperatoria` → `dbo.CQxOrdenOperatoria.IdOrdenOperatoria` (FK__CQxConsen__IdOrd__249602F8)
- `IdTiposConsentimientoInformado` → `dbo.TiposConsentimientoInformado.IdTiposConsentimientoInformado` (FK__CQxConsen__IdTip__3CA42D61)
- `IdTiposConsentimientoInformado` → `dbo.TiposConsentimientoInformado.IdTiposConsentimientoInformado` (FK__CQxConsen__IdTip__7FA86E1E)

### CQxCorrelativo

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdCorrelativo | int | no |  |  | PK |
| Descripcion | varchar(100) | sí |  |  |  |
| Id | int | sí |  |  |  |
| Ids | int | sí |  |  |  |
| Valor | int | sí |  |  |  |
| EstadoReg | bit | sí |  |  |  |
| IdUsuario | int | sí |  |  |  |
| Estacion | nchar(50) | sí |  |  |  |
| FechaReg | datetime | sí |  |  |  |

### CQxDiagnosticoMedico

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdDiagnosticoMedico | int | no |  |  | PK |
| IdMedico | int | no |  |  |  |
| IdDiagnostico | int | no |  |  |  |
| EstadoReg | bit | sí |  |  |  |
| IdUsuario | int | sí |  |  |  |
| Estacion | nchar(50) | sí |  |  |  |
| FechaReg | datetime | sí |  |  |  |

Claves foráneas:

- `IdDiagnostico` → `dbo.Diagnosticos.IdDiagnostico` (FK__CQxDiagno__IdDia__009C9257)
- `IdDiagnostico` → `dbo.Diagnosticos.IdDiagnostico` (FK__CQxDiagno__IdDia__3D98519A)

### CQxDiagnosticoServicio

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdDiagnosticoServicio | int | no |  |  | PK |
| IdEspecialidad | int | no |  |  |  |
| IdDiagnostico | int | no |  |  |  |
| EstadoReg | bit | sí |  |  |  |
| IdUsuario | int | sí |  |  |  |
| Estacion | nchar(50) | sí |  |  |  |
| FechaReg | datetime | sí |  |  |  |

Claves foráneas:

- `IdDiagnostico` → `dbo.Diagnosticos.IdDiagnostico` (FK__CQxDiagno__IdDia__0284DAC9)
- `IdDiagnostico` → `dbo.Diagnosticos.IdDiagnostico` (FK__CQxDiagno__IdDia__3F809A0C)

### CQxEpicrisis

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdEpicrisis | int | no | sí |  | PK |
| IdProgramacionSala | int | no |  |  |  |
| IdOrdenOperatoriaMQ | int | sí |  |  |  |
| IdMedico | int | sí |  |  |  |
| Observaciones | varchar(2000) | sí |  |  |  |
| Fecha | datetime | sí |  |  |  |
| NroEpicrisis | nchar(20) | sí |  |  |  |
| EstadoReg | bit | sí |  |  |  |
| IdUsuario | int | sí |  |  |  |
| Estacion | nchar(50) | sí |  |  |  |
| FechaReg | datetime | sí |  |  |  |

Claves foráneas:

- `IdProgramacionSala` → `dbo.CQxProgramacionSala.IdProgramacionSala` (FK__CQxEpicri__IdPro__046D233B)
- `IdProgramacionSala` → `dbo.CQxProgramacionSala.IdProgramacionSala` (FK__CQxEpicri__IdPro__4168E27E)

### CQxEtapas

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdCQxEtapas | int | no |  |  | PK |
| Descripcion | varchar(50) | no |  |  |  |

### CQxEvaluacionPreAnestesicaCab

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdEvaluacionPreAnestesicaCab | int | no | sí |  | PK |
| IdProgramacionSala | int | no |  |  |  |
| IdOrdenOperatoriaMQ | int | sí |  |  |  |
| IdMedico | int | sí |  |  |  |
| IdAnestesiologo | int | sí |  |  |  |
| Fecha | datetime | sí |  |  |  |
| Hora | char(5) | sí |  |  |  |
| Efectiva | bit | sí |  |  |  |
| Emergencia | bit | sí |  |  |  |
| IdServicio | int | sí |  |  |  |
| UltimaIngestaAlimientos | datetime | sí |  |  |  |
| IdCama | int | sí |  |  |  |
| Indicaciones | varchar(1000) | sí |  |  |  |
| PlanAnestesico | varchar(1000) | sí |  |  |  |
| NroEvaluacionPreAnestesica | nchar(20) | sí |  |  |  |
| EstadoReg | bit | sí |  |  |  |
| IdUsuario | int | sí |  |  |  |
| Estacion | nchar(50) | sí |  |  |  |
| FechaReg | datetime | sí |  |  |  |
| HoraIngreso | varchar(10) | sí |  |  |  |

Claves foráneas:

- `IdProgramacionSala` → `dbo.CQxProgramacionSala.IdProgramacionSala` (FK__CQxEvalua__IdPro__05614774)
- `IdProgramacionSala` → `dbo.CQxProgramacionSala.IdProgramacionSala` (FK__CQxEvalua__IdPro__06556BAD)
- `IdProgramacionSala` → `dbo.CQxProgramacionSala.IdProgramacionSala` (FK__CQxEvalua__IdPro__425D06B7)
- `IdProgramacionSala` → `dbo.CQxProgramacionSala.IdProgramacionSala` (FK__CQxEvalua__IdPro__43512AF0)

### CQxExamenFisicoDet

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdExamenFisicoDet | int | no | sí |  | PK |
| IdEvaluacionPreAnestesicaCab | int | no |  |  |  |
| IdExamenFisico | int | no |  |  |  |
| Valor | varchar(1000) | no |  |  |  |
| EstadoReg | bit | sí |  |  |  |
| IdUsuario | int | sí |  |  |  |
| Estacion | nchar(50) | sí |  |  |  |
| FechaReg | datetime | sí |  |  |  |

### CQxIndicacionAltaCab

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdIndicacionAltaCab | int | no | sí |  | PK |
| IdProgramacionSala | int | no |  |  |  |
| IdOrdenOperatoriaMQ | int | sí |  |  |  |
| IdMedico | int | sí |  |  |  |
| Fecha | datetime | sí |  |  |  |
| Hora | char(5) | sí |  |  |  |
| NroIndicacionAlta | nchar(20) | sí |  |  |  |
| EstadoReg | bit | sí |  |  |  |
| IdUsuario | int | sí |  |  |  |
| Estacion | nchar(50) | sí |  |  |  |
| FechaReg | datetime | sí |  |  |  |

Claves foráneas:

- `IdProgramacionSala` → `dbo.CQxProgramacionSala.IdProgramacionSala` (FK__CQxIndica__IdPro__07498FE6)
- `IdProgramacionSala` → `dbo.CQxProgramacionSala.IdProgramacionSala` (FK__CQxIndica__IdPro__44454F29)

### CQxIndicacionAltaDet

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdndicacionAltaDet | int | no | sí |  | PK |
| IdIndicacionAlta | int | no |  |  |  |
| IdIndicacionAltaCab | int | no |  |  |  |
| Descripcion | varchar(2000) | sí |  |  |  |
| EstadoReg | bit | sí |  |  |  |
| IdUsuario | int | sí |  |  |  |
| Estacion | nchar(50) | sí |  |  |  |
| FechaReg | datetime | sí |  |  |  |

Claves foráneas:

- `IdIndicacionAltaCab` → `dbo.CQxIndicacionAltaCab.IdIndicacionAltaCab` (FK__CQxIndica__IdInd__083DB41F)
- `IdIndicacionAlta` → `dbo.GruposIndicacionAlta.IdIndicacionAlta` (FK__CQxIndica__IdInd__0931D858)
- `IdIndicacionAltaCab` → `dbo.CQxIndicacionAltaCab.IdIndicacionAltaCab` (FK__CQxIndica__IdInd__45397362)
- `IdIndicacionAlta` → `dbo.GruposIndicacionAlta.IdIndicacionAlta` (FK__CQxIndica__IdInd__462D979B)

### CQxInduccionAnestesiaDet

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdInduccionAnestesiaDet | int | no | sí |  | PK |
| IdRegistroAnestesiologiaCab | int | no |  |  |  |
| IdInduccionAnestesia | int | no |  |  |  |
| EstadoReg | bit | sí |  |  |  |
| IdUsuario | int | sí |  |  |  |
| Estacion | nchar(50) | sí |  |  |  |
| FechaReg | datetime | sí |  |  |  |

Claves foráneas:

- `IdRegistroAnestesiologiaCab` → `dbo.CQxRegistroAnestesiologiaCab.IdRegistroAnestesiologiaCab` (FK__CQxInducc__IdReg__11191A30)

### CQxMantenimientoAnestesia

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdMantenimientoAnestesia | int | no | sí |  | PK |
| IdRegistroAnestesiologiaCab | int | no |  |  |  |
| Satisfactorio | bit | sí |  |  |  |
| No_Satisfactorio | bit | sí |  |  |  |
| EstadoReg | bit | sí |  |  |  |
| IdUsuario | int | sí |  |  |  |
| Estacion | nchar(50) | sí |  |  |  |
| FechaReg | datetime | sí |  |  |  |

### CQxMonitoreoInvasivoDet

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdMonitoreoInvasivoDet | int | no | sí |  | PK |
| IdMonitoreoInvasivo | int | no |  |  |  |
| IdRecuperacionPostAnestesicaCab | int | no |  |  |  |
| Valor | varchar(500) | sí |  |  |  |
| EstadoReg | bit | sí |  |  |  |
| IdUsuario | int | sí |  |  |  |
| Estacion | nchar(50) | sí |  |  |  |
| FechaReg | datetime | sí |  |  |  |

Claves foráneas:

- `IdMonitoreoInvasivo` → `dbo.TiposMonitoreoInvasivo.IdMonitoreoInvasivo` (FK__CQxMonito__IdMon__0B1A20CA)
- `IdMonitoreoInvasivo` → `dbo.TiposMonitoreoInvasivo.IdMonitoreoInvasivo` (FK__CQxMonito__IdMon__4815E00D)
- `IdRecuperacionPostAnestesicaCab` → `dbo.CQxRecuperacionPostAnestesicaCab.IdRecuperacionPostAnestesicaCab` (FK__CQxMonito__IdRec__0C0E4503)
- `IdRecuperacionPostAnestesicaCab` → `dbo.CQxRecuperacionPostAnestesicaCab.IdRecuperacionPostAnestesicaCab` (FK__CQxMonito__IdRec__0D02693C)
- `IdRecuperacionPostAnestesicaCab` → `dbo.CQxRecuperacionPostAnestesicaCab.IdRecuperacionPostAnestesicaCab` (FK__CQxMonito__IdRec__0DF68D75)
- `IdRecuperacionPostAnestesicaCab` → `dbo.CQxRecuperacionPostAnestesicaCab.IdRecuperacionPostAnestesicaCab` (FK__CQxMonito__IdRec__490A0446)
- `IdRecuperacionPostAnestesicaCab` → `dbo.CQxRecuperacionPostAnestesicaCab.IdRecuperacionPostAnestesicaCab` (FK__CQxMonito__IdRec__49FE287F)
- `IdRecuperacionPostAnestesicaCab` → `dbo.CQxRecuperacionPostAnestesicaCab.IdRecuperacionPostAnestesicaCab` (FK__CQxMonito__IdRec__4AF24CB8)

### CQxOperacionSuspendidasCab

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdSuspensionOperacionCab | int | no | sí |  | PK |
| IdProgramacionSala | int | no |  |  |  |
| IdOrdenOperatoriaMQ | int | sí |  |  |  |
| IdMedico | int | sí |  |  |  |
| IdAnestesiologo | int | sí |  |  |  |
| IdEnfermera | int | sí |  |  |  |
| IdServicio | int | sí |  |  |  |
| HoraProg | char(5) | sí |  |  |  |
| HoraSusp | char(5) | sí |  |  |  |
| NroOperacionSuspendida | nchar(20) | sí |  |  |  |
| EstadoReg | int | sí |  |  |  |
| FechaReg | datetime | sí |  |  |  |
| IdUsuario | int | sí |  |  |  |
| Estacion | nchar(50) | sí |  |  |  |

Claves foráneas:

- `IdProgramacionSala` → `dbo.CQxProgramacionSala.IdProgramacionSala` (FK__CQxOperac__IdPro__0EEAB1AE)
- `IdProgramacionSala` → `dbo.CQxProgramacionSala.IdProgramacionSala` (FK__CQxOperac__IdPro__4BE670F1)

### CQxOperacionSuspendidasDet

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdCausaSuspensionOperacionDet | int | no | sí |  | PK |
| IdCausaSuspensionOperacion | int | no |  |  |  |
| IdSuspensionOperacionCab | int | no |  |  |  |
| Valor | bit | sí |  |  |  |
| Observacion | varchar(1000) | sí |  |  |  |
| EstadoReg | bit | sí |  |  |  |
| IdUsuario | int | sí |  |  |  |
| Estacion | nchar(50) | sí |  |  |  |
| FechaReg | datetime | sí |  |  |  |

Claves foráneas:

- `IdCausaSuspensionOperacion` → `dbo.TiposCausaSuspensionOperacion.IdCausaSuspensionOperacion` (FK__CQxOperac__IdCau__0FDED5E7)
- `IdCausaSuspensionOperacion` → `dbo.TiposCausaSuspensionOperacion.IdCausaSuspensionOperacion` (FK__CQxOperac__IdCau__4CDA952A)
- `IdSuspensionOperacionCab` → `dbo.CQxOperacionSuspendidasCab.IdSuspensionOperacionCab` (FK__CQxOperac__IdSus__10D2FA20)
- `IdSuspensionOperacionCab` → `dbo.CQxOperacionSuspendidasCab.IdSuspensionOperacionCab` (FK__CQxOperac__IdSus__4DCEB963)

### CQxOrdenOperatoria

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdOrdenOperatoria | int | no | sí |  | PK |
| IdPaciente | int | no |  |  |  |
| IdMedico | int | sí |  |  |  |
| IdGravedad | int | sí |  |  |  |
| IdServicio | int | sí |  |  |  |
| Fecha | datetime | sí |  |  |  |
| Hora | char(5) | sí |  |  |  |
| Admitido | bit | sí |  |  |  |
| FechaEstimadaQx | datetime | sí |  |  |  |
| Observacion | varchar(500) | sí |  |  |  |
| NroOrdenOperatoria | nchar(20) | sí |  |  |  |
| EstadoReg | bit | sí |  |  |  |
| IdUsuario | int | sí |  |  |  |
| Estacion | nchar(50) | sí |  |  |  |
| FechaReg | datetime | sí |  |  |  |

Claves foráneas:

- `IdGravedad` → `dbo.CQxTipoPrioridad.IdTipoPrioridad` (FK__CQxOrdenO__IdGra__334E36A3)
- `IdGravedad` → `dbo.TiposGravedadAtencion.IdTipoGravedad` (FK__CQxOrdenO__IdGra__4C19E46D)
- `IdGravedad` → `dbo.TiposGravedadAtencion.IdTipoGravedad` (FK__CQxOrdenO__IdGra__4EF65118)
- `IdGravedad` → `dbo.TiposGravedadAtencion.IdTipoGravedad` (FK__CQxOrdenO__IdGra__51D2BDC3)
- `IdGravedad` → `dbo.TiposGravedadAtencion.IdTipoGravedad` (FK__CQxOrdenO__IdGra__6DAFE262)
- `IdMedico` → `dbo.Medicos.IdMedico` (FK__CQxOrdenO__IdMed__4D0E08A6)
- `IdMedico` → `dbo.Medicos.IdMedico` (FK__CQxOrdenO__IdMed__4FEA7551)
- `IdMedico` → `dbo.Medicos.IdMedico` (FK__CQxOrdenO__IdMed__52C6E1FC)
- `IdMedico` → `dbo.Medicos.IdMedico` (FK__CQxOrdenO__IdMed__6EA4069B)
- `IdPaciente` → `dbo.Pacientes.IdPaciente` (FK__CQxOrdenO__IdPac__50DE998A)
- `IdPaciente` → `dbo.Pacientes.IdPaciente` (FK__CQxOrdenO__IdPac__53BB0635)
- `IdPaciente` → `dbo.Pacientes.IdPaciente` (FK__CQxOrdenO__IdPac__6F982AD4)

### CQxOrdenOperatoriaCIE

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdOrdenOperatoriaCIE | int | no | sí |  | PK |
| IdOrdenOperatoria | int | no |  |  |  |
| IdDiagnostico | int | no |  |  |  |
| EstadoReg | bit | sí |  |  |  |
| IdUsuario | int | sí |  |  |  |
| Estacion | nchar(50) | sí |  |  |  |
| FechaReg | datetime | sí |  |  |  |

Claves foráneas:

- `IdDiagnostico` → `dbo.Diagnosticos.IdDiagnostico` (FK__CQxOrdenO__IdDia__1D38D105)
- `IdDiagnostico` → `dbo.Diagnosticos.IdDiagnostico` (FK__CQxOrdenO__IdDia__1E2CF53E)
- `IdDiagnostico` → `dbo.Diagnosticos.IdDiagnostico` (FK__CQxOrdenO__IdDia__5A349048)
- `IdDiagnostico` → `dbo.Diagnosticos.IdDiagnostico` (FK__CQxOrdenO__IdDia__5B28B481)
- `IdOrdenOperatoria` → `dbo.CQxOrdenOperatoria.IdOrdenOperatoria` (FK__CQxOrdenO__IdOrd__0957FCD7)

### CQxOrdenOperatoriaCIEMQ

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdOrdenOperatoriaCIEMQ | int | no | sí |  | PK |
| IdOrdenOperatoriaMQ | int | no |  |  |  |
| IdDiagnostico | int | no |  |  |  |
| EstadoReg | bit | sí |  |  |  |
| IdUsuario | int | sí |  |  |  |
| Estacion | nchar(50) | sí |  |  |  |
| FechaReg | datetime | sí |  |  |  |

Claves foráneas:

- `IdDiagnostico` → `dbo.Diagnosticos.IdDiagnostico` (FK__CQxOrdenO__IdDia__20153DB0)
- `IdDiagnostico` → `dbo.Diagnosticos.IdDiagnostico` (FK__CQxOrdenO__IdDia__5D10FCF3)

### CQxOrdenOperatoriaCPT

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdOrdenOperatoriaCPT | int | no | sí |  | PK |
| IdOrdenOperatoria | int | no |  |  |  |
| IdProducto | int | sí |  |  |  |
| EstadoReg | bit | sí |  |  |  |
| IdUsuario | int | sí |  |  |  |
| Estacion | nchar(50) | sí |  |  |  |
| FechaReg | datetime | sí |  |  |  |

Claves foráneas:

- `IdProducto` → `dbo.FactCatalogoServicios.IdProducto` (FK__CQxOrdenO__IdPro__210961E9)
- `IdProducto` → `dbo.FactCatalogoServicios.IdProducto` (FK__CQxOrdenO__IdPro__5E05212C)

### CQxOrdenOperatoriaCPTMQ

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdOrdenOperatoriaCPTMQ | int | no | sí |  | PK |
| IdOrdenOperatoriaMQ | int | sí |  |  |  |
| IdProducto | int | sí |  |  |  |
| EstadoReg | bit | sí |  |  |  |
| IdUsuario | int | sí |  |  |  |
| Estacion | nchar(50) | sí |  |  |  |
| FechaReg | datetime | sí |  |  |  |

Claves foráneas:

- `IdOrdenOperatoriaMQ` → `dbo.CQxOrdenOperatoriaMQ.IdOrdenOperatoriaMQ` (FK__CQxOrdenO__IdOrd__3130E407)
- `IdOrdenOperatoriaMQ` → `dbo.CQxOrdenOperatoriaMQ.IdOrdenOperatoriaMQ` (FK__CQxOrdenO__IdOrd__6A9E6B8D)
- `IdOrdenOperatoriaMQ` → `dbo.CQxOrdenOperatoriaMQ.IdOrdenOperatoriaMQ` (FK__CQxOrdenO__IdOrd__6E6EFC71)
- `IdProducto` → `dbo.FactCatalogoServicios.IdProducto` (FK__CQxOrdenO__IdPro__24D9F2CD)
- `IdProducto` → `dbo.FactCatalogoServicios.IdProducto` (FK__CQxOrdenO__IdPro__25CE1706)
- `IdProducto` → `dbo.FactCatalogoServicios.IdProducto` (FK__CQxOrdenO__IdPro__26C23B3F)
- `IdProducto` → `dbo.FactCatalogoServicios.IdProducto` (FK__CQxOrdenO__IdPro__61D5B210)
- `IdProducto` → `dbo.FactCatalogoServicios.IdProducto` (FK__CQxOrdenO__IdPro__62C9D649)
- `IdProducto` → `dbo.FactCatalogoServicios.IdProducto` (FK__CQxOrdenO__IdPro__63BDFA82)

### CQxOrdenOperatoriaCPTMQPO

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdOrdenOperatoriaCPTMQ | int | no | sí |  | PK |
| IdOrdenOperatoriaMQ | int | no |  |  |  |
| IdProducto | int | sí |  |  |  |
| EstadoReg | bit | sí |  |  |  |
| IdUsuario | int | sí |  |  |  |
| Estacion | varchar(50) | sí |  |  |  |
| FechaReg | datetime | sí |  |  |  |

Claves foráneas:

- `IdOrdenOperatoriaMQ` → `dbo.CQxOrdenOperatoriaMQ.IdOrdenOperatoriaMQ` (FK_CQxOrdenOperatoriaCPTMQPO_CQxOrdenOperatoriaMQ)
- `IdProducto` → `dbo.FactCatalogoServicios.IdProducto` (FK_CQxOrdenOperatoriaCPTMQPO_FactCatalogoServicios)

### CQxOrdenOperatoriaMQ

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdOrdenOperatoriaMQ | int | no | sí |  | PK |
| IdOrdenOperatoria | int | no |  |  |  |
| IdPaciente | int | no |  |  |  |
| IdMedico | int | sí |  |  |  |
| IdGravedad | int | sí |  |  |  |
| IdServicio | int | sí |  |  |  |
| IdCama | int | sí |  |  |  |
| Fecha | datetime | sí |  |  |  |
| Hora | char(5) | sí |  |  |  |
| Programado | bit | sí |  |  |  |
| FechaEstimadaQx | datetime | sí |  |  |  |
| Observacion | varchar(500) | sí |  |  |  |
| NroOrdenOperatoriaMQ | nchar(20) | sí |  |  |  |
| EstadoReg | bit | sí |  |  |  |
| IdUsuario | int | sí |  |  |  |
| Estacion | nchar(50) | sí |  |  |  |
| FechaReg | datetime | sí |  |  |  |

Claves foráneas:

- `IdCama` → `dbo.Camas.IdCama` (FK__CQxOrdenO__IdCam__64E59237)
- `IdMedico` → `dbo.Medicos.IdMedico` (FK__CQxOrdenO__IdMed__65D9B670)
- `IdOrdenOperatoria` → `dbo.CQxOrdenOperatoria.IdOrdenOperatoria` (FK__CQxOrdenO__IdOrd__66CDDAA9)

### CQxPosicionAnestesiaDet

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdPosicionAnestesiaDet | int | no | sí |  | PK |
| IdRegistroAnestesiologiaCab | int | no |  |  |  |
| IdPosicionAnestesia | int | no |  |  |  |
| EstadoReg | bit | sí |  |  |  |
| IdUsuario | int | sí |  |  |  |
| Estacion | nchar(50) | sí |  |  |  |
| FechaReg | datetime | sí |  |  |  |

Claves foráneas:

- `IdPosicionAnestesia` → `dbo.TiposPosicionAnestesia.IdPosicionAnestesia` (FK__CQxPosici__IdPos__2A92CC23)
- `IdPosicionAnestesia` → `dbo.TiposPosicionAnestesia.IdPosicionAnestesia` (FK__CQxPosici__IdPos__678E8B66)
- `IdRegistroAnestesiologiaCab` → `dbo.CQxRegistroAnestesiologiaCab.IdRegistroAnestesiologiaCab` (FK__CQxPosici__IdReg__07C4BA20)

### CQxProductoMedico

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdProductoMedico | int | no |  |  | PK |
| IdMedico | int | no |  |  |  |
| IdProducto | int | no |  |  |  |
| EstadoReg | bit | sí |  |  |  |
| IdUsuario | int | sí |  |  |  |
| Estacion | nchar(50) | sí |  |  |  |
| FechaReg | datetime | sí |  |  |  |

Claves foráneas:

- `IdProducto` → `dbo.FactCatalogoServicios.IdProducto` (FK__CQxProduc__IdPro__2E635D07)
- `IdProducto` → `dbo.FactCatalogoServicios.IdProducto` (FK__CQxProduc__IdPro__6B5F1C4A)

### CQxProductoServicio

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdProductoServicio | int | no |  |  | PK |
| IdEspecialidad | int | no |  |  |  |
| IdProducto | int | no |  |  |  |
| EstadoReg | bit | sí |  |  |  |
| IdUsuario | int | sí |  |  |  |
| Estacion | nchar(50) | sí |  |  |  |
| FechaReg | datetime | sí |  |  |  |

Claves foráneas:

- `IdEspecialidad` → `dbo.Especialidades.IdEspecialidad` (FK__CQxProduc__IdEsp__2F578140)
- `IdEspecialidad` → `dbo.Especialidades.IdEspecialidad` (FK__CQxProduc__IdEsp__304BA579)
- `IdEspecialidad` → `dbo.Especialidades.IdEspecialidad` (FK__CQxProduc__IdEsp__6C534083)
- `IdEspecialidad` → `dbo.Especialidades.IdEspecialidad` (FK__CQxProduc__IdEsp__6D4764BC)
- `IdProducto` → `dbo.FactCatalogoServicios.IdProducto` (FK__CQxProduc__IdPro__313FC9B2)
- `IdProducto` → `dbo.FactCatalogoServicios.IdProducto` (FK__CQxProduc__IdPro__3233EDEB)
- `IdProducto` → `dbo.FactCatalogoServicios.IdProducto` (FK__CQxProduc__IdPro__33281224)
- `IdProducto` → `dbo.FactCatalogoServicios.IdProducto` (FK__CQxProduc__IdPro__6E3B88F5)
- `IdProducto` → `dbo.FactCatalogoServicios.IdProducto` (FK__CQxProduc__IdPro__6F2FAD2E)
- `IdProducto` → `dbo.FactCatalogoServicios.IdProducto` (FK__CQxProduc__IdPro__7023D167)

### CQxProgramacionFormatos

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdProgramacionFormatos | int | no | sí |  | PK |
| IdProgramacionSala | int | no |  |  |  |
| IdFormatosCQx | int | no |  |  |  |
| IdUsuario | int | sí |  |  |  |
| Estacion | nchar(50) | sí |  |  |  |
| FechaReg | datetime | sí |  |  |  |

Claves foráneas:

- `IdFormatosCQx` → `dbo.TiposFormatosCQx.IdFormatosCQx` (FK__CQxProgra__IdFor__341C365D)
- `IdFormatosCQx` → `dbo.TiposFormatosCQx.IdFormatosCQx` (FK__CQxProgra__IdFor__35105A96)
- `IdFormatosCQx` → `dbo.TiposFormatosCQx.IdFormatosCQx` (FK__CQxProgra__IdFor__7117F5A0)
- `IdFormatosCQx` → `dbo.TiposFormatosCQx.IdFormatosCQx` (FK__CQxProgra__IdFor__720C19D9)
- `IdProgramacionSala` → `dbo.CQxProgramacionSala.IdProgramacionSala` (FK__CQxProgra__IdPro__36047ECF)
- `IdProgramacionSala` → `dbo.CQxProgramacionSala.IdProgramacionSala` (FK__CQxProgra__IdPro__73003E12)

### CQxProgramacionRoles

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdProgramacionRoles | int | no | sí |  | PK |
| IdMedico | int | sí |  |  |  |
| IdRolesCQx | int | no |  |  |  |
| IdProgramacionSala | int | no |  |  |  |
| Fecha | datetime | sí |  |  |  |
| EstadoReg | bit | sí |  |  |  |
| IdUsuario | int | sí |  |  |  |
| Estacion | nchar(50) | sí |  |  |  |
| FechaReg | datetime | sí |  |  |  |

### CQxProgramacionSala

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdProgramacionSala | int | no | sí |  | PK |
| Fecha | datetime | no |  |  |  |
| HoraIngreso | char(5) | no |  |  |  |
| HoraSalida | char(5) | no |  |  |  |
| IdOrdenOperatoriaMQ | int | sí |  |  |  |
| IdPaciente | int | sí |  |  |  |
| IdEstadoSalaOperacion | int | sí |  |  |  |
| IdServicio | int | sí |  |  |  |
| EstadoReg | bit | sí |  |  |  |
| IdUsuario | int | sí |  |  |  |
| Estacion | nchar(50) | sí |  |  |  |
| FechaReg | datetime | sí |  |  |  |
| Aprobado | bit | sí |  |  |  |

Claves foráneas:

- `IdEstadoSalaOperacion` → `dbo.TiposEstadoSalaOperacion.IdEstadoSalaOperacion` (FK__CQxProgra__IdEst__36F8A308)
- `IdEstadoSalaOperacion` → `dbo.TiposEstadoSalaOperacion.IdEstadoSalaOperacion` (FK__CQxProgra__IdEst__37ECC741)
- `IdEstadoSalaOperacion` → `dbo.TiposEstadoSalaOperacion.IdEstadoSalaOperacion` (FK__CQxProgra__IdEst__73F4624B)
- `IdEstadoSalaOperacion` → `dbo.TiposEstadoSalaOperacion.IdEstadoSalaOperacion` (FK__CQxProgra__IdEst__74E88684)
- `IdOrdenOperatoriaMQ` → `dbo.CQxOrdenOperatoriaMQ.IdOrdenOperatoriaMQ` (FK__CQxProgra__IdOrd__7333B18E)
- `IdServicio` → `dbo.Servicios.IdServicio` (FK__CQxProgra__IdSer__39D50FB3)
- `IdServicio` → `dbo.Servicios.IdServicio` (FK__CQxProgra__IdSer__76D0CEF6)

### CQxRecuperacionPostAnestesicaCab

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdRecuperacionPostAnestesicaCab | int | no | sí |  | PK |
| IdProgramacionSala | int | no |  |  |  |
| IdOrdenOperatoriaMQ | int | sí |  |  |  |
| IdAnestesiologo | int | sí |  |  |  |
| IdAnestesiologiaURPA | int | sí |  |  |  |
| IdServicioIngreso | int | sí |  |  |  |
| FechaIngreso | datetime | sí |  |  |  |
| HoraIngreso | nchar(5) | sí |  |  |  |
| IdServicioEgreso | int | sí |  |  |  |
| FechaEgreso | datetime | sí |  |  |  |
| HoraEgreso | nchar(5) | sí |  |  |  |
| IdCama | int | sí |  |  |  |
| ObservacionIndicacionMedica | varchar(3000) | sí |  |  |  |
| Pendientes | varchar(3000) | sí |  |  |  |
| NroRecuperacionPostAnestesica | nchar(20) | sí |  |  |  |
| EstadoReg | bit | sí |  |  |  |
| IdUsuario | int | sí |  |  |  |
| Estacion | nchar(50) | sí |  |  |  |
| FechaReg | datetime | sí |  |  |  |

Claves foráneas:

- `IdProgramacionSala` → `dbo.CQxProgramacionSala.IdProgramacionSala` (FK__CQxRecupe__IdPro__3AC933EC)
- `IdProgramacionSala` → `dbo.CQxProgramacionSala.IdProgramacionSala` (FK__CQxRecupe__IdPro__77C4F32F)

### CQxRegistroAnestesiologiaCab

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdRegistroAnestesiologiaCab | int | no | sí |  | PK |
| IdProgramacionSala | int | no |  |  |  |
| IdOrdenOperatoriaMQ | int | sí |  |  |  |
| IdMedico | int | sí |  |  |  |
| IdTiposDestinoOperacion | int | sí |  |  |  |
| IdDiagnosticoPostOperatorio | int | sí |  |  |  |
| Fecha | datetime | sí |  |  |  |
| Hora | char(5) | sí |  |  |  |
| Observaciones | varchar(2000) | sí |  |  |  |
| NroRegistroAnestesiologia | nchar(20) | sí |  |  |  |
| EstadoReg | bit | sí |  |  |  |
| IdUsuario | int | sí |  |  |  |
| Estacion | nchar(50) | sí |  |  |  |
| FechaReg | datetime | sí |  |  |  |

Claves foráneas:

- `IdProgramacionSala` → `dbo.CQxProgramacionSala.IdProgramacionSala` (FK__CQxRegist__IdPro__72C99D3A)

### CQxRegistroEnfermeriaURPACab

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdRegistroEnfermeriaURPACab | int | no | sí |  | PK |
| IdProgramacionSala | int | no |  |  |  |
| IdOrdenOperatoriaMQ | int | sí |  |  |  |
| IdMedico | int | sí |  |  |  |
| IdEnfermera | int | sí |  |  |  |
| IdAnestesiologiaSOP | int | sí |  |  |  |
| IdAnestesiologiaURPA | int | sí |  |  |  |
| Fecha | datetime | sí |  |  |  |
| HoraEntrada | nchar(5) | sí |  |  |  |
| HoraSalida | nchar(5) | sí |  |  |  |
| IdServicio | int | sí |  |  |  |
| IdCama | int | sí |  |  |  |
| Glucosa | nchar(15) | sí |  |  |  |
| NroRegistroEnfermeriaURPA | nchar(20) | sí |  |  |  |
| EstadoReg | bit | sí |  |  |  |
| IdUsuario | int | sí |  |  |  |
| Estacion | nchar(50) | sí |  |  |  |
| FechaReg | datetime | sí |  |  |  |
| HoraCoordinacion | nchar(5) | sí |  |  |  |

Claves foráneas:

- `IdProgramacionSala` → `dbo.CQxProgramacionSala.IdProgramacionSala` (FK__CQxRegist__IdPro__3CB17C5E)
- `IdProgramacionSala` → `dbo.CQxProgramacionSala.IdProgramacionSala` (FK__CQxRegist__IdPro__79AD3BA1)

### CQxRuta

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdRuta | int | no |  |  | PK |
| Descripcion | nchar(100) | no |  |  |  |
| EstadoReg | bit | sí |  |  |  |
| IdUsuario | int | sí |  |  |  |
| Estacion | nchar(50) | sí |  |  |  |
| FechaReg | datetime | sí |  |  |  |

### CQxRutaDet

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdRutaDet | int | no | sí |  | PK |
| IdRuta | int | no |  |  |  |
| IdOrdenOperatoria | int | no |  |  |  |
| IdCuentaAtencion | int | no |  |  |  |
| Fecha | datetime | no |  |  |  |
| Hora | char(5) | no |  |  |  |
| EstadoReg | bit | sí |  |  |  |
| IdUsuario | int | sí |  |  |  |
| Estacion | nchar(50) | sí |  |  |  |
| FechaReg | datetime | sí |  |  |  |

Claves foráneas:

- `IdCuentaAtencion` → `dbo.Atenciones.IdAtencion` (FK__CQxRutaDe__IdCue__3DA5A097)
- `IdCuentaAtencion` → `dbo.Atenciones.IdAtencion` (FK__CQxRutaDe__IdCue__7AA15FDA)
- `IdOrdenOperatoria` → `dbo.CQxOrdenOperatoria.IdOrdenOperatoria` (FK__CQxRutaDe__IdOrd__7368BBB8)
- `IdRuta` → `dbo.CQxRuta.IdRuta` (FK__CQxRutaDe__IdRut__3F8DE909)
- `IdRuta` → `dbo.CQxRuta.IdRuta` (FK__CQxRutaDe__IdRut__7C89A84C)

### CQxSignosVitalesAltaRecuperacion

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdSignosVitalesAltaRecuperacion | int | no | sí |  | PK |
| IdSignosVitales | int | no |  |  |  |
| IdRecuperacionPostAnestesicaCab | int | no |  |  |  |
| VariableDato | varchar(50) | sí |  |  |  |
| EstadoReg | bit | sí |  |  |  |
| IdUsuario | int | sí |  |  |  |
| Estacion | nchar(50) | sí |  |  |  |
| FechaReg | datetime | sí |  |  |  |

Claves foráneas:

- `IdSignosVitales` → `dbo.TiposSignosVitales.IdSignosVitales` (FK_CQxSignosVitalesAltaRecuperacion_TiposSignosVitales)

### CQxSignosVitalesRecuperacion

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdSignosVitalesRecuperacion | int | no | sí |  | PK |
| IdSignosVitales | int | no |  |  |  |
| IdRecuperacionPostAnestesicaCab | int | no |  |  |  |
| VariableDato | varchar(50) | sí |  |  |  |
| EstadoReg | bit | sí |  |  |  |
| IdUsuario | int | sí |  |  |  |
| Estacion | nchar(50) | sí |  |  |  |
| FechaReg | datetime | sí |  |  |  |

Claves foráneas:

- `IdSignosVitalesRecuperacion` → `dbo.CQxSignosVitalesRecuperacion.IdSignosVitalesRecuperacion` (FK_CQxSignosVitalesRecuperacion_CQxSignosVitalesRecuperacion)
- `IdSignosVitales` → `dbo.TiposSignosVitales.IdSignosVitales` (FK_CQxSignosVitalesRecuperacion_TiposSignosVitales)

### CQxTestAldretteRecuperacionDet

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdTestAldretteRecuperacionDet | int | no | sí |  | PK |
| IdComponentesTestAldrette | int | no |  |  |  |
| IdRegistroEnfermeriaURPACab | int | no |  |  |  |
| ValorIngreso | int | sí |  |  |  |
| ValorEgreso | int | sí |  |  |  |
| EstadoReg | bit | sí |  |  |  |
| IdUsuario | int | sí |  |  |  |
| Estacion | nchar(50) | sí |  |  |  |
| FechaReg | datetime | sí |  |  |  |

Claves foráneas:

- `IdComponentesTestAldrette` → `dbo.ComponentesTestAldrette.IdComponentesTestAldrette` (FK__CQxTestAl__IdCom__005A3930)
- `IdComponentesTestAldrette` → `dbo.ComponentesTestAldrette.IdComponentesTestAldrette` (FK__CQxTestAl__IdCom__435E79ED)
- `IdRegistroEnfermeriaURPACab` → `dbo.CQxRegistroEnfermeriaURPACab.IdRegistroEnfermeriaURPACab` (FK__CQxTestAl__IdReg__014E5D69)
- `IdRegistroEnfermeriaURPACab` → `dbo.CQxRegistroEnfermeriaURPACab.IdRegistroEnfermeriaURPACab` (FK__CQxTestAl__IdReg__44529E26)

### CQxTestAldretteRecuperacionPostAnestesicaDet

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdTestAldretteRecuperacionPostAnestesicaDet | int | no | sí |  | PK |
| IdComponentesTestAldrette | int | no |  |  |  |
| IdRecuperacionPostAnestesicaCab | int | no |  |  |  |
| ValorIngreso | int | sí |  |  |  |
| ValorEgreso | int | sí |  |  |  |
| EstadoReg | bit | sí |  |  |  |
| IdUsuario | int | sí |  |  |  |
| Estacion | nchar(50) | sí |  |  |  |
| FechaReg | datetime | sí |  |  |  |

Claves foráneas:

- `IdComponentesTestAldrette` → `dbo.ComponentesTestAldrette.IdComponentesTestAldrette` (FK__CQxTestAl__IdCom__024281A2)
- `IdComponentesTestAldrette` → `dbo.ComponentesTestAldrette.IdComponentesTestAldrette` (FK__CQxTestAl__IdCom__4546C25F)
- `IdRecuperacionPostAnestesicaCab` → `dbo.CQxRecuperacionPostAnestesicaCab.IdRecuperacionPostAnestesicaCab` (FK__CQxTestAl__IdRec__0336A5DB)
- `IdRecuperacionPostAnestesicaCab` → `dbo.CQxRecuperacionPostAnestesicaCab.IdRecuperacionPostAnestesicaCab` (FK__CQxTestAl__IdRec__042ACA14)
- `IdRecuperacionPostAnestesicaCab` → `dbo.CQxRecuperacionPostAnestesicaCab.IdRecuperacionPostAnestesicaCab` (FK__CQxTestAl__IdRec__463AE698)
- `IdRecuperacionPostAnestesicaCab` → `dbo.CQxRecuperacionPostAnestesicaCab.IdRecuperacionPostAnestesicaCab` (FK__CQxTestAl__IdRec__472F0AD1)

### CQxTipoAnestesiaDet

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdTipoAnestesiaDet | int | no | sí |  | PK |
| IdTiposAnestesia | int | no |  |  |  |
| IdRegistroEnfermeriaURPACab | int | no |  |  |  |
| Valor | bit | sí |  |  |  |
| EstadoReg | bit | sí |  |  |  |
| IdUsuario | int | sí |  |  |  |
| Estacion | nchar(50) | sí |  |  |  |
| FechaReg | datetime | sí |  |  |  |

Claves foráneas:

- `IdRegistroEnfermeriaURPACab` → `dbo.CQxRegistroEnfermeriaURPACab.IdRegistroEnfermeriaURPACab` (FK__CQxTipoAn__IdReg__051EEE4D)
- `IdRegistroEnfermeriaURPACab` → `dbo.CQxRegistroEnfermeriaURPACab.IdRegistroEnfermeriaURPACab` (FK__CQxTipoAn__IdReg__06131286)
- `IdRegistroEnfermeriaURPACab` → `dbo.CQxRegistroEnfermeriaURPACab.IdRegistroEnfermeriaURPACab` (FK__CQxTipoAn__IdReg__48232F0A)
- `IdRegistroEnfermeriaURPACab` → `dbo.CQxRegistroEnfermeriaURPACab.IdRegistroEnfermeriaURPACab` (FK__CQxTipoAn__IdReg__49175343)
- `IdTiposAnestesia` → `dbo.TiposAnestesia.IdAnestesia` (FK__CQxTipoAn__IdTip__070736BF)
- `IdTiposAnestesia` → `dbo.TiposAnestesia.IdAnestesia` (FK__CQxTipoAn__IdTip__07FB5AF8)
- `IdTiposAnestesia` → `dbo.TiposAnestesia.IdAnestesia` (FK__CQxTipoAn__IdTip__4A0B777C)
- `IdTiposAnestesia` → `dbo.TiposAnestesia.IdAnestesia` (FK__CQxTipoAn__IdTip__4AFF9BB5)

### CQxTipoPrioridad

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdTipoPrioridad | int | no |  |  | PK |
| Descripcion | nchar(100) | no |  |  |  |
| EstadoReg | bit | sí |  |  |  |
| IdUsuario | int | sí |  |  |  |
| Estacion | nchar(50) | sí |  |  |  |
| FechaReg | datetime | sí |  |  |  |

### CQxVentilacionMecanicaDet

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdVentilacionMecanicaDet | int | no | sí |  | PK |
| IdComponentesVentilacionMecanica | int | no |  |  |  |
| IdRecuperacionPostAnestesicaCab | int | no |  |  |  |
| ValorIngreso | nchar(30) | sí |  |  |  |
| ValorAlta | nchar(30) | sí |  |  |  |
| EstadoReg | bit | sí |  |  |  |
| IdUsuario | int | sí |  |  |  |
| Estacion | nchar(50) | sí |  |  |  |
| FechaReg | datetime | sí |  |  |  |

Claves foráneas:

- `IdComponentesVentilacionMecanica` → `dbo.ComponentesVentilacionMecanica.IdComponentesVentilacionMecanica` (FK__CQxVentil__IdCom__08EF7F31)
- `IdComponentesVentilacionMecanica` → `dbo.ComponentesVentilacionMecanica.IdComponentesVentilacionMecanica` (FK__CQxVentil__IdCom__4BF3BFEE)
- `IdRecuperacionPostAnestesicaCab` → `dbo.CQxRecuperacionPostAnestesicaCab.IdRecuperacionPostAnestesicaCab` (FK__CQxVentil__IdRec__09E3A36A)
- `IdRecuperacionPostAnestesicaCab` → `dbo.CQxRecuperacionPostAnestesicaCab.IdRecuperacionPostAnestesicaCab` (FK__CQxVentil__IdRec__4CE7E427)

### CQxVerificacionCirugiaDet

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdVerificacionCirugiaDet | int | no | sí |  | PK |
| IdPreguntasVerificacionCirugiaCQx | int | no |  |  |  |
| IdVerificacionCirugiaCab | int | no |  |  |  |
| SI | int | sí |  |  |  |
| NO | int | sí |  |  |  |
| EstadoReg | bit | sí |  |  |  |
| IdUsuario | int | sí |  |  |  |
| Estacion | varchar(50) | sí |  |  |  |
| FechaReg | datetime | sí |  |  |  |

Claves foráneas:

- `IdPreguntasVerificacionCirugiaCQx` → `dbo.PreguntasVerificacionCirugiaCQx.IdPreguntasVerificacionCirugiaCQx` (FK__CQxVerifi__IdPre__61E3010D)

### CQxVisitaEnfermera

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdVisitaEnfermera | int | no | sí |  | PK |
| IdProgramacionSala | int | no |  |  |  |
| IdOrdenOperatoriaMQ | int | sí |  |  |  |
| IdVisita | int | no |  |  |  |
| IdMedico | int | sí |  |  |  |
| IdCQxEtapas | int | no |  |  |  |
| FechaHoraVisita | datetime | sí |  |  |  |
| EstadoReg | bit | sí |  |  |  |
| IdUsuario | int | sí |  |  |  |
| Estacion | nchar(50) | sí |  |  |  |
| FechaReg | datetime | sí |  |  |  |

### CQxVisitaEnfermeraVariable

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdVisitaEnfermeraVariable | int | no | sí |  | PK |
| IdVisitaEnfermera | int | no |  |  |  |
| IdSignosVitales | int | no |  |  |  |
| VariableDato | varchar(50) | sí |  |  |  |
| EstadoReg | bit | sí |  |  |  |
| IdUsuario | int | sí |  |  |  |
| Estacion | nchar(50) | sí |  |  |  |
| FechaReg | datetime | sí |  |  |  |

### Departamentos

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdDepartamento | int | no |  |  | PK |
| Nombre | varchar(20) | no |  |  |  |
| idReniec | int | sí |  |  |  |
| Ceste | varchar(20) | sí |  |  |  |
| Cnorte | varchar(20) | sí |  |  |  |

### DepartamentosHospital

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdDepartamento | int | no |  |  | PK |
| Nombre | varchar(50) | no |  |  |  |

### DesarrolloVisitaMedicoReceta

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| ide | int | no | sí |  |  |
| IdVisitaMedico | int | sí |  |  |  |
| idReceta | int | sí |  |  |  |
| idCuentaAtencion | int | sí |  |  |  |
| IdPuntoCarga | int | sí |  |  |  |
| estado | varchar(5) | sí |  |  |  |

### DetalleFuncionBiologica

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| id | int | no | sí |  | PK |
| requerimiento_id | int | no |  |  |  |
| funcion | varchar(50) | sí |  |  |  |
| opcion | varchar(200) | sí |  |  |  |
| fecha_creacion | datetime | no |  | getdate() |  |

Claves foráneas:

- `requerimiento_id` → `dbo.RequerimientoBiologico.id` (FK__DetalleFu__reque__699B9373)

### DetalleReferencia

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| idReferencia | int | no | sí |  | PK |
| fechaReferencia | datetime | no |  |  |  |
| nroReferencia | varchar(12) | no |  |  |  |
| idPaciente | int | no |  |  |  |
| tipoSeguro | varchar(50) | sí |  |  |  |
| ubigeoNacimiento | varchar(6) | sí |  |  |  |
| ubigeoDomicilio | varchar(6) | sí |  |  |  |
| establecimientoOrigen | varchar(6) | no |  |  |  |
| idServicio | int | no |  |  |  |
| tipoPaciente | varchar(1) | sí |  |  |  |
| idAtencion | int | no |  |  |  |
| resumenAnamnesis | varchar(1000) | sí |  |  |  |
| resumenExamenFisico | varchar(900) | sí |  |  |  |
| tipDocumentoMedico | varchar(2) | sí |  |  |  |
| numDocumentoMedico | varchar(15) | sí |  |  |  |

### DiagnosticoAlertasEpidemiologicas

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| Iddiagnostico | int | sí |  |  |  |
| Tiponotificacion | int | sí |  |  |  |
| Tipoperiocidad | nchar(10) | sí |  |  |  |
| nota | varchar(15) | sí |  |  |  |

### Diagnosticos

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdDiagnostico | int | no | sí |  | PK |
| CodigoCIE2004 | char(7) | no |  |  |  |
| Descripcion | varchar(250) | no |  |  |  |
| IdCapitulo | int | sí |  |  |  |
| IdGrupo | int | sí |  |  |  |
| IdCategoria | int | sí |  |  |  |
| CodigoExportacion | char(5) | sí |  |  |  |
| CodigoCIE9 | char(10) | sí |  |  |  |
| CodigoCIE10 | char(10) | sí |  |  |  |
| Gestacion | bit | sí |  |  |  |
| Morbilidad | bit | sí |  |  |  |
| Intrahospitalario | bit | sí |  |  |  |
| Restriccion | bit | sí |  |  |  |
| EdadMaxDias | int | sí |  |  |  |
| EdadMinDias | int | sí |  |  |  |
| IdTipoSexo | int | sí |  |  |  |
| ClaseDxHIS | varchar(1) | sí |  |  |  |
| DescripcionMINSA | varchar(250) | sí |  |  |  |
| codigoCIEsinPto | varchar(7) | sí |  |  |  |
| FechaInicioVigencia | datetime | sí |  |  |  |
| EsActivo | bit | no |  | (1) |  |

Claves foráneas:

- `IdCapitulo` → `dbo.DiagnosticosCapitulos.IdCapitulo` (DiagnosticosCapitulos_Diagnosticos_FK1)
- `IdCategoria` → `dbo.DiagnosticosCategorias.IdCategoria` (DiagnosticosCategorias_Diagnosticos_FK1)
- `IdGrupo` → `dbo.DiagnosticosGrupos.IdGrupo` (DiagnosticosGrupos_Diagnosticos_FK1)
- `IdTipoSexo` → `dbo.TiposSexo.IdTipoSexo` (TiposSexo_Diagnosticos_FK1)

### DiagnosticosCapitulos

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdCapitulo | int | no |  |  | PK |
| Codigo | varchar(20) | no |  |  |  |
| Descripcion | varchar(255) | no |  |  |  |

### DiagnosticosCategorias

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdCategoria | int | no |  |  | PK |
| Codigo | varchar(10) | no |  |  |  |
| Descripcion | varchar(255) | no |  |  |  |
| IdGrupo | int | sí |  |  |  |

Claves foráneas:

- `IdGrupo` → `dbo.DiagnosticosGrupos.IdGrupo` (DiagnosticosGrupos_DiagnosticosCategorias_FK1)

### DiagnosticosGrupos

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdGrupo | int | no |  |  | PK |
| Descripcion | varchar(255) | no |  |  |  |
| IdCapitulo | int | sí |  |  |  |

Claves foráneas:

- `IdCapitulo` → `dbo.DiagnosticosCapitulos.IdCapitulo` (DiagnosticosCapitulos_DiagnosticosGrupos_FK1)

### DiagnosticosSoloPartos

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| codigoCie10 | varchar(7) | no |  |  |  |

### diascama

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| cod_2000 | varchar(10) | sí |  |  |  |
| cod_ups | varchar(10) | no |  |  | PK |
| fecha | date | no |  |  | PK |
| valor | int | sí |  |  |  |

### Diastema

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| Id | int | no | sí |  | PK |
| OdontogramaId | int | no |  |  |  |
| Nro_Historia | nvarchar(50) | no |  |  |  |
| Diente_Left | tinyint | no |  |  |  |
| Diente_Right | tinyint | no |  |  |  |
| Tamano | decimal(6,2) | sí |  |  |  |
| Observaciones | nvarchar(500) | sí |  |  |  |
| Fecha_Creacion | datetime2 | no |  | getdate() |  |
| Usuario_Creacion | nvarchar(100) | sí |  |  |  |
| Nro_Cuenta | int | sí |  |  |  |

Claves foráneas:

- `OdontogramaId` → `dbo.Odontograma.Id` (FK_Diastema_Odontograma)

### Diente

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| Id | int | no | sí |  | PK |
| OdontogramaId | int | no |  |  |  |
| Nro_Historia | nvarchar(50) | no |  |  |  |
| NumeroDiente | tinyint | no |  |  |  |
| EstadoCodigo | nvarchar(50) | sí |  |  |  |
| Estado | nvarchar(100) | sí |  |  |  |
| Color | nvarchar(30) | sí |  |  |  |
| Observaciones | nvarchar(500) | sí |  |  |  |
| Tiene_Protesis | bit | no |  | (0) |  |
| Metadata | nvarchar(max) | sí |  |  |  |
| Fecha_Creacion | datetime2 | no |  | getdate() |  |
| Usuario_Creacion | nvarchar(100) | sí |  |  |  |
| Fecha_Modificacion | datetime2 | sí |  |  |  |
| Usuario_Modificacion | nvarchar(100) | sí |  |  |  |
| Nro_Cuenta | int | sí |  |  |  |

Claves foráneas:

- `OdontogramaId` → `dbo.Odontograma.Id` (FK_Diente_Odontograma)

### DienteArea

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| Id | int | no | sí |  | PK |
| OdontogramaId | int | no |  |  |  |
| Nro_Historia | nvarchar(50) | no |  |  |  |
| NumeroDiente | tinyint | no |  |  |  |
| Area | nvarchar(50) | no |  |  |  |
| Estado | nvarchar(100) | sí |  |  |  |
| Color | nvarchar(30) | sí |  |  |  |
| Observaciones | nvarchar(500) | sí |  |  |  |
| Metadata | nvarchar(max) | sí |  |  |  |
| Fecha_Creacion | datetime2 | no |  | getdate() |  |
| Usuario_Creacion | nvarchar(100) | sí |  |  |  |
| Fecha_Modificacion | datetime2 | sí |  |  |  |
| Usuario_Modificacion | nvarchar(100) | sí |  |  |  |
| Nro_Cuenta | int | sí |  |  |  |

Claves foráneas:

- `OdontogramaId` → `dbo.Odontograma.Id` (FK_DienteArea_Odontograma)

### DienteCodigo

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| Id | int | no | sí |  | PK |
| OdontogramaId | int | no |  |  |  |
| Nro_Historia | nvarchar(50) | no |  |  |  |
| NumeroDiente | tinyint | no |  |  |  |
| Codigo | nvarchar(50) | no |  |  |  |
| Descripcion | nvarchar(250) | sí |  |  |  |
| Color | nvarchar(30) | sí |  |  |  |
| Metadata | nvarchar(max) | sí |  |  |  |
| Fecha_Creacion | datetime2 | no |  | getdate() |  |
| Usuario_Creacion | nvarchar(100) | sí |  |  |  |
| Nro_Cuenta | int | sí |  |  |  |

Claves foráneas:

- `OdontogramaId` → `dbo.Odontograma.Id` (FK_DienteCodigo_Odontograma)

### DisaEstablecimientos

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdDisa | int | no | sí |  |  |
| Codgio | int | sí |  |  |  |
| Nombre | varchar(150) | sí |  |  |  |

### Distritos

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdDistrito | int | no |  |  | PK |
| Nombre | varchar(50) | no |  |  |  |
| IdProvincia | int | no |  |  |  |
| IdReniec | int | sí |  |  |  |

Claves foráneas:

- `IdProvincia` → `dbo.Provincias.IdProvincia` (Provincias_Distritos_FK1)

### dtproperties

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| id | int | no | sí |  | PK |
| objectid | int | sí |  |  |  |
| property | varchar(64) | no |  |  | PK |
| value | varchar(255) | sí |  |  |  |
| uvalue | nvarchar(255) | sí |  |  |  |
| lvalue | image | sí |  |  |  |
| version | int | no |  | (0) |  |

### Duenio

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| id_duenio | int | no | sí |  | PK |
| nombre | varchar(100) | no |  |  |  |
| apellido | varchar(100) | no |  |  |  |
| telefono | varchar(20) | no |  |  |  |
| correo | varchar(150) | no |  |  |  |

### Edentulo

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| Id | int | no | sí |  | PK |
| OdontogramaVersionId | int | no |  |  |  |
| Diente_Inicio | tinyint | no |  |  |  |
| Diente_Fin | tinyint | no |  |  |  |
| Tipo | nvarchar(30) | sí |  |  |  |
| Color | nvarchar(30) | sí |  |  |  |
| Metadata | nvarchar(max) | sí |  |  |  |
| Fecha_Creacion | datetime2 | no |  | getdate() |  |
| Usuario_Creacion | nvarchar(100) | sí |  |  |  |

Claves foráneas:

- `OdontogramaVersionId` → `dbo.OdontogramaVersion.Id` (FK_Edentulo_Version)

### EmergenciaCausaExternaMorbilidad

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdCausaExternaMorbilidad | int | no |  |  | PK |
| Codigo | varchar(4) | no |  |  |  |
| Descripcion | varchar(50) | no |  |  |  |
| MotivoSEM | varchar(2) | sí |  |  |  |

### EmergenciaClaseAccidente

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdClaseAccidente | int | no |  |  | PK |
| Descripcion | varchar(20) | no |  |  |  |

### EmergenciaGrupoOcupacionalALAB

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdGrupoOcupacionalALAB | int | no |  |  | PK |
| Descripcion | varchar(30) | no |  |  |  |

### EmergenciaLugarEvento

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdLugarEvento | int | no |  |  | PK |
| Descripcion | varchar(50) | no |  |  |  |

### EmergenciaPosicionLesionadoALAB

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdPosicionLesionadoALAB | int | no |  |  | PK |
| Descripcion | varchar(20) | no |  |  |  |

### EmergenciaRelacionAgresorVictima

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdRelacionAgresorVictima | int | no |  |  | PK |
| Descripcion | varchar(20) | no |  |  |  |

### EmergenciaSeguridad

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdSeguridad | int | no |  |  | PK |
| Descripcion | varchar(50) | no |  |  |  |

### EmergenciaTipoAgenteAGAN

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdTipoAgenteAGAN | int | no |  |  | PK |
| Descripcion | varchar(30) | no |  |  |  |

### EmergenciaTipoEvento

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdTipoEvento | int | no |  |  | PK |
| Descripcion | varchar(30) | no |  |  |  |

### EmergenciaTipoTransporte

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdTipoTransporte | int | no |  |  | PK |
| Descripcion | varchar(20) | no |  |  |  |

### EmergenciaTipoVehiculo

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdTipoVehiculo | int | no |  |  | PK |
| Descripcion | varchar(20) | no |  |  |  |

### EmergenciaUbicacionLesionado

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdUbicacionLesionado | int | no |  |  | PK |
| Descripcion | varchar(20) | no |  |  |  |

### Empleados

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdEmpleado | int | no | sí |  | PK |
| ApellidoPaterno | varchar(50) | no |  |  |  |
| ApellidoMaterno | varchar(50) | no |  |  |  |
| Nombres | varchar(50) | no |  |  |  |
| IdCondicionTrabajo | int | no |  |  |  |
| IdTipoEmpleado | int | no |  |  |  |
| DNI | varchar(20) | sí |  |  |  |
| CodigoPlanilla | varchar(20) | sí |  |  |  |
| FechaIngreso | datetime | sí |  |  |  |
| FechaAlta | datetime | sí |  |  |  |
| Usuario | varchar(20) | sí |  |  |  |
| Clave | varchar(200) | sí |  |  |  |
| loginEstado | int | sí |  |  |  |
| loginPC | varchar(50) | sí |  |  |  |
| FechaNacimiento | datetime | sí |  |  |  |
| idTipoDestacado | int | sí |  |  |  |
| IdEstablecimientoExterno | int | sí |  |  |  |
| HisCodigoDigitador | varchar(20) | sí |  |  |  |
| ReniecAutorizado | bit | sí |  |  |  |
| idTipoDocumento | int | sí |  |  |  |
| idSupervisor | int | sí |  |  |  |
| esActivo | bit | sí |  |  |  |
| AccedeVWeb | bit | sí |  |  |  |
| ClaveVWeb | varchar(150) | sí |  |  |  |
| Ris_estado | nchar(10) | sí |  |  |  |
| telefono | varchar(15) | sí |  |  |  |
| correo | varchar(100) | sí |  |  |  |
| Interconsultas | int | sí |  | (0) |  |
| esAuditor | int | sí |  | (0) |  |
| sexo | int | sí |  |  |  |
| pais | int | sí |  |  |  |
| AccesoCE | int | sí |  |  |  |
| idArea | int | sí |  | (0) |  |
| idSexo | int | sí |  |  |  |
| claveWebNuevo | varchar(200) | sí |  |  |  |
| Password | varchar(100) | sí |  |  |  |
| Foto | varchar(max) | sí |  |  |  |

Claves foráneas:

- `IdCondicionTrabajo` → `dbo.TiposCondicionTrabajo.IdCondicionTrabajo` (TiposCondicionTrabajo_Empleados_FK1)
- `IdTipoEmpleado` → `dbo.TiposEmpleado.IdTipoEmpleado` (TiposEmpleado_Empleados_FK1)

### Empleados2

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdEmpleado | int | no | sí |  | PK |
| ApellidoPaterno | varchar(50) | no |  |  |  |
| ApellidoMaterno | varchar(50) | no |  |  |  |
| Nombres | varchar(50) | no |  |  |  |
| IdCondicionTrabajo | int | no |  |  |  |
| IdTipoEmpleado | int | no |  |  |  |
| DNI | char(20) | no |  |  |  |
| CodigoPlanilla | varchar(8) | no |  |  |  |
| FechaIngreso | datetime | sí |  |  |  |
| FechaAlta | datetime | sí |  |  |  |
| Usuario | varchar(20) | sí |  |  |  |
| Clave | varchar(200) | sí |  |  |  |
| loginEstado | int | sí |  |  |  |
| loginPC | varchar(50) | sí |  |  |  |
| FechaNacimiento | datetime | sí |  |  |  |
| idTipoDestacado | int | sí |  |  |  |
| IdEstablecimientoExterno | int | sí |  |  |  |
| HisCodigoDigitador | varchar(20) | sí |  |  |  |
| ReniecAutorizado | bit | sí |  |  |  |
| idTipoDocumento | int | sí |  |  |  |
| idSupervisor | int | sí |  |  |  |
| esActivo | bit | sí |  |  |  |
| AccedeVWeb | bit | sí |  |  |  |
| ClaveVWeb | varchar(150) | sí |  |  |  |
| Ris_estado | nchar(10) | sí |  |  |  |
| telefono | varchar(15) | sí |  |  |  |
| correo | varchar(100) | sí |  |  |  |
| Interconsultas | int | sí |  |  |  |
| esAuditor | int | sí |  |  |  |
| sexo | int | sí |  |  |  |
| pais | int | sí |  |  |  |
| AccesoCE | int | sí |  |  |  |
| idArea | int | sí |  |  |  |
| idSexo | int | sí |  |  |  |

### EmpleadosAccesos

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| Id | int | no | sí |  |  |
| idempleado | int | sí |  |  |  |
| LoginPC | varchar(50) | sí |  |  |  |
| loginEstado | int | sí |  |  |  |
| Fecha | datetime | sí |  |  |  |

### EmpleadosCargos

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| idEmpleado | int | sí |  |  |  |
| idCargo | int | sí |  |  |  |

### EmpleadosLugarDeTrabajo

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| idEmpleado | int | no |  |  |  |
| idLaboraArea | int | no |  |  |  |
| idLaboraSubArea | int | sí |  |  |  |

### Endodoncia

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| Id | int | no | sí |  | PK |
| OdontogramaVersionId | int | no |  |  |  |
| NumeroDiente | tinyint | no |  |  |  |
| Conductos | int | sí |  |  |  |
| Estado | nvarchar(50) | sí |  |  |  |
| Color | nvarchar(30) | sí |  |  |  |
| Metadata | nvarchar(max) | sí |  |  |  |
| Fecha_Creacion | datetime2 | no |  | getdate() |  |
| Usuario_Creacion | nvarchar(100) | sí |  |  |  |

Claves foráneas:

- `OdontogramaVersionId` → `dbo.OdontogramaVersion.Id` (FK_Endodoncia_Version)

### Enfermeria_CatalogoDominios

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdDominio | int | no |  |  | PK |
| CodDominio | varchar(50) | sí |  |  |  |
| DominioTexto | varchar(200) | sí |  |  |  |

### Enfermeria_CatalogoValoresCombo

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdVariable | int | no |  |  | PK |
| IdValorCombo | int | no |  |  | PK |
| ComboTexto | varchar(50) | no |  |  |  |

Claves foráneas:

- `IdVariable` → `dbo.Enfermeria_CatalogoVariables.IdVariable` (FK_Enfermeria_CatalogoVariables_Enfermeria_CatalogoValoresCombo)

### Enfermeria_CatalogoVariables

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdVariable | int | no |  |  | PK |
| IdDominio | int | no |  |  |  |
| OrdernDominio | int | no |  |  |  |
| Texto | varchar(200) | no |  |  |  |
| Tipo | varchar(20) | no |  |  |  |
| Ancho | int | no |  |  |  |
| EsDatoObligatorio | bit | no |  |  |  |
| TextoTooltip | varchar(200) | sí |  |  |  |
| EsDatoGrafico | bit | no |  |  |  |
| TieneFormatoMask | bit | no |  |  |  |
| FormatoMask | varchar(50) | sí |  |  |  |
| TieneRango | bit | no |  |  |  |
| RangoInicial | int | sí |  |  |  |
| RangoFinal | int | sí |  |  |  |
| PosicionFila | int | sí |  |  |  |
| PosicionColumna | int | sí |  |  |  |

Claves foráneas:

- `IdDominio` → `dbo.Enfermeria_CatalogoDominios.IdDominio` (FK_Enfermeria_CatalogoVariables_Enfermeria_CatalogoDominios)

### Enfermeria_TratamientoDosis

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdCuentaAtencion | int | no |  |  | PK |
| IdVisita | int | no |  |  | PK |
| IdDiaVisita | int | no |  |  | PK |
| IdReceta | int | no |  |  | PK |
| IdItem | int | no |  |  | PK |
| Dosis | int | sí |  |  |  |
| DatoProrenata | int | sí |  |  |  |

Claves foráneas:

- `IdCuentaAtencion` → `dbo.Enfermeria_Visitas.IdCuentaAtencion` (FK_Enfermeria_TratamientoDosis_Enfermeria_Visitas)
- `IdVisita` → `dbo.Enfermeria_Visitas.IdVisita` (FK_Enfermeria_TratamientoDosis_Enfermeria_Visitas)
- `IdItem` → `dbo.RecetaDetalle.idItem` (FK_Enfermeria_TratamientoDosis_RecetaDetalle)
- `IdReceta` → `dbo.RecetaDetalle.idReceta` (FK_Enfermeria_TratamientoDosis_RecetaDetalle)

### Enfermeria_ValoresCombo

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdCuentaAtencion | int | no |  |  | PK |
| IdVisita | int | no |  |  | PK |
| IdVariable | int | no |  |  | PK |
| IdValorCombo | int | no |  |  | PK |

Claves foráneas:

- `IdValorCombo` → `dbo.Enfermeria_CatalogoValoresCombo.IdValorCombo` (FK_Enfermeria_ValoresCombo_Enfermeria_CatalogoValoresCombo)
- `IdVariable` → `dbo.Enfermeria_CatalogoValoresCombo.IdVariable` (FK_Enfermeria_ValoresCombo_Enfermeria_CatalogoValoresCombo)
- `IdCuentaAtencion` → `dbo.Enfermeria_Variables.IdCuentaAtencion` (FK_Enfermeria_ValoresCombo_Enfermeria_Variables)
- `IdVariable` → `dbo.Enfermeria_Variables.IdVariable` (FK_Enfermeria_ValoresCombo_Enfermeria_Variables)
- `IdVisita` → `dbo.Enfermeria_Variables.IdVisita` (FK_Enfermeria_ValoresCombo_Enfermeria_Variables)

### Enfermeria_Variables

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdCuentaAtencion | int | no |  |  | PK |
| IdVisita | int | no |  |  | PK |
| IdVariable | int | no |  |  | PK |
| VariableDato | varchar(200) | sí |  |  |  |

Claves foráneas:

- `IdVariable` → `dbo.Enfermeria_CatalogoVariables.IdVariable` (FK_Enfermeria_Variables_Enfermeria_CatalogoVariables)
- `IdVisita` → `dbo.Enfermeria_Visitas.IdVisita` (FK_Enfermeria_Variables_Enfermeria_Visitas)
- `IdCuentaAtencion` → `dbo.Enfermeria_Visitas.IdCuentaAtencion` (FK_Enfermeria_Variables_Enfermeria_Visitas)

### Enfermeria_Visitas

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdCuentaAtencion | int | no |  |  | PK |
| IdVisita | int | no |  |  | PK |
| FechaHoraVisita | datetime | no |  |  |  |
| IdServicio | int | no |  |  |  |
| Observaciones | varchar(1000) | sí |  |  |  |
| IdCama | int | no |  |  |  |
| IdEmpleadoEnfermera | int | no |  |  |  |
| IngresoValorizacion | bit | sí |  |  |  |

Claves foráneas:

- `IdCuentaAtencion` → `dbo.FacturacionCuentasAtencion.IdCuentaAtencion` (FK_Enfermeria_Visitas_FacturacionCuentasAtencion)

### EntrevistaPacienteCE

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| id | int | no | sí |  | PK |
| IdCuentaAtencion | int | sí |  |  |  |
| NroHistoriaClinica | int | sí |  |  |  |
| IdPaciente | int | sí |  |  |  |
| IdClasificacionPaciente | int | sí |  |  |  |
| NroControles | int | sí |  |  |  |
| EdadGestacional | decimal(18,0) | sí |  |  |  |
| NroGestas | int | sí |  |  |  |
| IdUsuario | int | sí |  |  |  |
| FechaRegistro | datetime | sí |  |  |  |

### EquivalenciaCPT_SMI

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| codigoCPT | varchar(20) | no |  |  |  |
| codigoSMI | varchar(3) | no |  |  |  |

### Erupcion

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| Id | int | no | sí |  | PK |
| OdontogramaVersionId | int | no |  |  |  |
| NumeroDiente | tinyint | no |  |  |  |
| ProgresoPct | decimal(5,2) | sí |  |  |  |
| Color | nvarchar(30) | sí |  |  |  |
| Metadata | nvarchar(max) | sí |  |  |  |
| Fecha_Creacion | datetime2 | no |  | getdate() |  |
| Usuario_Creacion | nvarchar(100) | sí |  |  |  |

Claves foráneas:

- `OdontogramaVersionId` → `dbo.OdontogramaVersion.Id` (FK_Erupcion_Version)

### EspecialidadCE

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdEspecialidadCE | int | no | sí |  | PK |
| IdEspecialidad | int | no |  |  |  |
| TiempoPromedioAtencion | int | sí |  |  |  |
| IdProductoConsulta | int | sí |  |  |  |
| IdProductoInterconsulta | int | sí |  |  |  |

Claves foráneas:

- `IdProductoConsulta` → `dbo.FactCatalogoServicios.IdProducto` (CatalogoServicios_EspecialidadCE_FK1)
- `IdProductoInterconsulta` → `dbo.FactCatalogoServicios.IdProducto` (CatalogoServicios_EspecialidadCE_FK2)
- `IdEspecialidad` → `dbo.Especialidades.IdEspecialidad` (Especialidades_EspecialidadCE_FK1)

### Especialidades

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdEspecialidad | int | no | sí |  | PK |
| Nombre | varchar(50) | no |  |  |  |
| IdDepartamento | int | no |  |  |  |
| TiempoPromedioAtencion | int | sí |  |  |  |
| MedicoNoMedico | int | sí |  |  |  |

Claves foráneas:

- `IdDepartamento` → `dbo.DepartamentosHospital.IdDepartamento` (DepartamentosHospital_Especialidades_FK1)

### especialidades_interconsulta

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdEspecialidad | int | no |  |  | PK |
| Nombre | varchar(255) | no |  |  |  |
| CodigoCPTParticular | varchar(50) | sí |  |  |  |
| CodigoCPTSIS | varchar(50) | sí |  |  |  |

### EspecialidadReferencia

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| id_especialidad_ref | int | sí |  |  |  |
| id_codigo_ref | varchar(10) | sí |  |  |  |
| desc_especialidad_ref | varchar(100) | sí |  |  |  |

### EspecialidadTipoEmpleado

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| idespecialidad | int | sí |  |  |  |
| idTipoEmpleado | int | sí |  |  |  |

### Especie

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| id_especie | int | no | sí |  | PK |
| nombre | varchar(50) | no |  |  |  |

### Espigo

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| Id | int | no | sí |  | PK |
| OdontogramaVersionId | int | no |  |  |  |
| NumeroDiente | tinyint | no |  |  |  |
| Tipo | nvarchar(30) | sí |  |  |  |
| Color | nvarchar(30) | sí |  |  |  |
| Metadata | nvarchar(max) | sí |  |  |  |
| Fecha_Creacion | datetime2 | no |  | getdate() |  |
| Usuario_Creacion | nvarchar(100) | sí |  |  |  |

Claves foráneas:

- `OdontogramaVersionId` → `dbo.OdontogramaVersion.Id` (FK_Espigo_Version)

### Establecimientos

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdEstablecimiento | int | no |  |  | PK |
| Codigo | varchar(10) | no |  |  |  |
| Nombre | varchar(250) | no |  |  |  |
| IdDistrito | int | sí |  |  |  |
| IdTipoSubsector | int | sí |  |  |  |
| IdTipo | int | sí |  |  |  |
| CodigoInstitucion | varchar(50) | sí |  |  |  |
| CodigoClasificación | varchar(50) | sí |  |  |  |
| codigoTipo | int | sí |  |  |  |
| CódigoDISA | int | sí |  |  |  |
| Dirección | varchar(800) | sí |  |  |  |
| Cnorte | varchar(150) | sí |  |  |  |
| Ceste | varchar(150) | sí |  |  |  |
| Cota | numeric(18,0) | sí |  |  |  |
| CodigoTipoCat | int | sí |  |  |  |
| Estado | int | sí |  |  |  |
| CodigoRed | int | sí |  |  |  |
| CodigoMicrorred | int | sí |  |  |  |
| Telefono | varchar(50) | sí |  |  |  |
| Horario | varchar(150) | sí |  |  |  |

Claves foráneas:

- `IdDistrito` → `dbo.Distritos.IdDistrito` (Distritos_Establecimientos_FK1)
- `IdTipo` → `dbo.TiposEstablecimientos.IdTipo` (TiposEstablecimientos_Establecimientos_FK1)

### EstablecimientosNoMinsa

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdEstablecimientoNoMinsa | int | no | sí |  | PK |
| Nombre | varchar(250) | sí |  |  |  |
| IdTipoSubsector | int | sí |  |  |  |
| IdDistrito | varchar(50) | sí |  |  |  |
| codigo | varchar(10) | sí |  |  |  |
| CodigoInstitucion | varchar(50) | sí |  |  |  |
| CodigoClasificación | varchar(50) | sí |  |  |  |
| codigoTipo | int | sí |  |  |  |
| CódigoDISA | int | sí |  |  |  |
| Dirección | varchar(500) | sí |  |  |  |
| Cnorte | varchar(50) | sí |  |  |  |
| Ceste | varchar(50) | sí |  |  |  |
| Cota | numeric(18,0) | sí |  |  |  |
| CodigoTipoCat | int | sí |  |  |  |
| Estado | int | sí |  |  |  |
| CodigoRed | int | sí |  |  |  |
| CodigoMicrorred | int | sí |  |  |  |
| Telefono | varchar(50) | sí |  |  |  |
| Horario | varchar(150) | sí |  |  |  |

Claves foráneas:

- `IdTipoSubsector` → `dbo.TiposSubsector.IdTipoSubsector` (TiposSubsector_EstablecimientosNoMinsa_FK1)

### EstadosAtencion

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdEstadoAtencion | int | no |  |  | PK |
| Descripcion | varchar(20) | sí |  |  |  |

### EstadosCama

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdEstadoCama | int | no |  |  | PK |
| Descripcion | varchar(50) | no |  |  |  |

### EstadosCuenta

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdEstado | int | no |  |  | PK |
| Descripcion | varchar(50) | no |  |  |  |

### EstadosDevoluciones

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| idEstadoDevolucion | int | no |  |  | PK |
| Estado | varchar(30) | sí |  |  |  |

### EstadosFacturacion

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdEstadoFacturacion | int | no |  |  | PK |
| Descripcion | varchar(20) | sí |  |  |  |

### EstadosHistoriaClinica

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdEstadoHistoria | int | no |  |  | PK |
| Descripcion | varchar(50) | no |  |  |  |

### EstadosMovimientoHistoria

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdEstadoMovimiento | int | no |  |  | PK |
| Descripcion | varchar(50) | no |  |  |  |

### EstadosOrden

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdEstadoOrden | int | no |  |  | PK |
| descripcion | varchar(20) | no |  |  |  |

### EstadosReembolso

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| idEstadoReembolso | int | no |  |  | PK |
| Estado | varchar(10) | no |  |  |  |

### EtapasCirugiaCQx

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdEtapasCirugiaCQx | int | no |  |  | PK |
| Descripcion | nchar(100) | no |  |  |  |
| EstadoReg | bit | sí |  |  |  |
| IdUsuario | int | sí |  |  |  |
| Estacion | varchar(40) | sí |  |  |  |
| FechaReg | datetime | sí |  |  |  |

### EvaluacionEmergencia

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdEvaluacion | int | no | sí |  | PK |
| IdAtencion | int | sí |  |  |  |
| FechaUR | varchar(50) | sí |  |  |  |
| FechaPP | varchar(50) | sí |  |  |  |
| EdadGestacional | int | sí |  |  |  |
| Cnp | int | sí |  |  |  |
| Dolor | int | sí |  |  |  |
| Convulsiones | int | sí |  |  |  |
| Fiebre | int | sí |  |  |  |
| Vomitos | int | sí |  |  |  |
| ContraccionesU | int | sí |  |  |  |
| SangradoV | int | sí |  |  |  |
| PerdidaLA | int | sí |  |  |  |
| AusenciaMF | int | sí |  |  |  |
| SintomasU | int | sí |  |  |  |
| FlujoV | int | sí |  |  |  |
| Tumoracion | int | sí |  |  |  |
| AlteracionesM | int | sí |  |  |  |
| Antecedentes | text | sí |  |  |  |
| EnfermedadA | text | sí |  |  |  |
| fechaRegistro | datetime | sí |  |  |  |
| IdUsuario | int | sí |  |  |  |
| IdUsuarioModifica | int | sí |  |  |  |
| UltRegla | int | sí |  |  |  |
| FechaEco | varchar(50) | sí |  |  |  |
| GMotiA | int | sí |  |  |  |
| PMotiA | int | sí |  |  |  |
| FechaEcoAct | int | sí |  |  |  |
| DisMovFetales | int | sí |  |  |  |
| PesoFetalAnt | varchar(10) | sí |  |  |  |
| Prioridad | int | sí |  |  |  |
| Glasgow | int | sí |  |  |  |
| ObservacionTriaje | varchar(2000) | sí |  |  |  |
| DiasGestacional | int | sí |  |  |  |
| CalculaFE | int | sí |  |  |  |
| DiasGestacionalEco | int | sí |  |  |  |
| SemanaGestacionalEco | int | sí |  |  |  |
| idNumero | int | sí |  |  |  |
| idServicio | int | sí |  |  |  |
| Pin | varchar(50) | sí |  |  |  |
| DeltaPeso | decimal(18,2) | sí |  |  |  |
| MaduracionPulmonar | int | sí |  |  |  |
| MaduracionCervical | int | sí |  |  |  |
| Ram | varchar(max) | sí |  |  |  |
| TransfucionSangre | int | sí |  |  |  |
| AntecedentesQuirurgicos | text | sí |  |  |  |
| ContraccionesUterinasDesc | text | sí |  |  |  |
| PerdidaLiquidoAmnioticoDesc | text | sí |  |  |  |
| MovimientoFetalesDesc | text | sí |  |  |  |
| SangradoVaginalDesc | text | sí |  |  |  |
| FiebreDesc | text | sí |  |  |  |
| SgIrritacionCorticalDesc | text | sí |  |  |  |
| SgIrritacionCortical | int | sí |  |  |  |
| Sintomas | text | sí |  |  |  |
| MaduracionPulmonarDesc | text | sí |  |  |  |
| MaduracionCervicalDesc | text | sí |  |  |  |
| DescripcionExamenFisico | text | sí |  |  |  |
| Tratamiento | text | sí |  |  |  |
| tieneAlta | int | sí |  |  |  |
| TiempoEnfermedad | varchar(50) | sí |  |  |  |
| Inicio | varchar(50) | sí |  |  |  |
| Curso | varchar(50) | sí |  |  |  |
| DificultadRespiratoria | int | sí |  |  |  |
| Diarrea | int | sí |  |  |  |
| DistensionAbdominal | int | sí |  |  |  |
| Cianosis | int | sí |  |  |  |
| MalOlorOmbligo | int | sí |  |  |  |
| Ictericia | int | sí |  |  |  |
| Hemorragia | int | sí |  |  |  |
| Otros | int | sí |  |  |  |
| OtrosSintomas | varchar(50) | sí |  |  |  |
| Relato | text | sí |  |  |  |

Claves foráneas:

- `IdAtencion` → `dbo.Atenciones.IdAtencion` (FK_EvaluacionEmergencia_Atenciones)

### EvaluacionEmergenciaDetalle

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdEvaluacionDetalle | int | no | sí |  | PK |
| IdAtencion | int | sí |  |  |  |
| IdNumero | int | sí |  |  |  |
| Seguimiento | text | sí |  |  |  |
| Indicaciones | text | sí |  |  |  |
| IdUsuario | int | sí |  |  |  |
| fecha | datetime | sí |  |  |  |
| PlandeTrabajo | text | sí |  |  |  |
| FechaActualizacion | datetime | sí |  |  |  |
| idServicio | int | sí |  |  |  |
| HoraInicioAtencion | char(5) | sí |  |  |  |
| DescripcionExamenFisico | nvarchar(max) | sí |  |  |  |
| Tratamiento | nvarchar(max) | sí |  |  |  |
| IdCama | int | sí |  |  |  |
| FechaRegistro | datetime | sí |  |  |  |

Claves foráneas:

- `IdAtencion` → `dbo.Atenciones.IdAtencion` (FK_EvaluacionEmergenciaDetalle_Atenciones)

### ExamenGinecoObstetra

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdExamen | int | no | sí |  | PK |
| IdAtencion | int | sí |  |  |  |
| LGeBus | int | sí |  |  |  |
| LVagina | int | sí |  |  |  |
| LCervix | int | sí |  |  |  |
| LUtero | int | sí |  |  |  |
| DGeBus | varchar(2000) | sí |  |  |  |
| DVagina | varchar(2000) | sí |  |  |  |
| DCervix | varchar(2000) | sí |  |  |  |
| DUtero | varchar(2000) | sí |  |  |  |
| LAnexos | int | sí |  |  |  |
| LDouglas | int | sí |  |  |  |
| LParametros | int | sí |  |  |  |
| LMamas | int | sí |  |  |  |
| DAnexos | varchar(2000) | sí |  |  |  |
| DDouglas | varchar(2000) | sí |  |  |  |
| DParametros | varchar(2000) | sí |  |  |  |
| DMamas | varchar(2000) | sí |  |  |  |
| LUA | int | sí |  |  |  |
| LLCF | int | sí |  |  |  |
| LDU | int | sí |  |  |  |
| LSituacion | int | sí |  |  |  |
| LPosicion | int | sí |  |  |  |
| LPresentacion | int | sí |  |  |  |
| LDips | int | sí |  |  |  |
| DF1Spp | varchar(10) | sí |  |  |  |
| DF2Spp | varchar(10) | sí |  |  |  |
| DF3Spp | varchar(10) | sí |  |  |  |
| LF1Lcf | int | sí |  |  |  |
| LF2Lcf | int | sí |  |  |  |
| LF3Lcf | int | sí |  |  |  |
| LSoplos | int | sí |  |  |  |
| LHidraminios | int | sí |  |  |  |
| LPonderado | int | sí |  |  |  |
| LDilatacion | int | sí |  |  |  |
| LIncorporacion | int | sí |  |  |  |
| LAlPresent | varchar(50) | sí |  |  |  |
| DVarPresent | varchar(50) | sí |  |  |  |
| LProcubito | int | sí |  |  |  |
| LProlapso | int | sí |  |  |  |
| DSangradoV | varchar(50) | sí |  |  |  |
| LLiquidoA | int | sí |  |  |  |
| LCompatibilidadF | int | sí |  |  |  |
| DObservaciones | varchar(2000) | sí |  |  |  |
| LEstadoGeneral | int | sí |  |  |  |
| LAparatoCV | int | sí |  |  |  |
| LAbdomen | int | sí |  |  |  |
| LAparatoR | int | sí |  |  |  |
| LAparatoU | int | sí |  |  |  |
| LExtremidades | int | sí |  |  |  |
| DEstadoGeneral | varchar(2000) | sí |  |  |  |
| DAparatoCV | varchar(2000) | sí |  |  |  |
| DAbdomen | varchar(2000) | sí |  |  |  |
| DAparatoR | varchar(2000) | sí |  |  |  |
| DAparatoU | varchar(2000) | sí |  |  |  |
| DExtremidades | varchar(2000) | sí |  |  |  |
| LTipoEmbarazo | int | sí |  |  |  |
| LPelvimetriaSup | int | sí |  |  |  |
| LPelvimetriaMed | int | sí |  |  |  |
| LPelvimetriaInf | int | sí |  |  |  |
| LTipoTactoVaginal | int | sí |  |  |  |
| LPelvisGinecoide | int | sí |  |  |  |
| DEdemas | varchar(50) | sí |  |  |  |
| DReflejos | varchar(50) | sí |  |  |  |
| IdUsuario | int | sí |  |  |  |
| ObservacionGinecologica | varchar(max) | sí |  |  |  |
| Claro | int | sí |  |  |  |
| Meconial | int | sí |  |  |  |
| Sanguinolento | int | sí |  |  |  |
| MalOlor | int | sí |  |  |  |
| PelvisGineDesc | varchar(20) | sí |  |  |  |
| MembranasRotas | int | sí |  |  |  |
| Proteinura | varchar(50) | sí |  |  |  |
| MovFetales | varchar(50) | sí |  |  |  |
| MFF01 | varchar(50) | sí |  |  |  |
| MFF02 | varchar(50) | sí |  |  |  |
| MFF03 | varchar(50) | sí |  |  |  |
| SignosAlarma | text | sí |  |  |  |
| Pap | bit | sí |  |  |  |
| NroFetos | int | sí |  |  |  |
| DObservacionesObstetricas | text | sí |  |  |  |
| ScoreFlamm | varchar(max) | sí |  |  |  |
| Bishop | varchar(max) | sí |  |  |  |
| idNumero | int | sí |  |  |  |
| idServicio | int | sí |  |  |  |
| LNeurologico | int | sí |  |  |  |
| DNeurologico | varchar(max) | sí |  |  |  |

Claves foráneas:

- `IdAtencion` → `dbo.Atenciones.IdAtencion` (FK_ExamenGinecoObstetra_Atenciones)

### ExamenSolicitadoBaciloscopia

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdExSolicitado | int | no | sí |  |  |
| Descripcion | varchar(50) | sí |  |  |  |

### Extruida

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| Id | int | no | sí |  | PK |
| OdontogramaVersionId | int | no |  |  |  |
| NumeroDiente | tinyint | no |  |  |  |
| MagnitudMM | decimal(5,2) | sí |  |  |  |
| Color | nvarchar(30) | sí |  |  |  |
| Metadata | nvarchar(max) | sí |  |  |  |
| Fecha_Creacion | datetime2 | no |  | getdate() |  |
| Usuario_Creacion | nvarchar(100) | sí |  |  |  |

Claves foráneas:

- `OdontogramaVersionId` → `dbo.OdontogramaVersion.Id` (FK_Extruida_Version)

### FactCatalogoBienesInsumos

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdProducto | int | no | sí |  | PK |
| Codigo | varchar(7) | no |  |  |  |
| Nombre | varchar(300) | no |  |  |  |
| NombreComercial | varchar(100) | sí |  |  |  |
| IdGrupoFarmacologico | int | sí |  |  |  |
| IdSubGrupoFarmacologico | int | sí |  |  |  |
| IdPartida | int | sí |  |  |  |
| IdCentroCosto | int | sí |  |  |  |
| PrecioCompra | money | sí |  |  |  |
| PrecioDistribucion | money | sí |  |  |  |
| PrecioDonacion | money | sí |  |  |  |
| PrecioUltCompra | money | sí |  |  |  |
| idTipoSalidaBienInsumo | int | no |  |  |  |
| StockMinimo | int | sí |  |  |  |
| TipoProducto | int | sí |  |  |  |
| Denominacion | varchar(100) | sí |  |  |  |
| Concentracion | varchar(100) | sí |  |  |  |
| Presentacion | varchar(100) | sí |  |  |  |
| FormaFarmaceutica | varchar(10) | sí |  |  |  |
| MaterialEnvase | varchar(100) | sí |  |  |  |
| PresentacionEnvase | varchar(100) | sí |  |  |  |
| Fabricante | varchar(100) | sí |  |  |  |
| IdPaisOrigen | int | sí |  |  |  |
| Petitorio | bit | sí |  |  |  |
| TipoProductoSismed | varchar(1) | sí |  |  |  |
| CodigoSiga | varchar(20) | sí |  |  |  |
| Estado | int | sí |  |  |  |
| IdPetitorioSis | int | sí |  |  |  |
| FechaActa | date | sí |  |  |  |
| NumeroActa | varchar(50) | sí |  |  |  |

Claves foráneas:

- `IdCentroCosto` → `dbo.CentrosCosto.IdCentroCosto` (CentrosCosto_CatalogoBienesInsumos_FK1)
- `idTipoSalidaBienInsumo` → `dbo.farmTipoSalidaBienInsumo.idTipoSalidaBienInsumo` (FK_FactCatalogoBienesInsumos_farmTipoSalidaBienInsumo)
- `IdGrupoFarmacologico` → `dbo.FactInsumosGrupoFarmacologico.IdGrupoFarmacologico` (InsumosGrupoFarmacologico_CatalogoBienesInsumos_FK1)
- `IdSubGrupoFarmacologico` → `dbo.FactInsumosSubGrupoFarmacologico.IdSubGrupoFarmacologico` (InsumosSubGrupoFarmacologico_CatalogoBienesInsumos_FK1)
- `IdPartida` → `dbo.FactPartidasPresupuestales.IdPartidaPresupuestal` (PartidasPresupuestales_CatalogoBienesInsumos_FK1)

### FactCatalogoBienesInsumosHosp

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdPlanCatalogo | int | no | sí |  | PK |
| PrecioUnitario | money | no |  |  |  |
| IdProducto | int | no |  |  |  |
| IdTipoFinanciamiento | int | no |  |  |  |
| Activo | bit | no |  |  |  |

Claves foráneas:

- `IdProducto` → `dbo.FactCatalogoBienesInsumos.IdProducto` (CatalogoBienesInsumos_PlanesCatalogoBienesInsumos_FK1)
- `IdTipoFinanciamiento` → `dbo.TiposFinanciamiento.IdTipoFinanciamiento` (TiposFinanciamiento_FinanciamientoCatalogoBienesInsumos_FK1)

### FactCatalogoPaquete

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| idFactPaquete | int | no | sí |  | PK |
| Codigo | nvarchar(10) | no |  |  |  |
| Descripcion | nvarchar(100) | no |  |  |  |
| idTipoFinanciamiento | int | no |  | (1) |  |
| FechaCreacion | smalldatetime | no |  |  |  |
| idUsuario | int | no |  | (738) |  |
| idEstado | int | no |  |  |  |
| TipoPaquete | int | sí |  |  |  |
| IdPuntoCarga | int | sí |  |  |  |

### FactCatalogoServicios

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdProducto | int | no | sí |  | PK |
| Codigo | varchar(20) | no |  |  |  |
| Nombre | varchar(255) | no |  |  |  |
| IdServicioGrupo | int | sí |  |  |  |
| IdServicioSubGrupo | int | sí |  |  |  |
| IdServicioSeccion | int | sí |  |  |  |
| IdServicioSubSeccion | int | sí |  |  |  |
| IdPartida | int | sí |  |  |  |
| IdCentroCosto | int | sí |  |  |  |
| CodMINSA | varchar(20) | sí |  |  |  |
| CodMINSAnoActualiza | bit | sí |  |  |  |
| EsCPT | int | sí |  |  |  |
| idOpcs | int | sí |  |  |  |
| NombreMINSA | varchar(255) | sí |  |  |  |
| idEstado | int | sí |  |  |  |
| codigoSIS | varchar(20) | sí |  |  |  |
| NoCubreSIS | bit | sí |  |  |  |

Claves foráneas:

- `IdServicioGrupo` → `dbo.FactCatalogoServiciosGrupo.IdServicioGrupo` (CatalogoServiciosGrupo_CatalogoServicios_FK1)
- `IdServicioSeccion` → `dbo.FactCatalogoServiciosSeccion.IdServicioSeccion` (CatalogoServiciosSeccion_CatalogoServicios_FK1)
- `IdServicioSubSeccion` → `dbo.FactCatalogoServiciosSubSeccion.IdServicioSubSeccion` (CatalogoServiciosSubSeccion_CatalogoServicios_FK1)
- `IdCentroCosto` → `dbo.CentrosCosto.IdCentroCosto` (CentrosCosto_CatalogoServicios_FK1)
- `IdServicioSubGrupo` → `dbo.FactCatalogoServiciosSubGrupo.IdServicioSubGrupo` (FactCatalogoServiciosSubGrupo_FactCatalogoServicios_FK1)
- `IdPartida` → `dbo.FactPartidasPresupuestales.IdPartidaPresupuestal` (PartidasPresupuestales_CatalogoServicios_FK1)

### FactCatalogoServiciosGrupo

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdServicioGrupo | int | no |  |  | PK |
| Codigo | char(10) | no |  |  |  |
| Descripcion | varchar(255) | no |  |  |  |

### FactCatalogoServiciosHosp

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdFinanciamientoCatalogo | int | no | sí |  | PK |
| PrecioUnitario | money | no |  |  |  |
| IdProducto | int | no |  |  |  |
| IdTipoFinanciamiento | int | no |  |  |  |
| Activo | bit | no |  |  |  |
| SeUsaSinPrecio | bit | sí |  | (0) |  |

Claves foráneas:

- `IdProducto` → `dbo.FactCatalogoServicios.IdProducto` (CatalogoServicios_PlanesCatalogosServicios_FK1)
- `IdTipoFinanciamiento` → `dbo.TiposFinanciamiento.IdTipoFinanciamiento` (TiposFinanciamiento_FinanciamientoCatalogosServicios_FK1)

### FactCatalogoServiciosHospTIPO1

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdFinanciamientoCatalogo | int | no | sí |  |  |
| PrecioUnitario | money | no |  |  |  |
| IdProducto | int | no |  |  |  |
| IdTipoFinanciamiento | int | no |  |  |  |
| Activo | bit | no |  |  |  |
| SeUsaSinPrecio | bit | sí |  |  |  |

### FactCatalogoServiciosPtos

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| idPuntoCarga | int | no |  |  |  |
| idProducto | int | no |  |  |  |
| EsPreVenta | bit | sí |  |  |  |

Claves foráneas:

- `idProducto` → `dbo.FactCatalogoServicios.IdProducto` (FK_FactCatalogoServiciosCpt_FactCatalogoServicios)
- `idPuntoCarga` → `dbo.FactPuntosCarga.IdPuntoCarga` (FK_FactCatalogoServiciosCpt_FactPuntosCarga)

### FactCatalogoServiciosSeccion

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdServicioSeccion | int | no |  |  | PK |
| Codigo | varchar(10) | no |  |  |  |
| Descripcion | varchar(255) | no |  |  |  |
| IdServicioSubGrupo | int | sí |  |  |  |

Claves foráneas:

- `IdServicioSubGrupo` → `dbo.FactCatalogoServiciosSubGrupo.IdServicioSubGrupo` (FactCatalogoServiciosSubGrupo_FactCatalogoServiciosSeccion_FK1)

### FactCatalogoServiciosSubGrupo

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdServicioSubGrupo | int | no |  |  | PK |
| Descripcion | varchar(255) | sí |  |  |  |
| IdServicioGrupo | int | sí |  |  |  |
| Codigo | char(10) | sí |  |  |  |

Claves foráneas:

- `IdServicioGrupo` → `dbo.FactCatalogoServiciosGrupo.IdServicioGrupo` (CatalogoServiciosGrupo_CatalogoServiciosSeccion_FK1)

### FactCatalogoServiciosSubSeccion

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdServicioSubSeccion | int | no |  |  | PK |
| Codigo | varchar(10) | no |  |  |  |
| Descripcion | varchar(255) | no |  |  |  |
| IdServicioSeccion | int | no |  |  |  |

Claves foráneas:

- `IdServicioSeccion` → `dbo.FactCatalogoServiciosSeccion.IdServicioSeccion` (CatalogoServiciosSeccion_CatalogoServiciosSubSeccion_FK1)

### FactInsumosGrupoFarmacologico

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdGrupoFarmacologico | int | no |  |  | PK |
| Descripcion | varchar(255) | no |  |  |  |

### FactInsumosSubGrupoFarmacologico

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdSubGrupoFarmacologico | int | no |  |  | PK |
| Descripcion | varchar(255) | no |  |  |  |
| IdGrupoFarmacologico | int | sí |  |  |  |

Claves foráneas:

- `IdGrupoFarmacologico` → `dbo.FactInsumosGrupoFarmacologico.IdGrupoFarmacologico` (InsumosGrupoFarmacologico_InsumosSubGrupoFarmacologico_FK1)

### FactOrdenesBienes

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| idOrden | int | no | sí |  | PK |
| idPuntoCarga | int | no |  |  |  |
| IdPaciente | int | sí |  |  |  |
| idCuentaAtencion | int | sí |  |  |  |
| idComprobantePago | int | sí |  |  |  |
| MovNumero | varchar(9) | sí |  |  |  |
| MovTipo | varchar(1) | sí |  |  |  |
| idPreventa | int | sí |  |  |  |
| ImporteExonerado | money | no |  |  |  |
| FechaCreacion | datetime | no |  |  |  |
| idUsuario | int | no |  |  |  |
| idEstadoFacturacion | int | no |  |  |  |
| idUsuarioExonera | int | sí |  |  |  |
| Descripcion | varchar(200) | sí |  |  |  |
| Paquete | varchar(100) | sí |  |  |  |
| DNI | varchar(12) | sí |  |  |  |
| IdOrdenDeuda | int | sí |  |  |  |

Claves foráneas:

- `idComprobantePago` → `dbo.CajaComprobantesPago.IdComprobantePago` (FK_FactOrdenesBienes_CajaComprobantesPago)
- `MovTipo` → `dbo.farmMovimientoVentas.movTipo` (FK_FactOrdenesBienes_farmMovimientoVentas)
- `MovNumero` → `dbo.farmMovimientoVentas.movNumero` (FK_FactOrdenesBienes_farmMovimientoVentas)

### FactOrdenServicio

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdOrden | int | no | sí |  | PK |
| IdPuntoCarga | int | no |  |  |  |
| IdPaciente | int | sí |  |  |  |
| IdCuentaAtencion | int | sí |  |  |  |
| IdServicioPaciente | int | sí |  |  |  |
| idTipoFinanciamiento | int | no |  |  |  |
| idFuenteFinanciamiento | int | sí |  |  |  |
| FechaCreacion | datetime | no |  |  |  |
| IdUsuario | int | no |  |  |  |
| FechaDespacho | datetime | sí |  |  |  |
| IdUsuarioDespacho | int | sí |  |  |  |
| IdEstadoFacturacion | int | no |  |  |  |
| FechaHoraRealizaCpt | datetime | sí |  |  |  |
| IdOrdenDeuda | int | sí |  |  |  |
| IdOrdenDeudaFarmacia | int | sí |  |  |  |

### FactOrdenServicioPagos

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| idOrdenPago | int | no | sí |  | PK |
| idComprobantePago | int | sí |  |  |  |
| idOrden | int | no |  |  |  |
| ImporteExonerado | money | no |  |  |  |
| FechaCreacion | datetime | no |  |  |  |
| IdUsuario | int | no |  |  |  |
| IdEstadoFacturacion | int | no |  |  |  |
| idUsuarioExonera | int | sí |  |  |  |

Claves foráneas:

- `idComprobantePago` → `dbo.CajaComprobantesPago.IdComprobantePago` (FK_FactOrdenServicioPagos_CajaComprobantesPago)

### FactPartidasPresupuestales

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdPartidaPresupuestal | int | no |  |  | PK |
| Codigo | varchar(20) | sí |  |  |  |
| Descripcion | varchar(255) | no |  |  |  |
| IdPartidaSeccion | int | sí |  |  |  |

Claves foráneas:

- `IdPartidaSeccion` → `dbo.FactPartidasSeccion.IdPartidaSeccion` (FactPartidasSeccion_FactPartidasPresupuestales_FK1)

### FactPartidasPresupuestalesXMes

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| Fecha | datetime | no |  |  | PK |
| idPartida | int | no |  |  | PK |
| IdProducto | int | no |  |  | PK |
| ImpAnulado | money | no |  |  |  |
| impExonerado | money | no |  |  |  |
| ImpNormal | money | no |  |  |  |
| ImpCancelado | money | no |  |  |  |

### FactPartidasSeccion

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdPartidaSeccion | int | no |  |  | PK |
| Codigo | char(5) | no |  |  |  |
| Descripcion | varchar(250) | sí |  |  |  |

### FactPreventa

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| idFactPreventa | int | no | sí |  | PK |
| idServicio | int | no |  |  |  |
| idTipoFinanciamiento | int | no |  |  |  |
| Total | money | no |  |  |  |
| fechaCreacion | smalldatetime | no |  |  |  |
| idUsuario | int | no |  |  |  |
| idEstadoPreventa | int | no |  |  |  |
| idAtencion | int | sí |  |  |  |
| idOrden | int | sí |  |  |  |

Claves foráneas:

- `idAtencion` → `dbo.Atenciones.IdAtencion` (FK_FactPreventa_Atenciones)
- `idOrden` → `dbo.FactOrdenServicio.IdOrden` (FK_FactPreventa_FactOrdenServicio)
- `idEstadoPreventa` → `dbo.farmEstadosPreventa.idEstadoPreventa` (FK_FactPreventa_farmEstadosPreventa)

### FactPuntosCarga

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdPuntoCarga | int | no |  |  | PK |
| Descripcion | char(50) | sí |  |  |  |
| TipoPunto | char(1) | sí |  |  |  |
| IdUPS | int | sí |  |  |  |
| idServicio | int | sí |  |  |  |

Claves foráneas:

- `IdUPS` → `dbo.UPServicios.IdUPS` (FK_FactPuntosCarga_UPServicios)

### FactPuntosCargaBienesInsumos

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdPuntoCargaBienInsumo | int | no |  |  | PK |
| IdPuntoCarga | int | sí |  |  |  |
| IdSubGrupoFarmacologico | int | sí |  |  |  |

Claves foráneas:

- `IdSubGrupoFarmacologico` → `dbo.FactInsumosSubGrupoFarmacologico.IdSubGrupoFarmacologico` (FactInsumosSubGrupoFarmacologico_FactPuntosCargaBienesInsumos_FK1)
- `IdPuntoCarga` → `dbo.FactPuntosCarga.IdPuntoCarga` (FactPuntosCarga_FactPuntosCargaBienesInsumos_FK1)

### FactPuntosCargaServicio

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdPuntoCargaServicio | int | no |  |  | PK |
| IdPuntoCarga | int | sí |  |  |  |
| IdServicioSubGrupo | int | sí |  |  |  |

Claves foráneas:

- `IdServicioSubGrupo` → `dbo.FactCatalogoServiciosSubGrupo.IdServicioSubGrupo` (FactCatalogoServiciosSubGrupo_FactPuntosCargaServicio_FK1)
- `IdPuntoCarga` → `dbo.FactPuntosCarga.IdPuntoCarga` (FactPuntosCarga_FactPuntosCargaServicio_FK1)

### FactReembolsos

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| idFactReembolso | int | no | sí |  | PK |
| Anio | int | no |  |  |  |
| Mes | int | no |  |  |  |
| idAreaTramitaSeguro | int | no |  |  |  |
| idFuenteFinanciamiento | int | no |  |  |  |
| Descripcion | varchar(100) | no |  |  |  |
| SaldoInicial | money | no |  |  |  |
| ConsumoPorReembolsar | money | no |  |  |  |
| ReembolsoPagado | money | sí |  |  |  |
| ReembolsoPorPagar | money | no |  |  |  |
| SaldoFinal | money | no |  |  |  |
| Documentos | varchar(100) | sí |  |  |  |
| idEstadoReembolso | int | no |  | (1) |  |
| idTipoConsumo | int | no |  |  |  |
| idTipoComprobante | int | sí |  |  |  |
| idComprobantePago | int | sí |  |  |  |
| GrabaDefinitivamente | bit | sí |  |  |  |

Claves foráneas:

- `idAreaTramitaSeguro` → `dbo.AreaTramitaSeguros.idAreaTramitaSeguros` (FK_FactReembolsos_AreaTramitaSeguros)
- `idEstadoReembolso` → `dbo.EstadosReembolso.idEstadoReembolso` (FK_FactReembolsos_EstadosReembolso)
- `idFuenteFinanciamiento` → `dbo.FuentesFinanciamiento.IdFuenteFinanciamiento` (FK_FactReembolsos_FuentesFinanciamiento)

### FactReembolsosDocumentos

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| idFactReembolso | int | no |  |  | PK |
| idComprobantePago | int | sí |  |  |  |
| NroSerie | varchar(3) | sí |  |  |  |
| NroDocumento | varchar(7) | sí |  |  |  |
| MotivoAnulacion | varchar(150) | sí |  |  |  |

Claves foráneas:

- `idFactReembolso` → `dbo.FactReembolsos.idFactReembolso` (FK_FactReembolsosDocumentos_FactReembolsos)

### FactTrasladoReferidos

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| idFactTrasladoReferidos | int | no |  |  |  |
| Fecha | char(10) | no |  |  |  |

### FacturacionAlertasAceptadas

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| Id | int | no | sí |  | PK |
| IdAtencion | int | no |  |  |  |
| CodigoProducto | varchar(50) | no |  |  |  |
| AlertaNivel | int | no |  |  |  |
| IdUsuario | int | no |  |  |  |
| FechaRegistro | datetime | sí |  | getdate() |  |
| Comentario | varchar(255) | sí |  |  |  |
| FechaInicio | datetime | sí |  |  |  |
| FechaFin | datetime | sí |  |  |  |

### FacturacionBienesDevoluciones

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| MovNumero | varchar(9) | no |  |  | PK |
| MovTipo | varchar(1) | no |  |  | PK |
| idProducto | int | no |  |  | PK |
| MovNumeroE | varchar(9) | no |  |  | PK |
| CantidadAdevolver | int | no |  |  |  |
| IdComprobantePago | int | sí |  |  |  |
| IdEstadoDevolucion | int | no |  |  |  |
| FechaAutoriza | datetime | no |  |  |  |
| IdUsuarioAutoriza | int | no |  |  |  |
| MovTipoE | varchar(1) | sí |  |  |  |

### FacturacionBienesFinanciamientos

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| MovNumero | varchar(9) | no |  |  | PK |
| MovTipo | varchar(1) | no |  |  | PK |
| IdProducto | int | no |  |  | PK |
| IdTipoFinanciamiento | int | no |  |  | PK |
| idFuenteFinanciamiento | int | sí |  |  |  |
| CantidadFinanciada | int | no |  |  |  |
| PrecioFinanciado | money | no |  |  |  |
| TotalFinanciado | money | no |  |  |  |
| FechaAutoriza | datetime | no |  |  |  |
| IdUsuarioAutoriza | int | no |  |  |  |
| idEstadoFacturacion | int | sí |  | (1) |  |

Claves foráneas:

- `IdProducto` → `dbo.farmMovimientoVentasDetalle.idProducto` (FK_FacturacionBienesFinanciamientos_farmMovimientoVentasDetalle)
- `MovNumero` → `dbo.farmMovimientoVentasDetalle.MovNumero` (FK_FacturacionBienesFinanciamientos_farmMovimientoVentasDetalle)
- `MovTipo` → `dbo.farmMovimientoVentasDetalle.MovTipo` (FK_FacturacionBienesFinanciamientos_farmMovimientoVentasDetalle)

### FacturacionBienesPagos

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdOrden | int | no |  |  | PK |
| IdProducto | int | no |  |  | PK |
| CantidadPagar | int | no |  |  |  |
| PrecioVenta | money | no |  |  |  |
| TotalPagar | money | no |  |  |  |
| EsDeuda | bit | no |  | (0) |  |
| Amortizacion | int | sí |  |  |  |
| Total_Inicial | int | sí |  |  |  |

Claves foráneas:

- `IdOrden` → `dbo.FactOrdenesBienes.idOrden` (FK_FacturacionBienesPagos_FactOrdenesBienes)

### FacturacionCatalogoPaquetes

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| idFactPaquete | int | no |  |  |  |
| idPuntoCarga | int | sí |  |  |  |
| idProducto | int | no |  |  |  |
| Cantidad | int | no |  |  |  |
| Precio | money | no |  |  |  |
| Importe | money | no |  |  |  |

Claves foráneas:

- `idFactPaquete` → `dbo.FactCatalogoPaquete.idFactPaquete` (FK_FacturacionCatalogoPaquetes_FactCatalogoPaquete)
- `idPuntoCarga` → `dbo.FactPuntosCarga.IdPuntoCarga` (FK_FacturacionCatalogoPaquetes_FactPuntosCarga)

### FacturacionCuentasAtencion

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdCuentaAtencion | int | no | sí |  | PK |
| IdPaciente | int | no |  |  |  |
| FechaApertura | datetime | no |  |  |  |
| HoraApertura | char(5) | no |  |  |  |
| FechaCierre | datetime | sí |  |  |  |
| HoraCierre | char(5) | sí |  |  |  |
| TotalExonerado | money | sí |  |  |  |
| TotalAsegurado | money | sí |  |  |  |
| TotalPagado | money | sí |  |  |  |
| IdEstado | int | sí |  |  |  |
| TotalPorPagar | money | sí |  |  |  |
| IdUsuarioCrea | int | sí |  |  |  |
| IdUsuarioModifica | int | sí |  |  |  |
| FechaCreacion | datetime | sí |  |  |  |
| FechaModificacion | datetime | sí |  |  |  |
| TiempoExpiracion | datetime | sí |  |  |  |
| EstadoOriginal | varchar(50) | sí |  |  |  |

Claves foráneas:

- `IdUsuarioCrea` → `dbo.Empleados.IdEmpleado` (Empleados_FacturacionCuentasAtencion_FK1)
- `IdUsuarioModifica` → `dbo.Empleados.IdEmpleado` (Empleados_FacturacionCuentasAtencion_FK2)
- `IdEstado` → `dbo.EstadosCuenta.IdEstado` (EstadosCuenta_CuentasAtencion_FK1)
- `IdPaciente` → `dbo.Pacientes.IdPaciente` (Pacientes_CuentasAtencion_FK1)

### FacturacionCuentasAtencionExon

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| idCuentaAtencion | int | no |  |  | PK |
| NumeroExoneracion | int | no |  |  | PK |

### FacturacionCuentasAtencionPtos

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| idCuentaAtencion | int | no |  |  | PK |
| idPuntoCarga | int | no |  |  | PK |
| TotalConsumos | money | no |  | (0) |  |
| TotalPagos | money | no |  | (0) |  |
| TotalPagosReembolso | money | no |  | (0) |  |

### FacturacionPaquetes

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| idComprobantePago | int | no |  |  | PK |
| idOrdenPago | int | no |  |  | PK |
| idProducto | int | no |  |  | PK |
| idFactPaquete | int | no |  |  |  |
| IdPuntoCarga | int | no |  |  |  |
| idEspecialidadServicio | int | no |  |  |  |
| AtencionId | int | sí |  |  |  |

Claves foráneas:

- `idComprobantePago` → `dbo.CajaComprobantesPago.IdComprobantePago` (FK_FacturacionPaquetes_CajaComprobantesPago)
- `idEspecialidadServicio` → `dbo.Especialidades.IdEspecialidad` (FK_FacturacionPaquetes_Especialidades)
- `idFactPaquete` → `dbo.FactCatalogoPaquete.idFactPaquete` (FK_FacturacionPaquetes_FactCatalogoPaquete)
- `idProducto` → `dbo.FactCatalogoServicios.IdProducto` (FK_FacturacionPaquetes_FactCatalogoServicios)
- `idOrdenPago` → `dbo.FactOrdenServicioPagos.idOrdenPago` (FK_FacturacionPaquetes_FactOrdenServicioPagos)

### FacturacionPreventa

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| idFactPreventa | int | no |  |  | PK |
| idProducto | int | no |  |  | PK |
| Cantidad | int | no |  |  |  |
| Precio | money | no |  |  |  |
| Importe | money | no |  |  |  |

Claves foráneas:

- `idFactPreventa` → `dbo.FactPreventa.idFactPreventa` (FK_FacturacionPreventa_FactPreventa)

### FacturacionReembolsos

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| idFactReembolso | int | no |  |  | PK |
| idCuentaAtencion | int | no |  |  | PK |
| ConsumoPorReembolsar | money | no |  |  |  |
| ReembolsoPagado | money | sí |  |  |  |
| ReembolsoPorPagar | money | no |  |  |  |
| ReembolsoPagadoFarmacia | money | sí |  |  |  |
| ReembolsoPagadoServicio | money | sí |  |  |  |
| IdReembolsosAnteriores | varchar(100) | sí |  |  |  |
| idDiagnostico | int | sí |  |  |  |
| NroReferenciaDestino | varchar(20) | sí |  |  |  |

Claves foráneas:

- `idFactReembolso` → `dbo.FactReembolsos.idFactReembolso` (FK_FacturacionReembolsos_FactReembolsos)

### FacturacionServicioDespacho

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| idOrden | int | no |  |  | PK |
| IdProducto | int | no |  |  | PK |
| Cantidad | int | no |  |  |  |
| Precio | money | no |  |  |  |
| Total | money | no |  |  |  |
| labConfHIS | varchar(3) | sí |  |  |  |
| GrupoHIS | int | sí |  |  |  |
| SubGrupoHIS | int | sí |  |  |  |
| idReceta | int | sí |  |  |  |
| idDiagnostico | int | sí |  |  |  |
| LabConfHIS2 | char(3) | sí |  |  |  |
| LabConfHIS3 | char(3) | sí |  |  |  |
| PDR | char(3) | sí |  |  |  |

Claves foráneas:

- `idOrden` → `dbo.FactOrdenServicio.IdOrden` (FK_FacturacionServicioDespacho_FactOrdenServicio)

### FacturacionServicioDevoluciones

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| idOrden | int | no |  |  | PK |
| idProducto | int | no |  |  | PK |
| CantidadAdevolver | int | no |  |  |  |
| IdComprobantePago | int | no |  |  |  |
| idEstadoDevolucion | int | no |  |  |  |
| FechaAutoriza | datetime | no |  |  |  |
| IdUsuarioAutoriza | int | no |  |  |  |

Claves foráneas:

- `idOrden` → `dbo.FacturacionServicioDespacho.idOrden` (FK_FacturacionServicioDevoluciones_FacturacionServicioDespacho)
- `idProducto` → `dbo.FacturacionServicioDespacho.IdProducto` (FK_FacturacionServicioDevoluciones_FacturacionServicioDespacho)

### FacturacionServicioFinanciamientos

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| idOrden | int | no |  |  | PK |
| idProducto | int | no |  |  | PK |
| IdTipoFinanciamiento | int | no |  |  | PK |
| idFuenteFinanciamiento | int | sí |  |  |  |
| CantidadFinanciada | int | no |  |  |  |
| PrecioFinanciado | money | no |  |  |  |
| TotalFinanciado | money | no |  |  |  |
| FechaAutoriza | datetime | no |  |  |  |
| IdUsuarioAutoriza | int | no |  |  |  |
| idEstadoFacturacion | int | sí |  | (1) |  |

### FacturacionServicioPagos

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| idOrdenPago | int | no |  |  | PK |
| idProducto | int | no |  |  | PK |
| Cantidad | int | no |  |  |  |
| Precio | money | no |  |  |  |
| Total | money | no |  |  |  |
| EsDeuda | bit | no |  | (0) |  |
| Total_Inicial | int | sí |  |  |  |
| Amortizacion | int | sí |  |  |  |

Claves foráneas:

- `idOrdenPago` → `dbo.FactOrdenServicioPagos.idOrdenPago` (FK_FacturacionServicioPagos_FactOrdenServicioPagos)

### FacturacionTrasladoReferidos

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| idFactTrasladoReferidos | int | no |  |  |  |
| idCuenta | int | no |  |  |  |
| codigoSeguro | varchar(20) | sí |  |  |  |
| Beneficio | varchar(1) | sí |  |  |  |
| idTipoTransporte | int | sí |  |  |  |
| idTipoViaje | int | sí |  |  |  |
| FechaSalida | datetime | sí |  |  |  |
| NroFamiliarAcompania | int | sí |  |  |  |
| NroPersonalAcompania | int | sí |  |  |  |
| KmDistancia | int | sí |  |  |  |

### FacturacionTrasladoReferidosServicios

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| idFactTrasladoReferidos | int | no |  |  |  |
| idCuenta | int | no |  |  |  |
| idProducto | int | no |  |  |  |
| cantidad | int | sí |  |  |  |
| precio | money | sí |  |  |  |
| Total | money | sí |  |  |  |

### FAR

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| ANHO | int | no |  |  |  |
| MES | int | no |  |  |  |

### FarmaciaSaldo

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| Id_historico | int | sí |  |  |  |
| IdAlmacen | int | sí |  |  |  |
| IdProducto | int | sí |  |  |  |
| Precio | money | sí |  |  |  |
| Codigo | varchar(7) | sí |  |  |  |
| Nombre | varchar(300) | sí |  |  |  |
| Cantidad | money | sí |  |  |  |
| StockMinimo | int | sí |  |  |  |
| Fecha | date | sí |  |  |  |
| Lote | varchar(50) | sí |  |  |  |
| Fvenc | date | sí |  |  |  |

### FarmaciaSaldoXFarmacia

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| id_historico | varchar(50) | no |  |  |  |
| idAlmacen | varchar(50) | no |  |  |  |
| idProducto | varchar(50) | no |  |  |  |
| Precio | varchar(50) | no |  |  |  |
| Codigo | varchar(50) | sí |  |  |  |
| Nombre | varchar(255) | sí |  |  |  |
| Cantidad | varchar(50) | sí |  |  |  |
| stockMinimo | varchar(50) | sí |  |  |  |
| fecha | date | sí |  |  |  |
| Lote | varchar(50) | sí |  |  |  |
| Fvenc | date | sí |  |  |  |

### farmaciaServicio

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdServicio | int | no |  |  | PK |
| idalmacen | int | no |  |  | PK |
| estado | bit | sí |  |  |  |

### farmAlmacen

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| idAlmacen | int | no |  |  | PK |
| descripcion | varchar(50) | no |  |  |  |
| idTipoLocales | varchar(1) | no |  |  |  |
| idTipoSuministro | varchar(2) | sí |  |  |  |
| idEstado | int | no |  |  |  |
| codigoSISMED | varchar(11) | sí |  |  |  |
| regenerarDias | varchar(7) | sí |  |  |  |
| regenerarHora | varchar(5) | sí |  |  |  |
| regenerarEstado | varchar(7) | sí |  |  |  |

Claves foráneas:

- `idTipoLocales` → `dbo.farmTipoLocal.idTipoLocal` (FK_farmAlmacen_farmTipoLocal)
- `idTipoSuministro` → `dbo.farmTipoSuministro.idTipoSuministro` (FK_farmAlmacen_farmTipoSuministro)

### farmAlmacenWS

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| idCorrelativo | int | no |  |  | PK |
| idAlmacen | int | no |  |  |  |

### farmComponente

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| idComponente | int | no | sí |  | PK |
| Componente | varchar(2) | no |  |  |  |
| Descripcion | varchar(150) | no |  |  |  |

### farmComponenteSub

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| idSubComponente | int | no |  |  | PK |
| idComponente | int | no |  |  |  |
| componente | varchar(2) | sí |  |  |  |
| subComponente | varchar(2) | no |  |  |  |
| Descripcion | varchar(100) | no |  |  |  |
| Diagnostico | varchar(20) | sí |  |  |  |
| TipoProductoSismed | varchar(1) | sí |  |  |  |

### FarmDespachoRecepcion

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| MovNumero | varchar(9) | no |  |  | PK |
| TipoReceptor | varchar(10) | no |  |  |  |
| NombreReceptor | varchar(150) | sí |  |  |  |
| DocumentoReceptor | varchar(15) | sí |  |  |  |
| RelacionReceptor | varchar(50) | sí |  |  |  |
| RutaFirma | varchar(300) | no |  |  |  |
| IdUsuarioDespacho | int | no |  |  |  |
| FechaRegistro | datetime | no |  | getdate() |  |

### farmEstadosInventario

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| idEstadoInventario | int | no |  |  | PK |
| Estado | varchar(30) | no |  |  |  |

### farmEstadosMovimientos

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| idEstadoMovimiento | int | no |  |  | PK |
| Estado | varchar(30) | no |  |  |  |

### farmEstadosPreventa

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| idEstadoPreventa | int | no |  |  | PK |
| Estado | varchar(30) | no |  |  |  |

### farmHistPrecio

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| idHistPrecio | int | no | sí |  | PK |
| idProducto | int | no |  |  |  |
| fecha | datetime | no |  |  |  |
| PrecioCompra | money | no |  |  |  |
| PrecioDistribucion | money | no |  |  |  |
| PrecioVenta | money | no |  |  |  |
| PrecioDonacion | money | no |  |  |  |
| IdUsuario | int | no |  |  |  |

### farmInventario

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| idInventario | int | no | sí |  | PK |
| idAlmacen | int | no |  |  |  |
| numeroInventario | varchar(4) | sí |  |  |  |
| FechaCierre | datetime | sí |  |  |  |
| FechaCreacion | datetime | no |  |  |  |
| FechaModificacion | datetime | sí |  |  |  |
| idEstadoInventario | int | no |  |  |  |
| idUsuario | int | no |  |  |  |
| idTipoInventario | int | sí |  |  |  |

Claves foráneas:

- `idUsuario` → `dbo.Empleados.IdEmpleado` (FK_farmInventario_Empleados)
- `idEstadoInventario` → `dbo.farmEstadosInventario.idEstadoInventario` (FK_farmInventario_farmEstadosInventario)
- `idAlmacen` → `dbo.farmAlmacen.idAlmacen` (FK_farmTinvent_farmMalmacen)

### farmInventarioCabecera

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| idInventario | int | no |  |  | PK |
| idProducto | int | no |  |  | PK |
| Cantidad | int | no |  |  |  |
| Precio | money | no |  |  |  |
| Total | money | no |  |  |  |
| CantidadSaldo | int | sí |  |  |  |
| CantidadFaltante | int | sí |  |  |  |
| CantidadSobrante | int | sí |  |  |  |

Claves foráneas:

- `idProducto` → `dbo.FactCatalogoBienesInsumos.IdProducto` (FK_farmInventarioCabecera_FactCatalogoBienesInsumos)
- `idInventario` → `dbo.farmInventario.idInventario` (FK_farmInventarioCabecera_farmInventario)

### farmInventarioDetalle

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| idInventario | int | no |  |  | PK |
| idProducto | int | no |  |  | PK |
| Lote | varchar(15) | no |  |  | PK |
| FechaVencimiento | datetime | no |  |  | PK |
| IdTipoSalidaBienInsumo | int | no |  | (1) | PK |
| Cantidad | int | no |  |  |  |
| Precio | money | no |  |  |  |
| RegistroSanitario | varchar(50) | sí |  |  |  |
| CantidadSaldo | int | sí |  |  |  |
| CantidadFaltante | int | sí |  |  |  |
| CantidadSobrante | int | sí |  |  |  |
| EsHistoricoSaldo | int | sí |  |  |  |

Claves foráneas:

- `idProducto` → `dbo.FactCatalogoBienesInsumos.IdProducto` (FK_farmInventarioDetalle_FactCatalogoBienesInsumos)
- `idInventario` → `dbo.farmInventario.idInventario` (FK_farmInventarioDetalle_farmInventario)

### farmMotivoAnulacion

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| idMotivoAnulacion | int | no | sí |  | PK |
| CodigoMINSA | varchar(2) | no |  |  |  |
| Motivo | char(150) | no |  |  |  |

### farmMovimiento

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| MovNumero | varchar(9) | no |  |  | PK |
| MovTipo | varchar(1) | no |  |  | PK |
| idAlmacenOrigen | int | no |  |  |  |
| idAlmacenDestino | int | no |  |  |  |
| idTipoConcepto | int | no |  |  |  |
| DocumentoIdtipo | int | no |  |  |  |
| DocumentoNumero | varchar(20) | sí |  |  |  |
| Observaciones | varchar(100) | sí |  |  |  |
| Total | money | no |  |  |  |
| idMotivoAnulacion | int | sí |  |  |  |
| fechaAnulacion | datetime | sí |  |  |  |
| idUsuarioAnulacion | int | sí |  |  |  |
| fechaCreacion | datetime | no |  |  |  |
| idUsuario | int | no |  |  |  |
| idEstadoMovimiento | int | no |  |  |  |

Claves foráneas:

- `idUsuario` → `dbo.Empleados.IdEmpleado` (FK_farmMovimiento_Empleados)
- `idAlmacenOrigen` → `dbo.farmAlmacen.idAlmacen` (FK_farmMovimiento_farmAlmacen)
- `idAlmacenDestino` → `dbo.farmAlmacen.idAlmacen` (FK_farmMovimiento_farmAlmacen1)
- `idEstadoMovimiento` → `dbo.farmEstadosMovimientos.idEstadoMovimiento` (FK_farmMovimiento_farmEstadosMovimientos)
- `idTipoConcepto` → `dbo.farmTipoConceptos.idTipoConcepto` (FK_farmMovimiento_farmTipoConceptos)
- `DocumentoIdtipo` → `dbo.farmTipoDocumentos.idTipoDocumento` (FK_farmMovimiento_farmTipoDocumentos)

### farmMovimientoDetalle

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| MovNumero | varchar(9) | no |  |  | PK |
| MovTipo | varchar(1) | no |  |  | PK |
| idProducto | int | no |  |  | PK |
| Lote | varchar(15) | no |  |  | PK |
| FechaVencimiento | datetime | no |  |  | PK |
| IdTipoSalidaBienInsumo | int | no |  | (1) | PK |
| Item | int | no |  |  |  |
| Cantidad | int | no |  |  |  |
| Precio | money | no |  |  |  |
| Total | money | no |  |  |  |
| RegistroSanitario | varchar(50) | sí |  |  |  |
| DocumentoNumero | varchar(20) | sí |  |  |  |

Claves foráneas:

- `idProducto` → `dbo.FactCatalogoBienesInsumos.IdProducto` (FK_farmMovimientoDetalle_FactCatalogoBienesInsumos)
- `MovTipo` → `dbo.farmMovimiento.MovTipo` (FK_farmMovimientoDetalle_farmMovimiento)
- `MovNumero` → `dbo.farmMovimiento.MovNumero` (FK_farmMovimientoDetalle_farmMovimiento)
- `IdTipoSalidaBienInsumo` → `dbo.farmTipoSalidaBienInsumo.idTipoSalidaBienInsumo` (FK_farmMovimientoDetalle_farmTipoSalidaBienInsumo)

### FarmMovimientoDonaciones

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| movNumero | varchar(9) | no |  |  | PK |
| movTipo | varchar(1) | no |  |  | PK |
| idCuentaAtencion | int | no |  |  |  |
| idPrescriptorReceta | int | sí |  |  |  |
| idCoordinadorServicioSocial | int | no |  |  |  |
| idDiagnostico | int | sí |  |  |  |

Claves foráneas:

- `movNumero` → `dbo.farmMovimiento.MovNumero` (FK_FarmMovimientoDonaciones_farmMovimiento)
- `movTipo` → `dbo.farmMovimiento.MovTipo` (FK_FarmMovimientoDonaciones_farmMovimiento)

### farmMovimientoNotaIngreso

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| MovNumero | varchar(9) | no |  |  | PK |
| MovTipo | varchar(1) | no |  |  | PK |
| DocumentoFechaRecepcion | datetime | sí |  |  |  |
| OrigenIdTipo | int | sí |  |  |  |
| OrigenNumero | varchar(20) | sí |  |  |  |
| OrigenFecha | datetime | sí |  |  |  |
| idProveedor | int | sí |  |  |  |
| idTipoCompra | int | sí |  |  |  |
| idTipoProceso | int | sí |  |  |  |
| NumeroProceso | varchar(50) | sí |  |  |  |
| idPaciente | int | sí |  |  |  |
| idCuentaAtencion | int | sí |  |  |  |
| idFuenteFinanciamiento | int | sí |  |  |  |
| idComprobantePago | int | sí |  |  |  |
| FechaModificacion | datetime | sí |  |  |  |
| idUsuarioModifica | int | sí |  |  |  |

Claves foráneas:

- `MovTipo` → `dbo.farmMovimiento.MovTipo` (FK_farmMovimientoAlmacen_farmMovimiento)
- `MovNumero` → `dbo.farmMovimiento.MovNumero` (FK_farmMovimientoAlmacen_farmMovimiento)
- `idTipoCompra` → `dbo.farmTipoCompra.idTipoCompra` (FK_farmMovimientoNotaIngreso_farmTipoCompra)
- `idTipoProceso` → `dbo.farmTipoProceso.idTipoProceso` (FK_farmMovimientoNotaIngreso_farmTipoProceso)

### farmMovimientoProgramas

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| movNumero | varchar(9) | no |  |  | PK |
| movTipo | varchar(1) | no |  |  | PK |
| idCoordinador | int | no |  |  |  |
| idPrescriptor | char(10) | no |  |  |  |
| idDiagnostico | int | no |  |  |  |
| idPaciente | int | sí |  |  |  |
| idComponente | int | no |  |  |  |
| idSubComponente | int | no |  |  |  |
| FechaHoraPrescribe | datetime | sí |  |  |  |

Claves foráneas:

- `idComponente` → `dbo.farmComponente.idComponente` (FK_farmMovimientoProgramas_farmComponente)
- `idSubComponente` → `dbo.farmComponenteSub.idSubComponente` (FK_farmMovimientoProgramas_farmComponenteSub)
- `movNumero` → `dbo.farmMovimiento.MovNumero` (FK_farmMovimientoProgramas_farmMovimiento)
- `movTipo` → `dbo.farmMovimiento.MovTipo` (FK_farmMovimientoProgramas_farmMovimiento)
- `idPaciente` → `dbo.Pacientes.IdPaciente` (FK_farmMovimientoProgramas_Pacientes)

### farmMovimientoVentas

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| movNumero | varchar(9) | no |  |  | PK |
| movTipo | varchar(1) | no |  |  | PK |
| tipoVenta | varchar(1) | no |  |  |  |
| idPreVenta | int | sí |  |  |  |
| idTipoFinanciamiento | int | no |  |  |  |
| idPrescriptor | int | sí |  |  |  |
| idTipoReceta | int | no |  |  |  |
| idDiagnostico | int | sí |  |  |  |
| idCuentaAtencion | int | sí |  |  |  |
| IdServicioPaciente | int | sí |  |  |  |
| idFuenteFinanciamiento | int | sí |  |  |  |
| idPaciente | int | sí |  |  |  |
| FechaHoraPrescribe | datetime | sí |  |  |  |
| IdPaquete | int | sí |  |  |  |
| idReceta | int | sí |  |  |  |

Claves foráneas:

- `movNumero` → `dbo.farmMovimiento.MovNumero` (FK_farmMovimientoVentas_farmMovimiento)
- `movTipo` → `dbo.farmMovimiento.MovTipo` (FK_farmMovimientoVentas_farmMovimiento)
- `idTipoReceta` → `dbo.farmTipoReceta.idTipoReceta` (FK_farmMovimientoVentas_farmTipoReceta)
- `idPaciente` → `dbo.Pacientes.IdPaciente` (FK_farmMovimientoVentas_Pacientes)

### farmMovimientoVentasDetalle

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| MovNumero | varchar(9) | no |  |  | PK |
| MovTipo | varchar(1) | no |  |  | PK |
| idProducto | int | no |  |  | PK |
| cantidad | int | no |  |  |  |
| precio | money | no |  |  |  |
| total | money | no |  |  |  |

Claves foráneas:

- `idProducto` → `dbo.FactCatalogoBienesInsumos.IdProducto` (FK_farmMovimientoVentasDetalle_FactCatalogoBienesInsumos)
- `MovNumero` → `dbo.farmMovimientoVentas.movNumero` (FK_farmMovimientoVentasDetalle_farmMovimientoVentas)
- `MovTipo` → `dbo.farmMovimientoVentas.movTipo` (FK_farmMovimientoVentasDetalle_farmMovimientoVentas)

### farmPreVenta

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| idPreventa | int | no | sí |  | PK |
| idAlmacen | int | no |  |  |  |
| idVendedor | int | no |  |  |  |
| idPaciente | int | sí |  |  |  |
| idTipoFinanciamiento | int | no |  |  |  |
| Total | money | no |  |  |  |
| idDiagnostico | int | sí |  |  |  |
| idTipoReceta | int | no |  |  |  |
| idCuentaAtencion | int | sí |  |  |  |
| idPrescriptor | int | sí |  |  |  |
| FechaCreacion | datetime | no |  |  |  |
| HoraCreacion | varchar(5) | no |  |  |  |
| idUsuario | int | no |  |  |  |
| FechaModificacion | datetime | sí |  |  |  |
| idUsuarioModifica | int | sí |  |  |  |
| idEstadoPreventa | int | no |  |  |  |
| FechaHoraPrescribe | datetime | sí |  |  |  |

Claves foráneas:

- `idVendedor` → `dbo.Empleados.IdEmpleado` (FK_farmPreVenta_Empleados)
- `idUsuario` → `dbo.Empleados.IdEmpleado` (FK_farmPreVenta_Empleados1)
- `idAlmacen` → `dbo.farmAlmacen.idAlmacen` (FK_farmPreVenta_farmAlmacen)
- `idEstadoPreventa` → `dbo.farmEstadosPreventa.idEstadoPreventa` (FK_farmPreVenta_farmEstadosPreventa)
- `idTipoReceta` → `dbo.farmTipoReceta.idTipoReceta` (FK_farmPreVenta_farmTipoReceta)
- `idPaciente` → `dbo.Pacientes.IdPaciente` (FK_farmPreVenta_Pacientes)
- `idTipoFinanciamiento` → `dbo.TiposFinanciamiento.IdTipoFinanciamiento` (FK_farmPreVenta_TiposFinanciamiento)

### farmPreVentaDetalle

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| idPreventa | int | no |  |  | PK |
| idProducto | int | no |  |  | PK |
| item | int | no |  |  |  |
| Cantidad | int | no |  |  |  |
| Precio | money | no |  |  |  |
| Importe | money | no |  |  |  |

Claves foráneas:

- `idProducto` → `dbo.FactCatalogoBienesInsumos.IdProducto` (FK_farmPreVentaDetalle_FactCatalogoBienesInsumos)
- `idPreventa` → `dbo.farmPreVenta.idPreventa` (FK_farmPreVentaDetalle_farmPreVenta)

### farmRelMod

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| TipoAlmacen | varchar(1) | no |  |  | PK |
| TipoMov | varchar(1) | no |  |  | PK |
| TipoSuministro | varchar(2) | no |  |  | PK |
| ConceptoCodigo | varchar(2) | no |  |  | PK |
| DocumentoId | int | no |  |  |  |
| DocumentoCodigo | varchar(2) | no |  |  |  |
| DocumentoEsAutomatico | varchar(1) | no |  |  |  |
| DocumentoUltimoNumero | varchar(20) | no |  |  |  |
| NiDocumentoOrigenId | int | no |  |  |  |
| NiDocumentoOrigenCodigo | varchar(2) | no |  |  |  |
| NiDocumentoOrigenEsAutomatico | varchar(1) | no |  |  |  |
| NiDocumentoOrigenUltimoNumero | varchar(20) | no |  |  |  |
| NiFiltroAlmacenOrigen | varchar(200) | sí |  |  |  |
| NiEsCompra | bit | no |  |  |  |
| NiEsDevolucionPaciente | bit | no |  |  |  |
| NsFiltroAlmacenDestino | varchar(200) | sí |  |  |  |
| TipoPrecioParaNiNs | int | no |  |  |  |
| MuestraLoteParaDespachoNS | varchar(1) | sí |  |  |  |
| NiFiltroAlmacenOrigenCS | varchar(200) | sí |  |  |  |
| NsFiltroAlmacenDestinoCS | varchar(200) | sí |  |  |  |

### farmSaldo

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| idAlmacen | int | no |  |  | PK |
| idProducto | int | no |  |  | PK |
| IdTipoSalidaBienInsumo | int | no |  | (1) | PK |
| cantidad | money | no |  |  |  |
| Precio | money | no |  |  |  |

Claves foráneas:

- `idProducto` → `dbo.FactCatalogoBienesInsumos.IdProducto` (FK_farmSaldo_FactCatalogoBienesInsumos)
- `idAlmacen` → `dbo.farmAlmacen.idAlmacen` (FK_farmSaldo_farmAlmacen)
- `IdTipoSalidaBienInsumo` → `dbo.farmTipoSalidaBienInsumo.idTipoSalidaBienInsumo` (FK_farmSaldo_farmTipoSalidaBienInsumo)

### farmSaldoDetallado

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| idAlmacen | int | no |  |  | PK |
| idProducto | int | no |  |  | PK |
| Lote | varchar(15) | no |  |  | PK |
| FechaVencimiento | datetime | no |  |  | PK |
| IdTipoSalidaBienInsumo | int | no |  | (1) | PK |
| Cantidad | money | no |  |  |  |
| Precio | money | no |  |  |  |
| codsum | int | sí |  |  |  |
| codff | int | sí |  |  |  |
| RegistroSanitario | nchar(20) | sí |  |  |  |

Claves foráneas:

- `idProducto` → `dbo.FactCatalogoBienesInsumos.IdProducto` (FK_farmSaldoDetallado_FactCatalogoBienesInsumos)
- `idAlmacen` → `dbo.farmAlmacen.idAlmacen` (FK_farmSaldoDetallado_farmAlmacen)
- `IdTipoSalidaBienInsumo` → `dbo.farmTipoSalidaBienInsumo.idTipoSalidaBienInsumo` (FK_farmSaldoDetallado_farmTipoSalidaBienInsumo)

### farmSaldoMensual

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| idAlmacen | int | no |  |  | PK |
| idProducto | int | no |  |  | PK |
| IdTipoSalidaBienInsumo | int | no |  | (1) | PK |
| SaldoFecha | datetime | no |  |  | PK |
| Saldo | int | no |  |  |  |

Claves foráneas:

- `idProducto` → `dbo.FactCatalogoBienesInsumos.IdProducto` (FK_farmSaldoMensual_FactCatalogoBienesInsumos)
- `IdTipoSalidaBienInsumo` → `dbo.farmTipoSalidaBienInsumo.idTipoSalidaBienInsumo` (FK_farmSaldoMensual_farmTipoSalidaBienInsumo)

### FarmSaldoMensualDetallado

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| idAlmacen | int | no |  |  | PK |
| idProducto | int | no |  |  | PK |
| Lote | varchar(15) | no |  |  | PK |
| FechaVencimiento | datetime | no |  |  | PK |
| IdTipoSalidaBienInsumo | int | no |  | (1) | PK |
| SaldoFecha | datetime | no |  |  | PK |
| Saldo | int | no |  |  |  |
| Precio | money | no |  |  |  |

Claves foráneas:

- `idProducto` → `dbo.FactCatalogoBienesInsumos.IdProducto` (FK_FarmSaldoMensualDetallado_FactCatalogoBienesInsumos)
- `IdTipoSalidaBienInsumo` → `dbo.farmTipoSalidaBienInsumo.idTipoSalidaBienInsumo` (FK_FarmSaldoMensualDetallado_farmTipoSalidaBienInsumo)

### farmTipoCompra

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| idTipoCompra | int | no | sí |  | PK |
| codigoMINSA | varchar(2) | no |  |  |  |
| descripcion | varchar(50) | no |  |  |  |

### farmTipoConceptos

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| idTipoConcepto | int | no | sí |  | PK |
| codigoMINSA | varchar(2) | no |  |  |  |
| Concepto | varchar(50) | no |  |  |  |

### farmTipoDocumentos

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| idTipoDocumento | int | no | sí |  | PK |
| CodigoMINSA | varchar(2) | no |  |  |  |
| Nombre | varchar(50) | no |  |  |  |
| Abreviatura | varchar(20) | no |  |  |  |
| Correlativo | int | no |  |  |  |

### farmTipoInventario

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| idTipoInventario | int | no |  |  | PK |
| Descripcion | varchar(20) | no |  |  |  |
| TipoInventarioSismed | varchar(1) | no |  |  |  |

### farmTipoLocal

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| idTipoLocal | varchar(1) | no |  |  | PK |
| Descripcion | varchar(30) | no |  |  |  |

### farmTipoProceso

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| idTipoProceso | int | no | sí |  | PK |
| codigoMINSA | varchar(2) | no |  |  |  |
| descripcion | varchar(50) | no |  |  |  |

### farmTipoProductosSismed

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| TipoProductoSismed | varchar(1) | no |  |  | PK |
| Descripcion | varchar(50) | no |  |  |  |

### farmTipoReceta

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| idTipoReceta | int | no |  |  | PK |
| tipoReceta | varchar(50) | no |  |  |  |

### farmTipoSalidaBienInsumo

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| idTipoSalidaBienInsumo | int | no |  |  | PK |
| tipo | varchar(20) | no |  |  |  |

### farmTipoSuministro

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| idTipoSuministro | varchar(2) | no |  |  | PK |
| descripcion | varchar(20) | no |  |  |  |

### Firmas

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| id | int | no | sí |  | PK |
| ruta | text | sí |  |  |  |
| code | text | sí |  |  |  |
| idDoc | varchar(50) | sí |  |  |  |
| idCuentaAtencion | int | sí |  |  |  |
| idRegistro | int | sí |  |  |  |
| tipo | varchar(50) | sí |  |  |  |
| statusFirma | int | sí |  |  |  |
| rutaArchivo | text | sí |  |  |  |

### Flecha

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| Id | int | no | sí |  | PK |
| OdontogramaVersionId | int | no |  |  |  |
| Color | nvarchar(30) | sí |  |  |  |
| OrigenX | decimal(6,3) | no |  |  |  |
| OrigenY | decimal(6,3) | no |  |  |  |
| DestinoX | decimal(6,3) | no |  |  |  |
| DestinoY | decimal(6,3) | no |  |  |  |
| Estilo | nvarchar(30) | sí |  |  |  |
| Metadata | nvarchar(max) | sí |  |  |  |
| Fecha_Creacion | datetime2 | no |  | getdate() |  |
| Usuario_Creacion | nvarchar(100) | sí |  |  |  |

Claves foráneas:

- `OdontogramaVersionId` → `dbo.OdontogramaVersion.Id` (FK_Flecha_Version)

### FormaIngresoEmer

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdFormaIngreso | int | no |  |  | PK |
| Descripcion | varchar(50) | no |  |  |  |

### Fractura

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| Id | int | no | sí |  | PK |
| OdontogramaVersionId | int | no |  |  |  |
| NumeroDiente | tinyint | no |  |  |  |
| Tipo | nvarchar(50) | sí |  |  |  |
| Severidad | nvarchar(30) | sí |  |  |  |
| Color | nvarchar(30) | sí |  |  |  |
| Metadata | nvarchar(max) | sí |  |  |  |
| Fecha_Creacion | datetime2 | no |  | getdate() |  |
| Usuario_Creacion | nvarchar(100) | sí |  |  |  |

Claves foráneas:

- `OdontogramaVersionId` → `dbo.OdontogramaVersion.Id` (FK_Fractura_Version)

### FUA

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| Idcuenta | int | sí |  |  |  |
| numeroFUA | int | sí |  |  |  |

### FuentesFinanciamiento

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdFuenteFinanciamiento | int | no |  |  | PK |
| Descripcion | varchar(50) | no |  |  |  |
| IdTipoFinanciamiento | int | sí |  |  |  |
| idTipoConceptoFarmacia | int | sí |  |  |  |
| UtilizadoEn | int | sí |  |  |  |
| CodigoFuenteFinanciamientoSEM | varchar(1) | sí |  |  |  |
| idAreaTramitaSeguros | int | sí |  |  |  |
| EsUsadoEnCaja | bit | sí |  |  |  |
| CodigoHIS | varchar(2) | sí |  |  |  |
| idTipoFinanciador | int | no |  | (1) |  |
| codigo | char(11) | no |  | '00000000000' |  |
| esActivo | int | sí |  |  |  |

Claves foráneas:

- `idTipoFinanciador` → `dbo.TipoFinanciador.idTipoFinanciador` (FK_FuentesFinanciamiento_TipoFinanciador)
- `IdTipoFinanciamiento` → `dbo.TiposFinanciamiento.IdTipoFinanciamiento` (TiposFinanciamiento_FuentesFinaciamiento_FK1)

### FuentesFinanciamientoTarifas

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| idFuenteFinanciamiento | int | no |  |  | PK |
| idTipoFinanciamiento | int | no |  |  | PK |

### Fusion

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| Id | int | no | sí |  | PK |
| OdontogramaVersionId | int | no |  |  |  |
| Diente_A | tinyint | no |  |  |  |
| Diente_B | tinyint | no |  |  |  |
| Tipo | nvarchar(30) | sí |  |  |  |
| Color | nvarchar(30) | sí |  |  |  |
| Metadata | nvarchar(max) | sí |  |  |  |
| Fecha_Creacion | datetime2 | no |  | getdate() |  |
| Usuario_Creacion | nvarchar(100) | sí |  |  |  |

Claves foráneas:

- `OdontogramaVersionId` → `dbo.OdontogramaVersion.Id` (FK_Fusion_Version)

### Geminacion

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| Id | int | no | sí |  | PK |
| OdontogramaVersionId | int | no |  |  |  |
| NumeroDiente | tinyint | no |  |  |  |
| Tipo | nvarchar(30) | sí |  |  |  |
| Color | nvarchar(30) | sí |  |  |  |
| Metadata | nvarchar(max) | sí |  |  |  |
| Fecha_Creacion | datetime2 | no |  | getdate() |  |
| Usuario_Creacion | nvarchar(100) | sí |  |  |  |

Claves foráneas:

- `OdontogramaVersionId` → `dbo.OdontogramaVersion.Id` (FK_Geminacion_Version)

### GeneradorNroHistoriaClinica

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdNumerador | int | no | sí |  | PK |
| NroHistoriaClinica | int | sí |  |  |  |
| Estado | bit | sí |  |  |  |
| IdTipoNumeracion | int | sí |  |  |  |

Claves foráneas:

- `IdTipoNumeracion` → `dbo.TiposNumeracionHistoria.IdTipoNumeracion` (TipoGeneracionHistoria_GeneradorNroHistoriaClinica_FK1)

### Gestantes

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdGestante | int | no | sí |  | PK |
| AltUter | int | no |  |  |  |
| EdadGestacional | int | no |  |  |  |
| CPN | int | no |  |  |  |
| IdAtencion | int | no |  |  |  |

### Giroversion

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| Id | int | no | sí |  | PK |
| OdontogramaVersionId | int | no |  |  |  |
| NumeroDiente | tinyint | no |  |  |  |
| Direccion | nvarchar(10) | no |  |  |  |
| Grados | int | sí |  |  |  |
| Color | nvarchar(30) | sí |  |  |  |
| Metadata | nvarchar(max) | sí |  |  |  |
| Fecha_Creacion | datetime2 | no |  | getdate() |  |
| Usuario_Creacion | nvarchar(100) | sí |  |  |  |

Claves foráneas:

- `OdontogramaVersionId` → `dbo.OdontogramaVersion.Id` (FK_Giroversion_Version)

### GrupoCausaSuspensionOperacion

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdGrupoCausaSuspensionOperacion | int | no |  |  | PK |
| Descripcion | varchar(200) | sí |  |  |  |

### GrupoChequeoEnfermeriaPreOperatoria

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdGrupoChequeoEnfermeriaPreOperatoria | int | no |  |  | PK |
| Numero | int | sí |  |  |  |
| IdSeccionChequeoEnfermeria | int | sí |  |  |  |
| EstadoReg | bit | sí |  |  |  |
| IdUsuario | int | sí |  |  |  |
| Estacion | nchar(50) | sí |  |  |  |
| FechaReg | datetime | sí |  |  |  |

Claves foráneas:

- `IdSeccionChequeoEnfermeria` → `dbo.SeccionChequeoEnfermeria.IdSeccionChequeoEnfermeria` (FK__GrupoCheq__IdSec__0AD7C7A3)
- `IdSeccionChequeoEnfermeria` → `dbo.SeccionChequeoEnfermeria.IdSeccionChequeoEnfermeria` (FK__GrupoCheq__IdSec__4DDC0860)

### GrupoCondicionIngresoURPA

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdGrupoCondicionIngresoURPA | int | no |  |  | PK |
| Descripcion | nchar(100) | sí |  |  |  |
| EstadoReg | bit | sí |  |  |  |
| IdUsuario | int | sí |  |  |  |
| Estacion | nchar(50) | sí |  |  |  |
| FechaReg | datetime | sí |  |  |  |

### GruposIndicacionAlta

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdIndicacionAlta | int | no |  |  | PK |
| Descripcion | nchar(200) | no |  |  |  |
| EstadoReg | bit | sí |  |  |  |
| IdUsuario | int | sí |  |  |  |
| Estacion | nchar(50) | sí |  |  |  |
| FechaReg | datetime | sí |  |  |  |

### HIS_Cabecera

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdHisCabecera | int | no | sí |  | PK |
| IdHisLote | int | sí |  |  |  |
| NroHojaHis | int | sí |  |  |  |
| NroFormato | int | no |  |  |  |
| IdTurno | int | no |  |  |  |
| IdUsuario | int | sí |  |  |  |
| IdEstadoHis | int | sí |  |  |  |
| IdMedico | int | sí |  |  |  |
| IdServEstablecimiento | int | sí |  |  |  |
| FechaCreacion | datetime | sí |  |  |  |
| IdEstablecimiento | int | no |  | (1867) |  |
| IdServicio | int | no |  | (31) |  |

Claves foráneas:

- `IdServicio` → `dbo.HIS_ServEstablecimiento.IdServicio` (FK_HIS_Cabecera_HIS_ServEstablecimiento)
- `IdEstablecimiento` → `dbo.HIS_ServEstablecimiento.IdEstablecimiento` (FK_HIS_Cabecera_HIS_ServEstablecimiento)
- `IdTurno` → `dbo.HIS_Turnos.IdHisTurno` (FK_HIS_Cabecera_HIS_Turnos)
- `IdHisLote` → `dbo.HIS_Lotes.IdHisLote` (FK_HIS_Cabecera_IdHisLote)
- `IdMedico` → `dbo.Medicos.IdMedico` (FK_HIS_Cabecera_IdMedico)
- `IdUsuario` → `dbo.Empleados.IdEmpleado` (FK_HIS_Cabecera_IdUsuario)

### HIS_CodigosActividades

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdHisCodActvidad | int | no | sí |  | PK |
| IdTipoAtencion | int | sí |  |  |  |
| CodigoActividad | char(6) | no |  |  |  |
| Descripcion | varchar(100) | sí |  |  |  |

Claves foráneas:

- `IdTipoAtencion` → `dbo.HIS_TipoAtencion.IdHisTipoAtencion` (IdTipoAtencion_IdTipoAtencion)

### HIS_colegios

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| cod_col | char(2) | no |  |  | PK |
| des_col | char(41) | no |  |  |  |
| sig_col | varchar(20) | sí |  |  |  |

### HIS_DatosEstablecimiento

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdDatoEstablec | int | no | sí |  | PK |
| IdEstablecimiento | int | sí |  |  |  |
| Color | varchar(30) | sí |  |  |  |
| Turnos | int | sí |  |  |  |
| UltimoNroFormatoHIS | int | sí |  |  |  |

Claves foráneas:

- `IdEstablecimiento` → `dbo.Establecimientos.IdEstablecimiento` (HIS_DatosEstablecimiento_IdDatoEstablec)

### HIS_Detalle

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdHisDetalle | int | no | sí |  | PK |
| IdHisCabecera | int | sí |  |  |  |
| IdTipoAtencion | int | sí |  |  |  |
| DiaAtencion | int | no |  |  |  |
| IdHisPaciente | int | sí |  |  |  |
| CodigoActividad | varchar(10) | sí |  |  |  |
| IdTipoFinanciamiento | int | sí |  |  |  |
| IdDistrito | int | sí |  |  |  |
| IdTipoEdad | int | sí |  |  |  |
| Edad | int | sí |  |  |  |
| Talla | int | sí |  |  |  |
| Peso | char(50) | sí |  |  |  |
| IdEstadoaEstablec | int | sí |  |  |  |
| IdEstadoaServicio | int | sí |  |  |  |
| NroRegistroLote | int | sí |  |  |  |
| NroRegistroHoja | int | sí |  |  |  |

Claves foráneas:

- `IdTipoFinanciamiento` → `dbo.HIS_Financiador.IdCodigoFinancHis` (FK_HIS_Detalle_HIS_Financiador)
- `IdTipoEdad` → `dbo.HIS_TipoEdad.IdHisTipoEdad` (FK_HIS_Detalle_HIS_TipoEdad)
- `IdEstadoaEstablec` → `dbo.TiposCondicionPaciente.IdTipoCondicionPaciente` (FK_HIS_Detalle_TiposCondicionPaciente)
- `IdEstadoaServicio` → `dbo.TiposCondicionPaciente.IdTipoCondicionPaciente` (FK_HIS_Detalle_TiposCondicionPaciente1)
- `IdDistrito` → `dbo.Distritos.IdDistrito` (HIS_Detalle_IdDistrito)
- `IdHisCabecera` → `dbo.HIS_Cabecera.IdHisCabecera` (HIS_Detalle_IdHisCabecera)
- `IdHisPaciente` → `dbo.HIS_Paciente.IdHisPaciente` (HIS_Detalle_IdHISPaciente)
- `IdTipoAtencion` → `dbo.HIS_TipoAtencion.IdHisTipoAtencion` (HIS_Detalle_IdTipoAtencion)
- `IdTipoFinanciamiento` → `dbo.TiposFinanciamiento.IdTipoFinanciamiento` (HIS_Detalle_IdTipoFinanciamiento)

### HIS_Detalle_Verifica

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdHisDetalle | int | no |  |  | PK |
| IdHisCabecera | int | no |  |  |  |
| IdTipoAtencion | int | sí |  |  |  |
| DiaAtencion | int | sí |  |  |  |
| Sexo | int | sí |  |  |  |
| IdNacionalidad | int | sí |  |  |  |
| NroDocIdentidad | varchar(12) | sí |  |  |  |
| NroHijo | char(2) | sí |  |  |  |
| IdEtnia | char(2) | sí |  |  |  |
| IdTipoDocumento | int | sí |  |  |  |
| NroHC_FF | varchar(20) | sí |  |  |  |
| CodigoActividad | varchar(10) | sí |  |  |  |
| IdTipoFinanciamiento | int | sí |  |  |  |
| IdDistrito | int | sí |  |  |  |
| IdTipoEdad | int | sí |  |  |  |
| Edad | int | sí |  |  |  |
| Talla | int | sí |  |  |  |
| Peso | char(50) | sí |  |  |  |
| IdEstadoaEstablec | int | sí |  |  |  |
| IdEstadoaServicio | int | sí |  |  |  |
| NroRegistroLote | int | sí |  |  |  |
| NroRegistroHoja | int | sí |  |  |  |
| Registrado | int | no |  |  |  |
| Coincide | int | sí |  |  |  |

### HIS_DetalleDiagnostico

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdHisDetalleDiagnostico | int | no | sí |  | PK |
| IdHisDetalle | int | sí |  |  |  |
| IdCIE | int | sí |  |  |  |
| IdSubClasificacionDX | int | sí |  |  |  |
| CodLAB | varchar(30) | sí |  |  |  |

Claves foráneas:

- `IdCIE` → `dbo.HIS_FACTCATALOGOSERVICIOS.IdDiagCpt` (FK_HIS_DetalleDiagnostico_HIS_FACTCATALOGOSERVICIOS)
- `IdCIE` → `dbo.Diagnosticos.IdDiagnostico` (HIS_DetalleDiagnostico_IdCIE)
- `IdHisDetalle` → `dbo.HIS_Detalle.IdHisDetalle` (HIS_DetalleDiagnostico_IdHisDetalle)
- `IdSubClasificacionDX` → `dbo.SubclasificacionDiagnosticos.IdSubclasificacionDx` (HIS_DetalleDiagnostico_IdSubClasificacionDX)

### HIS_DetalleDx_Verifica

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdHisDetalle | int | no |  |  | PK |
| IdCIE | int | no |  |  | PK |
| IdSubClasificacionDX | int | sí |  |  |  |
| CodLAB | varchar(30) | sí |  |  |  |

Claves foráneas:

- `IdHisDetalle` → `dbo.HIS_Detalle_Verifica.IdHisDetalle` (FK_HIS_DetalleDx_Verifica_HIS_Detalle_Verifica)

### HIS_DxOmitidos

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| NroPagina | int | no |  |  |  |
| Codigo1 | varchar(6) | no |  |  |  |
| Codigo2 | varchar(6) | no |  |  |  |
| Codigo3 | varchar(6) | no |  |  |  |
| Codigo4 | varchar(6) | no |  |  |  |
| Codigo5 | varchar(6) | no |  |  |  |
| Codigo6 | varchar(6) | no |  |  |  |
| LabConf1 | varchar(3) | sí |  |  |  |
| LabConf2 | varchar(3) | sí |  |  |  |
| LabConf3 | varchar(3) | sí |  |  |  |
| LabConf4 | varchar(3) | sí |  |  |  |
| LabConf5 | varchar(3) | sí |  |  |  |
| LabConf6 | varchar(3) | sí |  |  |  |
| Diagnost1 | varchar(1) | no |  |  |  |
| Diagnost2 | varchar(1) | no |  |  |  |
| Diagnost3 | varchar(1) | no |  |  |  |
| Diagnost4 | varchar(1) | no |  |  |  |
| Diagnost5 | varchar(1) | no |  |  |  |
| Diagnost6 | varchar(1) | no |  |  |  |
| Edad | int | no |  |  |  |
| TIP_EDAD | varchar(1) | no |  |  |  |
| Sexo | varchar(1) | no |  |  |  |
| Peso | money | no |  |  |  |
| FichaFam | varchar(10) | sí |  |  |  |
| Establecimiento | varchar(1) | no |  |  |  |
| Servicio | varchar(1) | no |  |  |  |
| CODVALIDACION | int | sí |  |  |  |
| IdLote | int | sí |  |  |  |
| DiaAtencion | int | sí |  |  |  |

### HIS_ESTAB

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| COD_ESTAB | nvarchar(9) | sí |  |  |  |
| DESC_ESTAB | nvarchar(44) | sí |  |  |  |
| COD_2000 | float | no |  |  | PK |
| TIPOESTAB | nvarchar(1) | sí |  |  |  |
| COD_DPTO | nvarchar(2) | sí |  |  |  |
| COD_PROV | nvarchar(2) | sí |  |  |  |
| COD_DIST | nvarchar(2) | sí |  |  |  |
| COD_DISA | nvarchar(2) | sí |  |  |  |
| COD_RED | nvarchar(2) | sí |  |  |  |
| COD_MIC | nvarchar(2) | sí |  |  |  |

### His_Establecimientos

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdEstablecimiento | int | no |  |  | PK |

Claves foráneas:

- `IdEstablecimiento` → `dbo.Establecimientos.IdEstablecimiento` (FK_His_Establecimientos_Establecimientos)

### HIS_EstablecPacienteHIS

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdEstablecPacienteHIS | int | no | sí |  | PK |
| IdEstablecimiento | int | sí |  |  |  |
| IdHisPaciente | int | sí |  |  |  |
| NroHC_FF | varchar(20) | no |  |  |  |

Claves foráneas:

- `IdEstablecimiento` → `dbo.Establecimientos.IdEstablecimiento` (His_EstablecPacienteHIS_IdEstablecimiento)
- `IdHisPaciente` → `dbo.HIS_Paciente.IdHisPaciente` (His_EstablecPacienteHIS_IdHisPaciente)

### His_EstadosCalidad

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdEstado | int | no |  |  | PK |
| Descripcion | varchar(50) | no |  |  |  |

### His_EstadosLote

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdEstado | int | no |  |  | PK |
| Descripcion | varchar(50) | no |  |  |  |

### HIS_FACTCATALOGOSERVICIOS

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdDiagCpt | int | no |  |  | PK |
| CodigoDiagCpt | varchar(20) | sí |  |  |  |
| DescripcionDiagCpt | varchar(1000) | sí |  |  |  |
| EsCpt | varchar(1) | sí |  |  |  |
| CodCondicion | varchar(1) | sí |  |  |  |
| DxSexo | varchar(4) | sí |  |  |  |
| CodigoDiagCptSinPunto | varchar(20) | sí |  |  |  |
| MasDeUnDiagnosticos | varchar(20) | sí |  |  |  |

### HIS_Financiador

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdCodigoFinancHis | int | no |  |  | PK |
| DescripcionFinancHis | varchar(50) | sí |  |  |  |
| IdFuenteFinanciamiento | int | sí |  |  |  |

### his_historicoAtenciones

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| idPaciente | int | no |  |  |  |
| fecha | datetime | no |  |  |  |
| diagnost | varchar(6) | sí |  |  |  |
| cpt | varchar(6) | sí |  |  |  |
| ups | varchar(6) | sí |  |  |  |

Claves foráneas:

- `idPaciente` → `dbo.Pacientes.IdPaciente` (FK_his_historicoAtenciones_Pacientes)

### HIS_Lotes

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdHisLote | int | no | sí |  | PK |
| IdEstablecimiento | int | sí |  |  |  |
| Lote | char(3) | sí |  |  |  |
| NroHojas | int | sí |  |  |  |
| Mes | int | sí |  |  |  |
| Anio | int | sí |  |  |  |
| Cerrado | int | no |  |  |  |
| idEstadoLote | int | sí |  |  |  |
| DobleDigitacion | int | no |  | (0) |  |

Claves foráneas:

- `IdEstablecimiento` → `dbo.His_Establecimientos.IdEstablecimiento` (FK_HIS_Lotes_His_Establecimientos)
- `idEstadoLote` → `dbo.His_EstadosLote.IdEstado` (FK_HIS_Lotes_His_EstadosLote)
- `Mes` → `dbo.HIS_Meses.IdMes` (FK_HIS_Lotes_HIS_Meses)

### HIS_Meses

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdMes | int | no |  |  | PK |
| Descripcion | varchar(50) | sí |  |  |  |

### HIS_Paciente

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdHisPaciente | int | no | sí |  | PK |
| Sexo | int | sí |  |  |  |
| IdNacionalidad | int | sí |  |  |  |
| NroDocIdentidad | varchar(12) | sí |  |  |  |
| NroHijo | char(2) | sí |  |  |  |
| IdEtnia | char(2) | sí |  |  |  |
| IdPacienteGalenHos | int | sí |  |  |  |
| IdTipoDocumento | int | sí |  |  |  |

Claves foráneas:

- `IdTipoDocumento` → `dbo.TiposDocIdentidad.IdDocIdentidad` (FK_HIS_Paciente_TiposDocIdentidad)
- `IdEtnia` → `dbo.HIS_tabetnia.codetni` (HIS_Paciente_IdEtnia)
- `IdNacionalidad` → `dbo.Paises.IdPais` (HIS_Paciente_IdNacionalidad)

### HIS_ProgMedEstMR

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdHisProgMedEstMR | int | no | sí |  | PK |
| IdMedico | int | sí |  |  |  |
| IdServicio | int | sí |  |  |  |
| IdEstablecimiento | int | sí |  |  |  |
| FechaProgramada | datetime | sí |  |  |  |
| IdTurno | int | sí |  |  |  |

Claves foráneas:

- `IdEstablecimiento` → `dbo.HIS_ServEstablecimiento.IdEstablecimiento` (FK_HIS_ProgMedEstMR_HIS_ServEstablecimiento)
- `IdServicio` → `dbo.HIS_ServEstablecimiento.IdServicio` (FK_HIS_ProgMedEstMR_HIS_ServEstablecimiento)
- `IdMedico` → `dbo.Medicos.IdMedico` (IdMedico_IdMedico)
- `IdTurno` → `dbo.HIS_Turnos.IdHisTurno` (IdTurno_IIdTurno)

### HIS_ServEstablecimiento

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdEstablecimiento | int | no |  |  | PK |
| IdServicio | int | no |  |  | PK |

Claves foráneas:

- `IdEstablecimiento` → `dbo.His_Establecimientos.IdEstablecimiento` (FK_HIS_ServEstablecimiento_His_Establecimientos)
- `IdServicio` → `dbo.Servicios.IdServicio` (HIS_ServEstablecimiento_IdServicio)

### HIS_situacio

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdHisSituacio | int | no | sí |  | PK |
| valores | char(5) | sí |  |  |  |
| descripcio | char(40) | no |  |  |  |
| codigo | numeric(5,0) | no |  |  |  |
| est | char(1) | no |  |  |  |

### HIS_tabetnia

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| codetni | char(2) | no |  |  | PK |
| desetni | char(48) | no |  |  |  |
| codgen | char(2) | no |  |  |  |
| etnias | char(24) | no |  |  |  |

### HIS_TEMPORAL

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| Codigo1 | varchar(6) | no |  |  |  |
| Codigo2 | varchar(6) | no |  |  |  |
| Codigo3 | varchar(6) | no |  |  |  |
| Codigo4 | varchar(6) | no |  |  |  |
| Codigo5 | varchar(6) | no |  |  |  |
| Codigo6 | varchar(6) | no |  |  |  |
| LabConf1 | varchar(3) | sí |  |  |  |
| LabConf2 | varchar(3) | sí |  |  |  |
| LabConf3 | varchar(3) | sí |  |  |  |
| LabConf4 | varchar(3) | sí |  |  |  |
| LabConf5 | varchar(3) | sí |  |  |  |
| LabConf6 | varchar(3) | sí |  |  |  |
| Diagnost1 | varchar(1) | no |  |  |  |
| Diagnost2 | varchar(1) | no |  |  |  |
| Diagnost3 | varchar(1) | no |  |  |  |
| Diagnost4 | varchar(1) | no |  |  |  |
| Diagnost5 | varchar(1) | no |  |  |  |
| Diagnost6 | varchar(1) | no |  |  |  |
| Edad | int | no |  |  |  |
| TIP_EDAD | varchar(1) | no |  |  |  |
| Sexo | varchar(1) | no |  |  |  |
| Peso | money | no |  |  |  |
| FichaFam | varchar(10) | sí |  |  |  |
| Establecimiento | varchar(1) | sí |  |  |  |
| Servicio | varchar(1) | sí |  |  |  |

### HIS_TemporalSexo

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| CieCpt | varchar(50) | no |  |  |  |
| DxSexo | int | sí |  |  |  |
| EsCpt | int | sí |  |  |  |

### HIS_TipoAtencion

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdHisTipoAtencion | int | no | sí |  | PK |
| Codigo | char(3) | sí |  |  |  |
| Descripcion | varchar(50) | sí |  |  |  |

### HIS_TipoEdad

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdHisTipoEdad | int | no | sí |  | PK |
| CodigoEdad | char(1) | sí |  |  |  |
| Descripcion | varchar(5) | sí |  |  |  |

### HIS_Turnos

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdHisTurno | int | no | sí |  | PK |
| Descripcion | varchar(10) | sí |  |  |  |

### HIS_VALIDACIONES

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| CODVALIDACION | int | no |  |  |  |
| TXTDESCRIPCION | varchar(300) | no |  |  |  |
| TXTVALIDACION | varchar(2000) | sí |  |  |  |
| TXTARCHIVO | varchar(100) | sí |  |  |  |
| TXTNPAGINA | varchar(100) | sí |  |  |  |
| CodCondicion | varchar(1) | sí |  |  |  |
| FECACTIVACION | datetime | no |  |  |  |
| FECINACTIVACION | datetime | no |  |  |  |
| CCH | varchar(1) | sí |  |  |  |

### HistoriasClinicas

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| NroHistoriaClinica | int | no |  |  | PK |
| FechaCreacion | datetime | no |  |  |  |
| FechaPasoAPasivo | datetime | sí |  |  |  |
| IdTipoHistoria | int | no |  |  |  |
| IdEstadoHistoria | int | no |  |  |  |
| IdPaciente | int | no |  |  |  |
| IdTipoNumeracion | int | no |  |  |  |
| NroHistoriaClinicaAnterior | int | sí |  |  |  |
| IdTipoNumeracionAnterior | int | sí |  |  |  |
| HistoriaSistemaAnterior | varchar(50) | sí |  |  |  |

Claves foráneas:

- `IdEstadoHistoria` → `dbo.EstadosHistoriaClinica.IdEstadoHistoria` (EstadosHistoriaClinica_HistoriasClinicas_FK1)
- `IdPaciente` → `dbo.Pacientes.IdPaciente` (Pacientes_HistoriasClinicas_FK1)
- `IdTipoNumeracion` → `dbo.TiposNumeracionHistoria.IdTipoNumeracion` (TiposGeneracionHistoria_HistoriasClinicas_FK1)
- `IdTipoHistoria` → `dbo.TiposHistoriaClinica.IdTipoHistoria` (TiposHistoriaClinica_HistoriasClinicas_FK1)

### HistoriasMovimientosxServicio

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdMovimiento | int | no | sí |  | PK |
| IdAtencion | int | no |  |  |  |
| NroHistoriaClinica | nvarchar(50) | no |  |  |  |
| ServicioDestino | nvarchar(100) | no |  |  |  |
| FechaEntrega | datetime | sí |  |  |  |
| FechaRecojo | datetime | sí |  |  |  |

### HistoriasSolicitadas

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdHistoriaSolicitada | int | no | sí |  | PK |
| IdPaciente | int | no |  |  |  |
| FechaSolicitud | datetime | sí |  |  |  |
| HoraSolicitud | char(5) | sí |  |  |  |
| FechaRequerida | datetime | sí |  |  |  |
| HoraRequerida | char(5) | sí |  |  |  |
| IdMotivo | int | sí |  |  |  |
| IdServicio | int | sí |  |  |  |
| Observacion | varchar(150) | sí |  |  |  |
| IdMovimiento | int | sí |  |  |  |
| IdEmpleadoSolicita | int | sí |  |  |  |
| FechaHoraReg | datetime | sí |  | getdate() |  |
| IdAtencion | int | sí |  |  |  |

Claves foráneas:

- `IdEmpleadoSolicita` → `dbo.Empleados.IdEmpleado` (Empleados_HistoriasSolicitadas_FK1)
- `IdMotivo` → `dbo.MotivosMovimientoHistoria.IdMotivo` (MotivosPrestamoHistoria_HistoriasSolicitadas_FK1)
- `IdMovimiento` → `dbo.MovimientosHistoriaClinica.IdMovimiento` (MovimientosHistoriaClinica_HistoriasSolicitadas_FK1)
- `IdPaciente` → `dbo.Pacientes.IdPaciente` (Pacientes_HistoriasSolicitadas_FK1)
- `IdServicio` → `dbo.Servicios.IdServicio` (Servicios_HistoriasSolicitadas_FK1)

### Hoja1$

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| codigo | float | sí |  |  |  |
| nombre | nvarchar(255) | sí |  |  |  |
| PrecioUnitario | float | sí |  |  |  |

### ICI_MINSA

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| codigo_eje | varchar(5) | no |  |  |  |
| codigo_pre | varchar(7) | sí |  |  |  |
| tipsum | varchar(1) | no |  |  |  |
| annomes | varchar(1) | no |  |  |  |
| codigo_med | varchar(7) | sí |  |  |  |
| saldo | int | no |  |  |  |
| precio | money | no |  |  |  |
| ingre | int | no |  |  |  |
| reingre | int | no |  |  |  |
| venta | int | no |  |  |  |
| sis | int | no |  |  |  |
| intersan | int | no |  |  |  |
| fec_perd | int | no |  |  |  |
| defnac | int | no |  |  |  |
| exo | int | no |  |  |  |
| soat | int | no |  |  |  |
| otr_conv | int | no |  |  |  |
| devol | int | no |  |  |  |
| vencido | int | no |  |  |  |
| merma | int | no |  |  |  |
| credhosp | int | no |  |  |  |
| distri | int | no |  |  |  |
| transf | int | no |  |  |  |
| ventainst | int | no |  |  |  |
| dev_ven | int | no |  |  |  |
| dev_merma | int | no |  |  |  |
| otras_sal | int | no |  |  |  |
| stock_fin | money | sí |  |  |  |
| stock_fin1 | money | sí |  |  |  |
| req | int | no |  |  |  |
| total | int | no |  |  |  |
| fec_exp | datetime | no |  |  |  |
| do_saldo | int | no |  |  |  |
| do_ingre | int | no |  |  |  |
| do_con | int | no |  |  |  |
| do_otr | int | no |  |  |  |
| do_tot | int | no |  |  |  |
| do_stk | int | no |  |  |  |
| do_fecexp | varchar(1) | no |  |  |  |
| fecha | varchar(1) | no |  |  |  |
| usuario | varchar(1) | no |  |  |  |
| indiproc | varchar(1) | no |  |  |  |
| sit | varchar(1) | no |  |  |  |
| indisiga | varchar(1) | no |  |  |  |
| dstkcero | varchar(1) | no |  |  |  |
| mcodigo | varchar(1) | no |  |  |  |
| inv_feb | varchar(1) | no |  |  |  |
| fechap | datetime | sí |  |  |  |

### ICI_SISMED

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| CODIGO_EJE | varchar(4) | sí |  |  |  |
| CODIGO_PRE | varchar(12) | sí |  |  |  |
| TIPSUM | char(1) | sí |  |  |  |
| PERIODO | varchar(8) | sí |  |  |  |
| CODIGO_MED | varchar(5) | sí |  |  |  |
| PRECIO_ADQUISICION | decimal(15,6) | sí |  |  |  |
| PRECIO_OPERACION | decimal(15,6) | sí |  |  |  |
| SALDO | int | sí |  |  |  |
| INGRE | int | sí |  |  |  |
| REINGRE | int | sí |  |  |  |
| VENTA | int | sí |  |  |  |
| SIS | int | sí |  |  |  |
| INTERSAN | int | sí |  |  |  |
| FAC_PERD | int | sí |  |  |  |
| DEFNAC | int | sí |  |  |  |
| EXO | int | sí |  |  |  |
| SOAT | int | sí |  |  |  |
| CREDHOSP | int | sí |  |  |  |
| OTR_CONV | int | sí |  |  |  |
| DEVOL | int | sí |  |  |  |
| VENCIDO | int | sí |  |  |  |
| MERMA | int | sí |  |  |  |
| DISTRI | int | sí |  |  |  |
| TRANSF | int | sí |  |  |  |
| VENTAINST | int | sí |  |  |  |
| DEV_VEN | int | sí |  |  |  |
| DEV_MERMA | int | sí |  |  |  |
| OTRAS_SAL | int | sí |  |  |  |
| TOTAL | int | sí |  |  |  |
| STOCK_FIN | int | sí |  |  |  |
| FEC_EXP | date | sí |  |  |  |
| REQUERIMIENTO | int | sí |  |  |  |
| DO_SALDO | int | sí |  |  |  |
| DO_INGRE | int | sí |  |  |  |
| DO_CON | int | sí |  |  |  |
| DO_OTR | int | sí |  |  |  |
| DO_TOT | int | sí |  |  |  |
| DO_STK | int | sí |  |  |  |
| DO_FECEXP | varchar(50) | sí |  |  |  |
| ENVIADO | int | sí |  |  |  |
| MEDLOTE | varchar(50) | sí |  |  |  |
| MEDREGSAN | varchar(50) | sí |  |  |  |
| TIPSUM2 | varchar(50) | sí |  |  |  |
| FFINAN | varchar(50) | sí |  |  |  |

### ImagCatalgoServicioDuracion

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdProducto | int | no |  |  | PK |
| DuracionEnMin | money | no |  |  |  |
| EsActivo | bit | no |  | (1) |  |
| FechaCrea | datetime | no |  |  |  |
| FechaEdita | datetime | sí |  |  |  |

Claves foráneas:

- `IdProducto` → `dbo.FactCatalogoServicios.IdProducto` (FK_ImagCatalgoServicioDuracion_FactCatalogoServicios)

### ImagCitaOrden

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdCita | int | no |  |  | PK |
| idReceta | int | no |  |  |  |
| FechaRegistro | datetime | no |  | getdate() |  |
| IdUsuario | int | no |  |  |  |
| idProductoCPT | int | no |  | (0) | PK |

### ImagEstados

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdImagEstado | int | no |  |  | PK |
| Estado | varchar(20) | no |  |  |  |

### ImagMotivoSalidas

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| idMotivoSalida | int | no | sí |  | PK |
| motivo | varchar(100) | no |  |  |  |

### ImagMovimiento

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdMovimiento | int | no | sí |  | PK |
| MovTipo | varchar(1) | no |  |  |  |
| IdTipoConcepto | int | no |  |  |  |
| IdPuntoCarga | int | no |  |  |  |
| Fecha | datetime | no |  |  |  |
| IdUsuario | int | no |  |  |  |
| IdImagEstado | int | no |  |  |  |
| EstadoRis | varchar(1) | sí |  |  |  |

Claves foráneas:

- `IdImagEstado` → `dbo.ImagEstados.IdImagEstado` (FK_ImagCabecera_ImagEstados)
- `IdPuntoCarga` → `dbo.FactPuntosCarga.IdPuntoCarga` (FK_ImagMovimiento_FactPuntosCarga)
- `IdTipoConcepto` → `dbo.ImagTipoConceptos.idTipoConcepto` (FK_ImagMovimiento_ImagTipoConceptos)

### ImagMovimientoArchivos

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdArchivo | int | no | sí |  | PK |
| IdMovimiento | int | no |  |  |  |
| IdProductoCPT | int | no |  |  |  |
| Tipo | varchar(10) | no |  |  |  |
| RutaArchivo | varchar(500) | no |  |  |  |
| NombreOriginal | varchar(255) | no |  |  |  |
| IdUsuario | int | no |  |  |  |
| FechaSubida | datetime | no |  | getdate() |  |
| Activo | bit | no |  | (1) |  |

Claves foráneas:

- `IdMovimiento` → `dbo.ImagMovimiento.IdMovimiento` (FK_ImagMovimientoArchivos_Movimiento)

### ImagMovimientoCPT

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| idMovimiento | int | no |  |  | PK |
| idProductoCPT | int | no |  |  | PK |
| cantidad | int | no |  |  |  |
| precio | money | no |  |  |  |
| importe | money | no |  |  |  |

Claves foráneas:

- `idMovimiento` → `dbo.ImagMovimiento.IdMovimiento` (FK_ImagMovimientoCPT_ImagMovimiento)

### ImagMovimientoDetalle

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| idMovimiento | int | no |  |  |  |
| idProductoCPT | int | sí |  |  |  |
| idProducto | int | no |  |  |  |
| CantidadFallada | int | no |  | (0) |  |
| Cantidad | int | no |  |  |  |

Claves foráneas:

- `idMovimiento` → `dbo.ImagMovimiento.IdMovimiento` (FK_ImagMovimientoDetalle_ImagMovimiento)

### ImagMovimientoImagenes

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdMovimiento | int | no |  |  | PK |
| IdOrden | int | no |  |  |  |
| CorrelativoAnual | int | sí |  |  |  |
| IdCuentaAtencion | int | sí |  |  |  |
| IdComprobantePago | int | sí |  |  |  |
| idPersonaTomaImagen | int | sí |  |  |  |
| idPersonaRecoge | int | sí |  |  |  |
| zonaRayosX | varchar(50) | sí |  |  |  |
| PorcInformeRadiolog | money | sí |  |  |  |
| ResultadoFinal | varchar(1000) | sí |  |  |  |
| EsContraste | int | sí |  |  |  |
| EsContrasteIonico | int | sí |  |  |  |
| idDiagnostico | int | sí |  |  |  |
| EsDiagnosticoDefinitivo | int | sí |  |  |  |
| Eo_FUM | datetime | sí |  |  |  |
| Eo_Gestantes | varchar(2) | sí |  |  |  |
| Eo_Partos | varchar(20) | sí |  |  |  |
| Eo_EG | int | sí |  |  |  |
| Paciente | varchar(100) | sí |  |  |  |
| IdTipoSexo | int | sí |  |  |  |
| FechaNacimiento | datetime | sí |  |  |  |

Claves foráneas:

- `IdOrden` → `dbo.FactOrdenServicio.IdOrden` (FK_ImagMovimientoRayosX_FactOrdenServicio)
- `IdMovimiento` → `dbo.ImagMovimiento.IdMovimiento` (FK_ImagMovimientoRayosX_ImagMovimiento)

### ImagMovimientoIngresos

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdMovimiento | int | no |  |  | PK |
| NroDocumento | varchar(20) | sí |  |  |  |
| IdPersonaRecepciona | int | sí |  |  |  |

Claves foráneas:

- `IdMovimiento` → `dbo.ImagMovimiento.IdMovimiento` (FK_ImagMovimientoIngresos_ImagMovimiento)

### ImagMovimientoResultados

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdMovimiento | int | no |  |  |  |
| IdOrden | int | no |  |  |  |
| IdCuentaAtencion | int | sí |  |  |  |
| IdProducto | varchar(50) | no |  |  |  |
| ResultadoFinal | varchar(5000) | sí |  |  |  |
| IdUsuario | int | sí |  |  |  |
| Estado | bit | sí |  |  |  |
| CodigoIMR | varchar(50) | sí |  |  |  |
| IdComprobantePago | int | sí |  |  |  |

### ImagMovimientoSalidas

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdMovimiento | int | no |  |  | PK |
| IdResponsable | int | no |  |  |  |
| IdMotivoSalida | int | no |  |  |  |

Claves foráneas:

- `IdMovimiento` → `dbo.ImagMovimiento.IdMovimiento` (FK_ImagMovimientoSalidas_ImagMovimiento)

### ImagRecojeExamen

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| idRecojeExamen | int | no | sí |  | PK |
| RecojeExamen | varchar(30) | no |  |  |  |

### ImagSala

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdSala | int | no | sí |  | PK |
| IdTipoModalidadSala | int | no |  |  |  |
| Sala | varchar(50) | no |  |  |  |
| Codigo | varchar(15) | no |  |  |  |
| EsActivo | bit | no |  | (1) |  |
| FechaCrea | datetime | no |  |  |  |
| FechaEdita | datetime | sí |  |  |  |

Claves foráneas:

- `IdTipoModalidadSala` → `dbo.ImagTipoModalidadSala.IdTipoModalidadSala` (FK_ImagSala_ImagTipoModalidadSala)

### ImagSalaPuntoCarga

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdSala | int | no |  |  | PK |
| IdPuntoCarga | int | no |  |  | PK |
| EsActivo | bit | no |  |  |  |
| FechsCrea | datetime | no |  |  |  |
| FechaEdita | datetime | sí |  |  |  |

Claves foráneas:

- `IdPuntoCarga` → `dbo.FactPuntosCarga.IdPuntoCarga` (FK_ImagSalaPuntoCarga_FactPuntosCarga)
- `IdSala` → `dbo.ImagSala.IdSala` (FK_ImagSalaPuntoCarga_ImagSala)

### ImagTipoConceptos

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| idTipoConcepto | int | no | sí |  | PK |
| Concepto | varchar(50) | no |  |  |  |

### ImagTipoModalidadSala

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdTipoModalidadSala | int | no | sí |  | PK |
| TipoModalidadSala | varchar(50) | no |  |  |  |
| Codigo | varchar(5) | no |  |  |  |
| EsActivo | bit | no |  | (1) |  |
| FechaCrea | datetime | no |  |  |  |
| FechaEdita | datetime | sí |  |  |  |

### ImgItems

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| idItem | int | no |  |  | PK |
| Item | varchar(100) | sí |  |  |  |
| idProductoCpt | int | sí |  |  |  |

### ImgItemsCpt

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| idProductoCpt | int | no |  |  | PK |
| ordenXresultado | int | no |  |  | PK |
| idGrupo | int | no |  |  |  |
| idItemGrupo | int | sí |  |  |  |
| idItem | int | no |  |  |  |
| ValorSiEsCombo | varchar(100) | sí |  |  |  |
| ValorReferencial | varchar(100) | sí |  |  |  |
| Metodo | varchar(50) | sí |  |  |  |
| SoloNumero | bit | sí |  |  |  |
| SoloTexto | bit | sí |  |  |  |
| SoloCombo | bit | sí |  |  |  |
| SoloCheck | bit | sí |  |  |  |

### ImgItemsGrupos

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| idItemGrupo | int | no |  |  | PK |
| Grupo | varchar(100) | sí |  |  |  |

### ImgLabObservaciones

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| id | int | no | sí |  | PK |
| idOrden | int | sí |  |  |  |
| idProducto | int | sí |  |  |  |
| idMovimiento | int | sí |  |  |  |
| Obseraciones | text | sí |  |  |  |
| Conclusiones | varchar(max) | sí |  | '' |  |

### ImgResultadoPorItems

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| idOrden | int | no |  |  | PK |
| idProductoCpt | int | no |  |  | PK |
| ordenXresultado | int | no |  |  | PK |
| ValorNumero | money | sí |  |  |  |
| ValorTexto | varchar(500) | sí |  |  |  |
| ValorCombo | varchar(100) | sí |  |  |  |
| ValorCheck | varchar(1) | sí |  |  |  |
| realizaAnalisis | int | no |  |  |  |
| idUsuario | int | no |  |  |  |
| Fecha | datetime | no |  |  |  |

### Impactacion

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| Id | int | no | sí |  | PK |
| OdontogramaVersionId | int | no |  |  |  |
| NumeroDiente | tinyint | no |  |  |  |
| Tipo | nvarchar(30) | sí |  |  |  |
| Color | nvarchar(30) | sí |  |  |  |
| Metadata | nvarchar(max) | sí |  |  |  |
| Fecha_Creacion | datetime2 | no |  | getdate() |  |
| Usuario_Creacion | nvarchar(100) | sí |  |  |  |

Claves foráneas:

- `OdontogramaVersionId` → `dbo.OdontogramaVersion.Id` (FK_Impactacion_Version)

### Implante

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| Id | int | no | sí |  | PK |
| OdontogramaVersionId | int | no |  |  |  |
| NumeroDiente | tinyint | no |  |  |  |
| DiametroMM | decimal(4,2) | sí |  |  |  |
| LongitudMM | decimal(4,1) | sí |  |  |  |
| Sistema | nvarchar(50) | sí |  |  |  |
| Material | nvarchar(50) | sí |  |  |  |
| Color | nvarchar(30) | sí |  |  |  |
| Metadata | nvarchar(max) | sí |  |  |  |
| Fecha_Creacion | datetime2 | no |  | getdate() |  |
| Usuario_Creacion | nvarchar(100) | sí |  |  |  |

Claves foráneas:

- `OdontogramaVersionId` → `dbo.OdontogramaVersion.Id` (FK_Implante_Version)

### Institucion

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdInstitucion | int | sí |  |  |  |
| Institución | varchar(150) | sí |  |  |  |
| CodigoInstitucion | int | sí |  |  |  |

### InteoIntegracionSistema

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdIntegracionSistema | int | no | sí |  | PK |
| IdTipoSistema | int | no |  |  |  |
| IdProveedorSistema | int | no |  |  |  |
| NombreUsuario | varchar(35) | sí |  |  |  |
| ClaveUsuario | varchar(50) | sí |  |  |  |
| EsProveedorActual | bit | no |  | (0) |  |
| EsActivo | bit | no |  | (1) |  |
| FechaCrea | datetime | no |  |  |  |
| FechaEdita | datetime | sí |  |  |  |

Claves foráneas:

- `IdProveedorSistema` → `dbo.InteoProveedorSistema.IdProveedorSistema` (FK_InteoIntegracionSistema_InteoProveedorSistema)
- `IdTipoSistema` → `dbo.InteoTipoSistema.IdTipoSistema` (FK_InteoIntegracionSistema_InteoTipoSistema)

### InteoProveedorSistema

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdProveedorSistema | int | no | sí |  | PK |
| ProveedorSistema | varchar(100) | no |  |  |  |
| EsActivo | bit | no |  |  |  |
| FechaCrea | datetime | no |  |  |  |
| FechaEdita | datetime | sí |  |  |  |

### InteoTipoSistema

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdTipoSistema | int | no | sí |  | PK |
| TipoSistema | varchar(50) | no |  |  |  |
| EsActivo | bit | no |  | (1) |  |
| FechaCrea | datetime | no |  |  |  |
| FechaEdita | datetime | sí |  |  |  |

### InterconsultaCab

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdInterconsultaCab | int | no | sí |  | PK |
| IdAtencion | int | no |  |  |  |
| IdInterconsulta | int | no |  |  |  |
| IdServicioS | int | sí |  |  |  |
| IdEspecialidad | int | sí |  |  |  |
| IdMedicoS | int | sí |  |  |  |
| IdMedicoR | int | sí |  |  |  |
| IdPaciente | int | sí |  |  |  |
| IdCama | int | sí |  |  |  |
| EstadoReg | bit | sí |  |  |  |
| Estacion | nchar(50) | sí |  |  |  |
| FechaReg | datetime | sí |  |  |  |

### InterconsultaDiagnosticos

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdInterconsultaDiagnostico | int | no | sí |  | PK |
| IdCuentaAtencion | int | sí |  |  |  |
| IdDiagnosticoIC | int | sí |  |  |  |
| IdDiagnostico | int | sí |  |  |  |
| IdSubclasificacionDx | int | sí |  |  |  |
| TipoInterconsulta | varchar(1) | sí |  |  |  |
| IdUsuario | int | sí |  |  |  |
| Estacion | varchar(50) | sí |  |  |  |
| FechaReg | datetime | sí |  |  |  |
| Estado | bit | sí |  |  |  |

### InterconsultaRespuesta

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdInterconsultaRespuesta | int | no | sí |  | PK |
| IdInterconsultaCab | int | no |  |  |  |
| HoraR | varchar(5) | sí |  |  |  |
| FechaR | datetime | sí |  |  |  |
| ResumenHC | varchar(3000) | sí |  |  |  |
| Motivo | varchar(3000) | sí |  |  |  |
| IdUsuario | int | sí |  |  |  |
| EstadoReg | bit | sí |  |  |  |
| Estacion | varchar(50) | sí |  |  |  |
| FechaReg | datetime | sí |  |  |  |

### InterconsultaSolicitud

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdInterconsultaSolicitud | int | no | sí |  | PK |
| IdInterconsultaCab | int | sí |  |  |  |
| HoraS | varchar(5) | sí |  |  |  |
| FechaS | datetime | sí |  |  |  |
| ResumenHC | varchar(1000) | sí |  |  |  |
| Motivo | varchar(1000) | sí |  |  |  |
| IdUsuario | int | sí |  |  |  |
| EstadoReg | bit | sí |  |  |  |
| Estacion | varchar(50) | sí |  |  |  |
| FechaReg | datetime | sí |  |  |  |

### interlabCabecera

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| identificador | int | no | sí |  | PK |
| num_orden | nvarchar(255) | sí |  |  |  |
| Historia | nvarchar(255) | sí |  |  |  |
| PacienteEmail | nvarchar(255) | sí |  |  |  |
| PacienteFiliacion | nvarchar(255) | sí |  |  |  |
| PacienteId | nvarchar(255) | sí |  |  |  |
| PacienteTipoDocumento | nvarchar(255) | sí |  |  |  |
| PacienteDocumento | nvarchar(255) | sí |  |  |  |
| paciente | nvarchar(255) | sí |  |  |  |
| sexo | nvarchar(1) | sí |  |  |  |
| fnacimiento | nvarchar(255) | sí |  |  |  |
| id_procede | nvarchar(255) | sí |  |  |  |
| dxCodigo | nvarchar(255) | sí |  |  |  |
| dx | nvarchar(255) | sí |  |  |  |
| medicoDNI | nvarchar(255) | sí |  |  |  |
| medico | nvarchar(255) | sí |  |  |  |
| servicioCodigo | nvarchar(255) | sí |  |  |  |
| fechaHoraMuestra | nvarchar(255) | sí |  |  |  |
| idEstado | nvarchar(255) | sí |  |  |  |
| medicoColegiatura | nvarchar(255) | sí |  |  |  |

### interlabDetalle

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| identificador | nvarchar(255) | sí |  |  |  |
| cptCodigo | nvarchar(255) | sí |  |  |  |
| cpt | nvarchar(255) | sí |  |  |  |
| DNI | nvarchar(255) | sí |  |  |  |
| FechaHoraResultado | nvarchar(255) | sí |  |  |  |
| Grupo | nvarchar(255) | sí |  |  |  |
| cptCodigoRes | nvarchar(255) | sí |  |  |  |
| item | nvarchar(255) | sí |  |  |  |
| itemResultado | nvarchar(255) | sí |  |  |  |
| itemReferencia | nvarchar(255) | sí |  |  |  |
| itemMetodo | nvarchar(255) | sí |  |  |  |
| idEstado | nvarchar(255) | sí |  |  |  |
| idemProducto | nvarchar(255) | sí |  |  |  |
| Observaciones | nvarchar(max) | sí |  |  |  |
| EMPRESA | nvarchar(max) | sí |  |  |  |

### Intrusion

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| Id | int | no | sí |  | PK |
| OdontogramaVersionId | int | no |  |  |  |
| NumeroDiente | tinyint | no |  |  |  |
| MagnitudMM | decimal(5,2) | sí |  |  |  |
| Color | nvarchar(30) | sí |  |  |  |
| Metadata | nvarchar(max) | sí |  |  |  |
| Fecha_Creacion | datetime2 | no |  | getdate() |  |
| Usuario_Creacion | nvarchar(100) | sí |  |  |  |

Claves foráneas:

- `OdontogramaVersionId` → `dbo.OdontogramaVersion.Id` (FK_Intrusion_Version)

### LabEstados

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdLabEstado | int | no |  |  | PK |
| Estado | varchar(20) | no |  |  |  |

### labGrupos

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| idGrupo | int | no | sí |  | PK |
| NombreGrupo | char(20) | no |  |  |  |
| SiglasGrupo | char(3) | no |  |  |  |
| idCargo | int | sí |  |  |  |

### LabItems

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| idItem | int | no |  |  | PK |
| Item | varchar(500) | sí |  |  |  |
| idProductoCpt | int | sí |  |  |  |

### LabItemsCpt

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| idProductoCpt | int | no |  |  | PK |
| ordenXresultado | int | no |  |  | PK |
| idGrupo | int | no |  |  |  |
| idItemGrupo | int | sí |  |  |  |
| idItem | int | no |  |  |  |
| ValorSiEsCombo | varchar(100) | sí |  |  |  |
| ValorReferencial | varchar(500) | sí |  |  |  |
| Metodo | varchar(50) | sí |  |  |  |
| SoloNumero | bit | sí |  |  |  |
| SoloTexto | bit | sí |  |  |  |
| SoloCombo | bit | sí |  |  |  |
| SoloCheck | bit | sí |  |  |  |

Claves foráneas:

- `idProductoCpt` → `dbo.FactCatalogoServicios.IdProducto` (FK_LabItemsCpt_FactCatalogoServicios)
- `idGrupo` → `dbo.labGrupos.idGrupo` (FK_LabItemsCpt_labGrupos)
- `idItem` → `dbo.LabItems.idItem` (FK_LabItemsCpt_LabItems)
- `idItemGrupo` → `dbo.LabItemsGrupos.idItemGrupo` (FK_LabItemsCpt_LabItemsGrupos)

### LabItemsGrupos

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| idItemGrupo | int | no |  |  | PK |
| Grupo | varchar(100) | sí |  |  |  |

### LabMotivoSalidas

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| idMotivoSalida | int | no | sí |  | PK |
| motivo | varchar(100) | no |  |  |  |

### LabMovimiento

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdMovimiento | int | no | sí |  | PK |
| MovTipo | varchar(1) | no |  |  |  |
| IdTipoConcepto | int | no |  |  |  |
| IdPuntoCarga | int | no |  |  |  |
| Fecha | datetime | no |  |  |  |
| IdUsuario | int | no |  |  |  |
| IdLabEstado | int | no |  | (0) |  |

Claves foráneas:

- `IdPuntoCarga` → `dbo.FactPuntosCarga.IdPuntoCarga` (FK_LabMovimiento_FactPuntosCarga)
- `IdLabEstado` → `dbo.LabEstados.IdLabEstado` (FK_LabMovimiento_LabEstados)
- `IdTipoConcepto` → `dbo.LabTipoConceptos.idTipoConcepto` (FK_LabMovimiento_LabTipoConceptos)

### LabMovimientoCPT

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| idMovimiento | int | no |  |  | PK |
| idProductoCPT | int | no |  |  | PK |
| cantidad | int | no |  |  |  |
| precio | money | no |  |  |  |
| importe | money | no |  |  |  |
| observaciones | varchar(3000) | sí |  |  |  |

Claves foráneas:

- `idMovimiento` → `dbo.LabMovimiento.IdMovimiento` (FK_LabMovimientoCPT_LabMovimiento)

### LabMovimientoDetalle

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| idMovimiento | int | no |  |  |  |
| idProductoCPT | int | sí |  |  |  |
| idProducto | int | no |  |  |  |
| CantidadFallada | int | no |  |  |  |
| Cantidad | int | no |  |  |  |

Claves foráneas:

- `idMovimiento` → `dbo.LabMovimiento.IdMovimiento` (FK_LabMovimientoDetalle_LabMovimiento)

### LabMovimientoIngresos

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdMovimiento | int | no |  |  | PK |
| NroDocumento | varchar(20) | sí |  |  |  |
| IdPersonaRecepciona | int | sí |  |  |  |

Claves foráneas:

- `IdMovimiento` → `dbo.LabMovimiento.IdMovimiento` (FK_LabMovimientoIngresos_LabMovimiento)

### LabMovimientoLaboratorio

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdMovimiento | int | no |  |  | PK |
| IdOrden | int | no |  |  |  |
| CorrelativoAnual | int | sí |  |  |  |
| IdCuentaAtencion | int | sí |  |  |  |
| IdComprobantePago | int | sí |  |  |  |
| idPersonaTomaLab | int | sí |  |  |  |
| idPersonaRecoge | int | sí |  |  |  |
| idDiagnostico | int | sí |  |  |  |
| EsDiagnosticoDefinitivo | int | sí |  |  |  |
| OrdenaPrueba | varchar(50) | sí |  |  |  |
| Paciente | varchar(100) | sí |  |  |  |
| idTipoSexo | int | sí |  |  |  |
| FechaNacimiento | datetime | sí |  |  |  |

Claves foráneas:

- `IdOrden` → `dbo.FactOrdenServicio.IdOrden` (FK_LabMovimientoLaboratorio_FactOrdenServicio)
- `IdMovimiento` → `dbo.LabMovimiento.IdMovimiento` (FK_LabMovimientoLaboratorio_LabMovimiento)

### LabMovimientoSalidas

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdMovimiento | int | no |  |  | PK |
| IdResponsable | int | no |  |  |  |
| IdMotivoSalida | int | no |  |  |  |

Claves foráneas:

- `IdMovimiento` → `dbo.LabMovimiento.IdMovimiento` (FK_LabMovimientoSalidas_LabMovimiento)

### labPruebas

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| idPrueba | int | no | sí |  | PK |
| CodigoPrueba | char(6) | no |  |  |  |
| CodigoCPT | char(20) | sí |  |  |  |

### LabRecojeExamen

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| idRecojeExamen | int | no | sí |  | PK |
| RecojeExamen | varchar(30) | no |  |  |  |

### LabResultado

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| idAnalisis | varchar(20) | no |  |  | PK |
| idOrden | int | no |  |  | PK |
| resultadoAnalisis | text | no |  |  |  |
| realizaAnalisis | int | no |  |  |  |
| observacionResultado | text | sí |  |  |  |
| idUsuario | int | no |  |  |  |
| fecha | datetime | sí |  |  |  |

### LabResultadoPorItems

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| idOrden | int | no |  |  | PK |
| idProductoCpt | int | no |  |  | PK |
| ordenXresultado | int | no |  |  | PK |
| ValorNumero | money | sí |  |  |  |
| ValorResultado | varchar(100) | sí |  |  |  |
| ValorTexto | varchar(500) | sí |  |  |  |
| ValorCombo | varchar(100) | sí |  |  |  |
| ValorCheck | varchar(1) | sí |  |  |  |
| realizaAnalisis | int | no |  |  |  |
| idUsuario | int | no |  |  |  |
| Fecha | datetime | no |  |  |  |
| Canal | varchar(15) | sí |  |  |  |

Claves foráneas:

- `idProductoCpt` → `dbo.LabItemsCpt.idProductoCpt` (FK_LabResutadoPorItems_LabItemsCpt)
- `ordenXresultado` → `dbo.LabItemsCpt.ordenXresultado` (FK_LabResutadoPorItems_LabItemsCpt)

### LabTipoConceptos

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| idTipoConcepto | int | no | sí |  | PK |
| Concepto | varchar(50) | no |  |  |  |

### Linea

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| Id | int | no | sí |  | PK |
| OdontogramaVersionId | int | no |  |  |  |
| Color | nvarchar(30) | sí |  |  |  |
| Grosor | decimal(4,2) | sí |  |  |  |
| Tipo | nvarchar(30) | sí |  |  |  |
| Puntos | nvarchar(max) | no |  |  |  |
| Metadata | nvarchar(max) | sí |  |  |  |
| Fecha_Creacion | datetime2 | no |  | getdate() |  |
| Usuario_Creacion | nvarchar(100) | sí |  |  |  |

Claves foráneas:

- `OdontogramaVersionId` → `dbo.OdontogramaVersion.Id` (FK_Linea_Version)

### Listado de Establecimientos

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| id | nvarchar(255) | sí |  |  |  |
| codigo | nvarchar(255) | sí |  |  |  |
| IdClasificación | nvarchar(255) | sí |  |  |  |
| Idtipo | nvarchar(255) | sí |  |  |  |

### ListBarGrupos

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdListGrupo | int | no |  |  | PK |
| Texto | varchar(50) | no |  |  |  |
| Clave | varchar(50) | no |  |  |  |
| Indice | int | no |  |  |  |
| Area | varchar(60) | sí |  |  |  |
| IconoArea | varchar(60) | sí |  |  |  |

### ListBarItems

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdListItem | int | no |  |  | PK |
| Texto | varchar(50) | no |  |  |  |
| Clave | varchar(50) | no |  |  |  |
| IdListGrupo | int | no |  |  |  |
| Indice | int | no |  |  |  |
| KeyIcon | varchar(50) | sí |  |  |  |
| Controlador | varchar(80) | sí |  |  |  |
| Metodo | varchar(80) | sí |  |  |  |
| IconoWeb | varchar(80) | sí |  |  |  |
| ActivoWeb | bit | sí |  |  |  |
| ActivoSisgalen | bit | sí |  |  |  |

Claves foráneas:

- `IdListGrupo` → `dbo.ListBarGrupos.IdListGrupo` (GUIListBarGrupos_GUIListBarItems_FK1)

### ListBarReporte

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| idReporte | int | no | sí |  | PK |
| Reporte | varchar(255) | no |  |  |  |
| id_MenuReporte | varchar(100) | no |  |  |  |
| MODULO | varchar(50) | no |  |  |  |

### LogRefCon

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| idLog | int | no | sí |  |  |
| Descripcion | varchar(200) | sí |  |  |  |
| FechaCreacion | datetime | sí |  |  |  |

### lolcliProblemasHC

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| pacHis | char(50) | sí |  |  |  |
| pacPat | char(30) | sí |  |  |  |
| pacMat | char(30) | sí |  |  |  |
| pacNam | char(50) | sí |  |  |  |
| nroHistoriaGalenhos | varchar(50) | sí |  |  |  |
| pacfin | datetime | sí |  |  |  |
| autogeneradoGalenHos | varchar(50) | sí |  |  |  |

### lolcliUbigeo

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| ubigeoLolcli | varchar(50) | sí |  |  |  |
| dptoLolCli | varchar(50) | sí |  |  |  |
| provLolCli | varchar(50) | sí |  |  |  |
| distritoLolCli | varchar(50) | sí |  |  |  |
| idDepartamento | int | sí |  |  |  |
| idprovincia | int | sí |  |  |  |
| idDistrito | int | sí |  |  |  |
| dpto | varchar(50) | sí |  |  |  |
| prov | varchar(50) | sí |  |  |  |
| distrito | varchar(50) | sí |  |  |  |

### MAESTRO_HIS_CIE_CPMS

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| Codigo_Item | varchar(10) | no |  |  |  |
| Descripcion_Item | varchar(400) | sí |  |  |  |
| Fg_Tipo | varchar(2) | sí |  |  |  |
| Descripcion_Tipo_Item | varchar(100) | sí |  |  |  |
| Fg_Estado | int | no |  |  |  |

### MAESTRO_HIS_FINANCIADOR

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| Id_Financiador | varchar(2) | no |  |  |  |
| Descripcion_Financiador | varchar(100) | sí |  |  |  |

### MAESTRO_HIS_LAB

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| Codigo_Lab | int | no |  |  |  |
| Valor_Lab | varchar(5) | sí |  |  |  |
| Descripcion_Lab | varchar(8000) | sí |  |  |  |

### MAESTRO_HIS_OTRA_CONDICION

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| Id_Otra_Condicion | int | no |  |  |  |
| Descripcion_Otra_Condicion | varchar(300) | sí |  |  |  |

### MAESTRO_HIS_UPS

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| Id_Ups | varchar(6) | no |  |  |  |
| Descripcion_Ups | varchar(800) | sí |  |  |  |

### Mascota

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| id_mascota | int | no | sí |  | PK |
| nombre | varchar(100) | no |  |  |  |
| especie | varchar(50) | no |  |  |  |
| raza | varchar(50) | no |  |  |  |
| fecha_nacimiento | date | no |  |  |  |
| foto | varbinary(max) | sí |  |  |  |
| id_duenio | int | no |  |  |  |

Claves foráneas:

- `id_duenio` → `dbo.Duenio.id_duenio` (FK__Mascota__id_duen__70D2A0E7)

### Medicos

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdMedico | int | no | sí |  | PK |
| Colegiatura | varchar(6) | no |  |  |  |
| IdEmpleado | int | sí |  |  |  |
| LoteHIS | varchar(2) | sí |  |  |  |
| idColegioHIS | varchar(2) | sí |  |  |  |
| rne | varchar(50) | sí |  |  |  |
| egresado | bit | sí |  |  |  |

Claves foráneas:

- `IdEmpleado` → `dbo.Empleados.IdEmpleado` (Empleados_Medicos_FK1)

### MedicosEspecialidad

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdMedicoEspecialidad | int | no | sí |  | PK |
| IdEspecialidad | int | no |  |  |  |
| IdMedico | int | no |  |  |  |

Claves foráneas:

- `IdEspecialidad` → `dbo.Especialidades.IdEspecialidad` (Especialidades_MedicosEspecialidad_FK1)
- `IdMedico` → `dbo.Medicos.IdMedico` (Medicos_MedicosEspecialidad_FK1)

### MedicosExtranjeros

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdEmpleado | int | no |  |  | PK |
| idTipoDocumento | int | no |  |  |  |
| documento | varchar(20) | no |  |  |  |
| activo | bit | no |  | (1) |  |

### MensajesEnVentana

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| Ventana | varchar(50) | no |  |  | PK |
| Orden | int | no |  |  | PK |
| MensajeAusuario | varchar(250) | sí |  |  |  |

### MicroRed

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdMicroRed | int | no |  |  | PK |
| Descripcion | varchar(50) | no |  |  |  |

### MicroRedEstablecimiento

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdMicro | int | sí |  |  |  |
| Codigo | int | sí |  |  |  |
| Nombre | varchar(150) | sí |  |  |  |
| CodigoDisa | int | sí |  |  |  |
| CódigoRed | int | sí |  |  |  |

### modulos_estadistica

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| id_modulo | int | no | sí |  | PK |
| codigo_modulo | varchar(50) | no |  |  |  |
| nombre_modulo | varchar(100) | no |  |  |  |
| descripcion | varchar(255) | sí |  |  |  |
| orden | int | no |  | (1) |  |
| es_activo | bit | no |  | (1) |  |
| fecha_registro | datetime | no |  | getdate() |  |

### ModuloSis

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdModuloSis | int | no | sí |  | PK |
| NombreModulo | varchar(120) | no |  |  |  |

### ModulosRolesSis

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdModuloRoles | int | no | sí |  | PK |
| IdRol | int | no |  |  |  |
| IdModuloSis | int | no |  |  |  |
| IdEmpleado | int | no |  | (1) |  |

### MotivoIngresoEmer

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdMotivoIngreso | int | no |  |  | PK |
| Descripcion | varchar(50) | no |  |  |  |

### MotivoReferencia

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| id_motivo_ref | int | sí |  |  |  |
| desc_motivo_ref | varchar(100) | sí |  |  |  |

### MotivosMovimientoHistoria

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdMotivo | int | no |  |  | PK |
| Descripcion | varchar(50) | no |  |  |  |

### MovimientosFormatosHistoriaClinica

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdMovimiento | int | no | sí |  | PK |
| IdPaciente | int | no |  |  |  |
| FechaMovimiento | datetime | no |  |  |  |
| IdMotivo | int | no |  |  |  |
| Observacion | varchar(100) | sí |  |  |  |
| IdServicioOrigen | int | sí |  |  |  |
| IdServicioDestino | int | sí |  |  |  |
| NroFolios | int | sí |  |  |  |
| IdEmpleadoArchivo | int | sí |  |  |  |
| IdEmpleadoTransporte | int | sí |  |  |  |
| IdEmpleadoRecepcion | int | sí |  |  |  |
| IdGrupoMovimiento | int | sí |  |  |  |
| IdAtencion | int | sí |  |  |  |

### MovimientosHistoriaClinica

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdMovimiento | int | no | sí |  | PK |
| IdPaciente | int | no |  |  |  |
| FechaMovimiento | datetime | no |  |  |  |
| IdMotivo | int | no |  |  |  |
| Observacion | varchar(100) | sí |  |  |  |
| IdServicioOrigen | int | sí |  | (1) |  |
| IdServicioDestino | int | sí |  |  |  |
| NroFolios | int | sí |  |  |  |
| IdEmpleadoArchivo | int | sí |  |  |  |
| IdEmpleadoTransporte | int | sí |  |  |  |
| IdEmpleadoRecepcion | int | sí |  |  |  |
| IdGrupoMovimiento | int | sí |  |  |  |
| IdAtencion | int | sí |  |  |  |

Claves foráneas:

- `IdEmpleadoTransporte` → `dbo.Empleados.IdEmpleado` (Empleados_MovimientosHistoriaClinica_FK2)
- `IdEmpleadoRecepcion` → `dbo.Empleados.IdEmpleado` (Empleados_MovimientosHistoriaClinica_FK3)
- `IdMotivo` → `dbo.MotivosMovimientoHistoria.IdMotivo` (MotivosPrestamoHistoria_PrestamosHistoriaClinica_FK1)

### NANDA_Interrelacion

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdInterrelacion | int | no | sí |  | PK |
| IdNANDA | int | no |  |  |  |
| IdNOC | int | sí |  |  |  |
| IdNIC | int | sí |  |  |  |

Claves foráneas:

- `IdNANDA` → `dbo.Catalogo_NANDA.IdNANDA` (FK_NANDA_Interrelacion_NANDA)
- `IdNIC` → `dbo.Catalogo_NIC.IdNIC` (FK_NANDA_Interrelacion_NIC)
- `IdNOC` → `dbo.Catalogo_NOC.IdNOC` (FK_NANDA_Interrelacion_NOC)

### NotaCreditoDebito

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdNota | int | no | sí |  |  |
| IdComprobantePago | int | sí |  |  |  |
| IdTipoNota | int | sí |  |  |  |
| NroSerie | char(3) | sí |  |  |  |
| NroDocumento | varchar(12) | sí |  |  |  |
| RazonSocial | varchar(50) | sí |  |  |  |
| RUC | char(11) | sí |  |  |  |
| SubTotal | money | sí |  |  |  |
| IGV | money | sí |  |  |  |
| Total | money | no |  |  |  |
| IdUsuarioAutoriza | int | sí |  |  |  |
| FechaAprueba | datetime | sí |  |  |  |
| TipoCambio | money | sí |  |  |  |
| Observaciones | varchar(500) | sí |  |  |  |
| IdEstadoNota | int | sí |  |  |  |
| FechaPagado | datetime | sí |  |  |  |
| IdGestionCaja | int | sí |  |  |  |
| IdPaciente | int | sí |  |  |  |
| IdCajero | int | sí |  |  |  |
| idTurno | int | sí |  |  |  |
| idCaja | int | sí |  |  |  |
| idFarmacia | int | sí |  |  |  |
| idMotivo | int | sí |  |  |  |
| Direccion | varchar(50) | sí |  |  |  |
| TipoAnulacion | bit | sí |  |  |  |
| EstadoFacturadorNC | int | sí |  |  |  |

### NotaCreditoDebitoEstadoNota

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdEstado | int | sí |  |  |  |
| EstadoNota | varchar(50) | sí |  |  |  |

### NotaCreditoDebitoMotivo

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdMotivo | int | sí |  |  |  |
| Motivo | varchar(50) | sí |  |  |  |

### NotaCreditoDebitoTipoNota

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdTipoNota | int | sí |  |  |  |
| TipoNota | varchar(50) | sí |  |  |  |
| NroSerie | char(3) | sí |  |  |  |
| NroDocumento | char(12) | sí |  |  |  |
| NroDocumentoInicial | char(12) | sí |  |  |  |
| NroDocumentoFinal | char(12) | sí |  |  |  |

### NotaEnfermeria

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdNotaEnfermeria | int | no | sí |  | PK |
| IdCuenta | int | sí |  |  |  |
| IdPaciente | int | sí |  |  |  |
| IdEmpleado | int | sí |  |  |  |
| Turno | varchar(10) | sí |  |  |  |
| Fecha_Hora_Inicio | datetime | sí |  |  |  |
| Fecha_Hora_Fin | datetime | sí |  |  |  |
| Subjetivo | nvarchar(max) | sí |  |  |  |
| Objetivo | nvarchar(max) | sí |  |  |  |
| Analisis | nvarchar(max) | sí |  |  |  |
| Plan_ | nvarchar(max) | sí |  |  |  |
| Intervencion | nvarchar(max) | sí |  |  |  |
| Evaluacion | nvarchar(max) | sí |  |  |  |

### NotaEnfermeriaSignosVitales

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdSignoVital | int | no | sí |  | PK |
| IdNotaEnfermeria | int | sí |  |  |  |
| IdPaciente | int | sí |  |  |  |
| IdCuentaatencion | int | sí |  |  |  |
| Fecha_Hora | datetime | sí |  |  |  |
| IdEmpleado | int | sí |  |  |  |
| Peso | decimal(5,2) | sí |  |  |  |
| Talla | decimal(5,2) | sí |  |  |  |
| P_Cefalico | decimal(5,2) | sí |  |  |  |
| P_Abdominal | decimal(5,2) | sí |  |  |  |
| Hemoglucotest | decimal(5,2) | sí |  |  |  |
| Presion_Arterial | varchar(10) | sí |  |  |  |
| Frec_Cardiaca | int | sí |  |  |  |
| Frec_Respiratoria | int | sí |  |  |  |
| Temperatura | decimal(4,2) | sí |  |  |  |
| Saturacion | int | sí |  |  |  |

Claves foráneas:

- `IdNotaEnfermeria` → `dbo.NotaEnfermeria.IdNotaEnfermeria` (FK_NotaEnfermeriaSignosVitales_Nota)

### Odontograma

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| Id | int | no | sí |  | PK |
| Nro_Historia | nvarchar(50) | no |  |  |  |
| Version | int | no |  | (1) |  |
| Fecha_Visita | datetime2 | sí |  |  |  |
| Tipo_Visita | nvarchar(50) | sí |  |  |  |
| Observaciones | nvarchar(max) | sí |  |  |  |
| Metadata | nvarchar(max) | sí |  |  |  |
| Fecha_Creacion | datetime2 | no |  | getdate() |  |
| Usuario_Creacion | nvarchar(100) | sí |  |  |  |
| Fecha_Modificacion | datetime2 | sí |  |  |  |
| Usuario_Modificacion | nvarchar(100) | sí |  |  |  |
| Activo | bit | no |  | (1) |  |
| Nro_Cuenta | int | sí |  |  |  |

### OdontogramaAudit

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| Id | int | no | sí |  | PK |
| OdontogramaId | int | sí |  |  |  |
| Nro_Historia | nvarchar(50) | sí |  |  |  |
| Accion | nvarchar(50) | no |  |  |  |
| Detalle | nvarchar(max) | sí |  |  |  |
| Fecha | datetime2 | no |  | getdate() |  |
| Usuario | nvarchar(100) | sí |  |  |  |
| Nro_Cuenta | int | sí |  |  |  |

### OdontogramaVersion

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| Id | int | no | sí |  | PK |
| OdontogramaId | int | no |  |  |  |
| VersionNumber | int | no |  |  |  |
| Fecha_Creacion | datetime2 | no |  | getdate() |  |
| Usuario_Creacion | nvarchar(100) | sí |  |  |  |
| ParentVersionId | int | sí |  |  |  |
| Locked | bit | no |  | (0) |  |
| Metadata | nvarchar(max) | sí |  |  |  |

Claves foráneas:

- `OdontogramaId` → `dbo.Odontograma.Id` (FK_OdontogramaVersion_Odontograma)
- `ParentVersionId` → `dbo.OdontogramaVersion.Id` (FK_OdontogramaVersion_Parent)

### OdontogramaVersionAudit

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| Id | int | no | sí |  | PK |
| OdontogramaVersionId | int | sí |  |  |  |
| Entidad | nvarchar(50) | no |  |  |  |
| Accion | nvarchar(30) | no |  |  |  |
| Clave | nvarchar(200) | sí |  |  |  |
| Detalle | nvarchar(max) | sí |  |  |  |
| Fecha | datetime2 | no |  | getdate() |  |
| Usuario | nvarchar(100) | sí |  |  |  |

Claves foráneas:

- `OdontogramaVersionId` → `dbo.OdontogramaVersion.Id` (FK_OdontogramaVersionAudit_Version)

### OdontogramaVersionSnapshot

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| Id | int | no | sí |  | PK |
| OdontogramaVersionId | int | no |  |  |  |
| Data | nvarchar(max) | no |  |  |  |
| Hash | nvarchar(64) | sí |  |  |  |
| Fecha_Creacion | datetime2 | no |  | getdate() |  |
| Fecha_Modificacion | datetime2 | sí |  |  |  |
| Usuario_Creacion | nvarchar(100) | sí |  |  |  |
| Usuario_Modificacion | nvarchar(100) | sí |  |  |  |
| Metadata | nvarchar(max) | sí |  |  |  |

Claves foráneas:

- `OdontogramaVersionId` → `dbo.OdontogramaVersion.Id` (FK_OdontogramaVersionSnapshot_Version)

### OPCS

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdOPCS | int | no |  |  | PK |
| Codigo | char(7) | sí |  |  |  |
| Descripcion | varchar(255) | sí |  |  |  |

### OrdenDiagnosticos

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdOrdenDx | int | no |  |  | PK |
| Codigo | varchar(5) | no |  |  |  |
| Descripcion | varchar(100) | no |  |  |  |

### Pacientes

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdPaciente | int | no | sí |  | PK |
| ApellidoPaterno | varchar(40) | sí |  |  |  |
| ApellidoMaterno | varchar(40) | sí |  |  |  |
| PrimerNombre | varchar(40) | sí |  |  |  |
| SegundoNombre | varchar(40) | sí |  |  |  |
| TercerNombre | varchar(40) | sí |  |  |  |
| FechaNacimiento | datetime | sí |  |  |  |
| NroDocumento | varchar(12) | sí |  |  |  |
| Telefono | varchar(10) | sí |  |  |  |
| DireccionDomicilio | varchar(100) | sí |  |  |  |
| Autogenerado | varchar(30) | sí |  |  |  |
| IdTipoSexo | int | sí |  |  |  |
| IdProcedencia | int | sí |  |  |  |
| IdGradoInstruccion | int | sí |  |  |  |
| IdEstadoCivil | int | sí |  |  |  |
| IdDocIdentidad | int | sí |  |  |  |
| IdTipoOcupacion | int | sí |  |  |  |
| IdCentroPobladoNacimiento | int | sí |  |  |  |
| IdCentroPobladoDomicilio | int | sí |  |  |  |
| NombrePadre | varchar(20) | sí |  |  |  |
| NombreMadre | varchar(20) | sí |  |  |  |
| NroHistoriaClinica | int | sí |  |  |  |
| IdTipoNumeracion | int | sí |  |  |  |
| IdCentroPobladoProcedencia | int | sí |  |  |  |
| Observacion | varchar(150) | sí |  |  |  |
| IdPaisDomicilio | int | sí |  |  |  |
| IdPaisProcedencia | int | sí |  |  |  |
| IdPaisNacimiento | int | sí |  |  |  |
| IdDistritoProcedencia | int | sí |  |  |  |
| IdDistritoDomicilio | int | sí |  |  |  |
| IdDistritoNacimiento | int | sí |  |  |  |
| FichaFamiliar | varchar(20) | sí |  |  |  |
| IdEtnia | varchar(2) | sí |  |  |  |
| GrupoSanguineo | varchar(10) | sí |  |  |  |
| FactorRh | varchar(10) | sí |  |  |  |
| UsoWebReniec | bit | sí |  |  |  |
| IdIdioma | int | sí |  |  |  |
| Email | varchar(50) | sí |  |  |  |
| madreDocumento | varchar(12) | sí |  |  |  |
| madreApellidoPaterno | varchar(20) | sí |  |  |  |
| madreApellidoMaterno | varchar(20) | sí |  |  |  |
| madrePrimerNombre | varchar(20) | sí |  |  |  |
| madreSegundoNombre | varchar(20) | sí |  |  |  |
| NroOrdenHijo | int | sí |  |  |  |
| madreTipoDocumento | int | sí |  |  |  |
| Sector | varchar(2) | sí |  |  |  |
| Sectorista | int | sí |  |  |  |
| idreligion | int | sí |  |  |  |
| padreApellidoPaterno | varchar(50) | sí |  |  |  |
| padreApellidoMaterno | varchar(50) | sí |  |  |  |
| PadrePrimerNombre | varchar(50) | sí |  |  |  |
| padreSegundoNombre | varchar(50) | sí |  |  |  |
| PadreTipoDocumento | int | sí |  |  |  |
| padreDocumento | int | sí |  |  |  |

Claves foráneas:

- `IdCentroPobladoDomicilio` → `dbo.CentrosPoblados.IdCentroPoblado` (CentrosPoblados_Pacientes_FK1)
- `IdCentroPobladoNacimiento` → `dbo.CentrosPoblados.IdCentroPoblado` (CentrosPoblados_Pacientes_FK2)
- `IdCentroPobladoProcedencia` → `dbo.CentrosPoblados.IdCentroPoblado` (CentrosPoblados_Pacientes_FK3)
- `IdPaisDomicilio` → `dbo.Paises.IdPais` (Paises_Pacientes_FK1)
- `IdPaisProcedencia` → `dbo.Paises.IdPais` (Paises_Pacientes_FK2)
- `IdPaisNacimiento` → `dbo.Paises.IdPais` (Paises_Pacientes_FK3)
- `IdDocIdentidad` → `dbo.TiposDocIdentidad.IdDocIdentidad` (TiposDocIdentidad_Pacientes_FK1)
- `IdEstadoCivil` → `dbo.TiposEstadoCivil.IdEstadoCivil` (TiposEstadoCivil_Pacientes_FK1)
- `IdTipoNumeracion` → `dbo.TiposNumeracionHistoria.IdTipoNumeracion` (TiposGeneracionHistoria_Pacientes_FK1)
- `IdGradoInstruccion` → `dbo.TiposGradoInstruccion.IdGradoInstruccion` (TiposGradoInstruccion_Pacientes_FK1)
- `IdTipoOcupacion` → `dbo.TiposOcupacion.IdTipoOcupacion` (TiposOcupacion_Pacientes_FK1)
- `IdProcedencia` → `dbo.TiposProcedencia.IdProcedencia` (TiposProcedencia_Pacientes_FK1)
- `IdTipoSexo` → `dbo.TiposSexo.IdTipoSexo` (TiposSexo_Pacientes_FK1)

### PacientesDatosAdicionales

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| idPaciente | int | no |  |  | PK |
| antecedentes | varchar(1000) | sí |  |  |  |
| antecedAlergico | varchar(1000) | sí |  |  |  |
| antecedObstetrico | varchar(1000) | sí |  |  |  |
| antecedQuirurgico | varchar(1000) | sí |  |  |  |
| antecedFamiliar | varchar(1000) | sí |  |  |  |
| antecedPatologico | varchar(1000) | sí |  |  |  |
| madreDNI | varchar(8) | sí |  |  |  |
| madreApellidoPaterno | varchar(20) | sí |  |  |  |
| madreApellidoMaterno | varchar(20) | sí |  |  |  |
| madrePrimerNombre | varchar(20) | sí |  |  |  |
| madreSegundoNombre | varchar(20) | sí |  |  |  |
| NroOrdenHijo | int | sí |  |  |  |
| FNacimientoCalculada | bit | sí |  | (0) |  |

### PacientesMovimientos

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdCuentaAtencion | int | no |  |  | PK |
| Peso | money | sí |  |  |  |
| Talla | money | sí |  |  |  |
| idDxNutricional | int | sí |  |  |  |
| GrafXedadEnMeses | int | sí |  |  |  |
| GrafYpercentilTE | int | sí |  |  |  |
| GrafYpercentilPT | int | sí |  |  |  |
| GrafYpercentilPE | int | sí |  |  |  |
| ZetaPT | money | sí |  |  |  |
| ZetaTE | money | sí |  |  |  |
| ZetaPE | money | sí |  |  |  |
| Hemoglobina | money | sí |  |  |  |
| Parasitosis | varchar(2) | sí |  |  |  |

### PacientesMovimientosDx

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| idDxNutricional | int | no |  |  | PK |
| DxNutricional | varchar(200) | no |  |  |  |

### PadronNominal_Detalle

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdPaNomDetalle | int | no | sí |  |  |
| IdTipoDoc | int | sí |  |  |  |
| NumDocumento | int | sí |  |  |  |
| HistClinica | varchar(10) | no |  |  |  |
| ApellidoPaterno | varchar(20) | no |  |  |  |
| ApellidoMaterno | varchar(20) | no |  |  |  |
| Nombres | varchar(40) | no |  |  |  |
| idSexo | int | no |  |  |  |
| FecNacimiento | varchar(10) | no |  |  |  |
| IdTipoSeguro | int | sí |  |  |  |
| NumAfiliacion | varchar(10) | sí |  |  |  |
| FecEvaluacion | varchar(10) | no |  |  |  |
| Peso | varchar(5) | no |  |  |  |
| Talla | varchar(3) | no |  |  |  |
| IdDiagNutricional | int | sí |  |  |  |
| CodRenaes | int | sí |  |  |  |
| IdDiagPE | int | no |  |  |  |
| IdDiagPT | int | no |  |  |  |
| IdDiagTE | int | no |  |  |  |
| hemoglobina | int | sí |  |  |  |
| heces | varchar(2) | sí |  |  |  |
| renaes | varchar(10) | sí |  |  |  |

### padronnominal_dxnutricional

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| iddiagnostico | int | sí |  |  |  |
| LabReferencia | varchar(8) | sí |  |  |  |
| RangoInicial | money | sí |  |  |  |
| RangoFinal | money | sí |  |  |  |

### PadronNominal_DxNutriTemp

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdpadNomFormulario | int | no |  |  |  |
| Descripcion | varchar(100) | sí |  |  |  |

### Paises

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdPais | int | no |  |  | PK |
| Codigo | char(3) | no |  |  |  |
| Nombre | varchar(50) | no |  |  |  |

### papeletaAmbulancia

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| id | int | no | sí |  | PK |
| id_correlacional | varchar(10) | no |  |  |  |
| numero_cuenta | int | no |  |  |  |
| numero_documento | varchar(20) | sí |  |  |  |
| hora | time | no |  |  |  |
| fecha_salida | date | no |  |  |  |
| servicio | varchar(100) | sí |  |  |  |
| financiamiento | varchar(100) | sí |  |  |  |
| medico | varchar(150) | no |  |  |  |
| nombres_apellidos | varchar(200) | no |  |  |  |
| edad | varchar(50) | sí |  |  |  |
| historia_clinica | varchar(20) | sí |  |  |  |
| diagnosticos | varchar(max) | sí |  |  |  |
| cie10 | varchar(max) | sí |  |  |  |
| observaciones | varchar(3000) | sí |  |  |  |
| medico_guardia | varchar(150) | no |  |  |  |
| ki | varchar(25) | sí |  |  |  |
| kf | varchar(25) | sí |  |  |  |

### Parametros

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdParametro | int | no |  |  | PK |
| Tipo | varchar(20) | no |  |  |  |
| Codigo | varchar(50) | sí |  |  |  |
| ValorTexto | varchar(355) | sí |  |  |  |
| ValorInt | int | sí |  |  |  |
| ValorFloat | float | sí |  |  |  |
| Descripcion | varchar(150) | sí |  |  |  |
| Grupo | varchar(30) | sí |  |  |  |

### PerinatalAtencion

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| idPerinatalAtencion | int | no | sí |  | PK |
| idPaciente | int | no |  |  |  |
| idModulo | int | no |  |  |  |
| GrafXedadEnMeses | int | sí |  |  |  |
| GrafYpercentilTE | int | sí |  |  |  |
| GrafYpercentilPT | int | sí |  |  |  |
| GrafYpercentilPE | int | sí |  |  |  |
| GrafYimc | money | sí |  |  |  |
| FechaAtencion | datetime | sí |  |  |  |

Claves foráneas:

- `idPaciente` → `dbo.Pacientes.IdPaciente` (FK_PerinatalAtencion_Pacientes)
- `idPerinatalAtencion` → `dbo.PerinatalAtencionCred1.idPerinatalAtencion` (FK_PerinatalAtencion_PerinatalAtencionCred1)

### PerinatalAtencionCred

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| idPerinatalAtencion | int | no |  |  | PK |
| EdadEnAnios | varchar(10) | no |  |  | PK |
| CredNumero | int | no |  |  | PK |
| CredCheck | varchar(1) | no |  |  | PK |
| idAtencion | int | sí |  |  |  |

Claves foráneas:

- `idAtencion` → `dbo.Atenciones.IdAtencion` (FK_PerinatalAtencionCred_Atenciones)
- `idPerinatalAtencion` → `dbo.PerinatalAtencion.idPerinatalAtencion` (FK_PerinatalAtencionCRED_PerinatalAtencion)

### PerinatalAtencionCred1

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| idPerinatalAtencion | int | no |  |  | PK |
| idModulo | int | sí |  |  |  |
| EstimulacionTemprana | bit | sí |  |  |  |
| AlimentacionComplementaria | bit | sí |  |  |  |
| LactanciaMaterna | bit | sí |  |  |  |
| PersonalSalud | bit | sí |  |  |  |
| DemandaIndividual | bit | sí |  |  |  |
| MujerEdadReproductiva | bit | sí |  |  |  |
| MujerGestante | bit | sí |  |  |  |
| idAtencion | int | sí |  |  |  |

### PerinatalAtencionDiagnosticos

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| idPerinatalAtencion | int | no |  |  |  |
| idModulo | int | no |  |  |  |
| idLista | int | no |  |  |  |
| idDiagnostico | int | no |  |  |  |
| CodigoHIS | varchar(7) | sí |  |  |  |
| idAtencion | int | sí |  |  |  |
| labConfHIS | varchar(3) | sí |  |  |  |
| ItemDiagnostico | int | no |  | (1) |  |
| IdClasificacionDx | int | no |  | (1) |  |
| IdSubclasificacionDx | int | no |  | (102) |  |

Claves foráneas:

- `IdClasificacionDx` → `dbo.ClasificacionDiagnosticos.IdClasificacionDx` (FK_PerinatalAtencionDiagnosticos_ClasificacionDiagnosticos)
- `IdSubclasificacionDx` → `dbo.SubclasificacionDiagnosticos.IdSubclasificacionDx` (FK_PerinatalAtencionDiagnosticos_SubclasificacionDiagnosticos)
- `idPerinatalAtencion` → `dbo.PerinatalAtencion.idPerinatalAtencion` (FK_PerinatalAtencionesDiagnosticos_PerinatalAtencion)
- `idLista` → `dbo.PerinatalListas.idLista` (FK_PerinatalAtencionesDiagnosticos_PerinatalListas)
- `idModulo` → `dbo.PerinatalModulos.idModulo` (FK_PerinatalAtencionesDiagnosticos_PerinatalModulos)

### PerinatalAtencionDiaria

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| idPerinatalAtencion | int | no |  |  | PK |
| idAtencion | int | no |  |  | PK |

Claves foráneas:

- `idAtencion` → `dbo.Atenciones.IdAtencion` (FK_PerinatalAtencionDiaria_Atenciones)
- `idPerinatalAtencion` → `dbo.PerinatalAtencion.idPerinatalAtencion` (FK_PerinatalAtencionDiaria_PerinatalAtencion)

### PerinatalAtencionMedicamentos

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| idPerinatalAtencion | int | no |  |  | PK |
| idModulo | int | no |  |  | PK |
| idProducto | int | no |  |  | PK |
| idAtencion | int | sí |  |  |  |

Claves foráneas:

- `idPerinatalAtencion` → `dbo.PerinatalAtencion.idPerinatalAtencion` (FK_PerinatalAtencionMedicamentos_PerinatalAtencion)

### PerinatalAtencionProcedimientos

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| idPerinatalAtencion | int | no |  |  |  |
| idModulo | int | no |  |  |  |
| idLista | int | no |  |  |  |
| idProducto | int | no |  |  |  |
| CptEsAutomatico | bit | sí |  |  |  |
| CodigoHIS | varchar(7) | sí |  |  |  |
| idAtencion | int | sí |  |  |  |
| IdOrden | int | sí |  |  |  |
| labConfHIS | varchar(3) | sí |  |  |  |
| ItemProcedimiento | int | no |  | (1) |  |

Claves foráneas:

- `idPerinatalAtencion` → `dbo.PerinatalAtencion.idPerinatalAtencion` (FK_PerinatalAtencionProcedimientos_PerinatalAtencion)
- `idLista` → `dbo.PerinatalListas.idLista` (FK_PerinatalAtencionProcedimientos_PerinatalListas)
- `idModulo` → `dbo.PerinatalModulos.idModulo` (FK_PerinatalAtencionProcedimientos_PerinatalModulos)

### PerinatalCatalogoCie10

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| idModulo | int | no |  |  | PK |
| idLista | int | no |  |  | PK |
| idDiagnostico | int | no |  |  | PK |
| RangoInicio | money | sí |  |  |  |
| RangoFinal | money | sí |  |  |  |
| CodigoHIS | varchar(7) | sí |  |  |  |
| LabHis | varchar(20) | sí |  |  |  |
| TipoDx | varchar(6) | sí |  |  |  |

Claves foráneas:

- `idDiagnostico` → `dbo.Diagnosticos.IdDiagnostico` (FK_PerinatalCatalogoDiagnosticos_Diagnosticos)

### PerinatalCatalogoCpt

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| idModulo | int | no |  |  | PK |
| idLista | int | no |  |  | PK |
| idProducto | int | no |  |  | PK |
| CodigoHIS | varchar(7) | sí |  |  |  |

Claves foráneas:

- `idProducto` → `dbo.FactCatalogoServicios.IdProducto` (FK_PerinatalCatalogoDeProcedimientos_FactCatalogoServicios)

### PerinatalCatalogoCptAutomaticos

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| idModulo | int | no |  |  |  |
| idLista | int | no |  |  |  |
| idProducto | int | no |  |  |  |
| idProductoAutomatico | int | no |  |  |  |

Claves foráneas:

- `idLista` → `dbo.PerinatalCatalogoCpt.idLista` (FK_PerinatalCatalogoDeProcedimientosAutomaticos_PerinatalCatalogoDeProcedimientos)
- `idModulo` → `dbo.PerinatalCatalogoCpt.idModulo` (FK_PerinatalCatalogoDeProcedimientosAutomaticos_PerinatalCatalogoDeProcedimientos)
- `idProducto` → `dbo.PerinatalCatalogoCpt.idProducto` (FK_PerinatalCatalogoDeProcedimientosAutomaticos_PerinatalCatalogoDeProcedimientos)

### PerinatalCatalogoCptMaximaDosis

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| idModulo | int | no |  |  |  |
| idLista | int | no |  |  |  |
| idProducto | int | no |  |  |  |
| Limite | int | no |  |  |  |
| EdadInicial | int | no |  |  |  |
| EdadFinal | int | no |  |  |  |

Claves foráneas:

- `idProducto` → `dbo.PerinatalCatalogoCpt.idProducto` (FK_PerinatalCatalogoDeProcedimientosMaxDosis_PerinatalCatalogoDeProcedimientos)
- `idModulo` → `dbo.PerinatalCatalogoCpt.idModulo` (FK_PerinatalCatalogoDeProcedimientosMaxDosis_PerinatalCatalogoDeProcedimientos)
- `idLista` → `dbo.PerinatalCatalogoCpt.idLista` (FK_PerinatalCatalogoDeProcedimientosMaxDosis_PerinatalCatalogoDeProcedimientos)

### PerinatalCatalogoMedicamentos

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| idModulo | int | no |  |  | PK |
| IdProducto | int | no |  |  | PK |
| Cantidad | int | no |  |  |  |

Claves foráneas:

- `IdProducto` → `dbo.FactCatalogoBienesInsumos.IdProducto` (FK_PerinatalCatalogoMedicamentos_FactCatalogoBienesInsumos)

### PerinatalListas

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| idLista | int | no |  |  | PK |
| Lista | varchar(50) | no |  |  |  |

### PerinatalModulos

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| idModulo | int | no |  |  | PK |
| Modulo | varchar(100) | no |  |  |  |
| AniosDesde | int | sí |  |  |  |
| AniosHasta | int | sí |  |  |  |

### PeriodoTiempo

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdPeriodoTiempo | int | no | sí |  | PK |
| PeriodoTiempo | varchar(20) | sí |  |  |  |

### Permisos

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdPermiso | int | no |  |  | PK |
| Descripcion | varchar(100) | no |  |  |  |
| Modulo | varchar(50) | sí |  |  |  |

### PNUME

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| idPNUME | int | no | sí |  | PK |
| idProducto | int | no |  |  |  |
| FechaActa | date | no |  |  |  |
| NumeroActa | varchar(50) | no |  |  |  |
| Petitorio | int | sí |  | (0) |  |

### PreguntasVerificacionCirugiaCQx

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdPreguntasVerificacionCirugiaCQx | int | no |  |  | PK |
| Descripcion | varchar(1000) | sí |  |  |  |
| IdEtapasCirugiaCQx | int | no |  |  |  |
| EstadoReg | bit | sí |  |  |  |
| IdUsuario | int | sí |  |  |  |
| Estacion | varchar(50) | sí |  |  |  |
| FechaReg | datetime | sí |  |  |  |

Claves foráneas:

- `IdEtapasCirugiaCQx` → `dbo.EtapasCirugiaCQx.IdEtapasCirugiaCQx` (FK__Preguntas__IdEta__5F069462)

### ProCabecera

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdPrograma | int | no |  |  | PK |
| IdProcabecera | int | no | sí |  | PK |
| IdPaciente | int | no |  |  |  |

Claves foráneas:

- `IdPrograma` → `dbo.Programas.IdPrograma` (FK_ProCabecera_Programas)

### ProCabeceraConfigDatos

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdPrograma | int | no |  |  | PK |
| IdCabDato | int | no |  |  | PK |
| Cab_Texto | varchar(200) | sí |  |  |  |
| Cab_Tipo | varchar(200) | sí |  |  |  |
| Cab_Ancho | int | sí |  |  |  |
| Cab_EsDatoObligatorio | int | sí |  |  |  |
| Cab_TextoToolTip | varchar(200) | sí |  |  |  |
| Cab_EsDatoCalculado | bit | sí |  |  |  |
| Cab_FormulaCalculaValor | varchar(200) | sí |  |  |  |
| Cab_EsDatoCalculador | bit | sí |  |  |  |
| Cab_RangoInicial | int | sí |  |  |  |
| Cab_RangoFinal | int | sí |  |  |  |
| Cab_Fila | int | sí |  |  |  |
| Cab_Columna | int | sí |  |  |  |

Claves foráneas:

- `IdPrograma` → `dbo.Programas.IdPrograma` (FK_ProCabeceraConfigDatos_Programas)

### ProCabeceraDato

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdPrograma | int | no |  |  | PK |
| IdProCabecera | int | no |  |  | PK |
| IdCabDato | int | no |  |  | PK |
| CabDato | varchar(200) | sí |  |  |  |

Claves foráneas:

- `IdProCabecera` → `dbo.ProCabecera.IdProcabecera` (FK_ProCabeceraDato_ProCabecera)
- `IdPrograma` → `dbo.ProCabecera.IdPrograma` (FK_ProCabeceraDato_ProCabecera)
- `IdCabDato` → `dbo.ProCabeceraConfigDatos.IdCabDato` (FK_ProCabeceraDato_ProCabeceraConfigDatos)
- `IdPrograma` → `dbo.ProCabeceraConfigDatos.IdPrograma` (FK_ProCabeceraDato_ProCabeceraConfigDatos)

### ProCatalogoControles

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdPrograma | int | no |  |  | PK |
| IdControl | int | no |  |  | PK |
| Descripcion | varchar(200) | sí |  |  |  |

Claves foráneas:

- `IdPrograma` → `dbo.Programas.IdPrograma` (FK_ProCatalogoControles_Programas)

### ProCatalogoDiagnosticos

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdPrograma | int | no |  |  | PK |
| IdDiagnostico | int | no |  |  | PK |

Claves foráneas:

- `IdDiagnostico` → `dbo.Diagnosticos.IdDiagnostico` (FK_ProCatalogoDiagnosticos_Diagnosticos)
- `IdPrograma` → `dbo.Programas.IdPrograma` (FK_ProCatalogoDiagnosticos_Programas1)

### ProCatalogoProcedimientos

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdPrograma | int | no |  |  | PK |
| IdDiagnostico | int | no |  |  | PK |
| IdProducto | int | no |  |  | PK |

Claves foráneas:

- `IdProducto` → `dbo.FactCatalogoServicios.IdProducto` (FK_ProCatalogoProcedimientos_FactCatalogoServicios1)
- `IdDiagnostico` → `dbo.ProCatalogoDiagnosticos.IdDiagnostico` (FK_ProCatalogoProcedimientos_ProCatalogoDiagnosticos)
- `IdPrograma` → `dbo.ProCatalogoDiagnosticos.IdPrograma` (FK_ProCatalogoProcedimientos_ProCatalogoDiagnosticos)

### ProCatalogoTratamientos

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdPrograma | int | no |  |  | PK |
| IdProducto | int | no |  |  | PK |

Claves foráneas:

- `IdProducto` → `dbo.FactCatalogoBienesInsumos.IdProducto` (FK_ProCatalogoTratamientos_FactCatalogoBienesInsumos)
- `IdPrograma` → `dbo.Programas.IdPrograma` (FK_ProCatalogoTratamientos_Programas)

### ProcesosDetalleDiagnostico

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdDetalleDiag | int | no | sí |  | PK |
| IdAtencion | int | no |  |  |  |
| IdRegistro | int | sí |  |  |  |
| IdRespuesta | int | sí |  |  |  |
| IdDiagnostico | int | no |  |  |  |
| Tipo | char(1) | no |  |  |  |
| TipoDiagnostico | char(1) | no |  |  |  |

Claves foráneas:

- `IdDiagnostico` → `dbo.Diagnosticos.IdDiagnostico` (FK__ProcesosD__IdDia__1FF7A424)
- `IdRegistro` → `dbo.ProcesosRegistro.IdRegistro` (FK__ProcesosD__IdReg__1E0F5BB2)
- `IdRespuesta` → `dbo.ProcesosRespuesta.IdRespuesta` (FK__ProcesosD__IdRes__1F037FEB)

### ProcesosRegistro

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdRegistro | int | no | sí |  | PK |
| IdAtencion | int | no |  |  |  |
| IdPaciente | int | no |  |  |  |
| IdProfesionalSolicitante | int | no |  |  |  |
| IdArea | int | no |  |  |  |
| IdEspecialidadSolicitada | int | no |  |  |  |
| IdOrdenServicio | int | sí |  |  |  |
| Detalle | nvarchar(max) | no |  |  |  |
| FechaRegistro | datetime | no |  | getdate() |  |
| estado | varchar(20) | no |  | 'Pendiente' |  |
| prioridad | varchar(5) | no |  | 'IV' |  |

### ProcesosRespuesta

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdRespuesta | int | no | sí |  | PK |
| IdRegistro | int | no |  |  |  |
| IdAtencion | int | no |  |  |  |
| IdProfesionalRespondio | int | no |  |  |  |
| FechaRespuesta | datetime | no |  | getdate() |  |
| Observacion | nvarchar(max) | no |  |  |  |

Claves foráneas:

- `IdRegistro` → `dbo.ProcesosRegistro.IdRegistro` (FK__ProcesosR__IdReg__194AA695)

### ProControlConfigDatos

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdPrograma | int | no |  |  | PK |
| IdControlDato | int | no |  |  | PK |
| Control_Texto | varchar(200) | sí |  |  |  |
| Control_Tipo | varchar(200) | sí |  |  |  |
| Control_Ancho | int | sí |  |  |  |
| Control_EsDatoObligatorio | bit | sí |  |  |  |
| Control_TextoToolTip | varchar(200) | sí |  |  |  |
| Control_EsPresion | bit | sí |  |  |  |
| Control_EsPeso | bit | sí |  |  |  |
| Control_EsTalla | bit | sí |  |  |  |
| Control_EsDatoCalculado | bit | sí |  |  |  |
| Control_FormulaCalculaValor | varchar(200) | sí |  |  |  |
| Control_EsDatoGrafico | bit | sí |  |  |  |
| Control_EsGraficoEjeX | bit | sí |  |  |  |
| Control_Fila | int | sí |  | (0) |  |
| Control_Columna | int | sí |  | (0) |  |

Claves foráneas:

- `IdPrograma` → `dbo.Programas.IdPrograma` (FK_ProControlConfigDatos_Programas)

### ProControlDato

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdPrograma | int | no |  |  | PK |
| IdProCabecera | int | no |  |  | PK |
| IdControl | int | no |  |  | PK |
| IdControlDato | int | no |  |  | PK |
| ControlDato | varchar(200) | sí |  |  |  |

Claves foráneas:

- `IdControlDato` → `dbo.ProControlConfigDatos.IdControlDato` (FK_ProControlDato_ProControlConfigDatos)
- `IdPrograma` → `dbo.ProControlConfigDatos.IdPrograma` (FK_ProControlDato_ProControlConfigDatos)
- `IdPrograma` → `dbo.ProControles.IdPrograma` (FK_ProControlDato_ProControles)
- `IdControl` → `dbo.ProControles.IdControl` (FK_ProControlDato_ProControles)
- `IdProCabecera` → `dbo.ProControles.IdProCabecera` (FK_ProControlDato_ProControles)

### ProControles

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdPrograma | int | no |  |  | PK |
| IdProCabecera | int | no |  |  | PK |
| IdControl | int | no |  |  | PK |
| IdAtencion | int | sí |  |  |  |
| FechaControl | nvarchar(10) | sí |  |  |  |
| ControlOtroEESS | bit | sí |  | (0) |  |
| IdEstablecimiento | int | sí |  |  |  |

Claves foráneas:

- `IdPrograma` → `dbo.ProCabecera.IdPrograma` (FK_ProControles_ProCabecera)
- `IdProCabecera` → `dbo.ProCabecera.IdProcabecera` (FK_ProControles_ProCabecera)
- `IdControl` → `dbo.ProCatalogoControles.IdControl` (FK_ProControles_ProCatalogoControles)
- `IdPrograma` → `dbo.ProCatalogoControles.IdPrograma` (FK_ProControles_ProCatalogoControles)

### ProDiagnosticos

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdPrograma | int | no |  |  |  |
| IdProCabecera | int | no |  |  |  |
| IdControl | int | no |  |  |  |
| IdDiagnostico | int | no |  |  |  |
| Principal | bit | sí |  |  |  |
| labConfHIS | varchar(3) | sí |  |  |  |
| IdSubClasificacionDX | int | no |  | (102) |  |

Claves foráneas:

- `IdDiagnostico` → `dbo.Diagnosticos.IdDiagnostico` (FK_ProDiagnosticos_Diagnosticos)
- `IdProCabecera` → `dbo.ProControles.IdProCabecera` (FK_ProDiagnosticos_ProControles)
- `IdControl` → `dbo.ProControles.IdControl` (FK_ProDiagnosticos_ProControles)
- `IdPrograma` → `dbo.ProControles.IdPrograma` (FK_ProDiagnosticos_ProControles)

### ProductoRecetado

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| id_producto | int | no | sí |  | PK |
| id_consulta | int | no |  |  |  |
| nombre_producto | varchar(150) | no |  |  |  |
| dosis | varchar(250) | no |  |  |  |
| duracion | varchar(100) | no |  |  |  |

Claves foráneas:

- `id_consulta` → `dbo.Consulta.id_consulta` (FK__ProductoR__id_co__7F20C03E)

### ProductoServicio

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdServicio | int | no |  |  | PK |
| IdProducto | int | no |  |  | PK |

### ProductosHis

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdProductoHis | int | no |  |  | PK |
| EsCpt | varchar(1) | no |  |  | PK |
| CodigoProductoHis | varchar(20) | no |  |  |  |

### ProgramacionMedica

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdProgramacion | int | no | sí |  | PK |
| IdMedico | int | no |  |  |  |
| IdDepartamento | int | no |  |  |  |
| Fecha | datetime | no |  |  |  |
| HoraInicio | char(5) | no |  |  |  |
| HoraFin | char(5) | no |  |  |  |
| IdTipoProgramacion | int | no |  |  |  |
| Descripcion | varchar(100) | sí |  |  |  |
| IdTurno | int | sí |  |  |  |
| IdEspecialidad | int | sí |  |  |  |
| Color | int | sí |  | (-2147483643) |  |
| IdServicio | int | sí |  |  |  |
| IdTipoServicio | int | sí |  |  |  |
| FechaReg | datetime | sí |  |  |  |
| TiempoPromedioAtencion | int | sí |  |  |  |
| HoraFinProgramacion | char(5) | sí |  |  |  |

Claves foráneas:

- `IdDepartamento` → `dbo.DepartamentosHospital.IdDepartamento` (DepartamentosHospital_ProgramacionMedica_FK1)
- `IdEspecialidad` → `dbo.Especialidades.IdEspecialidad` (Especialidades_ProgramacionMedica_FK1)
- `IdMedico` → `dbo.Medicos.IdMedico` (Medicos_ProgramacionMedica_FK1)
- `IdServicio` → `dbo.Servicios.IdServicio` (Servicios_ProgramacionMedica_FK1)
- `IdTipoProgramacion` → `dbo.TiposProgramacion.IdTipoProgramacion` (TiposProgramacion_ProgramacionMedica_FK1)
- `IdTipoServicio` → `dbo.TiposServicio.IdTipoServicio` (TiposServicio_ProgramacionMedica_FK1)
- `IdTurno` → `dbo.Turnos.IdTurno` (Turnos_ProgramacionMedica_FK1)

### Programas

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdPrograma | int | no |  |  | PK |
| Descripcion | varchar(200) | no |  |  |  |

### ProProcedimientos

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdPrograma | int | no |  |  | PK |
| IdProCabecera | int | no |  |  | PK |
| IdControl | int | no |  |  | PK |
| IdDiagnostico | int | no |  |  | PK |
| IdProducto | int | no |  |  | PK |
| IdResultado | int | sí |  |  |  |
| labConfHIS | varchar(3) | sí |  |  |  |

Claves foráneas:

- `IdPrograma` → `dbo.ProControles.IdPrograma` (FK_ProProcedimientos_ProControles)
- `IdControl` → `dbo.ProControles.IdControl` (FK_ProProcedimientos_ProControles)
- `IdProCabecera` → `dbo.ProControles.IdProCabecera` (FK_ProProcedimientos_ProControles)
- `IdResultado` → `dbo.TiposResultadosServInterm.IdResultadoSI` (FK_ProProcedimientos_TiposResultadosServInterm)

### Protesis

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| Id | int | no | sí |  | PK |
| OdontogramaId | int | no |  |  |  |
| Nro_Historia | nvarchar(50) | no |  |  |  |
| Tipo | nvarchar(50) | no |  |  |  |
| SubTipo | nvarchar(100) | sí |  |  |  |
| Posicion | nvarchar(20) | sí |  |  |  |
| Color | nvarchar(30) | sí |  |  |  |
| Observaciones | nvarchar(500) | sí |  |  |  |
| Metadata | nvarchar(max) | sí |  |  |  |
| Fecha_Creacion | datetime2 | no |  | getdate() |  |
| Usuario_Creacion | nvarchar(100) | sí |  |  |  |
| Nro_Cuenta | int | sí |  |  |  |

Claves foráneas:

- `OdontogramaId` → `dbo.Odontograma.Id` (FK_Protesis_Odontograma)

### ProtesisTeeth

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| Id | int | no | sí |  | PK |
| ProtesisId | int | no |  |  |  |
| NumeroDiente | tinyint | no |  |  |  |
| Posicion | nvarchar(20) | sí |  |  |  |

Claves foráneas:

- `ProtesisId` → `dbo.Protesis.Id` (FK_ProtesisTeeth_Protesis)

### ProtesisV

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| Id | int | no | sí |  | PK |
| OdontogramaVersionId | int | no |  |  |  |
| TipoCodigo | nvarchar(50) | no |  |  |  |
| SubTipo | nvarchar(100) | sí |  |  |  |
| MaterialCodigo | nvarchar(50) | sí |  |  |  |
| Color | nvarchar(30) | sí |  |  |  |
| Observaciones | nvarchar(500) | sí |  |  |  |
| Metadata | nvarchar(max) | sí |  |  |  |
| Fecha_Creacion | datetime2 | no |  | getdate() |  |
| Usuario_Creacion | nvarchar(100) | sí |  |  |  |

Claves foráneas:

- `OdontogramaVersionId` → `dbo.OdontogramaVersion.Id` (FK_ProtesisV_Version)

### ProtesisVTeeth

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| Id | int | no | sí |  | PK |
| ProtesisVId | int | no |  |  |  |
| NumeroDiente | tinyint | no |  |  |  |
| Rol | nvarchar(30) | sí |  |  |  |
| Metadata | nvarchar(max) | sí |  |  |  |

Claves foráneas:

- `ProtesisVId` → `dbo.ProtesisV.Id` (FK_ProtesisVTeeth_ProtesisV)

### ProTratamientos

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdPrograma | int | no |  |  | PK |
| IdProCabecera | int | no |  |  | PK |
| IdControl | int | no |  |  | PK |
| IdProducto | int | no |  |  | PK |

Claves foráneas:

- `IdProducto` → `dbo.ProCatalogoTratamientos.IdProducto` (FK_ProTratamientos_ProCatalogoTratamientos)
- `IdPrograma` → `dbo.ProCatalogoTratamientos.IdPrograma` (FK_ProTratamientos_ProCatalogoTratamientos)
- `IdProCabecera` → `dbo.ProControles.IdProCabecera` (FK_ProTratamientos_ProControles)
- `IdControl` → `dbo.ProControles.IdControl` (FK_ProTratamientos_ProControles)
- `IdPrograma` → `dbo.ProControles.IdPrograma` (FK_ProTratamientos_ProControles)

### Proveedores

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| idProveedor | int | no | sí |  | PK |
| Ruc | varchar(11) | no |  |  |  |
| RazonSocial | varchar(100) | no |  |  |  |

### Provincias

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdProvincia | int | no |  |  | PK |
| Nombre | varchar(50) | no |  |  |  |
| IdDepartamento | int | no |  |  |  |
| IdReniec | int | sí |  |  |  |

Claves foráneas:

- `IdDepartamento` → `dbo.Departamentos.IdDepartamento` (Departamentos_Provincias_FK1)

### Raiz

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| Id | int | no | sí |  | PK |
| OdontogramaVersionId | int | no |  |  |  |
| NumeroDiente | tinyint | no |  |  |  |
| Configuracion | tinyint | no |  |  |  |
| Triangulo1Activo | bit | no |  | (0) |  |
| Triangulo2Activo | bit | no |  | (0) |  |
| Triangulo3Activo | bit | no |  | (0) |  |
| Activo | bit | no |  | (1) |  |
| Metadata | nvarchar(max) | sí |  |  |  |
| Fecha_Creacion | datetime2 | no |  | getdate() |  |
| Usuario_Creacion | nvarchar(100) | sí |  |  |  |
| Fecha_Modificacion | datetime2 | sí |  |  |  |
| Usuario_Modificacion | nvarchar(100) | sí |  |  |  |

Claves foráneas:

- `OdontogramaVersionId` → `dbo.OdontogramaVersion.Id` (FK_Raiz_Version)

### Raza

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| id_raza | int | no | sí |  | PK |
| nombre | varchar(50) | no |  |  |  |
| id_especie | int | no |  |  |  |

Claves foráneas:

- `id_especie` → `dbo.Especie.id_especie` (FK__Raza__id_especie__7967E6E8)

### RecetaCabecera

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| idReceta | int | no | sí |  | PK |
| IdPuntoCarga | int | no |  |  |  |
| FechaReceta | datetime | no |  |  |  |
| idCuentaAtencion | int | no |  |  |  |
| idServicioReceta | int | no |  |  |  |
| idEstado | int | no |  |  |  |
| DocumentoDespacho | varchar(20) | sí |  |  |  |
| idComprobantePago | int | sí |  |  |  |
| idMedicoReceta | int | sí |  |  |  |
| fechaVigencia | datetime | sí |  |  |  |
| esParaProcedimiento | bit | sí |  | (0) |  |
| esParaIntervencionSanitaria | bit | sí |  | (0) |  |

Claves foráneas:

- `idEstado` → `dbo.RecetaEstados.idEstado` (FK_RecetaCabecera_RecetaEstados)

### RecetaClasificacionViasAdmin

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdCategoria | int | no |  |  | PK |
| Categoria | varchar(50) | sí |  |  |  |

### RecetaDetalle

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| idReceta | int | no |  |  | PK |
| idItem | int | no |  |  | PK |
| CantidadPedida | int | no |  |  |  |
| Precio | money | no |  |  |  |
| Total | money | no |  |  |  |
| SaldoEnRegistroReceta | int | sí |  |  |  |
| SaldoEnDespachoReceta | int | sí |  |  |  |
| CantidadDespachada | int | sí |  |  |  |
| idDosisRecetada | int | sí |  |  |  |
| idEstadoDetalle | int | sí |  |  |  |
| MotivoAnulacionMedico | varchar(300) | sí |  |  |  |
| observaciones | varchar(300) | sí |  |  |  |
| IdViaAdministracion | int | sí |  |  |  |
| idDiagnostico | int | sí |  |  |  |

Claves foráneas:

- `idReceta` → `dbo.RecetaCabecera.idReceta` (FK_RecetaDetalle_RecetaCabecera)
- `idDosisRecetada` → `dbo.RecetaDosis.idDosis` (FK_RecetaDetalle_RecetaDosis)
- `idEstadoDetalle` → `dbo.RecetaEstadosDetalle.idEstadoDetalle` (FK_RecetaDetalle_RecetaEstadosDetalle)

### RecetaDetalleItem

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| idReceta | int | no |  |  | PK |
| idItem | int | no |  |  | PK |
| DocumentoDespacho | varchar(20) | no |  |  | PK |
| CantidadDespachada | int | no |  |  |  |

Claves foráneas:

- `idReceta` → `dbo.RecetaCabecera.idReceta` (FK_RecetaDetalleItem_RecetaCabecera)

### RecetaDiagnosticos

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdAtencionDiagnostico | int | no | sí |  | PK |
| IdAtencion | int | no |  |  |  |
| idReceta | int | no |  |  |  |
| IdClasificacionDx | int | no |  |  |  |
| IdDiagnostico | int | sí |  |  |  |
| IdSubclasificacionDx | int | sí |  |  |  |
| labConfHIS | varchar(3) | sí |  |  |  |
| GrupoHIS | int | sí |  |  |  |
| SubGrupoHIS | int | sí |  |  |  |
| sg_Log_Cre_feh | datetime | sí |  |  |  |
| sg_log_Cre_Usuario | int | sí |  |  |  |

Claves foráneas:

- `idReceta` → `dbo.RecetaCabecera.idReceta` (FK_RecetaDiagnosticos_RecetaCabecera)

### RecetaDosis

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| idDosis | int | no |  |  | PK |
| NumeroDosis | varchar(50) | no |  |  |  |

### RecetaEstados

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| idEstado | int | no |  |  | PK |
| Estado | varchar(30) | no |  |  |  |

### RecetaEstadosDetalle

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| idEstadoDetalle | int | no |  |  | PK |
| Estado | varchar(30) | no |  |  |  |

### RecetaViaAdministracion

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdViaAdministracion | int | no |  |  | PK |
| Descripcion | varchar(100) | sí |  |  |  |
| IdCategoria | int | no |  |  |  |

Claves foráneas:

- `IdCategoria` → `dbo.RecetaClasificacionViasAdmin.IdCategoria` (FK_RecetaViaAdministracion_RecetaClasificacionViasAdmin)

### RedEstablecimiento

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdRed | int | sí |  |  |  |
| Codigo | int | sí |  |  |  |
| Nombre | varchar(150) | sí |  |  |  |
| CodigoDisa | int | sí |  |  |  |

### RefConTurnosUPS

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdTurno | int | sí |  |  |  |
| codTurno | char(1) | sí |  |  |  |
| Turno | varchar(255) | sí |  |  |  |

### Referencias

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| cmi | varchar(150) | sí |  |  |  |
| condicion | varchar(50) | sí |  |  |  |
| fecha | date | sí |  |  |  |
| mes | nchar(2) | sí |  |  |  |
| PersonalRefiere | varchar(200) | sí |  |  |  |
| especialidad | varchar(200) | sí |  |  |  |
| motivo | varchar(200) | sí |  |  |  |

### ReferenciasRefcon

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| tipFinanciador | varchar(6) | sí |  |  |  |
| numeroSeguro | varchar(16) | sí |  |  |  |
| fechaVencimientoSis | varchar(10) | sí |  |  |  |
| tipDocumento | varchar(4) | sí |  |  |  |
| dni | varchar(15) | sí |  |  |  |
| apePaterno | varchar(150) | sí |  |  |  |
| apeMaterno | varchar(150) | sí |  |  |  |
| nombres | varchar(80) | sí |  |  |  |
| fecNacimiento | varchar(10) | sí |  |  |  |
| direccion | varchar(150) | sí |  |  |  |
| sexo | varchar(4) | sí |  |  |  |
| ubigeo1 | varchar(6) | sí |  |  |  |
| ubigeo2 | varchar(6) | sí |  |  |  |
| celular | varchar(10) | sí |  |  |  |
| condicionPaciente | varchar(4) | sí |  |  |  |
| tipDocumentoMedico | varchar(2) | sí |  |  |  |
| numDocumentoMedico | varchar(15) | sí |  |  |  |
| fecActual | varchar(10) | sí |  |  |  |
| fecSolicitudReferencia | varchar(10) | sí |  |  |  |
| fecCita | varchar(10) | sí |  |  |  |
| codServicio | varchar(6) | sí |  |  |  |
| especialidad | varchar(50) | sí |  |  |  |
| nroReferencia | varchar(12) | sí |  |  |  |
| resAnamnesis | varchar(1000) | sí |  |  |  |
| resExaFisico | varchar(900) | sí |  |  |  |
| diagnostico1 | varchar(4) | sí |  |  |  |
| tipoDiagnostico1 | varchar(4) | sí |  |  |  |
| diagnostico2 | varchar(4) | sí |  |  |  |
| tipoDiagnostico2 | varchar(4) | sí |  |  |  |
| diagnostico3 | varchar(4) | sí |  |  |  |
| tipoDiagnostico3 | varchar(4) | sí |  |  |  |
| codRenipressOrigen | varchar(6) | sí |  |  |  |
| codRenipressDestino | varchar(6) | sí |  |  |  |
| ubigeoRenipress | varchar(6) | sí |  |  |  |
| cpt1 | varchar(45) | sí |  |  |  |
| cpt2 | varchar(45) | sí |  |  |  |
| cpt3 | varchar(45) | sí |  |  |  |
| cpt4 | varchar(45) | sí |  |  |  |
| cpt5 | varchar(45) | sí |  |  |  |
| cpt6 | varchar(45) | sí |  |  |  |
| cpt7 | varchar(45) | sí |  |  |  |
| cpt8 | varchar(45) | sí |  |  |  |
| cpt9 | varchar(45) | sí |  |  |  |
| tipDocumentoTutor | varchar(2) | sí |  |  |  |
| numDocumentoTutor | varchar(15) | sí |  |  |  |
| apePaternoTutor | varchar(150) | sí |  |  |  |
| apeMaternoTutor | varchar(150) | sí |  |  |  |
| nombreTutor | varchar(80) | sí |  |  |  |
| FechaRegistro | datetime | sí |  |  |  |
| IdCuentaAtencion | int | sí |  |  |  |
| idReferencia | int | sí |  |  |  |

### RegistroEmergencia

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdRegistroEmergencia | int | no | sí |  | PK |
| IdTipoDocumento | int | no |  |  |  |
| NroDocPaciente | varchar(20) | sí |  |  |  |
| Paciente | varchar(100) | no |  |  |  |
| IdFormaIngreso | int | sí |  |  |  |
| IdMotivoIngreso | int | sí |  |  |  |
| IdServicio | int | no |  |  |  |
| Medico | varchar(100) | no |  |  |  |
| IdGravedad | int | no |  |  |  |
| CodigoDiagnostico | varchar(8) | no |  |  |  |
| IdTipoDiagnostico | int | no |  |  |  |
| IdFinanciamiento | int | no |  |  |  |
| IdUsuario | int | no |  |  |  |
| Procedencia | varchar(50) | sí |  |  |  |
| hclinica | int | sí |  |  |  |
| edad | int | sí |  |  |  |
| sexo | int | sí |  |  |  |
| Fecha_Hora | smalldatetime | sí |  | getdate() |  |
| IdUsuarioModificacion | int | sí |  |  |  |

Claves foráneas:

- `IdUsuario` → `dbo.Empleados.IdEmpleado` (FK_RegistroEmergencia_Empleados)
- `IdUsuarioModificacion` → `dbo.Empleados.IdEmpleado` (FK_RegistroEmergencia_EmpleadosModificacion)
- `IdFormaIngreso` → `dbo.FormaIngresoEmer.IdFormaIngreso` (FK_RegistroEmergencia_FormaIngresoEmer)
- `IdMotivoIngreso` → `dbo.MotivoIngresoEmer.IdMotivoIngreso` (FK_RegistroEmergencia_MotivoIngresoEmer)
- `IdServicio` → `dbo.Servicios.IdServicio` (FK_RegistroEmergencia_Servicios)
- `IdTipoDiagnostico` → `dbo.SubclasificacionDiagnosticos.IdSubclasificacionDx` (FK_RegistroEmergencia_SubclasificacionDiagnosticos)
- `IdTipoDocumento` → `dbo.TiposDocIdentidad.IdDocIdentidad` (FK_RegistroEmergencia_TiposDocIdentidad)
- `IdFinanciamiento` → `dbo.TiposFinanciamiento.IdTipoFinanciamiento` (FK_RegistroEmergencia_TiposFinanciamiento)
- `IdGravedad` → `dbo.TiposGravedadAtencion.IdTipoGravedad` (FK_RegistroEmergencia_TiposGravedadAtencion)

### RegistroInterconsulta

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| idregistro | int | sí |  |  |  |
| IdInterconsultaSolicitud | int | sí |  |  |  |
| IdInterconsultaCab | int | sí |  |  |  |
| IdInterconsulta | int | sí |  |  |  |
| IdAtencion | int | sí |  |  |  |
| UsuarioRegistra | int | sí |  |  |  |
| Estado | int | sí |  |  |  |

### religion

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| idreligion | int | no |  |  | PK |
| descripcion | varchar(100) | no |  |  |  |

### Reporte

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| NroHistoriaClinica | int | sí |  |  |  |
| ApellidoPaterno | varchar(20) | no |  |  |  |
| ApellidoMaterno | varchar(20) | no |  |  |  |
| PrimerNombre | varchar(20) | no |  |  |  |
| SegundoNombre | varchar(20) | sí |  |  |  |
| Sexo | varchar(50) | no |  |  |  |
| Edad | int | no |  |  |  |
| FechaIngreso | datetime | no |  |  |  |
| HoraIngreso | char(5) | no |  |  |  |
| FechaEgreso | datetime | sí |  |  |  |
| HoraEgreso | char(5) | sí |  |  |  |
| Condición Alta | varchar(50) | no |  |  |  |
| Cod. Serv. Ing | varchar(6) | no |  |  |  |
| Servicio Ingreso | varchar(50) | no |  |  |  |
| Cod. Serv. Egr | varchar(6) | no |  |  |  |
| Servicio Egreso | varchar(50) | no |  |  |  |
| CodigoCIE10_Diagn | char(7) | sí |  |  |  |
| Diagnóstico | varchar(250) | no |  |  |  |
| CodigoCPT2004 | char(7) | no |  |  |  |
| Descripción Procedimiento | varchar(250) | no |  |  |  |

### reporte_cabecera

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| idUsuario | int | sí |  |  |  |
| NroCuenta | int | no |  |  |  |
| FechaIngreso | datetime | sí |  |  |  |
| HoraIngreso | varchar(5) | sí |  |  |  |
| Paciente | varchar(100) | sí |  |  |  |
| Sexo | varchar(1) | sí |  |  |  |
| Motivo | varchar(100) | sí |  |  |  |
| Estancia | varchar(100) | sí |  |  |  |
| FechaEgreso | datetime | sí |  |  |  |
| HoraEgreso | varchar(5) | sí |  |  |  |
| Destino | varchar(100) | sí |  |  |  |
| Recibe | varchar(100) | sí |  |  |  |
| MedicoIE | varchar(100) | sí |  |  |  |
| idServicio | int | sí |  |  |  |
| ServicioHosp | varchar(100) | sí |  |  |  |

### reporte_detalle

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| idUsuario | int | sí |  |  |  |
| NroCuenta | int | sí |  |  |  |
| ConsumoDescripcion | varchar(100) | sí |  |  |  |
| ConsumoImporte | money | sí |  |  |  |
| DevolucionHC | varchar(50) | sí |  |  |  |
| dia1 | int | sí |  |  |  |
| dia2 | int | sí |  |  |  |
| dia3 | int | sí |  |  |  |
| dia4 | int | sí |  |  |  |
| dia5 | int | sí |  |  |  |
| dia6 | int | sí |  |  |  |
| dia7 | int | sí |  |  |  |
| dia8 | int | sí |  |  |  |
| dia9 | int | sí |  |  |  |
| dia10 | int | sí |  |  |  |
| dia11 | int | sí |  |  |  |
| dia12 | int | sí |  |  |  |
| dia13 | int | sí |  |  |  |
| dia14 | int | sí |  |  |  |
| dia15 | int | sí |  |  |  |
| dia16 | int | sí |  |  |  |
| dia17 | int | sí |  |  |  |
| dia18 | int | sí |  |  |  |
| dia19 | int | sí |  |  |  |
| dia20 | int | sí |  |  |  |
| dia21 | int | sí |  |  |  |
| dia22 | int | sí |  |  |  |
| dia23 | int | sí |  |  |  |
| dia24 | int | sí |  |  |  |
| dia25 | int | sí |  |  |  |
| dia26 | int | sí |  |  |  |
| dia27 | int | sí |  |  |  |
| dia28 | int | sí |  |  |  |
| dia29 | int | sí |  |  |  |
| dia30 | int | sí |  |  |  |
| dia31 | int | sí |  |  |  |
| total | int | sí |  |  |  |

### RequerimientoBiologico

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| id | int | no | sí |  | PK |
| id_correlativo | varchar(20) | no |  |  |  |
| nro_cuenta | int | no |  |  |  |
| medico | varchar(200) | sí |  |  |  |
| nombres_paciente | varchar(300) | sí |  |  |  |
| edad | varchar(50) | sí |  |  |  |
| historia_clinica | varchar(50) | sí |  |  |  |
| fecha_salida | date | sí |  |  |  |
| hora | time | sí |  |  |  |
| servicio | varchar(100) | sí |  |  |  |
| fecha_creacion | datetime | no |  | getdate() |  |
| fecha_actualizacion | datetime | sí |  |  |  |
| usuario_creacion | varchar(50) | sí |  |  |  |
| usuario_actualizacion | varchar(50) | sí |  |  |  |

### Restauracion

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| Id | int | no | sí |  | PK |
| OdontogramaVersionId | int | no |  |  |  |
| NumeroDiente | tinyint | no |  |  |  |
| Tipo | nvarchar(50) | no |  |  |  |
| Material | nvarchar(50) | sí |  |  |  |
| Areas | nvarchar(200) | sí |  |  |  |
| Color | nvarchar(30) | sí |  |  |  |
| Metadata | nvarchar(max) | sí |  |  |  |
| Fecha_Creacion | datetime2 | no |  | getdate() |  |
| Usuario_Creacion | nvarchar(100) | sí |  |  |  |

Claves foráneas:

- `OdontogramaVersionId` → `dbo.OdontogramaVersion.Id` (FK_Restauracion_Version)

### rol_estadistica

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| id_rol | int | no | sí |  | PK |
| codigo_rol | varchar(30) | no |  |  |  |
| nombre_rol | varchar(50) | no |  |  |  |
| descripcion | varchar(255) | sí |  |  |  |
| es_activo | bit | no |  | (1) |  |
| fecha_registro | datetime | no |  | getdate() |  |

### rol_items_estadistica

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| id_item | int | no | sí |  | PK |
| codigo_item | varchar(30) | no |  |  |  |
| nombre_item | varchar(50) | no |  |  |  |
| descripcion | varchar(255) | sí |  |  |  |
| orden | int | no |  | (1) |  |
| es_activo | bit | no |  | (1) |  |

### rol_modulos_estadistica

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| id_rol_modulo | int | no | sí |  | PK |
| idempleado | int | no |  |  |  |
| id_modulo | int | no |  |  |  |
| tiene_acceso | bit | no |  | (1) |  |
| puede_agregar | bit | no |  | (0) |  |
| puede_modificar | bit | no |  | (0) |  |
| puede_eliminar | bit | no |  | (0) |  |
| puede_omitir | bit | no |  | (0) |  |
| puede_enviar | bit | no |  | (0) |  |
| es_activo | bit | no |  | (1) |  |
| fecha_registro | datetime | no |  | getdate() |  |
| idempleado_asignador | int | sí |  |  |  |

Claves foráneas:

- `idempleado` → `dbo.Empleados.IdEmpleado` (FK_rme_empleado)
- `id_modulo` → `dbo.modulos_estadistica.id_modulo` (FK_rme_modulo)

### Roles

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdRol | int | no | sí |  | PK |
| Nombre | varchar(50) | no |  |  |  |

### RolesItems

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdRolItem | int | no | sí |  | PK |
| IdListItem | int | sí |  |  |  |
| IdRol | int | sí |  |  |  |
| Agregar | bit | sí |  |  |  |
| Modificar | bit | sí |  |  |  |
| Eliminar | bit | sí |  |  |  |
| Consultar | bit | sí |  |  |  |

Claves foráneas:

- `IdListItem` → `dbo.ListBarItems.IdListItem` (ListBarItems_RolesItems_FK1)
- `IdRol` → `dbo.Roles.IdRol` (SeguridadGrupos_SeguridadGruposPermisos_FK1)

### RolesPermisos

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdRolPermiso | int | no | sí |  | PK |
| IdPermiso | int | sí |  |  |  |
| IdRol | int | sí |  |  |  |

Claves foráneas:

- `IdPermiso` → `dbo.Permisos.IdPermiso` (Permisos_RolesPermisos_FK1)
- `IdRol` → `dbo.Roles.IdRol` (Roles_RolesPermisos_FK1)

### RolesReportes

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| idRol | int | no |  |  | PK |
| IdReporte | int | no |  |  | PK |
| TieneAcceso | bit | sí |  |  |  |

### rolessis

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdRol | int | no | sí |  | PK |
| Nombre | varchar(350) | no |  |  |  |

### SeccionChequeoEnfermeria

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdSeccionChequeoEnfermeria | int | no |  |  | PK |
| Descripcion | nchar(100) | sí |  |  |  |
| EstadoReg | bit | sí |  |  |  |
| IdUsuario | int | sí |  |  |  |
| Estacion | nchar(50) | sí |  |  |  |
| FechaReg | datetime | sí |  |  |  |

### SeguroSis

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| id | int | no | sí |  |  |
| tipoDocumento | int | sí |  |  |  |
| NroDocumento | varchar(15) | sí |  |  |  |
| apePaterno | varchar(50) | sí |  |  |  |
| apeMaterno | varchar(50) | sí |  |  |  |
| nombres | varchar(70) | sí |  |  |  |
| nombres2 | varchar(70) | sí |  |  |  |
| fecAfiliacion | date | sí |  |  |  |
| EESS | varchar(50) | sí |  |  |  |
| descEESS | varchar(50) | sí |  |  |  |
| EESSUbigeo | varchar(200) | sí |  |  |  |
| descEESSUbigeo | varchar(50) | sí |  |  |  |
| regimen | varchar(50) | sí |  |  |  |
| tipoSeguro | varchar(50) | sí |  |  |  |
| descTipoSeguro | varchar(100) | sí |  |  |  |
| contrato | varchar(100) | sí |  |  |  |
| fecCaducidad | varchar(50) | sí |  |  |  |
| estado | varchar(50) | sí |  |  |  |
| msgConfidencial | varchar(50) | sí |  |  |  |
| tabla | varchar(50) | sí |  |  |  |
| idNumReg | varchar(50) | sí |  |  |  |
| genero | varchar(50) | sí |  |  |  |
| fecNacimiento | datetime | sí |  |  |  |
| idUbigeo | varchar(10) | sí |  |  |  |
| disa | varchar(50) | sí |  |  |  |
| tipoFormato | varchar(50) | sí |  |  |  |
| nroContrato | varchar(50) | sí |  |  |  |
| correlativo | varchar(50) | sí |  |  |  |
| idPlan | varchar(50) | sí |  |  |  |
| idGrupoPoblacional | varchar(50) | sí |  |  |  |
| idsuario | int | sí |  |  |  |
| estadoDato | int | sí |  |  |  |
| fecha | date | sí |  |  |  |

### Servicios

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdServicio | int | no | sí |  | PK |
| Nombre | varchar(50) | no |  |  |  |
| IdEspecialidad | int | no |  |  |  |
| IdTipoServicio | int | no |  |  |  |
| Codigo | varchar(6) | no |  |  |  |
| SVG | varchar(1000) | sí |  |  |  |
| IdProducto | int | sí |  |  |  |
| soloTipoSexo | int | sí |  |  |  |
| maximaEdad | int | sí |  |  |  |
| codigoServicioSEM | varchar(2) | sí |  |  |  |
| ubicacionSEM | varchar(5) | sí |  |  |  |
| codigoServicioHIS | varchar(6) | sí |  |  |  |
| CostoCeroCE | varchar(1) | sí |  |  |  |
| MinimaEdad | int | sí |  |  |  |
| idEstado | int | sí |  |  |  |
| Triaje | bit | sí |  |  |  |
| EsObservacionEmergencia | bit | sí |  |  |  |
| UsaModuloNinoSano | bit | sí |  |  |  |
| UsaModuloMaterno | bit | sí |  |  |  |
| UsaGalenHos | bit | sí |  |  |  |
| TipoEdad | int | sí |  |  |  |
| UsaFUA | bit | sí |  |  |  |
| codigoServicioSuSalud | varchar(7) | sí |  |  |  |
| codigoServicioFUA | varchar(6) | sí |  |  |  |
| FuaTipoAnexo2015 | int | sí |  |  |  |
| codigoServicioRenaes | varchar(6) | sí |  |  |  |
| terapiaTipo | int | sí |  |  |  |
| CptSinDiagnostico | bit | no |  | (0) |  |

Claves foráneas:

- `IdEspecialidad` → `dbo.Especialidades.IdEspecialidad` (Especialidades_Servicios_FK1)
- `IdTipoServicio` → `dbo.TiposServicio.IdTipoServicio` (TiposServicio_Servicios_FK1)

### ServiciosAtenSimultanea

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| idServicio | int | no |  |  | PK |
| idServicioAtencionSimultanea | int | no |  |  | PK |

Claves foráneas:

- `idServicio` → `dbo.Servicios.IdServicio` (FK_ServiciosAtenSimultanea_Servicios)

### ServiciosAtenSimultaneaFua

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| AScorrelativo | char(10) | no |  |  |  |
| idAtencion | int | no |  |  |  |
| item | int | no |  |  |  |
| idTipo | int | no |  |  |  |
| idFuaCorrelativo | int | no |  |  |  |
| idFuaIdCuentaAtencion | int | sí |  |  |  |
| FuaCodigoPrestacion | varchar(3) | sí |  |  |  |

Claves foráneas:

- `idTipo` → `dbo.TiposServiciosIntermedios.idTipo` (FK_ServiciosAtenSimultaneaFua_TiposServiciosIntermedios)

### ServiciosAtenSimultaneaFuaEquiv

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| Id | int | no |  |  | PK |
| ups | varchar(6) | no |  |  |  |
| EdadInicio | int | no |  |  |  |
| EdadFinal | int | no |  |  |  |
| idTipoEdad | int | no |  |  |  |
| FuaCodigoPrestacion | varchar(3) | no |  |  |  |
| DxTipo | varchar(1) | no |  |  |  |
| DxCodigo | varchar(20) | no |  |  |  |
| PesoKgMenor | money | no |  |  |  |
| PesoKgMayor | money | no |  |  |  |

Claves foráneas:

- `idTipoEdad` → `dbo.TiposEdad.IdTipoEdad` (FK_ServiciosAtenSimultaneaFuaEquiv_TiposEdad)

### ServiciosAtenSimultaneaImpHIS

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| ups | varchar(6) | no |  |  |  |
| grupo | int | no |  |  |  |
| subgrupo | int | no |  |  |  |
| subgrupoOrden | int | sí |  |  |  |
| Lab | varchar(3) | sí |  |  |  |
| cpt_dx | varchar(20) | no |  |  |  |
| idTipo | int | no |  |  |  |
| EdadInicio | int | no |  |  |  |
| EdadFinal | int | no |  |  |  |
| idTipoEdad | int | no |  |  |  |
| PesoKgMenor | money | no |  |  |  |
| PesoKgMayor | money | no |  |  |  |

Claves foráneas:

- `idTipoEdad` → `dbo.TiposEdad.IdTipoEdad` (FK_ServiciosAtenSimultaneaImpHIS_TiposEdad)
- `idTipo` → `dbo.TiposServiciosIntermedios.idTipo` (FK_ServiciosAtenSimultaneaImpHIS_TiposServiciosIntermedios)

### ServiciosAtenSimultaneaMov

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| AScorrelativo | int | no |  |  | PK |
| IdAtencion | int | no |  |  | PK |
| horaInicio | varchar(5) | sí |  |  |  |

### ServiciosBkp

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdServicio | int | no | sí |  |  |
| Nombre | varchar(50) | no |  |  |  |
| IdEspecialidad | int | no |  |  |  |
| IdTipoServicio | int | no |  |  |  |
| Codigo | varchar(6) | no |  |  |  |
| SVG | varchar(1000) | sí |  |  |  |
| IdProducto | int | sí |  |  |  |
| soloTipoSexo | int | sí |  |  |  |
| maximaEdad | int | sí |  |  |  |
| codigoServicioSEM | varchar(2) | sí |  |  |  |
| ubicacionSEM | varchar(5) | sí |  |  |  |
| codigoServicioHIS | varchar(6) | sí |  |  |  |
| CostoCeroCE | varchar(1) | sí |  |  |  |
| MinimaEdad | int | sí |  |  |  |
| idEstado | int | sí |  |  |  |
| Triaje | bit | sí |  |  |  |
| EsObservacionEmergencia | bit | sí |  |  |  |
| UsaModuloNinoSano | bit | sí |  |  |  |
| UsaModuloMaterno | bit | sí |  |  |  |
| UsaGalenHos | bit | sí |  |  |  |
| TipoEdad | int | sí |  |  |  |
| UsaFUA | bit | sí |  |  |  |
| codigoServicioSuSalud | varchar(7) | sí |  |  |  |
| codigoServicioFUA | varchar(6) | sí |  |  |  |
| FuaTipoAnexo2015 | int | sí |  |  |  |
| codigoServicioRenaes | varchar(6) | sí |  |  |  |

### ServiciosCodPrestacional

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| idservicio | int | sí |  |  |  |
| nombre | varchar(100) | sí |  |  |  |
| FuaCodigoPrestacion | varchar(3) | sí |  |  |  |

### ServiciosEspecialidades

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| idservicio | int | sí |  |  |  |
| idespecialidad | int | sí |  |  |  |
| idactividad | int | sí |  |  |  |

### ServiciosINMP

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdServicio | int | no | sí |  | PK |
| Descripcion | varchar(50) | sí |  |  |  |
| Estado | int | sí |  |  |  |
| Prioridad | int | sí |  |  |  |

### ServicioSocialEstadoOperacion

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdEstado | tinyint | no |  |  | PK |
| Descripcion | varchar(30) | no |  |  |  |

### ServicioSocialOperacion

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdOperacion | int | no | sí |  | PK |
| IdTipoOperacion | tinyint | no |  |  |  |
| IdEstado | tinyint | no |  |  |  |
| IdCuentaAtencion | int | no |  |  |  |
| Motivo | nvarchar(500) | no |  |  |  |
| IdUsuario | int | no |  |  |  |
| Fecha | datetime | no |  |  |  |
| IdUsuarioReversion | int | sí |  |  |  |
| FechaReversion | datetime | sí |  |  |  |
| MotivoReversion | nvarchar(500) | sí |  |  |  |

Claves foráneas:

- `IdEstado` → `dbo.ServicioSocialEstadoOperacion.IdEstado` (FK_SSOperacion_Estado)
- `IdTipoOperacion` → `dbo.ServicioSocialTipoOperacion.IdTipoOperacion` (FK_SSOperacion_Tipo)

### ServicioSocialOperacionOrden

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdOperacion | int | no |  |  | PK |
| IdOrden | int | no |  |  | PK |
| Monto | money | no |  |  |  |
| IdOrdenDeuda | int | sí |  |  |  |
| IdReceta | int | sí |  |  |  |

Claves foráneas:

- `IdOperacion` → `dbo.ServicioSocialOperacion.IdOperacion` (FK_SSOperacionOrden_Operacion)

### ServicioSocialTipoOperacion

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdTipoOperacion | tinyint | no |  |  | PK |
| Descripcion | varchar(30) | no |  |  |  |

### SesionesActivas

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdEmpleado | int | no |  |  |  |
| RefreshToken | varchar(64) | no |  |  | PK |
| NombreUsuario | varchar(30) | sí |  |  |  |
| FechaCreacion | datetime | no |  | getdate() |  |
| Sst | bigint | no |  | (0) |  |

### SimboloClinico

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| Id | int | no | sí |  | PK |
| OdontogramaVersionId | int | no |  |  |  |
| TipoCodigo | nvarchar(50) | no |  |  |  |
| PosX | decimal(6,3) | no |  |  |  |
| PosY | decimal(6,3) | no |  |  |  |
| Color | nvarchar(30) | sí |  |  |  |
| Metadata | nvarchar(max) | sí |  |  |  |

Claves foráneas:

- `OdontogramaVersionId` → `dbo.OdontogramaVersion.Id` (FK_SimboloClinico_Version)

### SolicitudCitasWeb

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| id | int | no | sí |  | PK |
| idProgramacion | int | sí |  |  |  |
| nroHistoria | int | sí |  |  |  |
| horaInicio | varchar(max) | sí |  |  |  |
| fechaRegistro | datetime | sí |  |  |  |
| estado | int | sí |  |  |  |
| ObservacionesPaciente | varchar(max) | sí |  |  |  |
| ObservacionesCallCenter | varchar(max) | sí |  |  |  |
| fechaCita | varchar(max) | sí |  |  |  |
| hojaReferencia | varchar(max) | sí |  |  |  |
| interconsulta | varchar(max) | sí |  |  |  |
| planSolicitud | int | sí |  |  |  |
| Telefono | varchar(max) | sí |  |  |  |
| NroCuenta | varchar(max) | sí |  |  |  |
| idUsuarioAct | int | sí |  |  |  |
| FechaAct | datetime | sí |  |  |  |

### SolicitudExamenBaciloscopia

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdSolicitudBaciloscopia | int | no | sí |  |  |
| IdCuentaAtencion | int | sí |  |  |  |
| IdTipoMuestra | int | sí |  |  |  |
| Especificar | varchar(50) | sí |  |  |  |
| IdAntecedenteTratamiento | int | sí |  |  |  |
| SrDiagnostico | int | sí |  |  |  |
| SegDiagnostico | int | sí |  |  |  |
| RxAnormalDiagnostico | int | sí |  |  |  |
| OtroDiagnostico | varchar(50) | sí |  |  |  |
| IdControlTratamiento | int | sí |  |  |  |
| IdExSolicitado | int | sí |  |  |  |
| DescripcionSolicitados | int | sí |  |  |  |
| PruebaSensibilidadRapida | int | sí |  |  |  |
| EspecificarPruebaRapida | varchar(50) | sí |  |  |  |
| PruebaSensibilidadConvencional | int | sí |  |  |  |
| EspecificarPruebaConvencional | varchar(50) | sí |  |  |  |
| OtroExamen | varchar(50) | sí |  |  |  |
| FactorRiesgo | varchar(50) | sí |  |  |  |
| FechaObtencionMuestra | date | sí |  |  |  |
| Observaciones | varchar(150) | sí |  |  |  |

### SolicitudProcedimientos

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdSolicitudProc | int | no | sí |  | PK |
| IdCuenta | int | no |  |  |  |
| IdProducto | int | sí |  |  |  |
| Cantidad | varchar(1) | sí |  |  |  |
| Observación | varchar(1000) | sí |  |  |  |
| FechaRegistro | datetime | sí |  |  |  |
| IdUsuario | int | no |  |  |  |
| Estado | bit | sí |  |  |  |

### SubclasificacionDiagnosticos

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdSubclasificacionDx | int | no |  |  | PK |
| Codigo | varchar(5) | no |  |  |  |
| Descripcion | varchar(100) | no |  |  |  |
| IdClasificacionDx | int | sí |  |  |  |
| IdTipoServicio | int | sí |  |  |  |

Claves foráneas:

- `IdClasificacionDx` → `dbo.ClasificacionDiagnosticos.IdClasificacionDx` (ClasificacionDiagnosticos_SubclasificaciónDiagnosticos_FK1)
- `IdTipoServicio` → `dbo.TiposServicio.IdTipoServicio` (TiposServicio_SubclasificaciónDiagnosticos_FK1)

### subir

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| idatencion | int | sí |  |  |  |
| idcuentaatencion | int | sí |  |  |  |

### SunasaPacientesHistoricos

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| idSunasaPacienteHistorico | int | no | sí |  | PK |
| idPaciente | int | no |  |  |  |
| CodigoIAFA | varchar(5) | sí |  |  |  |
| idPaisTitular | int | sí |  |  |  |
| idTipoDocumentoTitular | int | sí |  |  |  |
| NroDocumentoTitular | varchar(10) | sí |  |  |  |
| ApellidoCasada | varchar(35) | sí |  |  |  |
| ValidacionRegIdentidad | bit | sí |  |  |  |
| NroCarnetIdentidad | varchar(10) | sí |  |  |  |
| EstadoDelSeguro | int | sí |  |  |  |
| IdAfiliacion | int | sí |  |  |  |
| ProductoYplan | varchar(7) | sí |  |  |  |
| FechaInicioAfiliacion | datetime | sí |  |  |  |
| FechaFinalAfiliacion | datetime | sí |  |  |  |
| idRegimen | int | sí |  |  |  |
| CodigoEstablecimientoIAFA | varchar(8) | sí |  |  |  |
| CodigoEstablecimientoRENAES | varchar(8) | sí |  |  |  |
| idParentesco | int | sí |  |  |  |
| RUCempleador | varchar(11) | sí |  |  |  |
| AnteriorIdTipoDocumentoAsegurado | int | sí |  |  |  |
| AnteriorNroDocumentoAsegurado | varchar(10) | sí |  |  |  |
| DNIusarioOperacion | varchar(8) | sí |  |  |  |
| idOperacion | int | sí |  |  |  |
| FechaEnvio | datetime | sí |  |  |  |
| SisSepelioParienteEncargado | varchar(100) | sí |  |  |  |
| SisSepelioDni | varchar(8) | sí |  |  |  |
| SisSepelioFnacimiento | datetime | sí |  |  |  |
| SisSepelioSexo | int | sí |  |  |  |
| SisNroAfiliacion | varchar(20) | sí |  |  |  |
| YaNoTieneSeguro | bit | sí |  |  |  |

Claves foráneas:

- `idPaciente` → `dbo.Pacientes.IdPaciente` (FK_PacientesSunasa_Pacientes)
- `idTipoDocumentoTitular` → `dbo.TiposDocIdentidad.IdDocIdentidad` (FK_PacientesSunasa_TiposDocIdentidad)
- `AnteriorIdTipoDocumentoAsegurado` → `dbo.TiposDocIdentidad.IdDocIdentidad` (FK_PacientesSunasa_TiposDocIdentidad1)
- `IdAfiliacion` → `dbo.SunasaTiposAfiliacion.idAfiliacion` (FK_PacientesSunasa_TiposSUNASAafiliacion)
- `idOperacion` → `dbo.SunasaTiposOperacion.idOperacion` (FK_PacientesSunasa_TiposSUNASAoperacion)
- `idParentesco` → `dbo.SunasaTiposParentesco.idParentesco` (FK_PacientesSunasa_TiposSUNASAparentesco)
- `idRegimen` → `dbo.SunasaTiposRegimen.idRegimen` (FK_PacientesSunasa_TiposSUNASAregimen)

### SunasaTiposAfiliacion

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| idAfiliacion | int | no |  |  | PK |
| Afiliacion | varchar(50) | no |  |  |  |

### SunasaTiposOperacion

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| idOperacion | int | no |  |  | PK |
| Operacion | varchar(50) | no |  |  |  |

### SunasaTiposParentesco

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| idParentesco | int | no |  |  | PK |
| Parentesco | varchar(50) | no |  |  |  |

### SunasaTiposRegimen

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| idRegimen | int | no |  |  | PK |
| Regimen | varchar(50) | no |  |  |  |

### Supernumerario

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| Id | int | no | sí |  | PK |
| OdontogramaVersionId | int | no |  |  |  |
| Diente_A | tinyint | no |  |  |  |
| Diente_B | tinyint | sí |  |  |  |
| Color | nvarchar(30) | sí |  |  |  |
| Metadata | nvarchar(max) | sí |  |  |  |
| Fecha_Creacion | datetime2 | no |  | getdate() |  |
| Usuario_Creacion | nvarchar(100) | sí |  |  |  |

Claves foráneas:

- `OdontogramaVersionId` → `dbo.OdontogramaVersion.Id` (FK_Supernumerario_Version)

### SuSalud_ups

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| Codigo | varchar(7) | no |  |  |  |
| Descripcion | varchar(255) | no |  |  |  |

### SVGEstructura

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| Orden | int | no |  |  | PK |
| Tipo | varchar(20) | no |  |  | PK |
| SVG | varchar(8000) | no |  |  |  |
| Codigo | varchar(20) | sí |  |  |  |

### sysdiagrams

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| name | sysname | no |  |  |  |
| principal_id | int | no |  |  |  |
| diagram_id | int | no | sí |  | PK |
| version | int | sí |  |  |  |
| definition | varbinary(max) | sí |  |  |  |

### TecnicaAnestesiaRegional

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdTecnicaAnestesiaRegional | int | no |  |  | PK |
| Descripcion | nchar(100) | no |  |  |  |
| EstadoReg | bit | sí |  |  |  |
| IdUsuario | int | sí |  |  |  |
| Estacion | nchar(50) | sí |  |  |  |
| FechaReg | datetime | sí |  |  |  |

### tempMovimientos

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdMovimiento | int | sí |  |  |  |
| IdUsuario | int | sí |  |  |  |

### test

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| ID | int | sí |  |  |  |
| Name | char(1) | sí |  |  |  |
| Year | int | sí |  |  |  |
| QTY | int | sí |  |  |  |

### TipoEstablecimiento

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| idtipo | int | sí |  |  |  |
| Nombre | varchar(250) | sí |  |  |  |

### TipoFinanciador

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| idTipoFinanciador | int | no | sí |  | PK |
| nombre | varchar(50) | no |  |  |  |
| denominacion | varchar(50) | sí |  |  |  |
| codigo | varchar(11) | sí |  |  |  |

### TipoMuestraBaciloscopia

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdTipoMuestra | int | no | sí |  |  |
| Descripcion | varchar(50) | sí |  |  |  |

### TipoNotificacion

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdNotificacion | int | sí |  |  |  |
| TipoNotificacion | varchar(50) | sí |  |  |  |

### TiposAccionesEnfermeria

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdAccionesEnfermeria | int | no |  |  | PK |
| Descripcion | nchar(200) | no |  |  |  |
| EstadoReg | bit | sí |  |  |  |
| IdUsuario | int | sí |  |  |  |
| Estacion | nchar(50) | sí |  |  |  |
| FechaReg | datetime | sí |  |  |  |

### TiposAlta

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdTipoAlta | int | no |  |  | PK |
| Descripcion | varchar(50) | no |  |  |  |

### TiposAnestesia

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdAnestesia | int | no |  |  | PK |
| Descripcion | nchar(100) | no |  |  |  |
| EstadoReg | bit | sí |  |  |  |
| IdUsuario | int | sí |  |  |  |
| Estacion | nchar(50) | sí |  |  |  |
| FechaReg | datetime | sí |  |  |  |

### TiposAnestesiaGeneral

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdAnestesiaGeneral | int | no |  |  | PK |
| Descripcion | nchar(100) | no |  |  |  |
| EstadoReg | bit | sí |  |  |  |
| IdUsuario | int | sí |  |  |  |
| Estacion | nchar(50) | sí |  |  |  |
| FechaReg | datetime | sí |  |  |  |

### TiposCama

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdTipoCama | int | no |  |  | PK |
| Descripcion | varchar(50) | no |  |  |  |

### TiposCargo

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| idTipoCargo | int | no | sí |  | PK |
| Cargo | varchar(100) | no |  |  |  |

### TiposCausaSuspensionOperacion

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdCausaSuspensionOperacion | int | no |  |  | PK |
| IdGrupoCausaSuspensionOperacion | int | sí |  |  |  |
| Descripcion | varchar(1000) | sí |  |  |  |
| Orden | int | sí |  |  |  |
| EstadoReg | bit | sí |  |  |  |
| IdUsuario | int | sí |  |  |  |
| Estacion | nchar(50) | sí |  |  |  |
| FechaReg | datetime | sí |  |  |  |

Claves foráneas:

- `IdGrupoCausaSuspensionOperacion` → `dbo.GrupoCausaSuspensionOperacion.IdGrupoCausaSuspensionOperacion` (FK__TiposCaus__IdGru__0BCBEBDC)
- `IdGrupoCausaSuspensionOperacion` → `dbo.GrupoCausaSuspensionOperacion.IdGrupoCausaSuspensionOperacion` (FK__TiposCaus__IdGru__0CC01015)
- `IdGrupoCausaSuspensionOperacion` → `dbo.GrupoCausaSuspensionOperacion.IdGrupoCausaSuspensionOperacion` (FK__TiposCaus__IdGru__4ED02C99)
- `IdGrupoCausaSuspensionOperacion` → `dbo.GrupoCausaSuspensionOperacion.IdGrupoCausaSuspensionOperacion` (FK__TiposCaus__IdGru__4FC450D2)

### TiposChequeoCirujano

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdChequeoCirujano | int | no |  |  | PK |
| Descripcion | varchar(1000) | sí |  |  |  |
| Orden | int | sí |  |  |  |
| EstadoReg | bit | sí |  |  |  |
| IdUsuario | int | sí |  |  |  |
| Estacion | nchar(50) | sí |  |  |  |
| FechaReg | datetime | sí |  |  |  |

### TiposChequeoEnfermeriaPreOperatoria

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdChequeoEnfermeriaPreOperatoria | int | no |  |  | PK |
| IdGrupoChequeoEnfermeriaPreOperatoria | int | sí |  |  |  |
| Descripcion | varchar(1000) | sí |  |  |  |
| Orden | int | sí |  |  |  |
| EstadoReg | bit | sí |  |  |  |
| IdUsuario | int | sí |  |  |  |
| Estacion | nchar(50) | sí |  |  |  |
| FechaReg | datetime | sí |  |  |  |

Claves foráneas:

- `IdGrupoChequeoEnfermeriaPreOperatoria` → `dbo.GrupoChequeoEnfermeriaPreOperatoria.IdGrupoChequeoEnfermeriaPreOperatoria` (FK__TiposCheq__IdGru__0DB4344E)
- `IdGrupoChequeoEnfermeriaPreOperatoria` → `dbo.GrupoChequeoEnfermeriaPreOperatoria.IdGrupoChequeoEnfermeriaPreOperatoria` (FK__TiposCheq__IdGru__50B8750B)

### TiposCondicionAlta

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdCondicionAlta | int | no |  |  | PK |
| Descripcion | varchar(50) | no |  |  |  |
| codigoCondicionAltaSEM | varchar(1) | sí |  |  |  |

### TiposCondicionIngresoURPA

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdCondicionIngresoURPA | int | no |  |  | PK |
| IdGrupoCondicionIngresoURPA | int | sí |  |  |  |
| Descripcion | varchar(1000) | sí |  |  |  |
| EstadoReg | bit | sí |  |  |  |
| IdUsuario | int | sí |  |  |  |
| Estacion | nchar(50) | sí |  |  |  |
| FechaReg | datetime | sí |  |  |  |

Claves foráneas:

- `IdGrupoCondicionIngresoURPA` → `dbo.GrupoCondicionIngresoURPA.IdGrupoCondicionIngresoURPA` (FK__TiposCond__IdGru__0EA85887)
- `IdGrupoCondicionIngresoURPA` → `dbo.GrupoCondicionIngresoURPA.IdGrupoCondicionIngresoURPA` (FK__TiposCond__IdGru__51AC9944)

### TiposCondicionOcupacion

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdCondicionOcupacion | int | no |  |  | PK |
| Descripcion | varchar(50) | no |  |  |  |

### TiposCondicionPaciente

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdTipoCondicionPaciente | int | no |  |  | PK |
| Descripcion | varchar(50) | no |  |  |  |
| OrdenRegHis | int | sí |  |  |  |

### TiposCondicionRecienNacido

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdCondicionRN | int | no |  |  | PK |
| Descripcion | varchar(20) | sí |  |  |  |

### TiposCondicionTrabajo

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdCondicionTrabajo | int | no | sí |  | PK |
| Descripcion | varchar(50) | no |  |  |  |

### TiposConsentimientoInformado

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdTiposConsentimientoInformado | int | no |  |  | PK |
| Descripcion | nchar(100) | no |  |  |  |
| Abreviatura | varchar(10) | sí |  |  |  |
| EsOrdenOperatoriaMQ | bit | sí |  |  |  |
| EstadoReg | bit | sí |  |  |  |
| IdUsuario | int | sí |  |  |  |
| Estacion | nchar(50) | sí |  |  |  |
| FechaReg | datetime | sí |  |  |  |

### TiposConsumos

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| idTipoConsumo | int | no |  |  | PK |
| Descripcion | varchar(20) | no |  |  |  |

### TiposDestacados

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| idDestacado | int | no |  |  | PK |
| Destacado | varchar(50) | no |  |  |  |

### TiposDestinoAtencion

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdDestinoAtencion | int | no |  |  | PK |
| Codigo | char(1) | no |  |  |  |
| Descripcion | varchar(50) | no |  |  |  |
| IdTipoServicio | int | sí |  |  |  |
| TipoServicioHosp | int | sí |  |  |  |
| DestinoSEM | varchar(2) | sí |  |  |  |
| id_destinoAseguradoSIS | varchar(1) | sí |  |  |  |

Claves foráneas:

- `IdTipoServicio` → `dbo.TiposServicio.IdTipoServicio` (TiposServicio_TiposDestinoAtencion_FK1)

### TiposDestinoOperacion

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdTiposDestinoOperacion | int | no |  |  | PK |
| Descripcion | varchar(100) | sí |  |  |  |

### TiposDocIdentidad

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdDocIdentidad | int | no |  |  | PK |
| Descripcion | varchar(50) | no |  |  |  |
| CodigoSUNASA | int | sí |  |  |  |
| CodigoHIS | varchar(1) | sí |  |  |  |
| CodigoSIS | varchar(1) | sí |  |  |  |

### TiposEdad

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdTipoEdad | int | no |  |  | PK |
| Codigo | char(1) | no |  |  |  |
| Descripcion | varchar(10) | no |  |  |  |
| tipoEdadSEM | varchar(1) | sí |  |  |  |

### TiposEmbarazo

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| Id | int | no | sí |  | PK |
| Nombre | varchar(50) | sí |  |  |  |
| Estado | int | sí |  |  |  |

### TiposEmpleado

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdTipoEmpleado | int | no | sí |  | PK |
| Descripcion | varchar(50) | no |  |  |  |
| TipoEmpleadoHIS | varchar(2) | sí |  |  |  |
| EsProgramado | bit | sí |  |  |  |
| TipoEmpleadoSIS | varchar(2) | sí |  |  |  |
| EsColegiatura | bit | sí |  | (1) |  |

### TiposEmpleadosRolesCQx

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdEmpleadosRolesCQx | int | no |  |  | PK |
| IdTipoEmpleado | int | no |  |  |  |
| IdRolesCQx | int | no |  |  |  |
| EstadoReg | bit | sí |  |  |  |

Claves foráneas:

- `IdRolesCQx` → `dbo.TiposRolesCQx.IdRolesCQx` (FK__TiposEmpl__IdRol__0F9C7CC0)
- `IdRolesCQx` → `dbo.TiposRolesCQx.IdRolesCQx` (FK__TiposEmpl__IdRol__52A0BD7D)
- `IdTipoEmpleado` → `dbo.TiposEmpleado.IdTipoEmpleado` (FK__TiposEmpl__IdTip__1090A0F9)
- `IdTipoEmpleado` → `dbo.TiposEmpleado.IdTipoEmpleado` (FK__TiposEmpl__IdTip__5394E1B6)

### TiposEstablecimientos

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdTipo | int | no | sí |  | PK |
| Descripcion | varchar(100) | no |  |  |  |

### TiposEstadoCivil

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdEstadoCivil | int | no |  |  | PK |
| Descripcion | varchar(50) | no |  |  |  |
| lolcli | varchar(2) | sí |  |  |  |
| sip2000 | varchar(2) | sí |  |  |  |

### TiposEstadoSalaOperacion

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdEstadoSalaOperacion | int | no |  |  | PK |
| Descripcion | nchar(50) | no |  |  |  |
| EstadoReg | bit | sí |  |  |  |
| IdUsuario | int | sí |  |  |  |
| Estacion | nchar(50) | sí |  |  |  |
| FechaReg | datetime | sí |  |  |  |

### TiposEstadosCita

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdEstadoCita | int | no |  |  | PK |
| Descripcion | varchar(50) | no |  |  |  |

### TiposExamenFisico

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdExamenFisico | int | no |  |  | PK |
| Descripcion | varchar(100) | sí |  |  |  |
| Abreviatura | varchar(50) | sí |  |  |  |
| Tipo | varchar(20) | sí |  |  |  |
| FormatoMask | varchar(50) | sí |  |  |  |
| EstadoReg | bit | sí |  |  |  |
| IdUsuario | int | sí |  |  |  |
| Estacion | nchar(50) | sí |  |  |  |
| FechaReg | datetime | sí |  |  |  |

### TiposFinanciamiento

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdTipoFinanciamiento | int | no |  |  | PK |
| Descripcion | varchar(50) | no |  |  |  |
| esOficina | bit | no |  |  |  |
| esSalida | bit | no |  |  |  |
| SeIngresPrecios | bit | no |  |  |  |
| EsFarmacia | bit | no |  |  |  |
| idCajaTiposComprobante | int | sí |  |  |  |
| tipoVenta | varchar(1) | sí |  |  |  |
| SeImprimeComprobante | bit | sí |  |  |  |
| esFuenteFinanciamiento | bit | no |  |  |  |
| GeneraPago | int | sí |  |  |  |
| idTipoConcepto | int | sí |  |  |  |

### TiposFormatosCQx

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdFormatosCQx | int | no |  |  | PK |
| Descripcion | nchar(100) | no |  |  |  |
| IdRolesCQx | int | no |  |  |  |
| Objeto | nchar(100) | sí |  |  |  |
| EstadoReg | bit | sí |  |  |  |
| IdUsuario | int | sí |  |  |  |
| Estacion | nchar(50) | sí |  |  |  |
| FechaReg | datetime | sí |  |  |  |

### TiposGradoInstruccion

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdGradoInstruccion | int | no |  |  | PK |
| Descripcion | varchar(50) | no |  |  |  |
| sip2000 | varchar(2) | sí |  |  |  |

### TiposGravedadAtencion

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdTipoGravedad | int | no |  |  | PK |
| Descripcion | varchar(50) | no |  |  |  |

### TiposHistoriaClinica

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdTipoHistoria | int | no |  |  | PK |
| Descripcion | varchar(50) | no |  |  |  |

### TiposIdiomas

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdIdioma | int | no |  |  | PK |
| Codigo | varchar(10) | no |  |  |  |
| Lengua | varchar(40) | no |  |  |  |

### TiposInasistencia

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdTipoInasistencia | int | no |  |  | PK |
| Descripcion | varchar(100) | no |  |  |  |

### TiposInduccionAnestesia

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdInduccionAnestesia | int | no |  |  | PK |
| Descripcion | nchar(100) | no |  |  |  |
| EstadoReg | bit | sí |  |  |  |
| IdUsuario | int | sí |  |  |  |
| Estacion | nchar(50) | sí |  |  |  |
| FechaReg | datetime | sí |  |  |  |

### TiposMonitoreoInvasivo

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdMonitoreoInvasivo | int | no |  |  | PK |
| Descripcion | nchar(200) | sí |  |  |  |
| EstadoReg | bit | sí |  |  |  |
| IdUsuario | int | sí |  |  |  |
| Estacion | nchar(50) | sí |  |  |  |
| FechaReg | datetime | sí |  |  |  |

### TiposMotivoAtencionEmergencia

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdMotivoAtencionEmergencia | int | no |  |  | PK |
| Descripcion | varchar(2000) | sí |  |  |  |
| IdPrioridadEmergencia | int | no |  |  |  |
| EstadoReg | bit | sí |  |  |  |
| IdUsuario | int | sí |  |  |  |
| Estacion | nchar(50) | sí |  |  |  |
| FechaReg | datetime | sí |  |  |  |

Claves foráneas:

- `IdPrioridadEmergencia` → `dbo.TiposPrioridadEmergencia.IdPrioridadEmergencia` (FK__TiposMoti__IdPri__594DBB0C)

### TiposNumeracionHistoria

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdTipoNumeracion | int | no |  |  | PK |
| Descripcion | varchar(50) | sí |  |  |  |

### TiposOcupacion

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdTipoOcupacion | int | no | sí |  | PK |
| descripcion | varchar(50) | no |  |  |  |
| lolcli | varchar(2) | sí |  |  |  |

### TiposOrigenAtencion

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdOrigenAtencion | int | no |  |  | PK |
| Codigo | char(1) | no |  |  |  |
| Descripcion | varchar(50) | no |  |  |  |
| IdTipoServicio | int | sí |  |  |  |
| TipoServicioHosp | int | sí |  |  |  |
| id_origenAseguradoSIS | varchar(1) | sí |  |  |  |

Claves foráneas:

- `IdTipoServicio` → `dbo.TiposServicio.IdTipoServicio` (TiposServicio_TiposOrigenAtencion_FK1)

### TiposPosicionAnestesia

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdPosicionAnestesia | int | no |  |  | PK |
| Descripcion | varchar(100) | sí |  |  |  |
| EstadoReg | bit | sí |  |  |  |
| IdUsuario | int | sí |  |  |  |
| Estacion | nchar(50) | sí |  |  |  |
| FechaReg | datetime | sí |  |  |  |

### TiposPrioridadEmergencia

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdPrioridadEmergencia | int | no |  |  | PK |
| Descripcion | varchar(150) | sí |  |  |  |
| EstadoReg | bit | sí |  |  |  |
| IdUsuario | int | sí |  |  |  |
| Estacion | nchar(50) | sí |  |  |  |
| FechaReg | datetime | sí |  |  |  |

### TiposProcedencia

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdProcedencia | int | no |  |  | PK |
| Descripcion | varchar(50) | no |  |  |  |

### TiposProgramacion

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdTipoProgramacion | int | no |  |  | PK |
| Descripcion | varchar(50) | no |  |  |  |

### TiposReferencia

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdTipoReferencia | int | no |  |  | PK |
| Descripcion | varchar(50) | no |  |  |  |

### TiposResultadosServInterm

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdResultadoSI | int | no |  |  | PK |
| Descripcion | varchar(50) | sí |  |  |  |

### TiposRolesCQx

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdRolesCQx | int | no |  |  | PK |
| Descripcion | nchar(100) | sí |  |  |  |
| Bit | bit | sí |  |  |  |
| Orden | int | sí |  |  |  |
| EstadoReg | bit | sí |  |  |  |
| IdUsuario | int | sí |  |  |  |
| Estacion | nchar(50) | sí |  |  |  |
| FechaReg | datetime | sí |  |  |  |

### TiposServicio

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdTipoServicio | int | no |  |  | PK |
| Descripcion | varchar(50) | no |  |  |  |

### TiposServiciosIntermedios

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| idTipo | int | no |  |  | PK |
| Tipo | varchar(20) | no |  |  |  |

### TiposSexo

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdTipoSexo | int | no |  |  | PK |
| Descripcion | varchar(50) | no |  |  |  |

### TiposSignosVitales

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdSignosVitales | int | no |  |  | PK |
| Descripcion | varchar(100) | sí |  |  |  |
| Abreviatura | varchar(50) | sí |  |  |  |
| Tipo | varchar(20) | sí |  |  |  |
| FormatoMask | varchar(50) | sí |  |  |  |
| EstadoReg | bit | sí |  |  |  |
| IdUsuario | int | sí |  |  |  |
| Estacion | nchar(50) | sí |  |  |  |
| FechaReg | datetime | sí |  |  |  |

### TiposSoporteHosp

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| idSoporte | int | no |  |  | PK |
| Descripcion | varchar(50) | no |  |  |  |

### TiposSubsector

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdTipoSubsector | int | no |  |  | PK |
| Descripcion | varchar(50) | no |  |  |  |

### TiposTarifa

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| idTipoTarifa | int | no | sí |  | PK |
| codigo | varchar(50) | no |  |  |  |
| TipoTarifa | varchar(100) | no |  |  |  |
| EsFarmacia | bit | sí |  |  |  |

### TiposTarifaCpt

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| idTipoTarifa | int | no |  |  |  |
| idProductoCpt | int | no |  |  |  |

Claves foráneas:

- `idTipoTarifa` → `dbo.TiposTarifa.idTipoTarifa` (FK_TiposTarifaCpt_TiposTarifa)

### TiposTransporte

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| idTipoTransporte | int | no |  |  | PK |
| Descripcion | varchar(50) | no |  |  |  |

### TiposViaje

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| idTipoViaje | int | no |  |  | PK |
| Descripcion | varchar(50) | no |  |  |  |

### TransporteReferencia

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| id_transporte_ref | int | sí |  |  |  |
| desc_Transporte_ref | varchar(100) | sí |  |  |  |
| desc_abrevia_ref | varchar(2) | sí |  |  |  |

### Transposicion

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| Id | int | no | sí |  | PK |
| OdontogramaId | int | no |  |  |  |
| Nro_Historia | nvarchar(50) | no |  |  |  |
| Diente_From | tinyint | no |  |  |  |
| Diente_To | tinyint | no |  |  |  |
| Color | nvarchar(30) | sí |  |  |  |
| Observaciones | nvarchar(500) | sí |  |  |  |
| Metadata | nvarchar(max) | sí |  |  |  |
| Fecha_Creacion | datetime2 | no |  | getdate() |  |
| Usuario_Creacion | nvarchar(100) | sí |  |  |  |
| Nro_Cuenta | int | sí |  |  |  |

Claves foráneas:

- `OdontogramaId` → `dbo.Odontograma.Id` (FK_Transposicion_Odontograma)

### TriajeEmergencia

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdTriajeEmergencia | int | no | sí |  |  |
| IdPaciente | int | sí |  |  |  |
| IdMotivoAtencionEmergencia | int | sí |  |  |  |
| IdMedicoTriaje | int | sí |  |  |  |
| IdMedicoTopico | int | sí |  |  |  |
| IdServicio | int | sí |  |  |  |
| Fecha | datetime | sí |  |  |  |
| EstadoReg | bit | sí |  |  |  |
| IdUsuario | int | sí |  |  |  |
| Estacion | nchar(50) | sí |  |  |  |
| FechaReg | datetime | sí |  |  |  |

### TriajeEmergenciaVariable

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdTriajeEmergenciaVariable | int | no | sí |  | PK |
| IdTriajeEmergencia | int | no |  |  |  |
| IdSignosVitales | int | no |  |  |  |
| Valor | nchar(50) | sí |  |  |  |
| EstadoReg | bit | sí |  |  |  |
| IdUsuario | int | sí |  |  |  |
| Estacion | nchar(50) | sí |  |  |  |
| FechaReg | datetime | sí |  |  |  |

Claves foráneas:

- `IdSignosVitales` → `dbo.TiposSignosVitales.IdSignosVitales` (FK_TriajeEmergenciaVariable_TiposSignosVitales)

### TurnoE

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| idturno | int | sí |  |  |  |
| idturnoE | int | sí |  |  |  |
| Turno | varchar(1) | sí |  |  |  |

### Turnos

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdTurno | int | no | sí |  | PK |
| Codigo | varchar(3) | no |  |  |  |
| Descripcion | varchar(50) | no |  |  |  |
| HoraInicio | char(5) | no |  |  |  |
| HoraFin | char(5) | no |  |  |  |
| IdTipoServicio | int | sí |  |  |  |
| IdEspecialidad | int | sí |  |  |  |
| IdTipoTurnoRef | int | sí |  |  |  |

Claves foráneas:

- `IdEspecialidad` → `dbo.Especialidades.IdEspecialidad` (Especialidades_Turnos_FK1)
- `IdTipoServicio` → `dbo.TiposServicio.IdTipoServicio` (TiposServicio_Turnos_FK1)

### UPServicios

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdUPS | int | no | sí |  | PK |
| descripcion | varchar(50) | no |  |  |  |
| estado | bit | no |  |  |  |
| UPShis | varchar(6) | sí |  |  |  |

### UPSRenaes

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdUps | int | no | sí |  | PK |
| UPS | nchar(6) | sí |  |  |  |
| Descripcion | varchar(255) | sí |  |  |  |
| IdEstado | int | sí |  |  |  |

### UPSTRAMA

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdServicio | int | sí |  |  |  |
| codigoServicioHIS | varchar(6) | sí |  |  |  |
| IdEspecialidad | int | sí |  |  |  |

### Usuario

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| id_usuario | int | no | sí |  | PK |
| nombre_completo | varchar(100) | no |  |  |  |
| dni | char(8) | no |  |  |  |
| contrasena | varchar(50) | no |  |  |  |
| apellido | varchar(100) | sí |  |  |  |
| usuario | varchar(50) | sí |  |  |  |
| rol | varchar(30) | sí |  |  |  |
| estado | varchar(20) | sí |  |  |  |

### usuario_estadistica

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| id_usuario_estadistica | int | no | sí |  | PK |
| idempleado | int | no |  |  |  |
| id_rol | int | no |  |  |  |
| es_activo | bit | no |  | (1) |  |
| fecha_asignacion | datetime | no |  | getdate() |  |
| idempleado_creador | int | sí |  |  |  |
| fecha_modificacion | datetime | sí |  |  |  |
| idempleado_modificador | int | sí |  |  |  |

Claves foráneas:

- `idempleado` → `dbo.Empleados.IdEmpleado` (FK_usuario_estadistica_empleado)
- `id_rol` → `dbo.rol_estadistica.id_rol` (FK_usuario_estadistica_rol)

### USUARIO_WEB

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| DNI | char(8) | no |  |  |  |
| NOMBRES | varchar(60) | sí |  |  |  |
| UNIDAD_ORGANICA | varchar(20) | sí |  |  |  |
| EMAIL | varchar(90) | sí |  |  |  |
| CARGO | varchar(60) | sí |  |  |  |
| FECHA_EXPIRACION | datetime | sí |  |  |  |
| USU_NOMBRE | varchar(50) | sí |  |  |  |
| USU_PATERNO | varchar(50) | sí |  |  |  |
| USU_MATERNO | varchar(50) | sí |  |  |  |
| FECH_ULT_INGRESO | datetime | sí |  |  |  |
| ESTADO | int | sí |  |  |  |
| CLAVE | varchar(30) | sí |  |  |  |
| SEXO | char(1) | sí |  |  |  |
| SESION | int | sí |  |  |  |
| FOTO | varchar(15) | sí |  |  |  |

### UsuariosDev

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| Usuario | varchar(250) | sí |  |  |  |
| ContraseñaHash | varchar(200) | sí |  |  |  |
| Rol | varchar(50) | sí |  |  |  |

### UsuariosRoles

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdUsuarioRol | int | no | sí |  | PK |
| IdRol | int | sí |  |  |  |
| IdEmpleado | int | sí |  |  |  |

Claves foráneas:

- `IdEmpleado` → `dbo.Empleados.IdEmpleado` (Empleados_UsuariosRoles_FK1)
- `IdRol` → `dbo.Roles.IdRol` (SeguridadGrupos_SeguridadUsuariosGrupos_FK1)

### Vacuna

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| id_vacuna | int | no | sí |  | PK |
| nombre_vacuna | varchar(100) | no |  |  |  |
| dosis | varchar(50) | no |  |  |  |
| fecha_aplicacion | date | no |  |  |  |
| fecha_proxima_dosis | date | sí |  |  |  |
| id_mascota | int | no |  |  |  |

Claves foráneas:

- `id_mascota` → `dbo.Mascota.id_mascota` (FK__Vacuna__id_masco__7C445393)

### ValorUIT

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| Unidad | varchar(3) | no |  |  | PK |
| Valor | money | sí |  |  |  |
| valorSoat | money | sí |  |  |  |

### visitas

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| id_visita | int | no | sí |  | PK |
| IdAtencion | int | no |  |  |  |
| nombre_visitante | varchar(100) | no |  |  |  |
| dni_visitante | char(8) | no |  |  |  |
| relacion | varchar(50) | no |  |  |  |
| fecha_entrada | datetime | no |  | getdate() |  |
| fecha_salida | datetime | sí |  |  |  |
| nro_de_visita | int | sí |  | (1) |  |

Claves foráneas:

- `IdAtencion` → `dbo.Atenciones.IdAtencion` (fk_visitas_atenciones)

### WebegresosNew

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| eg_cod2000 | varchar(10) | sí |  |  |  |
| eg_mes | int | sí |  |  |  |
| eg_anio | int | sí |  |  |  |
| eg_tipopac | varchar(2) | sí |  |  |  |
| eg_tdoc | int | sí |  |  |  |
| eg_dni | varchar(20) | sí |  |  |  |
| eg_regb | varchar(20) | sí |  |  |  |
| eg_etnia | varchar(10) | sí |  |  |  |
| eg_apep | varchar(50) | sí |  |  |  |
| eg_apem | varchar(50) | sí |  |  |  |
| eg_nom1 | varchar(50) | sí |  |  |  |
| eg_nom2 | varchar(50) | sí |  |  |  |
| eg_sexo | char(1) | sí |  |  |  |
| eg_edad | int | sí |  |  |  |
| eg_tedad | char(1) | sí |  |  |  |
| eg_edadn | int | sí |  |  |  |
| eg_ubigeo | varchar(10) | sí |  |  |  |
| eg_fechaingreso | date | sí |  |  |  |
| eg_fechaegreso | date | sí |  |  |  |
| eg_estancia | int | sí |  |  |  |
| eg_permanencia | int | sí |  |  |  |
| eg_servicio | varchar(10) | sí |  |  |  |
| eg_cdiag1 | varchar(10) | sí |  |  |  |
| eg_cdiag2 | varchar(10) | sí |  |  |  |
| eg_cdiag3 | varchar(10) | sí |  |  |  |
| eg_cdiag4 | varchar(10) | sí |  |  |  |
| eg_cdiag5 | varchar(10) | sí |  |  |  |
| eg_cdiag6 | varchar(10) | sí |  |  |  |
| eg_cmorb1 | varchar(10) | sí |  |  |  |
| eg_cmorb2 | varchar(10) | sí |  |  |  |
| eg_cproc1 | varchar(10) | sí |  |  |  |
| eg_cproc2 | varchar(10) | sí |  |  |  |
| eg_cproc3 | varchar(10) | sí |  |  |  |
| eg_cproc4 | varchar(10) | sí |  |  |  |
| eg_estadio | int | sí |  |  |  |
| eg_valort | varchar(10) | sí |  |  |  |
| eg_valorn | varchar(10) | sí |  |  |  |
| eg_valorm | varchar(10) | sí |  |  |  |
| eg_tratamiento | int | sí |  |  |  |
| eg_condicionegre | char(1) | sí |  |  |  |
| eg_referido | varchar(10) | sí |  |  |  |
| eg_rnvivos | int | sí |  |  |  |
| eg_rnmuertos | int | sí |  |  |  |
| eg_profparto | varchar(20) | sí |  |  |  |
| eg_fechaparto | date | sí |  |  |  |
| eg_medico | varchar(20) | sí |  |  |  |
| eg_medico_nombre | varchar(150) | sí |  |  |  |
| eg_usuario | varchar(20) | sí |  |  |  |
| eg_fechareg | date | sí |  |  |  |
| eg_estado | varchar(2) | sí |  |  |  |
| IdAtencion | int | sí |  |  |  |
| IdCuentaAtencion | int | no |  |  | PK |
| estadoreg | int | sí |  | (1) |  |
| mensaje_e | varchar(500) | sí |  |  |  |
| error | varchar(500) | sí |  |  |  |
| subsanado | bit | sí |  | (0) |  |
| eg_fechaaltaefectiva | date | sí |  |  |  |
| eg_horaaltaefectiva | varchar(8) | sí |  |  |  |
| eg_horaegreso | varchar(8) | sí |  |  |  |

### WebEmergenciaNew

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| em_cod2000 | varchar(10) | sí |  |  |  |
| em_fecha | date | sí |  |  |  |
| em_horate | time | sí |  |  |  |
| em_prioridad | int | sí |  |  |  |
| em_hiscli | varchar(20) | sí |  |  |  |
| em_doci | int | sí |  |  |  |
| em_ndoc | varchar(20) | sí |  |  |  |
| em_etnia | varchar(10) | sí |  |  |  |
| em_finan | varchar(2) | sí |  |  |  |
| em_sexo | char(1) | sí |  |  |  |
| em_edad | int | sí |  |  |  |
| em_tedad | char(1) | sí |  |  |  |
| em_apep | varchar(50) | sí |  |  |  |
| em_apem | varchar(50) | sí |  |  |  |
| em_nom1 | varchar(50) | sí |  |  |  |
| em_nom2 | varchar(50) | sí |  |  |  |
| em_direccion | varchar(100) | sí |  |  |  |
| em_residencia | varchar(10) | sí |  |  |  |
| em_procedencia | varchar(10) | sí |  |  |  |
| em_acompa | varchar(100) | sí |  |  |  |
| em_adoci | int | sí |  |  |  |
| em_andoci | varchar(20) | sí |  |  |  |
| em_frming | varchar(2) | sí |  |  |  |
| em_motaten | varchar(2) | sí |  |  |  |
| em_locurr | varchar(10) | sí |  |  |  |
| em_ups | varchar(10) | sí |  |  |  |
| em_oestd | varchar(2) | sí |  |  |  |
| em_tdiagp | char(1) | sí |  |  |  |
| em_diagp | varchar(10) | sí |  |  |  |
| em_tdiag1 | char(1) | sí |  |  |  |
| em_diag1 | varchar(10) | sí |  |  |  |
| em_tdiag2 | char(1) | sí |  |  |  |
| em_diag2 | varchar(10) | sí |  |  |  |
| em_tdiag3 | char(1) | sí |  |  |  |
| em_diag3 | varchar(10) | sí |  |  |  |
| em_cpt1 | varchar(10) | sí |  |  |  |
| em_cpt2 | varchar(10) | sí |  |  |  |
| em_cpt3 | varchar(10) | sí |  |  |  |
| em_cpt4 | varchar(10) | sí |  |  |  |
| em_consal | varchar(2) | sí |  |  |  |
| em_fcegre | date | sí |  |  |  |
| em_hregre | time | sí |  |  |  |
| em_destino | varchar(2) | sí |  |  |  |
| em_deessem | varchar(10) | sí |  |  |  |
| em_dups | varchar(10) | sí |  |  |  |
| em_codpsl | varchar(20) | sí |  |  |  |
| em_ocama | varchar(10) | sí |  |  |  |
| em_edadn | int | sí |  |  |  |
| em_cfm | char(1) | sí |  |  |  |
| em_tipo | varchar(2) | sí |  |  |  |
| em_reing | varchar(2) | sí |  |  |  |
| estadoreg | int | sí |  | (1) |  |
| mensaje_e | varchar(255) | sí |  |  |  |
| IdCuentaAtencion | int | no |  |  | PK |
| errorDigitacion | varchar(500) | sí |  |  |  |
| corregido | bit | sí |  | (0) |  |

### WebHisminsa

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| p_idcita | int | no |  |  | PK |
| p_idtipodoc | varchar(2) | sí |  |  |  |
| p_nrodocumento | varchar(14) | sí |  |  |  |
| p_apepaterno | varchar(50) | sí |  |  |  |
| p_apematerno | varchar(50) | sí |  |  |  |
| p_nombres | varchar(50) | sí |  |  |  |
| p_fechanacimiento | varchar(10) | sí |  |  |  |
| p_idsexo | varchar(2) | sí |  |  |  |
| p_idpais | varchar(3) | sí |  |  |  |
| p_idestablecimiento | varchar(10) | sí |  |  |  |
| p_idetnia | varchar(4) | sí |  |  |  |
| p_nrohistoriaclinica | varchar(20) | sí |  |  |  |
| p_idflag | varchar(2) | sí |  |  |  |
| pa_idtipodoc | varchar(2) | sí |  |  |  |
| pa_nrodocumento | varchar(14) | sí |  |  |  |
| pa_apepaterno | varchar(50) | sí |  |  |  |
| pa_apematerno | varchar(50) | sí |  |  |  |
| pa_nombres | varchar(50) | sí |  |  |  |
| pa_fechanacimiento | varchar(10) | sí |  |  |  |
| pa_idsexo | varchar(2) | sí |  |  |  |
| pa_idpais | varchar(3) | sí |  |  |  |
| pa_idestablecimiento | varchar(10) | sí |  |  |  |
| pa_idcondicion | varchar(2) | sí |  |  |  |
| pa_idprofesion | varchar(4) | sí |  |  |  |
| pr_idtipodoc | varchar(2) | sí |  |  |  |
| pr_nrodocumento | varchar(14) | sí |  |  |  |
| pr_apepaterno | varchar(50) | sí |  |  |  |
| pr_apematerno | varchar(50) | sí |  |  |  |
| pr_nombres | varchar(50) | sí |  |  |  |
| pr_fechanacimiento | varchar(10) | sí |  |  |  |
| pr_idsexo | varchar(2) | sí |  |  |  |
| pr_idpais | varchar(3) | sí |  |  |  |
| pr_idestablecimiento | varchar(10) | sí |  |  |  |
| pr_idcondicion | varchar(2) | sí |  |  |  |
| pr_idprofesion | varchar(4) | sí |  |  |  |
| numeroafiliacion | varchar(50) | sí |  |  |  |
| fechaatencion | varchar(10) | sí |  |  |  |
| estadoregistro | varchar(2) | sí |  |  |  |
| idups | varchar(10) | sí |  |  |  |
| idestablecimiento | varchar(10) | sí |  |  |  |
| diaedad | varchar(10) | sí |  |  |  |
| edadregistro | varchar(10) | sí |  |  |  |
| idturno | varchar(2) | sí |  |  |  |
| idtipedadregistro | varchar(10) | sí |  |  |  |
| fgdiag | varchar(2) | sí |  |  |  |
| mesedad | varchar(2) | sí |  |  |  |
| componente | varchar(10) | sí |  |  |  |
| idfinanciador | varchar(2) | sí |  |  |  |
| idtipocondestab | varchar(2) | sí |  |  |  |
| idtipocondserv | varchar(2) | sí |  |  |  |
| annioedad | varchar(4) | sí |  |  |  |
| peso | varchar(10) | sí |  |  |  |
| talla | varchar(10) | sí |  |  |  |
| hemoglobina | varchar(10) | sí |  |  |  |
| perimetrocefalico | varchar(10) | sí |  |  |  |
| perimetroabdominal | varchar(10) | sí |  |  |  |
| fechaRegistro | datetime | sí |  |  |  |
| rspt_estado | varchar(3) | sí |  |  |  |
| cod_consul | varchar(4) | sí |  |  |  |
| des_consul | varchar(60) | sí |  |  |  |
| tipodato | varchar(13) | sí |  | 'Hisminsa' |  |
| estadoreg | int | sí |  |  |  |
| mensaje_e | varchar(max) | sí |  |  |  |
| idcondicionmaterna | varchar(1) | sí |  |  |  |
| idatencion | int | no |  |  | PK |
| idcitahis | varchar(20) | sí |  |  |  |

### WebHisminsaNew

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| idSecuencial | int | no |  |  | PK |
| p_idtipodoc | varchar(2) | sí |  |  |  |
| p_nrodocumento | varchar(14) | sí |  |  |  |
| p_apepaterno | varchar(50) | sí |  |  |  |
| p_apematerno | varchar(50) | sí |  |  |  |
| p_nombres | varchar(50) | sí |  |  |  |
| p_fechanacimiento | varchar(10) | sí |  |  |  |
| p_idsexo | varchar(2) | sí |  |  |  |
| p_idpais | varchar(3) | sí |  |  |  |
| p_idestablecimiento | varchar(10) | sí |  |  |  |
| p_idetnia | varchar(4) | sí |  |  |  |
| p_nrohistoriaclinica | varchar(20) | sí |  |  |  |
| p_idflag | varchar(2) | sí |  |  |  |
| pa_idtipodoc | varchar(2) | sí |  |  |  |
| pa_nrodocumento | varchar(14) | sí |  |  |  |
| pa_apepaterno | varchar(50) | sí |  |  |  |
| pa_apematerno | varchar(50) | sí |  |  |  |
| pa_nombres | varchar(50) | sí |  |  |  |
| pa_fechanacimiento | varchar(10) | sí |  |  |  |
| pa_idsexo | varchar(2) | sí |  |  |  |
| pa_idpais | varchar(3) | sí |  |  |  |
| pa_idestablecimiento | varchar(10) | sí |  |  |  |
| pa_idcondicion | varchar(2) | sí |  |  |  |
| pa_idprofesion | varchar(4) | sí |  |  |  |
| pr_idtipodoc | varchar(2) | sí |  |  |  |
| pr_nrodocumento | varchar(14) | sí |  |  |  |
| pr_apepaterno | varchar(50) | sí |  |  |  |
| pr_apematerno | varchar(50) | sí |  |  |  |
| pr_nombres | varchar(50) | sí |  |  |  |
| pr_fechanacimiento | varchar(10) | sí |  |  |  |
| pr_idsexo | varchar(2) | sí |  |  |  |
| pr_idpais | varchar(3) | sí |  |  |  |
| pr_idestablecimiento | varchar(10) | sí |  |  |  |
| pr_idcondicion | varchar(2) | sí |  |  |  |
| pr_idprofesion | varchar(4) | sí |  |  |  |
| numeroafiliacion | varchar(50) | sí |  |  |  |
| fechaatencion | varchar(10) | sí |  |  |  |
| estadoregistro | varchar(2) | sí |  |  |  |
| idups | varchar(10) | sí |  |  |  |
| idestablecimiento | varchar(10) | sí |  |  |  |
| diaedad | varchar(10) | sí |  |  |  |
| edadregistro | varchar(10) | sí |  |  |  |
| idturno | varchar(2) | sí |  |  |  |
| idtipedadregistro | varchar(10) | sí |  |  |  |
| fgdiag | varchar(2) | sí |  |  |  |
| mesedad | varchar(2) | sí |  |  |  |
| componente | varchar(10) | sí |  |  |  |
| idfinanciador | varchar(2) | sí |  |  |  |
| idtipocondestab | varchar(2) | sí |  |  |  |
| idtipocondserv | varchar(2) | sí |  |  |  |
| annioedad | varchar(4) | sí |  |  |  |
| peso | varchar(10) | sí |  |  |  |
| talla | varchar(10) | sí |  |  |  |
| hemoglobina | varchar(10) | sí |  |  |  |
| perimetrocefalico | varchar(10) | sí |  |  |  |
| perimetroabdominal | varchar(10) | sí |  |  |  |
| fechaRegistro | datetime | sí |  |  |  |
| rspt_estado | varchar(3) | sí |  |  |  |
| cod_consul | varchar(4) | sí |  |  |  |
| des_consul | varchar(60) | sí |  |  |  |
| tipodato | varchar(13) | sí |  | 'Hisminsa' |  |
| estadoreg | int | sí |  |  |  |
| mensaje_e | varchar(max) | sí |  |  |  |
| idcondicionmaterna | varchar(1) | sí |  |  |  |
| idatencion | int | no |  |  | PK |
| idcitahis | varchar(20) | sí |  |  |  |
| idEntidad | int | sí |  |  |  |
| fecEnvio | varchar(8) | sí |  |  |  |
| tipoEnvio | int | sí |  |  |  |
| accion | int | sí |  |  |  |
| estado | int | sí |  |  |  |
| idcita | varchar(20) | sí |  |  |  |
| pesoPregestacional | decimal(5,2) | sí |  |  |  |
| erroresminsa | varchar(max) | sí |  |  |  |
| subsanado | bit | sí |  | (0) |  |
| corregido | bit | sí |  | (0) |  |
| errorDigitacion | varchar(500) | sí |  |  |  |
| errorescondicion | varchar(max) | sí |  |  |  |
| subsanadocondicion | int | sí |  | (0) |  |
| target_eess | varchar(10) | sí |  |  |  |
| target_serv | varchar(10) | sí |  |  |  |

### WebHisminsaNew_backup_20260828_134848

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| idSecuencial | int | no |  |  |  |
| p_idtipodoc | varchar(2) | sí |  |  |  |
| p_nrodocumento | varchar(14) | sí |  |  |  |
| p_apepaterno | varchar(50) | sí |  |  |  |
| p_apematerno | varchar(50) | sí |  |  |  |
| p_nombres | varchar(50) | sí |  |  |  |
| p_fechanacimiento | varchar(10) | sí |  |  |  |
| p_idsexo | varchar(2) | sí |  |  |  |
| p_idpais | varchar(3) | sí |  |  |  |
| p_idestablecimiento | varchar(10) | sí |  |  |  |
| p_idetnia | varchar(4) | sí |  |  |  |
| p_nrohistoriaclinica | varchar(20) | sí |  |  |  |
| p_idflag | varchar(2) | sí |  |  |  |
| pa_idtipodoc | varchar(2) | sí |  |  |  |
| pa_nrodocumento | varchar(14) | sí |  |  |  |
| pa_apepaterno | varchar(50) | sí |  |  |  |
| pa_apematerno | varchar(50) | sí |  |  |  |
| pa_nombres | varchar(50) | sí |  |  |  |
| pa_fechanacimiento | varchar(10) | sí |  |  |  |
| pa_idsexo | varchar(2) | sí |  |  |  |
| pa_idpais | varchar(3) | sí |  |  |  |
| pa_idestablecimiento | varchar(10) | sí |  |  |  |
| pa_idcondicion | varchar(2) | sí |  |  |  |
| pa_idprofesion | varchar(4) | sí |  |  |  |
| pr_idtipodoc | varchar(2) | sí |  |  |  |
| pr_nrodocumento | varchar(14) | sí |  |  |  |
| pr_apepaterno | varchar(50) | sí |  |  |  |
| pr_apematerno | varchar(50) | sí |  |  |  |
| pr_nombres | varchar(50) | sí |  |  |  |
| pr_fechanacimiento | varchar(10) | sí |  |  |  |
| pr_idsexo | varchar(2) | sí |  |  |  |
| pr_idpais | varchar(3) | sí |  |  |  |
| pr_idestablecimiento | varchar(10) | sí |  |  |  |
| pr_idcondicion | varchar(2) | sí |  |  |  |
| pr_idprofesion | varchar(4) | sí |  |  |  |
| numeroafiliacion | varchar(50) | sí |  |  |  |
| fechaatencion | varchar(10) | sí |  |  |  |
| estadoregistro | varchar(2) | sí |  |  |  |
| idups | varchar(10) | sí |  |  |  |
| idestablecimiento | varchar(10) | sí |  |  |  |
| diaedad | varchar(10) | sí |  |  |  |
| edadregistro | varchar(10) | sí |  |  |  |
| idturno | varchar(2) | sí |  |  |  |
| idtipedadregistro | varchar(10) | sí |  |  |  |
| fgdiag | varchar(2) | sí |  |  |  |
| mesedad | varchar(2) | sí |  |  |  |
| componente | varchar(10) | sí |  |  |  |
| idfinanciador | varchar(2) | sí |  |  |  |
| idtipocondestab | varchar(2) | sí |  |  |  |
| idtipocondserv | varchar(2) | sí |  |  |  |
| annioedad | varchar(4) | sí |  |  |  |
| peso | varchar(10) | sí |  |  |  |
| talla | varchar(10) | sí |  |  |  |
| hemoglobina | varchar(10) | sí |  |  |  |
| perimetrocefalico | varchar(10) | sí |  |  |  |
| perimetroabdominal | varchar(10) | sí |  |  |  |
| fechaRegistro | datetime | sí |  |  |  |
| rspt_estado | varchar(3) | sí |  |  |  |
| cod_consul | varchar(4) | sí |  |  |  |
| des_consul | varchar(60) | sí |  |  |  |
| tipodato | varchar(13) | sí |  |  |  |
| estadoreg | int | sí |  |  |  |
| mensaje_e | varchar(max) | sí |  |  |  |
| idcondicionmaterna | varchar(1) | sí |  |  |  |
| idatencion | int | no |  |  |  |
| idcitahis | varchar(20) | sí |  |  |  |
| idEntidad | int | sí |  |  |  |
| fecEnvio | varchar(8) | sí |  |  |  |
| tipoEnvio | int | sí |  |  |  |
| accion | int | sí |  |  |  |
| estado | int | sí |  |  |  |
| idcita | varchar(20) | sí |  |  |  |
| pesoPregestacional | decimal(5,2) | sí |  |  |  |
| erroresminsa | varchar(max) | sí |  |  |  |
| subsanado | bit | sí |  |  |  |
| corregido | bit | sí |  |  |  |
| errorDigitacion | varchar(500) | sí |  |  |  |
| errorescondicion | varchar(max) | sí |  |  |  |
| subsanadocondicion | int | sí |  |  |  |
| target_eess | varchar(10) | sí |  |  |  |
| target_serv | varchar(10) | sí |  |  |  |

### WebHisminsaNew_Duplicates_Audit

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| idSecuencial | int | no |  |  |  |
| p_idtipodoc | varchar(2) | sí |  |  |  |
| p_nrodocumento | varchar(14) | sí |  |  |  |
| p_apepaterno | varchar(50) | sí |  |  |  |
| p_apematerno | varchar(50) | sí |  |  |  |
| p_nombres | varchar(50) | sí |  |  |  |
| p_fechanacimiento | varchar(10) | sí |  |  |  |
| p_idsexo | varchar(2) | sí |  |  |  |
| p_idpais | varchar(3) | sí |  |  |  |
| p_idestablecimiento | varchar(10) | sí |  |  |  |
| p_idetnia | varchar(4) | sí |  |  |  |
| p_nrohistoriaclinica | varchar(20) | sí |  |  |  |
| p_idflag | varchar(2) | sí |  |  |  |
| pa_idtipodoc | varchar(2) | sí |  |  |  |
| pa_nrodocumento | varchar(14) | sí |  |  |  |
| pa_apepaterno | varchar(50) | sí |  |  |  |
| pa_apematerno | varchar(50) | sí |  |  |  |
| pa_nombres | varchar(50) | sí |  |  |  |
| pa_fechanacimiento | varchar(10) | sí |  |  |  |
| pa_idsexo | varchar(2) | sí |  |  |  |
| pa_idpais | varchar(3) | sí |  |  |  |
| pa_idestablecimiento | varchar(10) | sí |  |  |  |
| pa_idcondicion | varchar(2) | sí |  |  |  |
| pa_idprofesion | varchar(4) | sí |  |  |  |
| pr_idtipodoc | varchar(2) | sí |  |  |  |
| pr_nrodocumento | varchar(14) | sí |  |  |  |
| pr_apepaterno | varchar(50) | sí |  |  |  |
| pr_apematerno | varchar(50) | sí |  |  |  |
| pr_nombres | varchar(50) | sí |  |  |  |
| pr_fechanacimiento | varchar(10) | sí |  |  |  |
| pr_idsexo | varchar(2) | sí |  |  |  |
| pr_idpais | varchar(3) | sí |  |  |  |
| pr_idestablecimiento | varchar(10) | sí |  |  |  |
| pr_idcondicion | varchar(2) | sí |  |  |  |
| pr_idprofesion | varchar(4) | sí |  |  |  |
| numeroafiliacion | varchar(50) | sí |  |  |  |
| fechaatencion | varchar(10) | sí |  |  |  |
| estadoregistro | varchar(2) | sí |  |  |  |
| idups | varchar(10) | sí |  |  |  |
| idestablecimiento | varchar(10) | sí |  |  |  |
| diaedad | varchar(10) | sí |  |  |  |
| edadregistro | varchar(10) | sí |  |  |  |
| idturno | varchar(2) | sí |  |  |  |
| idtipedadregistro | varchar(10) | sí |  |  |  |
| fgdiag | varchar(2) | sí |  |  |  |
| mesedad | varchar(2) | sí |  |  |  |
| componente | varchar(10) | sí |  |  |  |
| idfinanciador | varchar(2) | sí |  |  |  |
| idtipocondestab | varchar(2) | sí |  |  |  |
| idtipocondserv | varchar(2) | sí |  |  |  |
| annioedad | varchar(4) | sí |  |  |  |
| peso | varchar(10) | sí |  |  |  |
| talla | varchar(10) | sí |  |  |  |
| hemoglobina | varchar(10) | sí |  |  |  |
| perimetrocefalico | varchar(10) | sí |  |  |  |
| perimetroabdominal | varchar(10) | sí |  |  |  |
| fechaRegistro | datetime | sí |  |  |  |
| rspt_estado | varchar(3) | sí |  |  |  |
| cod_consul | varchar(4) | sí |  |  |  |
| des_consul | varchar(60) | sí |  |  |  |
| tipodato | varchar(13) | sí |  |  |  |
| estadoreg | int | sí |  |  |  |
| mensaje_e | varchar(max) | sí |  |  |  |
| idcondicionmaterna | varchar(1) | sí |  |  |  |
| idatencion | int | no |  |  |  |
| idcitahis | varchar(20) | sí |  |  |  |
| idEntidad | int | sí |  |  |  |
| fecEnvio | varchar(8) | sí |  |  |  |
| tipoEnvio | int | sí |  |  |  |
| accion | int | sí |  |  |  |
| estado | int | sí |  |  |  |
| idcita | varchar(20) | sí |  |  |  |
| pesoPregestacional | decimal(5,2) | sí |  |  |  |
| erroresminsa | varchar(max) | sí |  |  |  |
| subsanado | bit | sí |  |  |  |
| corregido | bit | sí |  |  |  |
| errorDigitacion | varchar(500) | sí |  |  |  |
| errorescondicion | varchar(max) | sí |  |  |  |
| subsanadocondicion | int | sí |  |  |  |
| target_eess | varchar(10) | sí |  |  |  |
| target_serv | varchar(10) | sí |  |  |  |
| audit_ts | datetime | no |  |  |  |

### x_total

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdCuentaAtencion | int | no |  |  |  |
| paciente | varchar(203) | sí |  |  |  |
| documento | varchar(12) | sí |  |  |  |
| total_deuda | decimal(10,2) | sí |  |  |  |
| saldo | decimal(10,2) | sí |  |  |  |

### Atencioness (vista)

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdAtencion | int | no | sí |  |  |
| IdPaciente | int | no |  |  |  |
| Edad | int | no |  |  |  |
| FechaIngreso | datetime | no |  |  |  |
| HoraIngreso | char(5) | no |  |  |  |
| IdDestinoAtencion | int | sí |  |  |  |
| IdTipoCondicionAlServicio | int | sí |  |  |  |
| IdTipoCondicionALEstab | int | sí |  |  |  |
| IdServicioIngreso | int | no |  |  |  |
| IdMedicoIngreso | int | no |  |  |  |
| IdEspecialidadMedico | int | sí |  |  |  |
| IdMedicoEgreso | int | sí |  |  |  |
| FechaEgreso | datetime | sí |  |  |  |
| HoraEgreso | char(5) | sí |  |  |  |
| IdOrigenAtencion | int | sí |  |  |  |
| FechaEgresoAdministrativo | datetime | sí |  |  |  |
| HoraEgresoAdministrativo | char(5) | sí |  |  |  |
| IdCondicionAlta | int | sí |  |  |  |
| IdTipoAlta | int | sí |  |  |  |
| IdServicioEgreso | int | sí |  |  |  |
| IdCamaIngreso | int | sí |  |  |  |
| IdCamaEgreso | int | sí |  |  |  |
| IdTipoGravedad | int | sí |  |  |  |
| IdTipoEdad | int | sí |  |  |  |
| IdCuentaAtencion | int | no |  |  |  |
| IdTipoServicio | int | sí |  |  |  |
| IdFormaPago | int | sí |  |  |  |
| idFuenteFinanciamiento | int | sí |  |  |  |
| idEstadoAtencion | int | sí |  |  |  |
| EsPacienteExterno | bit | sí |  |  |  |
| idSunasaPacienteHistorico | int | sí |  |  |  |
| FyHInicioI | datetime | sí |  |  |  |
| FyHFinal | datetime | sí |  |  |  |
| idCondicionMaterna | int | sí |  |  |  |
| idCartaGarantia | int | sí |  |  |  |

### citas_dia (vista)

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| NroDocumento | varchar(12) | sí |  |  |  |
| Paciente | varchar(122) | sí |  |  |  |
| FuenteFinanciamiento | varchar(50) | no |  |  |  |
| Estado | varchar(50) | no |  |  |  |
| fechasolicitud | datetime | no |  |  |  |
| FechaCita | datetime | no |  |  |  |
| HORAINICIO | char(5) | no |  |  |  |
| DEPARTAMENTO | varchar(50) | no |  |  |  |
| ESPECIALIDAD | varchar(50) | no |  |  |  |
| Servicio | varchar(50) | no |  |  |  |
| USUARIO | varchar(152) | no |  |  |  |

### Empleadoss (vista)

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdEmpleado | int | no | sí |  |  |
| ApellidoPaterno | varchar(50) | no |  |  |  |
| ApellidoMaterno | varchar(50) | no |  |  |  |
| Nombres | varchar(50) | no |  |  |  |
| IdCondicionTrabajo | int | no |  |  |  |
| IdTipoEmpleado | int | no |  |  |  |
| DNI | char(20) | no |  |  |  |
| CodigoPlanilla | varchar(8) | no |  |  |  |
| FechaIngreso | datetime | sí |  |  |  |
| FechaAlta | datetime | sí |  |  |  |
| Usuario | varchar(20) | sí |  |  |  |
| Clave | varchar(200) | sí |  |  |  |
| loginEstado | int | sí |  |  |  |
| loginPC | varchar(50) | sí |  |  |  |
| FechaNacimiento | datetime | sí |  |  |  |
| idTipoDestacado | int | sí |  |  |  |
| IdEstablecimientoExterno | int | sí |  |  |  |
| HisCodigoDigitador | varchar(20) | sí |  |  |  |
| ReniecAutorizado | bit | sí |  |  |  |
| idTipoDocumento | int | sí |  |  |  |
| idSupervisor | int | sí |  |  |  |
| esActivo | bit | sí |  |  |  |
| AccedeVWeb | bit | sí |  |  |  |
| ClaveVWeb | varchar(150) | sí |  |  |  |
| Ris_estado | nchar(10) | sí |  |  |  |
| telefono | varchar(15) | sí |  |  |  |
| correo | varchar(100) | sí |  |  |  |
| Interconsultas | int | sí |  |  |  |
| esAuditor | int | sí |  |  |  |
| sexo | int | sí |  |  |  |
| pais | int | sí |  |  |  |
| AccesoCE | int | sí |  |  |  |
| idArea | int | sí |  |  |  |
| idSexo | int | sí |  |  |  |

### MINSA_VCITAPROGRAMADA (vista)

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| FECHA | varchar(10) | sí |  |  |  |
| HORA | varchar(5) | sí |  |  |  |
| HORARIO | varchar(5) | sí |  |  |  |
| CODMED | int | sí |  |  |  |
| NOMMED | varchar(152) | sí |  |  |  |
| PACIENTE | varchar(62) | sí |  |  |  |
| CODCON | int | no |  |  |  |
| DESCON | varchar(50) | no |  |  |  |
| SERCOD | int | no |  |  |  |
| SERDES | varchar(50) | no |  |  |  |
| UPS | varchar(6) | sí |  |  |  |
| DES_UPS | varchar(50) | no |  |  |  |
| PACHIS | int | sí |  |  |  |
| TIDCOD | int | sí |  |  |  |
| PACDOC | varchar(12) | sí |  |  |  |
| TIDDES | varchar(50) | sí |  |  |  |
| FLAG_EST | varchar(1) | no |  |  |  |
| CODCITA | int | sí |  |  |  |
| NUMPRE | int | sí |  |  |  |
| TURNO | varchar(1) | no |  |  |  |

### MINSA_vPaciente (vista)

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| PACHIS | int | sí |  |  |  |
| apepat | varchar(40) | sí |  |  |  |
| apemat | varchar(40) | sí |  |  |  |
| nompac | varchar(81) | sí |  |  |  |
| prinom | varchar(40) | sí |  |  |  |
| segnom | varchar(40) | sí |  |  |  |
| tipdoc | int | sí |  |  |  |
| destipdoc | varchar(50) | sí |  |  |  |
| docpac | varchar(12) | sí |  |  |  |
| fecha_nac | varchar(10) | sí |  |  |  |
| FechaNacimiento | datetime | sí |  |  |  |
| IdTipoSexo | int | sí |  |  |  |
| IdPaciente | int | no |  |  |  |

### MINSA_VPROGRAMACION (vista)

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| MEDCOD | int | no |  |  |  |
| MEDNOM | varchar(152) | sí |  |  |  |
| TURRAT | int | sí |  |  |  |
| PERIODO | varchar(6) | sí |  |  |  |
| FECHA | varchar(10) | sí |  |  |  |
| HORA | char(5) | no |  |  |  |
| HORINI | char(5) | no |  |  |  |
| HORFIN | char(5) | no |  |  |  |
| CODCON | int | no |  |  |  |
| DESCON | varchar(50) | no |  |  |  |
| SERCOD | int | no |  |  |  |
| DESSER | varchar(50) | no |  |  |  |
| UPS | varchar(6) | sí |  |  |  |
| DESUPS | varchar(50) | no |  |  |  |
| TURNO | varchar(1) | no |  |  |  |
| CUPOS | int | sí |  |  |  |
| soloTipoSexo | int | sí |  |  |  |
| maximaEdad | int | sí |  |  |  |
| MinimaEdad | int | sí |  |  |  |

### minsa_vTipoDocumento (vista)

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| tidcod | int | no |  |  |  |
| tiddes | varchar(50) | no |  |  |  |

### pac (vista)

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdPaciente | int | no | sí |  |  |
| empleado | varchar(122) | sí |  |  |  |

### Paciente_atendidos (vista)

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| NroDocumento | varchar(12) | sí |  |  |  |
| NroHistoriaClinica | int | sí |  |  |  |
| Nombre_Paciente | varchar(122) | sí |  |  |  |
| Edad | int | no |  |  |  |
| Descripcion | varchar(10) | no |  |  |  |
| FechaIngreso | datetime | no |  |  |  |
| FechaEgreso | datetime | sí |  |  |  |
| servicio | varchar(50) | no |  |  |  |
| CodigoCIE10 | char(10) | sí |  |  |  |
| Codigo | varchar(5) | no |  |  |  |
| Nombre | varchar(50) | no |  |  |  |
| Nombre_Medico | varchar(152) | no |  |  |  |

### paciente_cita (vista)

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| IdCuentaAtencion | int | no |  |  |  |
| DNI | varchar(12) | sí |  |  |  |
| HISTORIA_CLINICA | int | sí |  |  |  |
| Nombre_Paciente | varchar(122) | sí |  |  |  |
| CELULAR | varchar(10) | sí |  |  |  |
| FECHA_CITA | datetime | no |  |  |  |
| HORA_CITA | char(5) | no |  |  |  |
| FINANCIAMIENTO | varchar(50) | no |  |  |  |
| CONSULTORIO | varchar(50) | sí |  |  |  |
| Nombre_Medico | varchar(152) | no |  |  |  |
| NroReferenciaOrigen | varchar(20) | sí |  |  |  |
| ADMISIONISTA | varchar(152) | no |  |  |  |

### po (vista)

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| idOrdenPago | int | no |  |  |  |
| Descripcion | varchar(20) | no |  |  |  |
| FechaCobranza | datetime | sí |  |  |  |
| IdCajero | int | sí |  |  |  |
| idCaja | int | sí |  |  |  |
| Boleta | varchar(11) | sí |  |  |  |
| NroHistoriaClinica | int | sí |  |  |  |
| IdCuentaAtencion | int | sí |  |  |  |
| IdPaciente | int | sí |  |  |  |
| RazonSocial | varchar(50) | sí |  |  |  |
| idProducto | int | no |  |  |  |
| Codigo | varchar(20) | no |  |  |  |
| NombreProducto | varchar(255) | no |  |  |  |
| total | money | sí |  |  |  |
| Exoneraciones | money | sí |  |  |  |
| Adelantos | money | sí |  |  |  |
| Anulado | money | sí |  |  |  |
| totalPorPagar | money | sí |  |  |  |

### vw_Exoneraciones (vista)

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| Fecha | datetime | no |  |  |  |
| Empleado que exonera | varchar(152) | sí |  |  |  |
| Cajero | varchar(152) | sí |  |  |  |
| RazonSocial | varchar(50) | sí |  |  |  |
| Boleta | varchar(13) | sí |  |  |  |
| IdCuentaAtencion | int | sí |  |  |  |
| ImporteExonerado | money | no |  |  |  |
| Financiamiento | varchar(50) | sí |  |  |  |
| tipoServicio | varchar(50) | sí |  |  |  |
| Nombre | varchar(50) | sí |  |  |  |

### vw_Farmacia_Alerta200 (vista)

Esquema: `dbo`

| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |
|---|---|---|---|---|---|
| idCuentaAtencion | int | no |  |  |  |
| PACIENTE | varchar(204) | no |  |  |  |
| FormaFarmaceutica | varchar(10) | sí |  |  |  |
| Codigo | varchar(7) | sí |  |  |  |
| idProducto | int | no |  |  |  |
| Nombre | varchar(300) | sí |  |  |  |
| cantidad | int | sí |  |  |  |
| precio | money | no |  |  |  |
| Total | money | sí |  |  |  |
| fechaCreacion | datetime | sí |  |  |  |
| dfinanciamiento | varchar(50) | sí |  |  |  |
| PUNTO_CARGA | varchar(8) | no |  |  |  |
| alerta | int | sí |  |  |  |
| rn | bigint | sí |  |  |  |
